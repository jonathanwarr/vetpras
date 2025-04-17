'use client';

import { useEffect, useState } from 'react';
import TableClinic from '@/components/clinics/table-clinic';
import DrawerClinic from '@/components/clinics/drawer-clinic';
import ContainerConstrained from '@/components/layout/container-constrained';
import SearchCategory from '@/components/forms/search-category';
import SearchService from '@/components/forms/search-service';
import { supabase } from '@/lib/supabase';

export default function ClinicsPage() {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data: serviceList, error } = await supabase.from('services').select('*');

      if (error) {
        console.error('[Supabase] Error loading services:', error);
      } else {
        setServices(serviceList);
      }
    };

    fetchServices();
  }, []);

  const handleCloseDrawer = () => setSelectedClinic(null);

  return (
    <div className="pt-20 pb-24">
      <ContainerConstrained className="mt-8">
        <div className="mb-16">
          {/* Match section heading style: font-playfair, tracking, and balance */}
          <p className="text-primary mb-4 text-sm font-semibold tracking-widest uppercase">
            Search for a Service
          </p>

          {/* Standardized paragraph style */}
          <div className="mb-6 space-y-5 text-sm text-gray-700">
            <p>
              Use the search to find clinics that offer the care your pet needs. The list will
              update in real time based on the services you select. We’re working to include both
              user-submitted and clinic-submitted pricing. Keep in mind, some services may still be
              missing as the data grows.
            </p>
          </div>
        </div>

        <div className="mb-10 space-y-6">
          <SearchCategory services={services} onSelect={setSearchQuery} />
          <SearchService value={searchQuery} onChange={setSearchQuery} services={services} />
        </div>
      </ContainerConstrained>

      <ContainerConstrained>
        <TableClinic onSelectClinic={setSelectedClinic} searchQuery={searchQuery} />
      </ContainerConstrained>

      <DrawerClinic clinic={selectedClinic} onClose={handleCloseDrawer} services={services} />
    </div>
  );
}
