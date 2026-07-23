import { motion } from 'motion/react';
import { Target, Eye } from 'lucide-react';
import { useCms } from '../../context/CmsContext';

export default function About() {
  const { content } = useCms();

  return (
    <section id="about" className="py-24 bg-white lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">About Us</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-[1.15] tracking-tight">
              Flourishing Emotionally, Mentally & Spiritually
            </h2>

            <div className="space-y-4 text-gray-500 leading-relaxed whitespace-pre-wrap text-[15px]">
              {content.aboutText}
            </div>
          </motion.div>

          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="group rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                <Eye size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-500 leading-relaxed text-[15px] whitespace-pre-wrap">
                {content.visionText}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group rounded-2xl bg-gradient-to-br from-white to-gray-50 p-8 border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110">
                <Target size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-500 leading-relaxed text-[15px] whitespace-pre-wrap">
                {content.missionText}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
