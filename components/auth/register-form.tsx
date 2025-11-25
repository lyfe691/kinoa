"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/oauth-provider-button";
import { useSession } from "@/lib/supabase/auth";
import { getAuthErrorMessage } from "@/lib/supabase/errors";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          or continue with
        </span>
      </div>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = React.useState(false);
  const { supabase } = useSession();
  const isSubmitting = React.useRef(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting.current) return;

      isSubmitting.current = true;
      setError(null);
      setSuccess(null);
      setLoading(true);

      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim();

      if (trimmedUsername.length > 25) {
        setError("Display name must be 25 characters or fewer");
        setLoading(false);
        isSubmitting.current = false;
        return;
      }

      if (!supabase) {
        setError(
          "Unable to reach the authentication service. Please try again.",
        );
        setLoading(false);
        isSubmitting.current = false;
        return;
      }

      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              username: trimmedUsername,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (
          data.user &&
          !data.session &&
          data.user.identities &&
          data.user.identities.length === 0
        ) {
          setError(
            "An account with this email already exists. If this is your account, please sign in.",
          );
          return;
        }

        if (data.session) {
          toast.success("Account created. Welcome to Kinoa!");
          router.push("/");
          router.refresh();
          return;
        }

        setSuccess("Confirm your email to claim your account.");
      } catch (err) {
        const message = getAuthErrorMessage(
          err,
          "Unable to create your account right now.",
        );
        setError(message);
      } finally {
        setLoading(false);
        isSubmitting.current = false;
      }
    },
    [username, email, password, supabase, router],
  );

  return (
    <div className="space-y-6">
      <GoogleAuthButton
        disabled={loading}
        onError={setError}
        onLoadingChange={setOauthLoading}
      />

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Display name</Label>
          <Input
            id="username"
            type="text"
            placeholder="John Doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading || oauthLoading}
            required
            autoComplete="name"
            maxLength={25}
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || oauthLoading}
            required
            autoComplete="new-password"
            minLength={6}
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

        <Button
          type="submit"
          className="w-full"
          disabled={loading || oauthLoading}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="text-foreground underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-foreground underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
