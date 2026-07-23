import { createClient } from '@supabase/supabase-js';
import type { Book, BlogPost, ContactSubmission, ContentType, OrderSubmission } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth ──

export const signIn = (email: string, password: string) =>
  supabase.auth.signInWithPassword({ email, password });

export const signOut = () => supabase.auth.signOut();

export const onAuthChange = (callback: (user: any) => void) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
};

export const getSession = () => supabase.auth.getSession();

// ── CMS Content ──

export const getContent = async (): Promise<ContentType | null> => {
  const { data } = await supabase
    .from('cms_content')
    .select('*')
    .eq('id', 'main')
    .single();
  return data;
};

export const updateContent = async (content: Partial<ContentType>) => {
  const { error } = await supabase
    .from('cms_content')
    .upsert({ id: 'main', ...content, updated_at: new Date().toISOString() });
  if (error) throw error;
};

export const subscribeContent = (callback: (data: ContentType | null) => void) => {
  getContent().then(callback);

  const channel = supabase
    .channel('cms-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'cms_content' }, () => {
      getContent().then(callback);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

// ── Books ──

export const getBooks = async (): Promise<Book[]> => {
  const { data } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};

export const subscribeBooks = (callback: (data: Book[]) => void) => {
  getBooks().then(callback);

  const channel = supabase
    .channel('books-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, () => {
      getBooks().then(callback);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const addBook = async (book: Omit<Book, 'id' | 'created_at'>) => {
  const { error } = await supabase.from('books').insert(book);
  if (error) throw error;
};

export const saveBook = async (id: string, book: Partial<Book>) => {
  const { error } = await supabase.from('books').update(book).eq('id', id);
  if (error) throw error;
};

export const deleteBook = async (id: string) => {
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) throw error;
};

// ── Blog Posts ──

export const getBlogPosts = async (): Promise<BlogPost[]> => {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};

export const subscribeBlogPosts = (callback: (data: BlogPost[]) => void) => {
  getBlogPosts().then(callback);

  const channel = supabase
    .channel('blog-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => {
      getBlogPosts().then(callback);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

export const addBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at'>) => {
  const { error } = await supabase.from('blog_posts').insert(post);
  if (error) throw error;
};

export const saveBlogPost = async (id: string, post: Partial<BlogPost>) => {
  const { error } = await supabase.from('blog_posts').update(post).eq('id', id);
  if (error) throw error;
};

export const deleteBlogPost = async (id: string) => {
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
};

// ── Contact Submissions ──

export const submitContactForm = async (data: { name: string; email: string; message: string }) => {
  const { error } = await supabase.from('contact_submissions').insert({ ...data, status: 'new' });
  if (error) throw error;
};

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};

export const subscribeContactSubmissions = (callback: (data: ContactSubmission[]) => void) => {
  getContactSubmissions().then(callback);

  const channel = supabase
    .channel('contacts-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, () => {
      getContactSubmissions().then(callback);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

// ── Order Submissions ──

export const submitOrderForm = async (data: {
  name: string;
  email: string;
  phone: string;
  book_title: string;
  quantity: number;
  notes: string;
  price?: string;
}) => {
  const { error } = await supabase.from('order_submissions').insert({ ...data, status: 'new' });
  if (error) throw error;
};

export const getOrderSubmissions = async (): Promise<OrderSubmission[]> => {
  const { data } = await supabase
    .from('order_submissions')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
};

export const subscribeOrderSubmissions = (callback: (data: OrderSubmission[]) => void) => {
  getOrderSubmissions().then(callback);

  const channel = supabase
    .channel('orders-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'order_submissions' }, () => {
      getOrderSubmissions().then(callback);
    })
    .subscribe();

  return () => { supabase.removeChannel(channel); };
};

// ── Generic status update ──

export const updateSubmissionStatus = async (
  table: 'contact_submissions' | 'order_submissions',
  id: string,
  updates: Record<string, any>,
) => {
  const { error } = await supabase.from(table).update(updates).eq('id', id);
  if (error) throw error;
};

export const deleteSubmission = async (
  table: 'contact_submissions' | 'order_submissions',
  id: string,
) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
};

// ── Storage ──

export const uploadImage = async (file: File, folder: string): Promise<string> => {
  const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
  const path = `${folder}/${safeName}`;

  const { error } = await supabase.storage.from('images').upload(path, file);
  if (error) throw error;

  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
};
