"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { useSession } from "@/lib/supabase/auth";
import { toastManager } from "@/components/ui/toast";
import { getAuthErrorMessage } from "@/lib/supabase/errors";
import { signOutEverywhere } from "@/lib/supabase/sign-out";
import { Spinner } from "@/components/ui/spinner";

export function ResetPasswordForm() {
  const router = useRouter();
  const { supabase } = useSession();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [status, setStatus] = React.useState<"checking" | "ready" | "error">(
    "checking",
  );
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);
  const [hasUpdated, setHasUpdated] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!supabase) {
        return;
      }

      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type");

      if (type === "recovery") {
        if (!isMounted) return;
        setStatus("ready");
        return;
      }

      // Use getUser() to verify authenticity
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (!isMounted) return;
        setStatus("ready");
      } else {
        if (!isMounted) return;
        setStatus("error");
        setError("The reset link is invalid or has expired.");
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  React.useEffect(() => {
    return () => {
      if (!hasUpdated && supabase) {
        signOutEverywhere(supabase).catch(() => {
          // ignore cleanup errors
        });
      }
    };
  }, [hasUpdated, supabase]);

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

        setHasUpdated(true);
        await signOutEverywhere(supabase);
        toastManager.add({
          title: "Password updated. Please sign in again.",
          type: "success",
        });
        router.push("/login");
      } catch (err) {
        console.error("Password update failed", err);
        const message = getAuthErrorMessage(
          err,
          "We couldn't update your password. Please try again.",
        );
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [supabase, password, confirmPassword, router],
  );

  const handleCancel = React.useCallback(async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOutEverywhere(supabase);
      setHasUpdated(true);
      toastManager.add({ title: "You have been signed out.", type: "success" });
      router.push("/login");
    } catch (err) {
      const message = getAuthErrorMessage(
        err,
        "We couldn't cancel the reset right now. Please close this tab.",
      );
      setError(message);
    } finally {
      setSigningOut(false);
    }
  }, [signingOut, supabase, router]);

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center text-sm text-muted-foreground">
        <Spinner className="h-6 w-6" />
        <p>Verifying your reset link…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <Alert variant="error" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error ?? "This reset link is invalid or has expired."}
          </AlertDescription>
        </Alert>
        <Button
          type="button"
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
        <Alert variant="error" className="text-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert className="border-blue-500/30 bg-blue-500/5 text-sm text-blue-600 dark:text-blue-400">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Use at least 6 characters with a mix of letters, numbers, and symbols.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="submit"
          className="w-full"
          disabled={loading || signingOut}
          size="lg"
        >
          {(loading || signingOut) && <Spinner className="h-4 w-4" />}
          {loading
            ? "Saving…"
            : signingOut
              ? "Signing out…"
              : "Update password"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={handleCancel}
          disabled={loading || signingOut}
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
