import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { submitContactForm } from '../../lib/supabase';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContactForm(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 hover:border-gray-300 focus:ring-2 focus:ring-primary-400/20 focus:border-primary-400 outline-none transition-all";

  return (
    <section className="py-24 bg-gray-50 relative lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-100/30 blur-3xl" />

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Contact</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
              <p className="mt-3 text-gray-500">Have a question or want to learn more? Send us a message.</p>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center py-12"
              >
                <CheckCircle2 size={48} className="text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Message Sent Successfully!</h3>
                <p className="text-green-700">Thank you for reaching out. We will get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Awa Camara" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="awa@example.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange} className={inputClass + ' resize-none'} placeholder="How can we help you today?" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : (<>Send Message <Send size={16} /></>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
