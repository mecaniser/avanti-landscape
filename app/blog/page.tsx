import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, pageMetadata } from "@/lib/site";
import { getPublishedPosts } from "@/lib/queries";

export const metadata: Metadata = pageMetadata({
  title: "Lawn & Landscape Tips for Waxhaw-Area Yards",
  description:
    "Seasonal lawn and landscape advice from the Avanti Landscaping crew, written for Waxhaw-area yards: tall fescue, core aeration, spring and fall cleanups, and more.",
  path: "/blog",
  image: absoluteUrl("/assets/img/blog-lawn-wide.jpg"),
});

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <SiteHeader active="blog" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/" style={{ color: "inherit" }}>Home</Link> / Blog</div>
            <h1>Lawn &amp; Landscape Tips</h1>
            <p>Seasonal advice from our crew, written for Waxhaw-area yards.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="grid grid--3">
              {posts.map((post) => (
                <div className="blog-card" key={post.id}>
                  <div className="thumb">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="250" fill="#8fae3c" /><g fill="#345126"><circle cx="60" cy="60" r="6" /><circle cx="90" cy="60" r="6" /><circle cx="120" cy="60" r="6" /><circle cx="60" cy="90" r="6" /><circle cx="90" cy="90" r="6" /><circle cx="120" cy="90" r="6" /><circle cx="200" cy="150" r="6" /><circle cx="230" cy="150" r="6" /><circle cx="260" cy="150" r="6" /><circle cx="200" cy="180" r="6" /><circle cx="230" cy="180" r="6" /><circle cx="260" cy="180" r="6" /></g></svg>
                    )}
                  </div>
                  <div style={{ padding: "18px 4px 4px" }}>
                    {post.tag && <span className="tag" style={{ color: "var(--olive)", fontWeight: 700, fontSize: "0.8rem" }}>{post.tag}</span>}
                    <h3 style={{ marginTop: 8 }}>{post.title}</h3>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <Link href={`/blog/${post.slug}`} className="card-link" style={{ marginTop: 12, display: "inline-block" }}>Read More →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
