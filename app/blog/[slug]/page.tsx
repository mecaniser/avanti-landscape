import type { Metadata } from "next";
import Link from "next/link";
import MediaFrame from "@/components/MediaFrame";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { absoluteImage, absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import { getPostBySlug, getRelatedPosts } from "@/lib/queries";
import { getServiceCategory } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // Unpublished and missing posts 404 in the page below; give the crawler
  // nothing to index in the meantime.
  if (!post || !post.publishedAt) {
    return { title: "Post Not Found", robots: { index: false, follow: false } };
  }

  const description =
    post.excerpt ?? `Lawn and landscape advice from the Avanti Landscaping crew in Waxhaw, NC.`;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: `${post.title} | ${SITE_NAME}`,
      description,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: [{ url: absoluteImage(post.coverImage) }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${SITE_NAME}`,
      description,
      images: [absoluteImage(post.coverImage)],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.publishedAt) notFound();
  const [relatedPosts, primaryService] = await Promise.all([
    getRelatedPosts(post.id, post.primaryServiceSlug),
    Promise.resolve(post.primaryServiceSlug ? getServiceCategory(post.primaryServiceSlug) : undefined),
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: absoluteImage(post.coverImage),
    // Raw ISO timestamps, not the "Month YYYY" display string below.
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    author: { "@id": `${SITE_URL}/#business` },
    publisher: { "@id": `${SITE_URL}/#business` },
  };

  const dateFormat = { month: "long", day: "numeric", year: "numeric" } as const;
  const publishedLabel = post.publishedAt.toLocaleDateString("en-US", dateFormat);
  const updatedLabel = post.updatedAt.toLocaleDateString("en-US", dateFormat);
  const showUpdated = post.updatedAt.toDateString() !== post.publishedAt.toDateString();

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
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
              <span>By Avanti Landscaping crew</span>
              <span>·</span>
              <span>Published {publishedLabel}</span>
              {showUpdated && <><span>·</span><span>Updated {updatedLabel}</span></>}
            </div>

            {post.coverImage && (
              <MediaFrame className="thumb" src={post.coverImage} alt={post.title} fill priority fetchPriority="high" quality={60}
                sizes="(max-width: 800px) 100vw, 760px" style={{ objectFit: "cover" }} />
            )}

            <div dangerouslySetInnerHTML={{ __html: post.body }} />

            {(primaryService || relatedPosts.length > 0) && (
              <aside className="article-related" aria-labelledby="article-related-heading">
                <h2 id="article-related-heading">Continue planning your property</h2>
                {primaryService && (
                  <p>
                    Related service: <Link href={`/services/${primaryService.slug}`}>{primaryService.label} in Waxhaw, NC</Link>
                  </p>
                )}
                {relatedPosts.length > 0 && (
                  <ul>
                    {relatedPosts.map((related) => (
                      <li key={related.id}><Link href={`/blog/${related.slug}`}>{related.title}</Link></li>
                    ))}
                  </ul>
                )}
              </aside>
            )}

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
