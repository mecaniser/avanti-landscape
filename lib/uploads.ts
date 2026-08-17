/**
 * Shared between the browser form and the upload route so the two never
 * disagree about what will be accepted. Cloudinary's free plan rejects images
 * over 10 MB and videos over 100 MB, so those are the real ceilings — anything
 * higher here would pass our own check and then fail at Cloudinary with a
 * generic error.
 */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export type UploadKind = "image" | "video";

export function maxBytesFor(kind: UploadKind) {
  return kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
}

export function oversizeMessage(kind: UploadKind, actualBytes: number) {
  const limitMb = Math.round(maxBytesFor(kind) / 1024 / 1024);
  const actualMb = (actualBytes / 1024 / 1024).toFixed(1);
  const noun = kind === "image" ? "Images" : "Videos";
  return `${noun} must be ${limitMb} MB or smaller. This file is ${actualMb} MB.`;
}
