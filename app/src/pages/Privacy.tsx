import LegalLayout from '../components/LegalLayout'

export default function Privacy() {
  return (
    <LegalLayout eyebrow="Privacy" title="Privacy Policy" updated="25 October 2026">
      <section>
        <h2>1. What we collect</h2>
        <ul>
          <li>
            <strong>Artist account:</strong> your name, email and profile photo from Google, plus
            the city, WhatsApp number, bio, services, prices and portfolio photos you add.
          </li>
          <li>
            <strong>Bride enquiries:</strong> name, WhatsApp number, occasion, event date, venue,
            requested services, budget, notes and an optional inspiration photo.
          </li>
          <li>
            <strong>Technical data:</strong> the minimum needed to keep you signed in and to
            protect the service from abuse.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Why we use it</h2>
        <p>
          To publish your profile, deliver enquiries to you, prepare a short request summary, send
          you a WhatsApp opener, keep your blocked dates accurate, and prevent spam. We do not use
          your content for advertising, and we do not sell personal data.
        </p>
      </section>

      <section>
        <h2>3. Who can see what</h2>
        <ul>
          <li>Your public profile shows your name, city, bio, services, prices and photos.</li>
          <li>Your WhatsApp number is never shown publicly; it is used for your own reminder links.</li>
          <li>Bride enquiries are visible only to the artist they were sent to.</li>
          <li>Bride details are never shown on the public profile or to other artists.</li>
        </ul>
      </section>

      <section>
        <h2>4. Where it is stored</h2>
        <p>
          Accounts and data are stored with Supabase, and Google handles sign-in authentication.
          Photos are kept in a storage bucket with per-artist folders. Access is controlled by
          database rules so that one artist cannot read another artist&apos;s enquiries.
        </p>
      </section>

      <section>
        <h2>5. How long we keep it</h2>
        <p>
          We keep your profile while your account is active. Enquiries remain available to you for
          your records until you delete them or ask us to delete your account. You can email us to
          request deletion at any time.
        </p>
      </section>

      <section>
        <h2>6. Storage on your device</h2>
        <p>
          We use your browser&apos;s local storage for your language choice, a draft booking form,
          and — in preview mode — your demo profile. Sign-in sessions are handled securely by
          Supabase. You can clear this at any time from your browser settings.
        </p>
      </section>

      <section>
        <h2>7. Your choices</h2>
        <ul>
          <li>Edit or unpublish your profile from the artist dashboard.</li>
          <li>Block dates so brides see an availability warning.</li>
          <li>Sign out from Account &amp; privacy.</li>
          <li>Email us to access, correct or delete your data.</li>
        </ul>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>MUALink is for adults who can enter into a booking agreement. It is not intended for anyone under 18.</p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>
          Privacy questions or deletion requests: <a className="font-semibold text-foreground underline underline-offset-2" href="mailto:hello@mualink.in">hello@mualink.in</a>.
          We aim to reply within 7 working days.
        </p>
      </section>
    </LegalLayout>
  )
}
