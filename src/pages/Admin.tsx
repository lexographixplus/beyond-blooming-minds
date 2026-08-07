import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  LayoutTemplate,
  MessageSquare,
  PenSquare,
  Plus,
  ShoppingBag,
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
import { toSlug } from '../lib/utils';
import AdminLogin from '../features/admin/components/AdminLogin';
import AdminShell from '../features/admin/components/AdminShell';
import type { NavGroup } from '../features/admin/components/AdminShell';
import { ToastProvider, useToast } from '../features/admin/components/ToastProvider';
import SubmissionDrawer from '../features/admin/components/SubmissionDrawer';
import ConfirmDialog from '../components/ConfirmDialog';
import OverviewTab from '../features/admin/tabs/OverviewTab';
import ContentTab from '../features/admin/tabs/ContentTab';
import BooksTab, { emptyBookForm } from '../features/admin/tabs/BooksTab';
import type { BookFormState } from '../features/admin/tabs/BooksTab';
import BlogsTab, { emptyBlogForm } from '../features/admin/tabs/BlogsTab';
import type { BlogFormState } from '../features/admin/tabs/BlogsTab';
import SubmissionsTab from '../features/admin/tabs/SubmissionsTab';
import { btnPrimary } from '../features/admin/ui';
import type {
  Book,
  BlogPost,
  ContactSubmission,
  ContentType,
  OrderSubmission,
  TabKey,
} from '../types';

/* ── Page metadata per tab ── */

const pageMeta: Record<TabKey, { title: string; description: string }> = {
  overview: { title: 'Overview', description: 'A snapshot of your site and everything that needs attention' },
  content: { title: 'Website content', description: 'Edit the words visitors read on the home page' },
  books: { title: 'Books', description: 'Manage the catalogue shown on the books page' },
  blogs: { title: 'Blog', description: 'Write and manage published reflections' },
  contact: { title: 'Messages', description: 'Replies and enquiries from the contact form' },
  orders: { title: 'Orders', description: 'Book order requests from the website' },
};

type SelectedSubmission =
  | { kind: 'contact'; item: ContactSubmission }
  | { kind: 'order'; item: OrderSubmission };

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
};

/* ═══════════════════════════════════════════════════════════════════════════
   Dashboard
   ═══════════════════════════════════════════════════════════════════════════ */

