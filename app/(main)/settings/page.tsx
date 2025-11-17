import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/supabase/session";
import { type AccountProfile, getAccountProfile } from "@/lib/supabase/profile";
import { ProfileSettingsPanel } from "./_components/profile-settings-panel";
import { SecuritySettingsPanel } from "./_components/security-settings-panel";

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

  const profile: AccountProfile = profileData ?? {
    id: session.user.id,
    email: session.user.email ?? "",
    displayName:
      (session.user.user_metadata as { display_name?: string })?.display_name ??
      (session.user.user_metadata as { full_name?: string })?.full_name ??
      null,
    avatarUrl:
      (session.user.user_metadata as { avatar_url?: string })?.avatar_url ??
      null,
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

      <Tabs
        defaultValue="profile"
        orientation="vertical"
        className="flex flex-col gap-10 lg:flex-row lg:items-start"
      >
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-60 lg:max-w-xs">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            General
          </h2>
          <TabsList
            variant="underline"
            className="flex w-full flex-row gap-3 overflow-x-auto border-b border-border/60 pb-2 lg:flex-col lg:gap-1.5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-0"
          >
            {settingsTabs.map((tab) => (
              <TabsTab
                key={tab.value}
                value={tab.value}
                className="group relative flex w-full items-start rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/20 hover:text-foreground data-[selected=true]:bg-background data-[selected=true]:text-foreground"
              >
                <span>{tab.label}</span>
                <span className="absolute inset-y-1 left-0 hidden w-0.5 rounded-full bg-primary group-data-[selected=true]:block lg:-left-1" />
              </TabsTab>
            ))}
          </TabsList>
        </aside>

        <div className="flex-1 space-y-8">
          <TabsPanel value="profile" className="space-y-6">
            <ProfileSettingsPanel profile={profile} />
          </TabsPanel>

          <TabsPanel value="security" className="space-y-6">
            <SecuritySettingsPanel />
          </TabsPanel>
        </div>
      </Tabs>
    </section>
  );
}
