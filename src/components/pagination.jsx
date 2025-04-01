export default function Pagination({ current = 1, total = 20, perPage = 10, onPrev, onNext }) {
  const start = (current - 1) * perPage + 1
  const end = Math.min(current * perPage, total)

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-secondary-text">
          Showing <span className="font-semibold">{start}</span> to <span className="font-semibold">{end}</span> of{' '}
          <span className="font-semibold">{total}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={onPrev}
          disabled={current === 1}
          className="relative inline-flex items-center rounded-md bg-button-secondary-bg text-button-secondary-text px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-button-secondary-bg/90 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={end === total}
          className="relative ml-3 inline-flex items-center rounded-md bg-button-secondary-bg text-button-secondary-text px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-button-secondary-bg/90 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </nav>
  )
}
