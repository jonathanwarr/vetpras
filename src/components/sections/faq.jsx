'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline';

// ✅ Final FAQ entries
const faqs = [
  {
    question: 'What animals do you support?',
    answer:
      'Currently, we’re only posting data on dogs — we’ll be expanding soon to include cats, then adding more pets as we grow.',
  },
  {
    question: 'Do you show my vet bill publicly?',
    answer:
      'Never. Vetpras uses the details from your receipt to validate pricing and services, but we don’t display the actual file or any personal information. All submissions are anonymous and reviewed by hand for privacy and accuracy.',
  },
  {
    question: 'How is my data handled?',
    answer:
      'We collect the bare minimum needed to verify a submission. No names, no logins, no tracking. You can learn more in our Privacy Policy — it’s linked at the bottom of every page.',
  },
  {
    question: 'I found an error — how do I report it?',
    answer:
      'We’re still in early access, so feedback is hugely appreciated. You can use the Submit Feedback link in the footer to report an issue, suggest an improvement, or just say hi.',
  },
  {
    question: 'Can clinics participate too?',
    answer:
      'Yes! We’ll soon be opening up tools for clinics to verify their services, submit prices directly, and gain visibility through transparency. Stay tuned or reach out to join our pilot list.',
  },
];

export default function FaqSection() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Frequently asked questions
          </h2>
          <dl className="mt-16 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure key={faq.question} as="div" className="py-6 first:pt-0 last:pb-0">
                <dt>
                  <DisclosureButton className="group flex w-full items-start justify-between text-left text-gray-900">
                    <span className="text-sans text-lg font-bold text-slate-900">
                      {faq.question}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <PlusSmallIcon aria-hidden="true" className="size-6 group-data-open:hidden" />
                      <MinusSmallIcon
                        aria-hidden="true"
                        className="size-6 group-not-data-open:hidden"
                      />
                    </span>
                  </DisclosureButton>
                </dt>
                <DisclosurePanel as="dd" className="mt-2 pr-12">
                  <p className="text-sans text-md mb-6 space-y-5 font-light text-slate-900">
                    {faq.answer}
                  </p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
