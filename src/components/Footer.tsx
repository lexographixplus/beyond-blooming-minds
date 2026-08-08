import { Facebook, Instagram, Mail, Music2, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import { assets } from '../lib/siteContent';
import { toSocialLink, toWhatsAppNumber } from '../lib/utils';

export default function Footer() {
  const { content } = useCms();

  // The contact field may hold more than one number; link the first.
  const phoneNumber = toWhatsAppNumber(content.whatsapp);
  const socialLinks = [
    {
      label: 'Instagram',
      value: content.instagram,
      href: toSocialLink('https://instagram.com', content.instagram),
      icon: Instagram,
      color: 'text-accent-400',
    },
    {
      label: 'Facebook',
      value: content.facebook,
      href: toSocialLink('https://facebook.com', content.facebook),
      icon: Facebook,
      color: 'text-secondary-400',
    },
    {
      label: 'TikTok',
      value: content.tiktok,
      href: toSocialLink('https://tiktok.com', content.tiktok, '@'),
      icon: Music2,
      color: 'text-white',
    },
  ].filter((social) => social.value?.trim() && social.href);

  return (
    <footer className="border-t border-gray-800/50 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <img src={assets.logo} alt="Beyond Blooming Minds" className="h-14 w-14 rounded-xl bg-white object-cover shadow-lg" />
              <div>
                <p className="font-serif text-2xl font-bold text-white">Beyond Blooming Minds</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Growing minds, hearts & spirits</p>
              </div>
            </div>
            <p className="mt-6 max-w-md leading-relaxed text-gray-400">
              Supporting psychoeducation, wellbeing support, and holistic growth for individuals, schools, and communities.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">Explore</h4>
            <ul className="mt-5 space-y-3 text-gray-400">
              <li><Link to="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link to="/books" className="transition-colors hover:text-white">Books</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-white">Blog</Link></li>
              <li>
                <Link
                  to="/"
                  onClick={() => setTimeout(() => document.querySelector('#psychoeducation')?.scrollIntoView({ behavior: 'smooth' }), 100)}
                  className="transition-colors hover:text-white"
                >
                  Psychoeducation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-white">Contact</h4>
            <ul className="mt-5 space-y-4 text-gray-400">
              <li>
                <a href={`mailto:${content.email}`} className="flex items-center gap-3 transition-colors hover:text-white">
                  <Mail size={16} className="text-primary-400" /><span>{content.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={phoneNumber ? `https://wa.me/${phoneNumber}` : `tel:${content.whatsapp}`}
                  target={phoneNumber ? '_blank' : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Phone size={16} className="text-primary-400" /><span>{content.whatsapp}</span>
                </a>
              </li>
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors hover:text-white">
                    <social.icon size={16} className={social.color} /><span>{social.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Beyond Blooming Minds. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
            <span className="text-gray-600">|</span>
            <span>Site created by <span className="font-medium text-white">LexoStudio</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
