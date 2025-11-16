import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#05070F",
    theme_color: siteConfig.accentColor,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "Search catalog",
        short_name: "Search",
        url: "/search",
      },
    ],
    scope: "/",
    id: absoluteUrl("/"),
  };
}
