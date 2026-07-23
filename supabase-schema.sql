-- Beyond Blooming Minds — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database.

-- ════════════════════════════════════════
-- 1. CMS Content (single-row settings)
-- ════════════════════════════════════════

create table if not exists cms_content (
  id text primary key default 'main',
  "heroTitle" text not null default 'Growing Minds, Hearts & Spirits',
  "heroSubtitle" text not null default '',
  "aboutText" text not null default '',
  "visionText" text not null default '',
  "missionText" text not null default '',
  "founderNote" text not null default '',
  email text not null default '',
  whatsapp text not null default '',
  instagram text not null default '',
  updated_at timestamptz default now()
);

alter table cms_content enable row level security;
create policy "Public read cms" on cms_content for select using (true);
create policy "Auth update cms" on cms_content for update using (auth.role() = 'authenticated');
create policy "Auth insert cms" on cms_content for insert with check (auth.role() = 'authenticated');

-- Seed the default row
insert into cms_content (id, "heroTitle", "heroSubtitle", "aboutText", "visionText", "missionText", "founderNote", email, whatsapp, instagram)
values (
  'main',
  'Growing Minds, Hearts & Spirits',
  'Supporting mental, emotional, and spiritual wellbeing through holistic care, blending modern psychology with Islamic principles.',
  'Beyond Blooming Minds supports mental, emotional, and spiritual wellbeing through psycho-education, psycho-social support, holistic care, and advocacy.',
  'To create a community where individuals and families flourish emotionally, mentally, and spiritually.',
  'To provide accessible psycho-education, psycho-social support, and holistic wellness programs.',
  'I started Beyond Blooming Minds because I saw how many people were struggling silently.',
  'email@example.com',
  '+1234567890',
  '@beyondbloomingminds'
) on conflict (id) do nothing;

-- ════════════════════════════════════════
-- 2. Books
-- ════════════════════════════════════════

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  description text not null default '',
  price text,
  cta_label text default 'Order now',
  image_url text,
  featured boolean default true,
  status text default 'Available now',
  created_at timestamptz default now()
);

alter table books enable row level security;
create policy "Public read books" on books for select using (true);
create policy "Auth manage books" on books for all using (auth.role() = 'authenticated');

-- ════════════════════════════════════════
-- 3. Blog Posts
-- ════════════════════════════════════════

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text default 'Reflection',
  excerpt text,
  content text,
  image_url text,
  created_at timestamptz default now()
);

alter table blog_posts enable row level security;
create policy "Public read blog" on blog_posts for select using (true);
create policy "Auth manage blog" on blog_posts for all using (auth.role() = 'authenticated');

-- ════════════════════════════════════════
-- 4. Contact Submissions
-- ════════════════════════════════════════

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text default 'new',
  admin_reply text,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

alter table contact_submissions enable row level security;
create policy "Public insert contacts" on contact_submissions for insert with check (true);
create policy "Auth read contacts" on contact_submissions for select using (auth.role() = 'authenticated');
create policy "Auth update contacts" on contact_submissions for update using (auth.role() = 'authenticated');

-- ════════════════════════════════════════
-- 5. Order Submissions
-- ════════════════════════════════════════

create table if not exists order_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  book_title text not null,
  quantity integer default 1,
  notes text,
  price text,
  status text default 'new',
  admin_reply text,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

alter table order_submissions enable row level security;
create policy "Public insert orders" on order_submissions for insert with check (true);
create policy "Auth read orders" on order_submissions for select using (auth.role() = 'authenticated');
create policy "Auth update orders" on order_submissions for update using (auth.role() = 'authenticated');

-- ════════════════════════════════════════
-- 6. Storage bucket
-- ════════════════════════════════════════
-- Create a public bucket called "images" in the Supabase dashboard
-- with folders: book-covers/ and blog-images/
-- Set the bucket to public so getPublicUrl works.

-- ════════════════════════════════════════
-- 7. Enable Realtime
-- ════════════════════════════════════════

alter publication supabase_realtime add table cms_content;
alter publication supabase_realtime add table books;
alter publication supabase_realtime add table blog_posts;
alter publication supabase_realtime add table contact_submissions;
alter publication supabase_realtime add table order_submissions;
