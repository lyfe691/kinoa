import type { Metadata } from "next";
import Link from "next/link";

const effectiveDate = "November 19, 2025";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The legal terms that govern access to and use of the Kinoa streaming interface.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-2">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          These Terms of Service (the “Terms”) form a binding agreement between
          you and Kinoa (“Kinoa”, “we”, “us”, “our”). By accessing or using the
          Kinoa website, applications, or embeddable tools (collectively, the
          “Service”), you confirm that you have read, understood, and agree to
          be bound by these Terms. If you do not agree, you must discontinue use
          of the Service immediately.
        </p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          1. Operator and Scope
        </h2>
        <p>
          The Service is owned and operated by Kinoa. All references to “you” or
          “your” refer to any person who accesses or uses the Service in any
          manner, whether or not registered. You may reach us using our{" "}
          <Link
            href="/contact?topic=general"
            className="text-foreground underline underline-offset-4"
          >
            contact form
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          2. Nature of the Service
        </h2>
        <p>
          Kinoa provides a discovery interface and catalog of audiovisual
          metadata sourced from public APIs (including The Movie Database) and
          displays iframe players provided directly by independent third-party
          streaming hosters. Kinoa does not upload, host, store, curate, verify,
          or control any audiovisual files. When you launch playback, you are
          interacting directly with external providers that operate under their
          own agreements, privacy policies, and legal obligations.
        </p>
        <p>
          Availability of any title, stream quality, subtitle options, and
          regional access are determined solely by those third parties. We do
          not guarantee that any content is lawful, accurate, or available in
          your jurisdiction, nor do we endorse or mediate it. You agree to use
          the Service solely as an informational directory and entirely at your
          own risk. You remain responsible for determining whether accessing a
          stream is lawful in every location from which you use the Service.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          3. Eligibility
        </h2>
        <p>
          You must be at least 16 years old (or the age of majority in your
          jurisdiction, if higher) and capable of entering into a binding
          contract to use the Service. If you are accessing the Service on
          behalf of an organisation, you represent that you have authority to
          bind that organisation. Parents and guardians remain fully responsible
          for use of the Service by minors in their care.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          4. User Responsibilities and Acceptable Use
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Use the Service only for personal, non-commercial discovery and
            playback initiated voluntarily by you.
          </li>
          <li>
            Ensure that accessing third-party streams complies with the laws of
            your country of residence and the country where you view the
            content.
          </li>
          <li>
            Do not copy, record, rebroadcast, capture screenshots, distribute,
            publicly perform, rent, sell, or otherwise exploit any content
            retrieved through third-party players.
          </li>
          <li>
            Obtain any licences or permissions required to view or use streamed
            content and do not rely on Kinoa to secure those rights for you.
          </li>
          <li>
            Do not attempt to bypass geographic restrictions, subscription
            requirements, payment walls, or digital rights management tools
            imposed by third parties.
          </li>
          <li>
            Do not upload, transmit, or distribute malware, automated scripts,
            bots, scrapers, denial-of-service attacks, or other harmful code.
          </li>
          <li>
            Do not interfere with the proper operation of the Service or any
            third-party player embedded within it.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          5. Accounts and Communications
        </h2>
        <p>
          The Service offers optional user accounts to provide features such as
          a personal watchlist. Accounts are not required to access content.
          Should you choose to register, you agree to provide accurate
          information, keep your credentials secure, and promptly update any
          changes. We may provide transactional or legal notices to the contact
          email you supply; such notices are deemed received upon dispatch.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          6. Third-Party Services and Content
        </h2>
        <p>
          The Service surfaces links and embedded players operated by
          independent third-party hosters. Those hosters act as separate
          controllers of any personal data they process and may impose their own
          age gates, subscriptions, region locks, or advertising. We have no
          control over their catalogues, moderation practices, takedown
          policies, or technical reliability. You are solely responsible for
          reviewing and complying with any terms, privacy notices, or community
          guidelines published by those third parties before engaging with them.
        </p>
        <p>
          <strong>Advertisements:</strong> The Service may display
          advertisements, including pop-ups, pop-unders, or banners, which may
          be delivered by us or by third-party hosters. We do not vet, endorse,
          or control the content of third-party advertisements or the websites
          they link to. Your interactions with advertisers are solely between
          you and them. Kinoa has no technical ability to access, control,
          modify, or censor the content, advertisements, or cookies delivered
          within third-party embedded players.
        </p>
        <p>
          Kinoa does not intermediate payments, customer support, advertising,
          or dispute resolution related to third-party streams. All playback
          requests, including autoplay, are executed client-side at your
          initiative. Your relationship with any third-party provider exists
          independently from these Terms, and you release Kinoa from any claim
          arising out of or relating to such relationships. Kinoa makes no
          representation that any third-party hoster is authorised to distribute
          specific works and does not audit or monitor their catalogues beyond
          automated embedding. You acknowledge that third-party providers may
          remove or alter content without notice and that Kinoa may disable
          access to specific embeds at any time in response to complaints,
          takedown requests, or legal risk assessments.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          7. Intellectual Property
        </h2>
        <p>
          Kinoa retains all rights, title, and interest in its proprietary
          software, user interface, trademarks, logos, text, and compilations of
          metadata. Third-party trademarks, posters, still images, trailers, and
          other materials displayed within the Service belong to their
          respective owners and are used solely for identification and editorial
          purposes. No license is granted to you other than the limited,
          revocable right to access the Service in accordance with these Terms.
          Any feedback or suggestions you submit may be used by us without
          obligation or compensation.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          8. DMCA / Copyright Disclaimer
        </h2>
        <p>
          Kinoa is a metadata discovery platform that utilizes public APIs (such
          as The Movie Database) to provide information about movies and TV
          shows. We do not host, store, or upload any media files. All playback
          is embedded from independent third-party services which we do not
          control.
        </p>
        <p>
          <strong>No Content Hosting:</strong> Since Kinoa does not host any
          content, we cannot remove the actual media files. Copyright
          infringement claims and DMCA takedown notices should be directed to
          the third-party website hosting the content. If you are a copyright
          owner, please contact the original content provider to ensure the
          material is removed from the internet.
        </p>
        <p>
          <strong>Link Removal:</strong> If you believe a link on Kinoa points
          to infringing content and you wish for the <em>link</em> to be removed
          from our index, you may contact us using our{" "}
          <Link
            href="/contact?topic=dmca"
            className="text-foreground underline underline-offset-4"
          >
            contact form
          </Link>
          . Please provide the exact URL of the page on Kinoa. Note that
          removing a link from Kinoa does not remove the content from the source
          hoster.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          9. Disclaimer of Warranties
        </h2>
        <p>
          THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE”. TO THE FULLEST
          EXTENT PERMITTED UNDER APPLICABLE LAW, KINOA DISCLAIMS ALL EXPRESS,
          IMPLIED, AND STATUTORY WARRANTIES, INCLUDING WITHOUT LIMITATION
          WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, QUIET ENJOYMENT, ACCURACY, OR AVAILABILITY. We do
          not warrant that the Service will function uninterrupted or error-free
          or that third-party streams will meet your expectations.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          10. Limitation of Liability
        </h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, KINOA, ITS OWNERS,
          OFFICERS, CONTRACTORS, AND PARTNERS SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE
          DAMAGES, NOR FOR LOSS OF PROFITS, GOODWILL, DATA, OR OTHER INTANGIBLE
          LOSSES ARISING OUT OF OR RELATING TO YOUR ACCESS TO OR USE OF THE
          SERVICE OR ANY THIRD-PARTY STREAMS. OUR TOTAL LIABILITY FOR ALL CLAIMS
          IN ANY TWELVE-MONTH PERIOD IS LIMITED TO THE GREATER OF FIFTY US
          DOLLARS ($50) OR THE AMOUNT YOU PAID TO US FOR THE SERVICE DURING THAT
          PERIOD (IF ANY).
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          11. Indemnification
        </h2>
        <p>
          You agree to indemnify, defend, and hold harmless Kinoa and its
          respective owners, contractors, and partners from any claim, demand,
          liability, loss, damage, cost, or expense (including reasonable legal
          fees) arising out of or related to your use of the Service, your
          breach of these Terms, or your violation of any rights of another
          person or entity.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          12. Suspension and Termination
        </h2>
        <p>
          We may suspend, restrict, or terminate your access to all or part of
          the Service at any time, with or without notice, if we reasonably
          believe you have violated these Terms, created risk or possible legal
          exposure for us, or if we choose to discontinue the Service. Upon
          termination, all rights and licenses granted to you automatically
          cease, and provisions that by their nature should survive will remain
          in effect.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          13. Governing Law and Dispute Resolution
        </h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which
          Kinoa is established, without regard to its conflict of law
          provisions.
        </p>
        <p>
          Any dispute arising from these Terms shall be resolved in the
          competent courts of said jurisdiction. If you are a consumer, you may
          also benefit from mandatory protections under the laws of your country
          of residence.
        </p>
        <p>
          <strong>Class Action Waiver:</strong> To the fullest extent permitted
          by applicable law, you agree that any dispute resolution proceedings
          will be conducted only on an individual basis and not in a class,
          consolidated, or representative action.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          14. Miscellaneous
        </h2>
        <p>
          If any provision of these Terms is held invalid or unenforceable, that
          provision will be enforced to the maximum extent permissible and the
          remaining provisions will remain in full force. Our failure to enforce
          any right or provision will not constitute a waiver. You may not
          assign or transfer your rights or obligations under these Terms
          without our prior written consent. We may assign these Terms without
          restriction in connection with a merger, acquisition, or sale of
          assets.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          15. Changes to These Terms
        </h2>
        <p>
          We may update these Terms from time to time to reflect changes in the
          Service, legal requirements, or our operational practices. Material
          changes will be announced via notice within the Service or by email if
          we have your contact information. Your continued use of the Service
          after the effective date of any update constitutes acceptance of the
          revised Terms. If you do not agree to the changes, you must stop using
          the Service.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">16. Contact</h2>
        <p>
          For questions about these Terms or for legal notices, please get in
          touch using our{" "}
          <Link
            href="/contact?topic=general"
            className="text-foreground underline underline-offset-4"
          >
            contact form
          </Link>
          .
        </p>
      </section>

      <footer className="text-xs text-muted-foreground">
        Effective date: {effectiveDate}
      </footer>
    </article>
  );
}
