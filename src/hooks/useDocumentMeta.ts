import { useEffect } from 'react';

/**
 * Per-page title, description and sharing tags.
 *
 * index.html carries the site-wide defaults; each route calls this to describe
 * itself so browser tabs, history, bookmarks and search results tell the pages
 * apart. Note that social scrapers (WhatsApp, Facebook) do not run JavaScript,
 * so they only ever see the defaults in index.html — per-page sharing cards
 * need pre-rendered pages, which is tracked separately.
 */

export const SITE_URL = 'https://beyondbloomingminds.org';
const SITE_NAME = 'Beyond Blooming Minds';
const DEFAULT_TITLE = `${SITE_NAME} — Holistic Care`;
const DEFAULT_DESCRIPTION =
  'Supporting mental, emotional, and spiritual wellbeing through holistic care, blending modern psychology with Islamic principles.';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

type DocumentMeta = {
  /** Page name on its own — the site name is appended automatically. */
  title?: string;
  description?: string;
  /** Absolute URL, or a site-root path such as "/logo.png". */
  image?: string;
};

/** Meta and link tags are created on first use, then reused across routes. */
function setTag(selector: string, create: () => HTMLElement, attribute: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

function setMeta(kind: 'name' | 'property', key: string, value: string) {
  setTag(
    `meta[${kind}="${key}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute(kind, key);
      return el;
    },
    'content',
    value,
  );
}

/**
 * Descriptions are often lifted from article excerpts, which carry line breaks
 * and run long. Collapse the whitespace and cut at a word boundary so the
 * search snippet reads as a sentence rather than a fragment.
 */
function toSnippet(value: string, limit = 155) {
  const flat = value.replace(/\s+/g, ' ').trim();
  if (flat.length <= limit) return flat;
  const cut = flat.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
}

export function useDocumentMeta({ title, description, image }: DocumentMeta) {
  const fullTitle = title?.trim() ? `${title.trim()} — ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = description?.trim() ? toSnippet(description) : DEFAULT_DESCRIPTION;
  const img = image?.startsWith('http') ? image : `${SITE_URL}${image ?? '/logo.png'}`;

  useEffect(() => {
    const url = `${SITE_URL}${window.location.pathname}`;

    document.title = fullTitle;
    setMeta('name', 'description', desc);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:image', img || DEFAULT_IMAGE);
    setMeta('property', 'og:url', url);

    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img || DEFAULT_IMAGE);

    setTag(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        return el;
      },
      'href',
      url,
    );
  }, [fullTitle, desc, img]);
}
