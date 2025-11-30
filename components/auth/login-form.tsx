"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/oauth-provider-button";
import { useSession } from "@/lib/supabase/auth";
import { getAuthErrorMessage } from "@/lib/supabase/errors";
import { AlertCircle, Loader2 } from "lucide-react";
import { toastManager } from "@/components/ui/toast";

function AuthDivider() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">or</span>
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = React.useState(false);
  const { supabase } = useSession();
  const isSubmitting = React.useRef(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting.current) return;

      isSubmitting.current = true;
      setError(null);
      setLoading(true);

      if (!supabase) {
        setError(
          "Unable to reach the authentication service. Please try again.",
        );
        setLoading(false);
        isSubmitting.current = false;
        return;
      }

      try {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;

        toastManager.add({ title: "Signed in successfully.", type: "success" });
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
        isSubmitting.current = false;
      }
    },
    [email, password, supabase, router],
  );

  return (
    <div className="space-y-4">
      <GoogleAuthButton
        disabled={loading}
        onError={setError}
        onLoadingChange={setOauthLoading}
      />

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || oauthLoading}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || oauthLoading}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <Alert variant="error" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loading || oauthLoading}
          size="lg"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
