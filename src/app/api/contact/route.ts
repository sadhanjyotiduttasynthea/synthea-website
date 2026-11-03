import { NextResponse, type NextRequest } from "next/server";
import {
  attachmentRules,
  budgetOptions,
  contactSchema,
  labelFor,
  projectCategories,
  timelineOptions,
  type ContactResponse,
} from "@/lib/contact-schema";
import { EmailNotConfiguredError, escapeHtml, isEmailConfigured, sendEmail, type OutgoingAttachment } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";

const MIN_FILL_TIME_MS = 3_000;
const MAX_BODY_BYTES = attachmentRules.maxBytes + 512 * 1024;

function json(body: ContactResponse, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Reject submissions posted from other origins (basic CSRF protection). */
function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // some privacy tools strip Origin; other checks still apply
  try {
    const originHost = new URL(origin).host;
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return originHost === host || origin === site.url;
  } catch {
    return false;
  }
}

/** Check well-known file signatures for formats that have one. */
function signatureMatches(ext: string, bytes: Uint8Array) {
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  switch (ext) {
    case ".pdf":
      return starts(0x25, 0x50, 0x44, 0x46);
    case ".png":
      return starts(0x89, 0x50, 0x4e, 0x47);
    case ".jpg":
    case ".jpeg":
      return starts(0xff, 0xd8, 0xff);
    case ".zip":
    case ".docx":
    case ".xlsx":
      return starts(0x50, 0x4b);
    default:
      return true; // STEP / STL / DXF have no reliable magic number
  }
}

function safeFilename(name: string) {
  const cleaned = name.normalize("NFKD").replace(/[^\w.\- ]+/g, "_").slice(-120);
  return cleaned || "attachment";
}

function str(v: FormDataEntryValue | null) {
  return typeof v === "string" ? v : undefined;
}

/** Runtime form configuration (read on the client so env changes apply without a rebuild). */
export async function GET() {
  return NextResponse.json(
    { attachmentsEnabled: process.env.CONTACT_ATTACHMENTS_ENABLED === "true", configured: isEmailConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return json({ ok: false, message: "This request could not be verified." }, 403);
  }

  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return json({ ok: false, message: "The submission is too large. Attachments are limited to 8 MB." }, 413);
  }

  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return json(
      { ok: false, message: "Too many submissions. Please wait a few minutes before trying again." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, message: "The form data could not be read. Please try again." }, 400);
  }

  // --- Spam protection -----------------------------------------------------
  // 1. Honeypot: a visually hidden field humans never fill in.
  // 2. Minimum fill time: bots usually submit instantly.
  // Both silently pretend success so bots do not learn what triggered them,
  // but nothing is sent.
  const honeypot = str(form.get("website"));
  const startedAt = Number(str(form.get("startedAt")) ?? 0);
  if (honeypot || !startedAt || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return json({ ok: true, message: "Thank you. Your message has been received." }, 200);
  }

  // --- Validation ------------------------------------------------------------
  const parsed = contactSchema.safeParse({
    fullName: str(form.get("fullName")),
    email: str(form.get("email")),
    company: str(form.get("company")),
    phone: str(form.get("phone")),
    category: str(form.get("category")),
    budget: str(form.get("budget")),
    timeline: str(form.get("timeline")),
    message: str(form.get("message")),
    consent: str(form.get("consent")) === "true",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, message: "Please correct the highlighted fields.", fieldErrors }, 422);
  }
  const data = parsed.data;

  // --- Attachment (optional, only when enabled) -----------------------------
  const attachments: OutgoingAttachment[] = [];
  const file = form.get("attachment");
  if (file instanceof File && file.size > 0) {
    if (process.env.CONTACT_ATTACHMENTS_ENABLED !== "true") {
      return json({ ok: false, message: "File attachments are not enabled.", fieldErrors: { attachment: "Attachments are not enabled." } }, 422);
    }
    const ext = (file.name.match(/\.[^.]+$/)?.[0] ?? "").toLowerCase();
    if (!(attachmentRules.extensions as readonly string[]).includes(ext)) {
      return json(
        { ok: false, message: "Unsupported file type.", fieldErrors: { attachment: "This file type is not supported." } },
        422,
      );
    }
    if (file.size > attachmentRules.maxBytes) {
      return json(
        { ok: false, message: "The attachment is too large.", fieldErrors: { attachment: "Files are limited to 8 MB." } },
        422,
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!signatureMatches(ext, buffer.subarray(0, 8))) {
      return json(
        { ok: false, message: "The attachment could not be verified.", fieldErrors: { attachment: "The file content does not match its type." } },
        422,
      );
    }
    // The file is held in memory only and forwarded by email — never written to disk.
    attachments.push({ filename: safeFilename(file.name), content: buffer, contentType: file.type || "application/octet-stream" });
  }

  if (!isEmailConfigured()) {
    console.error("[contact] Email provider not configured — inquiry could not be delivered.");
    return json(
      {
        ok: false,
        message: `Our contact form is temporarily unavailable. Please email us directly at ${site.email}.`,
      },
      503,
    );
  }

  // --- Compose ---------------------------------------------------------------
  const rows: [string, string][] = [
    ["Name", data.fullName],
    ["Email", data.email],
    ["Company", data.company || "—"],
    ["Phone", data.phone || "—"],
    ["Category", labelFor(projectCategories, data.category)],
    ["Budget", data.budget ? labelFor(budgetOptions, data.budget) : "—"],
    ["Timeline", data.timeline ? labelFor(timelineOptions, data.timeline) : "—"],
    ["Attachment", attachments[0]?.filename ?? "—"],
    ["Consent", "Given via website form"],
    ["Received", new Date().toISOString()],
  ];

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nProject description:\n${data.message}\n`;
  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#111">
<h2 style="margin:0 0 16px">New project inquiry — ${escapeHtml(site.brand)}</h2>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="color:#6B7280;border-bottom:1px solid #E5E7EB">${escapeHtml(k)}</td><td style="border-bottom:1px solid #E5E7EB">${escapeHtml(v)}</td></tr>`,
  )
  .join("\n")}
</table>
<h3 style="margin:24px 0 8px">Project description</h3>
<p style="white-space:pre-wrap;font-size:14px;line-height:1.6">${escapeHtml(data.message)}</p>
</body></html>`;

  const subjectName = data.fullName.replace(/[\r\n]+/g, " ").slice(0, 80);

  try {
    await sendEmail({
      subject: `[Website] ${labelFor(projectCategories, data.category)} — ${subjectName}`,
      text,
      html,
      replyTo: data.email,
      attachments,
    });
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      return json({ ok: false, message: `Our contact form is temporarily unavailable. Please email ${site.email}.` }, 503);
    }
    console.error("[contact] Email delivery failed:", error instanceof Error ? error.message : error);
    return json(
      {
        ok: false,
        message: `We could not send your message right now. Please try again shortly or email ${site.email}.`,
      },
      502,
    );
  }

  return json({ ok: true, message: "Thank you. Your inquiry has been sent — we will get back to you shortly." }, 200);
}
