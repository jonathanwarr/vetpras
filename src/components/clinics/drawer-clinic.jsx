'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function DrawerClinic({ clinic, onClose, services }) {
  const [showAllServices, setShowAllServices] = useState(false);

  if (!clinic) return null; // Don’t render drawer if no clinic is selected

  // Normalize clinic.service_codes into a clean array of strings
  const clinicServiceCodes = (() => {
    if (!clinic?.service_codes) return [];
    if (Array.isArray(clinic.service_codes)) return clinic.service_codes.map((c) => c.trim());
    if (typeof clinic.service_codes === 'string')
      return clinic.service_codes.split(',').map((c) => c.trim());
    return [];
  })();

  console.log('📦 clinic.service_codes:', clinic.service_codes);
  console.log('📦 normalized clinicServiceCodes:', clinicServiceCodes);

  // Get top-level services (i.e. categories) matched to this clinic
  const getCategoryServices = () => {
    if (!services || !clinicServiceCodes.length) return [];

    const matched = services
      .filter((s) => clinicServiceCodes.includes(s.service_code))
      .filter((s) => s.parent_code === null)
      .sort((a, b) => a.sort_order - b.sort_order); // 🔥 Sort by numeric sort_order

    console.log('🔍 getCategoryServices - sorted:', matched);

    return matched.map((s) => s.service);
  };

  // Get all services mapped to this clinic, including sub-services
  const getAllServiceNames = () => {
    if (!services || !clinicServiceCodes.length) return [];

    return clinicServiceCodes
      .map((code) => services.find((s) => s.service_code === code)?.service)
      .filter(Boolean);
  };

  // Use Google Maps Place ID or lat/lng for location link
  const mapsUrl = clinic.place_id
    ? `https://www.google.com/maps/place/?q=place_id:${clinic.place_id}`
    : clinic.latitude && clinic.longitude
      ? `https://www.google.com/maps?q=${clinic.latitude},${clinic.longitude}`
      : null;

  return (
    <Dialog open={!!clinic} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 flex justify-end pl-10">
          <DialogPanel className="w-screen max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col overflow-y-auto py-6">
              {/* 🔹 Header with close button */}
              <div className="flex items-start justify-between px-6">
                <DialogTitle className="text-heading-2 text-lg font-semibold">
                  {clinic.name}
                </DialogTitle>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-3 text-slate-700 hover:cursor-pointer hover:text-slate-600 focus:outline-none"
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* 🔹 Clinic details and service info */}
              <div className="text-body-md mt-6 flex-1 space-y-6 px-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-md mb-2 font-sans font-bold text-slate-900">Contact Info</h3>
                  <div className="space-y-2 text-sm text-slate-900">
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
                          className="text-button-secondary-text hover:cursor-pointer hover:text-blue-600"
                        >
                          {clinic.website}
                        </a>
                      ) : (
                        '—'
                      )}
                    </p>
                  </div>
                  {mapsUrl && (
                    <p className="my-5">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium text-blue-600 hover:cursor-pointer hover:text-blue-700"
                      >
                        View in Google Maps
                      </a>
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                <div>
                  <h3 className="text-md mb-2 font-sans font-bold text-slate-900">Quick Stats</h3>
                  <div className="space-y-2 text-sm text-slate-900">
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

                {/* Service Categories */}
                {services && clinicServiceCodes.length > 0 && (
                  <div>
                    <h3 className="text-md mb-2 font-sans font-bold text-slate-900">
                      Service Categories
                    </h3>

                    {/* Top-level service categories as tags */}
                    <div className="flex flex-wrap gap-2">
                      {getCategoryServices().map((name) => (
                        <span
                          key={name}
                          className="inline-block rounded-full bg-indigo-100 px-2 py-1 text-xs text-blue-800"
                        >
                          {name}
                        </span>
                      ))}
                    </div>

                    {/* Expandable full list of all matched services */}
                    {getAllServiceNames().length > getCategoryServices().length && (
                      <div className="mt-3">
                        <button
                          onClick={() => setShowAllServices(!showAllServices)}
                          className="text-md mb-2 font-sans font-bold text-slate-900 hover:cursor-pointer"
                        >
                          {showAllServices ? 'Hide Full List' : 'Show All Services'}
                        </button>
                        {showAllServices && (
                          <ul className="mt-2 list-inside list-disc space-y-1 font-sans text-xs font-medium">
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
