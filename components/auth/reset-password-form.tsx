"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlertIcon, InfoIcon, Loader } from "lucide-react";
import { useSession } from "@/lib/supabase/auth";
import { toast } from "sonner";

type ResetPasswordFormProps = {
  code: string | null;
};

export function ResetPasswordForm({ code }: ResetPasswordFormProps) {
  const router = useRouter();
  const { supabase } = useSession();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [status, setStatus] = React.useState<"checking" | "ready" | "error">(
    code ? "checking" : "error",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const verifyCode = async () => {
      if (!code || !supabase) {
        setStatus("error");
        setError("The reset link is invalid or has expired.");
        return;
      }

      try {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw exchangeError;
        }

        if (!isMounted) return;
        setStatus("ready");
      } catch (err) {
        console.error("Failed to exchange reset code", err);
        if (!isMounted) return;
        setStatus("error");
        setError("The reset link is invalid or has expired.");
      }
    };

    verifyCode();

    return () => {
      isMounted = false;
    };
  }, [code, supabase]);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);

      if (!supabase) {
        setError(
          "Unable to reach the authentication service. Please try again.",
        );
        return;
      }

      if (password.trim().length < 6) {
        setError("Passwords must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);

      try {
        const { error: updateError } = await supabase.auth.updateUser({
          password: password.trim(),
        });

        if (updateError) {
          throw updateError;
        }

        toast.success("Password updated. You can now sign in.");
        router.push("/login");
      } catch (err) {
        console.error("Password update failed", err);
        setError("We couldn't update your password. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [supabase, password, confirmPassword, router],
  );

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
        <Loader className="h-5 w-5 animate-spin" />
        <p>Verifying your reset link…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4 text-center">
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Reset link not valid</AlertTitle>
          <AlertDescription>
            {error ??
              "We couldn't verify your reset link. Please request a new email."}
          </AlertDescription>
        </Alert>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => router.push("/forgot-password")}
        >
          Request a new link
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          required
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={loading}
          required
          autoComplete="new-password"
        />
      </div>

      {error && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Unable to update password</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Password requirements</AlertTitle>
        <AlertDescription>
          Use at least 6 characters. For best security, include a mix of
          letters, numbers, and symbols.
        </AlertDescription>
      </Alert>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader className="h-4 w-4 animate-spin" />}
        {loading ? "Saving…" : "Update password"}
      </Button>
    </form>
  );
}
