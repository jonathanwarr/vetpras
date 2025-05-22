'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

// This component provides a search input with live suggestions from a list of vet services.
// As the user types, matching services are shown. They can select using keyboard or mouse.
export default function SearchService({ value, onChange, services }) {
  const [showSuggestions, setShowSuggestions] = useState(false); // Controls if suggestions list is visible
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Tracks which item is focused (for arrow key nav)
  const listRef = useRef(null); // Used to scroll selected item into view

  // Filter the list of services based on what the user types
  const filteredSuggestions = useMemo(() => {
    return (
      services?.filter((service) => service.service.toLowerCase().includes(value.toLowerCase())) ||
      []
    );
  }, [value, services]);

  // Called when the user selects a service from the list
  const handleSelect = (service) => {
    onChange(service.service); // Updates the search input value
    setShowSuggestions(false); // Close the dropdown
    setHighlightedIndex(-1);
  };

  // Handle arrow keys and enter to navigate and select items
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(filteredSuggestions[highlightedIndex]);
        } else if (filteredSuggestions.length > 0) {
          handleSelect(filteredSuggestions[0]);
        }
        break;
      default:
        break;
    }
  };

  // Scroll to the highlighted item as you move with arrows
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const listItem = listRef.current.children[highlightedIndex];
      listItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full sm:w-80">
      <label
        htmlFor="search"
        className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase"
      >
        Search by Service
      </label>
      <div className="relative mt-2">
        <input
          id="search"
          name="search"
          type="text"
          autoComplete="off"
          placeholder="e.g. Vaccination"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
            setHighlightedIndex(-1);
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleKeyDown}
          className="text-sans block w-full rounded-sm border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:font-sans placeholder:text-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-sm"
        />

        {/* Suggestion dropdown list */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white text-sm shadow-lg"
          >
            {filteredSuggestions.map((service, index) => (
              <li
                key={service.service_code}
                onClick={() => handleSelect(service)}
                className={`cursor-pointer px-3 py-2 ${
                  index === highlightedIndex ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {service.service}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
