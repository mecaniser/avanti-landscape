// TEMPORARY verification harness — delete before committing.
import "../admin/admin.css";
import { EditServiceForm } from "../admin/(dashboard)/services/ServiceForms";

export default function AdminFormLab() {
  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <h2 style={{ color: "#e8ebdd", marginBottom: 24 }}>No photo</h2>
      <article className="service-admin-item">
        <div className="service-admin-item__summary">
          <div className="service-admin-item__thumb" aria-hidden="true"><span>No photo</span></div>
          <div className="service-admin-item__text">
            <h4>Lawn Fertilization</h4>
            <p>Season-long feeding programs that keep grass thick, green, and resilient.</p>
          </div>
          <details className="service-admin-item__edit" open>
            <summary>Edit service</summary>
            <div className="service-admin-item__edit-body">
              <EditServiceForm id="cmsr3dian001dnx1rnqj0obh0" name="Plantings & Softscapes" description="Trees, shrubs, and beds designed to fit your home and climate." image={null} />
            </div>
          </details>
        </div>
      </article>

      <h2 style={{ color: "#e8ebdd", margin: "48px 0 24px" }}>With photo</h2>
      <article className="service-admin-item">
        <div className="service-admin-item__summary">
          <div className="service-admin-item__thumb"><img src="/assets/img/gallery-sod-closeup.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          <div className="service-admin-item__text">
            <h4>Sod Installation</h4>
            <p>Fresh sod for new lawns, repairs, or full yard makeovers.</p>
          </div>
          <details className="service-admin-item__edit" open>
            <summary>Edit service</summary>
            <div className="service-admin-item__edit-body">
              <EditServiceForm id="lab-2" name="Sod Installation" description="Fresh sod for new lawns, repairs, or full yard makeovers." image="/assets/img/gallery-sod-closeup.jpg" />
            </div>
          </details>
        </div>
      </article>
    </div>
  );
}
