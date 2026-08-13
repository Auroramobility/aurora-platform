import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Everything here requires auth and has no reason to be indexed —
      // customer data, admin console, account management.
      disallow: [
        "/dashboard",
        "/admin",
        "/profile",
        "/settings",
        "/payments",
        "/messages",
        "/applications",
        "/ownership/*",
        "/auth",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
