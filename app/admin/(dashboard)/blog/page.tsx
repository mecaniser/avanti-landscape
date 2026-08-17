import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section className="blog-admin">
      <h2>Blog</h2>
      <p className="subtitle">Create and manage blog posts.</p>

      <div className="blog-admin__toolbar">
        <p>Choose a post to edit its copy, cover image, and publication status.</p>
        <Link href="/admin/blog/new" className="admin-btn">+ New Post</Link>
      </div>

      <div className="admin-card">
        {posts.length === 0 ? (
          <p className="subtitle">No posts yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Tag</th><th>Status</th><th>Updated</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong className="blog-admin__post-title">{post.title}</strong>
                    {post.excerpt && <p className="blog-admin__excerpt">{post.excerpt}</p>}
                  </td>
                  <td>{post.tag || "-"}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${post.publishedAt ? "active" : "lead"}`}>
                      {post.publishedAt ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{post.updatedAt.toLocaleDateString()}</td>
                  <td className="blog-admin__actions-cell">
                    <Link href={`/admin/blog/${post.id}`} className="admin-btn admin-btn--ghost blog-admin__edit">Edit post</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
