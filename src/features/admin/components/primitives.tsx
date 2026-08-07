import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { card, field } from '../ui';

/* ── Panel ────────────────────────────────────────────────────────────── */

export function Panel({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn(card, className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-gray-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}

/* ── Empty state ──────────────────────────────────────────────────────── */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-300 shadow-sm">
        <Icon size={22} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ── Status badge ─────────────────────────────────────────────────────── */

const statusStyles: Record<string, string> = {
  new: 'bg-primary-50 text-primary-700 ring-primary-200',
  read: 'bg-blue-50 text-blue-700 ring-blue-200',
  responded: 'bg-amber-50 text-amber-700 ring-amber-200',
  contacted: 'bg-amber-50 text-amber-700 ring-amber-200',
  'in-progress': 'bg-amber-50 text-amber-700 ring-amber-200',
  fulfilled: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export function StatusBadge({ status }: { status?: string }) {
  const key = status || 'new';
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset',
        statusStyles[key] ?? 'bg-gray-100 text-gray-600 ring-gray-200',
      )}
    >
      {key.replace(/-/g, ' ')}
    </span>
  );
}

/* ── Search input ─────────────────────────────────────────────────────── */

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={field + ' pl-9'}
      />
    </div>
  );
}

/* ── Stat card ────────────────────────────────────────────────────────── */

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint: string;
  accent: string;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        card,
        'flex items-start gap-4 p-5 text-left transition-all',
        onClick && 'hover:border-primary-200 hover:shadow-md',
      )}
    >
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', accent)}>
        <Icon size={19} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">{label}</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">{value}</p>
        <p className="mt-0.5 truncate text-xs text-gray-400">{hint}</p>
      </div>
    </Wrapper>
  );
}
