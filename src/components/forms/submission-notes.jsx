'use client';

export default function SubmissionNotes({ value, onChange }) {
  const maxWords = 100;
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > maxWords;

  return (
    <div>
      <label
        htmlFor="notes"
        className="mb-1 block space-y-5 font-sans text-sm font-bold text-slate-900"
      >
        Notes (optional)
      </label>
      <textarea
        id="notes"
        value={value}
        onChange={(e) => {
          const words = e.target.value.trim().split(/\s+/);
          if (words.length <= maxWords) {
            onChange(e.target.value);
          }
        }}
        placeholder="Add any details about the service or custom name here..."
        className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
        style={{ height: '100px' }}
      />
      <p className={`mt-1 text-xs ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
        {wordCount}/{maxWords} words
      </p>
    </div>
  );
}
