import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password • Kinoa",
  description: "Set a new password for your Kinoa account",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password to secure your account.
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
