import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { assets } from '../lib/siteContent';
import { toWhatsAppNumber } from '../lib/utils';

const quickReplies = [
  'I would like to book a psychoeducation session.',
  'I have a question about your books.',
  'Can you tell me more about your programs?',
];

export default function WhatsAppWidget() {
  const { content } = useCms();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [showNudge, setShowNudge] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const number = toWhatsAppNumber(content.whatsapp);

  // A single gentle nudge after the visitor has settled on the page.
  useEffect(() => {
    if (!number) return;
    const timer = window.setTimeout(() => setShowNudge(true), 6000);
    return () => window.clearTimeout(timer);
  }, [number]);

  useEffect(() => {
    if (open) {
      setShowNudge(false);
      textareaRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (!number) return null;

  const send = (text: string) => {
    const body = text.trim();
    const url = `https://wa.me/${number}${body ? `?text=${encodeURIComponent(body)}` : ''}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-5 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="dialog"
            aria-label="Chat with Beyond Blooming Minds on WhatsApp"
            className="w-[calc(100vw-2rem)] max-w-sm origin-bottom-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/15"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#128C7E] to-[#075E54] px-5 py-4">
              <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start gap-3">
                <img
                  src={assets.logo}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full bg-white object-cover ring-2 ring-white/30"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">Beyond Blooming Minds</p>
                  <p className="flex items-center gap-1.5 text-xs text-white/75">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Typically replies within a few hours
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="-mr-1 rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Conversation area */}
            <div className="space-y-3 bg-[#ECE5DD]/50 px-4 py-5">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
                <p className="text-sm leading-relaxed text-gray-700">
                  Assalamu alaikum 👋 Thanks for visiting. How can we support you today?
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => send(reply)}
                    className="rounded-full border border-[#128C7E]/25 bg-white px-3 py-1.5 text-left text-xs font-medium text-[#075E54] transition-colors hover:bg-[#128C7E] hover:text-white"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Composer */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                send(message);
              }}
              className="flex items-end gap-2 border-t border-gray-100 bg-white p-3"
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    send(message);
                  }
                }}
                rows={1}
                placeholder="Write a message..."
                aria-label="Your message"
                className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#128C7E] focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Open WhatsApp with this message"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-sm transition-all hover:bg-[#1DA851] hover:shadow-md"
              >
                <Send size={18} />
              </button>
            </form>

            <p className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-center text-[11px] text-gray-400">
              Continues in WhatsApp
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nudge bubble */}
      <AnimatePresence>
        {showNudge && !open && (
          <motion.div
            key="nudge"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white py-1.5 pl-4 pr-2 shadow-lg shadow-black/5"
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Need help? Chat with us
            </button>
            <button
              type="button"
              aria-label="Dismiss chat prompt"
              onClick={() => setShowNudge(false)}
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-label={open ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35 transition-all duration-300 hover:scale-105 hover:bg-[#1DA851] hover:shadow-xl hover:shadow-[#25D366]/40"
      >
        {!open && (
          <span className="pointer-events-none absolute inset-0 animate-ping-slow rounded-full bg-[#25D366]/40" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} className="fill-white/15" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
