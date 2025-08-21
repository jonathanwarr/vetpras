'use client';

import { ourStory } from '@/content/our-story';

export default function OurStorySection() {
  return (
    <section className="mt-20 flex min-h-screen items-center bg-gray-50 px-6 sm:px-10 md:px-16">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 md:grid-cols-2">
        {/* Left: Image centered */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[450px]">
            <div className="bg-button-primary-bg absolute top-[-20px] left-[-20px] -z-10 h-full w-full rounded shadow-lg" />
            <div className="bg-button-secondary-bg absolute top-[20px] left-[20px] -z-10 h-full w-full rounded shadow-lg" />
            <img
              src={ourStory.image.src}
              alt={ourStory.image.alt}
              className="relative z-10 w-full rounded object-cover"
            />
          </div>
        </div>

        {/* Right: Text block */}
        <div className="flex items-center">
          <div>
            <p className="text-primary mb-4 text-sm font-semibold tracking-widest uppercase">
              {ourStory.title}
            </p>
            <h2 className="font-playfair mb-6 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              {ourStory.subtitle}
            </h2>
            <div className="text-md mb-6 space-y-5 text-gray-700">
              {ourStory.paragraphs.map((text, index) => (
                <p key={index} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
