'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@vercel/analytics/next';
import Link from 'next/link';

import ContainerConstrained from '@/components/layout/container-constrained';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/ui/scroll-to-top';

import TableClinic from '@/components/clinics/table-clinic';
import DrawerClinic from '@/components/clinics/drawer-clinic';
import Pagination from '@/components/clinics/pagination';

// New components
import SearchBar from '@/components/search/search-bar';
import SortFilterControls from '@/components/search/sort-filter-controls';

export default function ClinicsPage() {
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

  const scrollToSearchArea = () => {
    if (searchAreaRef.current) {
      searchAreaRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handlePaginationPrev = () => {
    setCurrentPage(currentPage - 1);
    scrollToSearchArea();
  };

  const handlePaginationNext = () => {
    setCurrentPage(currentPage + 1);
    scrollToSearchArea();
  };

  const handleSortChange = (newSort) => {
    setSortOption(newSort);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="pt-12 pb-20 sm:pt-24 sm:pb-12">
      <ContainerConstrained>
        <div className="mb-10">
          <h2 className="mt-20 mb-2 flex justify-center font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-balance">
            Find a Vet
          </h2>
          <p className="flex justify-center space-y-5 text-center font-sans text-lg font-light text-slate-900">
            Search for vets by clinic name, city or treatment.
          </p>
        </div>

        {/* New Search Bar */}
        <div ref={searchAreaRef} className="mb-6 flex justify-center pb-10">
          <SearchBar clinics={clinics} services={services} onSearchChange={handleSearchChange} />
        </div>

        {/* Sort and Filter Controls */}
        <div className="mb-6">
          <SortFilterControls
            clinics={clinics}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
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
          <p className="text-xs italic text-gray-600">
            Cost estimates only. Actual prices may vary based on your pet's specific needs, location, and clinic policies. See{' '}
            <Link href="/terms-and-conditions" className="text-blue-600 hover:text-blue-700 underline">
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
