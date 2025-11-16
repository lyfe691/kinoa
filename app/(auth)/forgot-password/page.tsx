import type { Metadata } from "next";
import Link from "next/link";
import { RequestPasswordResetForm } from "@/components/auth/request-password-form";
import { getSession } from "@/lib/supabase/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset password • Kinoa",
  description: "Request a password reset link for your Kinoa account",
};

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a reset link.
        </p>
      </div>

      <RequestPasswordResetForm />

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
