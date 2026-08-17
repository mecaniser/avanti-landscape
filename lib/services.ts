/**
 * The four service lines, each with its own page.
 *
 * Previously these were anchor fragments on a single /services URL, so all
 * four competed as one search result. `slug` here is the same id the old
 * anchors used, so existing `/services#lawn-care` style links still land
 * somewhere sensible.
 *
 * Copy lives in code rather than ContentBlock because the admin's page editor
 * only renders rows that already exist, so DB-backed copy would need seeding
 * to be editable at all. The service names and descriptions under each
 * category still come from the admin-managed `Service` table.
 */
export type ServiceCategory = {
  slug: string;
  /** Short label for nav and cards. */
  label: string;
  /** Page H1. */
  heading: string;
  /** <title>, brand suffix appended by the metadata helper. */
  title: string;
  description: string;
  /** Lead paragraph under the H1. */
  intro: string;
  image: string;
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "lawn-care",
    label: "Lawn Care",
    heading: "Lawn Care in Waxhaw, NC",
    title: "Lawn Care in Waxhaw, NC: Fertilization, Aeration & Weed Control",
    description:
      "Season-long lawn care for Waxhaw-area yards: fertilization, weed control, core aeration, overseeding, lime, brown patch, and grub treatments. Free quotes from a local, owner-involved crew.",
    intro:
      "Lawns in the Waxhaw area sit in the transition zone, where summer heat is hard on cool-season grass and clay soil compacts under it. Our lawn care programs are built around that reality: feeding through the growing season, relieving compaction before it starves the roots, and treating the fungal and insect problems that show up in Carolina summers.",
    image: "/assets/img/card-lawncare.jpg",
  },
  {
    slug: "landscaping",
    label: "Landscaping",
    heading: "Landscaping & Sod Installation",
    title: "Landscaping & Sod Installation in Waxhaw, NC",
    description:
      "Plantings, annual flowers, sod installation, new lawn seeding, landscape lighting, drainage and grading, and rock installation for homes and businesses around Waxhaw, NC.",
    intro:
      "Landscaping work is where a property changes shape. New sod over bare ground, beds that finally drain, plantings that suit the light they actually get. We handle the grading and drainage underneath as readily as the planting on top, because on clay soil the two decide each other.",
    image: "/assets/img/card-landscaping.jpg",
  },
  {
    slug: "hardscaping",
    label: "Hardscaping",
    heading: "Patios, Walkways & Retaining Walls",
    title: "Hardscaping in Waxhaw, NC: Patios, Retaining Walls & Fire Pits",
    description:
      "Patios, retaining walls, fire pits, walkways, and outdoor steps built for homes around Waxhaw, Marvin, Weddington, and Matthews. Free quotes from a local crew.",
    intro:
      "Hardscaping is the part of the property that has to hold up for decades: a retaining wall that stays put on a slope, a patio that does not settle, steps that stay level through freeze and thaw. It starts with base preparation and drainage, which is the work you never see and the reason the surface lasts.",
    image: "/assets/img/hero-mulch-wide.jpg",
  },
  {
    slug: "maintenance",
    label: "Lawn & Landscape Maintenance",
    heading: "Lawn & Landscape Maintenance",
    title: "Lawn & Landscape Maintenance in Waxhaw, NC",
    description:
      "Mowing, mulch installation, leaf removal, spring and fall cleanups, overgrown yard cleanup, and full-service maintenance programs for Waxhaw-area properties.",
    intro:
      "Maintenance is the routine that keeps everything else from sliding backward: mowing on a schedule, mulch refreshed before the beds bake, leaves off the turf before they mat it down. Take it as a full-season program or a one-time cleanup when a property has gotten away from you.",
    image: "/assets/img/card-maintenance.jpg",
  },
];

export function getServiceCategory(slug: string) {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}
