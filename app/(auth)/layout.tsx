import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthBrandingPanel } from "@/components/auth/auth-branding-panel";
import { getAuthBrandingImages } from "@/lib/tmdb";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const images = await getAuthBrandingImages();

  return (
    <div className="flex min-h-screen">
      {/* Left panel - Form */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        {/* Back button */}
        <header className="absolute left-0 right-0 top-0 z-50 p-4 sm:p-6 lg:p-8">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back home</span>
            </Link>
          </Button>
        </header>

        {/* Form container */}
        <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Right panel - Branding with 3D Marquee */}
      <AuthBrandingPanel images={images} />
    </div>
  );
}
