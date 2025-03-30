'use client'

import { useState, useEffect, useRef } from 'react'

export default function SearchService({ value, onChange, services }) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const listRef = useRef(null)

  const filteredSuggestions = services?.filter((service) =>
    service.name.toLowerCase().includes(value.toLowerCase())
  ) || []

  const handleSelect = (service) => {
    onChange(service.name)
    setShowSuggestions(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSuggestions.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0) {
        handleSelect(filteredSuggestions[highlightedIndex])
      } else if (filteredSuggestions.length > 0) {
        // fallback: use first suggestion
        handleSelect(filteredSuggestions[0])
      }
    }
  } 
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const listItem = listRef.current.children[highlightedIndex]
      listItem?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  return (
    <div className="w-full sm:w-80 relative">
      <label htmlFor="search" className="block text-sm font-medium text-gray-900">
        Search by Service
      </label>
      <div className="mt-2 relative">
        <input
          id="search"
          name="search"
          type="text"
          autoComplete="off"
          placeholder="e.g. Vaccination"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setShowSuggestions(true)
            setHighlightedIndex(-1)
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleKeyDown}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 w-full rounded-md bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto text-sm"
          >
            {filteredSuggestions.map((service, index) => (
              <li
                key={service.code}
                onClick={() => handleSelect(service)}
                className={`cursor-pointer px-3 py-2 ${
                  index === highlightedIndex ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-50'
                }`}
              >
                {service.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
