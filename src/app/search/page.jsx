'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import ContainerConstrained from '@/components/layout/container-constrained';
import TableClinic from '@/components/clinics/table-clinic';
import DrawerClinic from '@/components/clinics/drawer-clinic';
import Pagination from '@/components/clinics/pagination';
import VetprasSearch from '@/components/features/vetpras-search';
import SortFilterControls from '@/components/search/sort-filter-controls';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('');
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortOption, setSortOption] = useState('clinic-asc');
  const [activeFilters, setActiveFilters] = useState({ exam: null, vaccine: null, spay: null, neuter: null, rating: null, city: [] });
  const [nlpInterpretation, setNlpInterpretation] = useState('');

  const searchAreaRef = useRef(null);

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('query');
    const type = searchParams.get('type');
    const filters = searchParams.get('filters');

    if (query) {
      setSearchQuery(query);
      setSearchType(type || 'text');
    }

    // Handle NLP filters
    if (type === 'nlp' && filters) {
      try {
        const parsedFilters = JSON.parse(filters);

        // Convert NLP filters to the format expected by activeFilters
        const newActiveFilters = {
          exam: parsedFilters.exam || null,
          vaccine: parsedFilters.vaccine || null,
          spay: parsedFilters.spay || null,
          neuter: parsedFilters.neuter || null,
          rating: parsedFilters.rating || null,
          city: parsedFilters.city || [],
        };

        setActiveFilters(newActiveFilters);

        // Generate interpretation for display
        const parts = [];
        if (parsedFilters.exam) parts.push(`exam $${parsedFilters.exam.min}-$${parsedFilters.exam.max}`);
        if (parsedFilters.vaccine) parts.push(`vaccine $${parsedFilters.vaccine.min}-$${parsedFilters.vaccine.max}`);
        if (parsedFilters.spay) parts.push(`spay $${parsedFilters.spay.min}-$${parsedFilters.spay.max}`);
        if (parsedFilters.neuter) parts.push(`neuter $${parsedFilters.neuter.min}-$${parsedFilters.neuter.max}`);
        if (parsedFilters.rating) parts.push(`${parsedFilters.rating.min}+ star rating`);
        if (parsedFilters.city && parsedFilters.city.length > 0) parts.push(`in ${parsedFilters.city.join(', ')}`);

        if (parts.length > 0) {
          setNlpInterpretation(parts.join(', '));
        }
      } catch (e) {
        console.error('Failed to parse NLP filters:', e);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: clinicList, error: clinicError }, { data: serviceList, error: serviceError }] =
        await Promise.all([
          supabase.from('vet_clinics').select('*'),
          supabase
            .from('vet_services')
            .select('service, service_code, parent_code, sort_order')
            .order('sort_order', { ascending: true }),
        ]);

      if (clinicError) {
        console.error('[Supabase] Error loading clinics:', clinicError);
      } else {
        setClinics(clinicList || []);
      }

      if (serviceError) {
        console.error('[Supabase] Error loading services:', serviceError);
      } else {
        setServices(serviceList || []);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchType, sortOption, activeFilters]);

  const handleCloseDrawer = () => setSelectedClinic(null);

  const handleSearchChange = ({ query, type }) => {
    setSearchQuery(query);
    setSearchType(type);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchType('');
    setNlpInterpretation('');
  };

  const scrollToSearchArea = () => {
    if (searchAreaRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        searchAreaRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  };

  const handlePaginationPrev = () => {
    setCurrentPage(currentPage - 1);
    // Delay scroll slightly to allow table to update
    setTimeout(scrollToSearchArea, 100);
  };

  const handlePaginationNext = () => {
    setCurrentPage(currentPage + 1);
    // Delay scroll slightly to allow table to update
    setTimeout(scrollToSearchArea, 100);
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    // Don't clear NLP state - the filters are working correctly
    // Users can manually adjust NLP-applied filters without losing the context
  };

  const handleNaturalLanguageSearch = (parsedQuery) => {
    // Update search query if there's text
    if (parsedQuery.searchText) {
      setSearchQuery(parsedQuery.searchText);
      setSearchType('nlp');
    } else {
      setSearchQuery('');
      setSearchType('nlp');
    }

    // Set interpretation for visual feedback
    setNlpInterpretation(parsedQuery.interpretation || '');

    // Update filters from parsed query
    const newActiveFilters = {
      exam: parsedQuery.filters.exam || null,
      vaccine: parsedQuery.filters.vaccine || null,
      spay: parsedQuery.filters.spay || null,
      neuter: parsedQuery.filters.neuter || null,
      rating: parsedQuery.filters.rating || null,
      city: parsedQuery.filters.city || [],
    };

    setActiveFilters(newActiveFilters);
  };

  return (
    <div className="pt-32 pb-20 sm:pt-40 sm:pb-32 bg-white min-h-screen">
      {/* Search Section */}
      <ContainerConstrained>
        <div className="mx-auto max-w-4xl">
          {/* Search Component */}
          <div ref={searchAreaRef}>
            <VetprasSearch
              clinics={clinics}
              services={services}
              placeholder='Try "exam under $80" or "4 star clinics"'
              suggestionsDirection="down"
              onNaturalLanguageSearch={handleNaturalLanguageSearch}
            />
          </div>
        </div>
      </ContainerConstrained>

      {/* NLP Interpretation Feedback */}
      {nlpInterpretation && (
        <ContainerConstrained>
          <div className="mt-6 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-4xl mx-auto">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-900 font-medium">
                  Applied filters: {nlpInterpretation}
                </p>
              </div>
            </div>
          </div>
        </ContainerConstrained>
      )}

      {/* Sort and Filter Controls */}
      <ContainerConstrained>
        <div className="mt-12 mb-6">
          <SortFilterControls
            clinics={clinics}
            searchQuery={searchQuery}
            searchType={searchType}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            onClearSearch={handleClearSearch}
            initialFilters={searchType === 'nlp' ? activeFilters : null}
          />
        </div>
      </ContainerConstrained>

      <ContainerConstrained>
        <TableClinic
          onSelectClinic={setSelectedClinic}
          searchQuery={searchQuery}
          searchType={searchType}
          sortOption={sortOption}
          activeFilters={activeFilters}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onTotalPages={setTotalPages}
          onTotalResults={setTotalResults}
          clinics={clinics}
          services={services}
        />
        <div className="mt-4">
          <p className="text-xs text-gray-600 italic">
            Cost <strong className="font-bold">estimates</strong> only from aggregated bill and quote submissions. Actual prices may vary based on your pet's specific needs,
            location, and clinic policies. See{' '}
            <Link
              href="/terms-and-conditions"
              className="text-blue-600 underline hover:text-blue-700"
            >
              Terms & Conditions
            </Link>{' '}
            for details.
          </p>
        </div>
        <div className="mt-15">
          <Pagination
            current={currentPage}
            total={totalResults}
            perPage={15}
            onPrev={handlePaginationPrev}
            onNext={handlePaginationNext}
          />
        </div>
      </ContainerConstrained>

      <DrawerClinic clinic={selectedClinic} onClose={handleCloseDrawer} services={services} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
