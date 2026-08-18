"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

type StaggeredTextProps = {
  /** Use "\n" for line breaks; each line staggers as part of one continuous sequence. */
  text: string;
  as?: ElementType;
  segmentBy?: "words" | "characters";
  /** Milliseconds between one segment's reveal and the next. */
  delay?: number;
  /** Seconds each segment takes to animate in. */
  duration?: number;
  className?: string;
  /** Which way each segment travels in as it appears. */
  direction?: "top" | "bottom";
  /** IntersectionObserver options, used only when `trigger` isn't supplied. */
  threshold?: number;
  rootMargin?: string;
  /** Supply this to drive the reveal externally (e.g. as part of a larger
   *  choreographed sequence) instead of the component's own scroll trigger. */
  trigger?: boolean;
};

const NBSP = " ";

/**
 * Splits text into words or characters and reveals them in sequence with a
 * blur-to-sharp, rise-and-fade transition — the same shape as ReactBits'
 * StaggeredText. Self-triggers on scroll into view by default; pass `trigger`
 * to drive it from a parent sequence instead.
 */
export default function StaggeredText({
  text,
  as: Tag = "span",
  segmentBy = "words",
  delay = 80,
  duration = 0.6,
  className,
  direction = "bottom",
  threshold = 0.4,
  rootMargin = "0px",
  trigger,
}: StaggeredTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [selfRevealed, setSelfRevealed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const check = window.setTimeout(
      () => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      0
    );
    return () => window.clearTimeout(check);
  }, []);

  useEffect(() => {
    if (trigger !== undefined || reduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSelfRevealed(true);
        observer.disconnect();
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger, reduced, threshold, rootMargin]);

  const revealed = reduced || (trigger !== undefined ? trigger : selfRevealed);

  const lines = text.split("\n");
  let segmentIndex = 0;
  const offset = direction === "top" ? -22 : 22;

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <span aria-hidden="true">
        {lines.map((line, lineIndex) => {
          const segments = segmentBy === "characters" ? Array.from(line) : line.split(" ");
          return (
            <span key={lineIndex} style={{ display: "block" }}>
              {segments.map((segment, i) => {
                const currentIndex = segmentIndex++;
                // Whitespace collapses to zero width at the edge of an
                // inline-block box — both a space-only segment and a
                // trailing space inside one. Keep gaps as their own
                // unstyled non-breaking-space text nodes, outside the
                // animated span, so they're never subject to that trim.
                return (
                  <span key={i}>
                    <span
                      style={{
                        display: "inline-block",
                        opacity: revealed ? 1 : 0,
                        filter: revealed ? "blur(0px)" : "blur(8px)",
                        transform: revealed ? "translateY(0)" : `translateY(${offset}px)`,
                        transition: reduced
                          ? "none"
                          : `opacity ${duration}s var(--ease-out), filter ${duration}s var(--ease-out), transform ${duration}s var(--ease-out)`,
                        transitionDelay: reduced ? "0ms" : `${currentIndex * delay}ms`,
                      }}
                    >
                      {segment === " " ? "" : segment}
                    </span>
                    {segment === " " || (segmentBy === "words" && i < segments.length - 1) ? NBSP : ""}
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}
