"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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
  const dragging = useRef(false);

  function setPosFromClientX(clientX: number) {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }

  return (
    <div
      ref={sliderRef}
      className="ba-slider"
      style={{ ["--pos" as string]: `${pos}%` }}
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
        sizes="(max-width: 688px) calc(100vw - 48px), 900px"
      />
      <Image
        className="ba-img ba-before"
        src={beforeSrc}
        alt={beforeAlt}
        fill
        sizes="(max-width: 688px) calc(100vw - 48px), 900px"
      />
      <span className="ba-tag ba-tag--before">Before</span>
      <span className="ba-tag ba-tag--after">After</span>
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
