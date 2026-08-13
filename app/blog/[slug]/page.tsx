import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.publishedAt) notFound();

  const dateLabel = post.publishedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <>
      <SiteHeader active="blog" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" style={{ color: "inherit" }}>Home</Link> /{" "}
              <Link href="/blog" style={{ color: "inherit" }}>Blog</Link> / {post.title}
            </div>
            <h1>{post.title}</h1>
          </div>
        </section>

        <section className="section">
          <div className="container article">
            <div className="article-meta">
              {post.tag && <span className="tag" style={{ color: "var(--olive)", fontWeight: 700 }}>{post.tag}</span>}
              <span>·</span>
              <span>{dateLabel}</span>
            </div>

            {post.coverImage && (
              <div className="thumb">
                <img src={post.coverImage} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <div dangerouslySetInnerHTML={{ __html: post.body }} />

            <div className="cta-band" style={{ marginTop: 40, background: "var(--cream)" }}>
              <div>
                <h2>Have questions about your lawn?</h2>
                <p>Get a free, no-pressure assessment from our team.</p>
              </div>
              <Link href="/contact" className="btn btn--primary">Get a Free Quote</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
