'use client';

import { useState, useEffect } from 'react';

export default function SearchCategory({ services = [], onSelect }) {
  const [selected, setSelected] = useState('');

  // Filter only parent categories (no parent_code)
  const categories = services
    .filter((s) => s.parent_code === null)
    .sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    if (selected) onSelect(selected);
  }, [selected, onSelect]);

  return (
    <div className="relative w-full sm:w-60">
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Search by Category
      </label>
      <select
        id="category"
        name="category"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none sm:text-sm"
      >
        <option value="">Choose a category</option>
        {categories.map((cat) => (
          <option key={cat.service_code} value={cat.service}>
            {cat.service}
          </option>
        ))}
      </select>
    </div>
  );
}
