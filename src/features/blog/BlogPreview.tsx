import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { defaultBlogIntro } from '../../lib/siteContent';
import { subscribeBlogPosts } from '../../lib/supabase';
import type { BlogPost } from '../../types';

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeBlogPosts(setPosts);
    return unsubscribe;
  }, []);

  const featured = posts.slice(0, 3);

  return (
    <section id="blog" className="py-24 bg-gray-50/80 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Blog</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-[2.75rem] tracking-tight">
              Write and share with purpose
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-gray-500">{defaultBlogIntro}</p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-primary-300 hover:shadow-sm"
          >
            Read the blog
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-gray-500 md:col-span-3 text-center">
              New blog posts published from the dashboard will appear here.
            </div>
          ) : (
            featured.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-primary-200 hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  {post.image_url && (
                    <div className="mb-5 overflow-hidden rounded-xl">
                      <img src={post.image_url} alt={post.title} className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  )}
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">
                    {post.category || 'Reflection'}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-gray-900">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {post.excerpt || post.content}
                  </p>
                  <p className="mt-4 text-xs text-gray-400">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Draft'}
                  </p>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
