import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const mainClassName = maintenanceMode
    ? "mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12"
    : "mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 pb-20 pt-12 sm:px-6 lg:px-8";

  return (
    <>
      {!maintenanceMode && <SiteHeader />}
      <main className={mainClassName}>{children}</main>
      {!maintenanceMode && <SiteFooter />}
    </>
  );
}
