'use client';

import { useEffect, useState, useRef } from 'react';

export default function SelectService({ value, onChange, services = [] }) {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listRef = useRef(null);

  const filtered = input.length
    ? services.filter((s) => s.name.toLowerCase().includes(input.toLowerCase()))
    : [];

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const listItem = listRef.current.children[highlightedIndex];
      listItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleSelect = (service) => {
    onChange(service.code);
    setInput(service.name);
    setShowDropdown(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative">
      <label htmlFor="service" className="block text-sm font-medium text-gray-900">
        Service
      </label>
      <div className="mt-2">
        <input
          id="service"
          name="service"
          type="text"
          placeholder="e.g. Dental Cleaning"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />

        {showDropdown && filtered.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-gray-200"
          >
            {filtered.map((service, index) => (
              <li
                key={service.code}
                onClick={() => handleSelect(service)}
                className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                  highlightedIndex === index ? 'bg-indigo-600 text-white' : ''
                }`}
              >
                {service.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
