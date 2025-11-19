import type { Metadata } from "next";
import Link from "next/link";

const effectiveDate = "November 19, 2025";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kinoa collects, uses, and protects information when you use the platform.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Your privacy matters to us. This policy explains how Kinoa (“Kinoa”,
          “we”, “us”, or “our”), a service operated from Switzerland, collects
          and processes information when you use the Kinoa website, applications,
          and related services (collectively, the “Service”).
        </p>
      </header>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          1. Data Controller and Contact
        </h2>
        <p>
          Kinoa provides and controls the Service as a digital platform governed
          by Swiss law. For the purposes of the Swiss Federal Act on Data
          Protection (FADP) and, where applicable, the EU General Data Protection
          Regulation (GDPR), Kinoa acts as the data controller for processing
          described in this policy. You can contact us at{" "}
          <Link
            href="mailto:privacy@kinoa.lol"
            className="text-foreground underline underline-offset-4"
          >
            privacy@kinoa.lol
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          2. Information We Collect
        </h2>
        <p>We design the Service to collect only the information we need:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Technical and usage data:</strong> IP address (stored in
            truncated or hashed form where feasible), device and browser type,
            referring URL, language preference, pages viewed, search queries,
            timestamps, and interaction events used to operate and secure the
            Service.
          </li>
          <li>
            <strong>Diagnostics and logs:</strong> Error reports, performance
            metrics, and aggregated analytics that help us maintain availability
            and detect abuse.
          </li>
          <li>
            <strong>Communications:</strong> If you contact us via email or
            submit a rights request, we process the contents of your message and
            any contact details you provide in order to respond.
          </li>
        </ul>
        <p>
          We do not require user accounts and we do not intentionally collect
          sensitive categories of personal data.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          3. How We Use Information
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Operate, maintain, and improve the Service and its features.</li>
          <li>Provide customer support and respond to enquiries or legal notices.</li>
          <li>
            Monitor usage patterns, detect fraud or abuse, and ensure security
            and stability.
          </li>
          <li>
            Generate aggregated analytics that do not identify you to understand
            which features are most useful.
          </li>
          <li>
            Comply with legal obligations, resolve disputes, and enforce our
            Terms of Service.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          4. Legal Bases for Processing
        </h2>
        <p>
          We process personal data only when we have a legal basis to do so,
          including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Legitimate interests</strong> (FADP Art. 31, GDPR Art. 6(1)(f)):
            to operate, secure, and improve the Service, prevent abuse, and
            maintain accurate records.
          </li>
          <li>
            <strong>Consent</strong> (GDPR Art. 6(1)(a)): for optional features
            such as theme preferences stored in local storage or non-essential
            cookies.
          </li>
          <li>
            <strong>Legal obligations</strong> (FADP, GDPR Art. 6(1)(c)): to
            respond to lawful requests, comply with retention duties, or defend
            legal claims.
          </li>
          <li>
            <strong>Contractual necessity</strong> (GDPR Art. 6(1)(b)): when we
            communicate with you about the Service you have requested.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          5. Cookies, Local Storage, and Similar Technologies
        </h2>
        <p>
          We rely primarily on essential first-party cookies and browser storage
          to remember interface choices (such as theme selection) and to protect
          the Service against abuse. We use privacy-focused analytics that
          either do not rely on cookies or use pseudonymised identifiers. You
          can adjust your browser settings to block or delete cookies; doing so
          may affect functionality.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          6. Sharing and Disclosure
        </h2>
        <p>
          We disclose personal data only to the extent necessary to operate the
          Service or comply with the law:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Service providers:</strong> Hosting, infrastructure,
            security, and analytics vendors that process data on our behalf
            under contractual confidentiality and data protection obligations.
          </li>
          <li>
            <strong>Public authorities:</strong> When required by applicable law
            or a legally binding request from a competent authority.
          </li>
          <li>
            <strong>Business transitions:</strong> In the unlikely event of a
            restructuring, merger, or transfer of the Service, data may be
            disclosed subject to appropriate safeguards.
          </li>
        </ul>
        <p>We do not sell or rent personal data.</p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          7. Third-Party Streaming Hosters
        </h2>
        <p>
          Playback is delivered directly by independent third-party hosters that
          we surface within the Service. When you engage a third-party player,
          that hoster may receive your IP address, device information, playback
          events, and other data required to deliver the stream. Those hosters
          operate under their own privacy policies and act as separate data
          controllers. We do not monitor or control their processing, and your
          interactions with them are solely between you and the hoster. Please
          review their privacy notices before using their services.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          8. Data Retention
        </h2>
        <p>
          We retain personal data only for as long as necessary to fulfil the
          purposes outlined in this policy, to comply with legal obligations, or
          to resolve disputes. Routine server logs are typically retained for up
          to 90 days unless longer retention is required for security or legal
          reasons. Correspondence related to support, legal, or privacy matters
          may be stored for the duration of the enquiry plus any mandatory
          retention period.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          9. International Data Transfers
        </h2>
        <p>
          We may process and store information in Switzerland, the European
          Economic Area (EEA), or other countries where our trusted providers
          operate. When transferring personal data outside Switzerland or the
          EEA, we rely on adequacy decisions, standard contractual clauses, or
          other safeguards recognised by applicable data protection laws.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          10. Security
        </h2>
        <p>
          We implement technical and organisational measures designed to protect
          information against unauthorised access, loss, or misuse, including
          HTTPS encryption, strict access controls, and continuous monitoring. No
          online service can guarantee absolute security, so we encourage you to
          notify us promptly at{" "}
          <Link
            href="mailto:security@kinoa.lol"
            className="text-foreground underline underline-offset-4"
          >
            security@kinoa.lol
          </Link>{" "}
          if you discover a vulnerability.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          11. Your Rights
        </h2>
        <p>
          Depending on where you reside, you may have rights under the FADP, the
          GDPR, or other local laws. These can include the right to request
          access, rectification, deletion, restriction of processing, data
          portability, and to object to certain processing activities. You may
          also withdraw consent where processing is based on consent. To
          exercise these rights, contact{" "}
          <Link
            href="mailto:privacy@kinoa.lol"
            className="text-foreground underline underline-offset-4"
          >
            privacy@kinoa.lol
          </Link>
          . We may request verification of your identity before fulfilling a
          request. You have the right to lodge a complaint with your local data
          protection authority if you believe your rights have been infringed.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          12. Children’s Privacy
        </h2>
        <p>
          The Service is not directed to children under 13, and we do not
          knowingly collect personal data from children. If you believe a child
          has provided us with personal information, please contact us and we
          will take steps to delete it promptly.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          13. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices,
          technologies, or legal obligations. When we make material changes, we
          will post the updated policy on this page and update the “Effective
          date” below. Your continued use of the Service after the effective date
          signifies acceptance of the updated policy.
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          14. Contact
        </h2>
        <p>
          For questions about this Privacy Policy or to exercise your data
          protection rights, email{" "}
          <Link
            href="mailto:privacy@kinoa.lol"
            className="text-foreground underline underline-offset-4"
          >
            privacy@kinoa.lol
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
