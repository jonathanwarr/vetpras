'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/20/solid';

export default function SortFilterControls({ onSortChange, onFilterChange, clinics = [] }) {
  // Sort state
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('clinic-asc');
  const [sortHighlightedIndex, setSortHighlightedIndex] = useState(0);

  // Filter states
  const [examFilterOpen, setExamFilterOpen] = useState(false);
  const [vaccineFilterOpen, setVaccineFilterOpen] = useState(false);
  const [ratingFilterOpen, setRatingFilterOpen] = useState(false);
  const [cityFilterOpen, setCityFilterOpen] = useState(false);

  const [examFilters, setExamFilters] = useState([]);
  const [vaccineFilters, setVaccineFilters] = useState([]);
  const [ratingFilters, setRatingFilters] = useState([]);
  const [cityFilters, setCityFilters] = useState([]);

  const sortRef = useRef(null);
  const examRef = useRef(null);
  const vaccineRef = useRef(null);
  const ratingRef = useRef(null);
  const cityRef = useRef(null);

  const sortOptions = [
    { value: 'clinic-asc', label: 'Clinic - Ascending' },
    { value: 'clinic-desc', label: 'Clinic - Descending' },
    { value: 'city-asc', label: 'City - Ascending' },
    { value: 'city-desc', label: 'City - Descending' },
    { value: 'nearest', label: 'Nearest' },
    { value: 'exam-low', label: 'Lowest Exam Fee' },
    { value: 'vaccine-low', label: 'Lowest Vaccine Fee' },
    { value: 'rating-high', label: 'Highest Rating' },
  ];

  const examFilterOptions = [
    { value: 'less-50', label: 'Less than $50', range: [0, 50] },
    { value: '50-64', label: '$50 to $64', range: [50, 64] },
    { value: '65-80', label: '$65 to $80', range: [65, 80] },
    { value: 'more-80', label: 'More than $80', range: [80, Infinity] },
  ];

  const vaccineFilterOptions = [
    { value: 'less-40', label: 'Less than $40', range: [0, 40] },
    { value: '40-49', label: '$40 to $49', range: [40, 49] },
    { value: '50-75', label: '$50 to $75', range: [50, 75] },
    { value: 'more-75', label: 'More than $75', range: [75, Infinity] },
  ];

  const ratingFilterOptions = [
    { value: '5-stars', label: '5 Stars', range: [5, 5] },
    { value: '4.5-plus', label: '4.5+ Stars', range: [4.5, 5] },
    { value: '4-plus', label: '4.0+ Stars', range: [4, 5] },
    { value: '0-3.9', label: '0 to 3.9 Stars', range: [0, 3.9] },
  ];

  // Build City options dynamically from clinics
  const cityOptions = useMemo(() => {
    const cities = new Set(
      clinics.map((c) => c?.city || c?.address?.city || c?.location?.city || '').filter(Boolean)
    );
    return Array.from(cities)
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ value: name, label: name }));
  }, [clinics]);

  // Handle sort selection
  const handleSortSelect = (value) => {
    setSelectedSort(value);
    setSortOpen(false);
    if (onSortChange) onSortChange(value);
  };

  // Handle filter changes
  const notifyFilterChange = (filters) => {
    if (onFilterChange) {
      const filterConfig = {
        exam: filters.exam.map((f) => examFilterOptions.find((opt) => opt.value === f)),
        vaccine: filters.vaccine.map((f) => vaccineFilterOptions.find((opt) => opt.value === f)),
        rating: filters.rating.map((f) => ratingFilterOptions.find((opt) => opt.value === f)),
        city: filters.city.map((f) => ({ value: f, label: f })),
      };
      onFilterChange(filterConfig);
    }
  };

  const handleExamFilterToggle = (value) => {
    const newFilters = examFilters.includes(value)
      ? examFilters.filter((f) => f !== value)
      : [...examFilters, value];
    setExamFilters(newFilters);
    notifyFilterChange({
      exam: newFilters,
      vaccine: vaccineFilters,
      rating: ratingFilters,
      city: cityFilters,
    });
  };

  const handleVaccineFilterToggle = (value) => {
    const newFilters = vaccineFilters.includes(value)
      ? vaccineFilters.filter((f) => f !== value)
      : [...vaccineFilters, value];
    setVaccineFilters(newFilters);
    notifyFilterChange({
      exam: examFilters,
      vaccine: newFilters,
      rating: ratingFilters,
      city: cityFilters,
    });
  };

  const handleRatingFilterToggle = (value) => {
    const newFilters = ratingFilters.includes(value)
      ? ratingFilters.filter((f) => f !== value)
      : [...ratingFilters, value];
    setRatingFilters(newFilters);
    notifyFilterChange({
      exam: examFilters,
      vaccine: vaccineFilters,
      rating: newFilters,
      city: cityFilters,
    });
  };

  const handleCityFilterToggle = (value) => {
    const newFilters = cityFilters.includes(value)
      ? cityFilters.filter((f) => f !== value)
      : [...cityFilters, value];
    setCityFilters(newFilters);
    notifyFilterChange({
      exam: examFilters,
      vaccine: vaccineFilters,
      rating: ratingFilters,
      city: newFilters,
    });
  };

  // Remove individual filter
  const removeFilter = (type, value) => {
    if (type === 'exam') {
      const newFilters = examFilters.filter((f) => f !== value);
      setExamFilters(newFilters);
      notifyFilterChange({
        exam: newFilters,
        vaccine: vaccineFilters,
        rating: ratingFilters,
        city: cityFilters,
      });
    } else if (type === 'vaccine') {
      const newFilters = vaccineFilters.filter((f) => f !== value);
      setVaccineFilters(newFilters);
      notifyFilterChange({
        exam: examFilters,
        vaccine: newFilters,
        rating: ratingFilters,
        city: cityFilters,
      });
    } else if (type === 'rating') {
      const newFilters = ratingFilters.filter((f) => f !== value);
      setRatingFilters(newFilters);
      notifyFilterChange({
        exam: examFilters,
        vaccine: vaccineFilters,
        rating: newFilters,
        city: cityFilters,
      });
    } else if (type === 'city') {
      const newFilters = cityFilters.filter((f) => f !== value);
      setCityFilters(newFilters);
      notifyFilterChange({
        exam: examFilters,
        vaccine: vaccineFilters,
        rating: ratingFilters,
        city: newFilters,
      });
    }
  };

  // Handle keyboard navigation for sort
  const handleSortKeyDown = (e) => {
    if (!sortOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSortHighlightedIndex((prev) => (prev < sortOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSortHighlightedIndex((prev) => (prev > 0 ? prev - 1 : sortOptions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        handleSortSelect(sortOptions[sortHighlightedIndex].value);
        break;
      case 'Escape':
        e.preventDefault();
        setSortOpen(false);
        break;
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) setSortOpen(false);
      if (examRef.current && !examRef.current.contains(event.target)) setExamFilterOpen(false);
      if (vaccineRef.current && !vaccineRef.current.contains(event.target))
        setVaccineFilterOpen(false);
      if (ratingRef.current && !ratingRef.current.contains(event.target))
        setRatingFilterOpen(false);
      if (cityRef.current && !cityRef.current.contains(event.target)) setCityFilterOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilters = [
    ...examFilters.map((f) => ({
      type: 'exam',
      value: f,
      label: examFilterOptions.find((opt) => opt.value === f)?.label,
    })),
    ...vaccineFilters.map((f) => ({
      type: 'vaccine',
      value: f,
      label: vaccineFilterOptions.find((opt) => opt.value === f)?.label,
    })),
    ...ratingFilters.map((f) => ({
      type: 'rating',
      value: f,
      label: ratingFilterOptions.find((opt) => opt.value === f)?.label,
    })),
    ...cityFilters.map((f) => ({
      type: 'city',
      value: f,
      label: f,
    })),
  ];

  return (
    <div className="space-y-3">
      {/* Active filters pills */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          <span className="text-sm font-medium" style={{ color: '#0F172B' }}>
            Active Filters:
          </span>
          {activeFilters.map((filter, index) => (
            <span
              key={`${filter.type}-${filter.value}-${index}`}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs"
              style={{ backgroundColor: '#E2E8F0', color: '#475569' }}
            >
              {filter.label}
              <button
                onClick={() => removeFilter(filter.type, filter.value)}
                className="ml-1 hover:opacity-70"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Sort and filter controls */}
      <div className="flex items-center gap-4">
        {/* Sort dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            onKeyDown={handleSortKeyDown}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#0F172B' }}
          >
            <span>Sort</span>
            {sortOpen ? (
              <ChevronUpIcon className="h-4 w-4" style={{ color: '#2C7FFF' }} />
            ) : (
              <ChevronDownIcon className="h-4 w-4" style={{ color: '#45556C' }} />
            )}
          </button>

          {sortOpen && (
            <div
              className="absolute z-50 mt-1 w-48 rounded-md shadow-lg"
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
            >
              {sortOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className="w-full px-3 py-2 text-left text-sm transition-colors"
                  style={{
                    backgroundColor: index === sortHighlightedIndex ? '#CBD5E1' : 'transparent',
                    color:
                      selectedSort === option.value
                        ? '#2C7FFF'
                        : index === sortHighlightedIndex
                          ? '#1E293B'
                          : '#64748B',
                  }}
                  onMouseEnter={() => setSortHighlightedIndex(index)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* City filter */}
        <div ref={cityRef} className="relative">
          <button
            onClick={() => setCityFilterOpen(!cityFilterOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#0F172B' }}
          >
            <span>City</span>
            {cityFilterOpen ? (
              <ChevronUpIcon className="h-4 w-4" style={{ color: '#2C7FFF' }} />
            ) : (
              <ChevronDownIcon className="h-4 w-4" style={{ color: '#45556C' }} />
            )}
          </button>

          {cityFilterOpen && (
            <div
              className="absolute z-50 mt-1 max-h-64 w-56 overflow-auto rounded-md p-2 shadow-lg"
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
            >
              {cityOptions.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-slate-500">No cities found</div>
              ) : (
                cityOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={cityFilters.includes(option.value)}
                      onChange={() => handleCityFilterToggle(option.value)}
                      className="rounded border-gray-300"
                    />
                    <span style={{ color: '#475569' }}>{option.label}</span>
                  </label>
                ))
              )}
            </div>
          )}
        </div>

        {/* Exam filter */}
        <div ref={examRef} className="relative">
          <button
            onClick={() => setExamFilterOpen(!examFilterOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#0F172B' }}
          >
            <span>Exam</span>
            {examFilterOpen ? (
              <ChevronUpIcon className="h-4 w-4" style={{ color: '#2C7FFF' }} />
            ) : (
              <ChevronDownIcon className="h-4 w-4" style={{ color: '#45556C' }} />
            )}
          </button>

          {examFilterOpen && (
            <div
              className="absolute z-50 mt-1 w-48 rounded-md p-2 shadow-lg"
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
            >
              {examFilterOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={examFilters.includes(option.value)}
                    onChange={() => handleExamFilterToggle(option.value)}
                    className="rounded border-gray-300"
                  />
                  <span style={{ color: '#475569' }}>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Vaccine filter */}
        <div ref={vaccineRef} className="relative">
          <button
            onClick={() => setVaccineFilterOpen(!vaccineFilterOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#0F172B' }}
          >
            <span>Vaccine</span>
            {vaccineFilterOpen ? (
              <ChevronUpIcon className="h-4 w-4" style={{ color: '#2C7FFF' }} />
            ) : (
              <ChevronDownIcon className="h-4 w-4" style={{ color: '#45556C' }} />
            )}
          </button>

          {vaccineFilterOpen && (
            <div
              className="absolute z-50 mt-1 w-48 rounded-md p-2 shadow-lg"
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
            >
              {vaccineFilterOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={vaccineFilters.includes(option.value)}
                    onChange={() => handleVaccineFilterToggle(option.value)}
                    className="rounded border-gray-300"
                  />
                  <span style={{ color: '#475569' }}>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating filter */}
        <div ref={ratingRef} className="relative">
          <button
            onClick={() => setRatingFilterOpen(!ratingFilterOpen)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors"
            style={{ color: '#0F172B' }}
          >
            <span>Rating</span>
            {ratingFilterOpen ? (
              <ChevronUpIcon className="h-4 w-4" style={{ color: '#2C7FFF' }} />
            ) : (
              <ChevronDownIcon className="h-4 w-4" style={{ color: '#45556C' }} />
            )}
          </button>

          {ratingFilterOpen && (
            <div
              className="absolute z-50 mt-1 w-48 rounded-md p-2 shadow-lg"
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
            >
              {ratingFilterOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={ratingFilters.includes(option.value)}
                    onChange={() => handleRatingFilterToggle(option.value)}
                    className="rounded border-gray-300"
                  />
                  <span style={{ color: '#475569' }}>{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
