import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Privacy Policy - Oasis Dental Clinic',
  description: 'Oasis Dental Clinic privacy policy describing how we collect and use patient information.',
};

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy — Oasis Dental Clinic</h1>
        <p className="text-sm text-gray-600 mb-6">Effective Date: 04/01/2026</p>

        <p className="mb-6">At Oasis Dental Clinic (“we,” “our,” or “the Clinic”), we are committed to protecting the privacy and confidentiality of our patients’ personal and health information. This Privacy Policy explains how we collect, use, store, and safeguard your information when you visit our clinic, use our website, or receive our services.</p>

        <p className="mb-8">By engaging with our services, you acknowledge that you have read and understood this Policy.</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Scope of this Policy</h2>
          <p>This Policy applies to:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Patients and visitors to our clinic</li>
            <li>Users of our website / online forms</li>
            <li>Individuals contacting us by phone, email, or messaging platforms</li>
          </ul>
          <p className="mt-2">It covers both personal information and health/medical information collected as part of treatment and clinic administration.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>

          <h3 className="font-semibold mt-3">A. Personal Identification Information</h3>
          <p className="mb-2">Name, age, gender, address and contact details, email and phone number, and identification numbers (where required).</p>

          <h3 className="font-semibold mt-3">B. Medical &amp; Health Information</h3>
          <p className="mb-2">Medical and dental history, diagnostic records &amp; treatment notes, prescriptions, X-rays, scans, photographs, appointment history and clinical observations.</p>

          <h3 className="font-semibold mt-3">C. Payment &amp; Billing Information</h3>
          <p className="mb-2">Billing/invoice details and payment transaction records. We do not store credit/debit card numbers unless necessary and permitted.</p>

          <h3 className="font-semibold mt-3">D. Website / Digital Information (if applicable)</h3>
          <p className="mb-2">IP address, device information, cookies, and online appointment form details.</p>

          <h3 className="font-semibold mt-3">E. CCTV Footage (if installed on premises)</h3>
          <p className="mb-2">Used for safety and security purposes only.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p className="mb-2">Your information is used for providing dental consultation and treatment, maintaining accurate medical records, appointment scheduling and reminders, patient communication and follow-ups, billing, insurance &amp; accounting purposes, legal, regulatory, and audit compliance, and quality assurance and clinic management. We will never sell, rent, or misuse your personal data.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Legal Basis for Processing</h2>
          <p className="mb-2">We process your information based on your consent, provision of healthcare services, compliance with applicable laws, and legitimate clinical and administrative purposes.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Sharing &amp; Disclosure of Information</h2>
          <p className="mb-2">We may share information only when necessary and lawful, such as with referring doctors or specialists (with consent), diagnostic laboratories / imaging centers, insurance providers (if applicable), government or regulatory authorities (when legally required), and IT service providers under confidentiality agreements. All third parties are required to handle your data securely.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
          <p className="mb-2">We take appropriate technical and organizational measures to protect your data, including secure physical storage of records, limited staff access on a need-to-know basis, and password-protected and encrypted digital systems (where applicable). Despite safeguards, no system is 100% secure — however, we strive to maintain the highest standards of confidentiality.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
          <p className="mb-2">Your records may be retained for the duration required by medical record-keeping regulations, legal and professional guidelines, and clinic operational needs. After expiry, records are securely deleted or destroyed.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Your Rights</h2>
          <p className="mb-2">Subject to applicable law, you may have the right to access your records, request corrections/updates, withdraw consent (where applicable), and request deletion of non-mandatory data. Requests may be made in writing to the contact provided below.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Cookies &amp; Website Tracking (if applicable)</h2>
          <p className="mb-2">Our website may use cookies or analytics tools to improve user experience. You may disable cookies via your browser settings.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Third-Party Links</h2>
          <p className="mb-2">Our website may contain links to external websites. We are not responsible for their privacy practices.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">11. Updates to This Policy</h2>
          <p className="mb-2">We may update this Privacy Policy periodically. The latest version will always be available at the clinic / on our website.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p className="mb-2">If you have questions, concerns, or requests regarding this Privacy Policy, please contact:</p>
          <address className="not-italic text-sm text-gray-700">
            Oasis Dental Clinic<br />
            A Sector<br />
            Papum Pare<br />
            Arunachal Pradesh, India - 791110<br />
            Phone: (+91) 9108980207<br />
            Email: info@oasisdental.com<br />
            Website: https://oasisdental.com
          </address>
        </section>
      </main>

      <Footer />
    </>
  );
}
