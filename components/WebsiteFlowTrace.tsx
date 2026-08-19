"use client";

import { useEffect, useState } from "react";

type TraceGeometry = {
  path: string;
  width: number;
  height: number;
};

/**
 * Continues the property-plan route into the authentic before/after proof.
 * The final point tracks the live comparison handle so the route stays honest
 * when a visitor drags the divider.
 */
export default function WebsiteFlowTrace() {
  const [geometry, setGeometry] = useState<TraceGeometry | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const property = document.querySelector<HTMLElement>("#property-route");
    const results = document.querySelector<HTMLElement>(".results-section");
    const propertyHeading = document.querySelector<HTMLElement>("#property-route-heading");
    const slider = document.querySelector<HTMLElement>(".results-section .ba-slider");
    const handle = document.querySelector<HTMLElement>(".results-section .ba-handle");
    if (!property || !results || !propertyHeading || !slider || !handle) return;

    // Every trigger below (two observers, resize, load, fonts.ready) reads five
    // rects and then sets state. Fired back to back during load — and once per
    // pointermove while the comparison handle is dragged, via the style
    // MutationObserver — that interleaves reads with React's writes and forces
    // a synchronous layout each time. Coalescing to at most one read per frame
    // keeps the geometry identical while collapsing that thrash.
    let frame = 0;
    const sync = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    const measure = () => {
      const propertyBounds = property.getBoundingClientRect();
      const resultsBounds = results.getBoundingClientRect();
      const headingBounds = propertyHeading.getBoundingClientRect();
      const sliderBounds = slider.getBoundingClientRect();
      const handleBounds = handle.getBoundingClientRect();

      const propertyExitX = Math.max(8, headingBounds.left - propertyBounds.left - 16) + propertyBounds.left - resultsBounds.left;
      const laneY = Math.min(42, Math.max(24, sliderBounds.top - resultsBounds.top - 58));
      const dividerX = handleBounds.left + handleBounds.width / 2 - resultsBounds.left;
      const dividerTopY = sliderBounds.top - resultsBounds.top;

      setGeometry({
        width: Math.max(1, results.clientWidth),
        height: Math.max(1, results.clientHeight),
        path: `M ${propertyExitX.toFixed(1)} 0 L ${propertyExitX.toFixed(1)} ${laneY.toFixed(1)} L ${dividerX.toFixed(1)} ${laneY.toFixed(1)} L ${dividerX.toFixed(1)} ${dividerTopY.toFixed(1)}`,
      });
    };

    const routeObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setRevealed(true);
        routeObserver.disconnect();
      },
      { rootMargin: "0px 0px -16% 0px" }
    );
    routeObserver.observe(results);

    const resizeObserver = new ResizeObserver(sync);
    [property, results, propertyHeading, slider, handle].forEach((element) => resizeObserver.observe(element));
    const styleObserver = new MutationObserver(sync);
    styleObserver.observe(slider, { attributes: true, attributeFilter: ["style"] });
    requestAnimationFrame(() => requestAnimationFrame(sync));
    window.addEventListener("resize", sync);
    window.addEventListener("load", sync);
    document.fonts?.ready.then(sync).catch(() => undefined);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      routeObserver.disconnect();
      resizeObserver.disconnect();
      styleObserver.disconnect();
      window.removeEventListener("resize", sync);
      window.removeEventListener("load", sync);
    };
  }, []);

  if (!geometry) return null;

  return (
    <svg
      className="website-flow-trace"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      data-revealed={revealed || undefined}
    >
      <path d={geometry.path} pathLength="1" />
    </svg>
  );
}
