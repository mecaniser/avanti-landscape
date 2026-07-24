import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

// Photos come straight off a phone — several MB at ~4000px wide — but the site
// never renders them wider than about 640px. Store the original untouched and
// serve a transformed delivery URL: f_auto picks WebP/AVIF per browser, q_auto
// tunes compression, and c_limit caps the width without upscaling smaller files.
const DELIVERY_MAX_WIDTH = 1600;

export async function uploadImageBuffer(buffer: Buffer, folder = "avanti"): Promise<string> {
  const cl = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cl.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) return reject(error ?? new Error("Cloudinary upload failed"));
      resolve(
        cl.url(result.public_id, {
          secure: true,
          version: result.version,
          fetch_format: "auto",
          quality: "auto",
          crop: "limit",
          width: DELIVERY_MAX_WIDTH,
          // These URLs are persisted, so keep them free of the SDK's analytics param.
          analytics: false,
        })
      );
    });
    stream.end(buffer);
  });
}

export async function uploadVideoBuffer(buffer: Buffer, folder = "avanti/video"): Promise<string> {
  const cl = getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cl.uploader.upload_stream(
      { folder, resource_type: "video" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary video upload failed"));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
