import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Website Terms",
  description: "Terms governing use of the Avanti Landscaping website and third-party Google Maps content.",
  path: "/terms",
});

export const dynamic = "force-dynamic";

export default function TermsPage() {
  return (
    <>
      <SiteHeader active="terms" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero legal-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/">Home</Link> / Terms</div>
            <h1>Website Terms</h1>
            <p>Last updated August 26, 2026</p>
          </div>
        </section>
        <section className="section">
          <div className="container legal-copy">
            <h2>Website information</h2>
            <p>This website provides general information about Avanti Landscaping&apos;s services and service area. Website content is not a binding estimate, warranty, or contract. Project scope, price, schedule, and warranty terms are established in the applicable written proposal or service agreement.</p>

            <h2>Quote requests</h2>
            <p>Submitting a form does not guarantee service availability or create a contract. Avanti may contact you using the details you provide to discuss the requested work.</p>

            <h2>Acceptable use</h2>
            <p>You may not misuse the website, interfere with its operation, attempt unauthorized access, submit unlawful content, or use automated methods that place an unreasonable burden on the service.</p>

            <h2>Google Maps content</h2>
            <p>Ratings and reviews displayed on this site are provided by Google Maps Platform and remain subject to the <a href="https://cloud.google.com/maps-platform/terms" target="_blank" rel="noopener noreferrer">Google Maps Platform Terms of Service</a> and Google&apos;s applicable user-contribution policies. Follow the source links to view the current review on Google Maps.</p>

            <h2>Third-party links</h2>
            <p>Links to Google Maps, social platforms, or other services are provided for convenience. Avanti does not control those services and is not responsible for their availability, content, or policies.</p>

            <h2>Changes and contact</h2>
            <p>These terms may be updated as the website or applicable requirements change. Questions may be sent to <a href="mailto:avantilandscaping1@gmail.com">avantilandscaping1@gmail.com</a>.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
