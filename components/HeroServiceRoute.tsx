"use client";

import { useEffect, useState } from "react";

type RouteKey = "lawn" | "landscaping" | "hardscaping" | "maintenance";

const routes: Array<{ id: RouteKey; label: string; position: string; number: string }> = [
  { id: "lawn", label: "Lawn Care", position: "plot-marker--lawn", number: "01" },
  { id: "landscaping", label: "Landscaping", position: "plot-marker--landscaping", number: "02" },
  { id: "hardscaping", label: "Hardscaping", position: "plot-marker--hardscaping", number: "03" },
  { id: "maintenance", label: "Maintenance", position: "plot-marker--maintenance", number: "04" },
];

function routeFromHash() {
  const route = window.location.hash.replace("#route-", "") as RouteKey;
  return routes.some((item) => item.id === route) ? route : "lawn";
}

export default function HeroServiceRoute() {
  const [active, setActive] = useState<RouteKey>("lawn");

  useEffect(() => {
    const syncRoute = () => setActive(routeFromHash());
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  function selectRoute(event: React.MouseEvent<HTMLAnchorElement>, id: RouteKey) {
    event.preventDefault();
    setActive(id);
    window.history.pushState(null, "", `#route-${id}`);
    window.dispatchEvent(new Event("hashchange"));
    document.getElementById("property-route")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div className="hero-plot" aria-label="Choose a service route to view its connected property plan">
      <svg className="hero-survey-lines" viewBox="0 0 640 620" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 92C131 46 199 135 304 112S467 41 640 86M0 211c108-66 241-48 334 26s177 44 306-42M0 334c132-42 229 62 365 29s171-111 275-75M3 520c123-88 234-42 316-5s196 44 322-21" />
        <path d="M29 24 22 612M212 12l-8 606M413 0l-6 620M593 8l4 605" />
      </svg>
      {routes.map((route) => (
        <a
          key={route.id}
          href={`#route-${route.id}`}
          className={`plot-marker ${route.position}${active === route.id ? " is-active" : ""}`}
          aria-current={active === route.id ? "true" : undefined}
          onClick={(event) => selectRoute(event, route.id)}
        >
          <span>{route.number}</span>
          <strong>{route.label}</strong>
        </a>
      ))}
      <div className="hero-route-line" data-hero-route-line aria-hidden="true"><i /></div>
    </div>
  );
}
