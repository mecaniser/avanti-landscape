import { prisma } from "@/lib/db";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import SubmitButton from "../SubmitButton";
import {
  addGalleryImage,
  deleteGalleryImage,
  addBeforeAfterProject,
  updateBeforeAfterProject,
  deleteBeforeAfterProject,
} from "./actions";

export const dynamic = "force-dynamic";

const thumbStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 220,
  aspectRatio: "4 / 3",
  objectFit: "cover",
  borderRadius: 8,
  margin: "0 0 10px",
  border: "1px solid var(--surface-line)",
  display: "block",
};

export default async function GalleryAdminPage() {
  const [images, projects] = await Promise.all([
    prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.beforeAfterProject.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  const uploadsEnabled = isCloudinaryConfigured();

  return (
    <>
      <h2>Gallery</h2>
      <p className="subtitle">Before &amp; after projects and the photo grid shown on the public Gallery page.</p>

      {!uploadsEnabled && (
        <div className="admin-flash admin-flash--error" style={{ marginBottom: 20 }}>
          Photo uploads are disabled until the Cloudinary keys are added.
        </div>
      )}

      {/* ---------- Before & After projects ---------- */}
      <div className="admin-card">
        <h3 style={{ marginBottom: 4 }}>Before &amp; After Projects</h3>
        <p className="subtitle" style={{ marginBottom: 16 }}>
          Each project becomes a slide in the draggable comparison carousel on the home and gallery pages.
        </p>

        {uploadsEnabled && (
          <form action={addBeforeAfterProject} className="admin-form" encType="multipart/form-data" style={{ marginBottom: projects.length ? 24 : 0 }}>
            <div className="content-grid-2">
              <div>
                <label htmlFor="before_file">Before Photo</label>
                <input type="file" id="before_file" name="before_file" accept="image/*" required />
              </div>
              <div>
                <label htmlFor="after_file">After Photo</label>
                <input type="file" id="after_file" name="after_file" accept="image/*" required />
              </div>
            </div>
            <div className="content-grid-2">
              <div>
                <label htmlFor="ba-caption">Caption</label>
                <input type="text" id="ba-caption" name="caption" placeholder="e.g. Foundation Bed Renovation — Waxhaw, NC" required />
              </div>
              <div>
                <label htmlFor="subtext">Subtext</label>
                <input type="text" id="subtext" name="subtext" placeholder="e.g. Soil prep, fresh plantings, and mulch" />
              </div>
            </div>
            <SubmitButton pendingLabel="Uploading photos…">Add Project</SubmitButton>
          </form>
        )}

        {projects.length === 0 ? (
          <p className="subtitle" style={{ margin: 0 }}>No before/after projects yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {projects.map((proj, i) => {
              const save = updateBeforeAfterProject.bind(null, proj.id);
              const del = deleteBeforeAfterProject.bind(null, proj.id);
              return (
                <div key={proj.id} className="ba-admin-item">
                  <div className="ba-admin-item__head">
                    <span className="ba-admin-item__pos">Slide {i + 1}</span>
                  </div>

                  <form action={save} className="admin-form" encType="multipart/form-data">
                    <div className="content-grid-2">
                      <div>
                        <label htmlFor={`before-${proj.id}`}>Before Photo</label>
                        <img src={proj.beforeUrl} alt="Before" style={thumbStyle} />
                        {uploadsEnabled && (
                          <input type="file" id={`before-${proj.id}`} name="before_file" accept="image/*" />
                        )}
                      </div>
                      <div>
                        <label htmlFor={`after-${proj.id}`}>After Photo</label>
                        <img src={proj.afterUrl} alt="After" style={thumbStyle} />
                        {uploadsEnabled && (
                          <input type="file" id={`after-${proj.id}`} name="after_file" accept="image/*" />
                        )}
                      </div>
                    </div>

                    <div className="content-grid-2">
                      <div>
                        <label htmlFor={`caption-${proj.id}`}>Caption</label>
                        <input type="text" id={`caption-${proj.id}`} name="caption" defaultValue={proj.caption} required />
                      </div>
                      <div>
                        <label htmlFor={`subtext-${proj.id}`}>Subtext</label>
                        <input type="text" id={`subtext-${proj.id}`} name="subtext" defaultValue={proj.subtext ?? ""} />
                      </div>
                    </div>

                    {uploadsEnabled && (
                      <p className="subtitle" style={{ margin: "0 0 4px" }}>
                        Leave a photo field empty to keep the current one.
                      </p>
                    )}
                    <SubmitButton pendingLabel="Saving…">Save Changes</SubmitButton>
                  </form>

                  <form action={del} className="ba-admin-item__delete">
                    <SubmitButton className="admin-btn admin-btn--danger" pendingLabel="Deleting…">
                      Delete Project
                    </SubmitButton>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------- Photo grid ---------- */}
      <div className="admin-card">
        <h3 style={{ marginBottom: 12 }}>Photo Grid</h3>
        {uploadsEnabled && (
          <form action={addGalleryImage} className="admin-form" encType="multipart/form-data">
            <label htmlFor="file">Photo</label>
            <input type="file" id="file" name="file" accept="image/*" required />
            <label htmlFor="gallery-caption">Caption</label>
            <input type="text" id="gallery-caption" name="caption" placeholder="e.g. Mulch Installation" />
            <SubmitButton pendingLabel="Uploading…">Upload</SubmitButton>
          </form>
        )}
      </div>

      <div className="admin-grid-list">
        {images.map((img) => {
          const del = deleteGalleryImage.bind(null, img.id);
          return (
            <div className="admin-thumb" key={img.id}>
              <img src={img.url} alt={img.caption ?? ""} loading="lazy" />
              <div className="meta">
                <div>{img.caption || "—"}</div>
                <form action={del} style={{ marginTop: 6 }}>
                  <SubmitButton
                    className="admin-btn admin-btn--danger"
                    style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                    pendingLabel="Deleting…"
                  >
                    Delete
                  </SubmitButton>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
