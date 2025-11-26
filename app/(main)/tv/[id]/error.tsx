"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

type TvShowErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function TvShowError({ error, reset }: TvShowErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Show unavailable"
      message="We ran into an issue loading this series. Try again or return to the homepage."
      reset={reset}
    />
  );
}

