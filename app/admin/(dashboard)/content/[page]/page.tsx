import Link from "next/link";
import { prisma } from "@/lib/db";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { updateContentBlock, uploadHeroVideo, clearHeroVideo } from "../actions";

export const dynamic = "force-dynamic";

const PAGES = ["home", "about", "areas", "services", "gallery", "contact", "global"];

function formatLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const allBlocks = await prisma.contentBlock.findMany({
    where: { page },
    orderBy: { key: "asc" },
  });

  // Hero video is managed by its own card (below), not the generic text loop.
  const heroVideo = allBlocks.find((b) => b.key === "hero_video");
  const blocks = allBlocks.filter((b) => b.key !== "hero_video");
  const uploadsEnabled = isCloudinaryConfigured();

  return (
    <>
      <h2>Page Content</h2>
      <p className="subtitle">Edit the text and photos shown on the public site.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {PAGES.map((p) => (
          <Link
            key={p}
            href={`/admin/content/${p}`}
            className="admin-btn admin-btn--ghost"
            style={{
              padding: "6px 14px",
              fontSize: "0.85rem",
              background: page === p ? "var(--olive-deep, #5f7d28)" : "transparent",
              color: page === p ? "#fff" : undefined,
              borderColor: page === p ? "transparent" : undefined,
              textTransform: "capitalize",
            }}
          >
            {p}
          </Link>
        ))}
      </div>

      {!uploadsEnabled && (
        <div className="admin-flash admin-flash--error" style={{ marginBottom: 20 }}>
          Photo and video uploads are disabled until the Cloudinary keys are added.
          Text edits still work.
        </div>
      )}

      {page === "home" && (
        <div className="admin-card">
          <h3 style={{ marginBottom: 4 }}>Hero Background Video</h3>
          <p className="subtitle" style={{ marginBottom: 16 }}>
            Plays muted and looping behind the homepage headline. Landscape (wide) MP4 works best.
            If no video is set, the hero shows the background photo instead.
          </p>

          {heroVideo?.value ? (
            <>
              <video
                src={heroVideo.value}
                muted
                loop
                autoPlay
                playsInline
                style={{ width: 320, maxWidth: "100%", borderRadius: 8, marginBottom: 14, border: "1px solid var(--surface-line, #333825)" }}
              />
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                {uploadsEnabled && (
                  <form action={uploadHeroVideo} className="admin-form" encType="multipart/form-data" style={{ margin: 0 }}>
                    <input type="file" name="file" accept="video/*" required style={{ marginBottom: 10 }} />
                    <button type="submit" className="admin-btn">Replace Video</button>
                  </form>
                )}
                <form action={clearHeroVideo}>
                  <button type="submit" className="admin-btn admin-btn--danger">Remove Video</button>
                </form>
              </div>
            </>
          ) : uploadsEnabled ? (
            <form action={uploadHeroVideo} className="admin-form" encType="multipart/form-data">
              <input type="file" name="file" accept="video/*" required />
              <button type="submit" className="admin-btn">Upload Video</button>
            </form>
          ) : (
            <p className="subtitle" style={{ margin: 0 }}>Add the Cloudinary keys to enable video uploads.</p>
          )}
        </div>
      )}

      {blocks.length === 0 ? (
        <p className="subtitle">No content blocks for this page.</p>
      ) : (
        blocks.map((block) => {
          const update = updateContentBlock.bind(null, page, block.key);
          return (
            <div className="admin-card" key={block.id}>
              <form
                action={update}
                className="admin-form"
                encType={block.type === "image" ? "multipart/form-data" : undefined}
              >
                <label>{formatLabel(block.key)}</label>
                <input type="hidden" name="type" value={block.type} />

                {block.type === "image" ? (
                  <>
                    <img
                      src={block.value}
                      alt={block.key}
                      style={{ width: 200, height: 130, objectFit: "cover", borderRadius: 8, marginBottom: 12, border: "1px solid var(--surface-line, #333825)" }}
                    />
                    <input type="file" name="file" accept="image/*" />
                  </>
                ) : block.value.length > 80 ? (
                  <textarea name="value" rows={3} defaultValue={block.value} />
                ) : (
                  <input type="text" name="value" defaultValue={block.value} />
                )}

                <button type="submit" className="admin-btn">Save</button>
              </form>
            </div>
          );
        })
      )}
    </>
  );
}
