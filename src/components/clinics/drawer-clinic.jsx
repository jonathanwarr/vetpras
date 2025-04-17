'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function DrawerClinic({ clinic, onClose, services }) {
  const [showAllServices, setShowAllServices] = useState(false);

  if (!clinic) return null;

  const clinicServiceCodes = (() => {
    if (!clinic?.service_codes) return [];
    if (Array.isArray(clinic.service_codes)) return clinic.service_codes.map((c) => c.trim());
    if (typeof clinic.service_codes === 'string')
      return clinic.service_codes.split(',').map((c) => c.trim());
    return [];
  })();

  const getCategoryServices = () => {
    if (!services || !clinicServiceCodes.length) return [];

    return services
      .filter((s) => clinicServiceCodes.includes(s.service_code))
      .filter((s) => s.parent_code === null)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => s.service);
  };

  const getAllServiceNames = () => {
    if (!services || !clinicServiceCodes.length) return [];

    return clinicServiceCodes
      .map((code) => services.find((s) => s.service_code === code)?.service)
      .filter(Boolean);
  };

  const mapsUrl = clinic.place_id
    ? `https://www.google.com/maps/place/?q=place_id:${clinic.place_id}`
    : clinic.latitude && clinic.longitude
      ? `https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`
      : null;

  return (
    <Dialog open={!!clinic} onClose={onClose} className="relative z-50">
      {/* 🔒 Background overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

      {/* 📦 Drawer panel */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-end pl-10">
          <DialogPanel className="w-screen max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col overflow-y-auto py-6">
              {/* 🔹 Header */}
              <div className="flex items-start justify-between px-6">
                <DialogTitle className="font-playfair text-2xl font-semibold text-gray-900">
                  {clinic.name}
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-3 cursor-pointer text-zinc-400 hover:text-zinc-600 focus:outline-none"
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* 🔹 Body */}
              <div className="mt-6 flex-1 space-y-8 px-6 text-sm text-gray-700">
                {/* 📍 Contact Info */}
                <div>
                  <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
                    Contact Info
                  </p>
                  <div className="space-y-1">
                    <p>
                      <strong>Address:</strong> {clinic.street_address}
                    </p>
                    <p>
                      <strong>City:</strong> {clinic.city}
                    </p>
                    <p>
                      <strong>Province:</strong> {clinic.province}
                    </p>
                    <p>
                      <strong>Country:</strong> {clinic.country}
                    </p>
                    <p>
                      <strong>Postal Code:</strong> {clinic.postal_code}
                    </p>
                    <p>
                      <strong>Phone:</strong> {clinic.phone_number}
                    </p>
                    <p>
                      <strong>Website:</strong>{' '}
                      {clinic.website ? (
                        <a
                          href={clinic.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 hover:underline"
                        >
                          {clinic.website}
                        </a>
                      ) : (
                        '—'
                      )}
                    </p>
                    {mapsUrl && (
                      <p className="mt-2">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          📍 View in Google Maps
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* 📊 Quick Stats */}
                <div>
                  <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
                    Quick Stats
                  </p>
                  <div className="space-y-1">
                    <p>
                      <strong>Google Rating:</strong> {clinic.rating ?? '—'}
                    </p>
                    <p>
                      <strong>Total Reviews:</strong> {clinic.total_reviews ?? '—'}
                    </p>
                    <p>
                      <strong>Exam Fee:</strong> {clinic.exam_fee ? `$${clinic.exam_fee}` : '—'}
                    </p>
                  </div>
                </div>

                {/* 🧾 Service Categories */}
                {services && clinicServiceCodes.length > 0 && (
                  <div>
                    <p className="text-primary mb-2 text-xs font-semibold tracking-widest uppercase">
                      Service Categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {getCategoryServices().map((name) => (
                        <span
                          key={name}
                          className="inline-block rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    {getAllServiceNames().length > getCategoryServices().length && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowAllServices(!showAllServices)}
                          className="text-primary flex cursor-pointer items-center gap-1 text-sm hover:underline"
                        >
                          {showAllServices ? 'Hide Full List' : 'Show All Services'}
                          <ChevronDownIcon
                            className={`h-4 w-4 transform transition-transform ${
                              showAllServices ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {showAllServices && (
                          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                            {getAllServiceNames().map((name) => (
                              <li key={name}>{name}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
