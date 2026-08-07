import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { assets } from '../../../lib/siteContent';
import { cn } from '../../../lib/utils';
import type { TabKey } from '../../../types';

export type NavItem = {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  count?: number;
  /** Renders the count as an attention badge rather than a muted total. */
  highlight?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

type AdminShellProps = {
  groups: NavGroup[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  title: string;
  description: string;
  actions?: ReactNode;
  userEmail: string;
  userName: string;
  onSignOut: () => void;
  children: ReactNode;
};

export default function AdminShell({
  groups,
  activeTab,
  onTabChange,
  title,
  description,
  actions,
  userEmail,
  userName,
  onSignOut,
  children,
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // The live site lives at the app's base path — "/" would leave the
  // GitHub Pages subdirectory entirely.
  const siteUrl = import.meta.env.BASE_URL || '/';
  const initial = (userName || userEmail || 'A').charAt(0).toUpperCase();

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeTab]);

  const navigation = (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onTabChange(item.key)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-primary-50 font-semibold text-primary-700'
                      : 'font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-600" />
                  )}
                  <Icon size={17} className={active ? 'text-primary-600' : 'text-gray-400'} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                        item.highlight
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200',
                      )}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const userFooter = (
    <div className="border-t border-gray-200 p-3">
      <div className="flex items-center gap-3 rounded-lg px-2 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-gray-900">{userName}</p>
          <p className="truncate text-[11px] text-gray-400">{userEmail}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Sign out"
          title="Sign out"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
          <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5">
            <img src={assets.logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">Beyond Blooming</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">Dashboard</p>
            </div>
          </div>
          {navigation}
          {userFooter}
        </aside>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-gray-900/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            >
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.22 }}
                className="flex h-full w-72 flex-col bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
                  <div className="flex items-center gap-2.5">
                    <img src={assets.logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
                    <p className="text-sm font-bold text-gray-900">Dashboard</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close menu"
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                {navigation}
                {userFooter}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-md">
            <div className="flex min-h-16 flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open menu"
                className="-ml-1 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold text-gray-900">{title}</h1>
                <p className="truncate text-xs text-gray-500">{description}</p>
              </div>

              <div className="flex items-center gap-2">
                {actions}
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="hidden sm:inline">View site</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
