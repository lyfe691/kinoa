import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/session";
import { getAccountProfile } from "@/lib/supabase/profile";
import { type AccountProfile } from "@/lib/profile-utils";
import { ProfileSettingsPanel } from "./_components/profile-settings-panel";
import { SecuritySettingsPanel } from "./_components/security-settings-panel";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Kinoa account details, security, and data.",
};

const settingsTabs = [
  {
    value: "profile",
    label: "Profile",
  },
  {
    value: "security",
    label: "Security & Data",
  },
] as const;

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const profileData = await getAccountProfile();

  // Calculate initials for fallback
  const displayName =
    (session.user.user_metadata as { display_name?: string })?.display_name ??
    (session.user.user_metadata as { full_name?: string })?.full_name ??
    session.user.email?.split("@")[0] ??
    "User";

  const normalizedName = displayName.replace(/\s+/g, " ");
  const initials =
    normalizedName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("") ||
    normalizedName.slice(0, 2).toUpperCase() ||
    "U";

  const profile: AccountProfile = profileData ?? {
    id: session.user.id,
    email: session.user.email ?? "",
    displayName,
    avatarUrl:
      (session.user.user_metadata as { avatar_url?: string })?.avatar_url ??
      null,
    initials,
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your account info, control security, and manage data in one
          place.
        </p>
      </header>

      <Tabs defaultValue="profile" className="mt-4 space-y-6">
        <TabsList
          variant="default"
          className="flex w-full justify-start gap-3 overflow-x-auto"
        >
          {settingsTabs.map((tab) => (
            <TabsTab
              key={tab.value}
              value={tab.value}
              className="px-3 py-2.5 text-sm font-medium text-muted-foreground data-[selected=true]:text-foreground"
            >
              {tab.label}
            </TabsTab>
          ))}
        </TabsList>

        <TabsPanel value="profile" className="space-y-6 pt-2">
          <Suspense fallback={null}>
            <ProfileSettingsPanel profile={profile} />
          </Suspense>
        </TabsPanel>

        <TabsPanel value="security" className="space-y-6 pt-2">
          <SecuritySettingsPanel />
        </TabsPanel>
      </Tabs>
    </section>
  );
}
