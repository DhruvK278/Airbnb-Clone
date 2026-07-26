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
      <div className="flex h-[calc(100vh-80px)] mt-[80px]">
        <div className="w-full md:w-[450px] p-8 border-r overflow-y-auto">
          <h1 className="text-3xl font-semibold mb-8">Trips</h1>
          <div className="animate-pulse space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl w-full"></div>
            ))}
          </div>
        </div>
        <div className="hidden md:block flex-1 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-80px)] mt-[80px] p-8 text-red-500">
        Error loading trips.
      </div>
    );
  }

  const upcomingBookings = bookings?.filter((b: any) => b.status === 'confirmed' && new Date(b.check_out_date) >= new Date()) || [];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] mt-[80px] w-full max-w-[2520px] mx-auto relative">
      
      {/* Left Sidebar - Trip List */}
      <div className="w-full md:w-[400px] lg:w-[480px] p-6 lg:p-10 border-r bg-white overflow-y-auto flex-shrink-0 z-10">
        <h1 className="text-2xl font-semibold mb-8 text-center md:text-left">Trips</h1>
        
        {upcomingBookings.length === 0 ? (
          <div className="text-center md:text-left mt-8">
            <h2 className="text-xl font-semibold mb-2">No trips booked... yet!</h2>
            <p className="text-gray-600 mb-6 text-sm">Time to dust off your bags and start planning your next adventure</p>
            <Link href="/" className="border border-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition inline-block">
              Start searching
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {upcomingBookings.map((booking: any) => (
              <div key={booking.id} className="flex gap-4 p-4 border border-gray-200 bg-white rounded-2xl hover:shadow-lg transition cursor-pointer shadow-sm relative group">
                <div className="w-24 h-24 rounded-xl bg-gray-200 overflow-hidden shrink-0">
                  {booking.listing?.images?.[0] ? (
                    <img 
                      src={booking.listing.images[0].image_url} 
                      alt="Listing" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300" />
                  )}
                </div>
                
                <div className="flex flex-col flex-1 justify-center relative">
                  <h4 className="text-[17px] font-semibold text-gray-900 leading-tight mb-1">{booking.listing?.location?.split(',')[0]}</h4>
                  <p className="text-gray-500 text-[13px] mb-2">{format(parseISO(booking.check_in_date), 'dd')}-{format(parseISO(booking.check_out_date), 'dd MMMM yyyy')}</p>
                  
                  {/* Fake avatars row */}
                  <div className="flex items-center">
                    <div className="flex -space-x-1.5">
                       <img className="w-5 h-5 rounded-full border border-white" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="User 1"/>
                       <img className="w-5 h-5 rounded-full border border-white" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User 2"/>
                       <img className="w-5 h-5 rounded-full border border-white" src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="User 3"/>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-900 ml-2">+{booking.guests || 1}</span>
                  </div>
                  
                  {/* Cancel Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(confirm('Are you sure you want to cancel this booking?')) {
                        cancelMutation.mutate(booking.id);
                      }
                    }}
                    disabled={cancelMutation.isPending}
                    className="absolute top-0 right-0 text-red-500 text-xs font-semibold hover:underline disabled:opacity-50 opacity-0 group-hover:opacity-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content - Giant Map */}
      <div className="hidden md:block flex-1 bg-[#e5e3df] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=2000&h=1200&fit=crop" 
          alt="Map View" 
          className="w-full h-full object-cover opacity-80" 
        />
        
        {/* Mock Map Controls */}
        <div className="absolute top-6 right-6 flex flex-col shadow-md rounded-xl overflow-hidden bg-white">
          <button className="w-10 h-10 flex items-center justify-center border-b hover:bg-gray-50 text-xl font-semibold text-gray-700">+</button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-xl font-semibold text-gray-700">-</button>
        </div>

        {/* Dynamic Map Pins for actual bookings */}
        {upcomingBookings.map((booking: any, idx: number) => {
          // Mock positions for visual effect (just randomizing based on ID for a fixed map look)
          const top = 30 + ((booking.id * 17) % 50); 
          const left = 30 + ((booking.id * 23) % 50);
          
          return (
            <div 
              key={`pin-${booking.id}`}
              className="absolute bg-white px-2 py-1 rounded-xl shadow-lg border border-gray-200 text-xs font-bold text-gray-900 flex flex-col items-center justify-center"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              {booking.listing?.images?.[0] && (
                <img src={booking.listing.images[0].image_url} className="w-8 h-8 rounded-lg mb-1 object-cover" />
              )}
              {booking.listing?.location?.split(',')[0]}
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
