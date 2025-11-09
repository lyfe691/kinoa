import type { Metadata } from 'next'
import Link from 'next/link'

const effectiveDate = 'November 9, 2025'

export const metadata: Metadata = {
  title: 'Terms of Service • Kinoa',
  description: 'The legal terms that govern access to and use of the Kinoa streaming interface.',
}

export default function TermsPage() {
  return (
    <article className='mx-auto flex w-full max-w-3xl flex-col gap-8 py-10'>
      <header className='space-y-2'>
        <p className='text-sm uppercase tracking-wide text-muted-foreground'>Legal</p>
        <h1 className='text-3xl font-semibold tracking-tight'>Terms of Service</h1>
        <p className='text-sm text-muted-foreground'>
          These Terms of Service (the “Terms”) form a binding agreement between you and Kinoa (“Kinoa”, “we”, “us”).
          By accessing or using the Kinoa website, applications, or embeddable players (collectively, the “Service”),
          you agree to these Terms. If you do not agree, you must discontinue use immediately.
        </p>
      </header>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>1. Who May Use Kinoa</h2>
        <p>
          You must be at least 16 years old (or the age of majority in your jurisdiction if higher) and capable of
          forming a binding contract to use the Service. If you access the Service on behalf of an organization, you
          confirm that you have authority to bind that organization to these Terms. Parents and guardians are
          responsible for the use of the Service by minors in their care.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>2. Nature of the Service</h2>
        <p>
          Kinoa provides an interface for discovering movie and television metadata sourced from The Movie Database
          (TMDB) and for embedding video streams hosted by third parties such as VidFast. Kinoa does not host, upload,
          or store audiovisual content. All playback occurs through third-party embeds subject to their own terms and
          policies. Availability of any title is not guaranteed and may change without notice.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>3. Your Obligations</h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>Use the Service only for personal, non-commercial viewing and discovery purposes.</li>
          <li>
            Comply with all applicable laws, including copyright and content classification laws in your jurisdiction.
          </li>
          <li>
            Do not attempt to copy, record, distribute, publicly perform, sell, reverse engineer, or otherwise exploit
            any content accessed through the Service.
          </li>
          <li>Do not interfere with, overload, or disrupt the Service or its infrastructure.</li>
          <li>Do not attempt to bypass geographic, digital rights management, or security controls.</li>
          <li>Do not submit malware, automated scripts, or data harvesting tools.</li>
        </ul>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>4. Accounts and Communications</h2>
        <p>
          The current version of the Service does not require a registered user account. If we later introduce
          registration, you must provide accurate information and maintain the confidentiality of any credentials. We
          may contact you at the email address you provide for transactional or legal notices.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>5. Third-Party Services</h2>
        <p>
          Playback uses third-party embeds (including VidFast) that are outside Kinoa’s control. Their terms of use,
          privacy policies, and technical requirements govern the relationship between you and those providers. We do
          not endorse or guarantee the accuracy, legality, or availability of third-party streams. TMDB is used under
          license; TMDB’s trademarks and data remain their respective property.
        </p>
        <p>
          Kinoa is not a party to your relationship with VidFast or any other embed provider. All video playback,
          advertising, billing, or communications initiated through the VidFast player are exclusively between you and
          VidFast. Kinoa does not moderate, curate, or host the underlying streams and disclaims all responsibility for
          the availability, quality, legality, or safety of third-party content and services.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>6. Intellectual Property</h2>
        <p>
          Kinoa retains all rights in its proprietary software, logos, design, and text. Third-party logos, posters,
          trailers, and metadata belong to their respective owners. No license is granted other than the limited right to
          access the Service consistent with these Terms. All feedback or suggestions you provide may be used by us
          without obligation to you.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>7. DMCA and Content Notices</h2>
        <p>
          If you believe content accessible through the Service infringes your intellectual property, send a notice to
          <Link href='mailto:legal@kinoa.tf' className='ml-1 text-foreground underline underline-offset-4'>
            legal@kinoa.tf
          </Link>
          . Include your contact information, description of the copyrighted work, the allegedly infringing material,
          and a statement of good-faith belief. We may forward your notice to the relevant third-party host.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>8. Warranty Disclaimer</h2>
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”. TO THE FULLEST EXTENT PERMITTED BY LAW, KINOA AND ITS
          SUPPLIERS DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT. We do not warrant that the Service will be
          uninterrupted, timely, secure, or error-free, or that results will meet your expectations.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>9. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, KINOA, ITS AFFILIATES, OFFICERS, EMPLOYEES, AND PARTNERS WILL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR LOSS OF
          PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
          KINOA’S TOTAL LIABILITY FOR ALL CLAIMS IN ANY TWELVE-MONTH PERIOD WILL NOT EXCEED FIFTY U.S. DOLLARS (USD $50).
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>10. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless Kinoa and its affiliates from any claims, liabilities,
          damages, losses, and expenses (including reasonable attorney fees) arising from your use of the Service, your
          violation of these Terms, or your infringement of any third-party rights.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>11. Suspension and Termination</h2>
        <p>
          We may suspend or terminate access to the Service at any time, with or without notice, if we believe you have
          violated these Terms or if we discontinue the Service. Upon termination, all licenses granted to you end
          immediately.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>12. Governing Law and Dispute Resolution</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware, USA, excluding its conflicts of law rules. Any
          dispute will be resolved exclusively in the state or federal courts located in Wilmington, Delaware, and both
          parties consent to personal jurisdiction in those courts. You waive trial by jury to the extent permitted by
          law.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>13. Changes to These Terms</h2>
        <p>
          We may modify these Terms from time to time. Material changes will be announced via notice within the Service
          or by email if available. The “Effective date” below will reflect the latest revision. Your continued use of
          the Service after changes take effect constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>14. Contact</h2>
        <p>
          For questions about these Terms, reach us at{' '}
          <Link href='mailto:legal@kinoa.tf' className='text-foreground underline underline-offset-4'>
            legal@kinoa.tf
          </Link>
          .
        </p>
      </section>

      <footer className='text-xs text-muted-foreground'>Effective date: {effectiveDate}</footer>
    </article>
  )
}

