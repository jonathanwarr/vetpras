'use client';

export default function SubmitBillEmail({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="email"
        className="mb-1 block space-y-5 font-sans text-sm font-bold text-slate-900"
      >
        Email (optional)
      </label>
      <p className="mb-2 text-xs text-gray-500">
        With every bill submission, you're helping other dog parents avoid surprise vet costs.
      </p>
      <input
        type="email"
        id="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your email address"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
      />
    </div>
  );
}
