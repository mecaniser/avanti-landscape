import { prisma } from "@/lib/db";
import { updateService, addService, deleteService } from "./actions";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  { id: "lawn-care", label: "Lawn Care" },
  { id: "landscaping", label: "Landscaping" },
  { id: "hardscaping", label: "Hardscaping" },
  { id: "maintenance", label: "Lawn & Landscape Maintenance" },
];

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });

  return (
    <>
      <h2>Services</h2>
      <p className="subtitle">Edit the service list shown on the public Services page.</p>

      {CATEGORIES.map((cat) => (
        <div className="admin-card" key={cat.id}>
          <h3 style={{ marginBottom: 12 }}>{cat.label}</h3>

          {services
            .filter((s) => s.category === cat.id)
            .map((s) => {
              const update = updateService.bind(null, s.id);
              const del = deleteService.bind(null, s.id);
              return (
                <form
                  action={update}
                  key={s.id}
                  className="admin-form"
                  style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, borderBottom: "1px solid #eee", paddingBottom: 10 }}
                >
                  <input type="text" name="name" defaultValue={s.name} style={{ flex: "0 0 220px", marginBottom: 0 }} />
                  <input type="text" name="description" defaultValue={s.description} style={{ flex: 1, marginBottom: 0 }} />
                  <button type="submit" className="admin-btn" style={{ flexShrink: 0 }}>Save</button>
                  <button type="submit" formAction={del} className="admin-btn admin-btn--danger" style={{ flexShrink: 0 }}>Delete</button>
                </form>
              );
            })}

          <form action={addService} className="admin-form" style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14 }}>
            <input type="hidden" name="category" value={cat.id} />
            <input type="text" name="name" placeholder="New service name" style={{ flex: "0 0 220px", marginBottom: 0 }} required />
            <input type="text" name="description" placeholder="Short description" style={{ flex: 1, marginBottom: 0 }} required />
            <button type="submit" className="admin-btn admin-btn--ghost" style={{ flexShrink: 0 }}>+ Add</button>
          </form>
        </div>
      ))}
    </>
  );
}
