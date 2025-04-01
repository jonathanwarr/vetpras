'use client'

import { useEffect, useState } from 'react'
import TableClinic from '@/components/sections/table-clinic'
import DrawerClinic from '@/components/sections/drawer-clinic'
import ContainerConstrained from '@/components/layout/container-constrained'
import SearchService from '@/components/ui/search-service'
import { supabase } from '@/lib/supabase'

export default function ClinicsPage() {
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [services, setServices] = useState([])

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('*')
      if (error) {
        console.error('Error loading services:', error)
      } else {
        setServices(data)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="pt-24 pb-12">
      <ContainerConstrained>
        <div className="mb-16">
          <h2 className="font-heading text-heading-1 mb-6 text-4xl">
            Search for a Service
          </h2>
          <p className="text-body-lg text-body-medium">
            Use the search to find clinics that offer the care your pet needs.
            The list will filter and only show clinics that have listed the
            service you're looking for.
          </p>
        </div>

        <div className="mb-10">
          <SearchService
            value={searchQuery}
            onChange={setSearchQuery}
            services={services}
          />
        </div>
      </ContainerConstrained>

      <ContainerConstrained>
        <TableClinic
          onSelectClinic={setSelectedClinic}
          searchQuery={searchQuery}
        />
      </ContainerConstrained>

      <DrawerClinic
        clinic={selectedClinic}
        onClose={() => setSelectedClinic(null)}
        services={services}
      />
    </div>
  )
}
