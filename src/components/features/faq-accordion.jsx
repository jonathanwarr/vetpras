'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const faqs = [
  {
    question: 'Will my personal info be shared?',
    answer: (
      <>
        <p>We only collect three things from your bill:</p>
        <ul className="mt-4 ml-6 list-disc space-y-2">
          <li>The clinic name and location</li>
          <li>The services and line items</li>
          <li>The costs for each service</li>
        </ul>
        <p className="mt-4">
          When available, we also collect details about your pet (breed, age, weight, sex, and reproductive status) that are typically listed on vet invoices. This anonymized information helps us provide more accurate pricing estimates for pets similar to yours—so a Labrador owner sees costs relevant to Labradors, not Chihuahuas. All data is completely anonymous and used only to improve pricing accuracy for the community.
        </p>
      </>
    ),
  },
  {
    question: 'Is my information safe?',
    answer:
      'Your personal information is never shared or sold. All data is anonymized and used only to build pricing transparency for the community.',
  },
  {
    question: 'What happens to the bill after submission?',
    answer:
      "Once you submit your bill, we extract the relevant pricing and service information, anonymize it, and add it to our database. This data then powers the Search Engine—so when someone looks up costs for the same procedure in your area, they'll see more accurate pricing ranges. Your contribution helps the next pet owner make informed decisions.",
  },
  {
    question: 'How does my bill help other pet owners?',
    answer:
      "Every bill you share makes our pricing data more accurate and comprehensive. When another pet owner searches for costs in your area, your contribution helps them see realistic price ranges, understand what's included in different procedures, and make confident decisions about their pet's care. Your bill today helps eliminate the cost uncertainty that stops so many families from getting the care their pets need.",
  },
  {
    question: 'Why do prices vary so much for the same procedure?',
    answer:
      "The same procedure can vary by 500% or more depending on factors like your pet's breed, age, weight, sex, and health status. Different clinics also include different services in their pricing—some bundle pre-op bloodwork and pain medication, others charge separately. Bill submissions help us understand these variables so you can see what's driving costs and get more accurate estimates for pets like yours.",
  },
  {
    question: 'How does this help me avoid surprise costs?',
    answer:
      "The more bills we collect, the closer we get to predicting variable costs, tracking pricing trends, and identifying what's included versus charged separately. Right now, every submission helps us build the foundation for these insights. Your bill today helps us develop the tools that will eventually help pet owners avoid surprise costs and ask the right questions before booking.",
  },
  {
    question: 'Do I need to create an account to submit?',
    answer:
      'No. You can submit your bill anonymously without creating an account.',
  },
];

export default function FaqAccordion({ className } = {}) {
  return (
    <div className={clsx("bg-gray-50", className)}>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-800 sm:text-5xl">
            Frequently asked questions
          </h2>
          <dl className="mt-16 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-800">
                    <span className="text-base/7 font-semibold">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusIcon aria-hidden="true" className="size-6 text-gray-700 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-6 text-gray-700 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <div className="text-base/7 text-gray-700">{faq.answer}</div>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
