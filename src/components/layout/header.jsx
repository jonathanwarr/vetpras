'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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
      <nav className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-12'>
        <div className='flex h-20 sm:h-24 items-center justify-between'>
          {/* Logo */}
          <Link href="/" className='flex items-center gap-3'>
            <Image
              src='/images/vetpras-logo.svg'
              alt='Vetpras'
              width={40}
              height={40}
              className='h-9 sm:h-10 w-auto'
            />
            <span className='text-xl sm:text-2xl font-normal text-slate-900'>Vetpras</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className='hidden md:flex items-center gap-6 lg:gap-8'>
            <Link href='/' className='text-slate-900/90 hover:text-slate-900 transition-colors text-sm lg:text-base font-medium'>
              Home
            </Link>
            <Link href='/blog' className='text-slate-900/90 hover:text-slate-900 transition-colors text-sm lg:text-base font-medium'>
              Blog
            </Link>
            <Link href='/submit-bill' className='text-blue-600 hover:text-blue-700 transition-colors text-sm lg:text-base font-medium flex items-center gap-1.5'>
              <DocumentTextIcon className='h-4 w-4 lg:h-5 lg:w-5' />
              Share a Bill
            </Link>
            <Link href='/search' className='rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 px-5 lg:px-6 py-2.5 text-white hover:from-blue-700 hover:to-blue-700 transition-all duration-200 text-sm lg:text-base font-bold shadow-md shadow-blue-900/40'>
              Find a Vet
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden flex flex-col gap-1.5 p-2 cursor-pointer'
            aria-label='Toggle menu'
          >
            <div className='w-8 h-1 bg-slate-900 rounded-full' />
            <div className='w-8 h-1 bg-slate-900 rounded-full' />
            <div className='w-8 h-1 bg-slate-900 rounded-full' />
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-50 z-50">
          {/* Mobile Menu Header */}
          <div className='bg-gray-800 px-6 h-20 sm:h-24 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Image
                src='/images/vetpras-logo-white.svg'
                alt='Vetpras'
                width={40}
                height={40}
                className='h-9 sm:h-10 w-auto'
              />
              <span className='text-xl sm:text-2xl font-normal text-gray-50'>Vetpras</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className='text-gray-50 hover:text-white transition-colors cursor-pointer'
              aria-label='Close menu'
            >
              <XMarkIcon className='h-8 w-8' />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className='flex flex-col py-8 px-6 gap-6'>
            <Link
              href='/'
              className='text-gray-700 hover:text-gray-900 transition-colors text-lg font-medium py-3'
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href='/blog'
              className='text-gray-700 hover:text-gray-900 transition-colors text-lg font-medium py-3'
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href='/submit-bill'
              className='text-blue-600 hover:text-blue-700 transition-colors text-lg font-medium py-3 flex items-center gap-2'
              onClick={() => setMobileMenuOpen(false)}
            >
              <DocumentTextIcon className='h-5 w-5' />
              Share a Bill
            </Link>
            <Link
              href='/search'
              className='rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-4 text-white hover:from-blue-700 hover:to-blue-700 transition-all duration-200 text-lg font-bold text-center mt-4 shadow-md shadow-blue-900/40'
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Vet
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
