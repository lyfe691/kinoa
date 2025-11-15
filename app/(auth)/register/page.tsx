import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account • Kinoa",
  description: "Create a new Kinoa account",
};

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Join Kinoa to track your watchlist and more
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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

