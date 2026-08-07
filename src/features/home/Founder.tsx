import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { assets } from '../../lib/siteContent';

export default function Founder() {
  const { content } = useCms();

  return (
    <section id="founder" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 md:p-12"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary-100/50 blur-3xl" />
          <Quote
            className="pointer-events-none absolute -right-2 -top-2 text-gray-200/70 md:right-6 md:top-6"
            size={96}
            strokeWidth={1}
          />

          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">From the Founder</span>
            </div>

            <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">Founder&rsquo;s Note</h2>

            <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-12">
              {/* Profile picture + name */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="shrink-0 flex flex-col items-center text-center"
              >
                <div className="relative">
                  <div className="h-48 w-48 overflow-hidden rounded-2xl shadow-xl ring-4 ring-white lg:h-56 lg:w-56">
                    <img
                      src={assets.founderPhoto}
                      alt="Binta Nyangado — Founder of Beyond Blooming Minds"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <h4 className="mt-5 font-bold text-gray-900 text-lg">Binta Nyangado</h4>
                <p className="text-sm text-gray-500">Founder, Beyond Blooming Minds</p>
              </motion.div>

              {/* Note content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="space-y-6 whitespace-pre-wrap text-lg font-light italic leading-relaxed text-gray-600 lg:text-xl"
                >
                  {content.founderNote}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
