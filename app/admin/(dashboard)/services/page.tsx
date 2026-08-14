import { prisma } from "@/lib/db";
import { AddServiceForm, EditServiceForm } from "./ServiceForms";

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
    <section className="services-admin">
      <h2>Services</h2>
      <p className="subtitle">Manage the service list displayed on the public Services page.</p>

      {CATEGORIES.map((category) => {
        const categoryServices = services.filter((service) => service.category === category.id);
        return (
          <section className="admin-card service-admin-category" key={category.id} aria-labelledby={`service-category-${category.id}`}>
            <div className="service-admin-category__head">
              <div>
                <h3 id={`service-category-${category.id}`}>{category.label}</h3>
                <p>{categoryServices.length} {categoryServices.length === 1 ? "service" : "services"}</p>
              </div>
            </div>

            <details className="ba-admin-create service-admin-category__create">
              <summary><span aria-hidden="true">+</span> Add service</summary>
              <div className="ba-admin-create__body">
                <div className="service-admin-category__create-head">
                  <p>Add a customer-facing service to {category.label}.</p>
                </div>
                <AddServiceForm category={category.id} label={category.label} />
              </div>
            </details>

            {categoryServices.length === 0 ? (
              <p className="subtitle" style={{ margin: 0 }}>No services in this category yet.</p>
            ) : (
              <div className="service-admin-list">
                {categoryServices.map((service) => {
                  return (
                    <article className="service-admin-item" key={service.id}>
                      <div className="service-admin-item__summary">
                        <div>
                          <h4>{service.name}</h4>
                          <p>{service.description}</p>
                        </div>
                        <details className="service-admin-item__edit">
                          <summary>Edit service</summary>
                          <div className="service-admin-item__edit-body">
                            <EditServiceForm id={service.id} name={service.name} description={service.description} />
                          </div>
                        </details>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </section>
  );
}
