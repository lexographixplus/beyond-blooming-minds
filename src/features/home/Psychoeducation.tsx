import { motion } from 'motion/react';
import { BookOpen, GraduationCap, HeartHandshake } from 'lucide-react';
import { assets } from '../../lib/siteContent';

const highlights = [
  { title: 'School outreach', description: 'Practical learning spaces that help students understand emotions, relationships, and resilience.', icon: GraduationCap },
  { title: 'Community learning', description: 'Group conversations that make mental health guidance clear, accessible, and culturally grounded.', icon: BookOpen },
  { title: 'Care that connects', description: 'Support that respects faith, family, and lived experience while strengthening everyday wellbeing.', icon: HeartHandshake },
];

export default function Psychoeducation() {
  return (
    <section id="psychoeducation" className="py-24 bg-white lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Psychoeducation</span>
            </div>
            <h2 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl lg:text-[2.75rem] tracking-tight leading-[1.15]">
              Learning that meets people where they are
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
              These sessions are designed to make emotional wellbeing understandable and usable in daily life.
            </p>

            <div className="mt-10 grid gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-5 transition-all duration-300 hover:border-primary-200 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            <motion.figure
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group overflow-hidden rounded-2xl border border-gray-100 shadow-sm"
            >
              <div className="overflow-hidden">
                <img
                  src={assets.psychoeducationOne}
                  alt="Psychoeducation session with students"
                  className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="bg-white px-4 py-3 text-sm font-medium text-gray-700 border-l-2 border-primary-400">
                School-based psychoeducation
              </figcaption>
            </motion.figure>

            <motion.figure
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group mt-10 overflow-hidden rounded-2xl border border-gray-100 shadow-sm sm:mt-16"
            >
              <div className="overflow-hidden">
                <img
                  src={assets.psychoeducationTwo}
                  alt="Community psychoeducation gathering"
                  className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="bg-white px-4 py-3 text-sm font-medium text-gray-700 border-l-2 border-primary-400">
                Community learning and outreach
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </div>
    </section>
  );
}
