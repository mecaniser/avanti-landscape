import type { Metadata } from "next";

// robots.txt disallows /admin, but a Disallow alone does not stop a linked
// URL from being indexed, and the login page is linked from the site footer.
// This applies to the login page and every dashboard route beneath it.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
