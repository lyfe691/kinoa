import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/supabase/session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Kinoa account",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue to Kinoa
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
