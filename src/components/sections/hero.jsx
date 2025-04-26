'use client';

import heroContent from '@/content/homepage';

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20 pt-14">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:-mr-80 lg:-mr-96"
        />
        <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:mt-24 lg:text-6xl lg:text-balance">
                {heroContent.heading}
              </h1>
              <p className="text-md mt-6 mb-6 space-y-5 text-slate-900">{heroContent.subheading}</p>
              <div className="mt-10">
                <a
                  href="/submit-bill"
                  className="bg-primary hover:bg-primary/90 focus-visible:outline-primary inline-block rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Submit a Bill
                </a>
              </div>
            </div>

            {/* Kooper Image */}
            <img
              alt="Kooper the dog"
              src="/images/kooper.png"
              className="mt-10 aspect-[4/3] w-full max-w-md rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-md xl:row-span-2 xl:row-end-2 xl:mt-10"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white sm:h-32" />
      </div>
    </div>
  );
}
