"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [ratio, setRatio] = useState<number | null>(null);
  const dragging = useRef(false);
  const beforeTagRef = useRef<HTMLSpanElement>(null);
  const afterTagRef = useRef<HTMLSpanElement>(null);
  // The divider position, in percent, past which each label would sit over the
  // photo it does not describe. Measured rather than assumed, because the same
  // label eats a very different share of the frame on a phone and on a desktop.
  const [tagLimits, setTagLimits] = useState({ before: 0, after: 100 });

  useEffect(() => {
    const slider = sliderRef.current;
    const beforeTag = beforeTagRef.current;
    const afterTag = afterTagRef.current;
    if (!slider || !beforeTag || !afterTag) return;

    const GAP = 8;
    const measure = () => {
      const width = slider.getBoundingClientRect().width;
      if (!width) return;
      setTagLimits({
        before: ((beforeTag.offsetLeft + beforeTag.offsetWidth + GAP) / width) * 100,
        after: ((afterTag.offsetLeft - GAP) / width) * 100,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(slider);
    return () => observer.disconnect();
  }, [ratio]);

  const showBefore = pos >= tagLimits.before;
  const showAfter = pos <= tagLimits.after;

  // Projects are shot on whatever was in hand, so the pair may be portrait or
  // landscape. The frame takes its shape from the after photo — the result is
  // what the section is selling — instead of forcing every pair into one box.
  function adoptRatio(event: { currentTarget: HTMLImageElement }) {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) setRatio(naturalWidth / naturalHeight);
  }

  function setPosFromClientX(clientX: number) {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }

  return (
    <div
      ref={sliderRef}
      className="ba-slider"
      style={{
        ["--pos" as string]: `${pos}%`,
        ...(ratio ? { ["--ba-ar" as string]: ratio.toFixed(4) } : {}),
      }}
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        setPosFromClientX(event.clientX);
      }}
      onPointerMove={(event) => {
        if (dragging.current) setPosFromClientX(event.clientX);
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Image
        className="ba-img"
        src={afterSrc}
        alt={afterAlt}
        fill
        // Eager, not `priority`: this only ever shows one slide of a
        // carousel at a time, never the page's actual LCP element, but
        // `priority` also injects a <link rel=preload> that competed with
        // the real hero image for bandwidth on the pages that embed this.
        loading="eager"
        onLoad={adoptRatio}
        sizes="(max-width: 800px) 100vw, 1180px"
      />
      <Image
        className="ba-img ba-before"
        src={beforeSrc}
        alt={beforeAlt}
        fill
        sizes="(max-width: 800px) 100vw, 1180px"
      />
      <span className="ba-tag ba-tag--before" ref={beforeTagRef} data-hidden={!showBefore} aria-hidden={!showBefore}>
        Before
      </span>
      <span className="ba-tag ba-tag--after" ref={afterTagRef} data-hidden={!showAfter} aria-hidden={!showAfter}>
        After
      </span>
      <div
        className="ba-handle"
        role="slider"
        tabIndex={0}
        aria-label="Before and after photo comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% of the before photo visible`}
        aria-orientation="horizontal"
        onKeyDown={(event) => {
          const adjustments: Record<string, (current: number) => number> = {
            ArrowLeft: (current) => Math.max(0, current - 4),
            ArrowDown: (current) => Math.max(0, current - 4),
            ArrowRight: (current) => Math.min(100, current + 4),
            ArrowUp: (current) => Math.min(100, current + 4),
            PageDown: (current) => Math.max(0, current - 10),
            PageUp: (current) => Math.min(100, current + 10),
            Home: () => 0,
            End: () => 100,
          };
          const adjust = adjustments[event.key];
          if (!adjust) return;
          event.preventDefault();
          setPos(adjust);
        }}
      >
        <span className="ba-handle-grip" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M8 5l-5 7 5 7M16 5l5 7-5 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}
