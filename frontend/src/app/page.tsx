"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/home/ListingCard';

export default function Home() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['listings', page],
    queryFn: () => getListings({ skip: (page - 1) * limit, limit }),
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="max-w-[2520px] mx-auto px-4 sm:px-10 xl:px-20 pb-12 pt-6">
      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="bg-gray-200 rounded-xl aspect-[4/3] w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-12 text-center text-red-500">
          <p>Error loading listings. Please ensure the backend is running.</p>
        </div>
      ) : data?.listings?.length === 0 ? (
        <div className="mt-12 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">No exact matches</h2>
          <p>Try changing or removing some of your filters.</p>
        </div>
      ) : (
        <div className="space-y-12 mt-8">
          {page === 1 && (data?.listings?.length ?? 0) >= 10 ? (
            <>
              {/* Section 1 */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-[22px] font-semibold text-gray-900">Popular homes in Rishikesh</h2>
                  <button className="rounded-full bg-gray-100 p-1.5 hover:bg-gray-200 transition">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: 4, overflow: 'visible' }}><g fill="none"><path d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></g></svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {data?.listings.slice(0, 5).map((listing: any) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-[22px] font-semibold text-gray-900">Available in Mussoorie this weekend</h2>
                  <button className="rounded-full bg-gray-100 p-1.5 hover:bg-gray-200 transition">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: 4, overflow: 'visible' }}><g fill="none"><path d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28"></path></g></svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {data?.listings.slice(5, 10).map((listing: any) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <h2 className="text-[22px] font-semibold text-gray-900">More to explore</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {data?.listings.slice(10).map((listing: any) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-[22px] font-semibold text-gray-900">More to explore</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {data?.listings.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center mt-12 mb-8 gap-4">
              <p className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} – {Math.min(page * limit, data?.total || 0)} of {data?.total} places
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1 mx-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition ${
                          page === pageNum
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
