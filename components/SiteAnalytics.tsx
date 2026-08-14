"use client";

import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

export default function SiteAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return <GoogleAnalytics gaId={measurementId} />;
}
