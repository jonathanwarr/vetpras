'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import ButtonSecondary from '@/components/ui/button-secondary';

const navigation = [
  { name: 'Submit Bill', href: '/submit-bill' },
  { name: 'Submit Feedback', href: '/submit-feedback' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 z-50 w-full">
      {/* 👇 Hide entire nav bar while mobile menu is open to prevent icon overlap */}
      {!mobileMenuOpen && (
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
          aria-label="Global"
        >
          {/* Logo + Desktop Nav */}
          <div className="flex items-center gap-x-12">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Vetpras</span>
              <img src="/images/vetpras-icon.png" alt="Vetpras icon" className="h-16 w-auto" />
            </Link>
            <div className="hidden lg:flex lg:gap-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-900"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex">
            <ButtonSecondary href="/clinics" size="xs">
              Search Vets →
            </ButtonSecondary>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}

      {/* Mobile Menu Drawer */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            {/* Drawer Logo */}
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <img src="/images/vetpras-icon.png" alt="Vetpras icon" className="h-10 w-auto" />
            </Link>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-200">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <ButtonSecondary
                  href="/clinics"
                  size="md"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Search Vets →
                </ButtonSecondary>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
