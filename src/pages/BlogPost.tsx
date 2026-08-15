import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Copy,
  Facebook,
  Flower2,
  Linkedin,
  MessageCircle,
  Tag,
} from 'lucide-react';
import SiteLayout from '../components/SiteLayout';
import { getBlogPosts } from '../lib/supabase';
import { estimateReadTime, formatDate, getBlogPostPath, getBlogPostSlug, stripHtml } from '../lib/utils';
import type { BlogPost } from '../types';

function getCurrentUrl() {
  return typeof window === 'undefined' ? '' : window.location.href;
}

function normaliseArticleHtml(html: string) {
  // Older imported posts use non-breaking spaces between ordinary words.
  // Replacing them restores normal line wrapping without altering the markup.
  return html.replace(/&nbsp;|\u00a0/gi, ' ');
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const reduceMotion = useReducedMotion();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getBlogPosts().then((posts) => {
      if (!active) return;
      let decodedSlug = slug || '';
      try {
        decodedSlug = decodeURIComponent(decodedSlug);
      } catch {
        // Retain the raw route value when a malformed URL is requested.
      }

      const found = posts.find((candidate) =>
        candidate.id === decodedSlug || getBlogPostSlug(candidate) === decodedSlug,
      );
      setPost(found ?? null);

      if (found) {
        const sameCategory = posts
          .filter((candidate) => candidate.id !== found.id)
          .filter((candidate) => (candidate.category || 'Reflection') === (found.category || 'Reflection'))
          .slice(0, 3);
        const sameCategoryIds = new Set(sameCategory.map((candidate) => candidate.id));
        const additionalPosts = posts
          .filter((candidate) => candidate.id !== found.id && !sameCategoryIds.has(candidate.id))
          .slice(0, 3 - sameCategory.length);
        setRelated([...sameCategory, ...additionalPosts]);
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  const copyLink = async () => {
    const url = getCurrentUrl();
    if (!url) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('textarea');
        input.value = url;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] items-center justify-center bg-[#fbfaff]">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fbfaff] px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <Flower2 size={28} />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-primary-950">This article is not available</h1>
          <p className="mt-3 max-w-md text-gray-500">It may have been renamed, unpublished or moved to a new location.</p>
          <Link to="/blog" className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800">
            <ArrowLeft size={16} />
            Back to blog
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const readTime = estimateReadTime(post.content || '');
  const articleHtml = normaliseArticleHtml(post.content || '');
  const articleExcerpt = normaliseArticleHtml(post.excerpt || '');
  const shareUrl = getCurrentUrl();
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const shareText = encodeURIComponent(post.title);
  const reveal = reduceMotion ? false : { opacity: 0, y: 20 };
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.55 };

  return (
    <SiteLayout>
      <main className="min-w-0 overflow-x-clip bg-[#fbfaff]">
        <section className="relative px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
            <div className="absolute -left-32 -top-40 h-[450px] w-[450px] rounded-full bg-primary-200/45 blur-3xl" />
            <div className="absolute right-[-9rem] top-20 h-[370px] w-[370px] rounded-full bg-accent-400/20 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#fbfaff]" />
          </div>

          <div className="relative mx-auto min-w-0 max-w-6xl">
            <motion.div initial={reduceMotion ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={transition}>
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-950">
                <ArrowLeft size={16} />
                Back to Blog
              </Link>
            </motion.div>

            <div className="mt-10 grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
              <motion.div initial={reveal} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.08 }} className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 text-sm text-primary-800/70">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-700 shadow-sm">
                    <Tag size={12} />
                    {post.category || 'Reflection'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium"><CalendarDays size={13} />{formatDate(post.created_at)}</span>
                </div>
                <h1 className="mt-6 max-w-4xl text-[2.7rem] font-bold leading-[0.98] tracking-[-0.035em] text-primary-950 sm:text-6xl lg:text-7xl">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="mt-6 max-w-2xl break-words text-lg leading-relaxed text-gray-600 sm:text-xl">{articleExcerpt}</p>
                )}
              </motion.div>

              <motion.div initial={reveal} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.15 }} className="border-l-2 border-primary-300 pl-5 lg:mb-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">A mindful read</p>
                <p className="mt-2 flex items-center gap-2 text-2xl font-semibold text-primary-950"><Clock size={20} className="text-primary-600" />{readTime} min</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">A reflection from Beyond Blooming Minds for everyday wellbeing.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {post.image_url && (
          <section className="relative px-4 pb-2 sm:px-6 lg:px-8">
            <motion.figure initial={reveal} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.2 }} className="mx-auto max-w-6xl">
              <div className="overflow-hidden rounded-[1.8rem] bg-primary-100 shadow-[0_28px_70px_-35px_rgba(60,43,78,0.55)] sm:rounded-[2.25rem]">
                <img src={post.image_url} alt={post.title} className="aspect-[16/8] w-full object-cover" />
              </div>
            </motion.figure>
          </section>
        )}

        <section className="px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="mx-auto grid min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[180px_minmax(0,720px)] lg:justify-center lg:gap-16">
            <aside className="order-2 lg:order-none">
              <div className="border-t border-primary-200 pt-5 lg:border-t-0 lg:border-r lg:pr-8 lg:pt-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Share this article</p>
                <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  <button type="button" onClick={copyLink} aria-label={copied ? 'Article link copied' : 'Copy article link'} className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-semibold text-primary-800 transition-colors hover:border-primary-400 hover:bg-primary-50">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy link'}
                  </button>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook" className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-semibold text-primary-800 transition-colors hover:border-primary-400 hover:bg-primary-50"><Facebook size={14} />Facebook</a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn" className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-semibold text-primary-800 transition-colors hover:border-primary-400 hover:bg-primary-50"><Linkedin size={14} />LinkedIn</a>
                  <a href={`https://wa.me/?text=${shareText}%20${encodedShareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp" className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-semibold text-primary-800 transition-colors hover:border-primary-400 hover:bg-primary-50"><MessageCircle size={14} />WhatsApp</a>
                </div>
              </div>
            </aside>

            <article className="min-w-0 max-w-full">
              <motion.div initial={reveal} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : 0.25 }}>
                {post.content?.trim() ? (
                  <div
                    className="blog-rich-content prose prose-lg prose-gray max-w-none break-words
                      prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-[-0.02em] prose-headings:text-primary-950
                      prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-3xl prose-h2:leading-tight
                      prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-2xl prose-h3:leading-tight
                      prose-p:leading-[1.85] prose-p:text-[18px] prose-p:text-gray-700
                      prose-a:text-primary-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                      prose-img:my-10 prose-img:rounded-2xl prose-img:shadow-sm prose-img:max-w-full prose-img:h-auto
                      prose-blockquote:my-10 prose-blockquote:border-primary-400 prose-blockquote:bg-primary-50 prose-blockquote:rounded-r-2xl prose-blockquote:px-7 prose-blockquote:py-4 prose-blockquote:font-serif prose-blockquote:text-xl prose-blockquote:leading-relaxed prose-blockquote:text-primary-950
                      prose-strong:text-primary-950 prose-ul:text-gray-700 prose-ol:text-gray-700
                      [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-2xl [&_pre]:overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: articleHtml }}
                  />
                ) : (
                  <div className="rounded-3xl border border-dashed border-primary-200 bg-white px-6 py-12 text-center text-gray-500">This article is still being prepared. Please check back soon.</div>
                )}
              </motion.div>

              <div className="mt-16 border-t border-primary-200 pt-8">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-700 text-white shadow-lg shadow-primary-700/20"><Flower2 size={21} /></div>
                  <div>
                    <p className="font-serif text-xl font-semibold text-primary-950">Beyond Blooming Minds</p>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">Psychoeducation and wellbeing resources grounded in compassion, culture and practical support.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 overflow-hidden rounded-3xl bg-primary-900 px-6 py-8 text-white shadow-[0_24px_50px_-30px_rgba(60,43,78,0.8)] sm:px-9 sm:py-10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-200">Continue the conversation</p>
                <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-white">Looking for support that meets you where you are?</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">Discover practical programmes and guidance for individuals, schools and communities.</p>
                <Link to="/" onClick={() => window.setTimeout(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }), 150)} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary-800 transition-transform hover:translate-x-0.5">
                  Explore our services <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-primary-100 bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Explore more</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-primary-950 sm:text-4xl">Related reflections</h2>
                </div>
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-950">View all posts <ArrowRight size={15} /></Link>
              </div>

              <div className="mt-9 grid gap-5 md:grid-cols-3">
                {related.map((relatedPost, index) => (
                  <motion.div key={relatedPost.id} initial={reduceMotion ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...transition, delay: reduceMotion ? 0 : index * 0.08 }}>
                    <Link to={getBlogPostPath(relatedPost)} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-primary-100 bg-[#fbfaff] transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-900/10">
                      {relatedPost.image_url ? (
                        <div className="overflow-hidden"><img src={relatedPost.image_url} alt={relatedPost.title} className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                      ) : (
                        <div className="flex h-48 items-center justify-center bg-primary-100 text-primary-400"><Flower2 size={34} /></div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold uppercase tracking-[0.12em] text-primary-600">{relatedPost.category || 'Reflection'}</span><span className="inline-flex items-center gap-1 text-gray-400"><Clock size={13} />{estimateReadTime(relatedPost.content || '')} min</span></div>
                        <h3 className="mt-4 text-xl font-semibold leading-snug text-primary-950 transition-colors group-hover:text-primary-700">{relatedPost.title}</h3>
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">{relatedPost.excerpt || stripHtml(relatedPost.content || '')}</p>
                        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 transition-all group-hover:gap-2">Read article <ArrowRight size={14} /></span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </SiteLayout>
  );
}
