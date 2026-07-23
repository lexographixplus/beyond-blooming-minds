import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCms } from '../../context/CmsContext';
import { assets, heroStats } from '../../lib/siteContent';

export default function Hero() {
  const { content } = useCms();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-1/4 h-[600px] w-[600px] rounded-full bg-primary-600/20 blur-[160px]" />
        <div className="absolute -bottom-32 -left-20 h-[500px] w-[500px] rounded-full bg-accent-500/15 blur-[140px]" />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-secondary-500/10 blur-[120px]" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8 lg:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 backdrop-blur-md"
            >
              <Sparkles size={14} className="text-accent-400" />
              <span className="text-sm font-medium text-white/80">Beyond Blooming Minds</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300"
            >
              Holistic mental health & psychoeducation
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {content.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-white/70"
            >
              {content.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                to="/books"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 shadow-lg shadow-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-white/20"
              >
                Explore books
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#psychoeducation"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/[0.06]"
              >
                Our approach
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/[0.08] pt-8"
            >
              {heroStats.map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/40">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-white/90">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative hidden lg:flex lg:justify-end"
          >
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/40 ring-1 ring-white/10">
                <img
                  src={assets.hero}
                  alt="Beyond Blooming Minds"
                  className="h-[500px] w-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/40 to-transparent" />
              </div>

              <div className="absolute -bottom-6 -left-6 z-10 overflow-hidden rounded-xl ring-2 ring-white/20 shadow-xl backdrop-blur-sm">
                <img
                  src={assets.psychoeducationOne}
                  alt="Psychoeducation session"
                  className="h-32 w-32 object-cover"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8, type: 'spring', stiffness: 200 }}
                className="absolute -top-3 -right-3 z-10 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-3 shadow-lg backdrop-blur-xl"
              >
                <span className="text-sm font-medium text-white">
                  School & community<br />outreach
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
