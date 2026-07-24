"use client";

import { useEffect } from "react";

export default function MobileNavToggle() {
  useEffect(() => {
    const toggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");
    if (!toggle || !mobileNav) return;

    const onToggle = () => mobileNav.classList.toggle("open");
    toggle.addEventListener("click", onToggle);

    const links = mobileNav.querySelectorAll("a");
    const onLinkClick = () => mobileNav.classList.remove("open");
    links.forEach((link) => link.addEventListener("click", onLinkClick));

    return () => {
      toggle.removeEventListener("click", onToggle);
      links.forEach((link) => link.removeEventListener("click", onLinkClick));
    };
  }, []);

  return null;
}
