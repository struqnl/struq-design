import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// A constant, not new Date(): cacheComponents is on (setup.md §0). Bump it when the content changes.
const LAST_UPDATED = "2026-10-29";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 1 }];
}
