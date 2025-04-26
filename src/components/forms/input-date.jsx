'use client';

export default function InputDate({ value, onChange }) {
  return (
    <div>
      <label htmlFor="date" className="block space-y-5 font-sans text-sm font-bold text-slate-900">
        Date of Service
      </label>
      <input
        id="date"
        name="date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
