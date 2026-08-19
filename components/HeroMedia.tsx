"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function HeroMedia({ poster, video }: { poster: string; video: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [canPlayVideo, setCanPlayVideo] = useState(false);

  // Start with the poster and only mount the video after hydration. This keeps
  // motion media off the network when the visitor requests reduced motion or
  // data savings, while preserving a complete no-JavaScript hero.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;

    const updateVideoPreference = () => {
      const constrainedConnection =
        connection?.saveData || connection?.effectiveType?.includes("2g");
      setCanPlayVideo(!motion.matches && !constrainedConnection);
    };

    updateVideoPreference();
    motion.addEventListener("change", updateVideoPreference);
    return () => motion.removeEventListener("change", updateVideoPreference);
  }, []);

  useEffect(() => {
    if (canPlayVideo && ref.current) ref.current.muted = true;
  }, [canPlayVideo]);

  function togglePlayback() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }

  function replay() {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    setEnded(false);
    setPaused(false);
    v.play().catch(() => {});
  }

  return (
    <>
      <div className="hero-media">
        <Image
          className="hero-media-img"
          src={poster}
          alt=""
          aria-hidden="true"
          fill
          priority
          fetchPriority="high"
          // This is the LCP element on every page that renders it, so its
          // byte weight matters more than most images on the site. 60 is
          // visually indistinguishable from the default 75 on a full-bleed
          // photo background but meaningfully smaller to download.
          quality={60}
          sizes="100vw"
        />
        {video && canPlayVideo && (
          <video
            ref={ref}
            className="hero-video"
            autoPlay
            muted
            playsInline
            poster={poster}
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            onEnded={() => {
              setEnded(true);
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
        <div className="hero-overlay" />

      </div>

      {video && canPlayVideo && (
        <div className="hero-controls" role="group" aria-label="Background video controls">
          {ended ? (
            <button type="button" className="hero-control" onClick={replay} aria-label="Replay video">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          ) : (
            // The hero clip carries no audio track, so there is nothing to
            // unmute and no sound control to offer.
            <button type="button" className="hero-control" onClick={togglePlayback} aria-label={paused ? "Play background video" : "Pause background video"}>
              {paused ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
}
