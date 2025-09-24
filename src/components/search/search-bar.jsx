'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export default function SearchBar({
  clinics = [],
  services = [],
  onSearchChange,
  placeholder = 'enter a clinic name, city or treatment...',
}) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Generate suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const results = [];
    const seen = new Set();

    // Search clinics by name
    clinics.forEach((clinic) => {
      if (clinic.clinic_name?.toLowerCase().includes(searchTerm)) {
        const key = `clinic:${clinic.clinic_name}`;
        if (!seen.has(key)) {
          results.push({
            type: 'clinic',
            value: clinic.clinic_name,
            display: clinic.clinic_name,
            priority: clinic.clinic_name.toLowerCase().startsWith(searchTerm) ? 1 : 2,
          });
          seen.add(key);
        }
      }
    });

    // Search by city
    clinics.forEach((clinic) => {
      if (clinic.city?.toLowerCase().includes(searchTerm)) {
        const key = `city:${clinic.city}`;
        if (!seen.has(key)) {
          results.push({
            type: 'city',
            value: clinic.city,
            display: `${clinic.city} (City)`,
            priority: clinic.city.toLowerCase().startsWith(searchTerm) ? 1 : 2,
          });
          seen.add(key);
        }
      }
    });

    // Search by address
    clinics.forEach((clinic) => {
      if (clinic.street_address?.toLowerCase().includes(searchTerm)) {
        const key = `address:${clinic.street_address}`;
        if (!seen.has(key)) {
          results.push({
            type: 'address',
            value: clinic.street_address,
            display: clinic.street_address,
            priority: 3,
          });
          seen.add(key);
        }
      }
    });

    // Search by province
    clinics.forEach((clinic) => {
      if (clinic.province?.toLowerCase().includes(searchTerm)) {
        const key = `province:${clinic.province}`;
        if (!seen.has(key)) {
          results.push({
            type: 'province',
            value: clinic.province,
            display: `${clinic.province} (Province)`,
            priority: 3,
          });
          seen.add(key);
        }
      }
    });

    // Search services
    services.forEach((service) => {
      if (service.service?.toLowerCase().includes(searchTerm)) {
        const key = `service:${service.service}`;
        if (!seen.has(key)) {
          const isCategory = service.service_code.endsWith('.00');
          results.push({
            type: isCategory ? 'category' : 'service',
            value: service.service,
            display: `${service.service} (${isCategory ? 'Category' : 'Service'})`,
            priority: service.service.toLowerCase().startsWith(searchTerm) ? 1 : 2,
          });
          seen.add(key);
        }
      }
    });

    // Sort by priority and then alphabetically
    results.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.display.localeCompare(b.display);
    });

    return results.slice(0, 10); // Limit to 10 suggestions
  }, [query, clinics, services]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;

      case 'Tab':
      case 'Enter':
        e.preventDefault();
        if (suggestions[highlightedIndex]) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        inputRef.current?.blur();
        break;

      default:
        break;
    }
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    setQuery(suggestion.value);
    setShowSuggestions(false);
    setHighlightedIndex(0);

    // Trigger search with the selected value
    if (onSearchChange) {
      onSearchChange({
        query: suggestion.value,
        type: suggestion.type,
      });
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    setHighlightedIndex(0);

    // Trigger search
    if (onSearchChange) {
      onSearchChange({
        query: value,
        type: 'text',
      });
    }
  };

  // Handle focus events
  const handleFocus = () => {
    setIsFocused(true);
    if (query.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay to allow click on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const items = suggestionsRef.current.children;
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full sm:w-2/5 sm:min-w-[300px]">
      <div 
        className="relative p-[2px] rounded-[12px] transition-all duration-200"
        style={{
          background: isFocused 
            ? 'conic-gradient(from 0deg, #47ECD5, #009689, #47ECD5, #009689, #47ECD5)'
            : 'conic-gradient(from 0deg, #47ECD5, #009689, #47ECD5, #009689, #47ECD5)',
          opacity: isFocused ? 1 : 0.7,
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div className="relative bg-gray-50 rounded-[12px]">
          <MagnifyingGlassIcon
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            style={{ color: '#62748E' }}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="w-full pr-3 pl-10 text-base transition-all duration-200 bg-gray-50 rounded-[12px]"
            style={{
              height: '50px',
              backgroundColor: '#F9FAFB',
              color: '#0F172B',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full overflow-y-auto rounded-md shadow-lg"
          style={{
            maxHeight: '300px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${suggestion.value}`}
              onClick={() => selectSuggestion(suggestion)}
              className="cursor-pointer px-3 py-2 text-sm transition-colors duration-150"
              style={{
                backgroundColor: index === highlightedIndex ? '#E2E8F0' : 'transparent',
                color: index === highlightedIndex ? '#0F172B' : '#475569',
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{suggestion.value}</span>
                <span className="ml-2 text-xs" style={{ color: '#94A3B8' }}>
                  {suggestion.type === 'clinic'
                    ? 'Clinic'
                    : suggestion.type === 'city'
                      ? 'City'
                      : suggestion.type === 'address'
                        ? 'Address'
                        : suggestion.type === 'province'
                          ? 'Province'
                          : suggestion.type === 'category'
                            ? 'Category'
                            : 'Service'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
