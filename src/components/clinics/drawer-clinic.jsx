'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';

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

    const matched = services
      .filter((s) => clinicServiceCodes.includes(s.service_code))
      .filter((s) => s.parent_code === null)
      .sort((a, b) => a.sort_order - b.sort_order);

    return matched.map((s) => s.service);
  };

  return (
    <Dialog open={!!clinic} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
        <DialogPanel className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">
              <div className="max-w-xs break-words">
                {clinic.clinic_name}
                {clinic.rating && (
                  <span className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-gray-600">
                    | <StarIcon className="h-4 w-4 text-yellow-500" />
                    {clinic.rating.toFixed(1)} ({clinic.total_reviews || 0})
                  </span>
                )}
              </div>
            </DialogTitle>
            <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-1 text-sm text-gray-600">
            <p>{clinic.street_address}</p>
            <p>
              {clinic.city}, {clinic.province}
            </p>
            {clinic.website && (
              <a
                href={clinic.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            )}
            {clinic.street_address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.street_address + ', ' + clinic.city + ', ' + clinic.province)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline"
              >
                View in Google Maps
              </a>
            )}
          </div>

          {/* Basic Costs Section */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-900">Basic Costs</h3>
            <dl className="mt-2 space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <dt>Exam Fee</dt>
                <dd>{clinic.exam_fee ? `$${clinic.exam_fee.toFixed(2)}` : '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Rabies Vacs</dt>
                <dd>{clinic.rabies_vaccine ? `$${clinic.rabies_vaccine.toFixed(2)}` : '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>DA2PP Vacs</dt>
                <dd>{clinic.da2pp_vaccine ? `$${clinic.da2pp_vaccine.toFixed(2)}` : '—'}</dd>
              </div>
            </dl>
          </div>

          {/* Services */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">Services</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {getCategoryServices()
                .slice(0, showAllServices ? undefined : 5)
                .map((service) => (
                  <li key={service}>• {service}</li>
                ))}
            </ul>
            {getCategoryServices().length > 5 && (
              <button
                onClick={() => setShowAllServices((prev) => !prev)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                {showAllServices ? 'Show less' : 'Show all'}
              </button>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
