"use client";

type ErrorMatcher = {
  includes: string;
  friendly: string;
};

const AUTH_ERROR_MATCHERS: ErrorMatcher[] = [
  {
    includes: "invalid login credentials",
    friendly: "Email or password is incorrect.",
  },
  {
    includes: "email not confirmed",
    friendly: "Please confirm your email and try again.",
  },
  {
    includes: "user already registered",
    friendly: "An account with this email already exists.",
  },
  {
    includes: "password should be at least 6 characters",
    friendly: "Passwords must be at least 6 characters long.",
  },
  {
    includes: "signup requires a valid password",
    friendly: "Please choose a stronger password.",
  },
  {
    includes: "new password should be different from the old password",
    friendly: "Please choose a password you haven't used before.",
  },
];

function extractErrorMessage(error: unknown): string | null {
  if (typeof error === "string") return error;
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  return null;
}

/**
 * Parses rate limit errors from Supabase.
 * Example message: "For security purposes, you can only request this after 42 seconds."
 * Returns the number of seconds if found, otherwise null.
 */
export function parseRateLimitSeconds(error: unknown): number | null {
  const message = extractErrorMessage(error);
  if (!message) return null;

  const normalized = message.toLowerCase();

  // Check for rate limit patterns
  if (
    !normalized.includes("security purposes") &&
    !normalized.includes("rate limit")
  ) {
    return null;
  }

  // Try to extract seconds from the message
  const match = message.match(/after\s+(\d+)\s+seconds?/i);
  if (match) {
    return parseInt(match[1], 10);
  }

  // Fallback: if it's a rate limit but no seconds found, return a default
  if (
    normalized.includes("rate limit") ||
    normalized.includes("security purposes")
  ) {
    return 60; // Default to 60 seconds
  }

  return null;
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
  const message = extractErrorMessage(error);
  if (!message) return fallback;

  const normalized = message.toLowerCase();
  const match = AUTH_ERROR_MATCHERS.find(({ includes }) =>
    normalized.includes(includes),
  );

  return match?.friendly ?? fallback;
}
