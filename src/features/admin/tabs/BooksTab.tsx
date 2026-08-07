import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { BookOpen, Edit3, Eye, EyeOff, Image as ImageIcon, Loader2, Trash2, Upload, X } from 'lucide-react';
import { EmptyState, Panel, SearchInput } from '../components/primitives';
import ImageCropModal from '../components/ImageCropModal';
import { btnPrimary, btnSecondary, field, fieldHint, fieldLabel, iconBtn } from '../ui';
import { cn } from '../../../lib/utils';
import type { Book } from '../../../types';

export type BookFormState = {
  title: string;
  author: string;
  description: string;
  price: string;
  cta_label: string;
  image_url: string;
  featured: boolean;
  status: string;
};

export const emptyBookForm: BookFormState = {
  title: '',
  author: '',
  description: '',
  price: '',
  cta_label: 'Order now',
  image_url: '',
  featured: true,
  status: 'Available now',
};

const statusPresets = ['Available now', 'Pre-order', 'Upcoming release', 'Out of stock'];

type BooksTabProps = {
  books: Book[];
  form: BookFormState;
  setForm: (updater: (previous: BookFormState) => BookFormState) => void;
  editingId: string | null;
  saving: boolean;
  onSubmit: (event: FormEvent) => void;
  onCancelEdit: () => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onUploadCover: (file: File) => Promise<void>;
  uploading: boolean;
};

