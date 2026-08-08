import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CalendarDays, Clock, Tag } from 'lucide-react';
import SiteLayout from '../components/SiteLayout';
import { getBlogPosts } from '../lib/supabase';
import { estimateReadTime, formatDate, getBlogPostPath, getBlogPostSlug, stripHtml } from '../lib/utils';
import type { BlogPost } from '../types';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getBlogPosts().then((posts) => {
      if (!active) return;
      let decodedSlug = slug || '';
      try {
        decodedSlug = decodeURIComponent(decodedSlug);
      } catch {
        // Keep the raw route value when a malformed URL is requested.
      }
      const found = posts.find((p) =>
        p.id === decodedSlug || getBlogPostSlug(p) === decodedSlug,
      );
      setPost(found ?? null);
      if (found) {
        setRelated(
          posts
            .filter((p) => p.id !== found.id)
            .filter((p) => p.category === found.category)
            .slice(0, 3),
        );
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
          <p className="text-gray-500">This article may have been renamed or removed.</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <ArrowLeft size={16} />
            Back to blog
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const readTime = estimateReadTime(post.content || '');

  return (
    <SiteLayout>
      {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 px-4 pt-28 pb-20 sm:px-6 lg:px-8 lg:pt-36 lg:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-primary-600/15 blur-[120px]" />
            <div className="absolute -bottom-20 left-0 h-[360px] w-[360px] rounded-full bg-accent-500/10 blur-[100px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white">
                <ArrowLeft size={16} />
                All posts
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-primary-200 backdrop-blur">
                  <Tag size={12} />
                  {post.category || 'Reflection'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                  <CalendarDays size={12} />
                  {formatDate(post.created_at)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                  <Clock size={12} />
                  {readTime} min read
                </span>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 text-lg leading-relaxed text-white/70">{post.excerpt}</p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Featured image */}
        {post.image_url && (
          <section className="bg-gray-50 px-4 pb-2 sm:px-6 lg:px-8">
            <div className="relative z-10 mx-auto -mt-10 max-w-5xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-gray-100 shadow-2xl ring-1 ring-gray-900/5">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* Article body */}
        <section className="bg-gray-50 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <article className="mx-auto max-w-4xl rounded-[1.75rem] border border-gray-100 bg-white px-6 py-9 shadow-sm sm:px-10 sm:py-12 lg:px-16 lg:py-14">
            <div className="mb-9 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Beyond Blooming Minds</p>
              <p className="text-sm text-gray-400">{readTime} min read</p>
            </div>
            {post.content?.trim() ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="blog-rich-content prose prose-lg prose-gray max-w-none break-words
                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900
                  prose-h2:mt-12 prose-h2:mb-5 prose-h2:text-2xl
                  prose-h3:mt-9 prose-h3:mb-3 prose-h3:text-xl
                  prose-p:leading-relaxed prose-p:text-gray-600
                  prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-img:my-8 prose-img:rounded-2xl prose-img:shadow-md prose-img:max-w-full prose-img:h-auto
                  prose-blockquote:border-primary-400 prose-blockquote:bg-primary-50/60 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-6
                  prose-strong:text-gray-900 prose-ul:text-gray-600 prose-ol:text-gray-600
                  [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-2xl [&_pre]:overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="rounded-2xl bg-gray-50 px-6 py-10 text-center text-gray-500">
                This article is still being prepared. Please check back soon.
              </div>
            )}
          </article>
        </section>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="border-t border-gray-100 bg-gray-50/80 px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">More in {post.category || 'Reflection'}</h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={getBlogPostPath(r)}
                    className="group rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md"
                  >
                    {r.image_url && (
                      <div className="overflow-hidden rounded-t-2xl">
                        <img src={r.image_url} alt={r.title} className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">{r.category || 'Reflection'}</p>
                      <h3 className="mt-2 text-base font-bold text-gray-900 group-hover:text-primary-700">{r.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">{r.excerpt || stripHtml(r.content || '')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        </section>
      )}
    </SiteLayout>
  );
}
