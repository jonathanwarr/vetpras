'use client';

import { XCircleIcon } from '@heroicons/react/20/solid';

export default function FormError({ missingFields = [] }) {
  if (missingFields.length === 0) return null;

  return (
    <div className="mb-4 rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="shrink-0">
          <XCircleIcon aria-hidden="true" className="size-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Please complete the following before submitting:
          </h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
            {missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
