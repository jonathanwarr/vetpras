'use client';

export default function InputPrice({ value, onChange }) {
  const handleChange = (e) => {
    const input = e.target.value;

    // Allow only digits and a single period
    const cleaned = input
      .replace(/[^0-9.]/g, '') // remove non-numeric
      .replace(/(\..*?)\..*/g, '$1'); // allow only one decimal

    onChange(cleaned);
  };

  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-900">
        Price (CAD)
      </label>
      <div className="mt-2">
        <input
          id="price"
          name="price"
          inputMode="decimal"
          type="text"
          placeholder="Enter price"
          value={value}
          onChange={handleChange}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />
      </div>
    </div>
  );
}
