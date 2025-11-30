"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { useSession } from "@/lib/supabase/auth";
import { useProfile } from "@/hooks/use-profile";
import { signOutEverywhere } from "@/lib/supabase/sign-out";
import { getAuthErrorMessage } from "@/lib/supabase/errors";
import { toastManager } from "@/components/ui/toast";

import { BrandLink } from "./brand-link";
import { DesktopNav } from "./desktop-nav";
import { DesktopActions } from "./desktop-actions";
import { MobileMenuTrigger } from "./mobile-menu-trigger";
import { MobileDrawer } from "./mobile-drawer";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    loading: sessionLoading,
    supabase,
    refreshSession,
  } = useSession();
  const { profile: account, loading: profileLoading } = useProfile();
  const [signingOut, setSigningOut] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const loading = sessionLoading || (!!user && profileLoading);

  React.useEffect(() => {
    if (!user) {
      setIsDropdownOpen(false);
    }
  }, [user]);

  const handleSignOut = React.useCallback(async () => {
    setSigningOut(true);
    try {
      await signOutEverywhere(supabase);
      await refreshSession();
      toastManager.add({ title: "Signed out", type: "success" });
      router.push("/");
      router.refresh();
    } catch (error) {
      const message = getAuthErrorMessage(
        error,
        "We couldn't sign you out. Please try again.",
      );
      toastManager.add({ title: message, type: "error" });
    } finally {
      setSigningOut(false);
    }
  }, [supabase, refreshSession, router]);

  return (
    <Drawer
      shouldScaleBackground
      setBackgroundColorOnScale={false}
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
    >
      <header className="sticky top-0 z-50 w-full bg-background">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <BrandLink />
          <DesktopNav pathname={pathname} user={user} />

          <div className="flex-1" />

          <DesktopActions
            loading={loading}
            user={user}
            account={account}
            onSignOutAction={handleSignOut}
            signingOut={signingOut}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpenAction={setIsDropdownOpen}
          />

          <MobileMenuTrigger />
        </div>
      </header>

      <MobileDrawer
        pathname={pathname}
        loading={loading}
        user={user}
        account={account}
        signingOut={signingOut}
        onSignOut={handleSignOut}
      />
    </Drawer>
  );
}
