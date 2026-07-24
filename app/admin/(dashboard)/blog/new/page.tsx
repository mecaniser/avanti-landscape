import { createBlogPost } from "../actions";

export default function NewBlogPostPage() {
  return (
    <>
      <h2>New Blog Post</h2>
      <p className="subtitle">Body supports basic HTML tags (h2, p, ul/li).</p>

      <div className="admin-card">
        <form action={createBlogPost} className="admin-form" encType="multipart/form-data">
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

          <label htmlFor="body">Body (HTML)</label>
          <textarea id="body" name="body" rows={14} required />

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <input type="checkbox" name="publish" style={{ width: "auto", marginBottom: 0 }} />
            Publish immediately
          </label>

          <button type="submit" className="admin-btn">Create Post</button>
        </form>
      </div>
    </>
  );
}
