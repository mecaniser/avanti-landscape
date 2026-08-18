"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import AdminDeleteConfirm from "@/components/AdminDeleteConfirm";
import AdminUploadForm from "@/components/AdminUploadForm";
import DetailsCloseButton from "@/components/DetailsCloseButton";
import SubmitButton from "../SubmitButton";
import { addService, deleteService, removeServiceImage, updateService, type ServiceActionState } from "./actions";

const initialState: ServiceActionState = {};

// Plain geometry instead of a Unicode glyph (⟳, +, ×): symbol characters carry
// their own font-dependent optical offset, so flexbox centers the character's
// line box but not the mark inside it. An SVG path has no such offset.
function ReplaceIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.89" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13.5 3v3.2h-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function Feedback({ state }: { state: ServiceActionState }) {
  if (state.error) return <p className="service-admin-item__feedback service-admin-item__feedback--error" role="alert">{state.error}</p>;
  if (state.ok && state.message) return <p className="service-admin-item__feedback" role="status">{state.message}</p>;
  return null;
}

export function AddServiceForm({ category, label }: { category: string; label: string }) {
  const [state, action] = useActionState(addService, initialState);

  return (
    <form action={action} className="admin-form service-admin-category__create-form">
      <input type="hidden" name="category" value={category} />
      <div className="content-grid-2">
        <div>
          <label htmlFor={`new-name-${category}`}>Service name</label>
          <input type="text" id={`new-name-${category}`} name="name" placeholder="e.g. Overseeding" required />
        </div>
        <div>
          <label htmlFor={`new-description-${category}`}>Short description</label>
          <input type="text" id={`new-description-${category}`} name="description" placeholder="A clear, customer-facing description" required />
        </div>
      </div>
      <div className="service-admin-category__create-actions">
        <SubmitButton pendingLabel="Saving service…">Add service</SubmitButton>
        <DetailsCloseButton>Close</DetailsCloseButton>
      </div>
      <Feedback state={state} />
      <span className="sr-only">Add a service to {label}.</span>
    </form>
  );
}

export function EditServiceForm({
  id,
  name,
  description,
  image,
}: {
  id: string;
  name: string;
  description: string;
  image: string | null;
}) {
  const [saveState, saveAction] = useActionState(updateService.bind(null, id), initialState);
  const [deleteState, deleteAction] = useActionState(deleteService.bind(null, id), initialState);
  const [removeImageState, removeImageAction] = useActionState(removeServiceImage.bind(null, id), initialState);

  // Save should only be reachable once there's an actual edit to apply; a
  // permanently-enabled button gives no signal about whether anything
  // changed, and invites saves that write back the same values.
  const [baseline, setBaseline] = useState({ name, description });
  const [nameValue, setNameValue] = useState(name);
  const [descriptionValue, setDescriptionValue] = useState(description);
  // A successful save revalidates the page and this component receives new
  // name/description props under the same id. Detecting that during render
  // (rather than in an effect) resyncs the fields before the stale values
  // ever paint.
  if (baseline.name !== name || baseline.description !== description) {
    setBaseline({ name, description });
    setNameValue(name);
    setDescriptionValue(description);
  }
  const isDirty = nameValue !== name || descriptionValue !== description;

  return (
    <>
      {/* Text fields, photo, and the two everyday actions (Save, Close) share one
          panel and one visual rhythm. Delete sits apart, below, and reads as a
          quieter, separate decision rather than a peer of the other buttons. */}
      <form action={saveAction} className="admin-form service-admin-item__update-form">
        <div className="content-grid-2">
          <div>
            <label htmlFor={`name-${id}`}>Service name</label>
            <input
              type="text"
              id={`name-${id}`}
              name="name"
              value={nameValue}
              onChange={(event) => setNameValue(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor={`description-${id}`}>Short description</label>
            <input
              type="text"
              id={`description-${id}`}
              name="description"
              value={descriptionValue}
              onChange={(event) => setDescriptionValue(event.target.value)}
              required
            />
          </div>
        </div>
        <div className="service-admin-item__actions">
          <SubmitButton
            className={isDirty ? "admin-btn" : "admin-btn admin-btn--ghost"}
            pendingLabel="Saving changes…"
            disabled={!isDirty}
          >
            Save changes
          </SubmitButton>
          <DetailsCloseButton>Close</DetailsCloseButton>
        </div>
        <Feedback state={saveState} />
      </form>

      <div className="service-admin-item__photo-field">
        <span className="service-admin-item__photo-label">Photo</span>
        {/* The photo, replace, and delete controls all act on the photo
            directly, so they live on the photo itself as corner controls
            rather than as a row of buttons that read like peers of Save. */}
        <div className="service-admin-item__photo-card">
          <div className="service-admin-item__photo-card-media" aria-hidden={!image}>
            {image ? (
              <Image src={image} alt={`Current photo for ${name}`} fill sizes="140px" style={{ objectFit: "cover" }} />
            ) : (
              <span>No photo</span>
            )}
          </div>

          <AdminUploadForm
            operation="service-image"
            statusId={`service-image-${id}`}
            submitLabel={image ? "Replace" : "Add photo"}
            processingLabel="Saving…"
            successLabel="Photo saved."
            className="service-admin-item__photo-replace"
            resetOnSuccess
            hideDefaultButton
          >
            <input type="hidden" name="id" value={id} />
            <label
              htmlFor={`service-image-file-${id}`}
              className="service-admin-item__photo-replace-btn"
              title={image ? "Replace photo" : "Add photo"}
            >
              {image ? <ReplaceIcon /> : <PlusIcon />}
              <span className="sr-only">{image ? `Replace photo for ${name}` : `Add photo for ${name}`}</span>
            </label>
            <input type="file" id={`service-image-file-${id}`} name="file" accept="image/*" className="sr-only" required />
          </AdminUploadForm>

          {image && (
            <form action={removeImageAction} className="service-admin-item__photo-delete">
              <SubmitButton className="service-admin-item__photo-delete-btn" pendingLabel="…">
                <CloseIcon />
                <span className="sr-only">Remove photo for {name}</span>
              </SubmitButton>
            </form>
          )}
        </div>
        {!image && (
          <p className="service-admin-item__photo-hint">
            Until a photo is added, this service shows as a text card on the public page.
          </p>
        )}
        <Feedback state={removeImageState} />
      </div>

      <div className="service-admin-item__delete">
        <AdminDeleteConfirm
          action={deleteAction}
          itemLabel={name}
          triggerLabel="Delete this service"
          triggerClassName="service-admin-item__text-btn service-admin-item__text-btn--danger"
          className="service-admin-item__delete-confirm"
        />
        {deleteState.error && <p className="service-admin-item__feedback service-admin-item__feedback--error" role="alert">{deleteState.error}</p>}
      </div>
    </>
  );
}