function Dashboard({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const { content, loading: cmsLoading } = useCms();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  /* ── Data ── */
  const [books, setBooks] = useState<Book[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [orderSubmissions, setOrderSubmissions] = useState<OrderSubmission[]>([]);

  /* ── Book editor ── */
  const [bookForm, setBookForm] = useState<BookFormState>(emptyBookForm);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [savingBook, setSavingBook] = useState(false);
  const [bookImageBusy, setBookImageBusy] = useState(false);

  /* ── Blog editor ── */
  const [blogForm, setBlogForm] = useState<BlogFormState>(emptyBlogForm);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [savingBlog, setSavingBlog] = useState(false);
  const [blogImageBusy, setBlogImageBusy] = useState(false);

  /* ── Overlays ── */
  const [selectedSubmission, setSelectedSubmission] = useState<SelectedSubmission | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmState | null>(null);

  useEffect(() => {
    const unsubs = [
      subscribeBooks(setBooks),
      subscribeBlogPosts(setBlogPosts),
      subscribeContactSubmissions(setContactSubmissions),
      subscribeOrderSubmissions(setOrderSubmissions),
    ];
    return () => unsubs.forEach((fn) => fn());
  }, []);

  /* ── Content ── */

  const handleContentSave = useCallback(
    async (next: ContentType) => {
      try {
        await updateContent(next);
        toast.success('Content saved', 'Your changes are now live on the website.');
      } catch (error) {
        console.error(error);
        toast.error('Could not save content', 'Check your connection and try again.');
        throw error;
      }
    },
    [toast],
  );

  /* ── Books ── */

  const resetBookForm = useCallback(() => {
    setBookForm(emptyBookForm);
    setEditingBookId(null);
  }, []);

  const handleBookSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingBook(true);
    try {
      if (editingBookId) {
        await saveBook(editingBookId, bookForm);
        toast.success('Book updated', `"${bookForm.title}" has been saved.`);
      } else {
        await addBook(bookForm);
        toast.success('Book added', `"${bookForm.title}" is now in your catalogue.`);
      }
      resetBookForm();
    } catch (error) {
      console.error(error);
      toast.error('Could not save the book', 'Please try again.');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeBook = (book: Book) => {
    setConfirmDialog({
      title: 'Delete book',
      message: `"${book.title}" will be permanently removed from the website.`,
      confirmLabel: 'Delete book',
      danger: true,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deleteBook(book.id);
          if (editingBookId === book.id) resetBookForm();
          toast.success('Book deleted');
        } catch (error) {
          console.error(error);
          toast.error('Could not delete the book', 'Please try again.');
        }
      },
    });
  };

  const uploadBookCover = async (file: File) => {
    setBookImageBusy(true);
    try {
      const url = await uploadImage(file, 'book-covers');
      setBookForm((previous) => ({ ...previous, image_url: url }));
      toast.success('Cover uploaded');
    } catch (error) {
      console.error(error);
      toast.error('Could not upload the cover', 'Please try a different image.');
    } finally {
      setBookImageBusy(false);
    }
  };

  /* ── Blog ── */

  const resetBlogForm = useCallback(() => {
    setBlogForm(emptyBlogForm);
    setEditingBlogId(null);
  }, []);

  const handleBlogSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSavingBlog(true);

    const payload = { ...blogForm, slug: blogForm.slug || toSlug(blogForm.title) };

    try {
      if (editingBlogId) {
        await saveBlogPost(editingBlogId, payload);
        toast.success('Post updated', `"${payload.title}" has been saved.`);
      } else {
        await addBlogPost(payload);
        toast.success('Post published', `"${payload.title}" is now on the blog.`);
      }
      resetBlogForm();
    } catch (error) {
      console.error(error);
      toast.error('Could not save the post', 'Please try again.');
    } finally {
      setSavingBlog(false);
    }
  };

  const startEditBlog = (post: BlogPost) => {
    setActiveTab('blogs');
    setEditingBlogId(post.id);
    setBlogForm({
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Reflection',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image_url: post.image_url || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeBlog = (post: BlogPost) => {
    setConfirmDialog({
      title: 'Delete blog post',
      message: `"${post.title}" will be permanently removed from the website.`,
      confirmLabel: 'Delete post',
      danger: true,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deleteBlogPost(post.id);
          if (editingBlogId === post.id) resetBlogForm();
          toast.success('Post deleted');
        } catch (error) {
          console.error(error);
          toast.error('Could not delete the post', 'Please try again.');
        }
      },
    });
  };

  const uploadBlogImage = async (file: File) => {
    setBlogImageBusy(true);
    try {
      const url = await uploadImage(file, 'blog-images');
      setBlogForm((previous) => ({ ...previous, image_url: url }));
      toast.success('Image uploaded');
    } catch (error) {
      console.error(error);
      toast.error('Could not upload the image', 'Please try a different file.');
    } finally {
      setBlogImageBusy(false);
    }
  };

  /* ── Submissions ── */

  const handleSubmissionSave = async (updates: Record<string, any>) => {
    if (!selectedSubmission) return;

    const table = selectedSubmission.kind === 'contact' ? 'contact_submissions' : 'order_submissions';
    await updateSubmissionStatus(table, selectedSubmission.item.id, updates);

    // Narrow per branch so the discriminated union stays intact.
    setSelectedSubmission((previous) => {
      if (!previous) return previous;
      return previous.kind === 'contact'
        ? { kind: 'contact', item: { ...previous.item, ...updates } }
        : { kind: 'order', item: { ...previous.item, ...updates } };
    });

    toast.success('Submission updated');
  };

  const removeSubmission = (kind: 'contact' | 'order', item: ContactSubmission | OrderSubmission) => {
    setConfirmDialog({
      title: kind === 'contact' ? 'Delete message' : 'Delete order request',
      message: `The submission from ${item.name} will be permanently removed.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const table = kind === 'contact' ? 'contact_submissions' : 'order_submissions';
          await deleteSubmission(table, item.id);
          if (selectedSubmission?.item.id === item.id) setSelectedSubmission(null);
          toast.success('Submission deleted');
        } catch (error) {
          console.error(error);
          toast.error('Could not delete', 'Please try again.');
        }
      },
    });
  };

  /* ── Navigation ── */

  const openContacts = contactSubmissions.filter((s) => s.status !== 'resolved').length;
  const openOrders = orderSubmissions.filter(
    (o) => o.status !== 'fulfilled' && o.status !== 'resolved',
  ).length;

  const navGroups = useMemo<NavGroup[]>(
    () => [
      {
        title: 'Workspace',
        items: [
          { key: 'overview', label: 'Overview', icon: LayoutDashboard },
          { key: 'content', label: 'Website content', icon: LayoutTemplate },
        ],
      },
      {
        title: 'Library',
        items: [
          { key: 'books', label: 'Books', icon: BookOpen, count: books.length },
          { key: 'blogs', label: 'Blog posts', icon: PenSquare, count: blogPosts.length },
        ],
      },
      {
        title: 'Inbox',
        items: [
          { key: 'contact', label: 'Messages', icon: MessageSquare, count: openContacts, highlight: true },
          { key: 'orders', label: 'Orders', icon: ShoppingBag, count: openOrders, highlight: true },
        ],
      },
    ],
    [books.length, blogPosts.length, openContacts, openOrders],
  );

  const headerActions =
    activeTab === 'books' ? (
      <button
        type="button"
        onClick={() => {
          resetBookForm();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={btnPrimary + ' hidden sm:inline-flex'}
      >
        <Plus size={15} />
        New book
      </button>
    ) : activeTab === 'blogs' ? (
      <button
        type="button"
        onClick={() => {
          resetBlogForm();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={btnPrimary + ' hidden sm:inline-flex'}
      >
        <Plus size={15} />
        New post
      </button>
    ) : undefined;

  return (
    <AdminShell
      groups={navGroups}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={pageMeta[activeTab].title}
      description={pageMeta[activeTab].description}
      actions={headerActions}
      userName={user?.user_metadata?.name || 'Administrator'}
      userEmail={user?.email || ''}
      onSignOut={onSignOut}
    >
      {activeTab === 'overview' && (
        <OverviewTab
          books={books}
          blogPosts={blogPosts}
          contactSubmissions={contactSubmissions}
          orderSubmissions={orderSubmissions}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'content' && (
        <ContentTab content={content} loading={cmsLoading} onSave={handleContentSave} />
      )}

      {activeTab === 'books' && (
        <BooksTab
          books={books}
          form={bookForm}
          setForm={setBookForm}
          editingId={editingBookId}
          saving={savingBook}
          onSubmit={handleBookSubmit}
          onCancelEdit={resetBookForm}
          onEdit={startEditBook}
          onDelete={removeBook}
          onUploadCover={uploadBookCover}
          uploading={bookImageBusy}
        />
      )}

      {activeTab === 'blogs' && (
        <BlogsTab
          posts={blogPosts}
          form={blogForm}
          setForm={setBlogForm}
          editingId={editingBlogId}
          saving={savingBlog}
          onSubmit={handleBlogSubmit}
          onCancelEdit={resetBlogForm}
          onEdit={startEditBlog}
          onDelete={removeBlog}
          onUploadImage={uploadBlogImage}
          uploading={blogImageBusy}
        />
      )}

      {activeTab === 'contact' && (
        <SubmissionsTab
          kind="contact"
          items={contactSubmissions}
          selectedId={selectedSubmission?.item.id}
          onOpen={(item) => setSelectedSubmission({ kind: 'contact', item })}
          onDelete={(item) => removeSubmission('contact', item)}
        />
      )}

      {activeTab === 'orders' && (
        <SubmissionsTab
          kind="order"
          items={orderSubmissions}
          selectedId={selectedSubmission?.item.id}
          onOpen={(item) => setSelectedSubmission({ kind: 'order', item })}
          onDelete={(item) => removeSubmission('order', item)}
        />
      )}

      <SubmissionDrawer
        open={Boolean(selectedSubmission)}
        kind={selectedSubmission?.kind || 'contact'}
        item={selectedSubmission?.item || null}
        onClose={() => setSelectedSubmission(null)}
        onSave={handleSubmissionSave}
      />

      <ConfirmDialog
        open={Boolean(confirmDialog)}
        title={confirmDialog?.title || ''}
        message={confirmDialog?.message || ''}
        confirmLabel={confirmDialog?.confirmLabel}
        danger={confirmDialog?.danger}
        onConfirm={() => confirmDialog?.onConfirm()}
        onCancel={() => setConfirmDialog(null)}
      />
    </AdminShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Auth gate
   ═══════════════════════════════════════════════════════════════════════════ */

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setCheckingSession(false);
    });
    return onAuthChange(setUser);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) throw error;
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (!user) return <AdminLogin onSubmit={handleLogin} />;

  return (
    <ToastProvider>
      <Dashboard user={user} onSignOut={() => signOut()} />
    </ToastProvider>
  );
}
