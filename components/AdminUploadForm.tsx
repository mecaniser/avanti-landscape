"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type UploadPhase = "idle" | "uploading" | "processing" | "error";

type AdminUploadFormProps = {
  operation: string;
  children: ReactNode;
  submitLabel: string;
  processingLabel: string;
  className?: string;
  resetOnSuccess?: boolean;
  redirectTo?: string;
};

/**
 * Server actions cannot report byte-level transfer progress. This intentionally
 * uses XMLHttpRequest for media forms so the progress indicator reflects the
 * browser's real upload, then switches to a separate processing state while
 * Cloudinary and the database finish their work.
 */
export default function AdminUploadForm({
  operation,
  children,
  submitLabel,
  processingLabel,
  className = "admin-form",
  resetOnSuccess = false,
  redirectTo,
}: AdminUploadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const busy = phase === "uploading" || phase === "processing";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("operation", operation);
    const hasFile = Array.from(form.elements).some(
      (element) => element instanceof HTMLInputElement && element.type === "file" && element.files?.length
    );
    setError(null);
    setProgress(0);
    setPhase(hasFile ? "uploading" : "processing");

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/media");
    request.responseType = "json";

    request.upload.onprogress = (uploadEvent) => {
      if (!uploadEvent.lengthComputable) return;
      setProgress(Math.round((uploadEvent.loaded / uploadEvent.total) * 100));
    };

    request.upload.onload = () => {
      setProgress(100);
      setPhase("processing");
    };

    request.onerror = () => {
      setPhase("error");
      setError("The upload could not reach the server. Check your connection and try again.");
    };

    request.onload = () => {
      const payload = request.response as { error?: string; redirectTo?: string } | null;
      if (request.status < 200 || request.status >= 300) {
        setPhase("error");
        setError(payload?.error ?? "The upload could not be completed. Please try again.");
        return;
      }

      if (resetOnSuccess) formRef.current?.reset();
      setPhase("idle");
      setProgress(0);
      router.refresh();
      const destination = payload?.redirectTo ?? redirectTo;
      if (destination) router.push(destination);
    };

    request.send(data);
  }

  return (
    <form ref={formRef} className={className} onSubmit={submit} encType="multipart/form-data" aria-busy={busy}>
      {children}
      <button type="submit" className="admin-btn" disabled={busy} aria-describedby={`${operation}-upload-status`}>
        {busy ? (
          <>
            <span className="admin-spinner" aria-hidden="true" />
            {phase === "uploading" ? `Uploading ${progress}%` : "Saving…"}
          </>
        ) : (
          submitLabel
        )}
      </button>
      <div
        id={`${operation}-upload-status`}
        className="admin-upload-status"
        role="status"
        aria-live="polite"
      >
        {phase === "uploading" && <progress className="admin-upload-progress" value={progress} max="100">Uploading {progress}%</progress>}
        {phase === "processing" && <span>{processingLabel}</span>}
        {phase === "error" && <span className="admin-upload-status--error">{error}</span>}
      </div>
    </form>
  );
}
