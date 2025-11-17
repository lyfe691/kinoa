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
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 sm:gap-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Configure your account info, control security, and manage data in one
          place.
        </p>
      </header>

      <Tabs
        defaultValue="profile"
        orientation="vertical"
        className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10"
      >
        <aside className="flex w-full shrink-0 flex-col gap-2 lg:w-60 lg:max-w-xs lg:gap-3">
          <h2 className="hidden text-sm font-semibold uppercase tracking-wide text-muted-foreground lg:block">
            General
          </h2>
          <TabsList
            variant="underline"
            className="flex w-full flex-row gap-2 border-b border-border/60 pb-0 lg:flex-col lg:gap-1.5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-0"
          >
            {settingsTabs.map((tab) => (
              <TabsTab
                key={tab.value}
                value={tab.value}
                className="group relative flex flex-1 items-center justify-center rounded-none border-b-2 border-transparent px-4 py-3 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[selected=true]:border-primary data-[selected=true]:text-foreground lg:w-full lg:flex-none lg:items-start lg:justify-start lg:rounded-md lg:border-b-0 lg:px-3 lg:py-2.5 lg:text-left lg:hover:bg-accent/20 lg:data-[selected=true]:border-transparent lg:data-[selected=true]:bg-background"
              >
                <span>{tab.label}</span>
                <span className="absolute inset-y-1 left-0 hidden w-0.5 rounded-full bg-primary lg:group-data-[selected=true]:block lg:-left-1" />
              </TabsTab>
            ))}
          </TabsList>
        </aside>

        <div className="flex-1 space-y-6 lg:space-y-8">
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
