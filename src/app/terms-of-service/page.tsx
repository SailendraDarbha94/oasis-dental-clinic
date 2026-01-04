import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
	title: 'Terms of Service - Oasis Dental Clinic',
	description: 'Terms of Service for Oasis Dental Clinic website and services.',
};

export default function TermsPage() {
	return (
		<>
			<Header />

			<main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h1 className="text-3xl font-bold mb-4">Terms of Service — Oasis Dental Clinic</h1>
				<p className="text-sm text-gray-600 mb-6">Effective Date: 04/01/2026</p>

				<p className="mb-6">Welcome to Oasis Dental Clinic ("we," "our," or "the Clinic"). These Terms of Service ("Terms") govern your use of our website and any services, information, or resources provided through it. By visiting our website or using our services, you agree to be bound by these Terms.</p>

				<p className="mb-6">If you do not agree with these Terms, please do not use our website.</p>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">1. Use of Website &amp; Services</h2>
					<p className="mb-2">You agree to use this website only for lawful purposes. You must not attempt to disrupt website functionality, access data without authorization, or misuse any forms or communication channels.</p>
					<p className="mb-2">This website is intended for individuals 18 years of age or older. Minors may use the site only with supervision or on behalf of a parent/guardian.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">2. No Medical or Dental Advice</h2>
					<p className="mb-2">Content on this website is provided for general informational and educational purposes only. It is not a substitute for professional diagnosis, in-person clinical examination, or personalized treatment planning. Always consult a qualified dentist in person regarding your oral health concerns. Never delay seeking treatment because of information on this website.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">3. Appointments, Cancellations &amp; Rescheduling</h2>
					<p className="mb-2">Appointments may be booked online, by phone, or in person. By booking an appointment, you agree that you will provide accurate personal and medical information and inform us in advance if you need to cancel or reschedule.</p>
					<p className="mb-2">The clinic reserves the right to charge consultation or cancellation fees (if applicable) and to reschedule appointments due to emergencies or clinician availability.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">4. Fees, Payments &amp; Insurance</h2>
					<p className="mb-2">All treatment fees will be explained before procedures are performed. Charges may vary based on clinical findings and treatment needs.</p>
					<ul className="list-disc ml-6 mt-2">
						<li>Insurance claims are subject to insurer terms.</li>
						<li>Estimates are not guarantees of coverage.</li>
					</ul>
					<p className="mt-2">You remain responsible for any unpaid balances.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">5. Patient Responsibilities</h2>
					<p className="mb-2">By receiving services at our clinic, you agree to provide complete and accurate medical/dental history, disclose medications, allergies, and health conditions, and follow post-treatment instructions provided by the dentist. Failure to do so may affect treatment outcomes.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">6. Intellectual Property Rights</h2>
					<p className="mb-2">All website content including text, images, graphics, clinic logo, articles and educational material is the property of Oasis Dental Clinic and protected by copyright laws. You may not copy, reproduce, distribute, or modify website content without prior written permission.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
					<p className="mb-2">To the maximum extent permitted by law, the Clinic shall not be liable for any damages resulting from use or inability to use the website, inaccuracies or typographical errors, technical issues, viruses, or website downtime. Use of our website is at your own risk.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
					<p className="mb-2">Our website may contain links to third-party websites or services. We are not responsible for their content, accuracy, privacy practices, or terms or policies. Accessing third-party websites is at your discretion.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">9. Privacy Policy</h2>
					<p className="mb-2">Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our website, you also agree to our Privacy Policy.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">10. Changes to These Terms</h2>
					<p className="mb-2">We may update these Terms from time to time. The latest version will always be posted on this page with an updated effective date. Continued use of the website constitutes acceptance of any changes.</p>
				</section>

				<section className="mb-6">
					<h2 className="text-xl font-semibold mb-2">11. Governing Law</h2>
					<p className="mb-2">These Terms are governed by the laws of India, without regard to conflict of law principles.</p>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
					<p className="mb-2">If you have any questions about these Terms, please contact:</p>
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

