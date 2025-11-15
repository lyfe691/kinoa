"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

type SearchErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SearchError({ error, reset }: SearchErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Search unavailable"
      message="We couldn’t complete that search. Try again or explore the homepage instead."
      reset={reset}
    />
  );
}
