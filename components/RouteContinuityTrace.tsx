"use client";

import { useEffect, useState, type RefObject } from "react";

type RouteContinuityTraceProps = {
  sectionRef: RefObject<HTMLElement | null>;
  revealed: boolean;
};

/**
 * Draw one route across the hero/section seam. The source spine and destination
 * heading live in independent layout contexts, so their rendered geometry—not
 * viewport percentages—defines this path.
 */
export default function RouteContinuityTrace({ sectionRef, revealed }: RouteContinuityTraceProps) {
  const [path, setPath] = useState("");
  const [viewport, setViewport] = useState({ width: 1, height: 1 });

  useEffect(() => {
    const section = sectionRef.current;
    const heroPlot = document.querySelector<HTMLElement>(".hero-plot");
    const heroLine = document.querySelector<HTMLElement>("[data-hero-route-line]");
    const heading = section?.querySelector<HTMLElement>("#property-route-heading");
    if (!section || !heroPlot || !heroLine || !heading) return;

    const sync = () => {
      const sectionBounds = section.getBoundingClientRect();
      const plotBounds = heroPlot.getBoundingClientRect();
      const headingBounds = heading.getBoundingClientRect();
      const angle = 4 * Math.PI / 180;
      const heroLineTop = plotBounds.top + heroLine.offsetTop;
      const verticalDistance = sectionBounds.top - heroLineTop;
      const startX = plotBounds.left + heroLine.offsetLeft + heroLine.offsetWidth / 2
        // CSS rotate(4deg) moves a vertical line left as it travels down the
        // screen. Match that transformed endpoint at the section seam.
        - Math.tan(angle) * verticalDistance - sectionBounds.left;
      // Keep the horizontal lane deliberately clear of the heading, then run
      // down its left edge. The route reads before it meets any content.
      const startLaneY = Math.min(124, Math.max(78, headingBounds.top - sectionBounds.top - 48));
      // Use the outer gutter, not the headline's first character, as the
      // descent. On compact layouts the content container begins near the
      // viewport edge, so a small fixed gutter is safer than an arbitrary
      // large clamp.
      const targetX = Math.max(8, headingBounds.left - sectionBounds.left - 16);
      const headingEndY = Math.min(sectionBounds.height - 30, headingBounds.bottom - sectionBounds.top + 18);
      const sectionExitY = Math.max(headingEndY, sectionBounds.height - 1);
      const continuedX = startX - Math.tan(angle) * startLaneY;

      setPath(`M ${startX.toFixed(1)} 0 L ${continuedX.toFixed(1)} ${startLaneY.toFixed(1)} L ${targetX.toFixed(1)} ${startLaneY.toFixed(1)} L ${targetX.toFixed(1)} ${headingEndY.toFixed(1)} L ${targetX.toFixed(1)} ${sectionExitY.toFixed(1)}`);
      setViewport({ width: Math.max(1, section.clientWidth), height: Math.max(1, section.clientHeight) });
    };

    const observer = new ResizeObserver(sync);
    observer.observe(section);
    observer.observe(heroPlot);
    observer.observe(heading);
    requestAnimationFrame(() => requestAnimationFrame(sync));
    window.addEventListener("resize", sync);
    window.addEventListener("load", sync);
    document.fonts?.ready.then(sync).catch(() => undefined);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("load", sync);
    };
  }, [sectionRef]);

  if (!path) return null;

  return (
    <svg
      className="route-continuity-trace"
      viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-revealed={revealed || undefined}
    >
      <path d={path} pathLength="1" />
    </svg>
  );
}
