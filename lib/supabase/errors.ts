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
    includes: "rate limit",
    friendly: "Too many attempts. Please try again later.",
  },
  {
    includes: "signup requires a valid password",
    friendly: "Please choose a stronger password.",
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

export function getAuthErrorMessage(error: unknown, fallback: string) {
  const message = extractErrorMessage(error);
  if (!message) return fallback;

  const normalized = message.toLowerCase();
  const match = AUTH_ERROR_MATCHERS.find(({ includes }) =>
    normalized.includes(includes),
  );

  return match?.friendly ?? fallback;
}
