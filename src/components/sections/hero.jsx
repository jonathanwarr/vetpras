'use client';

import heroContent from '@/content/hero';
import ContainerConstrained from '@/components/layout/container-constrained';

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20 pt-14">
        {/* Decorative Background Shape */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:-mr-80 lg:-mr-96"
        />

        {/* Hero Container */}
        <ContainerConstrained className="py-32 sm:py-40">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8">
            {/* Text Block */}
            <div className="mx-auto mt-10 max-w-2xl lg:mx-0">
              <h1 className="mb-6 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-balance">
                {heroContent.heading}
              </h1>

              <div className="max-w-xl">
                <p className="space-y-5 font-sans text-lg font-light text-slate-900">
                  {heroContent.subheading}
                </p>
                <div className="mt-10">
                  <a
                    href="/submit-bill"
                    className="focus-visible:outline-primary inline-block transform rounded-lg border bg-blue-600 px-4.5 py-2.5 text-xs font-bold text-white uppercase shadow-md transition-transform hover:scale-95 hover:bg-blue-700 hover:from-blue-500 hover:to-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Submit a Bill
                  </a>
                </div>
              </div>
            </div>

            {/* Kooper's Image */}
            <img
              alt="Kooper the dog"
              src="/images/kooper.png"
              className="mt-10 aspect-[4/3] w-full max-w-md rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-lg xl:mt-10"
            />
          </div>
        </ContainerConstrained>

        {/* Soft gradient fade at the bottom */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32" />
      </div>
    </div>
  );
}
