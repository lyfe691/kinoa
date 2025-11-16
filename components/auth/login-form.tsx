"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, CircleAlertIcon } from "lucide-react";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/supabase/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "@/lib/supabase/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { supabase } = useSession();

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setLoading(true);

      if (!supabase) {
        setError(
          "Unable to reach the authentication service. Please try again.",
        );
        setLoading(false);
        return;
      }

      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;

        toast.success("Signed in successfully.");
        router.push("/");
        router.refresh();
      } catch (err) {
        const message = getAuthErrorMessage(
          err,
          "Unable to sign in. Please try again.",
        );
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [email, password, supabase, router],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          autoComplete="current-password"
        />
      </div>

      {error && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader className="h-4 w-4 animate-spin" />}
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Forgot your password?{" "}
        <Link
          href="/forgot-password"
          className="underline underline-offset-4 text-foreground"
        >
          Reset it
        </Link>
        .
      </p>
    </form>
  );
}
