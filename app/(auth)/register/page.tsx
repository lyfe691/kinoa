import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { getSession } from "@/lib/supabase/session";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a new Kinoa account",
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Join Kinoa to track your watchlist and more.
        </p>
      </div>

      <SocialAuthButtons actionLabel="Sign up" />

      <div className="relative">
        <Separator />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background px-3 text-xs uppercase tracking-[0.1em] text-muted-foreground">
            or
          </span>
        </span>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
