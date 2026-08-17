"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/compress-image";
import { maxBytesFor, oversizeMessage, type UploadKind } from "@/lib/uploads";

type UploadPhase = "idle" | "preparing" | "uploading" | "processing" | "success" | "error";

type AdminUploadFormProps = {
  operation: string;
  children: ReactNode;
  submitLabel: string;
  processingLabel: string;
  successLabel?: string;
  className?: string;
  resetOnSuccess?: boolean;
  redirectTo?: string;
  statusId?: string;
  /** Skip the built-in submit button for a caller providing its own trigger
   *  (e.g. a file input that submits itself on change). The status region
   *  still renders, so upload progress and errors remain visible. */
  hideDefaultButton?: boolean;
};

/**
 * Server actions cannot report byte-level transfer progress. This intentionally
 * uses XMLHttpRequest for media forms so the progress indicator reflects the
 * browser's real upload, then switches to a separate processing state while
 * Cloudinary and the database finish their work.
 *
 * Images are shrunk and the size limit is enforced before anything is sent, so
 * an oversized photo fails instantly instead of after a full doomed transfer.
 */
export default function AdminUploadForm({
  operation,
  children,
  submitLabel,
  processingLabel,
  successLabel = "Saved successfully.",
  className = "admin-form",
  resetOnSuccess = false,
  redirectTo,
  statusId = operation,
  hideDefaultButton = false,
}: AdminUploadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Optimistic until the mount effect checks the DOM, so a required file
  // input renders disabled instead of flashing enabled-then-disabled.
  const [hasRequiredFiles, setHasRequiredFiles] = useState(true);

  const busy = phase === "preparing" || phase === "uploading" || phase === "processing";

  // A submit button that looks enabled but silently fails (or trips the
  // browser's native "select a file" bubble) reads as broken. Disable it
  // until every required file input actually has a file, so the button's
  // state always matches what clicking it will do.
  function refreshRequiredFiles() {
    const form = formRef.current;
    if (!form) return;
    const requiredFileInputs = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[type="file"][required]')
    );
    setHasRequiredFiles(requiredFileInputs.every((input) => (input.files?.length ?? 0) > 0));
  }

  useEffect(() => {
    refreshRequiredFiles();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("operation", operation);
    const pickedFiles = Array.from(form.elements).filter(
      (element): element is HTMLInputElement =>
        element instanceof HTMLInputElement && element.type === "file" && Boolean(element.files?.length)
    );
    setError(null);
    setProgress(0);
    setPhase(pickedFiles.length ? "preparing" : "processing");

    for (const input of pickedFiles) {
      const original = input.files![0];
      const kind: UploadKind = original.type.startsWith("video/") ? "video" : "image";
      const { file, compressed } = kind === "image" ? await compressImage(original) : { file: original, compressed: false };

      if (file.size > maxBytesFor(kind)) {
        setPhase("error");
        setError(
          compressed || kind === "video"
            ? oversizeMessage(kind, file.size)
            : `${oversizeMessage(kind, file.size)} This format cannot be resized in the browser — save it as a JPEG and try again.`
        );
        return;
      }

      data.set(input.name, file, file.name);
    }

    setPhase(pickedFiles.length ? "uploading" : "processing");

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/media");
    request.responseType = "json";
    request.timeout = 120000;

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

    request.ontimeout = () => {
      setPhase("error");
      setError("This is taking longer than expected. Your changes may still be processing; refresh before trying again.");
    };

    request.onload = () => {
      const payload = request.response as { error?: string; redirectTo?: string } | null;
      if (request.status < 200 || request.status >= 300) {
        setPhase("error");
        setError(payload?.error ?? "The upload could not be completed. Please try again.");
        return;
      }

      if (resetOnSuccess) {
        formRef.current?.reset();
        refreshRequiredFiles();
      }
      setPhase("success");
      setProgress(100);
      router.refresh();
      const destination = payload?.redirectTo ?? redirectTo;
      if (destination) router.push(destination);
    };

    request.send(data);
  }

  // With no visible submit button, the caller's file input is the only
  // trigger: picking a file submits the form immediately.
  function handleChange(event: FormEvent<HTMLFormElement>) {
    refreshRequiredFiles();
    if (!hideDefaultButton || busy) return;
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "file" && target.files?.length) {
      formRef.current?.requestSubmit();
    }
  }

  return (
    <form
      ref={formRef}
      className={className}
      onSubmit={(event) => void submit(event)}
      onChange={handleChange}
      encType="multipart/form-data"
      aria-busy={busy}
    >
      {children}
      {!hideDefaultButton && (
        <button
          type="submit"
          className="admin-btn"
          disabled={busy || !hasRequiredFiles}
          aria-busy={busy}
          aria-describedby={`${statusId}-upload-status`}
        >
          {busy ? (
            <>
              <span className="admin-spinner" aria-hidden="true" />
              {phase === "preparing" ? "Preparing…" : phase === "uploading" ? `Uploading ${progress}%` : "Saving…"}
            </>
          ) : (
            submitLabel
          )}
        </button>
      )}
      <div
        id={`${statusId}-upload-status`}
        className="admin-upload-status"
        role="status"
        aria-live="polite"
      >
        {phase === "preparing" && <span>Resizing your photo…</span>}
        {phase === "uploading" && <progress className="admin-upload-progress" value={progress} max="100">Uploading {progress}%</progress>}
        {phase === "processing" && <span>{processingLabel}</span>}
        {phase === "success" && <span>{successLabel}</span>}
        {phase === "error" && <span className="admin-upload-status--error">{error}</span>}
      </div>
    </form>
  );
}
