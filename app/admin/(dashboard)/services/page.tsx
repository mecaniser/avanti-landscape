import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatUpdatedAt, latestUpdatedAt } from "@/lib/format";
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
  const lastUpdated = latestUpdatedAt(services);

  return (
    <section className="services-admin">
      <h2>Services</h2>
      <p className="subtitle">Manage the service list displayed on the public Services page.</p>
      {lastUpdated && <p className="admin-last-updated">Last updated {formatUpdatedAt(lastUpdated)}</p>}

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
                        {/* Shows at a glance which services already have a photo, without
                            opening each one to check. */}
                        <div className="service-admin-item__thumb" aria-hidden={!service.image}>
                          {service.image ? (
                            <Image src={service.image} alt="" fill sizes="48px" style={{ objectFit: "cover" }} />
                          ) : (
                            <span>No photo</span>
                          )}
                        </div>
                        <div className="service-admin-item__text">
                          <h4>{service.name}</h4>
                          <p>{service.description}</p>
                        </div>
                      </div>
                      {/* A full-width block below the summary row, not an inline sibling
                          of the short name/description text: fixed to that row's width
                          via flex, the panel used to get pushed hard right by space-between
                          with a wide empty gap between it and the text. A shared `name`
                          makes these an exclusive group natively: opening one edit panel
                          closes whichever other one was open. */}
                      <details className="service-admin-item__edit" name="service-edit">
                        <summary>Edit service</summary>
                        <div className="service-admin-item__edit-body">
                          <EditServiceForm
                            id={service.id}
                            name={service.name}
                            description={service.description}
                            image={service.image}
                          />
                        </div>
                      </details>
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
