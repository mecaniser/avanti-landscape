import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteBlogPost } from "../actions";
import AdminUploadForm from "@/components/AdminUploadForm";
import BlogBodyEditor from "@/components/BlogBodyEditor";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const del = deleteBlogPost.bind(null, id);

  return (
    <section className="blog-editor">
      <h2>Edit Post</h2>
      <p className="subtitle">/blog/{post.slug}</p>

      <div className="admin-card">
        <AdminUploadForm operation="blog-update" submitLabel="Save Changes" processingLabel="Saving post…" redirectTo="/admin/blog" className="admin-form">
          <input type="hidden" name="id" value={id} />
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" defaultValue={post.title} required />

          <label htmlFor="tag">Tag</label>
          <input type="text" id="tag" name="tag" defaultValue={post.tag ?? ""} />

          <label htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post.excerpt ?? ""} />

          {post.coverImage && (
            <img
              src={post.coverImage}
              alt={post.title}
              style={{ width: 200, height: 130, objectFit: "cover", borderRadius: 8, marginBottom: 12, border: "1px solid #e3e0d3" }}
            />
          )}
          <label htmlFor="coverImageFile">Replace Cover Image</label>
          <input type="file" id="coverImageFile" name="coverImageFile" accept="image/*" />

          <BlogBodyEditor initialHtml={post.body} />

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input type="checkbox" name="publish" defaultChecked={!!post.publishedAt} style={{ width: "auto", marginBottom: 0 }} />
            Published
          </label>

        </AdminUploadForm>
      </div>

      <div className="blog-editor__footer">
        <Link href="/admin/blog" className="admin-btn admin-btn--ghost">Cancel</Link>
        <form action={del}>
          <button type="submit" className="admin-btn admin-btn--danger">Delete Post</button>
        </form>
      </div>
    </section>
  );
}
