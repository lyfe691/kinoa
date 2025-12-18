import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/supabase/auth";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WatchlistProvider } from "@/components/watchlist-provider";
import { StructuredData } from "@/components/structured-data";
import { absoluteUrl, siteConfig, siteJsonLd } from "@/lib/seo";
import { getSession } from "@/lib/supabase/session";
import { AdPopunder } from "@/components/ads/ad-popunder";
import { SocialBar } from "@/components/ads/social-bar";
import { SpeedInsights } from "@vercel/speed-insights/next";

const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ogImageUrl = absoluteUrl("/opengraph-image");

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.tagline,
    template: `%s • ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.publisher, url: siteConfig.url }],
  creator: siteConfig.publisher,
  publisher: siteConfig.publisher,
  category: "Entertainment",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.tagline,
    description: siteConfig.description,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: siteConfig.tagline,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.tagline,
    description: siteConfig.description,
    images: [ogImageUrl],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/favicon.ico", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.ico",
        color: siteConfig.accentColor,
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#35312f" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className={notoSans.variable} suppressHydrationWarning>
      <head>
        <StructuredData data={siteJsonLd} />
      </head>
      <body
        className={`${geistMono.variable} min-h-screen overflow-x-hidden bg-background font-sans antialiased`}
      >
        <AdPopunder />
        <SocialBar />
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <AuthProvider initialSession={session}>
            <TooltipProvider>
              <WatchlistProvider>
                <ToastProvider>
                  <div
                    data-vaul-drawer-wrapper
                    className="flex min-h-screen flex-col"
                  >
                    {children}
                  </div>
                </ToastProvider>
              </WatchlistProvider>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
