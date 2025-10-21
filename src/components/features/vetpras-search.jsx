'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MagnifyingGlassIcon, SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { parseNaturalLanguageQuery, getExampleQueries } from '@/lib/natural-language-parser';

export default function VetprasSearch({
  clinics = [],
  services = [],
  placeholder = 'Try "exam under $80" or "4 star clinics in Vancouver"',
  className = '',
  suggestionsDirection = 'up', // 'up' for landing page, 'down' for search page
  onNaturalLanguageSearch = null, // Callback for natural language search
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [parsedQuery, setParsedQuery] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  // Get example queries
  const exampleQueries = useMemo(() => getExampleQueries(), []);

  // Generate suggestions based on query (using existing search logic + NLP)
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const searchQuery = searchTerm.toLowerCase();
    const results = [];
    const seen = new Set();

    // First, check for natural language patterns if query is long enough
    if (searchTerm.trim().length > 3) {
      const parsed = parseNaturalLanguageQuery(searchTerm);

      // If we have meaningful filters, add them as the first suggestion
      if (parsed && Object.keys(parsed.filters).length > 0 && parsed.interpretation) {
        results.push({
          type: 'filter',
          value: searchTerm,
          display: parsed.interpretation.replace('Showing clinics with ', ''),
          priority: 0, // Highest priority
          filters: parsed.filters,
          confidence: parsed.confidence,
        });
      }
    }

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
            display: `${clinic.city}`,
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

  // Parse natural language when input changes
  useEffect(() => {
    if (searchTerm.trim().length > 3) {
      const parsed = parseNaturalLanguageQuery(searchTerm);
      setParsedQuery(parsed);
    } else {
      setParsedQuery(null);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // If we have a highlighted suggestion, select it
      if (showSuggestions && suggestions[highlightedIndex]) {
        selectSuggestion(suggestions[highlightedIndex]);
        return;
      }

      // Check if we have a natural language query with filters
      if (parsedQuery && Object.keys(parsedQuery.filters).length > 0) {
        // Use natural language search
        if (onNaturalLanguageSearch) {
          onNaturalLanguageSearch(parsedQuery);
        } else {
          // Navigate to search page with filters encoded
          const params = new URLSearchParams({
            query: parsedQuery.searchText || '',
            type: 'nlp',
            filters: JSON.stringify(parsedQuery.filters)
          });
          router.push(`/search?${params.toString()}`);
        }
      } else {
        // Regular text search
        const params = new URLSearchParams({
          query: searchTerm,
          type: 'text'
        });
        router.push(`/search?${params.toString()}`);
      }
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.value);
    setShowSuggestions(false);
    setHighlightedIndex(0);

    // Handle filter suggestions differently
    if (suggestion.type === 'filter' && suggestion.filters) {
      if (onNaturalLanguageSearch) {
        // Callback for search page
        onNaturalLanguageSearch({
          filters: suggestion.filters,
          searchText: suggestion.filters.city ? suggestion.filters.city[0] : '',
          interpretation: suggestion.display,
        });
      } else {
        // Navigate to search page with filters
        const params = new URLSearchParams({
          query: suggestion.filters.city ? suggestion.filters.city[0] : '',
          type: 'nlp',
          filters: JSON.stringify(suggestion.filters)
        });
        router.push(`/search?${params.toString()}`);
      }
    } else {
      // Regular city/clinic suggestion
      const params = new URLSearchParams({
        query: suggestion.value,
        type: suggestion.type
      });
      router.push(`/search?${params.toString()}`);
    }
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

  const handleExampleClick = (example) => {
    setSearchTerm(example);
    setShowExamples(false);
    // Trigger search after a small delay to allow state update
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  return (
    <div className={className}>
      {/* Mobile: Stacked Layout */}
      <div className='sm:hidden flex flex-col gap-3 relative'>
        {/* Search Input Container */}
        <div className='flex items-center bg-slate-50 rounded-2xl shadow-sm border border-gray-400'>
          <div className='pl-6 pr-3'>
            <MagnifyingGlassIcon className='h-5 w-5 text-gray-600' />
          </div>
          <input
            ref={inputRef}
            type='text'
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className='flex-1 bg-transparent py-5 pr-6 text-base text-gray-800 placeholder-gray-500 focus:outline-none'
          />
        </div>

        {/* Suggestions dropdown - Mobile */}
        {showSuggestions && (
          <ul
            ref={suggestionsRef}
            className={`absolute z-50 w-full overflow-y-auto rounded-xl shadow-lg bg-white border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${
              suggestionsDirection === 'up' ? 'bottom-full mb-3' : 'top-full mt-3'
            }`}
            style={{
              maxHeight: '300px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
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
                    <span className="font-medium">{suggestion.display || suggestion.value}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {suggestion.type === 'filter' ? 'Filter' :
                       suggestion.type === 'clinic' ? 'Clinic' : 'City'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-gray-500 text-center italic">
                No results found. Try searching for a city or clinic name in Greater Vancouver.
              </li>
            )}
          </ul>
        )}

        {/* Search Button - Full Width */}
        <button
          onClick={handleSearch}
          className='w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-white hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium text-base cursor-pointer'
        >
          Search
        </button>

        {/* Example Queries Button */}
        <button
          onClick={() => setShowExamples(!showExamples)}
          className='text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1 mx-auto'
        >
          <SparklesIcon className='h-4 w-4' />
          Try example searches
        </button>

        {/* Example Queries Dropdown */}
        {showExamples && (
          <div className='absolute z-40 w-full mt-1 p-3 bg-white rounded-lg shadow-lg border border-gray-200'>
            <p className='text-xs font-medium text-gray-700 mb-2'>Example searches:</p>
            <div className='space-y-1'>
              {exampleQueries.slice(0, 4).map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors'
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className='hidden sm:flex items-center bg-slate-50 rounded-2xl shadow-sm border border-gray-400 relative'>
        <div className='flex items-center flex-1 min-w-0'>
          <div className='pl-8 pr-4'>
            <MagnifyingGlassIcon className='h-6 w-6 text-gray-600' />
          </div>
          <input
            ref={inputRef}
            type='text'
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className='flex-1 bg-transparent py-6 text-lg text-gray-800 placeholder-gray-500 focus:outline-none min-w-0'
          />
        </div>

        {/* Suggestions dropdown - Desktop */}
        {showSuggestions && (
          <ul
            ref={suggestionsRef}
            className={`absolute left-0 right-0 z-50 overflow-y-auto rounded-xl shadow-lg bg-white border border-gray-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ${
              suggestionsDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
            style={{
              maxHeight: '300px',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.3) transparent'
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
                    <span className="font-medium">{suggestion.display || suggestion.value}</span>
                    <span className="ml-2 text-sm text-gray-400">
                      {suggestion.type === 'filter' ? 'Filter' :
                       suggestion.type === 'clinic' ? 'Clinic' : 'City'}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-3 text-base text-gray-500 text-center italic">
                No results found. Try searching for a city or clinic name in Greater Vancouver.
              </li>
            )}
          </ul>
        )}

        {/* Vertical Divider */}
        <div className='h-12 w-0.5 bg-gray-700 mx-4 lg:mx-6' />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className='mr-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-10 lg:px-12 py-4 text-white hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium text-base cursor-pointer'
        >
          Search
        </button>
      </div>

      {/* Example Queries for Desktop */}
      <div className='hidden sm:flex items-center justify-center mt-3'>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className='text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1'
        >
          <SparklesIcon className='h-4 w-4' />
          Try example searches
        </button>
      </div>

      {/* Example Queries Dropdown - Desktop */}
      {showExamples && (
        <div className='hidden sm:block absolute z-40 left-1/2 transform -translate-x-1/2 mt-1 p-4 bg-white rounded-lg shadow-lg border border-gray-200' style={{ top: '100%', minWidth: '400px' }}>
          <p className='text-sm font-medium text-gray-700 mb-3'>Example searches you can try:</p>
          <div className='grid grid-cols-2 gap-2'>
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className='text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors'
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
