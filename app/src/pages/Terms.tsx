import LegalLayout from '../components/LegalLayout'

export default function Terms() {
  return (
    <LegalLayout eyebrow="Terms" title="Terms of use" updated="25 October 2026">
      <section>
        <h2>1. What MUALink is</h2>
        <p>
          MUALink gives makeup artists a public profile and a calm place to receive booking
          enquiries. We do not take payments, confirm bookings or act as an agent for either
          side. Any agreement, price or schedule is between you and the client.
        </p>
      </section>

      <section>
        <h2>2. Your account</h2>
        <p>
          Artist accounts are created with Google sign-in. You are responsible for the accuracy
          of your name, city, services, prices and phone number, and for keeping access to your
          Google account secure. One artist profile is allowed per Google account.
        </p>
      </section>

      <section>
        <h2>3. Your content</h2>
        <p>
          You keep ownership of the photos, text and prices you upload. By publishing your
          profile you allow MUALink to display that content to visitors and to store it so your
          profile keeps working. Only upload work you have the right to use, and only photos of
          clients who have agreed to be shown.
        </p>
      </section>

      <section>
        <h2>4. Bride enquiries</h2>
        <p>
          Brides can send an enquiry without creating an account. As an artist you agree to use
          those details only to respond to the enquiry, and not to add people to marketing lists
          or share their number. MUALink may limit or block abusive or automated submissions.
        </p>
      </section>

      <section>
        <h2>5. Free service</h2>
        <p>
          MUALink is free for artists in this version. We take no commission on bookings. If we
          introduce paid features later, the current free features will stay available or we
          will give clear notice before anything changes.
        </p>
      </section>

      <section>
        <h2>6. Acceptable use</h2>
        <ul>
          <li>Do not impersonate another artist or use someone else&apos;s work.</li>
          <li>Do not post unlawful, hateful or misleading content.</li>
          <li>Do not attempt to scrape, overload or break the service.</li>
          <li>Do not use bride contact details for harassment or spam.</li>
        </ul>
        <p>We may pause or remove a profile that breaks these rules.</p>
      </section>

      <section>
        <h2>7. Availability and changes</h2>
        <p>
          We work to keep MUALink available and accurate, but we cannot promise uninterrupted
          service. Features may change as the product develops. You can export your details or
          ask us to delete your account at any time.
        </p>
      </section>

      <section>
        <h2>8. Liability</h2>
        <p>
          To the extent allowed by law, MUALink is not responsible for missed bookings, price
          disagreements, travel issues, or the conduct of artists and clients. Always confirm
          dates, scope and payment directly with the other person.
        </p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Questions about these terms: <a className="font-semibold text-foreground underline underline-offset-2" href="mailto:hello@mualink.in">hello@mualink.in</a>.
          MUALink is a working title for a product built in India.
        </p>
      </section>
    </LegalLayout>
  )
}
