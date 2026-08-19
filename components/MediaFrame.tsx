"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * A positioned frame around a `fill` image that shows a skeleton until the
 * photo actually decodes.
 *
 * Lazy-loaded photography further down a page (blog cards, gallery tiles,
 * service cards) otherwise leaves an empty box while the file is in flight,
 * which reads as broken rather than loading. The skeleton is CSS, but the
 * "stop animating" signal has to come from the image's own load event, so
 * this has to be a client component even where its parent page is not.
 *
 * `onError` settles the frame too: a photo that 404s should end up looking
 * like an empty frame, not one that is perpetually loading.
 */
export default function MediaFrame({
  className,
  children,
  ...imageProps
}: ImageProps & { className?: string; children?: React.ReactNode }) {
  const [settled, setSettled] = useState(false);

  return (
    <div className={className} data-media-frame="" data-loaded={settled ? "" : undefined}>
      <Image {...imageProps} onLoad={() => setSettled(true)} onError={() => setSettled(true)} />
      {children}
    </div>
  );
}
