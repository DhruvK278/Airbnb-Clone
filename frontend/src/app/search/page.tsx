"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/home/ListingCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';
  const guests = searchParams.get('guests') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['search-listings', location, checkIn, checkOut, guests],
    queryFn: () =>
      getListings({
        location: location || undefined,
        check_in_date: checkIn || undefined,
        check_out_date: checkOut || undefined,
        guests: guests ? Number(guests) : undefined,
      }),
  });

  const totalResults = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-white">

      {/* ── Main Content: Split Layout ── */}
      <div className="max-w-[2520px] mx-auto px-4 sm:px-10 xl:px-20 mt-4">

        <div className="flex gap-6">
          {/* Left: Listings */}
          <div className="flex-1 min-w-0">

            {/* Results count */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {isLoading ? 'Searching...' : `Over ${totalResults} homes`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-2">
                    <div className="bg-gray-200 rounded-xl aspect-[4/3] w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">
                <p>Error loading listings. Please ensure the backend is running.</p>
              </div>
            ) : data?.listings?.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <h3 className="text-xl font-semibold mb-2">No exact matches</h3>
                <p>Try changing or removing some of your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 pb-12">
                {data?.listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Map Placeholder */}
          <div className="hidden lg:block w-[45%] xl:w-[50%] sticky top-[200px] h-[calc(100vh-220px)] rounded-2xl overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center relative">
              {/* Static map image */}
              <img
                src="https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.209&zoom=11&size=800x600&maptype=roadmap&key=placeholder"
                alt="Map"
                className="w-full h-full object-cover opacity-0"
              />
              {/* Fallback overlay */}
              <div className="absolute inset-0 bg-[#e8e4df] flex flex-col items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Simple SVG map illustration */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                    {/* Roads */}
                    <path d="M0 150 Q100 120 200 150 Q300 180 400 150" fill="none" stroke="#d4d0cc" strokeWidth="3" />
                    <path d="M200 0 Q180 100 200 150 Q220 200 200 300" fill="none" stroke="#d4d0cc" strokeWidth="3" />
                    <path d="M0 80 Q150 100 250 50 Q350 0 400 30" fill="none" stroke="#d4d0cc" strokeWidth="2" />
                    <path d="M50 300 Q100 200 180 230 Q260 260 400 220" fill="none" stroke="#d4d0cc" strokeWidth="2" />
                  </svg>

                  {/* Price pins */}
                  {data?.listings && data.listings.length > 0 && (
                    <>
                      {data.listings.slice(0, 8).map((listing, i) => {
                        const positions = [
                          { x: 15, y: 20 }, { x: 55, y: 15 }, { x: 75, y: 35 },
                          { x: 25, y: 55 }, { x: 65, y: 50 }, { x: 40, y: 75 },
                          { x: 80, y: 70 }, { x: 50, y: 40 },
                        ];
                        const pos = positions[i % positions.length];
                        const price = Math.round(listing.price_per_night * 83);
                        return (
                          <div
                            key={listing.id}
                            className="absolute bg-white px-2.5 py-1 rounded-full shadow-md text-xs font-semibold text-gray-900 border border-gray-200 hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                          >
                            ₹{price.toLocaleString()}
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* Map controls */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    <button className="w-8 h-8 bg-white rounded shadow border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-sm font-bold">⊕</button>
                    <button className="w-8 h-8 bg-white rounded shadow border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-sm font-bold">⊖</button>
                  </div>

                  {/* Google attribution mock */}
                  <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-normal">
                    Map data ©2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <div className="max-w-[2520px] mx-auto px-4 sm:px-10 xl:px-20 mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="bg-gray-200 rounded-xl aspect-[4/3] w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
