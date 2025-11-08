import type { Metadata } from 'next'
import Link from 'next/link'

const effectiveDate = 'January 1, 2025'

export const metadata: Metadata = {
  title: 'Terms of Service • Kinoa',
  description: 'Read the terms that govern use of the Kinoa streaming platform.',
}

export default function TermsPage() {
  return (
    <article className='mx-auto flex w-full max-w-3xl flex-col gap-6 py-10'>
      <header className='space-y-2'>
        <p className='text-sm uppercase text-muted-foreground'>Legal</p>
        <h1 className='text-3xl font-semibold tracking-tight'>Terms of Service</h1>
        <p className='text-sm text-muted-foreground'>
          These terms describe how you may use Kinoa and outline your rights and responsibilities.
        </p>
      </header>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <p>
          By accessing or using Kinoa you agree to follow these terms. If you do not agree, you must stop using the
          service. We reserve the right to update the terms at any time. When changes are made, the updated version will
          be posted here with a new effective date.
        </p>
        <p>
          You agree only to use Kinoa for personal, non-commercial purposes. You will not attempt to reverse engineer,
          interfere with, or disrupt the service. Content presented within the platform is provided by third-party
          partners and remains the property of its respective owners.
        </p>
        <p>
          Kinoa is provided on an “as is” basis without warranties of any kind. To the fullest extent permitted by law,
          we disclaim liability for any indirect or consequential damages arising from your use of the service.
        </p>
        <p>
          For questions about these terms, please{' '}
          <Link href='mailto:legal@kinoa.app' className='text-foreground underline underline-offset-4'>
            contact us
          </Link>
          .
        </p>
      </section>

      <footer className='text-xs text-muted-foreground'>Effective date: {effectiveDate}</footer>
    </article>
  )
}

