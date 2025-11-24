import type { Metadata } from "next";
import Link from "next/link";
import { RequestPasswordResetForm } from "@/components/auth/request-password-form";
import { getSession } from "@/lib/supabase/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a password reset link for your Kinoa account",
};

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Forgot password
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Reset access</h1>
        <p className="text-sm text-muted-foreground">
          Enter the email tied to your account and we&apos;ll send a code to help you get back in.
        </p>
      </div>

      <RequestPasswordResetForm />

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
