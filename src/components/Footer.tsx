import { Instagram, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCms } from '../context/CmsContext';
import { assets } from '../lib/siteContent';

export default function Footer() {
  const { content } = useCms();

  return (
    <footer id="contact" className="border-t border-gray-800/50 bg-gray-950 text-gray-300">
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
              <li><a href="/#psychoeducation" className="transition-colors hover:text-white">Psychoeducation</a></li>
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
                <a href={`tel:${content.whatsapp}`} className="flex items-center gap-3 transition-colors hover:text-white">
                  <Phone size={16} className="text-primary-400" /><span>{content.whatsapp}</span>
                </a>
              </li>
              <li>
                <a href={`https://instagram.com/${content.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors hover:text-white">
                  <Instagram size={16} className="text-accent-400" /><span>{content.instagram}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Beyond Blooming Minds. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
