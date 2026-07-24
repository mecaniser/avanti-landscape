import Link from "next/link";
import { prisma } from "@/lib/db";
import { updateContentBlock } from "../actions";

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
  const blocks = await prisma.contentBlock.findMany({
    where: { page },
    orderBy: { key: "asc" },
  });

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
              background: page === p ? "var(--dark-green, #345126)" : "transparent",
              color: page === p ? "#fff" : undefined,
              textTransform: "capitalize",
            }}
          >
            {p}
          </Link>
        ))}
      </div>

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
                      style={{ width: 200, height: 130, objectFit: "cover", borderRadius: 8, marginBottom: 12, border: "1px solid #e3e0d3" }}
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
