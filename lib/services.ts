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
  /** Evidence-safe planning prompts based only on services already advertised. */
  planningPoints: string[];
  image: string;
};

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: "lawn-care",
    label: "Lawn Care",
    heading: "Lawn Care in Waxhaw, NC",
    title: "Lawn Care in Waxhaw, NC",
    description:
      "Lawn care for Waxhaw-area yards, including fertilization, weed control, aeration, overseeding, lime, and seasonal treatments. Request a free quote.",
    intro:
      "Lawns in the Waxhaw area sit in the transition zone, where summer heat is hard on cool-season grass and clay soil compacts under it. Our lawn care programs are built around that reality: feeding through the growing season, relieving compaction before it starves the roots, and treating the fungal and insect problems that show up in Carolina summers.",
    planningPoints: [
      "Share the lawn areas and symptoms you want assessed.",
      "Note whether you need ongoing care or help with a specific concern.",
      "Include any recent seeding, aeration, or treatment history you know.",
    ],
    image: "/assets/img/card-lawncare.jpg",
  },
  {
    slug: "landscaping",
    label: "Landscaping",
    heading: "Landscaping & Sod Installation",
    title: "Landscaping in Waxhaw, NC",
    description:
      "Landscaping in Waxhaw, including sod, planting, lighting, drainage, grading, seeding, and rock installation. Discuss your property and request a free quote.",
    intro:
      "Landscaping work is where a property changes shape. New sod over bare ground, beds that finally drain, plantings that suit the light they actually get. We handle the grading and drainage underneath as readily as the planting on top, because on clay soil the two decide each other.",
    planningPoints: [
      "Identify the areas you want to change and how you want to use them.",
      "Point out standing water, slopes, bare ground, light, or access concerns.",
      "Share photos or examples that clarify the result you have in mind.",
    ],
    image: "/assets/img/card-landscaping.jpg",
  },
  {
    slug: "hardscaping",
    label: "Hardscaping",
    heading: "Patios, Walkways & Retaining Walls",
    title: "Hardscaping in Waxhaw, NC",
    description:
      "Hardscaping for Waxhaw-area properties, including patios, retaining walls, fire pits, walkways, and outdoor steps. Contact Avanti for a free quote.",
    intro:
      "Hardscaping is the part of the property that has to hold up for decades: a retaining wall that stays put on a slope, a patio that does not settle, steps that stay level through freeze and thaw. It starts with base preparation and drainage, which is the work you never see and the reason the surface lasts.",
    planningPoints: [
      "Explain how the outdoor area should function when the work is complete.",
      "Point out grade, drainage, access, or connection points that affect the area.",
      "Share preferred materials or examples if you already have them.",
    ],
    image: "/assets/img/hero-mulch-wide.jpg",
  },
  {
    slug: "maintenance",
    label: "Lawn & Landscape Maintenance",
    heading: "Lawn & Landscape Maintenance",
    title: "Landscape Maintenance in Waxhaw, NC",
    description:
      "Landscape maintenance around Waxhaw, including mowing, mulch, leaf removal, seasonal cleanups, and overgrown yard cleanup. Request a free quote.",
    intro:
      "Maintenance is the routine that keeps everything else from sliding backward: mowing on a schedule, mulch refreshed before the beds bake, leaves off the turf before they mat it down. Take it as a full-season program or a one-time cleanup when a property has gotten away from you.",
    planningPoints: [
      "Tell us whether you need recurring maintenance or a one-time cleanup.",
      "List the lawn, bed, leaf, mulch, or overgrowth concerns to review.",
      "Note access details and the areas that matter most to you.",
    ],
    image: "/assets/img/card-maintenance.jpg",
  },
];

export function getServiceCategory(slug: string) {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}

export function isServiceCategorySlug(value: string): boolean {
  return SERVICE_CATEGORIES.some((category) => category.slug === value);
}

/** ContentBlock key (page: "services") an admin can use to override a category's default image. */
export function categoryImageKey(slug: string) {
  return `category_${slug.replace(/-/g, "_")}_image`;
}
