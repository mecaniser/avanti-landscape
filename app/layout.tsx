import type { Metadata } from "next";
import SiteAnalytics from "@/components/SiteAnalytics";
import "./globals.css";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: "Avanti Landscaping | Lawn Care & Landscaping in Waxhaw, NC",
  description:
    "Avanti Landscaping provides lawn care, landscaping, hardscaping, and property maintenance in Waxhaw, Marvin, Weddington, Matthews, and nearby NC/SC communities. Call 980-328-7141 for a free quote.",
  icons: { icon: "/assets/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <template dangerouslySetInnerHTML={{ __html: "<!-- impeccable:home-property-plan|THESIS: A living property map turns four services into one accountable crew, refusing the generic service-card hero. OWN-WORLD: Field green, survey linen, graphite contours, lichen markers, stake orange. STORY: Discover the whole-property crew, choose a route, see real work, request a quote or call. FIRST VIEWPORT: Hero copy left; video property field and plotted markers right; equal actions below. FORM: Property Plan, approved comp home-property-plan-guided-route.png, seed 3c89f15e. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->" }} />
        {children}
      </body>
      {gaMeasurementId && <SiteAnalytics measurementId={gaMeasurementId} />}
    </html>
  );
}
