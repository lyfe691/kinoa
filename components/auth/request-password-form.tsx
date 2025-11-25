"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";
import { useSession } from "@/lib/supabase/auth";

export function RequestPasswordResetForm() {
  const { supabase } = useSession();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

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
        console.error("Password reset request failed", err);
        setError("We couldn't start the reset process. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, supabase],
  );

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
          disabled={loading}
          required
          autoComplete="email"
        />
      </div>

      {error && (
        <Alert variant="error" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-emerald-500/50 bg-emerald-500/10 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader className="h-4 w-4 animate-spin" />}
        {loading ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
