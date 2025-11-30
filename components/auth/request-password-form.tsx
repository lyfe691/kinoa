"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useSession } from "@/lib/supabase/auth";
import { parseRateLimitSeconds } from "@/lib/supabase/errors";

export function RequestPasswordResetForm() {
  const { supabase } = useSession();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);

  // Countdown timer effect
  React.useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setSuccess(null);

      if (!supabase) {
        setError(
          "Unable to reach the authentication service. Please try again.",
        );
        return;
      }

      setLoading(true);

      try {
        const redirectTo = `${window.location.origin}/reset-password`;
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo },
        );

        if (resetError) {
          throw resetError;
        }

        setSuccess(
          "If an account exists for that email, we've sent password reset instructions.",
        );
      } catch (err) {
        const seconds = parseRateLimitSeconds(err);
        if (seconds) {
          setCooldown(seconds);
          setError(`Too many requests. Please wait ${seconds} seconds.`);
        } else {
          console.error("Password reset request failed", err);
          setError("We couldn't start the reset process. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [email, supabase],
  );

  const isDisabled = loading || cooldown > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isDisabled}
          required
          autoComplete="email"
        />
      </div>

      {error && (
        <Alert variant="error" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {cooldown > 0
              ? `Too many requests. Please wait ${cooldown} seconds.`
              : error}
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isDisabled} size="lg">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading
          ? "Sending..."
          : cooldown > 0
            ? `Wait ${cooldown}s`
            : "Send reset link"}
      </Button>
    </form>
  );
}
