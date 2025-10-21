export default function ContentCommunity() {
  return (
    <div className="overflow-hidden bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="max-w-4xl">
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-800 sm:text-5xl">
            Powered by Community
          </h1>
          <p className="mt-6 text-xl/8 text-balance text-gray-700">
            Together, we're building a community that makes veterinary costs transparent - so every pet owner can find and afford the care their pet needs.
          </p>
        </div>
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16">
          <div className="lg:pr-8">
            <h2 className="text-2xl font-semibold tracking-tight text-pretty text-gray-800">The transparency crisis</h2>
            <p className="mt-6 text-base/7 text-gray-700">
              Canadian pet care is facing a transparency crisis. Millions of pets aren't getting the care they need—not because treatments don't exist, but because families can't navigate the costs.
            </p>
            <p className="mt-8 text-base/7 text-gray-700">
              Without clear pricing information, pet owners are forced to make impossible choices. They delay necessary care, skip preventive treatments, or face unexpected bills that strain their budgets. The numbers tell the story:
            </p>
          </div>
          <div className="pt-16 lg:row-span-2 lg:-mr-16 xl:mr-auto">
            <div className="-mx-8 grid grid-cols-2 gap-4 sm:-mx-16 sm:grid-cols-4 lg:mx-0 lg:grid-cols-2 xl:gap-8">
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
                <img
                  alt="Puppy with veterinarian"
                  src="/images/puppyandvet.jpg"
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40">
                <img
                  alt="Paying bills"
                  src="/images/payingbills.jpg"
                  className="block size-full object-cover"
                />
              </div>
              <div className="aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10">
                <img
                  alt="Puppy wearing cone"
                  src="/images/puppycone.jpg"
                  className="block size-full object-cover"
                />
              </div>
              <div className="-mt-8 aspect-square overflow-hidden rounded-xl shadow-xl outline-1 -outline-offset-1 outline-black/10 lg:-mt-40">
                <img
                  alt="Puppy wearing mask"
                  src="/images/puppymask.jpg"
                  className="block size-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="max-lg:mt-16 lg:col-span-1">
            <p className="text-base/7 font-semibold text-gray-500">The numbers</p>
            <hr className="mt-6 border-t border-gray-200" />
            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                <dt className="text-sm/6 text-gray-700">The number of Canadians that skip pet care due to cost</dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-gray-800">
                  <span>50</span>%
                </dd>
              </div>
              <div className="flex flex-col gap-y-2 border-b border-dotted border-gray-200 pb-4">
                <dt className="text-sm/6 text-gray-700">The amount of Canada's 16.4 million pets are covered by insurance</dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-gray-800">
                  <span>3.8</span>%
                </dd>
              </div>
              <div className="flex flex-col gap-y-2 max-sm:border-b max-sm:border-dotted max-sm:border-gray-200 max-sm:pb-4">
                <dt className="text-sm/6 text-gray-700">The number of Canadian pet owners that say Vet fees are unreasonably high</dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-gray-800">
                  <span>72</span>%
                </dd>
              </div>
              <div className="flex flex-col gap-y-2">
                <dt className="text-sm/6 text-gray-700">The amount Canadians spend annually on veterinary care</dt>
                <dd className="order-first text-6xl font-semibold tracking-tight text-gray-800">
                  $<span>9.3</span>B
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
