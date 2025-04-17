import React from 'react';
import Hero from '@/components/sections/hero';
import OurStorySection from '@/components/sections/our-story';
import HowItWorksSection from '@/components/sections/how-it-works';

export default function Page() {
  return (
    <div className="text-body-large min-h-screen bg-white">
      <Hero />
      <OurStorySection />
      <HowItWorksSection />
    </div>
  );
}
