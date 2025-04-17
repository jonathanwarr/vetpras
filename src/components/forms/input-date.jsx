'use client';

export default function InputDate({ value, onChange }) {
  return (
    <div>
      <label htmlFor="date" className="block text-sm font-medium text-gray-900">
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
