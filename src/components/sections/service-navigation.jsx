'use client';

import { useState } from 'react';

export default function ServiceNavigation({ services = [], onSelect }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Group services by category (e.g. 1.0, 2.0)
  const grouped = services.reduce((acc, service) => {
    const [category] = service.code.split('.');
    const catCode = `${category}.0`;
    if (!acc[catCode]) acc[catCode] = [];
    acc[catCode].push(service);
    return acc;
  }, {});

  const toggleCategory = (catCode) => {
    setExpandedCategory((prev) => (prev === catCode ? null : catCode));
  };

  return (
    <div className="w-full max-w-xs rounded-md border bg-white p-4 text-sm">
      <h2 className="text-heading-3 mb-4 font-semibold">Browse Services</h2>
      <ul className="space-y-2">
        {Object.entries(grouped).map(([catCode, subServices]) => (
          <li key={catCode}>
            <button
              onClick={() => toggleCategory(catCode)}
              className="w-full text-left font-medium text-indigo-700 hover:underline"
            >
              {subServices[0]?.name.split(':')[0]}{' '}
              {/* Assume name has format "Diagnostics: Blood Work" */}
            </button>
            {expandedCategory === catCode && (
              <ul className="mt-2 ml-4 space-y-1">
                {subServices.map((s) => (
                  <li
                    key={s.code}
                    className="cursor-pointer text-gray-700 hover:text-indigo-600"
                    onClick={() => onSelect(s.code)}
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
