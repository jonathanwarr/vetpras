import React from 'react';
import Hero from '@/components/sections/hero';
import HowItWorksSection from '@/components/sections/how-it-works';
import FaqSection from '@/components/sections/faq';
import CtaSection from '@/components/sections/cta';

export default function Page() {
  return (
    <div className="text-body-large min-h-screen scroll-smooth bg-white">
      <Hero />
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      <section id="faq">
        <FaqSection />
      </section>
      <section id="cta">
        <CtaSection />
      </section>
    </div>
  );
}
