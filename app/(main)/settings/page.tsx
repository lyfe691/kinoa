import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
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
    description: "Personal details, contact info, and profile photo",
  },
  {
    value: "security",
    label: "Security & Data",
    description: "Password, data exports, and account controls",
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
        <TabsList
          variant="underline"
          className="flex w-full flex-row gap-4 overflow-x-auto border-b border-border/60 pb-2 lg:w-72 lg:flex-col lg:items-stretch lg:gap-1 lg:border-b-0 lg:border-s lg:pb-0 lg:pl-4 lg:pt-2"
        >
          {settingsTabs.map((tab) => (
            <TabsTab
              key={tab.value}
              value={tab.value}
              className="group flex w-full flex-col items-start gap-1 rounded-none border-0 bg-transparent px-0 py-3 text-left text-sm font-medium leading-tight transition-colors hover:text-foreground/80 data-[selected=true]:text-foreground"
            >
              <span className="text-base font-semibold">{tab.label}</span>
              <span className="text-xs font-normal text-muted-foreground transition-colors group-data-[selected=true]:text-muted-foreground/80">
                {tab.description}
              </span>
            </TabsTab>
          ))}
        </TabsList>

        <div className="flex-1 space-y-6">
          <TabsPanel value="profile" className="space-y-6 lg:mt-0">
            <ProfileSettingsPanel profile={profile} />
          </TabsPanel>

          <TabsPanel value="security" className="space-y-6 lg:mt-0">
            <SecuritySettingsPanel />
          </TabsPanel>
        </div>
      </Tabs>
    </section>
  );
}
