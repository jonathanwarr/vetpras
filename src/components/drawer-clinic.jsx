'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function DrawerClinic({ clinic, onClose, services }) {
  const [showAllServices, setShowAllServices] = useState(false)

  if (!clinic) return null

  // Group by parent service category (e.g., 5.2 → 5.0)
  const getCategoryServices = () => {
    if (!clinic.service_codes || !services) return []

    const codes = Array.isArray(clinic.service_codes)
      ? clinic.service_codes
      : [clinic.service_codes]

    const categoryCodes = new Set(
      codes
        .map((code) => `${parseInt(code)}.0`)
        .filter((cat) => services.find((s) => s.code === cat))
    )

    return [...categoryCodes].map(
      (code) => services.find((s) => s.code === code)?.name
    ).filter(Boolean)
  }

  const getAllServiceNames = () => {
    if (!clinic.service_codes || !services) return []

    const codes = Array.isArray(clinic.service_codes)
      ? clinic.service_codes
      : [clinic.service_codes]

    return codes
      .map((code) => services.find((s) => s.code === code)?.name)
      .filter(Boolean)
  }

  const mapsUrl = clinic.place_id
    ? `https://www.google.com/maps/place/?q=place_id:${clinic.place_id}`
    : clinic.latitude && clinic.longitude
    ? `https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`
    : null

  return (
    <Dialog open={!!clinic} onClose={onClose} className="relative z-10">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-md bg-white shadow-xl">
              <div className="flex h-full flex-col overflow-y-scroll py-6">
                <div className="px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-semibold text-gray-900">
                      {clinic.name}
                    </DialogTitle>
                    <button
                      type="button"
                      onClick={onClose}
                      className="ml-3 h-7 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex-1 px-4 sm:px-6 text-sm text-gray-700 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">📍 Contact Info</h3>
                    <p><strong>Address:</strong> {clinic.address}</p>
                    <p><strong>City:</strong> {clinic.city}</p>
                    <p><strong>Province:</strong> {clinic.province}</p>
                    <p><strong>Country:</strong> {clinic.country}</p>
                    <p><strong>Postal Code:</strong> {clinic.postal_code}</p>
                    <p><strong>Phone:</strong> {clinic.phone}</p>
                    <p><strong>Website:</strong>{' '}
                      {clinic.website ? (
                        <a
                          href={clinic.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 hover:underline"
                        >
                          {clinic.website}
                        </a>
                      ) : '—'}
                    </p>
                    {mapsUrl && (
                      <p>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-indigo-600 text-sm font-medium hover:underline"
                        >
                          📍 View in Google Maps
                        </a>
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">📊 Quick Stats</h3>
                    <p><strong>Google Rating:</strong> {clinic.google_rating ?? '—'}</p>
                    <p><strong>Total Reviews:</strong> {clinic.total_reviews ?? '—'}</p>
                    <p><strong>Exam Fee:</strong> {clinic.exam_fee ? `$${clinic.exam_fee}` : '—'}</p>
                  </div>

                  {services && clinic.service_codes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">🧾 Service Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {getCategoryServices().map((name) => (
                          <span
                            key={name}
                            className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                      {getAllServiceNames().length > getCategoryServices().length && (
                        <div className="mt-3">
                          <button
                            onClick={() => setShowAllServices(!showAllServices)}
                            className="text-sm text-indigo-600 hover:underline"
                          >
                            {showAllServices ? 'Hide Full List' : 'Show All Services'}
                          </button>
                          {showAllServices && (
                            <ul className="mt-2 list-disc list-inside text-xs text-gray-600 space-y-1">
                              {getAllServiceNames().map((name) => (
                                <li key={name}>{name}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 text-xs text-gray-400">
                    💡 Coming soon: smarter vet suggestions powered by real user data.
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
