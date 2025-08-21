'use client';

import { howItWorks, howItWorksIntro, howItWorksHeading } from '@/content/how-it-works';

export default function HowItWorksSection() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 sm:py-32 md:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-primary mb-4 text-lg font-semibold tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="mb-6 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-balance">
            {howItWorksHeading}
          </h2>
          {/* Intro paragraph pulled from content file */}
          <p className="space-y-5 font-sans text-lg font-light text-slate-900">
            {howItWorksIntro}{' '}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {howItWorks.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-sans text-lg font-bold text-slate-900">
                  <div className="bg-primary absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg">
                    <feature.icon aria-hidden="true" className="size-6 text-blue-700" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="text-sans text-md mb-6 space-y-5 font-light text-slate-900">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
