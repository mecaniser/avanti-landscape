"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { DATA_LAYER } from "@/lib/analytics";
import { sendGAEvent } from "@/lib/analytics";

/**
 * GA4, loaded after first interaction or a post-load delay.
 *
 * @next/third-parties' <GoogleAnalytics> hardcodes next/script's default
 * "afterInteractive" strategy with no way to override it, which pulled
 * gtag.js (161 KiB, ~640ms of main-thread time) into the page-load window and
 * showed up directly in Core Web Vitals. Even `lazyOnload` can still compete
 * with the LCP window on a throttled mobile connection, so the network script
 * waits for the first interaction or a delayed post-load fallback.
 *
 * The two scripts are deliberately split:
 *
 * - The bootstrap is inline and tiny (no network), so `dataLayer` exists from
 *   the start and `sendGAEvent` can queue into it immediately. Without this,
 *   a lead event fired before the idle load would be dropped.
 * - gtag.js itself is deferred, then replays whatever the bootstrap queued.
 *
 * The tradeoff is that a visitor who leaves before interacting and before the
 * ten-second fallback may go uncounted. Lead interactions trigger the library
 * immediately, while the queue preserves events raised before it finishes.
 */
export default function SiteAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    let loadTimer = 0;
    const loadAnalytics = () => {
      if (document.getElementById("ga-lib")) return;
      const script = document.createElement("script");
      script.id = "ga-lib";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      window.clearTimeout(loadTimer);
      window.removeEventListener("pointerdown", loadAnalytics);
      window.removeEventListener("keydown", loadAnalytics);
      window.removeEventListener("scroll", loadAnalytics);
    };

    const scheduleAnalytics = () => {
      loadTimer = window.setTimeout(loadAnalytics, 10_000);
    };

    if (document.readyState === "complete") scheduleAnalytics();
    else window.addEventListener("load", scheduleAnalytics, { once: true });
    window.addEventListener("pointerdown", loadAnalytics, { once: true, passive: true });
    window.addEventListener("keydown", loadAnalytics, { once: true });
    window.addEventListener("scroll", loadAnalytics, { once: true, passive: true });

    const trackContactClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const eventName = href.startsWith("tel:")
        ? "click_to_call"
        : href.startsWith("sms:")
          ? "click_to_text"
          : null;
      if (!eventName) return;

      const linkLocation = link.dataset.analyticsLocation
        ?? (link.closest("header") ? "header"
          : link.closest("footer") ? "footer"
            : link.closest("nav") ? "navigation"
              : "main_content");

      sendGAEvent("event", eventName, {
        page_path: pathname,
        link_location: linkLocation,
      });
    };

    document.addEventListener("click", trackContactClick);
    return () => {
      window.clearTimeout(loadTimer);
      window.removeEventListener("load", scheduleAnalytics);
      window.removeEventListener("pointerdown", loadAnalytics);
      window.removeEventListener("keydown", loadAnalytics);
      window.removeEventListener("scroll", loadAnalytics);
      document.removeEventListener("click", trackContactClick);
    };
  }, [measurementId, pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <Script id="ga-bootstrap" strategy="afterInteractive">
        {`window['${DATA_LAYER}']=window['${DATA_LAYER}']||[];` +
          `function gtag(){window['${DATA_LAYER}'].push(arguments);}` +
          `gtag('js',new Date());` +
          `gtag('config','${measurementId}');`}
      </Script>
    </>
  );
}
