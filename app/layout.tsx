import type { Metadata } from "next";
import SiteAnalytics from "@/components/SiteAnalytics";
import JsonLd from "@/components/JsonLd";
import { buildLocalBusinessSchema } from "@/lib/schema";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const DEFAULT_TITLE = "Avanti Landscaping | Lawn Care & Landscaping in Waxhaw, NC";
const DEFAULT_DESCRIPTION =
  "Avanti Landscaping provides lawn care, landscaping, hardscaping, and property maintenance in Waxhaw, Marvin, Weddington, Matthews, and nearby NC/SC communities. Call 980-328-7141 for a free quote.";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* Font files are served from gstatic, not googleapis: without this
            the preconnect above saves almost nothing. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {localBusiness && <JsonLd data={localBusiness} />}
        <template dangerouslySetInnerHTML={{ __html: "<!-- impeccable:home-property-plan|THESIS: A living property map turns four services into one accountable crew, refusing the generic service-card hero. OWN-WORLD: Field green, survey linen, graphite contours, lichen markers, stake orange. STORY: Discover the whole-property crew, choose a route, see real work, request a quote or call. FIRST VIEWPORT: Hero copy left; video property field and plotted markers right; equal actions below. FORM: Property Plan, approved comp home-property-plan-guided-route.png, seed 3c89f15e. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->" }} />
        {children}
      </body>
      {gaMeasurementId && <SiteAnalytics measurementId={gaMeasurementId} />}
    </html>
  );
}
