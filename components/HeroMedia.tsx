"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroMedia({ poster, video }: { poster: string; video: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // Ensure the muted property (not just the attribute) is set so autoplay works
  // reliably across browsers.
  useEffect(() => {
    if (ref.current) ref.current.muted = true;
  }, []);

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) v.play().catch(() => {});
    setMuted(next);
  }

  return (
    <div className="hero-media">
      <img className="hero-media-img" src={poster} alt="" aria-hidden="true" />
      {video && (
        <video ref={ref} className="hero-video" autoPlay muted loop playsInline poster={poster}>
          <source src={video} type="video/mp4" />
        </video>
      )}
      <div className="hero-overlay" />
      {video && (
        <button
          type="button"
          className="hero-sound"
          onClick={toggleSound}
          aria-label={muted ? "Turn video sound on" : "Mute video"}
        >
          {muted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
