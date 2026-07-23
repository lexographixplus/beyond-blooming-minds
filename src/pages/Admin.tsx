import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  BookOpen,
  Check,
  Edit3,
  ExternalLink,
  Eye,
  LayoutTemplate,
  LogOut,
  MessageSquare,
  PenSquare,
  Plus,
  RotateCcw,
  ShoppingBag,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  signIn,
  signOut,
  onAuthChange,
  getSession,
  addBook,
  saveBook,
  deleteBook,
  addBlogPost,
  saveBlogPost,
  deleteBlogPost,
  updateContent,
  updateSubmissionStatus,
  deleteSubmission,
  uploadImage,
  subscribeBooks,
  subscribeBlogPosts,
  subscribeContactSubmissions,
  subscribeOrderSubmissions,
} from '../lib/supabase';
import { useCms } from '../context/CmsContext';
import { assets, defaultBooks, mergeBooksById } from '../lib/siteContent';
import ImageCropModal from '../features/admin/components/ImageCropModal';
import SubmissionDrawer from '../features/admin/components/SubmissionDrawer';
import type { Book, BlogPost, ContactSubmission, OrderSubmission, TabKey } from '../types';

/* ── Form-state types ── */

type BookFormState = {
  title: string;
  author: string;
  description: string;
  price: string;
  cta_label: string;
  image_url: string;
  featured: boolean;
  status: string;
};

type BlogFormState = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string;
};

/* ── Defaults ── */

const emptyBookForm: BookFormState = {
  title: '',
  author: '',
  description: '',
  price: '',
  cta_label: 'Order now',
  image_url: '',
  featured: true,
  status: 'Available now',
};

const emptyBlogForm: BlogFormState = {
  title: '',
  category: 'Reflection',
  excerpt: '',
  content: '',
  image_url: '',
};

const formatTimestamp = (value: string | undefined | null) => {
  if (!value) return 'Just now';
  return new Date(value).toLocaleString();
};

/* ── Shared input class ── */
const inputClass =
  'w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-primary-500';

