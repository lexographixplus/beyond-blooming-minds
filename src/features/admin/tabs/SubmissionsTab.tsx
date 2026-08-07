import { useMemo, useState } from 'react';
import { Inbox, Trash2 } from 'lucide-react';
import { EmptyState, Panel, SearchInput, StatusBadge } from '../components/primitives';
import { iconBtn } from '../ui';
import { cn, formatRelativeTime, stripHtml } from '../../../lib/utils';
import type { ContactSubmission, OrderSubmission } from '../../../types';

type SubmissionKind = 'contact' | 'order';

const filters: Record<SubmissionKind, { key: string; label: string; match: (status?: string) => boolean }[]> = {
  contact: [
    { key: 'all', label: 'All', match: () => true },
    { key: 'open', label: 'Awaiting', match: (s) => s !== 'resolved' },
    { key: 'resolved', label: 'Resolved', match: (s) => s === 'resolved' },
  ],
  order: [
    { key: 'all', label: 'All', match: () => true },
    { key: 'open', label: 'In progress', match: (s) => s !== 'resolved' && s !== 'fulfilled' },
    { key: 'done', label: 'Fulfilled', match: (s) => s === 'resolved' || s === 'fulfilled' },
  ],
};

type SubmissionsTabProps<T> = {
  kind: SubmissionKind;
  items: T[];
  onOpen: (item: T) => void;
  onDelete: (item: T) => void;
  selectedId?: string;
};

export default function SubmissionsTab<T extends ContactSubmission | OrderSubmission>({
  kind,
  items,
  onOpen,
  onDelete,
  selectedId,
}: SubmissionsTabProps<T>) {
  const [search, setSearch] = useState('');
  const [filterKey, setFilterKey] = useState('all');

  const activeFilter = filters[kind].find((f) => f.key === filterKey) ?? filters[kind][0];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      if (!activeFilter.match(item.status)) return false;
      if (!query) return true;

      const haystack = [
        item.name,
        item.email,
        'message' in item ? item.message : '',
        'book_title' in item ? item.book_title : '',
        'phone' in item ? item.phone : '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [items, search, activeFilter]);

  const noun = kind === 'contact' ? 'message' : 'order request';

  return (
    <Panel
      title={kind === 'contact' ? `Messages (${items.length})` : `Order requests (${items.length})`}
      description={
        kind === 'contact'
          ? 'Open a message to reply and update its status.'
          : 'Open a request to record progress and contact the customer.'
      }
      bodyClassName="p-0"
      action={
        items.length > 0 ? (
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={`Search ${noun}s`}
            className="w-full sm:w-56"
          />
        ) : undefined
      }
    >
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-gray-100 px-5 py-3">
          {filters[kind].map((filter) => {
            const count = items.filter((item) => filter.match(item.status)).length;
            const active = filter.key === filterKey;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setFilterKey(filter.key)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  active ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                )}
              >
                {filter.label}
                <span className={cn('ml-1.5 tabular-nums', active ? 'text-white/70' : 'text-gray-400')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {items.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={Inbox}
            title={kind === 'contact' ? 'No messages yet' : 'No order requests yet'}
            description={
              kind === 'contact'
                ? 'Messages sent through the contact form on your website will land here.'
                : 'Requests submitted through the book order form will land here.'
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={Inbox}
            title="Nothing to show"
            description={`No ${noun}s match the current filter or search.`}
          />
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {filtered.map((item) => {
            const isOrder = 'book_title' in item;
            const preview = isOrder
              ? `${(item as OrderSubmission).book_title} · Qty ${(item as OrderSubmission).quantity}`
              : stripHtml((item as ContactSubmission).message || '');

            return (
              <li
                key={item.id}
                className={cn(
                  'group flex items-start gap-3 px-4 py-3.5 transition-colors sm:px-5',
                  selectedId === item.id ? 'bg-primary-50/60' : 'hover:bg-gray-50',
                )}
              >
                <button
                  type="button"
                  onClick={() => onOpen(item)}
                  className="min-w-0 flex-1 text-left"
                  aria-label={`Open ${noun} from ${item.name}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-sm font-semibold text-gray-900">{item.name}</span>
                    <StatusBadge status={item.status} />
                    <span className="ml-auto shrink-0 whitespace-nowrap text-[11px] text-gray-400">
                      {formatRelativeTime(item.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">{item.email}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 sm:line-clamp-1">{preview}</p>
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className={iconBtn + ' shrink-0 hover:bg-red-50 hover:text-red-600'}
                  aria-label={`Delete ${noun} from ${item.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
