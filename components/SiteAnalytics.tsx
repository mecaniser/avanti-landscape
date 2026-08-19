"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { DATA_LAYER } from "@/lib/analytics";

/**
 * GA4, loaded on idle rather than during page load.
 *
 * @next/third-parties' <GoogleAnalytics> hardcodes next/script's default
 * "afterInteractive" strategy with no way to override it, which pulled
 * gtag.js (161 KiB, ~640ms of main-thread time) into the page-load window and
 * showed up directly in Core Web Vitals. Loading it ourselves is the only way
 * to move it to "lazyOnload".
 *
 * The two scripts are deliberately split:
 *
 * - The bootstrap is inline and tiny (no network), so `dataLayer` exists from
 *   the start and `sendGAEvent` can queue into it immediately. Without this,
 *   a lead event fired before the idle load would be dropped.
 * - gtag.js itself is deferred, then replays whatever the bootstrap queued.
 *
 * The tradeoff is that a visitor who leaves within the first second or so may
 * never load gtag.js and so goes uncounted. For a lead-generation site that is
 * an acceptable trade for the main-thread time; the conversion event, which is
 * the number that actually matters here, is preserved by the queue above.
 */
export default function SiteAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <Script id="ga-bootstrap" strategy="afterInteractive">
        {`window['${DATA_LAYER}']=window['${DATA_LAYER}']||[];` +
          `function gtag(){window['${DATA_LAYER}'].push(arguments);}` +
          `gtag('js',new Date());` +
          `gtag('config','${measurementId}');`}
      </Script>
      <Script
        id="ga-lib"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
    </>
  );
}
