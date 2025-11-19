"use client";

import { Button } from "@/components/ui/button";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/ui/frame";

export function SecuritySettingsPanel() {
  return (
    <div className="space-y-6">
      <Frame>
        <FrameHeader>
          <FrameTitle>Password & Sign-in</FrameTitle>
          <FrameDescription>
            Keep your credentials secure and recover access when you need it.
          </FrameDescription>
        </FrameHeader>
        <FramePanel className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/60 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Send password reset email
              </p>
              <p className="text-xs text-muted-foreground">
                We&apos;ll email you a secure link to create a new password.
              </p>
            </div>
            <Button type="button" size="sm" disabled>
              Coming soon
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/60 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Sign out of other sessions
              </p>
              <p className="text-xs text-muted-foreground">
                Remotely revoke access on devices you no longer trust.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" disabled>
              Coming soon
            </Button>
          </div>
        </FramePanel>
      </Frame>

      <Frame>
        <FrameHeader>
          <FrameTitle>Data & Account</FrameTitle>
          <FrameDescription>
            Request your data or close your account when you&apos;re done.
          </FrameDescription>
        </FrameHeader>
        <FramePanel className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-border/60 bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Export watch history
              </p>
              <p className="text-xs text-muted-foreground">
                Download a portable archive containing your watchlist and
                activity.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" disabled>
              Planned
            </Button>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-dashed border-destructive/60 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">
                Delete account
              </p>
              <p className="text-xs text-muted-foreground">
                Permanently remove your Kinoa account and associated watch data.
                This action cannot be undone.
              </p>
            </div>
            <Button type="button" size="sm" variant="destructive" disabled>
              Coming soon
            </Button>
          </div>
        </FramePanel>
      </Frame>
    </div>
  );
}
