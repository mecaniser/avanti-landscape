import Link from "next/link";
import AdminUploadForm from "@/components/AdminUploadForm";
import BlogBodyEditor from "@/components/BlogBodyEditor";

export default function NewBlogPostPage() {
  return (
    <section className="blog-editor">
      <h2>New Blog Post</h2>
      <p className="subtitle">Write and format the article just as it will appear to customers.</p>

      <div className="admin-card">
        <AdminUploadForm operation="blog-create" submitLabel="Create Post" processingLabel="Saving post…" redirectTo="/admin/blog" className="admin-form">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required />

          <label htmlFor="slug">URL Slug</label>
          <input type="text" id="slug" name="slug" placeholder="e.g. spring-lawn-tips" required />

          <label htmlFor="tag">Tag</label>
          <input type="text" id="tag" name="tag" placeholder="e.g. LAWN CARE" />

          <label htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} />

          <label htmlFor="coverImageFile">Cover Image</label>
          <input type="file" id="coverImageFile" name="coverImageFile" accept="image/*" />

          <BlogBodyEditor />

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input type="checkbox" name="publish" style={{ width: "auto", marginBottom: 0 }} />
            Publish immediately
          </label>

        </AdminUploadForm>
      </div>
      <div className="blog-editor__footer">
        <Link href="/admin/blog" className="admin-btn admin-btn--ghost">Cancel</Link>
      </div>
    </section>
  );
}
