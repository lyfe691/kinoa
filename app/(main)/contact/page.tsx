import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Kinoa team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Support
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
        <p className="text-sm text-muted-foreground">
          Have a question or need assistance? Fill out the form below and we&apos;ll get back to you as soon as possible.
        </p>
      </header>

      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <p className="text-muted-foreground">
          Contact form implementation pending.
        </p>
      </div>
    </div>
  );
}

