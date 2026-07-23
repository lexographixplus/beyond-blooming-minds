import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';
import { submitOrderForm } from '../../lib/supabase';

type BookOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  book: { title: string; price?: string; cta_label?: string } | null;
};

export default function BookOrderModal({ isOpen, onClose, book }: BookOrderModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', quantity: 1, notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      setSubmitting(false);
      setFormData({ name: '', email: '', phone: '', quantity: 1, notes: '' });
    }
  }, [isOpen]);

  if (!book) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await submitOrderForm({
        ...formData,
        quantity: Number(formData.quantity),
        book_title: book.title,
        price: book.price,
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error submitting order form', error);
      alert('There was a problem sending your order request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const inputClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Order form</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">{book.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{book.price}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-green-200 bg-green-50 px-6 py-10 text-center"
                >
                  <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
                  <h4 className="text-xl font-bold text-green-900">Request received</h4>
                  <p className="mt-2 text-green-700">Your order request for {book.title} has been sent.</p>
                  <button type="button" onClick={onClose} className="mt-6 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors">Close</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Your name</label>
                      <input name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Email address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="jane@example.com" />
                    </div>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Phone number</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder="+1 555 000 0000" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
                      <input type="number" min={1} name="quantity" value={formData.quantity} onChange={handleChange} required className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className={inputClass + ' resize-none'} placeholder="Any special arrangements?" />
                  </div>
                  <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">We'll follow up with you shortly.</p>
                    <button type="submit" disabled={submitting} className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
                      {submitting ? 'Sending...' : book.cta_label || 'Submit order'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
