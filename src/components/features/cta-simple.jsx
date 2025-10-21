import clsx from 'clsx';

export default function CtaSimple({ className } = {}) {
  return (
    <div className={clsx("bg-gray-100", className)}>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-800">
            Help make a difference.
          </h2>
          <h3 className="mt-2 text-xl/8 text-gray-700">
            Each bill submission helps other pet owners make informed decisions.
          </h3>
        </div>
        <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
          <a
            href="/submit-bill"
            className="rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Share a Bill
          </a>
          <a href="/about-us" className="text-sm/6 font-semibold text-gray-900 hover:text-blue-500">
            Learn more
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
