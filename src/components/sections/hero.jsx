'use client';

import { hero } from '@/content/hero';
import ButtonPrimary from '@/components/ui/button-primary';

export default function Hero() {
  return (
    <section className="relative -mt-[40px] min-h-screen w-full bg-white">
      <div className="grid h-full w-full grid-cols-1 items-end gap-16 md:grid-cols-2">
        {/* Left: Text block */}
        <div className="pt-[80px] pr-6 pb-30 pl-6 text-left sm:pl-10 md:pl-30">
          <p className="text-primary mb-4 text-sm font-semibold tracking-widest uppercase">
            {hero.eyebrow}
          </p>
          <h1 className="font-playfair mb-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            {hero.headline}
          </h1>
          <p className="text-md mb-6 space-y-5 text-gray-700">{hero.description}</p>
          <p className="text-md mb-6 space-y-5 text-gray-700">{hero.supporting}</p>
          <ButtonPrimary href={hero.cta.href} className="mt-10">
            {hero.cta.label}
          </ButtonPrimary>
        </div>

        {/* Right: Puppers full bleed */}
        <div className="relative -mb-[1px] h-full w-full">
          <img
            src="/images/hero-image.png"
            alt="Happy husky with blue background"
            className="h-full w-full object-cover object-right"
          />
        </div>
      </div>
    </section>
  );
}
