'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

const CLINICS_PER_PAGE = 10

export default function TableClinic({ onSelectClinic, searchQuery }) {
  const [clinics, setClinics] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const [{ data: clinicData, error: clinicError }, { data: serviceData, error: serviceError }] =
        await Promise.all([
          supabase.from('clinics').select('*'),
          supabase.from('services').select('*'),
        ])

      if (clinicError) console.error('Error loading clinics:', clinicError)
      else setClinics(clinicData)

      if (serviceError) console.error('Error loading services:', serviceError)
      else setServices(serviceData)

      setLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const matchingServiceCodes = searchQuery
    ? services
        .filter((service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((service) => service.code.replace(/\.0$/, ''))
    : []

  const filteredClinics = searchQuery
    ? clinics.filter((clinic) => {
        const codes = clinic.service_codes
        if (!codes) return false
        const clinicCodes = typeof codes === 'string' ? [codes] : codes
        return matchingServiceCodes.some((code) => clinicCodes.includes(code))
      })
    : clinics

  const totalPages = Math.ceil(filteredClinics.length / CLINICS_PER_PAGE)
  const startIdx = (currentPage - 1) * CLINICS_PER_PAGE
  const paginatedClinics = filteredClinics.slice(startIdx, startIdx + CLINICS_PER_PAGE)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (loading) return <div className="p-4 text-body-sm text-body-medium">Loading clinics...</div>

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto divide-y divide-table-header-bg">
        <thead>
          <tr>
            <th className="py-[14px] pr-3 pl-4 text-left text-table-header text-heading-2 sm:pl-0">
              Name
            </th>
            <th className="px-3 py-[14px] text-left text-table-header text-heading-2">
              Address
            </th>
            <th className="px-3 py-[14px] text-left text-table-header text-heading-2">
              Phone
            </th>
            <th className="px-3 py-[14px] text-left text-table-header text-heading-2">
              Website
            </th>
            <th className="px-3 py-[14px] text-left text-table-header text-heading-2">
              Rating
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-table-header-bg">
          {paginatedClinics.map((clinic) => (
            <tr key={clinic.clinic_id}>
              <td
                onClick={() => onSelectClinic(clinic)}
                className="cursor-pointer text-button-secondary-text hover:underline py-4 pr-3 pl-4 text-table-cell font-medium whitespace-nowrap sm:pl-0"
              >
                {clinic.name}
              </td>
              <td className="px-3 py-4 text-table-cell whitespace-nowrap text-body-medium">
                {clinic.address}
              </td>
              <td className="px-3 py-4 text-table-cell whitespace-nowrap text-body-medium">
                {clinic.phone}
              </td>
              <td className="px-3 py-4 text-table-cell max-w-[200px] truncate text-button-secondary-text">
                {clinic.website ? (
                  <a
                    href={clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {clinic.website}
                  </a>
                ) : '—'}
              </td>
              <td className="px-3 py-4 text-table-cell whitespace-nowrap text-body-medium">
                {clinic.google_rating ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredClinics.length === 0 && (
        <div className="text-center text-body-sm text-body-medium mt-6">
          No clinics found for that service.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-table-row-even hover:bg-table-row-odd text-body-sm"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded text-body-sm ${
                currentPage === i + 1
                  ? 'bg-button-primary-bg text-button-primary-text'
                  : 'bg-table-row-even hover:bg-table-row-odd'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-table-row-even hover:bg-table-row-odd text-body-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
