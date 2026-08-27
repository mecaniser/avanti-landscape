export type RouteKey = "lawn" | "landscaping" | "hardscaping" | "maintenance";

export type PropertyRouteItem = {
  id: RouteKey;
  name: string;
  summary: string;
  href: string;
  image: string;
  alt: string;
  marker: "grass" | "plant" | "stone" | "tools";
};

export const PROPERTY_ROUTES: PropertyRouteItem[] = [
  { id: "lawn", name: "Lawn Care", summary: "Fertilization, weed control, aeration, and seeding for a thicker, healthier lawn.", href: "/services/lawn-care", image: "/assets/img/card-lawncare.jpg", alt: "Avanti Landscaping crew applying a lawn treatment", marker: "grass" },
  { id: "landscaping", name: "Landscaping", summary: "Plantings, sod, lighting, drainage, and grading that make the property work better and look cared for.", href: "/services/landscaping", image: "/assets/img/card-landscaping.jpg", alt: "Fresh sod installation by Avanti Landscaping", marker: "plant" },
  { id: "hardscaping", name: "Hardscaping", summary: "Edging, stone, drainage details, and outdoor improvements planned as part of the whole property.", href: "/services/hardscaping", image: "/assets/img/gallery-drainage.jpg", alt: "Landscape drainage work completed by Avanti Landscaping", marker: "stone" },
  { id: "maintenance", name: "Maintenance", summary: "Mowing, pruning, mulching, and seasonal cleanups on a schedule that fits your property.", href: "/services/maintenance", image: "/assets/img/card-maintenance.jpg", alt: "Avanti Landscaping crew member mowing a lawn", marker: "tools" },
];

export function RouteIcon({ type }: { type: PropertyRouteItem["marker"] }) {
  if (type === "grass") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27V13M16 21 8 14M16 18l7-9M16 25l8-8M16 25l-8-7" /></svg>;
  if (type === "plant") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27V14M16 18c-5 0-8-3-8-8 5 0 8 3 8 8ZM16 22c5 0 8-3 8-8-5 0-8 3-8 8Z" /></svg>;
  if (type === "stone") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 25h24M5 18h8v7H5zM13 18h8v7h-8zM21 18h6v7h-6zM8 11h8v7H8zM16 11h8v7h-8z" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m7 7 5 5M5 10l6-6 4 4-6 6zM13 15l11 11M21 20l5 5M13 15l-3 3" /></svg>;
}
