import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { subscribeBooks } from '../../lib/supabase';
import type { Book } from '../../types';
import BookCard from './BookCard';
import BookOrderModal from './BookOrderModal';

export default function BooksPreview() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeBooks(setBooks);
    return unsubscribe;
  }, []);

  const featuredBooks = useMemo(() => books.filter((b) => b.featured).slice(0, 3), [books]);

  return (
    <section id="books" className="py-24 bg-white lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 mb-4">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">Our Books</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-[2.75rem] tracking-tight">
              Books that speak to healing, identity, and growth
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-gray-500">
              Featured books with direct order forms — no leaving the page.
            </p>
          </div>
          <Link
            to="/books"
            className="group inline-flex items-center gap-2 self-start rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-700 hover:shadow-md hover:shadow-primary-500/25"
          >
            Visit books page
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredBooks.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} onOrder={setSelectedBook} />
          ))}
        </div>
      </div>

      <BookOrderModal isOpen={Boolean(selectedBook)} book={selectedBook} onClose={() => setSelectedBook(null)} />
    </section>
  );
}
