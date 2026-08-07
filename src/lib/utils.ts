/**
 * Small shared helpers used across the public site and the dashboard.
 */

/** Strip HTML tags and decode the handful of entities Quill emits. */
export function stripHtml(html: string) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Rough reading time in minutes for a block of rich-text HTML. */
export function estimateReadTime(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "12 March 2026" — used on blog cards and article headers. */
export function formatDate(value?: string | null, style: 'long' | 'short' = 'long') {
  if (!value) return 'Draft';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Draft';
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
}

/** "12 Mar 2026, 14:30" — used in the dashboard lists. */
export function formatDateTime(value?: string | null) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** "3 hours ago" — relative time for the dashboard activity feed. */
export function formatRelativeTime(value?: string | null) {
  if (!value) return 'just now';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return 'just now';

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';

  // Largest unit that the elapsed time fills at least once wins.
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  const [unit, divisor] = units.find(([, size]) => seconds >= size) ?? units[units.length - 1];

  return new Intl.RelativeTimeFormat('en-GB', { numeric: 'auto' }).format(
    -Math.floor(seconds / divisor),
    unit,
  );
}

/** Turn a post title into a URL-safe slug. */
export function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Normalise a phone number for wa.me links: digits only, no leading +.
 *
 * The contact field often holds more than one number ("3822722 / 2584848"),
 * so split on common separators and use the first usable entry rather than
 * concatenating them into one invalid number.
 *
 * Returns an empty string when there is nothing usable.
 */
export function toWhatsAppNumber(raw?: string | null) {
  if (!raw) return '';

  const candidates = raw
    .split(/[/,;]|\bor\b|\band\b/i)
    .map((part) => part.replace(/[^\d]/g, ''))
    .filter((digits) => digits.length >= 7);

  return candidates[0] ?? '';
}

/** Join class names, skipping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
