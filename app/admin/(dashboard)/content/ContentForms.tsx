"use client";

import { useActionState } from "react";
import DetailsCloseButton from "@/components/DetailsCloseButton";
import SubmitButton from "../SubmitButton";
import { updateContentBlock, updateContentSection, updateServiceAreaList, type ContentActionState } from "./actions";

const initialState: ContentActionState = {};

function Feedback({ state }: { state: ContentActionState }) {
  if (state.error) return <p className="content-admin-item__form-feedback content-admin-item__form-feedback--error" role="alert">{state.error}</p>;
  if (state.ok && state.message) return <p className="content-admin-item__form-feedback" role="status">{state.message}</p>;
  return null;
}

export function ContentTextForm({
  page,
  contentKey,
  blockId,
  type,
  label,
  value,
  multiline,
}: {
  page: string;
  contentKey: string;
  blockId: string;
  type: string;
  label: string;
  value: string;
  multiline: boolean;
}) {
  const [state, action] = useActionState(updateContentBlock.bind(null, page, contentKey), initialState);

  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="type" value={type} />
      <label htmlFor={`content-${blockId}`}>{label}</label>
      {multiline ? (
        <textarea id={`content-${blockId}`} name="value" rows={4} defaultValue={value} />
      ) : (
        <input type="text" id={`content-${blockId}`} name="value" defaultValue={value} />
      )}
      <div className="content-admin-item__form-actions">
        <SubmitButton pendingLabel="Saving changes…">Save changes</SubmitButton>
        <DetailsCloseButton>Close</DetailsCloseButton>
      </div>
      <Feedback state={state} />
    </form>
  );
}

export function ServiceAreaForm({ lines, rows }: { lines: string; rows: number }) {
  const [state, action] = useActionState(updateServiceAreaList, initialState);

  return (
    <form action={action} className="admin-form">
      <label htmlFor="service-areas">One area per line</label>
      <textarea id="service-areas" name="areas" rows={rows} defaultValue={lines} placeholder={"Waxhaw, NC\nMarvin, NC"} required />
      <p className="content-admin-item__hint">Use a city followed by NC or SC on each line.</p>
      <div className="content-admin-item__form-actions">
        <SubmitButton pendingLabel="Saving areas…">Save service areas</SubmitButton>
        <DetailsCloseButton>Close</DetailsCloseButton>
      </div>
      <Feedback state={state} />
    </form>
  );
}

export function ContentSectionForm({
  page,
  blocks,
}: {
  page: string;
  blocks: Array<{ id: string; key: string; value: string; label: string; multiline: boolean }>;
}) {
  const [state, action] = useActionState(updateContentSection.bind(null, page, blocks.map((block) => block.key)), initialState);

  return (
    <form action={action} className="admin-form content-admin-section__form">
      {blocks.map((block) => (
        <div key={block.id}>
          <label htmlFor={`content-${block.id}`}>{block.label}</label>
          {block.multiline ? (
            <textarea id={`content-${block.id}`} name={`value-${block.key}`} rows={4} defaultValue={block.value} required />
          ) : (
            <input id={`content-${block.id}`} type="text" name={`value-${block.key}`} defaultValue={block.value} required />
          )}
        </div>
      ))}
      <div className="content-admin-item__form-actions">
        <SubmitButton pendingLabel="Saving section…">Save section</SubmitButton>
        <DetailsCloseButton>Close</DetailsCloseButton>
      </div>
      <Feedback state={state} />
    </form>
  );
}
