import * as React from "react";

export function useClipboard({ timeout = 2000 }: { timeout?: number } = {}) {
  const [isCopied, setIsCopied] = React.useState(false);

  const copyToClipboard = React.useCallback(
    (value: string) => {
      if (typeof window === "undefined" || !value) return;

      navigator.clipboard.writeText(value).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), timeout);
      });
    },
    [timeout],
  );

  return { isCopied, copyToClipboard };
}
