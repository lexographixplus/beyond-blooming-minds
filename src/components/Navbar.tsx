import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { assets } from '../lib/siteContent';

const homeLinks = [
  { name: 'About', href: '#about' },
  { name: 'Approach', href: '#approach' },
  { name: 'Psychoeducation', href: '#psychoeducation' },
  { name: 'Books', href: '#books' },
  { name: 'Blog', href: '#blog' },
];

const pageLinks = [
  { name: 'Home', href: '/' },
  { name: 'Books', href: '/books' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navLinks = isHome ? homeLinks : pageLinks;
  const isTransparent = isHome && !scrolled && !isOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b transition-all duration-300 ${
        isTransparent
          ? 'border-transparent bg-transparent'
          : 'border-gray-200/60 bg-white/80 backdrop-blur-xl shadow-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={assets.logo} alt="Beyond Blooming Minds logo" className="h-10 w-10 rounded-xl object-cover shadow-md" />
          <div className="hidden sm:block">
            <p className={`font-serif text-lg font-bold transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-gray-900'}`}>
              Beyond Blooming Minds
            </p>
            <p className={`text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${isTransparent ? 'text-white/50' : 'text-primary-500'}`}>
              Holistic care
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) =>
            link.href.startsWith('#') ? (
              <a key={link.name} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >{link.name}</a>
            ) : (
              <Link key={link.name} to={link.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isTransparent ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >{link.name}</Link>
            ),
          )}

          <a
            href="#contact"
            onClick={(e) => handleAnchorClick(e, '#contact')}
            className="ml-3 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md hover:shadow-primary-500/25"
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={() => setIsOpen((p) => !p)}
            className={`rounded-lg p-2 transition-colors ${isTransparent ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 bg-white md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navLinks.map((link) =>
                link.href.startsWith('#') ? (
                  <a key={link.name} href={link.href} onClick={(e) => handleAnchorClick(e, link.href)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >{link.name}</a>
                ) : (
                  <Link key={link.name} to={link.href} onClick={() => setIsOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
                  >{link.name}</Link>
                ),
              )}
              <a href="#contact" onClick={(e) => handleAnchorClick(e, '#contact')}
                className="mt-2 rounded-xl bg-primary-600 px-4 py-3 text-center text-base font-semibold text-white"
              >Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
