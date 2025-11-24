"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Globe, LogIn } from "lucide-react";

export function AuthMessageHandler() {
  const searchParams = useSearchParams();
  const [message, setMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isCrossBrowser, setIsCrossBrowser] = React.useState(false);

  React.useEffect(() => {
    // 1. Check hash for Supabase messages (Implicit flow / specific redirects)
    const hash = window.location.hash;
    let msg = null;
    let error = null;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      msg = params.get("message");
      error = params.get("error_description") || params.get("error");
    }

    // 2. Check query params (Server-side redirects like from /auth/callback)
    if (!msg && !error) {
      const type = searchParams.get("type");
      if (type === "cross_browser_pkce") {
        setIsCrossBrowser(true);
        return;
      }
      msg = searchParams.get("message");
      error = searchParams.get("error_description") || searchParams.get("error");
    }

    if (msg) {
      if (msg.includes("Confirmation link accepted")) {
        setMessage("Your email address has been confirmed successfully.");
        setIsSuccess(true);
      } else {
        setMessage(decodeURIComponent(msg));
        setIsSuccess(true);
      }
    } else if (error) {
      setMessage(decodeURIComponent(error));
      setIsSuccess(false);
    }
  }, [searchParams]);

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Success</h1>
          <p className="mx-auto max-w-md text-muted-foreground">{message}</p>
        </div>
        <Button asChild className="mt-4">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  if (isCrossBrowser) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
         <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
          <Globe className="h-12 w-12 text-blue-600 dark:text-blue-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Link Opened in New Browser
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            For security, we usually require the link to be opened in the same browser. 
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Did your email update?</p>
            <p>Since your account settings allow flexible changes, your email might have been updated successfully despite this warning.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 min-w-[200px] mt-2">
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Check
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Authentication Error
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          {message ||
            "We couldn't sign you in. The link may have expired or already been used. Please try signing in again."}
        </p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
