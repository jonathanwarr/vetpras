import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SearchBar({ onSearchChange }) {
  const [query, setQuery] = useState("");
  const [isAscending, setIsAscending] = useState(true);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearchChange) onSearchChange(value);
  };

  const toggleArrow = () => {
    setIsAscending((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search clinics..."
        className="w-full border border-gray-300 rounded-2xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={toggleArrow}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {isAscending ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
}
