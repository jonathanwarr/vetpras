'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const CLINICS_PER_PAGE = 10

export default function TableClinic({ onSelectClinic, searchQuery }) {
  const [clinics, setClinics] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const [
        { data: clinicData, error: clinicError },
        { data: serviceData, error: serviceError },
      ] = await Promise.all([
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
          service.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
  const paginatedClinics = filteredClinics.slice(
    startIdx,
    startIdx + CLINICS_PER_PAGE,
  )

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (loading)
    return (
      <div className="text-body-sm text-body-medium p-4">
        Loading clinics...
      </div>
    )

  return (
    <div className="w-full overflow-x-auto">
      <table className="divide-table-header-bg w-full table-auto divide-y">
        <thead>
          <tr>
            <th className="text-table-header text-heading-2 py-[14px] pr-3 pl-4 text-left sm:pl-0">
              Name
            </th>
            <th className="text-table-header text-heading-2 px-3 py-[14px] text-left">
              Address
            </th>
            <th className="text-table-header text-heading-2 px-3 py-[14px] text-left">
              Phone
            </th>
            <th className="text-table-header text-heading-2 px-3 py-[14px] text-left">
              Website
            </th>
            <th className="text-table-header text-heading-2 px-3 py-[14px] text-left">
              Rating
            </th>
          </tr>
        </thead>
        <tbody className="divide-table-header-bg divide-y">
          {paginatedClinics.map((clinic) => (
            <tr key={clinic.clinic_id}>
              <td
                onClick={() => onSelectClinic(clinic)}
                className="text-button-secondary-text text-table-cell cursor-pointer py-4 pr-3 pl-4 font-medium whitespace-nowrap hover:underline sm:pl-0"
              >
                {clinic.name}
              </td>
              <td className="text-table-cell text-body-medium px-3 py-4 whitespace-nowrap">
                {clinic.address}
              </td>
              <td className="text-table-cell text-body-medium px-3 py-4 whitespace-nowrap">
                {clinic.phone}
              </td>
              <td className="text-table-cell text-button-secondary-text max-w-[200px] truncate px-3 py-4">
                {clinic.website ? (
                  <a
                    href={clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {clinic.website}
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className="text-table-cell text-body-medium px-3 py-4 whitespace-nowrap">
                {clinic.google_rating ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredClinics.length === 0 && (
        <div className="text-body-sm text-body-medium mt-6 text-center">
          No clinics found for that service.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-table-row-even hover:bg-table-row-odd text-body-sm rounded px-3 py-1"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`text-body-sm rounded px-3 py-1 ${
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
            className="bg-table-row-even hover:bg-table-row-odd text-body-sm rounded px-3 py-1"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
