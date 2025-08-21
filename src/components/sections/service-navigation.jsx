'use client';

import { useState } from 'react';

export default function ServiceNavigation({ services = [], onSelect }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const parentCategories = services.filter((s) => s.parent_code === null);

  const childMap = services.reduce((acc, service) => {
    if (!service.parent_code) return acc;
    if (!acc[service.parent_code]) acc[service.parent_code] = [];
    acc[service.parent_code].push(service);
    return acc;
  }, {});

  const toggleCategory = (code) => {
    setExpandedCategory((prev) => (prev === code ? null : code));
  };

  return (
    <div className="hidden w-full max-w-xs md:block">
      {/* Heading placed outside the bordered box */}
      <h2 className="mb-3 font-sans text-sm font-bold text-slate-900">Browse Services</h2>

      {/* Bordered box with additional padding at bottom */}
      <div className="rounded-md border border-gray-300 bg-white p-4 pb-8 text-sm">
        <ul className="space-y-2">
          {parentCategories.map((category) => {
            const isOpen = expandedCategory === category.service_code;

            return (
              <li key={category.service_code}>
                <button
                  onClick={() => toggleCategory(category.service_code)}
                  className="flex w-full items-center justify-between text-left font-bold text-blue-700"
                >
                  <span>{category.service}</span>
                  <span className="pl-2 text-xl text-gray-500">{isOpen ? '▾' : '▸'}</span>
                </button>

                {isOpen && (
                  <ul className="mt-2 ml-4 space-y-1">
                    {(childMap[category.service_code] || []).map((service) => (
                      <li
                        key={service.service_code}
                        onClick={() => onSelect(service.service_code)}
                        className="cursor-pointer text-gray-700 hover:text-blue-600"
                      >
                        {service.service}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
