import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Copy, Mail, MessageSquareText, Phone, Send, X } from 'lucide-react';
import type { ContactSubmission, OrderSubmission } from '../../../types';

type SubmissionKind = 'contact' | 'order';

type SubmissionDrawerProps = {
  open: boolean;
  kind: SubmissionKind;
  item: ContactSubmission | OrderSubmission | null;
  onClose: () => void;
  onSave: (updates: Record<string, any>) => Promise<void>;
};

const statusOptions: Record<SubmissionKind, string[]> = {
  contact: ['new', 'read', 'responded', 'resolved'],
  order: ['new', 'contacted', 'fulfilled', 'resolved'],
};

const statusDotColor = (status?: string) => {
  if (status === 'resolved' || status === 'fulfilled') return 'bg-emerald-500';
  if (status === 'responded' || status === 'contacted') return 'bg-amber-400';
  if (status === 'read') return 'bg-blue-500';
  return 'bg-gray-400';
};

const prettify = (value: string) => value.replace(/-/g, ' ');

const buildDraftBody = (kind: SubmissionKind, item: ContactSubmission | OrderSubmission, reply: string) => {
  if (kind === 'order') {
    const order = item as OrderSubmission;
    return [
      reply || `Hi ${order.name},`,
      '',
      `Thanks for your order request for "${order.book_title}".`,
      `Quantity: ${order.quantity}`,
      `Phone: ${order.phone}`,
      order.price ? `Price: ${order.price}` : '',
      order.notes ? `Notes: ${order.notes}` : '',
      '',
      'Warm regards,',
      'Beyond Blooming Minds',
    ].filter(Boolean).join('\n');
  }
  const contact = item as ContactSubmission;
  return [
    reply || `Hi ${contact.name},`,
    '',
    'Thanks for reaching out to Beyond Blooming Minds.',
    'We have received your message and appreciate you taking the time to write to us.',
    '',
    'Your message:',
    contact.message,
    '',
    'Warm regards,',
    'Beyond Blooming Minds',
  ].join('\n');
};

export default function SubmissionDrawer({ open, kind, item, onClose, onSave }: SubmissionDrawerProps) {
  const [replyDraft, setReplyDraft] = useState('');
  const [statusDraft, setStatusDraft] = useState('new');
  const [saving, setSaving] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (!item || !open) return;
    setReplyDraft(item.admin_reply || '');
    setStatusDraft(item.status || 'new');
    setCopyState('idle');
  }, [item, open]);

  const mailtoHref = useMemo(() => {
    if (!item) return '#';
    const subject = kind === 'order'
      ? `Re: your order request for ${(item as OrderSubmission).book_title}`
      : `Re: your message to Beyond Blooming Minds`;
    const body = buildDraftBody(kind, item, replyDraft);
    return `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [item, kind, replyDraft]);

  if (!item) return null;

  const handleSave = async (resolved = false) => {
    setSaving(true);
    try {
      await onSave({
        status: resolved ? 'resolved' : statusDraft,
        admin_reply: replyDraft,
        resolved_at: resolved ? new Date().toISOString() : item.resolved_at || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildDraftBody(kind, item, replyDraft));
    setCopyState('copied');
    setTimeout(() => setCopyState('idle'), 1800);
  };

  const inputClass = "w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-primary-500";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: 36, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 36, opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col rounded-l-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 bg-gray-50 px-6 py-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">{kind === 'order' ? 'Order request' : 'Contact message'}</p>
                <h3 className="mt-2 text-xl font-semibold text-gray-900">{item.name}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`inline-block h-2 w-2 rounded-full ${statusDotColor(item.status)}`} />
                    {prettify(item.status || 'new')}
                  </span>
                  <span className="text-sm text-primary-600">{item.email}</span>
                </div>
              </div>
              <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400"><Mail size={12} />Email</div>
                  <p className="mt-1.5 break-all text-sm text-gray-800">{item.email}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400"><CheckCircle2 size={12} />Created</div>
                  <p className="mt-1.5 text-sm text-gray-800">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}
                  </p>
                </div>
              </div>

              {kind === 'order' ? (
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">Order details</p>
                  <div className="mt-4 grid gap-2 text-sm text-gray-700">
                    {[
                      ['Book', (item as OrderSubmission).book_title],
                      ['Phone', (item as OrderSubmission).phone],
                      ['Quantity', String((item as OrderSubmission).quantity)],
                      ['Price', (item as OrderSubmission).price || 'Not set'],
                    ].map(([label, val]) => (
                      <div key={label} className="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-2.5">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium text-gray-900">{val}</span>
                      </div>
                    ))}
                  </div>
                  {(item as OrderSubmission).notes && (
                    <div className="mt-3 rounded-lg bg-white p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">Notes</p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{(item as OrderSubmission).notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-gray-50 p-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">Message</p>
                  <p className="mt-4 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm leading-relaxed text-gray-700">{(item as ContactSubmission).message}</p>
                </div>
              )}

              <div className="rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Reply & status</p>
                    <p className="mt-0.5 text-xs text-gray-400">Manage this submission</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 text-xs text-gray-500">
                    <span className={`inline-block h-2 w-2 rounded-full ${statusDotColor(statusDraft)}`} />
                    {prettify(statusDraft)}
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
                    <select value={statusDraft} onChange={(e) => setStatusDraft(e.target.value)} className={inputClass}>
                      {statusOptions[kind].map((s) => <option key={s} value={s}>{prettify(s)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Reply draft</label>
                    <textarea value={replyDraft} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReplyDraft(e.target.value)} rows={6} className={inputClass + ' resize-none'} placeholder="Write your reply..." />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 bg-white px-6 py-4">
              <div className="grid gap-2.5 sm:grid-cols-2">
                <button type="button" onClick={() => handleSave(false)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-70 transition-colors">
                  <Send size={15} />{saving ? 'Saving...' : 'Save reply'}
                </button>
                <a href={mailtoHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                  <Mail size={15} />Open email draft
                </a>
                <button type="button" onClick={handleCopy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                  <Copy size={15} />{copyState === 'copied' ? 'Copied' : 'Copy reply'}
                </button>
                <button type="button" onClick={() => handleSave(true)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-70 transition-colors">
                  <MessageSquareText size={15} />Mark resolved
                </button>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
