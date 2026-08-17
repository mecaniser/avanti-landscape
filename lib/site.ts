/**
 * Canonical site origin, used for metadataBase, canonical URLs, Open Graph
 * images, the sitemap, and JSON-LD. Every absolute URL the site emits comes
 * from here, so there is exactly one place to change if the domain moves.
 *
 * `www` is canonical: the apex 301s to www at the DNS/proxy layer, matching
 * the redirect direction the business already used before the cutover.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.avantilandscapingnc.com"
).replace(/\/$/, "");

export const SITE_NAME = "Avanti Landscaping";
export const LEGAL_NAME = "Avanti Landscaping LLC";

/** Default social preview image. Absolute URLs are required by OG consumers. */
export const OG_IMAGE = `${SITE_URL}/assets/img/hero-mulch-wide.jpg`;

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Builds a page's metadata.
 *
 * Next does NOT deep-merge `openGraph`: a page that sets its own openGraph
 * block replaces the parent's entirely, silently dropping the inherited
 * image. This helper keeps title, description, canonical, and the social
 * tags in sync from one call so that cannot happen per page.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title: fullTitle,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

/**
 * Cloudinary URLs are already absolute; DB-authored paths may be relative.
 * OG images must be absolute either way.
 */
export function absoluteImage(src: string | null | undefined) {
  if (!src) return OG_IMAGE;
  return src.startsWith("http") ? src : absoluteUrl(src);
}
