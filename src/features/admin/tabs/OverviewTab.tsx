import { useMemo } from 'react';
import {
  BookOpen,
  Inbox,
  MessageSquare,
  PenSquare,
  Plus,
  ShoppingBag,
} from 'lucide-react';
import { EmptyState, Panel, StatCard, StatusBadge } from '../components/primitives';
import { btnSecondary } from '../ui';
import { formatRelativeTime } from '../../../lib/utils';
import type { BlogPost, Book, ContactSubmission, OrderSubmission, TabKey } from '../../../types';

type ActivityEntry = {
  id: string;
  kind: 'contact' | 'order' | 'book' | 'blog';
  title: string;
  subtitle: string;
  status?: string;
  at?: string;
  tab: TabKey;
};

const kindIcon = {
  contact: MessageSquare,
  order: ShoppingBag,
  book: BookOpen,
  blog: PenSquare,
} as const;

const kindAccent = {
  contact: 'bg-amber-50 text-amber-600',
  order: 'bg-emerald-50 text-emerald-600',
  book: 'bg-primary-50 text-primary-600',
  blog: 'bg-blue-50 text-blue-600',
} as const;

type OverviewTabProps = {
  books: Book[];
  blogPosts: BlogPost[];
  contactSubmissions: ContactSubmission[];
  orderSubmissions: OrderSubmission[];
  onNavigate: (tab: TabKey) => void;
};

export default function OverviewTab({
  books,
  blogPosts,
  contactSubmissions,
  orderSubmissions,
  onNavigate,
}: OverviewTabProps) {
  const openContacts = contactSubmissions.filter((s) => s.status !== 'resolved').length;
  const openOrders = orderSubmissions.filter(
    (o) => o.status !== 'fulfilled' && o.status !== 'resolved',
  ).length;
  const featuredBooks = books.filter((b) => b.featured).length;

  const activity = useMemo<ActivityEntry[]>(() => {
    const entries: ActivityEntry[] = [
      ...contactSubmissions.map((item) => ({
        id: `contact-${item.id}`,
        kind: 'contact' as const,
        title: item.name,
        subtitle: item.message,
        status: item.status,
        at: item.created_at,
        tab: 'contact' as TabKey,
      })),
      ...orderSubmissions.map((item) => ({
        id: `order-${item.id}`,
        kind: 'order' as const,
        title: `${item.name} — ${item.book_title}`,
        subtitle: `Quantity ${item.quantity}${item.price ? ` · ${item.price}` : ''}`,
        status: item.status,
        at: item.created_at,
        tab: 'orders' as TabKey,
      })),
      ...books.map((item) => ({
        id: `book-${item.id}`,
        kind: 'book' as const,
        title: item.title,
        subtitle: item.author ? `Book by ${item.author}` : 'Book added',
        at: item.created_at,
        tab: 'books' as TabKey,
      })),
      ...blogPosts.map((item) => ({
        id: `blog-${item.id}`,
        kind: 'blog' as const,
        title: item.title,
        subtitle: item.category || 'Reflection',
        at: item.created_at,
        tab: 'blogs' as TabKey,
      })),
    ];

    return entries
      .sort((a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime())
      .slice(0, 8);
  }, [books, blogPosts, contactSubmissions, orderSubmissions]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={MessageSquare}
          label="Messages"
          value={openContacts}
          hint={`${contactSubmissions.length} received in total`}
          accent="bg-amber-50 text-amber-600"
          onClick={() => onNavigate('contact')}
        />
        <StatCard
          icon={ShoppingBag}
          label="Orders"
          value={openOrders}
          hint={`${orderSubmissions.length} requested in total`}
          accent="bg-emerald-50 text-emerald-600"
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          icon={BookOpen}
          label="Books"
          value={books.length}
          hint={`${featuredBooks} shown on the website`}
          accent="bg-primary-50 text-primary-600"
          onClick={() => onNavigate('books')}
        />
        <StatCard
          icon={PenSquare}
          label="Blog posts"
          value={blogPosts.length}
          hint="Published reflections"
          accent="bg-blue-50 text-blue-600"
          onClick={() => onNavigate('blogs')}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <Panel
          title="Recent activity"
          description="The latest submissions and content across the site"
          bodyClassName="p-0"
        >
          {activity.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={Inbox}
                title="Nothing here yet"
                description="Messages, orders, books and blog posts will show up here as they come in."
              />
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {activity.map((entry) => {
                const Icon = kindIcon[entry.kind];
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(entry.tab)}
                      className="flex w-full items-start gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${kindAccent[entry.kind]}`}
                      >
                        <Icon size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-gray-900">{entry.title}</p>
                          {entry.status && <StatusBadge status={entry.status} />}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-gray-500">{entry.subtitle}</p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap pt-0.5 text-[11px] text-gray-400">
                        {formatRelativeTime(entry.at)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Quick actions" description="Jump straight into a task">
            <div className="space-y-2">
              <button type="button" onClick={() => onNavigate('books')} className={btnSecondary + ' w-full justify-start'}>
                <Plus size={15} />
                Add a new book
              </button>
              <button type="button" onClick={() => onNavigate('blogs')} className={btnSecondary + ' w-full justify-start'}>
                <PenSquare size={15} />
                Write a blog post
              </button>
              <button type="button" onClick={() => onNavigate('content')} className={btnSecondary + ' w-full justify-start'}>
                <BookOpen size={15} />
                Edit website copy
              </button>
            </div>
          </Panel>

          <Panel title="Needs attention">
            {openContacts + openOrders === 0 ? (
              <p className="text-sm text-gray-500">
                You&rsquo;re all caught up — every message and order has been handled.
              </p>
            ) : (
              <ul className="space-y-2.5 text-sm">
                {openContacts > 0 && (
                  <li className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-3.5 py-2.5">
                    <span className="text-amber-800">Messages awaiting a reply</span>
                    <span className="font-bold tabular-nums text-amber-900">{openContacts}</span>
                  </li>
                )}
                {openOrders > 0 && (
                  <li className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3.5 py-2.5">
                    <span className="text-emerald-800">Orders to fulfil</span>
                    <span className="font-bold tabular-nums text-emerald-900">{openOrders}</span>
                  </li>
                )}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
