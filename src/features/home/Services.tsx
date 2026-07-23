import { motion } from 'motion/react';
import { BookOpen, Users, Focus, Megaphone } from 'lucide-react';

const services = [
  { title: 'Psycho-education', description: 'Workshops on emotional intelligence, stress management, and healthy relationships for students, parents, and teachers.', icon: BookOpen, accent: 'bg-primary-100 text-primary-600' },
  { title: 'Psycho-social Support', description: 'Group sessions and 1-on-1 support for coping skills, resilience, and life transitions.', icon: Users, accent: 'bg-secondary-400/10 text-secondary-500' },
  { title: 'Holistic Wellness', description: 'Parenting programs, teacher wellbeing sessions, and programs on self-awareness and spiritual-emotional balance.', icon: Focus, accent: 'bg-accent-400/10 text-accent-500' },
  { title: 'Advocacy', description: 'Raising awareness on mental health, emotional wellbeing, and holistic care in schools and communities.', icon: Megaphone, accent: 'bg-primary-100 text-primary-800' },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50/80 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">What We Do</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 tracking-tight"
          >
            Services & Programs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-500 text-lg leading-relaxed"
          >
            Culturally and spiritually aligned wellbeing support for schools, parents, students, teachers, youth groups, and community organizations.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-2xl bg-white p-7 border border-gray-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 flex flex-col sm:flex-row gap-5"
            >
              <div className={`shrink-0 h-12 w-12 ${service.accent} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <service.icon size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
