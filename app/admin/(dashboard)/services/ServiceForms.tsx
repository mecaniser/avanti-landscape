"use client";

import { useActionState } from "react";
import DetailsCloseButton from "@/components/DetailsCloseButton";
import SubmitButton from "../SubmitButton";
import { addService, deleteService, updateService, type ServiceActionState } from "./actions";

const initialState: ServiceActionState = {};

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

export function EditServiceForm({ id, name, description }: { id: string; name: string; description: string }) {
  const [saveState, saveAction] = useActionState(updateService.bind(null, id), initialState);
  const [deleteState, deleteAction] = useActionState(deleteService.bind(null, id), initialState);

  return (
    <>
      <form action={saveAction} className="admin-form service-admin-item__update-form">
        <div className="content-grid-2">
          <div>
            <label htmlFor={`name-${id}`}>Service name</label>
            <input type="text" id={`name-${id}`} name="name" defaultValue={name} required />
          </div>
          <div>
            <label htmlFor={`description-${id}`}>Short description</label>
            <input type="text" id={`description-${id}`} name="description" defaultValue={description} required />
          </div>
        </div>
        <div className="service-admin-item__actions">
          <SubmitButton pendingLabel="Saving changes…">Save changes</SubmitButton>
          <DetailsCloseButton>Close</DetailsCloseButton>
        </div>
        <Feedback state={saveState} />
      </form>
      <form action={deleteAction} className="service-admin-item__delete">
        <SubmitButton className="admin-btn admin-btn--danger" pendingLabel="Deleting service…">Delete service</SubmitButton>
        {deleteState.error && <p className="service-admin-item__feedback service-admin-item__feedback--error" role="alert">{deleteState.error}</p>}
      </form>
    </>
  );
}
