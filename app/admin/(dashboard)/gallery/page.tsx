import { prisma } from "@/lib/db";
import { addGalleryImage, deleteGalleryImage } from "./actions";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <>
      <h2>Gallery</h2>
      <p className="subtitle">Photos shown on the public Gallery page.</p>

      <div className="admin-card">
        <h3 style={{ marginBottom: 12 }}>Add Photo</h3>
        <form action={addGalleryImage} className="admin-form" encType="multipart/form-data">
          <label htmlFor="file">Photo</label>
          <input type="file" id="file" name="file" accept="image/*" required />
          <label htmlFor="caption">Caption</label>
          <input type="text" id="caption" name="caption" placeholder="e.g. Mulch Installation" />
          <button type="submit" className="admin-btn">Upload</button>
        </form>
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
