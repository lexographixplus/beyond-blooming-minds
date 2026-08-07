import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import WhatsAppWidget from './WhatsAppWidget';
import { cn } from '../lib/utils';

type SiteLayoutProps = {
  children: ReactNode;
  /**
   * Pads the main area to clear the fixed navbar. Pages whose first section is
   * a full-bleed dark hero (the home page) set this to false.
   */
  offsetNavbar?: boolean;
};

export default function SiteLayout({ children, offsetNavbar = true }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white selection:bg-primary-200 selection:text-primary-900">
      <Navbar />
      <main className={cn('flex-1', offsetNavbar && 'pt-16 lg:pt-[72px]')}>{children}</main>
      <Footer />
      <BackToTop />
      <WhatsAppWidget />
    </div>
  );
}
