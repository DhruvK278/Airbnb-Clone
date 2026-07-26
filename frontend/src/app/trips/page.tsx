"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBookings } from '@/lib/api';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export default function TripsPage() {
  const queryClient = useQueryClient();
  
  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: getMyBookings,
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const { data } = await axios.put(`${API_URL}/bookings/${bookingId}/cancel`);
      return data;
    },
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: () => {
      toast.error('Failed to cancel booking');
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 py-12">
        <h1 className="text-3xl font-semibold mb-8">Trips</h1>
        <div className="animate-pulse space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-40 bg-gray-200 rounded-2xl w-full max-w-3xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 py-12 text-red-500">
        Error loading trips.
      </div>
    );
  }

  const upcomingBookings = bookings?.filter(b => b.status === 'confirmed' && new Date(b.check_out_date) >= new Date()) || [];
  const pastBookings = bookings?.filter(b => b.status === 'completed' || b.status === 'cancelled' || (b.status === 'confirmed' && new Date(b.check_out_date) < new Date())) || [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 py-12 pb-24">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900">Trips</h1>

      {bookings?.length === 0 ? (
        <div className="py-12 border-t">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">No trips booked... yet!</h2>
          <p className="text-gray-600 mb-6">Time to dust off your bags and start planning your next adventure</p>
          <Link href="/" className="border border-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Start searching
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {upcomingBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Upcoming reservations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="border rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition">
                    <div className="h-48 bg-gray-200 relative">
                      {booking.listing?.images?.[0] && (
                        <img 
                          src={booking.listing.images[0].image_url} 
                          alt="Listing" 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {format(parseISO(booking.check_in_date), 'MMM d')} - {format(parseISO(booking.check_out_date), 'MMM d')}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-semibold text-lg truncate">{booking.listing?.location}</h3>
                      <p className="text-gray-500 text-sm truncate">{booking.listing?.title}</p>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between items-center mt-auto">
                        <div className="font-semibold text-gray-900">₹{(booking.total_price * 83).toLocaleString()}</div>
                        <button 
                          onClick={() => {
                            if(confirm('Are you sure you want to cancel this booking?')) {
                              cancelMutation.mutate(booking.id);
                            }
                          }}
                          disabled={cancelMutation.isPending}
                          className="text-red-500 text-sm font-semibold hover:underline disabled:opacity-50"
                        >
                          Cancel trip
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Where you've been</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map(booking => (
                  <div key={booking.id} className="border rounded-2xl overflow-hidden flex flex-col opacity-75">
                    <div className="h-32 bg-gray-200 relative">
                       {booking.listing?.images?.[0] && (
                        <img 
                          src={booking.listing.images[0].image_url} 
                          alt="Listing" 
                          className="w-full h-full object-cover grayscale"
                        />
                      )}
                    </div>
                    <div className="p-4 flex flex-col">
                      <h3 className="font-semibold">{booking.listing?.location}</h3>
                      <p className="text-gray-500 text-sm">
                        {format(parseISO(booking.check_in_date), 'MMM d, yyyy')}
                      </p>
                      <div className="mt-2 text-sm">
                        Status: <span className="capitalize font-semibold">{booking.status}</span>
                      </div>
                      {booking.status === 'completed' && (
                        <button className="mt-3 text-sm font-semibold underline text-left hover:text-gray-700">
                          Leave a review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