/* ═══════════════════════════════════════════════════════════════════════════
   Admin component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Admin() {
  const { content, loading: cmsLoading } = useCms();

  /* ── Auth state ── */
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  /* ── Dashboard state ── */
  const [activeTab, setActiveTab] = useState<TabKey>('content');
  const [editedContent, setEditedContent] = useState(content);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);

  /* ── Books state ── */
  const [books, setBooks] = useState<Book[]>([]);
  const [bookForm, setBookForm] = useState<BookFormState>(emptyBookForm);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [pendingBookCover, setPendingBookCover] = useState<File | null>(null);
  const [isBookCropOpen, setIsBookCropOpen] = useState(false);
  const [bookImageBusy, setBookImageBusy] = useState(false);
  const [savingBook, setSavingBook] = useState(false);

  /* ── Blog state ── */
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogForm, setBlogForm] = useState<BlogFormState>(emptyBlogForm);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogImageBusy, setBlogImageBusy] = useState(false);
  const [savingBlog, setSavingBlog] = useState(false);

  /* ── Submissions state ── */
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [orderSubmissions, setOrderSubmissions] = useState<OrderSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<
    { kind: 'contact'; item: ContactSubmission } | { kind: 'order'; item: OrderSubmission } | null
  >(null);

  const sessionUser = user;

  /* ── Auth setup ── */
  useEffect(() => {
    getSession().then(({ data }) => setUser(data.session?.user ?? null));
    return onAuthChange(setUser);
  }, []);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  /* ── Data subscriptions ── */
  useEffect(() => {
    if (!sessionUser) return;
    const unsubs = [
      subscribeBooks(setBooks),
      subscribeBlogPosts(setBlogPosts),
      subscribeContactSubmissions(setContactSubmissions),
      subscribeOrderSubmissions(setOrderSubmissions),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [sessionUser]);

  const allBooks = mergeBooksById(defaultBooks as Book[], books) as Book[];
  const defaultBookIds = new Set(defaultBooks.map((b) => b.id));

  /* ── Reset helpers ── */
  const resetBookForm = () => {
    setBookForm(emptyBookForm);
    setEditingBookId(null);
  };

  const resetBlogForm = () => {
    setBlogForm(emptyBlogForm);
    setEditingBlogId(null);
  };

  /* ── Auth handlers ── */
  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
    } catch (error: any) {
      setLoginError(error.message || 'Unable to sign in.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  /* ── Content handlers ── */
  const handleContentSave = async (event: FormEvent) => {
    event.preventDefault();
    setIsSavingContent(true);
    try {
      await updateContent(editedContent);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (error) {
      console.error(error);
      alert('Failed to save content.');
    } finally {
      setIsSavingContent(false);
    }
  };

  const handleContentChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedContent((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  /* ── Book handlers ── */
  const handleBookChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, type, checked, value } = target;
    setBookForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const openBookCropper = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingBookCover(file);
    setIsBookCropOpen(true);
    event.target.value = '';
  };

  const handleCroppedBookCover = async (croppedFile: File) => {
    setBookImageBusy(true);
    try {
      const url = await uploadImage(croppedFile, 'book-covers');
      setBookForm((previous) => ({ ...previous, image_url: url }));
      setIsBookCropOpen(false);
      setPendingBookCover(null);
    } catch (error) {
      console.error(error);
      alert('Could not upload the book cover.');
    } finally {
      setBookImageBusy(false);
    }
  };

  const cancelBookCropper = () => {
    setIsBookCropOpen(false);
    setPendingBookCover(null);
  };

  const handleBookSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingBook(true);

    const payload = {
      title: bookForm.title,
      author: bookForm.author,
      description: bookForm.description,
      price: bookForm.price,
      cta_label: bookForm.cta_label,
      image_url: bookForm.image_url,
      featured: bookForm.featured,
      status: bookForm.status,
    };

    try {
      if (editingBookId) {
        await saveBook(editingBookId, payload);
      } else {
        await addBook(payload);
      }
      resetBookForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save the book.');
    } finally {
      setSavingBook(false);
    }
  };

  const startEditBook = (book: Book) => {
    setActiveTab('books');
    setEditingBookId(book.id);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      price: book.price || '',
      cta_label: book.cta_label || 'Order now',
      image_url: book.image_url || '',
      featured: Boolean(book.featured),
      status: book.status || 'Available now',
    });
  };

  const removeBook = async (book: Book) => {
    const seeded = defaultBookIds.has(book.id);
    const confirmed = window.confirm(
      seeded
        ? 'Reset this seeded book back to the default public version?'
        : 'Delete this book from the site?',
    );
    if (!confirmed) return;

    try {
      await deleteBook(book.id);
      if (editingBookId === book.id) resetBookForm();
    } catch (error) {
      console.error(error);
      alert('Could not remove the book.');
    }
  };

  /* ── Blog handlers ── */
  const handleBlogChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBlogForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const uploadBlogImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setBlogImageBusy(true);
    try {
      const url = await uploadImage(file, 'blog-images');
      setBlogForm((previous) => ({ ...previous, image_url: url }));
    } catch (error) {
      console.error(error);
      alert('Could not upload the blog image.');
    } finally {
      setBlogImageBusy(false);
      event.target.value = '';
    }
  };

  const handleBlogSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingBlog(true);

    const payload = {
      title: blogForm.title,
      category: blogForm.category,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      image_url: blogForm.image_url,
    };

    try {
      if (editingBlogId) {
        await saveBlogPost(editingBlogId, payload);
      } else {
        await addBlogPost(payload);
      }
      resetBlogForm();
    } catch (error) {
      console.error(error);
      alert('Failed to save the blog post.');
    } finally {
      setSavingBlog(false);
    }
  };

  const startEditBlog = (post: BlogPost) => {
    setActiveTab('blogs');
    setEditingBlogId(post.id);
    setBlogForm({
      title: post.title || '',
      category: post.category || 'Reflection',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image_url: post.image_url || '',
    });
  };

  const removeBlog = async (post: BlogPost) => {
    if (!window.confirm('Delete this blog post?')) return;

    try {
      await deleteBlogPost(post.id);
      if (editingBlogId === post.id) resetBlogForm();
    } catch (error) {
      console.error(error);
      alert('Could not remove the blog post.');
    }
  };

  /* ── Submission handlers ── */
  const handleSubmissionSave = async (updates: Record<string, any>) => {
    if (!selectedSubmission) return;

    const table = selectedSubmission.kind === 'contact' ? 'contact_submissions' : 'order_submissions';
    await updateSubmissionStatus(table, selectedSubmission.item.id, updates);
    setSelectedSubmission((previous) =>
      previous
        ? { ...previous, item: { ...previous.item, ...updates } }
        : previous,
    );
  };

  const handleDeleteSubmission = async (
    kind: 'contact' | 'order',
    id: string,
  ) => {
    if (!window.confirm('Delete this submission permanently?')) return;
    try {
      const table = kind === 'contact' ? 'contact_submissions' : 'order_submissions';
      await deleteSubmission(table, id);
      if (selectedSubmission?.item.id === id) setSelectedSubmission(null);
    } catch (error) {
      console.error(error);
      alert('Could not delete the submission.');
    }
  };

  const openContactSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission({ kind: 'contact', item: submission });
  };

  const openOrderSubmission = (submission: OrderSubmission) => {
    setSelectedSubmission({ kind: 'order', item: submission });
  };

  /* ── Status helpers ── */
  const statusDotColor = (status: string | undefined) => {
    if (status === 'resolved' || status === 'fulfilled') return 'bg-emerald-400';
    if (status === 'read' || status === 'responded' || status === 'contacted' || status === 'in-progress')
      return 'bg-amber-400';
    return 'bg-red-400';
  };

  const statusTextColor = (status: string | undefined) => {
    if (status === 'resolved' || status === 'fulfilled') return 'text-emerald-600';
    if (status === 'read' || status === 'responded' || status === 'contacted' || status === 'in-progress')
      return 'text-amber-600';
    return 'text-red-600';
  };

  /* ═══════════════════════════════════════════════════════════════════════════
     Login screen
     ═══════════════════════════════════════════════════════════════════════════ */
  if (!sessionUser) {
    return (
      <div className="flex min-h-screen">
        {/* Left brand panel */}
        <div className="relative hidden overflow-hidden bg-primary-950 lg:flex lg:w-1/2 lg:flex-col lg:items-center lg:justify-center">
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-primary-400/15 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-primary-500/10 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center px-12 text-center">
            <img
              src={assets.logo}
              alt="Beyond Blooming Minds logo"
              className="h-20 w-20 rounded-2xl object-cover shadow-lg shadow-primary-900/50"
            />
            <h1 className="mt-6 font-serif text-3xl text-white">Beyond Blooming Minds</h1>
            <p className="mt-3 text-primary-300">Growing minds, hearts &amp; spirits</p>
          </div>

          <p className="absolute bottom-10 left-0 right-0 px-12 text-center text-sm italic text-white/60">
            &ldquo;Holistic care for mind, heart, and spirit&rdquo;
          </p>
        </div>

        {/* Right login panel */}
        <div className="flex w-full items-center justify-center bg-white px-6 lg:w-1/2">
          <div className="w-full max-w-sm">
            {/* Mobile-only logo */}
            <div className="mb-8 flex justify-center lg:hidden">
              <img
                src={assets.logo}
                alt="Beyond Blooming Minds logo"
                className="h-14 w-14 rounded-2xl object-cover"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-gray-500">Sign in to manage your site</p>

            {loginError && (
              <div className="mt-6 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 py-3 text-sm font-semibold text-white transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-600/25"
              >
                Sign in
              </button>
            </form>

          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     Dashboard
     ═══════════════════════════════════════════════════════════════════════════ */

  const tabs: { key: TabKey; label: string; icon: any; count?: number }[] = [
    { key: 'content', label: 'Content', icon: LayoutTemplate },
    { key: 'books', label: 'Books', icon: BookOpen, count: allBooks.length },
    { key: 'blogs', label: 'Blogs', icon: PenSquare, count: blogPosts.length },
    { key: 'contact', label: 'Contacts', icon: MessageSquare, count: contactSubmissions.length },
    { key: 'orders', label: 'Orders', icon: ShoppingBag, count: orderSubmissions.length },
  ];

  const isEditingBook = Boolean(editingBookId);
  const isEditingBlog = Boolean(editingBlogId);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* ══════════════════════════════════════════════════════════════════
           Desktop sidebar
           ══════════════════════════════════════════════════════════════════ */}
        <aside className="hidden w-60 flex-col bg-gray-950 text-white md:flex">
          {/* Sidebar header */}
          <div className="px-5 pb-4 pt-6">
            <div className="flex items-center gap-3">
              <img
                src={assets.logo}
                alt="Beyond Blooming Minds logo"
                className="h-8 w-8 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-bold text-white">BBM</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 pt-4">
            <p className="mb-2 px-3 text-[10px] uppercase tracking-[0.15em] text-gray-600">Menu</p>
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      active
                        ? 'bg-white/10 font-semibold text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {active && (
                      <div className="h-5 w-1 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
                    )}
                    <Icon size={16} />
                    <span className="flex-1 text-left">{tab.label}</span>
                    {typeof tab.count === 'number' && (
                      <span className="rounded-lg bg-white/10 px-1.5 py-0.5 text-[11px] text-gray-400">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User / sign-out */}
          <div className="border-t border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-300">
                  {user?.user_metadata?.name || 'Admin'}
                </p>
                <p className="truncate text-[11px] text-gray-500">
                  {user?.email || ''}
                </p>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/10 hover:text-red-400"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* ══════════════════════════════════════════════════════════════════
           Main area
           ══════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="border-b border-gray-100 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                View live site
                <ExternalLink size={14} />
              </a>
            </div>
          </header>

          {/* Mobile tab bar */}
          <div className="flex gap-1 overflow-x-auto border-b border-gray-100 bg-white px-3 py-2 md:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleSignOut}
              className="ml-auto flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-400 transition-colors hover:text-red-500"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* ── Content area ── */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="mx-auto max-w-5xl">
              {/* Stats row */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-5 transition-shadow hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Books
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{allBooks.length}</p>
                    <p className="text-xs text-gray-400">Featured and custom titles</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-5 transition-shadow hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <PenSquare size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Blog
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
                    <p className="text-xs text-gray-400">Published reflections</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-5 transition-shadow hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Contacts
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {contactSubmissions.filter((s) => s.status !== 'resolved').length}
                    </p>
                    <p className="text-xs text-gray-400">Messages awaiting reply</p>
                  </div>
                </div>

                <div className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-5 transition-shadow hover:shadow-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {orderSubmissions.filter((o) => o.status !== 'fulfilled' && o.status !== 'resolved').length}
                    </p>
                    <p className="text-xs text-gray-400">Requests in progress</p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                 Content tab
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'content' &&
                (cmsLoading ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
                    Loading website content...
                  </div>
                ) : (
                  <form
                    onSubmit={handleContentSave}
                    className="space-y-8 rounded-2xl border border-gray-100 bg-white/60 p-6 shadow-sm md:p-8"
                  >
                    {/* Hero section */}
                    <div>
                      <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                        Hero section
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            name="heroTitle"
                            value={editedContent.heroTitle}
                            onChange={handleContentChange}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Subtitle
                          </label>
                          <textarea
                            name="heroSubtitle"
                            value={editedContent.heroSubtitle}
                            onChange={handleContentChange}
                            rows={4}
                            className={inputClass + ' resize-none'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* About section */}
                    <div>
                      <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                        About section
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            About text
                          </label>
                          <textarea
                            name="aboutText"
                            value={editedContent.aboutText}
                            onChange={handleContentChange}
                            rows={7}
                            className={inputClass + ' resize-none'}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Vision statement
                          </label>
                          <textarea
                            name="visionText"
                            value={editedContent.visionText}
                            onChange={handleContentChange}
                            rows={3}
                            className={inputClass + ' resize-none'}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Mission statement
                          </label>
                          <textarea
                            name="missionText"
                            value={editedContent.missionText}
                            onChange={handleContentChange}
                            rows={3}
                            className={inputClass + ' resize-none'}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Founder section */}
                    <div>
                      <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                        Founder section
                      </h3>
                      <div className="mt-4">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Founder note
                        </label>
                        <textarea
                          name="founderNote"
                          value={editedContent.founderNote}
                          onChange={handleContentChange}
                          rows={8}
                          className={inputClass + ' resize-none'}
                        />
                      </div>
                    </div>

                    {/* Contact info */}
                    <div>
                      <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                        Contact info
                      </h3>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="text"
                            name="email"
                            value={editedContent.email}
                            onChange={handleContentChange}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            WhatsApp
                          </label>
                          <input
                            type="text"
                            name="whatsapp"
                            value={editedContent.whatsapp}
                            onChange={handleContentChange}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-gray-700">
                            Instagram
                          </label>
                          <input
                            type="text"
                            name="instagram"
                            value={editedContent.instagram}
                            onChange={handleContentChange}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save button */}
                    <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                      <button
                        type="submit"
                        disabled={isSavingContent}
                        className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSavingContent ? 'Saving...' : 'Save changes'}
                      </button>
                      {saveSuccess && (
                        <span className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                          <Check size={16} />
                          Saved successfully
                        </span>
                      )}
                    </div>
                  </form>
                ))}

              {/* ═══════════════════════════════════════════════════════════
                 Books tab
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'books' && (
                <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                  {/* Book form */}
                  <form
                    onSubmit={handleBookSubmit}
                    className="space-y-5 rounded-2xl border border-gray-100 bg-white/60 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                        {isEditingBook ? 'Edit book' : 'Add a new book'}
                      </h3>
                      {!isEditingBook && <Plus className="text-gray-400" size={18} />}
                    </div>

                    {/* Image upload area */}
                    {bookForm.image_url ? (
                      <div className="relative h-48 overflow-hidden rounded-xl">
                        <img
                          src={bookForm.image_url}
                          alt="Book cover preview"
                          className="h-full w-full object-contain bg-gray-50 p-4"
                        />
                        <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white">
                          Change
                          <input type="file" accept="image/*" className="hidden" onChange={openBookCropper} />
                        </label>
                      </div>
                    ) : (
                      <label className="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-primary-300 hover:text-primary-500">
                        <Upload size={24} />
                        <span className="text-sm">Drag &amp; drop or click to upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={openBookCropper} />
                      </label>
                    )}

                    {bookImageBusy && (
                      <p className="text-center text-xs text-gray-500">Processing cover...</p>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                      <input
                        name="title"
                        value={bookForm.title}
                        onChange={handleBookChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Author</label>
                      <input
                        name="author"
                        value={bookForm.author}
                        onChange={handleBookChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={bookForm.description}
                        onChange={handleBookChange}
                        rows={5}
                        required
                        className={inputClass + ' resize-none'}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          name="price"
                          value={bookForm.price}
                          onChange={handleBookChange}
                          placeholder="Pre-order available"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          CTA label
                        </label>
                        <input
                          name="cta_label"
                          value={bookForm.cta_label}
                          onChange={handleBookChange}
                          placeholder="Order now"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <input
                          name="status"
                          value={bookForm.status}
                          onChange={handleBookChange}
                          className={inputClass}
                        />
                      </div>
                      <label className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={bookForm.featured}
                          onChange={handleBookChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        Feature this book on the website
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={savingBook}
                        className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {savingBook ? 'Saving...' : isEditingBook ? 'Save book' : 'Add book'}
                      </button>
                      {isEditingBook && (
                        <button
                          type="button"
                          onClick={resetBookForm}
                          className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Book list */}
                  <div className="space-y-3">
                    <div className="mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">Current books</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Edit titles, create new books, or reset to default.
                      </p>
                    </div>

                    {allBooks.map((book) => {
                      const seeded = defaultBookIds.has(book.id);

                      return (
                        <div
                          key={book.id}
                          className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-4 transition-shadow hover:shadow-md"
                        >
                          {book.image_url ? (
                            <img
                              src={book.image_url}
                              alt={book.title}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-300">
                              <BookOpen size={22} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="truncate text-sm font-semibold text-gray-900">
                                {book.title}
                              </h4>
                              {book.featured && (
                                <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                              )}
                            </div>
                            <p className="truncate text-xs text-gray-500">{book.author}</p>
                            <span className="mt-1 inline-block rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                              {book.price || 'No price set'}
                            </span>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              onClick={() => startEditBook(book)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBook(book)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title={seeded ? 'Reset' : 'Delete'}
                            >
                              {seeded ? <RotateCcw size={16} /> : <Trash2 size={16} />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                 Blogs tab
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'blogs' && (
                <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                  {/* Blog form */}
                  <form
                    onSubmit={handleBlogSubmit}
                    className="space-y-5 rounded-2xl border border-gray-100 bg-white/60 p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                        {isEditingBlog ? 'Edit blog' : 'Write a blog post'}
                      </h3>
                      {!isEditingBlog && <Plus className="text-gray-400" size={18} />}
                    </div>

                    {/* Image upload area */}
                    {blogForm.image_url ? (
                      <div className="relative h-48 overflow-hidden rounded-xl">
                        <img
                          src={blogForm.image_url}
                          alt="Blog image preview"
                          className="h-full w-full object-cover"
                        />
                        <label className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur transition-colors hover:bg-white">
                          Change
                          <input type="file" accept="image/*" className="hidden" onChange={uploadBlogImage} />
                        </label>
                      </div>
                    ) : (
                      <label className="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-primary-300 hover:text-primary-500">
                        <Upload size={24} />
                        <span className="text-sm">Drag &amp; drop or click to upload</span>
                        <input type="file" accept="image/*" className="hidden" onChange={uploadBlogImage} />
                      </label>
                    )}

                    {blogImageBusy && (
                      <p className="text-center text-xs text-gray-500">Uploading image...</p>
                    )}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                      <input
                        name="title"
                        value={blogForm.title}
                        onChange={handleBlogChange}
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <input
                        name="category"
                        value={blogForm.category}
                        onChange={handleBlogChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Excerpt
                      </label>
                      <textarea
                        name="excerpt"
                        value={blogForm.excerpt}
                        onChange={handleBlogChange}
                        rows={3}
                        className={inputClass + ' resize-none'}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Body</label>
                      <textarea
                        name="content"
                        value={blogForm.content}
                        onChange={handleBlogChange}
                        rows={8}
                        required
                        className={inputClass + ' resize-none'}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={savingBlog}
                        className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:from-primary-700 hover:to-primary-800 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {savingBlog ? 'Saving...' : isEditingBlog ? 'Save blog' : 'Publish blog post'}
                      </button>
                      {isEditingBlog && (
                        <button
                          type="button"
                          onClick={resetBlogForm}
                          className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Blog list */}
                  <div className="space-y-3">
                    <div className="mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">Published posts</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Public blog cards update automatically when you save here.
                      </p>
                    </div>

                    {blogPosts.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
                        No blog posts yet.
                      </div>
                    ) : (
                      blogPosts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-4 transition-shadow hover:shadow-md"
                        >
                          {post.image_url ? (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-300">
                              <PenSquare size={22} />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="truncate text-sm font-semibold text-gray-900">
                              {post.title}
                            </h4>
                            <p className="truncate text-xs text-gray-500">
                              {post.category || 'Reflection'}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-400">
                              {formatTimestamp(post.created_at)}
                            </p>
                          </div>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              onClick={() => startEditBlog(post)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                              title="Edit"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBlog(post)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                 Contact tab
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                      Contact submissions
                    </h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">
                        {contactSubmissions.length}
                      </span>{' '}
                      total {' / '}
                      <span className="font-semibold text-gray-700">
                        {contactSubmissions.filter((s) => s.status !== 'resolved').length}
                      </span>{' '}
                      awaiting
                    </p>
                  </div>

                  {contactSubmissions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
                      No contact submissions yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {contactSubmissions.map((submission) => (
                        <div
                          key={submission.id}
                          className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-4 transition-all hover:bg-gray-50 hover:shadow-md"
                        >
                          <div
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDotColor(submission.status)}`}
                          />
                          <button
                            type="button"
                            onClick={() => openContactSubmission(submission)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {submission.name}
                              </p>
                              <span
                                className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${statusTextColor(submission.status)}`}
                              >
                                {submission.status || 'new'}
                              </span>
                            </div>
                            <p className="truncate text-xs text-gray-500">{submission.email}</p>
                          </button>
                          <p className="hidden max-w-xs truncate text-sm text-gray-500 lg:block">
                            {submission.message.length > 80
                              ? `${submission.message.slice(0, 80)}...`
                              : submission.message}
                          </p>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden text-xs text-gray-400 sm:inline">
                              {formatTimestamp(submission.created_at)}
                            </span>
                            <button
                              type="button"
                              onClick={() => openContactSubmission(submission)}
                              className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                            >
                              <Eye size={14} />
                              Open
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubmission('contact', submission.id)}
                              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════════
                 Orders tab
                 ═══════════════════════════════════════════════════════════ */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="border-l-2 border-primary-400 pl-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-900">
                      Order submissions
                    </h3>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">
                        {orderSubmissions.length}
                      </span>{' '}
                      total {' / '}
                      <span className="font-semibold text-gray-700">
                        {orderSubmissions.filter((o) => o.status !== 'fulfilled' && o.status !== 'resolved').length}
                      </span>{' '}
                      awaiting
                    </p>
                  </div>

                  {orderSubmissions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
                      No order requests yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orderSubmissions.map((order) => (
                        <div
                          key={order.id}
                          className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white/60 p-4 transition-all hover:bg-gray-50 hover:shadow-md"
                        >
                          <div
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDotColor(order.status)}`}
                          />
                          <button
                            type="button"
                            onClick={() => openOrderSubmission(order)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {order.name}
                              </p>
                              <span
                                className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${statusTextColor(order.status)}`}
                              >
                                {order.status || 'new'}
                              </span>
                            </div>
                            <p className="truncate text-xs text-gray-500">{order.book_title}</p>
                          </button>
                          <div className="hidden items-center gap-4 text-xs text-gray-500 md:flex">
                            <span>{order.phone}</span>
                            <span>Qty: {order.quantity}</span>
                            <span>{order.price || 'No price'}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden text-xs text-gray-400 sm:inline">
                              {formatTimestamp(order.created_at)}
                            </span>
                            <button
                              type="button"
                              onClick={() => openOrderSubmission(order)}
                              className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700"
                            >
                              <Eye size={14} />
                              Open
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubmission('order', order.id)}
                              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ── Modals & drawers ── */}
      <ImageCropModal
        open={isBookCropOpen}
        file={pendingBookCover}
        aspectRatio={2 / 3}
        title="Crop book cover"
        subtitle="Frame the cover so it looks polished across the books page and public previews."
        confirmLabel="Apply crop"
        onClose={cancelBookCropper}
        onConfirm={handleCroppedBookCover}
      />

      <SubmissionDrawer
        open={Boolean(selectedSubmission)}
        kind={selectedSubmission?.kind || 'contact'}
        item={selectedSubmission?.item || null}
        onClose={() => setSelectedSubmission(null)}
        onSave={handleSubmissionSave}
      />
    </div>
  );
}
