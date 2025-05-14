'use client';

import Link from 'next/link';
import ContainerConstrained from '@/components/layout/container-constrained';

export default function CTASection() {
  return (
    <section className="bg-blue-50 py-20 sm:py-28">
      <ContainerConstrained className="text-center">
        <h2 className="mb-6 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-balance">
          Help Make Vet Care More Transparent
        </h2>
        <p className="text-sans text-md mb-6 space-y-5 font-light text-slate-900">
          Vetpras only works because people like you share what they’ve paid. Help build a better
          picture of pet care pricing in your area.
        </p>
        <Link
          href="/submit-bill"
          className="focus-visible:outline-primary inline-block transform rounded-lg border bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white uppercase shadow-md transition-transform hover:scale-95 hover:bg-blue-700 hover:from-blue-500 hover:to-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Submit a Bill
        </Link>
      </ContainerConstrained>
    </section>
  );
}
