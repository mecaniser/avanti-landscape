"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroMedia({ poster, video }: { poster: string; video: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const [showBrand, setShowBrand] = useState(false);

  // Ensure the muted property (not just the attribute) is set so autoplay works
  // reliably across browsers.
  useEffect(() => {
    if (ref.current) ref.current.muted = true;
  }, []);

  function onTimeUpdate() {
    const v = ref.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    // Reveal the brand sign-off in the final ~2 seconds.
    if (v.duration - v.currentTime <= 2) setShowBrand(true);
  }

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) v.play().catch(() => {});
    setMuted(next);
  }

  function replay() {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    setShowBrand(false);
    v.play().catch(() => {});
  }

  return (
    <>
      <div className="hero-media">
        <img className="hero-media-img" src={poster} alt="" aria-hidden="true" />
        {video && (
          <video
            ref={ref}
            className="hero-video"
            autoPlay
            muted
            playsInline
            poster={poster}
            onTimeUpdate={onTimeUpdate}
            onEnded={() => {
              setEnded(true);
              setShowBrand(true);
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
        <div className="hero-overlay" />

        {video && (
          <div className={`hero-endcard${showBrand ? " is-visible" : ""}`} aria-hidden="true">
            <div className="hero-endcard-lockup">
              <img src="/assets/logo.svg" alt="" />
              <strong>Avanti Landscaping</strong>
              <span>Lawn &amp; Landscape Co.</span>
              <em>Waxhaw, NC</em>
            </div>
          </div>
        )}
      </div>

      {video && (
        <div className="hero-controls">
          {ended ? (
            <button type="button" className="hero-control" onClick={replay} aria-label="Replay video">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          ) : (
            <button type="button" className="hero-control" onClick={toggleSound} aria-label={muted ? "Turn video sound on" : "Mute video"}>
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
      )}
    </>
  );
}
