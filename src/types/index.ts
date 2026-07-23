export type ContentType = {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  visionText: string;
  missionText: string;
  founderNote: string;
  email: string;
  whatsapp: string;
  instagram: string;
};

export type Book = {
  id: string;
  title: string;
  author?: string;
  description: string;
  price?: string;
  cta_label?: string;
  image_url?: string;
  featured?: boolean;
  status?: string;
  created_at?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  category?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  created_at?: string;
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  status?: string;
  admin_reply?: string;
  resolved_at?: string;
  created_at?: string;
};

export type OrderSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  book_title: string;
  quantity: number;
  notes?: string;
  price?: string;
  status?: string;
  admin_reply?: string;
  resolved_at?: string;
  created_at?: string;
};

export type TabKey = 'content' | 'books' | 'blogs' | 'contact' | 'orders';
