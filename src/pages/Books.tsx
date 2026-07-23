import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BadgeDollarSign, CalendarClock, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookOrderModal from '../features/books/BookOrderModal';
import { assets } from '../lib/siteContent';
import { subscribeBooks } from '../lib/supabase';
import type { Book } from '../types';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeBooks(setBooks);
    return unsubscribe;
  }, []);

  const featuredBooks = useMemo(() => books.filter((b) => b.featured), [books]);
  const upcomingBook = books.find((b) => (b.status || '').toLowerCase().includes('upcoming')) || featuredBooks[0];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16 lg:pt-[72px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 pt-32 pb-20 lg:pt-40 lg:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-primary-700/20 blur-[120px]" />
            <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-accent-500/10 blur-[100px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
                    <ArrowLeft size={16} />Back home
                  </Link>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-8 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
                >
                  Books that carry the same heart as the work
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-5 max-w-xl text-lg leading-relaxed text-white/70"
                >
                  Featured titles with direct order forms so readers can request copies while the team manages every order from the dashboard.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap gap-4">
                  <a href="#featured-books" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg">Browse books</a>
                  <a href="#upcoming" className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.06]">Upcoming release</a>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative flex items-center justify-center">
                <div className="relative h-[26rem] w-full max-w-md sm:h-[30rem]">
                  <div className="absolute top-1/2 left-1/2 z-10 h-72 w-48 -translate-x-[70%] -translate-y-1/2 -rotate-6 overflow-hidden rounded-xl ring-2 ring-white/20 shadow-2xl sm:h-80 sm:w-56">
                    <img src={assets.bookTwo} alt="Book two" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 z-20 h-72 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl ring-2 ring-white/20 shadow-2xl sm:h-80 sm:w-56">
                    <img src={assets.bookOne} alt="Book one" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 z-30 h-72 w-48 -translate-x-[30%] -translate-y-1/2 rotate-6 overflow-hidden rounded-xl ring-2 ring-white/20 shadow-2xl sm:h-80 sm:w-56">
                    <img src={assets.upcomingBook} alt="Upcoming book" className="h-full w-full object-cover" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured */}
        <section id="featured-books" className="px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Featured</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-[2.75rem] tracking-tight">Featured books</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {featuredBooks.filter((b) => !(b.status || '').toLowerCase().includes('upcoming')).map((book, index) => (
                <motion.article key={book.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className="group grid overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 xl:grid-cols-[0.92fr_1.08fr]"
                >
                  <div className="flex items-center justify-center bg-gray-50 p-6">
                    {book.image_url ? (
                      <img src={book.image_url} alt={book.title} className="max-h-[28rem] w-full max-w-sm object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105" />
                    ) : (<Sparkles className="text-gray-300" size={48} />)}
                  </div>
                  <div className="flex flex-col justify-between gap-6 p-7">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">{book.status || 'Featured'}</p>
                      <h3 className="mt-3 text-2xl font-bold text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author}</p>
                      <p className="mt-4 text-sm leading-relaxed text-gray-500">{book.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        <BadgeDollarSign size={14} />{book.price}
                      </span>
                      <button type="button" onClick={() => setSelectedBook(book)} className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md hover:shadow-primary-500/25">
                        {book.cta_label || 'Order now'}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming */}
        <section id="upcoming" className="bg-gray-50 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <img src={assets.upcomingBook} alt="Upcoming book" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">
                <CalendarClock size={16} />Coming soon
              </div>
              <h2 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl lg:text-[2.75rem] tracking-tight">
                An upcoming book with a dedicated spotlight
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
                The upcoming cover is placed here so it feels like a proper announcement, while the order CTA can be used as a waitlist request or pre-order enquiry.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button type="button" onClick={() => setSelectedBook(upcomingBook || null)} className="rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md hover:shadow-primary-500/25">
                  {upcomingBook?.cta_label || 'Join the waitlist'}
                </button>
                <Link to="/" className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:shadow-sm">
                  Explore the site
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BookOrderModal isOpen={Boolean(selectedBook)} book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}
