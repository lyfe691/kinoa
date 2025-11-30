"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";

export function AuthMessageHandler() {
  const [message, setMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    // Check hash for Supabase messages
    // e.g. #message=Confirmation+link+accepted...
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const msg = params.get("message");
    const error = params.get("error_description") || params.get("error");

    if (msg) {
      // Handle specific success flow for secure email change
      if (msg.includes("Confirmation link accepted")) {
        setMessage(
          "Confirmation accepted. Please check your other email address to complete the process.",
        );
        setIsSuccess(true);
      } else {
        setMessage(decodeURIComponent(msg));
      }
    } else if (error) {
      setMessage(decodeURIComponent(error));
    }
  }, []);

  if (isSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Step 1 Complete
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">{message}</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>Check your inbox for the second confirmation link</span>
        </div>
        <Button render={<Link href="/" />} className="mt-4">
          Return Home
        </Button>
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
      <Button render={<Link href="/" />} className="mt-4">
        Back to home
      </Button>
    </div>
  );
}
