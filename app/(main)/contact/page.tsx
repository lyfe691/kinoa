import type { Metadata } from "next";

import { ContactForm } from "./_components/contact-form";
import { isValidTopic, type ContactTopic } from "./config";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Kinoa team.",
};

interface ContactPageProps {
  searchParams: Promise<{ topic?: string }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { topic } = await searchParams;
  const defaultTopic: ContactTopic | undefined = isValidTopic(topic)
    ? topic
    : undefined;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-10 py-2">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Support
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Contact Us</h1>
        <p className="text-sm text-muted-foreground">
          Questions, requests, or reports? Send us a message and we&apos;ll
          reply soon.
        </p>
      </header>

      <ContactForm defaultTopic={defaultTopic} />
    </div>
  );
}
