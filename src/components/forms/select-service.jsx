'use client';

import { useEffect, useRef, useState } from 'react';

export default function SelectService({ values = [], onChange, services = [] }) {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const listRef = useRef(null);

  const filtered = input.length
    ? services.filter((s) => s.service.toLowerCase().includes(input.toLowerCase()))
    : [];

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const listItem = listRef.current.children[highlightedIndex];
      listItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleSelect = (service) => {
    if (!values.includes(service.service_code)) {
      onChange([...values, service.service_code]);
    }
    setInput('');
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
        handleSelect(filtered[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  };

  const removeService = (code) => {
    onChange(values.filter((c) => c !== code));
  };

  return (
    <div className="relative">
      <label htmlFor="services" className="block font-sans text-sm font-bold text-slate-900">
        Services
      </label>

      <div className="mt-0 mb-2 flex flex-wrap gap-2">
        {values.map((code) => {
          const svc = services.find((s) => s.service_code === code);
          return (
            <span
              key={code}
              className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
            >
              {svc?.service || code}
              <button
                onClick={() => removeService(code)}
                className="ml-1 text-blue-600 hover:text-red-600"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>

      <input
        id="services"
        name="services"
        type="text"
        placeholder="Type to search services"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowDropdown(true);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setShowDropdown(false)}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
      />

      {showDropdown && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white text-sm shadow-lg ring-1 ring-gray-200"
        >
          {filtered.map((service, index) => (
            <li
              key={service.service_code}
              onClick={() => handleSelect(service)}
              className={`cursor-pointer px-3 py-2 hover:bg-gray-100 ${
                highlightedIndex === index ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {service.service}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
