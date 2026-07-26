"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ListingCard from '@/components/home/ListingCard';

export default function WishlistsPage() {
  
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      // Mocking User #6
      const { data } = await axios.get(`${API_URL}/favorites?user_id=6`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 py-12">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900">Wishlists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3].map(i => (
             <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="bg-gray-200 rounded-xl aspect-[4/3] w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 py-12 text-red-500">
        Error loading wishlists.
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 py-12 pb-24">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900">Wishlists</h1>

      {favorites?.length === 0 ? (
        <div className="py-12">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Create your first wishlist</h2>
          <p className="text-gray-600 mb-6">As you search, tap the heart icon to save your favorite places to stay or things to do to a wishlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((fav: any) => (
             <ListingCard key={fav.id} listing={fav.listing} />
          ))}
        </div>
      )}
    </div>
  );
}
