import React from 'react';
import {
  ArrowPathIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Search for Veterinary Clinics',
    description:
      'Use our search tool to find clinics based on the services your pet requires.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Compare Services and Prices',
    description:
      'View detailed clinic profiles, including services offered, price estimates, and customer ratings.',
    icon: ChartBarIcon,
  },
  {
    name: 'Make an Informed Decision',
    description:
      'Choose a vet that meets your pet’s needs with confidence—routine care, emergencies, or specialty services.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Submit and Validate Prices',
    description:
      'Help fellow pet owners by submitting your vet bill. We verify and aggregate prices for transparency.',
    icon: CameraIcon,
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="h-[calc(100vh-80px)] bg-gray-50 overflow-hidden flex items-center">
        <div className="w-full max-h-screen overflow-hidden grid md:grid-cols-2 items-center">
          <div className="pl-6 sm:pl-12 md:pl-[150px] lg:pl-[200px] xl:pl-[250px] 2xl:pl-[300px] pr-6 text-left">
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-gray-900 mb-4">
              FIND THE RIGHT VET<br />FOR YOUR PET
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Quickly search and compare veterinarian clinics by services, location, ratings, and cost to make the best choice for your beloved pet
            </p>
            <p className="text-[16px] sm:text-[18px] leading-[1.6] text-black font-semibold mb-6">
              Finding the right Vet is only a click away!
            </p>
            <button className="bg-[#2B2F38] text-white text-[16px] sm:text-[18px] font-bold px-6 sm:px-8 py-3 rounded-md hover:bg-gray-800 transition">
              Find a Vet
            </button>
          </div>
          <div className="flex justify-end items-end">
            <img
              src="/images/hero-image.png"
              alt="Happy dog representing vet care"
              className="w-[300px] sm:w-[500px] md:w-[650px] lg:w-[800px] xl:w-[900px] h-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="h-screen py-[100px] px-6 sm:px-10 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center h-full">
          <div className="relative w-full max-w-[450px] mx-auto">
            <div className="absolute top-[-20px] left-[-20px] w-full h-full bg-[#284C9B] rounded shadow-lg -z-10"></div>
            <div className="absolute top-[20px] left-[20px] w-full h-full bg-[#C8CDD7] rounded shadow-lg -z-10"></div>
            <img
              src="/images/our-story-image.png"
              alt="Happy husky with blue background"
              className="relative z-10 w-full object-cover rounded"
            />
          </div>
          <div>
            <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-gray-900 mb-2">OUR STORY</h2>
            <p className="text-xl text-gray-600 mb-6">Finding the right Vet shouldn’t be hard.</p>
            <div className="space-y-4 text-base leading-relaxed text-gray-800">
              <p>
                When we needed progesterone testing for our beloved pup, we turned to our usual vet, only to find out they didn’t offer the service.
              </p>
              <p>
                What followed was a frustrating journey of searching for clinics online, sifting through inconsistent information on websites, and making countless phone calls just to get basic quotes and clarify available tests. We were stunned by how few veterinarians offered the services we needed and how drastically prices and service details varied from one clinic to another.
              </p>
              <p>
                The process was <strong className="font-semibold">confusing</strong>, <strong className="font-semibold">time-consuming</strong>, and <strong className="font-semibold">stressful</strong>.
              </p>
              <p>
                That’s why we built <strong className="font-semibold">Vetpras</strong>—to take the guesswork out of finding the right vet. By bringing all the information together in one place, we’re helping pet owners make informed choices with ease and confidence, because no one should have to navigate this level of uncertainty when it comes to their pet’s care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-4xl sm:text-5xl font-serif font-semibold text-gray-900 mb-2">HOW IT WORKS</h2>
            <p className="text-xl text-gray-600 mb-6">Empowering pet owners with trusted information.</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-bold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                      {React.createElement(feature.icon, {
                        className: 'size-6 text-white',
                        'aria-hidden': true,
                      })}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white px-6 py-10 text-sm text-center border-t border-gray-200">
        <div className="mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 border border-gray-300 rounded-l-md"
          />
          <button className="px-4 py-2 bg-black text-white rounded-r-md hover:bg-gray-800 transition">
            Subscribe
          </button>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Vet Search</a>
          <a href="#" className="hover:underline">Submit Bill</a>
          <a href="#" className="hover:underline">Submit Feedback</a>
        </div>
        <p className="text-gray-500">© 2025 amwarr consulting Inc. All rights reserved.</p>
        <p className="text-gray-400 mt-2">
          <a href="#" className="hover:underline">Terms</a> · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Cookies</a>
        </p>
      </footer>
    </div>
  );
}
