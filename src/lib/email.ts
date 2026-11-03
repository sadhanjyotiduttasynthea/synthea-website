import "server-only";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { site } from "@/content/site";

export type OutgoingAttachment = { filename: string; content: Buffer; contentType?: string };

export type OutgoingEmail = {
  subject: string;
  text: string;
  html: string;
  replyTo: string;
  attachments?: OutgoingAttachment[];
};

export class EmailNotConfiguredError extends Error {}

type Provider = "resend" | "smtp";

function provider(): Provider | null {
  const explicit = process.env.EMAIL_PROVIDER?.toLowerCase();
  if (explicit === "resend" || explicit === "smtp") return explicit;
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST) return "smtp";
  return null;
}

export function isEmailConfigured() {
  const p = provider();
  if (p === "resend") return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL);
  if (p === "smtp")
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_FROM_EMAIL);
  return false;
}

function recipients() {
  return (process.env.CONTACT_TO_EMAIL ?? site.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Send an email with the configured provider. Throws on any delivery failure. */
export async function sendEmail(message: OutgoingEmail): Promise<void> {
  if (!isEmailConfigured()) throw new EmailNotConfiguredError("Email delivery is not configured.");

  const from = process.env.CONTACT_FROM_EMAIL as string;
  const to = recipients();

  if (provider() === "resend") {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
      attachments: message.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });
    if (error) throw new Error(`Resend error: ${error.name}: ${error.message}`);
    return;
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from,
    to,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
    attachments: message.attachments,
  });
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
