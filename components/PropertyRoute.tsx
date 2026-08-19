"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import RouteContinuityTrace from "@/components/RouteContinuityTrace";

type RouteKey = "lawn" | "landscaping" | "hardscaping" | "maintenance";

type Route = {
  id: RouteKey;
  name: string;
  summary: string;
  href: string;
  image: string;
  alt: string;
  marker: "grass" | "plant" | "stone" | "tools";
};

const routes: Route[] = [
  {
    id: "lawn",
    name: "Lawn Care",
    summary: "Fertilization, weed control, aeration, and seeding for a thicker, healthier lawn.",
    href: "/services#lawn-care",
    image: "/assets/img/card-lawncare.jpg",
    alt: "Avanti Landscaping crew applying a lawn treatment",
    marker: "grass",
  },
  {
    id: "landscaping",
    name: "Landscaping",
    summary: "Plantings, sod, lighting, drainage, and grading that make the property work better and look cared for.",
    href: "/services#landscaping",
    image: "/assets/img/card-landscaping.jpg",
    alt: "Fresh sod installation by Avanti Landscaping",
    marker: "plant",
  },
  {
    id: "hardscaping",
    name: "Hardscaping",
    summary: "Edging, stone, drainage details, and outdoor improvements planned as part of the whole property.",
    href: "/services#hardscaping",
    image: "/assets/img/gallery-drainage.jpg",
    alt: "Landscape drainage work completed by Avanti Landscaping",
    marker: "stone",
  },
  {
    id: "maintenance",
    name: "Maintenance",
    summary: "Mowing, pruning, mulching, and seasonal cleanups on a schedule that fits your property.",
    href: "/services#maintenance",
    image: "/assets/img/card-maintenance.jpg",
    alt: "Avanti Landscaping crew member mowing a lawn",
    marker: "tools",
  },
];

function RouteIcon({ type }: { type: Route["marker"] }) {
  if (type === "grass") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27V13M16 21 8 14M16 18l7-9M16 25l8-8M16 25l-8-7" /></svg>;
  if (type === "plant") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 27V14M16 18c-5 0-8-3-8-8 5 0 8 3 8 8ZM16 22c5 0 8-3 8-8-5 0-8 3-8 8Z" /></svg>;
  if (type === "stone") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 25h24M5 18h8v7H5zM13 18h8v7h-8zM21 18h6v7h-6zM8 11h8v7H8zM16 11h8v7h-8z" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m7 7 5 5M5 10l6-6 4 4-6 6zM13 15l11 11M21 20l5 5M13 15l-3 3" /></svg>;
}

export default function PropertyRoute({ images }: { images?: Partial<Record<RouteKey, string>> }) {
  const [active, setActive] = useState<RouteKey>("lawn");
  const [entryState, setEntryState] = useState<"static" | "pending" | "revealed">("static");
  const [imageLoading, setImageLoading] = useState(false);
  // Which photos the browser has already fetched this session. Switching back
  // to one of those is instant, so it should not flash a loading state.
  const seenImages = useRef(new Set<string>());
  const sectionRef = useRef<HTMLElement>(null);
  const selected = routes.find((route) => route.id === active) ?? routes[0];
  const selectedImage = images?.[selected.id] ?? selected.image;

  // Each route swaps in a different photo. Until it decodes the panel keeps
  // showing the previous one, which read as the section being stale or broken
  // for the second or two the fetch took. Hold a loading state across that gap
  // so the swap is legible.
  useEffect(() => {
    if (seenImages.current.has(selectedImage)) {
      setImageLoading(false);
      return;
    }
    setImageLoading(true);
  }, [selectedImage]);

  function onImageSettled() {
    seenImages.current.add(selectedImage);
    setImageLoading(false);
  }

  useEffect(() => {
    const syncFromHash = () => {
      const id = window.location.hash.replace("#route-", "") as RouteKey;
      if (routes.some((route) => route.id === id)) setActive(id);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Keep the server-rendered section visible by default. Only stage the
    // entrance when it begins below the current reading position.
    if (section.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setEntryState("revealed");
      return;
    }

    setEntryState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntryState("revealed");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function selectRoute(id: RouteKey) {
    setActive(id);
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex: Record<string, number> = {
      ArrowRight: (index + 1) % routes.length,
      ArrowDown: (index + 1) % routes.length,
      ArrowLeft: (index - 1 + routes.length) % routes.length,
      ArrowUp: (index - 1 + routes.length) % routes.length,
      Home: 0,
      End: routes.length - 1,
    };
    const destination = nextIndex[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    selectRoute(routes[destination].id);
    document.getElementById(`route-tab-${routes[destination].id}`)?.focus();
  }

  return (
    <section
      ref={sectionRef}
      className="property-route"
      id="property-route"
      aria-labelledby="property-route-heading"
      data-entry={entryState}
    >
      <div className="route-contours" aria-hidden="true" />
      <RouteContinuityTrace sectionRef={sectionRef} revealed={entryState === "revealed"} />
      <div className="container property-route-grid">
        <div className="route-intro">
          <h2 id="property-route-heading">What your property needs, connected.</h2>
          <p>Choose a route to see how Avanti can take care of the details without making you coordinate separate crews.</p>
          <div className="route-tabs" role="tablist" aria-label="Avanti service routes">
            {routes.map((route, index) => (
              <button
                key={route.id}
                type="button"
                role="tab"
                id={`route-tab-${route.id}`}
                aria-selected={active === route.id}
                aria-controls={`route-panel-${route.id}`}
                tabIndex={active === route.id ? 0 : -1}
                className={active === route.id ? "is-active" : undefined}
                onClick={() => selectRoute(route.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span className="route-tab-icon"><RouteIcon type={route.marker} /></span>
                {route.name}
              </button>
            ))}
          </div>
        </div>

        <div className="route-detail" id={`route-panel-${selected.id}`} role="tabpanel" aria-labelledby={`route-tab-${selected.id}`} aria-live="polite">
          <div className="route-detail-copy">
            <div className="route-detail-title">
              <span className="route-tab-icon"><RouteIcon type={selected.marker} /></span>
              <h3>{selected.name}</h3>
            </div>
            <p>{selected.summary}</p>
            <a href={selected.href} className="route-link">Explore {selected.name}<span aria-hidden="true">→</span></a>
          </div>
          <div className="route-image" data-loading={imageLoading ? "" : undefined} aria-busy={imageLoading}>
            <Image
              src={selectedImage}
              alt={selected.alt}
              fill
              quality={60}
              sizes="(max-width: 980px) calc(100vw - 48px), 54vw"
              onLoad={onImageSettled}
              // A failed fetch must clear the state too, or the panel would sit
              // under a loading treatment forever.
              onError={onImageSettled}
            />
            <span className="route-image-progress" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
