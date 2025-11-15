"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const supabase = React.useMemo(() => createSupabaseBrowserClient(), []);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      setLoading(true);

      const trimmedUsername = username.trim();

      if (trimmedUsername.length < 3) {
        setError("Username must be at least 3 characters");
        setLoading(false);
        return;
      }

      try {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: trimmedUsername,
            },
          },
        });

        if (signUpError) throw signUpError;

        router.push("/");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign up failed");
      } finally {
        setLoading(false);
      }
    },
    [username, email, password, supabase, router],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="cinephile"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          required
          autoComplete="username"
          minLength={3}
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
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader className="h-4 w-4 animate-spin" />}
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}

