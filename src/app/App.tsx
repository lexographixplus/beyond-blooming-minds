import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import SiteLayout from '../components/SiteLayout';
import ScrollToTop from '../components/ScrollToTop';
import Hero from '../features/home/Hero';
import About from '../features/home/About';
import Approach from '../features/home/Approach';
import Psychoeducation from '../features/home/Psychoeducation';
import Services from '../features/home/Services';
import BooksPreview from '../features/books/BooksPreview';
import BlogPreview from '../features/blog/BlogPreview';
import Founder from '../features/home/Founder';
import ContactForm from '../features/contact/ContactForm';
import { CmsProvider } from '../context/CmsContext';
import { assets } from '../lib/siteContent';

const Admin = lazy(() => import('../pages/Admin'));
const BooksPage = lazy(() => import('../pages/Books'));
const BlogPage = lazy(() => import('../pages/Blog'));
const BlogPostPage = lazy(() => import('../pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));
const NotFound = lazy(() => import('../pages/NotFound'));

function PublicHome() {
  return (
    <SiteLayout offsetNavbar={false}>
      <Hero />
      <About />
      <Approach />
      <Psychoeducation />
      <Services />
      <BooksPreview />
      <BlogPreview />
      <Founder />
      <ContactForm />
    </SiteLayout>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin-slow" />
        <img src={assets.logo} alt="" className="h-14 w-14 rounded-xl object-cover" />
      </div>
      <div className="text-center">
        <p className="font-serif text-xl text-gray-900">Beyond Blooming Minds</p>
        <p className="mt-1 animate-pulse text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <HashRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </CmsProvider>
  );
}
