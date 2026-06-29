import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL,              lastModified: "2026-06-28", priority: 1.0, changeFrequency: "monthly" },
    { url: `${SITE_URL}/emi`,     lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/prepay`,  lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/sip`,     lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/tax`,     lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/fd`,      lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/ppf`,     lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/hra`,     lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/gratuity`, lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/loan-vs-card`, lastModified: "2026-06-28", priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/rates`,   lastModified: "2026-06-28", priority: 0.9, changeFrequency: "weekly" },
  ];
}
