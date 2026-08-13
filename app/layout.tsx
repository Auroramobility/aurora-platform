import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Same pattern as lib/auth/signup.ts and app/login/page.tsx's OAuth
// redirect — falls back to localhost in dev, must be set in
// staging/production (see .env.example).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Aurora Mobility",
  description: "Making EV ownership accessible.",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Aurora Mobility",
    description: "Making EV ownership accessible.",
    type: "website",
    images: ["/images/hero-1.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora Mobility",
    description: "Making EV ownership accessible.",
    images: ["/images/hero-1.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0f14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
