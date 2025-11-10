import type { Metadata } from 'next'
import Link from 'next/link'

const effectiveDate = 'November 9, 2025'

export const metadata: Metadata = {
  title: 'Privacy Policy • Kinoa',
  description: 'How Kinoa collects, uses, and protects information when you use the platform.',
}

export default function PrivacyPage() {
  return (
    <article className='mx-auto flex w-full max-w-3xl flex-col gap-8 py-10'>
      <header className='space-y-2'>
        <p className='text-sm uppercase tracking-wide text-muted-foreground'>Legal</p>
        <h1 className='text-3xl font-semibold tracking-tight'>Privacy Policy</h1>
        <p className='text-sm text-muted-foreground'>
          Your privacy matters to us. This policy explains what information Kinoa (“we”, “us”) collects when you use our
          Service, how it is used, and the choices available to you.
        </p>
      </header>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>1. Information We Collect</h2>
        <p>We strive to minimize the personal data we collect. Depending on how you interact with the Service, we may collect:</p>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>Usage data:</strong> Pages visited, search queries, approximate location derived from IP address, browser
            type, device information, and interaction timestamps. This helps us understand performance and improve features.
          </li>
          <li>
            <strong>Technical data:</strong> Diagnostic logs, referral URLs, crash reports, and basic device settings required to
            deliver the Service securely.
          </li>
          <li>
            <strong>Optional contact data:</strong> If you email us for support or legal reasons, we store the contents of your
            message and contact details to respond.
          </li>
        </ul>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>2. How We Use Information</h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>Provide, operate, and personalize the Service.</li>
          <li>Monitor usage, detect fraud, and maintain security.</li>
          <li>Debug technical issues and analyze feature performance.</li>
          <li>Respond to support requests and legal inquiries.</li>
          <li>Comply with applicable laws and enforce our Terms of Service.</li>
        </ul>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>3. Cookies and Local Storage</h2>
        <p>
          We use essential cookies and browser storage to remember preferences (such as theme selection) and maintain secure
          sessions. We may use privacy-focused analytics tools that rely on aggregated or pseudonymous data. You can control
          cookies via your browser settings, though disabling essential cookies may affect functionality.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>4. Third-Party Services</h2>
        <p>
          The Service integrates third parties to deliver core functionality:
        </p>
        <ul className='list-disc space-y-2 pl-5'>
          <li>
            <strong>VidFast or similar embed providers</strong> supply the actual streaming player. When you press play, the
            provider receives standard playback data (such as your IP address and device information) necessary to stream the
            content. Their use of data is governed by their own policies.
          </li>
          <li>
            <strong>TMDB</strong> provides metadata (posters, summaries, credits). Requests made to display metadata may be
            logged by TMDB in accordance with their privacy practices.
          </li>
          <li>
            <strong>Infrastructure and security vendors</strong> assist with hosting, logging, and monitoring. These vendors
            are contractually obligated to safeguard the information they process on our behalf.
          </li>
        </ul>
        <p>We do not sell personal data to third parties.</p>
        <p>
          Kinoa does not control the data practices of VidFast or other embedded players. Those providers act as separate
          controllers of any personal information they collect while delivering the stream. Please review their privacy
          notices to understand how your data is handled once playback begins.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>5. Data Retention</h2>
        <p>
          We retain usage and diagnostic data only for as long as necessary to fulfill the purposes described in this policy,
          comply with legal obligations, resolve disputes, and enforce agreements. Emails and support tickets are retained for
          audit and compliance reasons but may be deleted upon request once the matter is resolved.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>6. Security</h2>
        <p>
          We use industry-standard safeguards—HTTPS, access controls, monitoring—to protect data. No system can be fully
          secure, so we encourage you to report suspected vulnerabilities to{' '}
          <Link href='mailto:security@kinoa.lol' className='text-foreground underline underline-offset-4'>
            security@kinoa.lol
          </Link>
          .
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>7. Your Choices and Rights</h2>
        <ul className='list-disc space-y-2 pl-5'>
          <li>Opt out of non-essential cookies through your browser or device settings.</li>
          <li>
            Request access to or deletion of the limited personal data we hold by emailing{' '}
            <Link href='mailto:privacy@kinoa.lol' className='text-foreground underline underline-offset-4'>
              privacy@kinoa.lol
            </Link>
            . We may need to retain certain information for legal compliance.
          </li>
          <li>
            If you are in a jurisdiction with specific privacy rights (e.g., GDPR, CCPA), please identify your region so we
            can process the request in accordance with applicable laws.
          </li>
        </ul>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>8. Children’s Privacy</h2>
        <p>
          The Service is not directed to children under 13. We do not knowingly collect personal information from children.
          If you believe a child has provided us information, please contact us and we will take steps to delete it.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>9. International Data Transfers</h2>
        <p>
          Our infrastructure may be located in the United States or other countries. By using the Service, you consent to the
          transfer and processing of information in the United States and other jurisdictions that may have data protection
          laws different from those in your home country.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>10. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time to reflect changes to the Service or legal requirements. Material
          changes will be communicated via in-product notice or email (if available). Continued use after changes become
          effective signifies acceptance of the revised policy.
        </p>
      </section>

      <section className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
        <h2 className='text-base font-semibold text-foreground'>11. Contact Us</h2>
        <p>
          For privacy questions or requests, email{' '}
          <Link href='mailto:privacy@kinoa.lol' className='text-foreground underline underline-offset-4'>
            privacy@kinoa.lol
          </Link>
          .
        </p>
      </section>

      <footer className='text-xs text-muted-foreground'>Effective date: {effectiveDate}</footer>
    </article>
  )
}

