import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function Founder() {
  const { content } = useCms();

  return (
    <section id="founder" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-8 md:p-12 overflow-hidden"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-100/50 blur-3xl" />
          <Quote className="absolute left-8 top-8 text-gray-200" size={56} strokeWidth={1} />

          <div className="relative z-10 pt-8 pl-4 md:pl-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">From the Founder</span>
            </div>

            <h2 className="mb-8 text-2xl font-bold text-gray-900">Founder's Note</h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="space-y-6 whitespace-pre-wrap text-lg lg:text-xl leading-relaxed font-light text-gray-500 italic"
            >
              {content.founderNote}
            </motion.div>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 font-serif text-xl font-bold text-white shadow-lg shadow-primary-500/25">
                B
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Binta Nyangado</h4>
                <p className="text-sm text-gray-500">Founder, Beyond Blooming Minds</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
