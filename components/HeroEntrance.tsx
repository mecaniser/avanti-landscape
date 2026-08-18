"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * The hero is always above the fold on load, so entry is time-triggered
 * rather than scroll-triggered (contrast PropertyRoute, which waits for an
 * IntersectionObserver). `display: contents` keeps this wrapper out of the
 * hero grid so `.hero-copy` and `<HeroServiceRoute />` stay direct grid
 * children of `.hero--property-plan .container`.
 */
export default function HeroEntrance({ children }: { children: ReactNode }) {
  const [entryState, setEntryState] = useState<"pending" | "revealed" | "settled">("pending");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = window.setTimeout(() => setEntryState("settled"), 0);
      return () => window.clearTimeout(skip);
    }
    const reveal = window.setTimeout(() => setEntryState("revealed"), 20);
    // Once the sequence finishes, drop the reveal transition override so
    // .plot-marker's own hover transition (220ms) applies again instead of
    // staying pinned to the slower, delayed entrance timing forever.
    const settle = window.setTimeout(() => setEntryState("settled"), 1500);
    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(settle);
    };
  }, []);

  return (
    <div className="hero-entrance" data-entry={entryState} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
