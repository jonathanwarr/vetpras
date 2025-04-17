'use client';

import { hero } from '@/content/hero';
import ButtonPrimary from '@/components/ui/button-primary';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-[120px] pb-10 md:max-h-[100vh] md:min-h-[100vh] xl:pt-0">
      {/* Removed min-h-screen to fix giant gap on mobile */}
      <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-2 md:items-center md:gap-16">
        {/* ✅ Text Block */}
        <div className="px-6 text-left sm:px-10 md:px-20">
          <p className="text-primary mb-4 text-sm font-semibold tracking-widest uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="font-playfair mb-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            {hero.headline}
          </h1>
          <p className="mb-6 space-y-5 text-sm text-gray-700">{hero.description}</p>
          <p className="mb-6 space-y-5 text-sm text-gray-700">{hero.supporting}</p>
          <ButtonPrimary href={hero.cta.href} className="mt-10">
            {hero.cta.label}
          </ButtonPrimary>
        </div>

        {/* ✅ Puppers image – desktop only */}
        <div className="hidden h-auto w-full md:block">
          <Image
            src="/images/hero-image.png"
            alt="Happy husky with blue background"
            width={800}
            height={600}
            className="h-auto w-full object-cover object-right"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
