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

  // Match search query to service code
  console.log('searchQuery:', searchQuery)
  const matchingServiceCodes = searchQuery
    ? services
        .filter((service) =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((service) => service.code.replace(/\.0$/, ''))
    : []

  // Filter by matching service
  const filteredClinics = searchQuery
    ? clinics.filter((clinic) => {
        const codes = clinic.service_codes
        if (!codes) return false
        const clinicCodes = typeof codes === 'string' ? [codes] : codes
        console.log('clinicCodes:', clinicCodes)
        return matchingServiceCodes.some((code) => clinicCodes.includes(code))
      })
    : clinics

  // Paginate filtered results
  const totalPages = Math.ceil(filteredClinics.length / CLINICS_PER_PAGE)
  const startIdx = (currentPage - 1) * CLINICS_PER_PAGE
  const paginatedClinics = filteredClinics.slice(startIdx, startIdx + CLINICS_PER_PAGE)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  console.log('matching codes:', matchingServiceCodes)

  if (loading) return <div className="p-4 text-sm text-gray-600">Loading clinics...</div>

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto divide-y divide-gray-300">
        <thead>
          <tr>
            <th className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0">
              Name
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Address
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Phone
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Website
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Rating
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paginatedClinics.map((clinic) => (
            <tr key={clinic.clinic_id}>
              <td
                onClick={() => onSelectClinic(clinic)}
                className="cursor-pointer text-sky-600 hover:underline py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap sm:pl-0"
              >
                {clinic.name}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {clinic.address}
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {clinic.phone}
              </td>
              <td className="px-3 py-4 text-sm max-w-[200px] truncate text-sky-600">
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
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                {clinic.google_rating ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredClinics.length === 0 && (
        <div className="text-center text-sm text-gray-500 mt-6">
          No clinics found for that service.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
