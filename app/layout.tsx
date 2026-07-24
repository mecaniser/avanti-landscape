import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avanti Landscaping | Lawn Care & Landscaping in Waxhaw, NC",
  description:
    "Avanti Landscaping provides lawn care, landscaping, hardscaping, and property maintenance in Waxhaw, Marvin, Weddington, Matthews, and nearby NC/SC communities. Call 980-328-7141 for a free quote.",
  icons: { icon: "/assets/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
