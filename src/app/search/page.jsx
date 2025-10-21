'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
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
  const [activeFilters, setActiveFilters] = useState({ exam: [], vaccine: [], rating: [] });

  const searchAreaRef = useRef(null);

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('query');
    const type = searchParams.get('type');

    if (query) {
      setSearchQuery(query);
      setSearchType(type || 'text');
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
  };

  return (
    <div className="pt-32 pb-20 sm:pt-40 sm:pb-32 bg-slate-50 min-h-screen">
      {/* Search Section */}
      <ContainerConstrained>
        <div className="mx-auto max-w-4xl">
          <div ref={searchAreaRef}>
            <VetprasSearch
              clinics={clinics}
              services={services}
              placeholder="City or clinic name"
              suggestionsDirection="down"
              variant="default"
            />
          </div>
        </div>
      </ContainerConstrained>

      {/* Sort and Filter Controls */}
      <ContainerConstrained>
        <div className="mt-8 mb-6">
          <SortFilterControls
            clinics={clinics}
            searchQuery={searchQuery}
            searchType={searchType}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            onClearSearch={handleClearSearch}
          />
        </div>
      </ContainerConstrained>

      <ContainerConstrained>
        <p className="mb-3 text-sm text-slate-600 italic lg:hidden">
          Tap any clinic to view full details
        </p>
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
