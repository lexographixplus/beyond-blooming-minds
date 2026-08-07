import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, PenSquare } from 'lucide-react';
import SiteLayout from '../components/SiteLayout';

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 px-4 py-28 sm:px-6 lg:px-8 lg:py-40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-primary-600/15 blur-[120px]" />
          <div className="absolute -bottom-20 left-0 h-[360px] w-[360px] rounded-full bg-accent-500/10 blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-xl text-center"
        >
          <p className="font-serif text-6xl font-bold text-white/25 sm:text-7xl">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            This page has wandered off
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            The page you were looking for doesn&rsquo;t exist or has been moved. Let&rsquo;s get you
            back to something useful.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:shadow-lg hover:shadow-white/15"
            >
              <ArrowLeft size={16} />
              Back home
            </Link>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.06]"
            >
              <BookOpen size={16} />
              Browse books
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.06]"
            >
              <PenSquare size={16} />
              Read the blog
            </Link>
          </div>
        </motion.div>
      </section>
    </SiteLayout>
  );
}
