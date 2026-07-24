import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <h2>Blog</h2>
      <p className="subtitle">Create and manage blog posts.</p>

      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/blog/new" className="admin-btn">+ New Post</Link>
      </div>

      <div className="admin-card">
        {posts.length === 0 ? (
          <p className="subtitle">No posts yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Tag</th><th>Status</th><th>Updated</th></tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><Link href={`/admin/blog/${post.id}`}>{post.title}</Link></td>
                  <td>{post.tag || "—"}</td>
                  <td>
                    <span className={`admin-badge admin-badge--${post.publishedAt ? "active" : "lead"}`}>
                      {post.publishedAt ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{post.updatedAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
