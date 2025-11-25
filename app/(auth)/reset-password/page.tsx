import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Kinoa account",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Set new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose a secure password for your account
        </p>
      </div>

      <ResetPasswordForm />
    </div>
  );
}
