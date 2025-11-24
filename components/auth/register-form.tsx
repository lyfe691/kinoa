"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, CircleAlertIcon, InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { getAuthErrorMessage } from "@/lib/supabase/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "@/lib/supabase/auth";

type RegisterFormProps = {
  showSignInHint?: boolean;
};

export function RegisterForm({ showSignInHint = true }: RegisterFormProps) {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
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

        // Check if this is a duplicate signup (Supabase anti-enumeration behavior)
        // When an existing email tries to sign up, Supabase returns user with no session
        // and identities array is empty
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Display name</Label>
        <Input
          id="username"
          type="text"
          placeholder="John Doe"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
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
          autoComplete="new-password"
          minLength={6}
        />
      </div>

      {error && (
        <Alert variant="error">
          <CircleAlertIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="info">
          <InfoIcon />
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader className="h-4 w-4 animate-spin" />}
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 text-foreground"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 text-foreground"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {showSignInHint && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      )}
    </form>
  );
}
