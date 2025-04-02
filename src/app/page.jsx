import React from 'react'
import Hero from '@/components/sections/hero'
import {
  ArrowPathIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'

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
]

export default function Page() {
  return (
    <div className="text-body-large min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Our Story Section */}
      <section className="h-screen bg-white px-6 py-[100px] sm:px-10 md:px-16">
        <div className="mx-auto grid h-full max-w-7xl items-center gap-16 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-[450px]">
            <div className="bg-button-primary-bg absolute top-[-20px] left-[-20px] -z-10 h-full w-full rounded shadow-lg" />
            <div className="bg-button-secondary-bg absolute top-[20px] left-[20px] -z-10 h-full w-full rounded shadow-lg" />
            <img
              src="/images/our-story-image.png"
              alt="Happy husky with blue background"
              className="relative z-10 w-full rounded object-cover"
            />
          </div>
          <div>
            <h2 className="text-h2 font-playfair text-heading-2 mb-2">
              OUR STORY
            </h2>
            <p className="text-body-lg text-body-medium mb-6">
              Finding the right Vet shouldn’t be hard.
            </p>
            <div className="text-body-md space-y-4">
              <p>
                When we needed progesterone testing for our beloved pup, we
                turned to our usual vet, only to find out they didn’t offer the
                service.
              </p>
              <p>
                What followed was a frustrating journey of searching for clinics
                online, sifting through inconsistent information on websites,
                and making countless phone calls just to get basic quotes and
                clarify available tests. We were stunned by how few
                veterinarians offered the services we needed and how drastically
                prices and service details varied from one clinic to another.
              </p>
              <p>
                The process was <strong>confusing</strong>,{' '}
                <strong>time-consuming</strong>, and <strong>stressful</strong>.
              </p>
              <p>
                That’s why we built <strong>Vetpras</strong>—to take the
                guesswork out of finding the right vet. By bringing all the
                information together in one place, we’re helping pet owners make
                informed choices with ease and confidence, because no one should
                have to navigate this level of uncertainty when it comes to
                their pet’s care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="mb-2">HOW IT WORKS</h2>
            <p className="mb-6">
              Empowering pet owners with trusted information.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt>
                    <div className="bg-primary absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg">
                      {React.createElement(feature.icon, {
                        className: 'size-6 text-white',
                        'aria-hidden': true,
                      })}
                    </div>
                    <span className="text-base font-bold">{feature.name}</span>
                  </dt>
                  <dd className="text-secondary-text mt-2 text-base">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
