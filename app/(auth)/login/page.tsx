import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { getSession } from "@/lib/supabase/session";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-primary">
          Welcome back
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Sign in to Kinoa</h1>
        <p className="text-sm text-muted-foreground">
          Continue where you left off with your watchlist and recommendations.
        </p>
      </div>

      <SocialAuthButtons actionLabel="Continue" />

      <div className="relative">
        <Separator className="bg-border" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="bg-card px-3 text-xs uppercase tracking-[0.1em] text-muted-foreground">
            Or sign in with email
          </span>
        </span>
      </div>

      <LoginForm showSignUpHint={false} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
