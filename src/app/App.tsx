import { HashRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../features/home/Hero';
import About from '../features/home/About';
import Approach from '../features/home/Approach';
import Psychoeducation from '../features/home/Psychoeducation';
import Services from '../features/home/Services';
import BooksPreview from '../features/books/BooksPreview';
import BlogPreview from '../features/blog/BlogPreview';
import Founder from '../features/home/Founder';
import ContactForm from '../features/contact/ContactForm';
import Footer from '../components/Footer';
import { CmsProvider } from '../context/CmsContext';
import { assets } from '../lib/siteContent';

const Admin = lazy(() => import('../pages/Admin'));
const BooksPage = lazy(() => import('../pages/Books'));
const BlogPage = lazy(() => import('../pages/Blog'));

function PublicHome() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white selection:bg-primary-200 selection:text-primary-900">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Approach />
        <Psychoeducation />
        <Services />
        <BooksPreview />
        <BlogPreview />
        <Founder />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <HashRouter>
        <Suspense
          fallback={
            <div className="flex min-h-screen flex-col items-center justify-center bg-white gap-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-20 w-20 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin-slow" />
                <img src={assets.logo} alt="" className="h-14 w-14 rounded-xl object-cover" />
              </div>
              <div className="text-center">
                <p className="font-serif text-xl text-gray-900">Beyond Blooming Minds</p>
                <p className="mt-1 text-sm text-gray-400 animate-pulse">Loading...</p>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<PublicHome />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </CmsProvider>
  );
}
