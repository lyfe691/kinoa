import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#e6dfd3", // clean beige
          position: "relative",
        }}
      >
        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 48,
            zIndex: 10,
          }}
        >
          {/* Brand */}
          <div
            style={{
              fontSize: 140,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: "#2c2c2c",
              display: "flex",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {siteConfig.shortName}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: "#4a4a4a",
              maxWidth: "600px",
              lineHeight: 1.4,
              display: "flex",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#6b6b6b",
              display: "flex",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
