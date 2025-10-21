'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function VetprasSearch({
  clinics = [],
  services = [],
  placeholder = 'City or clinic name',
  className = '',
  suggestionsDirection = 'up', // 'up' for landing page, 'down' for search page
  variant = 'default', // 'hero' for landing page, 'default' for search page
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  // Variant-based styling
  const isHero = variant === 'hero';
  const containerStyles = isHero
    ? 'bg-white/10 backdrop-blur-sm border-white/20'
    : 'bg-slate-100 border-gray-200';
  const iconStyles = isHero
    ? 'text-white/80'
    : 'text-gray-600';
  const inputStyles = isHero
    ? 'text-white placeholder-white/60'
    : 'text-gray-800 placeholder-gray-500';
  const clearButtonStyles = isHero
    ? 'text-white/60 hover:text-white/90'
    : 'text-gray-400 hover:text-gray-600';
  const suggestionsStyles = isHero
    ? 'bg-white/90 backdrop-blur-md border-white/20'
    : 'bg-white border-gray-200';
  const buttonTextStyles = isHero
    ? 'text-white'
    : 'text-white';

  // Generate suggestions based on query (using existing search logic)
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const searchQuery = searchTerm.toLowerCase();
    const results = [];
    const seen = new Set();

    // Search clinics by name
    clinics.forEach((clinic) => {
      if (clinic.clinic_name?.toLowerCase().includes(searchQuery)) {
        const key = `clinic:${clinic.clinic_name}`;
        if (!seen.has(key)) {
          results.push({
            type: 'clinic',
            value: clinic.clinic_name,
            display: clinic.clinic_name,
            priority: clinic.clinic_name.toLowerCase().startsWith(searchQuery) ? 1 : 2,
          });
          seen.add(key);
        }
      }
    });

    // Search by city
    clinics.forEach((clinic) => {
      if (clinic.city?.toLowerCase().includes(searchQuery)) {
        const key = `city:${clinic.city}`;
        if (!seen.has(key)) {
          results.push({
            type: 'city',
            value: clinic.city,
            display: `${clinic.city} (City)`,
            priority: clinic.city.toLowerCase().startsWith(searchQuery) ? 1 : 2,
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

    return results;
  }, [searchTerm, clinics, services]);

  // Limit suggestions based on screen size
  const limitedSuggestions = useMemo(() => {
    return suggestions;
  }, [suggestions]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navigate to search page with query params
      const params = new URLSearchParams({
        query: searchTerm,
        type: 'text',
      });
      router.push(`/search?${params.toString()}`);
    } else {
      // Navigate to search page without filters if empty
      router.push('/search');
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.value);
    setShowSuggestions(false);
    setHighlightedIndex(0);

    // Navigate to search page with selected suggestion
    const params = new URLSearchParams({
      query: suggestion.value,
      type: suggestion.type,
    });
    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.trim().length > 0);
    setHighlightedIndex(0);
  };

  const handleFocus = () => {
    if (searchTerm.trim().length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
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
    <div className={className}>
      {/* Mobile: Stacked Layout */}
      <div className="relative flex flex-col gap-3 sm:hidden">
        {/* Search Input Container */}
        <div className={`flex items-center rounded-2xl border shadow-lg ${containerStyles}`}>
          <div className="pr-3 pl-6">
            <MagnifyingGlassIcon className={`h-5 w-5 ${iconStyles}`} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`flex-1 bg-transparent py-5 text-base focus:outline-none ${inputStyles}`}
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className={`cursor-pointer pr-6 transition-colors ${clearButtonStyles}`}
              aria-label="Clear search"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown - Mobile */}
        {showSuggestions && (
          <ul
            ref={suggestionsRef}
            className={`absolute z-50 w-full overflow-y-auto rounded-xl border shadow-lg ${suggestionsStyles} ${
              suggestionsDirection === 'up' ? 'bottom-full mb-3' : 'top-full mt-3'
            }`}
            style={{
              maxHeight: '300px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent',
            }}
          >
            {suggestions.slice(0, 3).length > 0 ? (
              suggestions.slice(0, 3).map((suggestion, index) => (
                <li
                  key={`${suggestion.type}-${suggestion.value}`}
                  onClick={() => selectSuggestion(suggestion)}
                  className="cursor-pointer px-4 py-3 text-sm transition-colors duration-150"
                  style={{
                    backgroundColor: index === highlightedIndex ? '#E2E8F0' : 'transparent',
                    color: index === highlightedIndex ? '#0F172B' : '#475569',
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{suggestion.value}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {suggestion.type === 'clinic' ? 'Clinic' : 'City'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-sm text-gray-500 italic">
                No results found. Try searching for a city or clinic name in Greater Vancouver.
              </li>
            )}
          </ul>
        )}

        {/* Search Button - Full Width */}
        <button
          onClick={handleSearch}
          className={`w-full cursor-pointer rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-base font-medium transition-all duration-200 hover:from-blue-700 hover:to-blue-600 ${buttonTextStyles}`}
        >
          Search
        </button>
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className={`relative hidden items-center rounded-2xl border shadow-lg sm:flex ${containerStyles}`}>
        <div className="flex min-w-0 flex-1 items-center">
          <div className="pr-4 pl-8">
            <MagnifyingGlassIcon className={`h-6 w-6 ${iconStyles}`} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`min-w-0 flex-1 bg-transparent py-6 text-lg focus:outline-none ${inputStyles}`}
          />
          {searchTerm && (
            <button
              onClick={handleClear}
              className={`cursor-pointer px-4 transition-colors ${clearButtonStyles}`}
              aria-label="Clear search"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Suggestions dropdown - Desktop */}
        {showSuggestions && (
          <ul
            ref={suggestionsRef}
            className={`absolute right-0 left-0 z-50 overflow-y-auto rounded-xl border shadow-lg ${suggestionsStyles} ${
              suggestionsDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
            style={{
              maxHeight: '300px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent',
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.type}-${suggestion.value}`}
                  onClick={() => selectSuggestion(suggestion)}
                  className="cursor-pointer px-6 py-3 text-base transition-colors duration-150"
                  style={{
                    backgroundColor: index === highlightedIndex ? '#E2E8F0' : 'transparent',
                    color: index === highlightedIndex ? '#0F172B' : '#475569',
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{suggestion.value}</span>
                    <span className="ml-2 text-sm text-gray-400">
                      {suggestion.type === 'clinic' ? 'Clinic' : 'City'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-3 text-center text-base text-gray-500 italic">
                No results found. Try searching for a city or clinic name in Greater Vancouver.
              </li>
            )}
          </ul>
        )}

        {/* Vertical Divider */}
        <div className="mx-4 h-12 w-0.5 bg-gray-700 lg:mx-6" />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className={`mr-3 cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-10 py-4 text-base font-medium transition-all duration-200 hover:from-blue-700 hover:to-blue-600 lg:px-12 ${buttonTextStyles}`}
        >
          Search
        </button>
      </div>
    </div>
  );
}
