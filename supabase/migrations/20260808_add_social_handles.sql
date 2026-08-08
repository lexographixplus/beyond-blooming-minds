-- Add Facebook and TikTok handles to the existing CMS settings row.
-- Safe to run more than once.

alter table public.cms_content
  add column if not exists facebook text not null default '';

alter table public.cms_content
  add column if not exists tiktok text not null default '';
