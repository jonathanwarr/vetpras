'use client';

import { useState } from 'react';

// Sidebar component used on the Submit Bill page to browse service categories
// Expands parent categories to show child services, and triggers onSelect with a service_code
export default function ServiceNavigation({ services = [], onSelect }) {
  const [expandedCategory, setExpandedCategory] = useState(null); // Tracks which category is open

  // Filter all services to get top-level categories (i.e. parent_code === null)
  const parentCategories = services.filter((s) => s.parent_code === null);

  // Group sub-services under their parent_code
  // Example: { '1.0': [{ service: 'Wellness Exam', service_code: '1.1' }, ...] }
  const childMap = services.reduce((acc, service) => {
    if (!service.parent_code) return acc;
    if (!acc[service.parent_code]) acc[service.parent_code] = [];
    acc[service.parent_code].push(service);
    return acc;
  }, {});

  // Toggle category open/closed
  const toggleCategory = (code) => {
    setExpandedCategory((prev) => (prev === code ? null : code));
  };

  return (
    <div className="w-full max-w-xs rounded-md border bg-white p-4 text-sm">
      <h2 className="text-heading-3 mb-4 font-semibold">Browse Services</h2>
      <ul className="space-y-2">
        {/* Loop through each parent category (e.g., Exams, Surgery) */}
        {parentCategories.map((category) => (
          <li key={category.service_code}>
            {/* Clicking toggles the visibility of that category's sub-services */}
            <button
              onClick={() => toggleCategory(category.service_code)}
              className="w-full text-left font-medium text-indigo-700 hover:underline"
            >
              {category.service}
            </button>

            {/* Show sub-services if this category is currently expanded */}
            {expandedCategory === category.service_code && (
              <ul className="mt-2 ml-4 space-y-1">
                {(childMap[category.service_code] || []).map((service) => (
                  <li
                    key={service.service_code}
                    onClick={() => onSelect(service.service_code)}
                    className="cursor-pointer text-gray-700 hover:text-indigo-600"
                  >
                    {service.service}
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
