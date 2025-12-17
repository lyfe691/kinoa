import type { Metadata } from 'next'

import { ContactForm } from './_components/contact-form'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Kinoa team.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-10 py-10">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Support
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Contact Us</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Have a question or need assistance? Fill out the form below and
          we&apos;ll get back to you as soon as possible.
        </p>
      </header>

      <ContactForm />
    </div>
  )
}

