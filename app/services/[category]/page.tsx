import type { Metadata } from "next";
import Link from "next/link";
import MediaFrame from "@/components/MediaFrame";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, pageMetadata, SITE_URL } from "@/lib/site";
import { getServiceCategory, SERVICE_CATEGORIES, categoryImageKey } from "@/lib/services";
import { getPublishedPostsByService, getServicesByCategory } from "@/lib/queries";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getServiceCategory(category);
  if (!cat) return { title: "Service Not Found", robots: { index: false, follow: false } };

  const c = await getContent("services");
  const image = c[categoryImageKey(cat.slug)] || cat.image;

  return pageMetadata({
    title: cat.title,
    description: cat.description,
    path: `/services/${cat.slug}`,
    image: absoluteUrl(image),
  });
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getServiceCategory(category);
  if (!cat) notFound();

  const [services, c, guides] = await Promise.all([
    getServicesByCategory(cat.slug),
    getContent("services"),
    getPublishedPostsByService(cat.slug),
  ]);
  const withPhotos = services.filter((s) => s.image);
  const textOnly = services.filter((s) => !s.image);

  const others = SERVICE_CATEGORIES.filter((c) => c.slug !== cat.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: cat.heading,
          description: cat.description,
          url: absoluteUrl(`/services/${cat.slug}`),
          serviceType: cat.label,
          provider: { "@id": `${SITE_URL}/#business` },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: cat.label,
            itemListElement: services.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.name, description: s.description },
            })),
          },
        }}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: cat.label, path: `/services/${cat.slug}` },
        ])}
      />
      <SiteHeader active="services" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/" style={{ color: "inherit" }}>Home</Link> /{" "}
              <Link href="/services" style={{ color: "inherit" }}>Services</Link> / {cat.label}
            </div>
            <h1>{cat.heading}</h1>
            <p>{cat.intro}</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="category-block" id={cat.slug} style={{ marginBottom: 0 }}>
              <div className="category-head">
                <div>
                  <span className="eyebrow">What&apos;s included</span>
                  <h2>{cat.label} services</h2>
                </div>
              </div>
              {/* Services with a photo of their own work lead the list as image
                  cards. The rest keep the text card: borrowing a photo of
                  different work would show a lawn on a patio listing. */}
              <div className="service-row">
                {withPhotos.map((s) => (
                  <article className="service-card" key={s.id}>
                    <MediaFrame
                      className="service-card__media"
                      src={s.image!}
                      alt={`${s.name} by Avanti Landscaping in Waxhaw, NC`}
                      fill
                      quality={60}
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="service-card__body">
                      <h3>{s.name}</h3>
                      <p>{s.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              {textOnly.length > 0 && (
                <div className="service-row service-row--text">
                  {textOnly.map((s) => (
                    <div className="service-item" key={s.id}>
                      <span className="dot"></span>
                      <div>
                        <h3>{s.name}</h3>
                        <p>{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section section--tight service-planning">
          <div className="container service-planning-grid">
            <div>
              <span className="eyebrow">Before you request a quote</span>
              <h2>Help us understand your property</h2>
              <p>A useful first conversation starts with the conditions you see and the result you want.</p>
            </div>
            <ul className="service-planning-list">
              {cat.planningPoints.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </section>

        {guides.length > 0 && (
          <section className="section section--tight section--cream">
            <div className="container">
              <div className="section-head">
                <h2>{cat.label} guides</h2>
                <p>Use these local articles to prepare questions and compare the options already covered by Avanti.</p>
              </div>
              <div className="grid grid--3">
                {guides.map((guide) => (
                  <article className="blog-card" key={guide.id}>
                    <div className="body">
                      {guide.tag && <span className="tag">{guide.tag}</span>}
                      <h3>{guide.title}</h3>
                      {guide.excerpt && <p>{guide.excerpt}</p>}
                      <Link href={`/blog/${guide.slug}`} className="card-link">Read {guide.title} →</Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section section--tight section--cream">
          <div className="container">
            <div className="section-head">
              <h2>Other services we offer</h2>
              <p>We work as one crew across the whole property, so these often go together.</p>
            </div>
            <div className="grid grid--3">
              {others.map((o) => (
                <Link href={`/services/${o.slug}`} className="blog-card" key={o.slug} style={{ textDecoration: "none" }}>
                  <MediaFrame
                    className="thumb"
                    style={{ objectFit: "cover" }}
                    src={c[categoryImageKey(o.slug)] || o.image}
                    alt={`${o.label} work by Avanti Landscaping`}
                    fill
                    quality={60}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                  <div style={{ padding: "18px 4px 4px" }}>
                    <h3 style={{ marginTop: 8 }}>{o.label}</h3>
                    <span className="card-link">Learn more →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--tight">
          <div className="container">
            <div className="cta-band">
              <div>
                <h2>Want a quote for {cat.label.toLowerCase()}?</h2>
                <p>Tell us about your property and we&apos;ll get you a free, no-pressure estimate.</p>
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
