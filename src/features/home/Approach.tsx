import { motion } from 'motion/react';
import { ShieldCheck, Heart, Scale, TrendingUp, Award } from 'lucide-react';

const values = [
  { title: 'Amanah - Trust & Responsibility', description: 'We hold the wellbeing of every individual as a sacred trust and work with integrity and confidentiality.', icon: ShieldCheck },
  { title: 'Ihsan - Excellence & Sincerity', description: 'We strive for the highest standard, doing our work for the benefit of others.', icon: Award },
  { title: 'Compassion', description: 'Every interaction is rooted in empathy, respect, and non-judgment.', icon: Heart },
  { title: 'Balance', description: 'We promote balance between mind, heart, and spirit, and between dunya and akhirah.', icon: Scale },
  { title: 'Growth', description: 'We believe every person has the capacity to learn, heal, and flourish with the right support.', icon: TrendingUp },
];

export default function Approach() {
  return (
    <section id="approach" className="relative overflow-hidden bg-gray-950 py-24 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/3 translate-y-1/3 rounded-full bg-secondary-500/10 blur-[100px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">Our Values</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-white md:text-4xl lg:text-[2.75rem] tracking-tight"
          >
            Our Approach
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg leading-relaxed text-gray-400"
          >
            We integrate evidence-based practices from modern psychology with the principles and wisdom of Islamic
            psychology. Our work is collaborative, practical, and tailored to respect cultural and religious values.
          </motion.p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.12]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.08] text-accent-400 transition-transform duration-300 group-hover:scale-110">
                <value.icon size={20} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{value.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
