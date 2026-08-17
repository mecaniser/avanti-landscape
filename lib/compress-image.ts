/**
 * Browser-side image shrinking, run before the file is put on the wire.
 *
 * Photos come straight off a phone or camera at 4000px and, for TIFF, with no
 * compression at all — tens of megabytes for something the site never renders
 * wider than 1600px. Without this the browser uploads the full original and the
 * server rejects it after the whole transfer has already happened.
 *
 * Not every format can be decoded here: Chrome and Firefox have no TIFF or HEIC
 * decoder, so `createImageBitmap` throws. In that case the original file is
 * returned untouched and the caller's size check produces the error.
 */

const MAX_EDGE = 2560;
const JPEG_QUALITY = 0.82;

/** Below this, re-encoding costs quality without buying meaningful bytes. */
const SKIP_UNDER_BYTES = 1024 * 1024;

export type CompressOutcome = {
  file: File;
  /** False when the browser could not decode the format (TIFF, HEIC, …). */
  compressed: boolean;
  originalBytes: number;
};

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

function renamed(original: string, extension: string) {
  return `${original.replace(/\.[^./\\]+$/, "")}.${extension}`;
}

export async function compressImage(file: File): Promise<CompressOutcome> {
  const originalBytes = file.size;
  const unchanged = { file, compressed: false, originalBytes };

  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return unchanged;
  if (file.size <= SKIP_UNDER_BYTES) return unchanged;
  if (typeof createImageBitmap !== "function") return unchanged;

  let bitmap: ImageBitmap;
  try {
    // from-image applies the EXIF orientation phones write instead of rotating
    // the pixels, which would otherwise land sideways once we re-encode.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return unchanged;
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return unchanged;

    // PNG keeps its alpha channel; everything else becomes JPEG, so flatten
    // onto white rather than letting transparency render as black.
    const keepPng = file.type === "image/png";
    if (!keepPng) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(bitmap, 0, 0, width, height);

    const type = keepPng ? "image/png" : "image/jpeg";
    const blob = await canvasToBlob(canvas, type, keepPng ? undefined : JPEG_QUALITY);
    if (!blob || blob.size >= originalBytes) return unchanged;

    const name = renamed(file.name, keepPng ? "png" : "jpg");
    return {
      file: new File([blob], name, { type, lastModified: file.lastModified }),
      compressed: true,
      originalBytes,
    };
  } finally {
    bitmap.close();
  }
}
