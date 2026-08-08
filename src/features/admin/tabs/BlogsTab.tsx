import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Edit3, ExternalLink, Image as ImageIcon, Loader2, PenSquare, Trash2, Upload, X } from 'lucide-react';
import { EmptyState, Panel, SearchInput } from '../components/primitives';
import { btnPrimary, btnSecondary, field, fieldHint, fieldLabel, iconBtn } from '../ui';
import { cn, estimateReadTime, formatDateTime, getBlogPostPath, toSlug } from '../../../lib/utils';
import type { BlogPost } from '../../../types';

export type BlogFormState = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
};

export const emptyBlogForm: BlogFormState = {
  title: '',
  slug: '',
  category: 'Reflection',
  excerpt: '',
  content: '',
  image_url: '',
};

const quillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

const categoryPresets = ['Reflection', 'Psychoeducation', 'Parenting', 'Wellbeing', 'Announcement'];

type BlogsTabProps = {
  posts: BlogPost[];
  form: BlogFormState;
  setForm: (updater: (previous: BlogFormState) => BlogFormState) => void;
  editingId: string | null;
  saving: boolean;
  onSubmit: (event: FormEvent) => void;
  onCancelEdit: () => void;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onUploadImage: (file: File) => Promise<void>;
  uploading: boolean;
};

export default function BlogsTab({
  posts,
  form,
  setForm,
  editingId,
  saving,
  onSubmit,
  onCancelEdit,
  onEdit,
  onDelete,
  onUploadImage,
  uploading,
}: BlogsTabProps) {
  const [search, setSearch] = useState('');

  const isEditing = Boolean(editingId);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        (post.category || '').toLowerCase().includes(query) ||
        (post.excerpt || '').toLowerCase().includes(query),
    );
  }, [posts, search]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
      // Keep the slug in step with the title until the post exists.
      ...(name === 'title' && !editingId ? { slug: toSlug(value) } : {}),
    }));
  };

  const pickImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) await onUploadImage(file);
  };

  const wordCount = form.content ? estimateReadTime(form.content) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
      {/* ── Editor ── */}
      <Panel
        title={isEditing ? 'Edit post' : 'Write a blog post'}
        description={isEditing ? 'Saving updates the live article.' : 'Published posts appear on the blog immediately.'}
        action={
          isEditing ? (
            <button type="button" onClick={onCancelEdit} className={iconBtn} aria-label="Cancel editing">
              <X size={16} />
            </button>
          ) : undefined
        }
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <span className={fieldLabel}>Cover image</span>
            {form.image_url ? (
              <div className="relative h-48 overflow-hidden rounded-xl border border-gray-200">
                <img src={form.image_url} alt="Blog cover preview" className="h-full w-full object-cover" />
                <div className="absolute bottom-2.5 right-2.5 flex gap-2">
                  <label className="cursor-pointer rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white">
                    Replace
                    <input type="file" accept="image/*" className="hidden" onChange={pickImage} />
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
              <label className="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 text-gray-400 transition-colors hover:border-primary-300 hover:bg-primary-50/40 hover:text-primary-500">
                <Upload size={22} />
                <span className="text-sm font-medium">Click to upload a cover image</span>
                <input type="file" accept="image/*" className="hidden" onChange={pickImage} />
              </label>
            )}
            {uploading && (
              <p className={fieldHint + ' flex items-center gap-1.5'}>
                <Loader2 size={12} className="animate-spin" />
                Uploading image...
              </p>
            )}
          </div>

          <div>
            <label htmlFor="blog-title" className={fieldLabel}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="blog-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={field}
              placeholder="What is this post about?"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="blog-category" className={fieldLabel}>
                Category
              </label>
              <input
                id="blog-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={field}
                list="blog-category-presets"
              />
              <datalist id="blog-category-presets">
                {categoryPresets.map((preset) => (
                  <option key={preset} value={preset} />
                ))}
              </datalist>
            </div>
            <div>
              <label htmlFor="blog-slug" className={fieldLabel}>
                URL slug
              </label>
              <input
                id="blog-slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className={field}
                placeholder="auto-generated-from-title"
              />
              <p className={fieldHint}>/blog/{form.slug || 'your-post'}</p>
            </div>
          </div>

          <div>
            <label htmlFor="blog-excerpt" className={fieldLabel}>
              Excerpt
            </label>
            <textarea
              id="blog-excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              className={field + ' resize-y leading-relaxed'}
              placeholder="A short summary shown on blog cards."
            />
            <p className={fieldHint}>Leave blank to use the opening of the post.</p>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className={fieldLabel + ' mb-0'}>Body</label>
              {wordCount > 0 && <span className="text-xs text-gray-400">{wordCount} min read</span>}
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[260px] [&_.ql-editor]:text-sm [&_.ql-editor]:leading-relaxed [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-gray-200 [&_.ql-toolbar]:bg-gray-50">
              <ReactQuill
                theme="snow"
                value={form.content}
                onChange={(value) => setForm((previous) => ({ ...previous, content: value }))}
                modules={quillModules}
                placeholder="Write your blog post..."
              />
            </div>
          </div>

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
                'Publish post'
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

      {/* ── Published posts ── */}
      <Panel
        title={`Posts (${posts.length})`}
        description="Everything currently on the blog."
        bodyClassName="p-0"
        action={
          posts.length > 3 ? (
            <SearchInput value={search} onChange={setSearch} placeholder="Search posts" className="w-48" />
          ) : undefined
        }
      >
        {posts.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={PenSquare}
              title="No posts yet"
              description="Write your first reflection using the editor and it will appear on the blog."
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={PenSquare}
              title="No matches"
              description={`Nothing matches "${search}". Try a different title or category.`}
            />
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((post) => (
              <li
                key={post.id}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 transition-colors',
                  editingId === post.id ? 'bg-primary-50/60' : 'hover:bg-gray-50',
                )}
              >
                {post.image_url ? (
                  <img src={post.image_url} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-300">
                    <ImageIcon size={18} />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{post.title}</h3>
                  <p className="truncate text-xs text-gray-500">{post.category || 'Reflection'}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">{formatDateTime(post.created_at)}</p>
                </div>

                <div className="flex shrink-0 gap-1">
                  <a
                    href={`${import.meta.env.BASE_URL}${getBlogPostPath(post).slice(1)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={iconBtn}
                    aria-label={`View ${post.title} on the site`}
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    type="button"
                    onClick={() => onEdit(post)}
                    className={iconBtn + ' hover:bg-primary-50 hover:text-primary-600'}
                    aria-label={`Edit ${post.title}`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post)}
                    className={iconBtn + ' hover:bg-red-50 hover:text-red-600'}
                    aria-label={`Delete ${post.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
