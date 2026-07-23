import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, PenSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { subscribeBlogPosts } from '../lib/supabase';
import { defaultBlogIntro } from '../lib/siteContent';
import type { BlogPost } from '../types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeBlogPosts(setPosts);
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 lg:pt-[72px]">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 px-4 pt-32 pb-20 sm:px-6 lg:px-8 lg:pt-40 lg:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-primary-600/15 blur-[120px]" />
            <div className="absolute -bottom-20 left-0 h-[360px] w-[360px] rounded-full bg-accent-500/10 blur-[100px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <PenSquare size={220} strokeWidth={0.5} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02]" />

          <div className="relative mx-auto max-w-7xl">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white">
                <ArrowLeft size={16} />Back home
              </Link>
            </motion.div>
            <div className="mx-auto mt-10 max-w-3xl text-center">
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Writing that keeps the conversation alive
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70"
              >{defaultBlogIntro}</motion.p>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-9">
                <a href="#blog-grid" className="inline-block rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg">
                  Read reflections
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="blog-grid" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-900">No blog posts yet</h2>
                <p className="mt-3 text-gray-500">When the admin creates a post, it will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post, index) => (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}
                    className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="p-6">
                      {post.image_url && (
                        <div className="mb-5 overflow-hidden rounded-xl">
                          <img src={post.image_url} alt={post.title} className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                      )}
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">{post.category || 'Reflection'}</p>
                      <h2 className="mt-3 text-xl font-bold text-gray-900">{post.title}</h2>
                      <p className="mt-4 text-sm leading-relaxed text-gray-500">{post.excerpt || post.content}</p>
                      {post.content && post.excerpt && (
                        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">{post.content}</p>
                      )}
                      <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
                        <CalendarDays size={14} />
                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Draft'}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
