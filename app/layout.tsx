import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import SiteAnalytics from "@/components/SiteAnalytics";
import JsonLd from "@/components/JsonLd";
import { buildLocalBusinessSchema } from "@/lib/schema";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Self-hosted via next/font instead of a <link> to fonts.googleapis.com: that
// link was blocking first paint by ~800ms on every page (round trip to
// Google's CSS endpoint, then another to gstatic for the font files). Fonts
// exposed as CSS variables here and chained into --font-head/--font-body in
// globals.css, so no other CSS had to change.
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-head-nf",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-nf",
  display: "swap",
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const DEFAULT_TITLE = "Avanti Landscaping | Landscaping in Waxhaw, NC";
const DEFAULT_DESCRIPTION =
  "Waxhaw landscaping, lawn care, hardscaping, and property maintenance from a local, owner-involved crew. Call 980-328-7141 for a free quote today.";

export const metadata: Metadata = {
  // Required for Next to emit absolute canonical and Open Graph URLs.
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    // Pages set a short `title` and inherit the brand suffix from here.
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  icons: { icon: "/assets/avanti-mark.png" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Avanti Landscaping crew at work on a Waxhaw property" }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusiness = await buildLocalBusinessSchema();

  return (
    <html lang="en" className={`${barlowCondensed.variable} ${manrope.variable}`}>
      <body>
        {localBusiness && <JsonLd data={localBusiness} />}
        <template dangerouslySetInnerHTML={{ __html: "<!-- impeccable:home-property-plan|THESIS: A living property map turns four services into one accountable crew, refusing the generic service-card hero. OWN-WORLD: Field green, survey linen, graphite contours, lichen markers, stake orange. STORY: Discover the whole-property crew, choose a route, see real work, request a quote or call. FIRST VIEWPORT: Hero copy left; video property field and plotted markers right; equal actions below. FORM: Property Plan, approved comp home-property-plan-guided-route.png, seed 3c89f15e. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->" }} />
        {children}
      </body>
      {gaMeasurementId && <SiteAnalytics measurementId={gaMeasurementId} />}
    </html>
  );
}
