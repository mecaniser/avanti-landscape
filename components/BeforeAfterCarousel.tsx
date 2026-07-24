"use client";

import { useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

export type BAProject = {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  caption: string;
  subtext: string | null;
};

export default function BeforeAfterCarousel({ projects }: { projects: BAProject[] }) {
  const [index, setIndex] = useState(0);

  if (projects.length === 0) return null;

  const count = projects.length;
  const project = projects[index];
  const multiple = count > 1;

  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <div className="ba-carousel">
      <div className="ba-wrap">
        <BeforeAfterSlider
          key={project.id}
          beforeSrc={project.beforeUrl}
          afterSrc={project.afterUrl}
          beforeAlt={`Before — ${project.caption}`}
          afterAlt={`After — ${project.caption}`}
        />
        <div className="ba-caption">
          {project.caption}
          {project.subtext && <span>{project.subtext}</span>}
        </div>
      </div>

      {multiple && (
        <div className="ba-nav">
          <button type="button" className="ba-nav-btn" onClick={() => go(-1)} aria-label="Previous project">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="ba-dots" role="tablist" aria-label="Projects">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`ba-dot${i === index ? " is-active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Show project ${i + 1} of ${count}`}
                aria-selected={i === index}
                role="tab"
              />
            ))}
          </div>

          <button type="button" className="ba-nav-btn" onClick={() => go(1)} aria-label="Next project">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
