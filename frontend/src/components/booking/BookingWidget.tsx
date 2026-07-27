"use client";

import { useState, useMemo } from 'react';
import { ListingDetailResponse } from '@/lib/types';
import { Star } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import { createBooking, getListingAvailability } from '@/lib/api';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import 'react-day-picker/style.css';

export default function BookingWidget({ listing }: { listing: ListingDetailResponse }) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch blocked dates for current and next month
  const today = new Date();
  const { data: availabilityData } = useQuery({
    queryKey: ['availability', listing.id, today.getFullYear(), today.getMonth() + 1],
    queryFn: () => getListingAvailability(listing.id, today.getFullYear(), today.getMonth() + 1),
  });

  const disabledDates = useMemo(() => {
    if (!availabilityData?.booked_dates) return [{ before: today }];
    return [
      { before: today },
      ...availabilityData.booked_dates.map((d: string) => parseISO(d))
    ];
  }, [availabilityData]);

  // Calculations
  const nights = dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) : 0;
  const basePrice = listing.price_per_night * (nights || 1);
  const cleaningFee = listing.cleaning_fee;
  const serviceFee = Math.round(basePrice * 0.16);
  const total = basePrice + cleaningFee + serviceFee;

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success('Booking confirmed!');
      router.push('/trips');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to book dates.');
    }
  });

  const handleReserve = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }
    const checkIn = format(dateRange.from, 'yyyy-MM-dd');
    const checkOut = format(dateRange.to, 'yyyy-MM-dd');
    router.push(`/book?listing_id=${listing.id}&check_in=${checkIn}&check_out=${checkOut}&guests=${guests}`);
  };

  return (
    <div className="border rounded-xl shadow-lg p-6 bg-white sticky top-28">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">₹{(listing.price_per_night * 83).toLocaleString()}</span>
          <span className="text-gray-600">night</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-900 font-semibold">
          <Star size={14} className="fill-current" />
          <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          <span className="text-gray-400 font-normal">·</span>
          <span className="text-gray-500 underline cursor-pointer">{listing.review_count} reviews</span>
        </div>
      </div>

      <div className="relative mb-4">
        <div 
          className="border rounded-xl border-gray-400 overflow-hidden cursor-pointer"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <div className="flex border-b border-gray-400">
            <div className="flex-1 p-3 border-r border-gray-400 hover:bg-gray-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-900">CHECK-IN</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {dateRange?.from ? format(dateRange.from, 'MM/dd/yyyy') : 'Add date'}
              </div>
            </div>
            <div className="flex-1 p-3 hover:bg-gray-50">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-900">CHECKOUT</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {dateRange?.to ? format(dateRange.to, 'MM/dd/yyyy') : 'Add date'}
              </div>
            </div>
          </div>
          <div className="p-3 hover:bg-gray-50 flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-900">GUESTS</div>
              <div className="text-sm text-gray-900 mt-0.5">{guests} guest{guests > 1 ? 's' : ''}</div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-black"
                disabled={guests <= 1}
              >-</button>
              <button 
                onClick={() => setGuests(Math.min(listing.guests_max, guests + 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-black"
                disabled={guests >= listing.guests_max}
              >+</button>
            </div>
          </div>
        </div>

        {/* Calendar Popup */}
        {showCalendar && (
          <div className="absolute top-full right-0 mt-2 bg-white border rounded-2xl shadow-xl z-50 p-4 w-[350px]">
            <DayPicker
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              disabled={disabledDates}
              numberOfMonths={1}
            />
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowCalendar(false)}
                className="text-sm font-semibold underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleReserve}
        disabled={mutation.isPending}
        className="w-full bg-[#FF385C] text-white font-semibold py-3.5 rounded-lg hover:bg-[#D70466] transition disabled:opacity-50 mb-4"
      >
        {mutation.isPending ? 'Booking...' : 'Reserve'}
      </button>

      {nights > 0 && (
        <div className="space-y-3 text-gray-600">
          <div className="text-center text-sm mb-4">You won't be charged yet</div>
          <div className="flex justify-between">
            <span className="underline">₹{(listing.price_per_night * 83).toLocaleString()} x {nights} nights</span>
            <span>₹{(basePrice * 83).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>₹{(cleaningFee * 83).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Airbnb service fee</span>
            <span>₹{(serviceFee * 83).toLocaleString()}</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-gray-900 text-lg">
            <span>Total before taxes</span>
            <span>₹{(total * 83).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
