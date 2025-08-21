'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const [isSticky, setSticky] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;

      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);

    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  const handleNavClick = (e, anchor) => {
    if (pathname !== '/') {
      e.preventDefault();
      router.push(`/#${anchor}`);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isSticky ? 'bg-white/60 shadow-sm backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="flex items-center">
          <img src="/images/vetpras-icon.png" alt="Vetpras Logo" className="h-12 w-12" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-10 font-sans text-xs font-bold text-slate-900 uppercase md:flex">
          <a
            href={pathname === '/' ? '#how-it-works' : '/'}
            onClick={(e) => handleNavClick(e, 'how-it-works')}
            className="hover:text-blue-600"
          >
            How it Works
          </a>
          <a
            href={pathname === '/' ? '#faq' : '/'}
            onClick={(e) => handleNavClick(e, 'faq')}
            className="hover:text-blue-600"
          >
            FAQ
          </a>
          <a href="/submit-bill" className="hover:text-blue-600">
            Submit a Bill
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="/clinics"
            className="focus-visible:outline-primary inline-block transform rounded-lg border bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white uppercase shadow-md transition-transform hover:scale-95 hover:bg-blue-700 hover:from-blue-500 hover:to-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Search Vets
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-900 hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none focus:ring-inset"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-50 shadow-md md:hidden">
          <div className="flex flex-col items-start space-y-4 p-6 text-sm font-semibold text-slate-900">
            <a
              href={pathname === '/' ? '#how-it-works' : '/'}
              onClick={(e) => {
                handleNavClick(e, 'how-it-works');
                setMobileMenuOpen(false);
              }}
              className="hover:text-blue-600"
            >
              How it Works
            </a>
            <a
              href={pathname === '/' ? '#faq' : '/'}
              onClick={(e) => {
                handleNavClick(e, 'faq');
                setMobileMenuOpen(false);
              }}
              className="hover:text-blue-600"
            >
              FAQ
            </a>
            <a
              href="/submit-bill"
              className="hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Submit a Bill
            </a>
            <a
              href="/clinics"
              className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search Vets
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
