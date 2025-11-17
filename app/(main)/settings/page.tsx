import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/supabase/session"
import { type AccountProfile, getAccountProfile } from "@/lib/supabase/profile"
import { ProfileSettingsPanel } from "./_components/profile-settings-panel"
import { SecuritySettingsPanel } from "./_components/security-settings-panel"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your Kinoa account details, security, and data.",
}

const settingsTabs = [
  {
    value: "profile",
    label: "Profile",
  },
  {
    value: "security",
    label: "Security & Data",
  },
] as const

export default async function SettingsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const profileData = await getAccountProfile()

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
  }

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
          <ProfileSettingsPanel profile={profile} />
        </TabsPanel>

        <TabsPanel value="security" className="space-y-6 pt-2">
          <SecuritySettingsPanel />
        </TabsPanel>
      </Tabs>
    </section>
  )
}