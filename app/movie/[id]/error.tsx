"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/error-state";

type MovieErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MovieError({ error, reset }: MovieErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Movie unavailable"
      message="We could not load this movie right now. Please try again or head back home."
      reset={reset}
    />
  );
}
