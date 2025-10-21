'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import VetprasSearch from '@/components/features/vetpras-search';
import Footer from '@/components/layout/footer';
import ContentCommunity from '@/components/features/landing-page/content-community';
import ContentHowItWorks from '@/components/features/landing-page/content-how-it-works';
import CtaSimple from '@/components/features/cta-simple';
import FaqAccordion from '@/components/features/faq-accordion';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch data for search functionality
  useEffect(() => {
    async function fetchData() {
      const [{ data: clinicList, error: clinicError }, { data: serviceList, error: serviceError }] =
        await Promise.all([
          supabase.from('vet_clinics').select('*'),
          supabase
            .from('vet_services')
            .select('service, service_code, parent_code, sort_order')
            .order('sort_order', { ascending: true }),
        ]);

      if (clinicError) {
        console.error('[Supabase] Error loading clinics:', clinicError);
      } else {
        setClinics(clinicList || []);
      }

      if (serviceError) {
        console.error('[Supabase] Error loading services:', serviceError);
      } else {
        setServices(serviceList || []);
      }
    }

    fetchData();
  }, []);

  return (
    <div className='min-h-screen font-[family-name:var(--font-lora)]'>
      {/* Header/Nav */}
      <header className='absolute top-0 left-0 right-0 z-10'>
        <nav className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-12'>
          <div className='flex h-20 sm:h-24 items-center justify-between'>
            {/* Logo */}
            <div className='flex items-center gap-3'>
              <Image
                src='/images/vetpras-landing-logo.png'
                alt='Vetpras'
                width={40}
                height={40}
                className='h-9 sm:h-10 w-auto'
              />
              <span className='text-xl sm:text-2xl font-normal text-slate-50'>Vetpras</span>
            </div>

            {/* Desktop Nav Links */}
            <div className='hidden md:flex items-center gap-6 lg:gap-8'>
              <Link href='/' className='text-slate-50/90 hover:text-slate-50 transition-colors text-sm lg:text-base font-medium'>
                Home
              </Link>
              <Link href='/blog' className='text-slate-50/90 hover:text-slate-50 transition-colors text-sm lg:text-base font-medium'>
                Blog
              </Link>
              <Link href='/submit-bill' className='text-slate-50/90 hover:text-slate-50 transition-colors text-sm lg:text-base font-medium flex items-center gap-1.5'>
                <SparklesIcon className='h-4 w-4 lg:h-5 lg:w-5 text-blue-500' />
                Share a Bill
              </Link>
              <Link href='/search' className='rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-5 lg:px-6 py-2.5 text-slate-50 hover:bg-white/20 transition-all duration-200 text-sm lg:text-base font-medium'>
                Find a Vet
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden flex flex-col gap-1.5 p-2 cursor-pointer'
              aria-label='Toggle menu'
            >
              <div className='w-8 h-1 bg-white rounded-full' />
              <div className='w-8 h-1 bg-white rounded-full' />
              <div className='w-8 h-1 bg-white rounded-full' />
            </button>
          </div>
        </nav>

        {/* Mobile Menu - Full Screen Overlay */}
        <div
          className={`md:hidden fixed inset-0 bg-gray-50 z-50 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
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
          <div className='flex flex-col h-full'>
            <div className='flex-1 flex flex-col py-8 px-6 gap-6'>
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
                className='text-gray-700 hover:text-gray-900 transition-colors text-lg font-medium py-3 flex items-center gap-2'
                onClick={() => setMobileMenuOpen(false)}
              >
                <SparklesIcon className='h-5 w-5 text-blue-500' />
                Share a Bill
              </Link>
              <Link
                href='/search'
                className='rounded-lg bg-blue-500 px-6 py-4 text-white hover:bg-blue-600 transition-all duration-200 text-lg font-medium text-center mt-4'
                onClick={() => setMobileMenuOpen(false)}
              >
                Find a Vet
              </Link>
            </div>

            {/* Footer in Mobile Menu */}
            <Footer />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className='relative h-screen min-h-[700px] sm:min-h-[800px]'>
        {/* Background Image */}
        <div className='absolute inset-0'>
          <Image
            src='/images/vetpras-hero.png'
            alt='Happy pet owner with dog'
            fill
            className='object-cover object-[65%_60%] sm:object-[center_65%] lg:object-[center_60%]'
            priority
          />
          {/* Sophisticated gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900/75 via-gray-900/50 to-gray-900/30' />
        </div>

        {/* Hero Content */}
        <div className='relative h-full flex flex-col'>
          {/* Text Content - Vertically Centered */}
          <div className='flex-1 flex items-center pt-20'>
            <div className='w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12'>
              <div className='max-w-2xl lg:max-w-3xl'>
                {/* Heading */}
                <h1 className='hero-heading text-white mb-5 sm:mb-6 lg:mb-8'>
                  Find & Compare Vet Costs Near You
                </h1>

                {/* Subheading */}
                <p className='hero-subheading text-gray-100 max-w-xl'>
                  Compare prices from local clinics and make informed decisions about your pet's health.
                </p>
              </div>
            </div>
          </div>

          {/* Search Section - Bottom Positioned */}
          <div className='pb-20 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28'>
            <div className='w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12'>
              <div className='flex flex-col items-start sm:items-center w-full max-w-4xl mx-auto'>
                {/* Beta Notice */}
                <div className='mb-3 min-[1440px]:mb-5 min-[1920px]:mb-6 w-full max-w-4xl pl-6 sm:pl-8'>
                  <p className='text-white/80 text-sm sm:text-base italic text-left'>
                    Currently in beta — search limited to select areas in Greater Vancouver
                  </p>
                </div>

                {/* Search Bar */}
                <VetprasSearch clinics={clinics} services={services} className='w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Content Section */}
      <ContentCommunity />

      {/* CTA Section */}
      <CtaSimple />

      {/* How It Works Section */}
      <ContentHowItWorks />

      {/* FAQ Section */}
      <FaqAccordion />

      {/* Final CTA Section */}
      <CtaSimple />

      {/* Footer */}
      <Footer />
    </div>
  );
}
