'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SearchBar({ onSearchChange }) {
  const [query, setQuery] = useState('');
  const [isAscending, setIsAscending] = useState(true);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearchChange) onSearchChange(value);
  };

  const toggleArrow = () => {
    setIsAscending((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search clinics..."
        className="focus:ring-primary w-full rounded-full border border-gray-300 px-4 py-2 pr-10 text-base text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:outline-none"
        aria-label="Search clinics"
      />
      <button
        type="button"
        onClick={toggleArrow}
        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        aria-label="Toggle sort order"
      >
        {isAscending ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
}
