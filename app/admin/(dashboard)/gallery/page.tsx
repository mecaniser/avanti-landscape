import { prisma } from "@/lib/db";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import {
  addGalleryImage,
  deleteGalleryImage,
  addBeforeAfterProject,
  deleteBeforeAfterProject,
} from "./actions";

export const dynamic = "force-dynamic";

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
            <button type="submit" className="admin-btn">Add Project</button>
          </form>
        )}

        {projects.length === 0 ? (
          <p className="subtitle" style={{ margin: 0 }}>No before/after projects yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {projects.map((proj) => {
              const del = deleteBeforeAfterProject.bind(null, proj.id);
              return (
                <div
                  key={proj.id}
                  style={{ display: "flex", gap: 14, alignItems: "center", padding: 12, border: "1px solid var(--surface-line)", borderRadius: 10, background: "var(--bg-elev-2)", flexWrap: "wrap" }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    <img src={proj.beforeUrl} alt="Before" style={{ width: 90, height: 68, objectFit: "cover", borderRadius: 6 }} />
                    <img src={proj.afterUrl} alt="After" style={{ width: 90, height: 68, objectFit: "cover", borderRadius: 6 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <strong style={{ color: "var(--heading)", fontFamily: "var(--font-head)", fontSize: "0.95rem" }}>{proj.caption}</strong>
                    {proj.subtext && <div className="subtitle" style={{ margin: "4px 0 0" }}>{proj.subtext}</div>}
                  </div>
                  <form action={del}>
                    <button type="submit" className="admin-btn admin-btn--danger">Delete</button>
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
            <button type="submit" className="admin-btn">Upload</button>
          </form>
        )}
      </div>

      <div className="admin-grid-list">
        {images.map((img) => {
          const del = deleteGalleryImage.bind(null, img.id);
          return (
            <div className="admin-thumb" key={img.id}>
              <img src={img.url} alt={img.caption ?? ""} />
              <div className="meta">
                <div>{img.caption || "—"}</div>
                <form action={del} style={{ marginTop: 6 }}>
                  <button type="submit" className="admin-btn admin-btn--danger" style={{ fontSize: "0.75rem", padding: "4px 10px" }}>
                    Delete
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
