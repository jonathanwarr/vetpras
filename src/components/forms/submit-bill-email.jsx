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
        All bill submissions are entered for a monthly draw to win a $50 Doordash digital gift card.
        In order to be eligible, users will need to provide an email. Terms and conditions apply.
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
