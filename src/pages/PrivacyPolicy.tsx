import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 lg:pt-[72px]">
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
              Privacy Policy
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
            <h2>1. Introduction</h2>
            <p>
              Beyond Blooming Minds ("we", "us", or "our") is committed to protecting the privacy and personal information of everyone who interacts with our services, website, and programs. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website, use our services, submit contact or order forms, or engage with our psychoeducation programs.
            </p>

            <h2>2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
              <li><strong>Personal information:</strong> Name, email address, and phone number when you submit a contact form, place a book order, or register for a program.</li>
              <li><strong>Order information:</strong> Book titles, quantities, and any notes you provide when placing an order through our website.</li>
              <li><strong>Usage data:</strong> General information about how you interact with our website, such as pages visited and time spent, collected through standard web analytics.</li>
              <li><strong>Communication data:</strong> Any messages, feedback, or enquiries you send to us through our contact form or email.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>To respond to your enquiries and provide the services you have requested.</li>
              <li>To process and fulfil book orders and program registrations.</li>
              <li>To communicate with you about our services, programs, and events.</li>
              <li>To improve our website, services, and overall user experience.</li>
              <li>To comply with any legal obligations.</li>
            </ul>

            <h2>4. How We Protect Your Information</h2>
            <p>
              We take reasonable measures to protect your personal information from unauthorised access, alteration, disclosure, or destruction. Our website uses secure technologies, and we limit access to personal data to only those who need it to carry out their responsibilities.
            </p>

            <h2>5. Sharing Your Information</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul>
              <li>With service providers who help us operate our website and deliver our services, under strict confidentiality agreements.</li>
              <li>When required by law or to protect the rights, safety, or property of Beyond Blooming Minds or others.</li>
            </ul>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. Contact and order form submissions are retained for a reasonable period to ensure we can follow up and provide support.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to the personal information we hold about you.</li>
              <li>Request correction or deletion of your personal information.</li>
              <li>Withdraw consent for us to use your information at any time.</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the details provided on our website.
            </p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our website is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us so we can promptly remove it.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or how we handle your data, please reach out to us through our <Link to="/" className="text-primary-600 hover:underline">contact form</Link> or the contact details listed on our website.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
