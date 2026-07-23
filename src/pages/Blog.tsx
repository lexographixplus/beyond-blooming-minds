import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, PenSquare, Search, Tag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { subscribeBlogPosts } from '../lib/supabase';
import { defaultBlogIntro } from '../lib/siteContent';
import type { BlogPost } from '../types';

function estimateReadTime(html: string) {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '');
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeBlogPosts(setPosts);
    return unsubscribe;
  }, []);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category || 'Reflection'));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory) {
      result = result.filter((p) => (p.category || 'Reflection') === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q),
      );
    }
    return result;
  }, [posts, activeCategory, search]);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 lg:pt-[72px]">
        {/* Hero */}
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
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-20 border-b border-gray-100 bg-white/90 backdrop-blur-lg lg:top-[72px]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  !activeCategory
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border-0 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500 sm:w-64"
              />
            </div>
          </div>
        </section>

        {/* Posts */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-16 text-center">
                <PenSquare size={40} className="mx-auto text-gray-300" />
                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {posts.length === 0 ? 'No blog posts yet' : 'No posts match your search'}
                </h2>
                <p className="mt-2 text-gray-500">
                  {posts.length === 0
                    ? 'When the admin creates a post, it will appear here automatically.'
                    : 'Try adjusting your search or filter.'}
                </p>
              </div>
            ) : (
              <>
                {/* Featured post (first post, large) */}
                {featured && (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Link
                      to={`/blog/${featured.slug || featured.id}`}
                      className="group grid gap-0 rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-lg md:grid-cols-2"
                    >
                      {featured.image_url ? (
                        <div className="overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                          <img
                            src={featured.image_url}
                            alt={featured.title}
                            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-full md:min-h-[320px]"
                          />
                        </div>
                      ) : (
                        <div className="flex h-64 items-center justify-center rounded-t-3xl bg-gradient-to-br from-primary-50 to-primary-100 md:h-full md:min-h-[320px] md:rounded-l-3xl md:rounded-tr-none">
                          <PenSquare size={48} className="text-primary-300" />
                        </div>
                      )}
                      <div className="flex flex-col justify-center p-8 md:p-10">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                            <Tag size={12} />
                            {featured.category || 'Reflection'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {featured.created_at
                              ? new Date(featured.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                              : 'Draft'}
                          </span>
                        </div>
                        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 group-hover:text-primary-700 transition-colors sm:text-3xl">
                          {featured.title}
                        </h2>
                        <p className="mt-3 line-clamp-3 text-base leading-relaxed text-gray-500">
                          {featured.excerpt || stripHtml(featured.content || '')}
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock size={14} />
                            {estimateReadTime(featured.content || '')} min read
                          </span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:gap-2 transition-all">
                            Read post <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Grid of remaining posts */}
                {rest.length > 0 && (
                  <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {rest.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/blog/${post.slug || post.id}`}
                          className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
                        >
                          {post.image_url ? (
                            <div className="overflow-hidden rounded-t-2xl">
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="flex h-48 items-center justify-center rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100">
                              <PenSquare size={32} className="text-gray-300" />
                            </div>
                          )}
                          <div className="flex flex-1 flex-col p-6">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">
                                {post.category || 'Reflection'}
                              </span>
                              <span className="text-xs text-gray-400">
                                {estimateReadTime(post.content || '')} min
                              </span>
                            </div>
                            <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                              {post.title}
                            </h3>
                            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
                              {post.excerpt || stripHtml(post.content || '')}
                            </p>
                            <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
                              <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                                <CalendarDays size={14} />
                                {post.created_at
                                  ? new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                  : 'Draft'}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:gap-2 transition-all">
                                Read <ArrowRight size={12} />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
