"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import type { AccountProfile } from "@/lib/profile-utils";
import { AvatarFrame } from "./avatar-frame";
import { DisplayNameFrame } from "./display-name-frame";
import { EmailFrame } from "./email-frame";

type ProfileSettingsPanelProps = {
  profile: AccountProfile | null;
};

export function ProfileSettingsPanel({ profile }: ProfileSettingsPanelProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // Check for the verified flag
    if (searchParams.get("verified") === "true") {
      // Use setTimeout to ensure the toast library is ready and to allow for a smooth transition
      const timer = setTimeout(() => {
        toast.success("Email successfully verified", {
          duration: 5000,
          description: "Your account email has been updated.",
        });

        // Clean up the URL without a full page reload
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete("verified");
        router.replace(`${pathname}?${newParams.toString()}`, {
          scroll: false,
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router, pathname]);

  return (
    <div className="space-y-6">
      <AvatarFrame profile={profile} />
      <DisplayNameFrame profile={profile} />
      <EmailFrame profile={profile} />
    </div>
  );
}
