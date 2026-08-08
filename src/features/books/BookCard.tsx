import { motion } from 'motion/react';
import { BadgeDollarSign, Sparkles } from 'lucide-react';
import type { Book } from '../../types';

type BookCardProps = {
  book: Book;
  index?: number;
  onOrder: (book: Book) => void;
};

export default function BookCard({ book, index = 0, onOrder }: BookCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
    >
      <div className="flex h-72 flex-col bg-gradient-to-br from-gray-50 to-white p-6">
        <div className="flex min-h-7 shrink-0 justify-end">
          <div className="rounded-lg bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
          {book.status || 'Available now'}
          </div>
        </div>
        {book.image_url ? (
          <div className="min-h-0 flex-1 pt-3">
            <img
              src={book.image_url}
              alt={book.title}
              className="mx-auto h-full w-full max-w-sm rounded-lg object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white text-gray-300">
            <Sparkles size={32} />
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
        </div>
        <p className="text-sm leading-relaxed text-gray-500 line-clamp-3">{book.description}</p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            <BadgeDollarSign size={14} />
            {book.price || 'Enquire for price'}
          </span>
          <button
            type="button"
            onClick={() => onOrder(book)}
            className="rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:shadow-primary-500/25"
          >
            {book.cta_label || 'Order now'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
