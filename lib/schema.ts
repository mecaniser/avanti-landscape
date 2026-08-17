import { getGlobalContent, parseAreaList } from "@/lib/content";
import { absoluteUrl, LEGAL_NAME, SITE_NAME, SITE_URL } from "@/lib/site";

const STATE_CODE: Record<string, string> = {
  "North Carolina": "NC",
  "South Carolina": "SC",
};

/**
 * LocalBusiness node for Avanti.
 *
 * This is a service-area business: no storefront address is published
 * anywhere, so the schema deliberately omits `address` and `geo` and uses
 * `areaServed` instead. Inventing a street address to satisfy a validator
 * would put the Google Business Profile at risk.
 *
 * `areaServed` is read from the same admin-editable content block the site
 * renders, so the towns cannot drift out of sync with the /areas page.
 */
export async function buildLocalBusinessSchema() {
  const g = await getGlobalContent();

  // The admin stores the display phone in whatever shape reads well -
  // currently "(980) 328-7141". Schema wants an unambiguous dialable number,
  // so build it from digits rather than string-concatenating the display form.
  const digits = (g.phone_tel ?? g.phone ?? "9803287141").replace(/\D/g, "");
  const telephone = digits.length === 10 ? `+1${digits}` : `+${digits}`;
  const email = g.email ?? "avantilandscaping1@gmail.com";
  const areas = parseAreaList(g.area_list);

  // The footer falls back to "#" when a social URL is unset. A "#" in sameAs
  // is worse than an absent sameAs, so filter to real absolute URLs only.
  const sameAs = [g.facebook_url, g.instagram_url].filter(
    (url): url is string => typeof url === "string" && url.startsWith("http")
  );

  return {
    "@context": "https://schema.org",
    "@type": "LandscapingBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: absoluteUrl("/"),
    telephone,
    email,
    image: absoluteUrl("/assets/img/hero-mulch-wide.jpg"),
    logo: absoluteUrl("/assets/avanti-wordmark.png"),
    description:
      "Locally owned lawn care, landscaping, hardscaping, and property maintenance serving Waxhaw, NC and the surrounding communities.",
    areaServed: areas.map((area) => ({
      "@type": "City",
      name: area.name,
      addressRegion: STATE_CODE[area.state] ?? area.state,
      addressCountry: "US",
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildBreadcrumbSchema(
  trail: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
