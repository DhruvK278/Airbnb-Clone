"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getListings, getMyBookings } from '@/lib/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function HostDashboard() {
  const queryClient = useQueryClient();
  const HOST_ID = 2; // Mocking as Host #2 since they have multiple listings in seed data
  
  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: ['listings'],
    queryFn: () => getListings({ limit: 100 }),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['host-bookings'],
    queryFn: async () => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const { data } = await axios.get(`${API_URL}/bookings/host?host_id=${HOST_ID}`);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (listingId: number) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      await axios.delete(`${API_URL}/listings/${listingId}`);
    },
    onSuccess: () => {
      toast.success('Listing deleted');
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
    onError: () => {
      toast.error('Failed to delete listing');
    }
  });

  if (listingsLoading || bookingsLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold mb-8">Host Dashboard</h1>
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  const myListings = listingsData?.listings?.filter(l => l.host_id === HOST_ID) || [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 py-12 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Host Dashboard</h1>
        <Link href="/host/create" className="bg-[#FF385C] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#D70466] transition inline-block">
          Create Listing
        </Link>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">My Listings</h2>
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-700">Listing</th>
                <th className="p-4 font-semibold text-gray-700">Location</th>
                <th className="p-4 font-semibold text-gray-700">Price/Night</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myListings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    You don't have any listings yet.
                  </td>
                </tr>
              ) : (
                myListings.map(listing => (
                  <tr key={listing.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {listing.images?.[0] && (
                          <img src={listing.images[0].image_url} alt="" className="w-12 h-12 rounded object-cover" />
                        )}
                        <span className="font-semibold text-gray-900 truncate max-w-xs">{listing.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{listing.location}</td>
                    <td className="p-4 font-semibold">₹{(listing.price_per_night * 83).toLocaleString()}</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Active</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-3">
                        <Link href={`/listings/${listing.id}`} className="text-blue-600 hover:underline font-semibold text-sm">View</Link>
                        <Link href={`/host/edit/${listing.id}`} className="text-gray-600 hover:underline font-semibold text-sm">Edit</Link>
                        <button 
                          onClick={() => {
                            if(confirm('Are you sure you want to delete this listing?')) {
                              deleteMutation.mutate(listing.id);
                            }
                          }}
                          className="text-red-600 hover:underline font-semibold text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Upcoming Reservations</h2>
        {bookingsData?.length === 0 ? (
          <div className="p-8 border rounded-xl text-center text-gray-500 bg-gray-50">
            No upcoming reservations for your properties.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookingsData?.filter((b: any) => b.status === 'confirmed').map((booking: any) => (
               <div key={booking.id} className="border rounded-xl p-5 shadow-sm">
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Booking #{booking.id}</div>
                 <h3 className="font-semibold text-gray-900 mb-3 truncate">{booking.listing?.title}</h3>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-600">Check-in:</span>
                   <span className="font-semibold">{booking.check_in_date}</span>
                 </div>
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-600">Check-out:</span>
                   <span className="font-semibold">{booking.check_out_date}</span>
                 </div>
                 <div className="flex justify-between text-sm mb-4">
                   <span className="text-gray-600">Guests:</span>
                   <span className="font-semibold">{booking.num_guests}</span>
                 </div>
                 <div className="pt-3 border-t font-semibold flex justify-between items-center">
                   <span>Payout</span>
                   <span>₹{(booking.total_price * 83).toLocaleString()}</span>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
