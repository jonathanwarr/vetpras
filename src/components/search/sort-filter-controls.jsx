'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/20/solid';
import RangeSlider from '@/components/ui/range-slider';

export default function SortFilterControls({ onSortChange, onFilterChange, onClearSearch, searchQuery = '', searchType = '', clinics = [] }) {
  // Sort state
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('clinic-asc');
  const [sortHighlightedIndex, setSortHighlightedIndex] = useState(0);

  // Filter dropdown states
  const [examFilterOpen, setExamFilterOpen] = useState(false);
  const [vaccineFilterOpen, setVaccineFilterOpen] = useState(false);
  const [spayFilterOpen, setSpayFilterOpen] = useState(false);
  const [neuterFilterOpen, setNeuterFilterOpen] = useState(false);
  const [ratingFilterOpen, setRatingFilterOpen] = useState(false);
  const [cityFilterOpen, setCityFilterOpen] = useState(false);

  // Mobile filter states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileActiveFilter, setMobileActiveFilter] = useState(null);

  // Range filter states [min, max] - null means no filter active
  const [examRange, setExamRange] = useState(null);
  const [vaccineRange, setVaccineRange] = useState(null);
  const [spayRange, setSpayRange] = useState(null);
  const [neuterRange, setNeuterRange] = useState(null);
  const [ratingRange, setRatingRange] = useState(null);
  const [cityFilters, setCityFilters] = useState([]);

  const sortRef = useRef(null);
  const examRef = useRef(null);
  const vaccineRef = useRef(null);
  const spayRef = useRef(null);
  const neuterRef = useRef(null);
  const ratingRef = useRef(null);
  const cityRef = useRef(null);
  const mobileFiltersRef = useRef(null);

  const sortOptions = [
    { value: 'clinic-asc', label: 'Clinic - Ascending' },
    { value: 'clinic-desc', label: 'Clinic - Descending' },
    { value: 'city-asc', label: 'City - Ascending' },
    { value: 'city-desc', label: 'City - Descending' },
    { value: 'exam-low', label: 'Lowest Exam Fee' },
    { value: 'vaccine-low', label: 'Lowest Vaccine Fee' },
    { value: 'rating-high', label: 'Highest Rating' },
  ];

  // Calculate dynamic price ranges from clinic data
  const priceRanges = useMemo(() => {
    const getRange = (field) => {
      const values = clinics
        .map(c => c[field])
        .filter(v => Number.isFinite(v) && v > 0);

      if (values.length === 0) return { min: 0, max: 500, step: 10 };

      const min = Math.floor(Math.min(...values) / 10) * 10;
      const max = Math.ceil(Math.max(...values) / 10) * 10;
      // Use larger steps for smoother sliding
      const step = max > 1000 ? 50 : max > 500 ? 20 : max > 200 ? 10 : 5;

      return { min, max, step };
    };

    return {
      exam: getRange('exam_fee'),
      vaccine: getRange('da2pp_vaccine'),
      spay: getRange('spay'),
      neuter: getRange('neuter'),
      rating: { min: 0, max: 5, step: 0.5 }, // Larger step for rating too
    };
  }, [clinics]);

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

  // Debounce timer ref
  const filterDebounceRef = useRef(null);

  // Notify parent of filter changes with debouncing
  const notifyFilterChange = useCallback(() => {
    // Clear existing timeout
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }

    // Set new timeout for debounced update
    filterDebounceRef.current = setTimeout(() => {
      if (onFilterChange) {
        const filterConfig = {
          exam: examRange ? { min: examRange[0], max: examRange[1] } : null,
          vaccine: vaccineRange ? { min: vaccineRange[0], max: vaccineRange[1] } : null,
          spay: spayRange ? { min: spayRange[0], max: spayRange[1] } : null,
          neuter: neuterRange ? { min: neuterRange[0], max: neuterRange[1] } : null,
          rating: ratingRange ? { min: ratingRange[0], max: ratingRange[1] } : null,
          city: cityFilters.map((f) => ({ value: f, label: f })),
        };
        onFilterChange(filterConfig);
      }
    }, 200); // 200ms debounce
  }, [examRange, vaccineRange, spayRange, neuterRange, ratingRange, cityFilters, onFilterChange]);

  // Trigger filter change when any filter changes
  useEffect(() => {
    notifyFilterChange();

    // Cleanup debounce timer on unmount
    return () => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
    };
  }, [notifyFilterChange]);

  // Range filter handlers
  const handleExamRangeChange = (range) => {
    setExamRange(range);
  };

  const handleVaccineRangeChange = (range) => {
    setVaccineRange(range);
  };

  const handleSpayRangeChange = (range) => {
    setSpayRange(range);
  };

  const handleNeuterRangeChange = (range) => {
    setNeuterRange(range);
  };

  const handleRatingRangeChange = (range) => {
    setRatingRange(range);
  };

  const handleCityFilterToggle = (value) => {
    const newFilters = cityFilters.includes(value)
      ? cityFilters.filter((f) => f !== value)
      : [...cityFilters, value];
    setCityFilters(newFilters);
  };

  // Remove individual filter
  const removeFilter = (type) => {
    if (type === 'search') {
      if (onClearSearch) {
        onClearSearch();
      }
    } else if (type === 'exam') {
      setExamRange(null);
    } else if (type === 'vaccine') {
      setVaccineRange(null);
    } else if (type === 'spay') {
      setSpayRange(null);
    } else if (type === 'neuter') {
      setNeuterRange(null);
    } else if (type === 'rating') {
      setRatingRange(null);
    } else if (type === 'city') {
      setCityFilters([]);
    }
  };

  // Remove individual city filter
  const removeCityFilter = (value) => {
    const newFilters = cityFilters.filter((f) => f !== value);
    setCityFilters(newFilters);
  };

  // Mobile filter handlers
  const handleMobileFilterSelect = (filterType) => {
    setMobileActiveFilter(filterType);
  };

  const handleMobileFilterBack = () => {
    setMobileActiveFilter(null);
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
      if (vaccineRef.current && !vaccineRef.current.contains(event.target)) setVaccineFilterOpen(false);
      if (spayRef.current && !spayRef.current.contains(event.target)) setSpayFilterOpen(false);
      if (neuterRef.current && !neuterRef.current.contains(event.target)) setNeuterFilterOpen(false);
      if (ratingRef.current && !ratingRef.current.contains(event.target)) setRatingFilterOpen(false);
      if (cityRef.current && !cityRef.current.contains(event.target)) setCityFilterOpen(false);
      if (mobileFiltersRef.current && !mobileFiltersRef.current.contains(event.target)) {
        setMobileFiltersOpen(false);
        setMobileActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilters = [
    // Add search filter if present
    ...(searchQuery?.trim() ? [{
      type: 'search',
      value: searchQuery,
      label: searchType === 'city' ? `${searchQuery} (City)` :
             searchType === 'clinic' ? `${searchQuery} (Clinic)` :
             searchType === 'service' ? `${searchQuery} (Service)` :
             searchType === 'category' ? `${searchQuery} (Category)` :
             searchType === 'address' ? `${searchQuery} (Address)` :
             searchType === 'province' ? `${searchQuery} (Province)` :
             searchQuery,
    }] : []),
    // Range filters
    ...(examRange ? [{
      type: 'exam',
      value: 'exam',
      label: `Exam: $${examRange[0]}-$${examRange[1]}`,
    }] : []),
    ...(vaccineRange ? [{
      type: 'vaccine',
      value: 'vaccine',
      label: `Vaccine: $${vaccineRange[0]}-$${vaccineRange[1]}`,
    }] : []),
    ...(spayRange ? [{
      type: 'spay',
      value: 'spay',
      label: `Spay: $${spayRange[0]}-$${spayRange[1]}`,
    }] : []),
    ...(neuterRange ? [{
      type: 'neuter',
      value: 'neuter',
      label: `Neuter: $${neuterRange[0]}-$${neuterRange[1]}`,
    }] : []),
    ...(ratingRange ? [{
      type: 'rating',
      value: 'rating',
      label: `Rating: ${ratingRange[0].toFixed(1)}-${ratingRange[1].toFixed(1)}`,
    }] : []),
    // City filters
    ...cityFilters.map((f) => ({
      type: 'city',
      value: f,
      label: f,
      isCityFilter: true,
    })),
  ];

  return (
    <div className="space-y-3">
      {/* Active filters pills */}
      <div className="min-h-[44px] flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {activeFilters.length > 0 && (
          <>
            <span className="text-sm font-medium text-slate-700">
              Active Filters:
            </span>
            {activeFilters.map((filter, index) => (
              <span
                key={`${filter.type}-${filter.value}-${index}`}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-bold text-white"
              >
              {filter.label}
                <button
                  onClick={() => filter.isCityFilter ? removeCityFilter(filter.value) : removeFilter(filter.type)}
                  className="ml-1 hover:opacity-70 cursor-pointer"
                >
                  <XMarkIcon className="h-4 w-4 font-bold stroke-2" />
                </button>
              </span>
            ))}
          </>
        )}
      </div>

      {/* Desktop: Sort and Filter controls on same line */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        {/* Sort on left */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            onKeyDown={handleSortKeyDown}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
          >
            <span>Sort</span>
            {sortOpen ? (
              <ChevronUpIcon className="h-4 w-4 text-blue-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {sortOpen && (
            <div
              className="absolute z-50 mt-1 w-48 rounded-md shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
            >
              {sortOptions.map((option, index) => (
                <button
                  key={option.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSortSelect(option.value);
                  }}
                  className="w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer"
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

        {/* Filter controls on right */}
        <div className="flex items-center gap-4">
          {/* City filter */}
          <div ref={cityRef} className="relative">
            <button
              onClick={() => setCityFilterOpen(!cityFilterOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              {cityFilterOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
              <span>City</span>
            </button>

            {cityFilterOpen && (
              <div
                className="absolute right-0 z-50 mt-1 max-h-64 w-56 overflow-auto rounded-md p-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
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
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              {examFilterOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
              <span>Exam</span>
            </button>

            {examFilterOpen && (
              <div
                className="absolute right-0 z-50 mt-1 w-64 rounded-md p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                <RangeSlider
                  min={priceRanges.exam.min}
                  max={priceRanges.exam.max}
                  step={priceRanges.exam.step}
                  value={examRange || [priceRanges.exam.min, priceRanges.exam.max]}
                  onChange={handleExamRangeChange}
                  label="Exam Fee"
                  formatLabel={(val) => `$${Math.round(val)}`}
                />
              </div>
            )}
          </div>

          {/* Vaccine filter */}
          <div ref={vaccineRef} className="relative">
            <button
              onClick={() => setVaccineFilterOpen(!vaccineFilterOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              {vaccineFilterOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
              <span>Vaccine</span>
            </button>

            {vaccineFilterOpen && (
              <div
                className="absolute right-0 z-50 mt-1 w-64 rounded-md p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                <RangeSlider
                  min={priceRanges.vaccine.min}
                  max={priceRanges.vaccine.max}
                  step={priceRanges.vaccine.step}
                  value={vaccineRange || [priceRanges.vaccine.min, priceRanges.vaccine.max]}
                  onChange={handleVaccineRangeChange}
                  label="Core Vaccine"
                  formatLabel={(val) => `$${Math.round(val)}`}
                />
              </div>
            )}
          </div>

          {/* Spay filter */}
          <div ref={spayRef} className="relative">
            <button
              onClick={() => setSpayFilterOpen(!spayFilterOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              {spayFilterOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
              <span>Spay</span>
            </button>

            {spayFilterOpen && (
              <div
                className="absolute right-0 z-50 mt-1 w-64 rounded-md p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                <RangeSlider
                  min={priceRanges.spay.min}
                  max={priceRanges.spay.max}
                  step={priceRanges.spay.step}
                  value={spayRange || [priceRanges.spay.min, priceRanges.spay.max]}
                  onChange={handleSpayRangeChange}
                  label="Spay"
                  formatLabel={(val) => `$${Math.round(val)}`}
                />
              </div>
            )}
          </div>

          {/* Neuter filter */}
          <div ref={neuterRef} className="relative">
            <button
              onClick={() => setNeuterFilterOpen(!neuterFilterOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              {neuterFilterOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
              <span>Neuter</span>
            </button>

            {neuterFilterOpen && (
              <div
                className="absolute right-0 z-50 mt-1 w-64 rounded-md p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                <RangeSlider
                  min={priceRanges.neuter.min}
                  max={priceRanges.neuter.max}
                  step={priceRanges.neuter.step}
                  value={neuterRange || [priceRanges.neuter.min, priceRanges.neuter.max]}
                  onChange={handleNeuterRangeChange}
                  label="Neuter"
                  formatLabel={(val) => `$${Math.round(val)}`}
                />
              </div>
            )}
          </div>

          {/* Rating filter */}
          <div ref={ratingRef} className="relative">
            <button
              onClick={() => setRatingFilterOpen(!ratingFilterOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              {ratingFilterOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
              <span>Rating</span>
            </button>

            {ratingFilterOpen && (
              <div
                className="absolute right-0 z-50 mt-1 w-64 rounded-md p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                <RangeSlider
                  min={priceRanges.rating.min}
                  max={priceRanges.rating.max}
                  step={priceRanges.rating.step}
                  value={ratingRange || [priceRanges.rating.min, priceRanges.rating.max]}
                  onChange={handleRatingRangeChange}
                  label="Rating"
                  formatLabel={(val) => val.toFixed(1)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Stacked Sort and Filters */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center justify-between">
          {/* Mobile Sort */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              onKeyDown={handleSortKeyDown}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <span>Sort</span>
              {sortOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {sortOpen && (
              <div
                className="absolute z-50 mt-1 w-48 rounded-md shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                {sortOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSortSelect(option.value);
                    }}
                    className="w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer"
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

          {/* Mobile Filters Button */}
          <div ref={mobileFiltersRef} className="relative">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium transition-colors text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <span>Filters</span>
              {mobileFiltersOpen ? (
                <ChevronUpIcon className="h-4 w-4 text-blue-500" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {mobileFiltersOpen && (
              <div
                className="absolute right-0 z-50 mt-1 w-80 rounded-md shadow-lg animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1' }}
              >
                {!mobileActiveFilter ? (
                  // Filter categories list
                  <div className="p-2">
                    <div className="px-2 py-1.5 text-sm font-medium" style={{ color: '#0F172B' }}>
                      Select Filter Type
                    </div>
                    <button
                      onClick={() => handleMobileFilterSelect('city')}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm text-left rounded hover:bg-slate-200 transition-colors"
                      style={{ color: '#475569' }}
                    >
                      <span>City</span>
                      {cityFilters.length > 0 && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#E2E8F0', color: '#475569' }}
                        >
                          {cityFilters.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleMobileFilterSelect('exam')}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm text-left rounded hover:bg-slate-200 transition-colors"
                      style={{ color: '#475569' }}
                    >
                      <span>Exam</span>
                      {examRange && <span className="text-xs" style={{ color: '#2C7FFF' }}>●</span>}
                    </button>
                    <button
                      onClick={() => handleMobileFilterSelect('vaccine')}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm text-left rounded hover:bg-slate-200 transition-colors"
                      style={{ color: '#475569' }}
                    >
                      <span>Vaccine</span>
                      {vaccineRange && <span className="text-xs" style={{ color: '#2C7FFF' }}>●</span>}
                    </button>
                    <button
                      onClick={() => handleMobileFilterSelect('spay')}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm text-left rounded hover:bg-slate-200 transition-colors"
                      style={{ color: '#475569' }}
                    >
                      <span>Spay</span>
                      {spayRange && <span className="text-xs" style={{ color: '#2C7FFF' }}>●</span>}
                    </button>
                    <button
                      onClick={() => handleMobileFilterSelect('neuter')}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm text-left rounded hover:bg-slate-200 transition-colors"
                      style={{ color: '#475569' }}
                    >
                      <span>Neuter</span>
                      {neuterRange && <span className="text-xs" style={{ color: '#2C7FFF' }}>●</span>}
                    </button>
                    <button
                      onClick={() => handleMobileFilterSelect('rating')}
                      className="w-full flex items-center justify-between px-2 py-2 text-sm text-left rounded hover:bg-slate-200 transition-colors"
                      style={{ color: '#475569' }}
                    >
                      <span>Rating</span>
                      {ratingRange && <span className="text-xs" style={{ color: '#2C7FFF' }}>●</span>}
                    </button>
                  </div>
                ) : (
                  // Individual filter options
                  <div className="p-2">
                    <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-200 mb-2">
                      <button
                        onClick={handleMobileFilterBack}
                        className="text-sm font-medium transition-colors hover:opacity-70"
                        style={{ color: '#2C7FFF' }}
                      >
                        ← Back
                      </button>
                      <span className="text-sm font-medium" style={{ color: '#0F172B' }}>
                        {mobileActiveFilter === 'city' && 'City'}
                        {mobileActiveFilter === 'exam' && 'Exam'}
                        {mobileActiveFilter === 'vaccine' && 'Vaccine'}
                        {mobileActiveFilter === 'spay' && 'Spay'}
                        {mobileActiveFilter === 'neuter' && 'Neuter'}
                        {mobileActiveFilter === 'rating' && 'Rating'}
                      </span>
                    </div>
                    <div className="px-2 pb-2">
                      {mobileActiveFilter === 'city' && (
                        <div className="max-h-64 overflow-auto">
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
                      {mobileActiveFilter === 'exam' && (
                        <RangeSlider
                          min={priceRanges.exam.min}
                          max={priceRanges.exam.max}
                          step={priceRanges.exam.step}
                          value={examRange || [priceRanges.exam.min, priceRanges.exam.max]}
                          onChange={handleExamRangeChange}
                          label="Exam Fee"
                          formatLabel={(val) => `$${Math.round(val)}`}
                        />
                      )}
                      {mobileActiveFilter === 'vaccine' && (
                        <RangeSlider
                          min={priceRanges.vaccine.min}
                          max={priceRanges.vaccine.max}
                          step={priceRanges.vaccine.step}
                          value={vaccineRange || [priceRanges.vaccine.min, priceRanges.vaccine.max]}
                          onChange={handleVaccineRangeChange}
                          label="Core Vaccine"
                          formatLabel={(val) => `$${Math.round(val)}`}
                        />
                      )}
                      {mobileActiveFilter === 'spay' && (
                        <RangeSlider
                          min={priceRanges.spay.min}
                          max={priceRanges.spay.max}
                          step={priceRanges.spay.step}
                          value={spayRange || [priceRanges.spay.min, priceRanges.spay.max]}
                          onChange={handleSpayRangeChange}
                          label="Spay"
                          formatLabel={(val) => `$${Math.round(val)}`}
                        />
                      )}
                      {mobileActiveFilter === 'neuter' && (
                        <RangeSlider
                          min={priceRanges.neuter.min}
                          max={priceRanges.neuter.max}
                          step={priceRanges.neuter.step}
                          value={neuterRange || [priceRanges.neuter.min, priceRanges.neuter.max]}
                          onChange={handleNeuterRangeChange}
                          label="Neuter"
                          formatLabel={(val) => `$${Math.round(val)}`}
                        />
                      )}
                      {mobileActiveFilter === 'rating' && (
                        <RangeSlider
                          min={priceRanges.rating.min}
                          max={priceRanges.rating.max}
                          step={priceRanges.rating.step}
                          value={ratingRange || [priceRanges.rating.min, priceRanges.rating.max]}
                          onChange={handleRatingRangeChange}
                          label="Rating"
                          formatLabel={(val) => val.toFixed(1)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}