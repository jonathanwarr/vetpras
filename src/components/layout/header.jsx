'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [isSticky, setSticky] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keep sticky header; remove hash scroll + router logic
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isSticky ? 'bg-white/60 shadow-sm backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="/" className="flex items-center">
          <img src="/images/vetpras-logo.svg" alt="Vetpras Logo" className="h-12 w-12" />
          <span
            className="ml-2 text-xl font-semibold text-slate-900"
            style={{ fontFamily: 'Amiri, serif' }}
          >
            Vetpras
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-10 font-sans text-xs font-bold text-slate-900 uppercase md:flex">
          <a href="/about-us" className="hover:text-blue-600">
            Our Mission
          </a>
          <a href="/blog" className="hover:text-blue-600">
            Blog
          </a>
          <a href="/submit-bill" className="hover:text-blue-600">
            Submit a Bill
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-900 hover:text-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none focus:ring-inset"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
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
        <div
          id="mobile-menu"
          className="absolute top-full left-0 w-full bg-slate-50 shadow-md md:hidden"
        >
          <div className="flex flex-col items-start space-y-4 p-6 text-sm font-semibold text-slate-900">
            <a
              href="/about-us"
              className="hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Mission
            </a>
            <a
              href="/blog"
              className="hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </a>
            <a
              href="/submit-bill"
              className="hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Submit a Bill
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
