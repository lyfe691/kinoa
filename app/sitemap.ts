import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getTrending } from "@/lib/tmdb";

const staticRoutes = [
  { path: "/", changeFrequency: "daily" as const, priority: 1 },
  { path: "/search", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/watchlist", changeFrequency: "weekly" as const, priority: 0.6 },
  { path: "/login", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/register", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/forgot-password", changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/reset-password", changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.2 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const baseEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let mediaEntries: MetadataRoute.Sitemap = [];

  try {
    const trending = await getTrending();
    mediaEntries = trending.map((item) => ({
      url: absoluteUrl(item.href),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: item.type === "movie" ? 0.7 : 0.6,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to fetch trending titles", error);
  }

  return [...baseEntries, ...mediaEntries];
}
