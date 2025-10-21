import { DocumentArrowUpIcon, CircleStackIcon, MagnifyingGlassIcon, HeartIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    name: 'You share your vet bill',
    description:
      'Upload your receipt in seconds. Every bill you share helps build a transparent database of real veterinary costs across Canada.',
    icon: DocumentArrowUpIcon,
  },
  {
    name: 'It becomes part of the community data',
    description:
      'Your contribution joins thousands of verified bills, creating a comprehensive pricing resource that benefits every pet owner.',
    icon: CircleStackIcon,
  },
  {
    name: 'The next person searching gets better information',
    description:
      'Pet owners can now compare prices, understand costs, and find clinics that fit their budget—all because you shared.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Families make confident choices about their pet\'s care',
    description:
      'No more surprises. No more delays. Just informed decisions that lead to better care for every pet in Canada.',
    icon: HeartIcon,
  },
];

export default function ContentHowItWorks() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-800 sm:text-5xl lg:text-balance">
            How It Works
          </h1>
          <h2 className="mt-6 text-xl/8 text-gray-700">
            How We Build Transparency Together
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {steps.map((step) => (
              <div key={step.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-800">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-blue-500">
                    <step.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {step.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-700">{step.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
