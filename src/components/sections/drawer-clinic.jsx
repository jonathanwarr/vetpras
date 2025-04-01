'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function DrawerClinic({ clinic, onClose, services }) {
  const [showAllServices, setShowAllServices] = useState(false)

  if (!clinic) return null

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

    return [...categoryCodes]
      .map((code) => services.find((s) => s.code === code)?.name)
      .filter(Boolean)
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
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-end pl-10">
          <DialogPanel className="w-screen max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col overflow-y-scroll py-6">
              <div className="px-6 flex items-start justify-between">
                <DialogTitle className="text-lg font-semibold text-heading-2">
                  {clinic.name}
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-3 text-zinc-400 hover:text-zinc-600 focus:outline-none"
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 flex-1 px-6 text-body-md space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-heading-3 mb-2">📍 Contact Info</h3>
                  <p><strong>Address:</strong> {clinic.address}</p>
                  <p><strong>City:</strong> {clinic.city}</p>
                  <p><strong>Province:</strong> {clinic.province}</p>
                  <p><strong>Country:</strong> {clinic.country}</p>
                  <p><strong>Postal Code:</strong> {clinic.postal_code}</p>
                  <p><strong>Phone:</strong> {clinic.phone}</p>
                  <p>
                    <strong>Website:</strong>{' '}
                    {clinic.website ? (
                      <a
                        href={clinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-button-secondary-text hover:underline"
                      >
                        {clinic.website}
                      </a>
                    ) : '—'}
                  </p>
                  {mapsUrl && (
                    <p className="mt-2">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        📍 View in Google Maps
                      </a>
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-heading-3 mb-2">📊 Quick Stats</h3>
                  <p><strong>Google Rating:</strong> {clinic.google_rating ?? '—'}</p>
                  <p><strong>Total Reviews:</strong> {clinic.total_reviews ?? '—'}</p>
                  <p><strong>Exam Fee:</strong> {clinic.exam_fee ? `$${clinic.exam_fee}` : '—'}</p>
                </div>

                {services && clinic.service_codes && (
                  <div>
                    <h3 className="text-sm font-semibold text-heading-3 mb-2">🧾 Service Categories</h3>
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
                          className="text-sm text-primary hover:underline"
                        >
                          {showAllServices ? 'Hide Full List' : 'Show All Services'}
                        </button>
                        {showAllServices && (
                          <ul className="mt-2 list-disc list-inside text-xs text-body-sm space-y-1">
                            {getAllServiceNames().map((name) => (
                              <li key={name}>{name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-200 text-xs text-zinc-400">
                  💡 Coming soon: smarter vet suggestions powered by real user data.
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
