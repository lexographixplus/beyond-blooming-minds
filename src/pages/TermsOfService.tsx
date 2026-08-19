import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import SiteLayout from '../components/SiteLayout';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function TermsOfService() {
  useDocumentMeta({
    title: 'Terms of Service',
    description: 'The terms that apply when you use the Beyond Blooming Minds website and services.',
  });
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 px-4 pt-28 pb-16 sm:px-6 lg:px-8 lg:pt-36 lg:pb-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-primary-600/15 blur-[120px]" />
            <div className="absolute -bottom-20 left-0 h-[360px] w-[360px] rounded-full bg-accent-500/10 blur-[100px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white">
                <ArrowLeft size={16} />Back home
              </Link>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
            >
              Terms of Service
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-lg text-white/70"
            >
              Last updated: July 2026
            </motion.p>
          </div>
        </section>

        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-gray-600 prose-strong:text-gray-900">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Beyond Blooming Minds website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.
            </p>

            <h2>2. About Our Services</h2>
            <p>
              Beyond Blooming Minds provides psychoeducation, psychosocial support, holistic wellness programs, and advocacy services for individuals, schools, and communities. We also publish and sell books related to healing, identity, and personal growth. Our services are educational and supportive in nature and are not a substitute for professional mental health treatment, therapy, or medical advice.
            </p>

            <h2>3. Use of the Website</h2>
            <p>You agree to use our website only for lawful purposes and in a manner that does not:</p>
            <ul>
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe on the rights of others.</li>
              <li>Interfere with or disrupt the operation of the website.</li>
              <li>Attempt to gain unauthorised access to any part of the website or its systems.</li>
            </ul>

            <h2>4. Book Orders</h2>
            <p>
              When you place an order for a book through our website, you are submitting an order request. All orders are subject to availability and confirmation. We will follow up with you via the contact information you provide to confirm your order, arrange payment, and coordinate delivery.
            </p>
            <p>
              Prices listed on the website are indicative and may be subject to change. Final pricing will be confirmed when we respond to your order request.
            </p>

            <h2>5. Contact Form Submissions</h2>
            <p>
              Information submitted through our contact form is used solely to respond to your enquiry. We handle all personal data in accordance with our <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>.
            </p>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on this website — including text, images, graphics, logos, book covers, and design elements — is the property of Beyond Blooming Minds or its content creators and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or use any content from this website without prior written permission.
            </p>

            <h2>7. Program Participation</h2>
            <p>
              Participation in any of our psychoeducation sessions, workshops, or programs is voluntary. While we strive to provide valuable, evidence-informed content, we do not guarantee specific outcomes. Our programs are designed to support wellbeing and are not intended to replace professional clinical services.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              Beyond Blooming Minds provides its website and services on an "as is" basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or services.
            </p>

            <h2>9. External Links</h2>
            <p>
              Our website may contain links to third-party websites or social media platforms. We are not responsible for the content, privacy practices, or policies of those external sites. Accessing them is at your own discretion and risk.
            </p>

            <h2>10. Changes to These Terms</h2>
            <p>
              We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which Beyond Blooming Minds operates. Any disputes arising from these terms shall be resolved in the appropriate courts of that jurisdiction.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please reach out to us through our <Link to="/" className="text-primary-600 hover:underline">contact form</Link> or the contact details listed on our website.
            </p>
          </div>
      </article>
    </SiteLayout>
  );
}
