'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon } from '@heroicons/react/20/solid'

const filters = {
  price: [
    { value: '0', label: '$0 - $25', checked: false },
    { value: '25', label: '$25 - $50', checked: false },
    { value: '50', label: '$50 - $75', checked: false },
    { value: '75', label: '$75+', checked: false },
  ],
}

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function FilterClinic() {
  return (
    <div className="bg-white">
      <Disclosure as="section" className="border-t border-b border-gray-200">
        <h2 className="sr-only">Filters</h2>

        {/* Filter Toggle Row */}
        <div className="relative py-4">
          <div className="mx-auto flex max-w-7xl divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
            <div className="pr-6">
              <DisclosureButton className="group flex items-center font-medium text-gray-700">
                <FunnelIcon className="mr-2 size-5 text-gray-400 group-hover:text-gray-500" />
                1 Filter
              </DisclosureButton>
            </div>
            <div className="pl-6">
              <button type="button" className="text-gray-500 hover:text-gray-700">
                Clear all
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <DisclosurePanel className="border-t border-gray-200 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <fieldset>
              <legend className="block font-semibold text-gray-900 mb-4">Price</legend>
              <div className="space-y-4">
                {filters.price.map((option, index) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`price-${index}`}
                      defaultValue={option.value}
                      defaultChecked={option.checked}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`price-${index}`} className="text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        </DisclosurePanel>

        {/* Sort Dropdown */}
        <div className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <MenuButton className="inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </MenuButton>
              </div>

              <MenuItems className="absolute right-0 z-10 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <a
                        href={option.href}
                        className={classNames(
                          option.current ? 'font-semibold text-gray-900' : 'text-gray-700',
                          'block px-4 py-2 text-sm hover:bg-gray-100'
                        )}
                      >
                        {option.name}
                      </a>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </Disclosure>
    </div>
  )
}
