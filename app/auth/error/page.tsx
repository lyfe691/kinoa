import { Suspense } from "react";
import { AuthMessageHandler } from "@/components/auth/auth-message-handler";

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthMessageHandler />
    </Suspense>
  );
}
