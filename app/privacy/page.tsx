import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Avanti Landscaping handles website, quote-request, analytics, and Google Maps review data.",
  path: "/privacy",
});

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader active="privacy" />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero legal-hero">
          <div className="container">
            <div className="breadcrumb"><Link href="/">Home</Link> / Privacy</div>
            <h1>Privacy Policy</h1>
            <p>Last updated August 26, 2026</p>
          </div>
        </section>
        <section className="section">
          <div className="container legal-copy">
            <h2>Information you provide</h2>
            <p>When you request a quote or contact us, we collect the information you submit, such as your name, email address, phone number, service interest, and message. We use it to respond to your request and provide landscaping services.</p>

            <h2>Website analytics</h2>
            <p>We use Google Analytics to understand public-site traffic and successful quote requests. We do not intentionally send names, email addresses, phone numbers, or free-text messages to analytics.</p>

            <h2>Google Maps content</h2>
            <p>Our homepage displays public rating and review information supplied by Google Maps Platform. Review content includes public reviewer attribution and links back to Google Maps. Reviewer images may load directly from Google, which can receive standard connection information such as your IP address and browser details.</p>

            <h2>Service providers and retention</h2>
            <p>We use service providers to host the website, deliver form notifications, store uploaded site media, and measure site performance. Quote-request records are retained as needed to respond, operate the business, and meet legal obligations. Google Maps review content is requested from Google and is not permanently stored in Avanti&apos;s website database.</p>

            <h2>Your choices</h2>
            <p>You may contact us to ask about or request correction or deletion of personal information you submitted, subject to applicable legal and operational requirements.</p>

            <h2>External services</h2>
            <p>Google services are governed by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>. Links to other websites are governed by those sites&apos; own policies.</p>

            <h2>Contact</h2>
            <p>Questions about this policy may be sent to <a href="mailto:avantilandscaping1@gmail.com">avantilandscaping1@gmail.com</a>.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
