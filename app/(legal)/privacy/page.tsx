import type { Metadata } from 'next'
import Link from 'next/link'

const effectiveDate = 'January 1, 2025'

export const metadata: Metadata = {
  title: 'Privacy Policy • Kinoa',
  description: 'Understand how Kinoa handles data and protects your privacy.',
}

export default function PrivacyPage() {
  return (
    <article className='mx-auto flex w-full max-w-3xl flex-col gap-6 py-10'>
      <header className='space-y-2'>
        <p className='text-sm uppercase text-muted-foreground'>Legal</p>
        <h1 className='text-3xl font-semibold tracking-tight'>Privacy Policy</h1>
        <p className='text-sm text-muted-foreground'>
          We explain the information we collect, how it is used, and the choices available to you.
        </p>
      </header>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <p>
          Kinoa collects minimal information necessary to provide the service. This includes basic device data, usage
          analytics, and preferences stored in your browser. We do not sell personal information to third parties.
        </p>
        <p>
          We rely on trusted infrastructure providers to deliver streaming functionality. These providers may receive
          anonymized metrics required to operate their services. Any embedded players remain subject to their own
          privacy practices.
        </p>
        <p>
          You can request deletion of any personal data we hold by emailing{' '}
          <Link href='mailto:privacy@kinoa.app' className='text-foreground underline underline-offset-4'>
            privacy@kinoa.app
          </Link>
          . Some information may be retained to comply with legal obligations.
        </p>
        <p>
          We will notify you of meaningful updates to this policy by revising the effective date and posting a notice
          within the product experience.
        </p>
      </section>

      <footer className='text-xs text-muted-foreground'>Effective date: {effectiveDate}</footer>
    </article>
  )
}

