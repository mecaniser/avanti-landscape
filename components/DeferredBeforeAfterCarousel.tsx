"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { BAProject } from "@/components/BeforeAfterCarousel";

const InteractiveCarousel = dynamic(() => import("@/components/BeforeAfterCarousel"), { ssr: false });
const InteractiveFlowTrace = dynamic(() => import("@/components/WebsiteFlowTrace"), { ssr: false });

function StaticCarousel({ projects }: { projects: BAProject[] }) {
  const project = projects[0];
  if (!project) return null;
  return (
    <div className="ba-carousel">
      <div className="ba-wrap">
        <div className="ba-slider" data-loaded="" style={{ ["--pos" as string]: "50%" }}>
          <Image className="ba-img" src={project.afterUrl} alt={`Completed work: ${project.caption}`} fill loading="lazy" quality={60} sizes="(max-width: 800px) 100vw, 1180px" />
          <Image className="ba-img ba-before" src={project.beforeUrl} alt={`Before work began: ${project.caption}`} fill loading="lazy" quality={60} sizes="(max-width: 800px) 100vw, 1180px" />
          <span className="ba-tag ba-tag--before">Before</span>
          <span className="ba-tag ba-tag--after">After</span>
          <div className="ba-handle" aria-hidden="true"><span className="ba-handle-grip"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 5l-5 7 5 7M16 5l5 7-5 7" /></svg></span></div>
        </div>
        <div className="ba-caption">{project.caption}{project.subtext && <span>{project.subtext}</span>}</div>
      </div>
    </div>
  );
}

export default function DeferredBeforeAfterCarousel({ projects }: { projects: BAProject[] }) {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const boundary = boundaryRef.current;
    if (!boundary) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInteractive(true);
      observer.disconnect();
    }, { rootMargin: "0px 0px -20% 0px" });
    observer.observe(boundary);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={boundaryRef}>
      {interactive ? <><InteractiveCarousel projects={projects} /><InteractiveFlowTrace /></> : <StaticCarousel projects={projects} />}
    </div>
  );
}
