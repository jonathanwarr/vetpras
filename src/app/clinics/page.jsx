'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

import ContainerConstrained from '@/components/layout/container-constrained';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/ui/scroll-to-top';

import TableClinic from '@/components/clinics/table-clinic';
import DrawerClinic from '@/components/clinics/drawer-clinic';
import Pagination from '@/components/clinics/pagination';

import SearchCategory from '@/components/forms/search-category';
import SearchService from '@/components/forms/search-service';

export default function ClinicsPage() {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    async function fetchServices() {
      const { data: serviceList, error } = await supabase
        .from('vet_services')
        .select('service, service_code, parent_code, sort_order')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('[Supabase] Error loading services:', error);
      } else {
        setServices(serviceList);
      }
    }

    fetchServices();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryQuery]);

  const handleCloseDrawer = () => setSelectedClinic(null);
  const handleCategoryChange = (categoryName) => setCategoryQuery(categoryName);

  return (
    <div className="pt-12 pb-20 sm:pt-24 sm:pb-12">
      <ContainerConstrained>
        <div className="mb-16">
          <h2 className="mt-20 mb-6 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-balance">
            Search for a Service
          </h2>
          <p className="space-y-5 font-sans text-lg font-light text-slate-900">
            Use the search to find clinics that offer the care your pet needs. The list will filter
            and only show clinics that have listed the service you're looking for.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="mb-5 w-full flex-1 md:w-auto">
            <SearchCategory services={services} onCategoryChange={handleCategoryChange} />
          </div>
          <div className="mb-5 w-full flex-2 md:w-auto">
            <SearchService value={searchQuery} onChange={setSearchQuery} services={services} />
          </div>
        </div>
      </ContainerConstrained>

      <ContainerConstrained>
        <TableClinic
          onSelectClinic={setSelectedClinic}
          searchQuery={categoryQuery || searchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onTotalPages={setTotalPages}
          onTotalResults={setTotalResults}
        />
        <div className="mt-15">
          <Pagination
            current={currentPage}
            total={totalResults}
            perPage={15}
            onPrev={() => setCurrentPage(currentPage - 1)}
            onNext={() => setCurrentPage(currentPage + 1)}
          />
        </div>
      </ContainerConstrained>

      <DrawerClinic clinic={selectedClinic} onClose={handleCloseDrawer} services={services} />
    </div>
  );
}
