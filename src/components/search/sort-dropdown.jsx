'use client';

import { useState } from 'react';
import { FunnelIcon } from '@heroicons/react/20/solid';

export default function SortDropdown({ sortOption, setSortOption }) {
  return (
    <div className="w-full sm:w-auto">
      <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">Sort By</h3>
      <div className="relative">
        <FunnelIcon className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full appearance-none rounded-md border border-gray-300 bg-white py-1.5 pr-8 pl-10 text-xs font-medium text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none sm:text-sm"
        >
          <option value="name-asc">Name (A–Z)</option>
          <option value="city-asc">City (A–Z)</option>
          <option value="exam-desc">Exam Fee (High to Low)</option>
          <option value="rating-desc">Rating (High to Low)</option>
        </select>
      </div>
    </div>
  );
}
