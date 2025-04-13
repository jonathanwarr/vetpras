'use client';

export default function Hero() {
  return (
    <section className="flex h-screen items-center overflow-hidden bg-white">
      <div className="grid max-h-screen w-full items-center md:grid-cols-2">
        {/* Left Text Content */}
        <div className="px-6 text-left sm:pl-12 md:pl-[150px] lg:pl-[200px] xl:pl-[250px] 2xl:pl-[300px]">
          <h1 className="text-h1 font-playfair text-heading-1 mb-4">
            FIND THE RIGHT VET
            <br />
            FOR YOUR PET
          </h1>
          <p className="text-body-lg text-body-medium mb-6">
            Quickly search and compare veterinarian clinics by services, location, ratings, and cost
            to make the best choice for your beloved pet
          </p>
          <p className="text-body-md mb-6 font-semibold">
            Finding the right Vet is only a click away!
          </p>
          <a
            href="/clinics"
            className="rounded-md bg-slate-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
          >
            Get started
          </a>
        </div>
        {/* Doggo Image */}
        <div className="flex items-end justify-end">
          <img
            src="/images/hero-image.png"
            alt="Happy dog representing vet care"
            className="h-auto w-[300px] object-contain sm:w-[500px] md:w-[650px] lg:w-[800px] xl:w-[900px]"
          />
        </div>
      </div>
    </section>
  );
}
