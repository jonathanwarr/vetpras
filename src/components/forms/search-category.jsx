'use client';

import { useState } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';

export default function SearchCategory({ services = [], onCategoryChange }) {
  // Filter to only include parent categories (service_code ends with ".00")
  const categories = services
    .filter((s) => s.service_code.endsWith('.00'))
    .sort((a, b) => a.sort_order - b.sort_order);

  const [selected, setSelected] = useState(null);

  const handleSelect = (cat) => {
    setSelected(cat);

    // Call onCategoryChange ONLY when needed
    if (cat) {
      onCategoryChange(cat.service);
    } else {
      onCategoryChange('');
    }
  };

  return (
    <div className="w-full sm:w-60">
      <label className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
        Search by Category
      </label>
      <div className="relative mt-2">
        <Listbox value={selected} onChange={handleSelect}>
          <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-sm bg-white py-2 pr-3 pl-3 text-left font-sans text-slate-700 outline-1 -outline-offset-1 outline-gray-300 placeholder:font-sans focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm">
            <span className="col-start-1 row-start-1 truncate pr-6">
              {selected ? selected.service : 'Choose a category'}
            </span>
            <ChevronUpDownIcon
              aria-hidden="true"
              className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute z-10 mt-1 max-h-60 block w-full overflow-auto rounded-md bg-white py-1 pb-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
          >
            {/* Default empty option */}
            <ListboxOption
              value={null}
              className="group relative cursor-default py-2 pr-9 pl-3 text-gray-400 select-none data-[focus]:bg-blue-600 data-[focus]:text-white"
            >
              <span className="block truncate font-normal">Choose a category</span>
            </ListboxOption>

            {/* Real categories */}
            {categories.map((cat) => (
              <ListboxOption
                key={cat.service_code}
                value={cat}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-[focus]:bg-blue-600 data-[focus]:text-white"
              >
                <span className="block truncate font-normal group-data-[selected]:font-semibold">
                  {cat.service}
                </span>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>
      </div>
    </div>
  );
}
