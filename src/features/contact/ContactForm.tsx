import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Instagram, Mail, MessageCircle, Send } from 'lucide-react';
import { submitContactForm } from '../../lib/supabase';
import { useCms } from '../../context/CmsContext';
import { toWhatsAppNumber } from '../../lib/utils';

export default function ContactForm() {
  const { content } = useCms();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const whatsappNumber = toWhatsAppNumber(content.whatsapp);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await submitContactForm(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (submitError) {
      console.error('Error submitting form', submitError);
      setError('Your message could not be sent right now. Please try again, or contact us directly below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20';

  const channels = [
    {
      label: 'Email',
      value: content.email,
      href: `mailto:${content.email}`,
      icon: Mail,
      accent: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'WhatsApp',
      value: content.whatsapp,
      href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : `tel:${content.whatsapp}`,
      icon: MessageCircle,
      accent: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Instagram',
      value: content.instagram,
      href: `https://instagram.com/${(content.instagram || '').replace('@', '')}`,
      icon: Instagram,
      accent: 'bg-accent-400/10 text-accent-500',
    },
  ];

  return (
    <section id="contact" className="relative bg-gray-50 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Contact</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Get in Touch</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Have a question, or want to bring a session to your school or community? We&rsquo;d love to hear from you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          {/* Form card */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-100/30 blur-3xl" />

            <div className="relative z-10">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-green-200 bg-green-50 px-6 py-14 text-center text-green-800"
                >
                  <CheckCircle2 size={48} className="mb-4 text-green-500" />
                  <h3 className="mb-2 text-xl font-bold">Message sent successfully</h3>
                  <p className="text-green-700">Thank you for reaching out. We will get back to you shortly.</p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      <AlertCircle size={18} className="mt-0.5 shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Awa Camara"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="awa@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className={inputClass + ' resize-none'}
                      placeholder="How can we help you today?"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Direct channels */}
          <div className="space-y-3">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-primary-200 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${channel.accent} transition-transform duration-300 group-hover:scale-110`}
                >
                  <channel.icon size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                    {channel.label}
                  </p>
                  <p className="truncate text-sm font-medium text-gray-800">{channel.value}</p>
                </div>
              </a>
            ))}

            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 p-5">
              <p className="text-sm leading-relaxed text-gray-500">
                Prefer to talk it through? Tap the WhatsApp button in the corner and we&rsquo;ll pick up the
                conversation there.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