export default function BooksTab({
  books,
  form,
  setForm,
  editingId,
  saving,
  onSubmit,
  onCancelEdit,
  onEdit,
  onDelete,
  onUploadCover,
  uploading,
}: BooksTabProps) {
  const [search, setSearch] = useState('');
  const [pendingCover, setPendingCover] = useState<File | null>(null);

  const isEditing = Boolean(editingId);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return books;
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        (book.author || '').toLowerCase().includes(query) ||
        (book.status || '').toLowerCase().includes(query),
    );
  }, [books, search]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, type, checked, value } = target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
  };

  const pickCover = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPendingCover(file);
    event.target.value = '';
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:items-start">
      {/* ── Editor ── */}
      <Panel
        title={isEditing ? 'Edit book' : 'Add a new book'}
        description={
          isEditing ? 'Changes go live as soon as you save.' : 'New books appear on the books page immediately.'
        }
        action={
          isEditing ? (
            <button type="button" onClick={onCancelEdit} className={iconBtn} aria-label="Cancel editing">
              <X size={16} />
            </button>
          ) : undefined
        }
      >
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Cover */}
          <div>
            <span className={fieldLabel}>Cover image</span>
            {form.image_url ? (
              <div className="group relative flex h-52 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <img src={form.image_url} alt="Book cover preview" className="h-full object-contain p-3" />
                <div className="absolute bottom-2.5 right-2.5 flex gap-2">
                  <label className="cursor-pointer rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={pickCover} />
                  </label>
                  <button
                    type="button"
                    onClick={() => setForm((previous) => ({ ...previous, image_url: '' }))}
                    className="rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm backdrop-blur transition-colors hover:bg-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex h-52 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 text-gray-400 transition-colors hover:border-primary-300 hover:bg-primary-50/40 hover:text-primary-500">
                <Upload size={22} />
                <span className="text-sm font-medium">Click to upload a cover</span>
                <span className="text-xs text-gray-400">You&rsquo;ll be able to crop it to shape</span>
                <input type="file" accept="image/*" className="hidden" onChange={pickCover} />
              </label>
            )}
            {uploading && (
              <p className={fieldHint + ' flex items-center gap-1.5'}>
                <Loader2 size={12} className="animate-spin" />
                Uploading cover...
              </p>
            )}
          </div>

          <div>
            <label htmlFor="book-title" className={fieldLabel}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="book-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={field}
              placeholder="The title of the book"
            />
          </div>

          <div>
            <label htmlFor="book-author" className={fieldLabel}>
              Author
            </label>
            <input
              id="book-author"
              name="author"
              value={form.author}
              onChange={handleChange}
              className={field}
              placeholder="Binta Nyangado"
            />
          </div>

          <div>
            <label htmlFor="book-description" className={fieldLabel}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="book-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              required
              className={field + ' resize-y leading-relaxed'}
              placeholder="What is this book about, and who is it for?"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="book-price" className={fieldLabel}>
                Price
              </label>
              <input
                id="book-price"
                name="price"
                value={form.price}
                onChange={handleChange}
                className={field}
                placeholder="D500"
              />
              <p className={fieldHint}>Free text — write it exactly as it should appear.</p>
            </div>
            <div>
              <label htmlFor="book-cta" className={fieldLabel}>
                Button label
              </label>
              <input
                id="book-cta"
                name="cta_label"
                value={form.cta_label}
                onChange={handleChange}
                className={field}
                placeholder="Order now"
              />
            </div>
          </div>

          <div>
            <label htmlFor="book-status" className={fieldLabel}>
              Availability
            </label>
            <input
              id="book-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={field}
              list="book-status-presets"
              placeholder="Available now"
            />
            <datalist id="book-status-presets">
              {statusPresets.map((preset) => (
                <option key={preset} value={preset} />
              ))}
            </datalist>
            <p className={fieldHint}>
              Include the word &ldquo;upcoming&rdquo; to feature this book in the upcoming-release spotlight.
            </p>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/70 px-4 py-3">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              <span className="block text-sm font-medium text-gray-800">Show on the website</span>
              <span className="block text-xs text-gray-500">
                Unchecked books stay saved here but are hidden from visitors.
              </span>
            </span>
          </label>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
            <button type="submit" disabled={saving} className={btnPrimary + ' flex-1'}>
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                'Save changes'
              ) : (
                'Add book'
              )}
            </button>
            {isEditing && (
              <button type="button" onClick={onCancelEdit} className={btnSecondary}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </Panel>

      {/* ── Library ── */}
      <Panel
        title={`Books (${books.length})`}
        description="Edit or remove any title in the catalogue."
        bodyClassName="p-0"
        action={
          books.length > 3 ? (
            <SearchInput value={search} onChange={setSearch} placeholder="Search books" className="w-48" />
          ) : undefined
        }
      >
        {books.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={BookOpen}
              title="No books yet"
              description="Add your first title using the form and it will appear on the books page straight away."
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={BookOpen}
              title="No matches"
              description={`Nothing matches "${search}". Try a different title or author.`}
            />
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((book) => (
              <li
                key={book.id}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 transition-colors',
                  editingId === book.id ? 'bg-primary-50/60' : 'hover:bg-gray-50',
                )}
              >
                {book.image_url ? (
                  <img
                    src={book.image_url}
                    alt=""
                    className="h-16 w-12 shrink-0 rounded-md border border-gray-200 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-300">
                    <ImageIcon size={18} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-gray-900">{book.title}</h3>
                    {book.featured ? (
                      <span
                        title="Visible on the website"
                        className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700"
                      >
                        <Eye size={10} />
                        Live
                      </span>
                    ) : (
                      <span
                        title="Hidden from visitors"
                        className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500"
                      >
                        <EyeOff size={10} />
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-gray-500">{book.author || 'No author set'}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                      {book.price || 'No price'}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                      {book.status || 'Available now'}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(book)}
                    className={iconBtn + ' hover:bg-primary-50 hover:text-primary-600'}
                    aria-label={`Edit ${book.title}`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(book)}
                    className={iconBtn + ' hover:bg-red-50 hover:text-red-600'}
                    aria-label={`Delete ${book.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <ImageCropModal
        open={Boolean(pendingCover)}
        file={pendingCover}
        aspectRatio={2 / 3}
        title="Crop book cover"
        subtitle="Frame the cover so it looks polished across the books page and public previews."
        confirmLabel="Apply crop"
        onClose={() => setPendingCover(null)}
        onConfirm={async (croppedFile) => {
          await onUploadCover(croppedFile);
          setPendingCover(null);
        }}
      />
    </div>
  );
}
