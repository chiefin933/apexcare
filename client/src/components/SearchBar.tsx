/*
 * Real-time Search Bar Component
 * Provides instant filtering for doctors and departments with suggestions
 */

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Link } from "wouter";
import { doctors, departments } from "@/lib/data";

interface SearchResult {
  type: "doctor" | "department";
  id: string;
  name: string;
  subtitle: string;
  link: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search doctors
    doctors.forEach((doctor) => {
      if (
        doctor.name.toLowerCase().includes(lowerQuery) ||
        doctor.title.toLowerCase().includes(lowerQuery) ||
        doctor.departmentName.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: "doctor",
          id: doctor.id,
          name: doctor.name,
          subtitle: `${doctor.title} • ${doctor.departmentName}`,
          link: `/doctors/${doctor.id}`,
        });
      }
    });

    // Search departments
    departments.forEach((dept) => {
      if (
        dept.name.toLowerCase().includes(lowerQuery) ||
        dept.description.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          type: "department",
          id: dept.id,
          name: dept.name,
          subtitle: dept.description,
          link: `/departments/${dept.id}`,
        });
      }
    });

    setResults(searchResults.slice(0, 8)); // Limit to 8 results
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctors, departments..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (query.length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {/* Doctors Section */}
              {results.some((r) => r.type === "doctor") && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                    Doctors
                  </div>
                  {results
                    .filter((r) => r.type === "doctor")
                    .map((result) => (
                      <Link key={result.id} href={result.link}>
                        <div
                          onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 text-sm">{result.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{result.subtitle}</div>
                        </div>
                      </Link>
                    ))}
                </>
              )}

              {/* Departments Section */}
              {results.some((r) => r.type === "department") && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                    Departments
                  </div>
                  {results
                    .filter((r) => r.type === "department")
                    .map((result) => (
                      <Link key={result.id} href={result.link}>
                        <div
                          onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-teal-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 text-sm">{result.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{result.subtitle}</div>
                        </div>
                      </Link>
                    ))}
                </>
              )}
            </div>
          ) : query.length > 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
