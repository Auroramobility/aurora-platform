import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fontDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const fontSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh font-sans">
        <Script id="aurora-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem("aurora-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})()`}
        </Script>
        {children}
      </body>
    </html>
  );
}
