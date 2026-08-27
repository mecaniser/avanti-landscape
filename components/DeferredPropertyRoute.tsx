"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PROPERTY_ROUTES, RouteIcon, type RouteKey } from "@/components/PropertyRouteData";

const InteractivePropertyRoute = dynamic(() => import("@/components/PropertyRoute"), { ssr: false });

function StaticPropertyRoute({ images }: { images?: Partial<Record<RouteKey, string>> }) {
  const selected = PROPERTY_ROUTES[0];
  const selectedImage = images?.[selected.id] ?? selected.image;

  return (
    <section className="property-route" id="property-route" aria-labelledby="property-route-heading" data-entry="static">
      <div className="route-contours" aria-hidden="true" />
      <div className="container property-route-grid">
        <div className="route-intro">
          <h2 id="property-route-heading">What your property needs, connected.</h2>
          <p>Choose a route to see how Avanti can take care of the details without making you coordinate separate crews.</p>
          <div className="route-tabs" aria-label="Avanti service routes">
            {PROPERTY_ROUTES.map((route) => (
              <Link key={route.id} href={route.href} className={`deferred-route-tab${route.id === selected.id ? " is-active" : ""}`}>
                <span className="route-tab-icon"><RouteIcon type={route.marker} /></span>
                {route.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="route-detail">
          <div className="route-detail-copy">
            <div className="route-detail-title">
              <span className="route-tab-icon"><RouteIcon type={selected.marker} /></span>
              <h3>{selected.name}</h3>
            </div>
            <p>{selected.summary}</p>
            <Link href={selected.href} className="route-link">Explore {selected.name}<span aria-hidden="true">→</span></Link>
          </div>
          <div className="route-image">
            <Image src={selectedImage} alt={selected.alt} fill quality={60} loading="lazy" sizes="(max-width: 980px) calc(100vw - 48px), 54vw" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DeferredPropertyRoute({ images }: { images?: Partial<Record<RouteKey, string>> }) {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInteractive(true);
      observer.disconnect();
    }, { rootMargin: "0px 0px -25% 0px" });
    observer.observe(boundary);
    return () => observer.disconnect();
  }, []);

  return <div ref={boundaryRef}>{interactive ? <InteractivePropertyRoute images={images} /> : <StaticPropertyRoute images={images} />}</div>;
}
