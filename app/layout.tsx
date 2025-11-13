import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinoa — The Cinema Experience, at Home",
  description: "Everything you want to watch, in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const mainClassName = maintenanceMode
    ? "mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12"
    : "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pb-20 pt-12 sm:px-6 lg:px-8";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange
        >
          <div data-vaul-drawer-wrapper className="flex min-h-screen flex-col">
            {!maintenanceMode && <SiteHeader />}
            <main className={mainClassName}>
              {children}
            </main>
            {!maintenanceMode && <SiteFooter />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
