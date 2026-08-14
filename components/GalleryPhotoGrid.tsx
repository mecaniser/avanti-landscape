"use client";

import { useEffect, useRef, useState } from "react";

type GalleryPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

function ZoomIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="10.75" cy="10.75" r="5.75" />
      <path d="m15.25 15.25 4 4" />
      <path d="M10.75 8v5.5M8 10.75h5.5" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction === "left" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
    </svg>
  );
}

export default function GalleryPhotoGrid({ images }: { images: GalleryPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? null : images[activeIndex];

  function closeViewer() {
    dialogRef.current?.close();
    setActiveIndex(null);
  }

  function move(direction: -1 | 1) {
    setActiveIndex((current) => current === null ? null : (current + direction + images.length) % images.length);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activePhoto && !dialog.open) dialog.showModal();
    if (!activePhoto && dialog.open) dialog.close();
  }, [activePhoto]);

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  return (
    <>
      <div className="gallery-grid">
        {images.map((image, index) => {
          const description = image.caption || "Avanti Landscaping project photo";
          return (
            <button
              key={image.id}
              type="button"
              className="gallery-item"
              aria-label={`View ${description} larger`}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image.url} alt={description} loading="lazy" />
              <span className="gallery-item__shade" aria-hidden="true" />
              {image.caption && <span className="caption">{image.caption}</span>}
              <span className="gallery-item__view" aria-hidden="true"><ZoomIcon /> View photo</span>
            </button>
          );
        })}
      </div>

      <dialog
        ref={dialogRef}
        className="gallery-viewer"
        aria-label={activePhoto?.caption ? `Viewing ${activePhoto.caption}` : "Viewing project photo"}
        onCancel={closeViewer}
        onClose={() => setActiveIndex(null)}
        onClick={(event) => { if (event.target === event.currentTarget) closeViewer(); }}
      >
        {activePhoto && (
          <div className="gallery-viewer__frame">
            <img src={activePhoto.url} alt={activePhoto.caption || "Avanti Landscaping project photo"} />
            <div className="gallery-viewer__footer">
              <div>
                <p>{activePhoto.caption || "Avanti Landscaping project photo"}</p>
                <span>{activeIndex! + 1} of {images.length}</span>
              </div>
              <div className="gallery-viewer__controls">
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => move(-1)} aria-label="Previous photo"><ArrowIcon direction="left" /></button>
                    <button type="button" onClick={() => move(1)} aria-label="Next photo"><ArrowIcon direction="right" /></button>
                  </>
                )}
                <button type="button" onClick={closeViewer} aria-label="Close photo viewer" className="gallery-viewer__close">Close</button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
