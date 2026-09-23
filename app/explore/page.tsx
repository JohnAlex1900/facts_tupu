"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDiscoverySearch } from "@/hooks/useDiscoverySearch";
import { useDebounce } from "@/hooks/useDebounce"; // Assuming a standard useDebounce hook

export default function ExplorePage() {
  // 1. Manage local filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [party, setParty] = useState("");
  const [minIntegrity, setMinIntegrity] = useState(0);
  const [page, setPage] = useState(1);

  // Debounce the text input so we don't spam the FastAPI server on every keystroke
  const debouncedSearch = useDebounce(searchTerm, 500);

  // 2. Fetch data via our custom hook
  const { data, isLoading, isError } = useDiscoverySearch({
    q: debouncedSearch,
    party: party || undefined,
    min_integrity: minIntegrity,
    page,
    limit: 12,
  });

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 on new search
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Party Affiliation
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={party}
            onChange={(e) => {
              setParty(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Parties</option>
            <option value="Independent">Independent</option>
            <option value="Coalition">Coalition</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Min. Integrity Score: {minIntegrity}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            className="w-full"
            value={minIntegrity}
            onChange={(e) => {
              setMinIntegrity(Number(e.target.value));
              setPage(1);
            }}
          />
        </div>
      </aside>

      {/* Main Results Grid */}
      <main className="flex-1">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            Failed to load the discovery database. Please try again.
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Found {data?.metadata.total_records || 0} profiles
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {data?.results.map((profile) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="border p-5 rounded-xl shadow-sm hover:shadow-md bg-white flex flex-col"
                  >
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    <span className="text-sm text-gray-500 mb-4">
                      {profile.party_affiliation}
                    </span>

                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Integrity</span>
                        <span className="font-semibold text-green-600">
                          {profile.integrity_score}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risk Radar</span>
                        <span className="font-semibold text-red-600">
                          {profile.risk_radar_index}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Simple Pagination */}
            {data && data.metadata.total_pages > 1 && (
              <div className="mt-8 flex justify-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="py-2">
                  Page {page} of {data.metadata.total_pages}
                </span>
                <button
                  disabled={page === data.metadata.total_pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
