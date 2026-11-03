"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useForm, type FieldError, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Loader2, Paperclip, X } from "lucide-react";
import {
  attachmentRules,
  budgetOptions,
  contactSchema,
  isProjectCategory,
  projectCategories,
  timelineOptions,
  type ContactData,
  type ContactInput,
  type ContactResponse,
} from "@/lib/contact-schema";
import { cn } from "@/lib/cn";

type Props = { contactEmail: string };

export function ContactForm({ contactEmail }: Props) {
  const [attachmentsEnabled, setAttachmentsEnabled] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      phone: "",
      budget: "",
      timeline: "",
      message: "",
      consent: false as unknown as true,
    },
  });

  // Record when the form became interactive (used for spam timing) and
  // preselect a category from ?category=… links on service cards.
  useEffect(() => {
    const stamp = document.getElementById("form-started-at") as HTMLInputElement | null;
    if (stamp) stamp.value = String(Date.now());
    const category = new URLSearchParams(window.location.search).get("category");
    if (isProjectCategory(category)) setValue("category", category);

    // Attachment support is a server-side setting; ask the API at runtime.
    const controller = new AbortController();
    fetch("/api/contact", { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg: { attachmentsEnabled?: boolean } | null) => setAttachmentsEnabled(Boolean(cfg?.attachmentsEnabled)))
      .catch(() => {});
    return () => controller.abort();
  }, [setValue]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFileError("");
    if (!f) return setFile(null);
    const ext = (f.name.match(/\.[^.]+$/)?.[0] ?? "").toLowerCase();
    if (!(attachmentRules.extensions as readonly string[]).includes(ext)) {
      setFileError("This file type is not supported.");
      e.target.value = "";
      return setFile(null);
    }
    if (f.size > attachmentRules.maxBytes) {
      setFileError("Files are limited to 8 MB.");
      e.target.value = "";
      return setFile(null);
    }
    setFile(f);
  }

  async function onSubmit(data: ContactData) {
    if (fileError) return;
    setStatus("submitting");
    setServerMessage("");

    const body = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) body.append(key, String(value));
    }
    body.append("startedAt", (document.getElementById("form-started-at") as HTMLInputElement | null)?.value ?? "0");
    const honeypot = (document.getElementById("website") as HTMLInputElement | null)?.value ?? "";
    body.append("website", honeypot);
    if (attachmentsEnabled && file) body.append("attachment", file);

    try {
      const res = await fetch("/api/contact", { method: "POST", body });
      const json = (await res.json().catch(() => null)) as ContactResponse | null;
      if (res.ok && json?.ok) {
        setStatus("success");
        setServerMessage(json.message);
        reset();
        setFile(null);
        return;
      }
      if (json && !json.ok && json.fieldErrors) {
        for (const [field, message] of Object.entries(json.fieldErrors)) {
          if (field === "attachment") setFileError(message ?? "");
          else setError(field as keyof ContactInput, { type: "server", message });
        }
      }
      setServerMessage(json?.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerMessage(`We could not reach the server. Please check your connection, or email ${contactEmail}.`);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-line bg-white p-8 sm:p-12"
      >
        <CheckCircle2 aria-hidden className="size-10 text-red" />
        <h2 ref={successRef} tabIndex={-1} className="mt-6 text-h2 font-semibold outline-none">
          Inquiry received.
        </h2>
        <p className="mt-4 max-w-lg text-lead text-gray" role="status">
          {serverMessage}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="inline-flex min-h-12 items-center rounded-full border border-ink/15 px-6 text-sm font-medium hover:border-ink"
          >
            Send another inquiry
          </button>
          <Link href="/" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white hover:bg-red">
            Back to home <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      id="inquiry"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-describedby="form-required-note"
      className="rounded-3xl border border-line bg-white p-6 sm:p-10"
    >
      <AnimatePresence>
        {status === "error" && serverMessage && (
          <motion.div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 flex gap-3 rounded-2xl border border-red/30 bg-red/5 p-4 text-sm text-ink outline-none"
          >
            <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-red" />
            <p>{serverMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <p id="form-required-note" className="mb-8 text-sm text-gray">
        Fields marked <span className="text-red">*</span> are required.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Full Name" required autoComplete="name" error={errors.fullName} registration={register("fullName")} />
        <TextField
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          registration={register("email")}
        />
        <TextField label="Company" autoComplete="organization" error={errors.company} registration={register("company")} />
        <TextField label="Phone Number" type="tel" autoComplete="tel" error={errors.phone} registration={register("phone")} />

        <SelectField
          className="sm:col-span-2"
          label="Project Category"
          required
          placeholder="Select a category"
          options={projectCategories}
          error={errors.category}
          registration={register("category")}
        />
        <SelectField
          label="Estimated Budget"
          placeholder="Optional"
          options={budgetOptions}
          error={errors.budget}
          registration={register("budget")}
        />
        <SelectField
          label="Project Timeline"
          placeholder="Optional"
          options={timelineOptions}
          error={errors.timeline}
          registration={register("timeline")}
        />

        <TextAreaField
          className="sm:col-span-2"
          label="Project Description"
          required
          hint="What are you trying to achieve? Include constraints, quantities or existing designs if relevant."
          error={errors.message}
          registration={register("message")}
        />

        <div className="sm:col-span-2">
          <AttachmentField
            enabled={attachmentsEnabled}
            file={file}
            error={fileError}
            onChange={onFileChange}
            onClear={() => {
              setFile(null);
              setFileError("");
            }}
            contactEmail={contactEmail}
          />
        </div>

        {/* Honeypot — hidden from people and assistive technology */}
        <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          <input id="form-started-at" type="hidden" defaultValue="0" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-gray">
            <input
              type="checkbox"
              {...register("consent")}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? "consent-error" : undefined}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#D71932]"
            />
            <span>
              I agree that Synthea Advanced Technologies may process the information I submit to respond to my inquiry, as
              described in the{" "}
              <Link href="/privacy" className="text-ink underline underline-offset-2 hover:text-red">
                Privacy Policy
              </Link>
              . <span className="text-red">*</span>
            </span>
          </label>
          {errors.consent && (
            <p id="consent-error" className="mt-2 flex items-center gap-1.5 text-sm text-red">
              <AlertCircle aria-hidden className="size-4" /> {errors.consent.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-gray">
          Your inquiry is sent by email to Synthea and is not stored on this website.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex min-h-13 items-center justify-center gap-2.5 rounded-full bg-red px-8 py-3.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-red-dark disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send Inquiry
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {submitting ? "Sending your inquiry" : ""}
      </p>
    </form>
  );
}

/* ---------------------------------------------------------------------- */
/* Field primitives                                                        */
/* ---------------------------------------------------------------------- */

const inputBase =
  "block w-full rounded-xl border bg-white px-4 text-[0.95rem] text-ink transition-colors placeholder:text-gray/70 focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red";

type FieldProps = {
  label: string;
  required?: boolean;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  className?: string;
  hint?: string;
};

function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: Omit<FieldProps, "registration"> & { id: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label} {required ? <span className="text-red">*</span> : <span className="font-normal text-gray">(optional)</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-gray">
          {hint}
        </p>
      )}
      {error?.message && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-red">
          <AlertCircle aria-hidden className="size-4 shrink-0" /> {error.message}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: FieldError, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

function TextField({
  type = "text",
  autoComplete,
  inputMode,
  ...props
}: FieldProps & { type?: string; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"] }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-required={props.required || undefined}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props.error, props.hint)}
        className={cn(inputBase, "min-h-12", props.error ? "border-red" : "border-line")}
        {...props.registration}
      />
    </FieldShell>
  );
}

function TextAreaField(props: FieldProps) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <textarea
        id={id}
        rows={6}
        aria-required={props.required || undefined}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props.error, props.hint)}
        className={cn(inputBase, "resize-y py-3 leading-relaxed", props.error ? "border-red" : "border-line")}
        {...props.registration}
      />
    </FieldShell>
  );
}

function SelectField({
  options,
  placeholder,
  ...props
}: FieldProps & { options: readonly { value: string; label: string }[]; placeholder: string }) {
  const id = useId();
  return (
    <FieldShell id={id} {...props}>
      <div className="relative">
        <select
          id={id}
          defaultValue=""
          aria-required={props.required || undefined}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={describedBy(id, props.error, props.hint)}
          className={cn(inputBase, "min-h-12 appearance-none pr-10", props.error ? "border-red" : "border-line")}
          {...props.registration}
        >
          <option value="" disabled={props.required}>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-gray">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </FieldShell>
  );
}

function AttachmentField({
  enabled,
  file,
  error,
  onChange,
  onClear,
  contactEmail,
}: {
  enabled: boolean;
  file: File | null;
  error: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  contactEmail: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!enabled) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-4 text-sm text-gray">
        <p className="flex items-center gap-2 font-medium text-ink">
          <Paperclip aria-hidden className="size-4" /> Technical documents
        </p>
        <p className="mt-1">
          File upload is not available on this form. Mention in your description that you have documents to share, and we
          will reply with a secure way to send them — or email them to{" "}
          <a href={`mailto:${contactEmail}`} className="text-ink underline underline-offset-2">
            {contactEmail}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        Technical Document Attachment <span className="font-normal text-gray">(optional)</span>
      </label>
      <div
        className={cn(
          "flex flex-col gap-3 rounded-xl border border-dashed p-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-red sm:flex-row sm:items-center sm:justify-between",
          error ? "border-red" : "border-line",
        )}
      >
        <div className="flex min-w-0 items-center gap-3 text-sm">
          <Paperclip aria-hidden className="size-4 shrink-0 text-gray" />
          <span className="truncate">{file ? file.name : "PDF, images, STEP, STL, DXF, ZIP, DOCX or XLSX — up to 8 MB"}</span>
        </div>
        <div className="flex shrink-0 gap-2">
          {file && (
            <button
              type="button"
              onClick={() => {
                if (inputRef.current) inputRef.current.value = "";
                onClear();
              }}
              className="inline-flex min-h-10 items-center gap-1 rounded-full border border-line px-3 text-sm hover:border-ink"
            >
              <X aria-hidden className="size-4" /> Remove
            </button>
          )}
          <label
            htmlFor={id}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-full bg-surface px-4 text-sm font-medium hover:bg-line"
          >
            {file ? "Replace file" : "Choose file"}
          </label>
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={attachmentRules.accept}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="sr-only"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-red">
          <AlertCircle aria-hidden className="size-4" /> {error}
        </p>
      )}
    </div>
  );
}
