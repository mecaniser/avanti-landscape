/**
 * GA4 event helper.
 *
 * Replaces `sendGAEvent` from @next/third-parties, which only works when that
 * package's own <GoogleAnalytics> component rendered (it captures the data
 * layer name in module state and silently no-ops otherwise). SiteAnalytics
 * now loads gtag.js itself so the download can be deferred, so events go
 * straight to the data layer here.
 *
 * Safe to call before gtag.js has finished loading: `dataLayer` is a plain
 * array seeded by an inline bootstrap script, and gtag replays whatever is
 * queued in it once the library arrives. That matters because the lead event
 * fires on form submit, which can easily happen before an idle-loaded script.
 */
export const DATA_LAYER = "dataLayer";

type GtagArgs =
  | [command: "event", eventName: string, params?: Record<string, unknown>]
  | [command: "config", targetId: string, params?: Record<string, unknown>];

export function sendGAEvent(...args: GtagArgs) {
  if (typeof window === "undefined") return;
  const w = window as unknown as Record<string, unknown[]>;
  // Seeded by the bootstrap script in SiteAnalytics, but a page that renders
  // without analytics configured never gets that, so create it defensively
  // rather than dropping the call.
  w[DATA_LAYER] = w[DATA_LAYER] ?? [];
  // gtag pushes `arguments` (an array-like), not a real array. Matching that
  // shape matters: gtag.js reads these back positionally.
  w[DATA_LAYER].push(args);
}
