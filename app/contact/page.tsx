import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { getContent, getGlobalContent } from "@/lib/content";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Get a Free Landscaping Quote in Waxhaw, NC",
  description:
    "Request a free, no-pressure quote from Avanti Landscaping. Call or text 980-328-7141, or send us a message. Serving Waxhaw, Marvin, Weddington, Matthews, and nearby communities.",
  path: "/contact",
});

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [c, g] = await Promise.all([getContent("contact"), getGlobalContent()]);
  const phone = g.phone ?? "980-328-7141";
  const phoneTel = g.phone_tel ?? "9803287141";
  const email = g.email ?? "avantilandscaping1@gmail.com";
  const hours = g.hours ?? "Monday – Saturday, 8am – 6pm";

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <SiteHeader active="contact" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/" style={{ color: "inherit" }}>Home</Link> / Contact</div>
            <h1>Get a Free Quote</h1>
            <p>{c.hero_paragraph}</p>
          </div>
        </section>

        <section className="section">
          <div className="container contact-grid">
            <div className="contact-form-column">
              <div className="contact-form-card">
                <h2 className="contact-panel-title">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>

            <aside className="contact-details-column" aria-label="Contact information">
              <div className="contact-info-card">
                <div className="contact-info-list">
                  <div className="contact-info-row">
                    <div className="ico">📞</div>
                    <div><strong>Call or Text</strong><span><a href={`tel:${phoneTel}`}>{phone}</a></span></div>
                  </div>
                  <div className="contact-info-row">
                    <div className="ico">✉️</div>
                    <div><strong>Email</strong><span><a href={`mailto:${email}`}>{email}</a></span></div>
                  </div>
                  <div className="contact-info-row">
                    <div className="ico">📍</div>
                    <div><strong>Based In</strong><span>Waxhaw, NC</span></div>
                  </div>
                  <div className="contact-info-row">
                    <div className="ico">🕐</div>
                    <div><strong>Hours</strong><span>{hours}</span></div>
                  </div>
                  <div className="contact-info-row">
                    <div className="ico">🌐</div>
                    <div>
                      <strong>Follow Us</strong>
                      <span>
                        <a href={g.facebook_url} target="_blank" rel="noopener">Facebook</a> ·{" "}
                        <a href={g.instagram_url} target="_blank" rel="noopener">Instagram</a>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="contact-coverage">
                  <h3>Where We Work</h3>
                  <p>Waxhaw, Marvin, Weddington, Wesley Chapel, Matthews, Stallings, Pineville, Indian Land, and Ballantyne.</p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
