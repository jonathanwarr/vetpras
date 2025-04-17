'use client';

import { howItWorks } from '@/content/how-it-works';

export default function HowItWorksSection() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 sm:py-32 md:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-primary mb-4 text-sm font-semibold tracking-widest uppercase">
            How It Works
          </p>
          <h2 className="font-playfair mb-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            A better way to share and understand veterinary costs
          </h2>
          <p className="text-md mb-6 space-y-5 text-gray-700">
            Vetpras is building a crowdsourced view of vet care. With your help, we’re creating
            tools that empower pet owners and support great clinics alike.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {howItWorks.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="bg-primary absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg">
                    <feature.icon aria-hidden="true" className="size-6 text-blue-700" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mb-6 space-y-5 text-sm text-gray-700">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
