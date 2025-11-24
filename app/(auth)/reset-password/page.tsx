import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Kinoa account",
};

export default function ResetPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Secure your account
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Choose a new password</h1>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account protected.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
