"use client";

import * as React from "react";
import type { AccountProfile } from "@/lib/profile-utils";
import { AvatarFrame } from "./avatar-frame";
import { DisplayNameFrame } from "./display-name-frame";
import { EmailFrame } from "./email-frame";

type ProfileSettingsPanelProps = {
  profile: AccountProfile | null;
};

export function ProfileSettingsPanel({ profile }: ProfileSettingsPanelProps) {
  return (
    <div className="space-y-6">
      <AvatarFrame profile={profile} />
      <DisplayNameFrame profile={profile} />
      <EmailFrame profile={profile} />
    </div>
  );
}
