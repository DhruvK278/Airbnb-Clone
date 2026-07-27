"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getListing, createBooking } from '@/lib/api';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ChevronLeft, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const listingId = Number(searchParams.get('listing_id'));
  const checkInStr = searchParams.get('check_in');
  const checkOutStr = searchParams.get('check_out');
  const guests = Number(searchParams.get('guests'));

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListing(listingId),
    enabled: !!listingId
  });

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      toast.success('Pack your bags! Your booking is confirmed.');
      router.push('/trips');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to confirm booking.');
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 xl:px-20 py-12 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!listing || !checkInStr || !checkOutStr) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 xl:px-20 py-12">
        <h1 className="text-2xl font-semibold mb-4">Invalid Booking Request</h1>
        <button onClick={() => router.back()} className="underline font-semibold">Go back</button>
      </div>
    );
  }

  const checkIn = parseISO(checkInStr);
  const checkOut = parseISO(checkOutStr);
  const nights = differenceInDays(checkOut, checkIn);
  
  const basePrice = listing.price_per_night * nights;
  const cleaningFee = listing.cleaning_fee;
  const serviceFee = Math.round(basePrice * 0.16);
  const total = basePrice + cleaningFee + serviceFee;

  const handleConfirmPay = () => {
    mutation.mutate({
      listing_id: listing.id,
      check_in_date: checkInStr,
      check_out_date: checkOutStr,
      num_guests: guests || 1
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-10 xl:px-20 py-12 pt-32">
      
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[32px] font-semibold tracking-tight">Request to book</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-20">
        
        {/* Left Column - Payment Details */}
        <div className="flex-1">
          <section className="mb-10">
            <h2 className="text-[22px] font-semibold mb-6">Your trip</h2>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-gray-900">Dates</h3>
                <p className="text-gray-500">{format(checkIn, 'MMM d')} – {format(checkOut, 'MMM d, yyyy')}</p>
              </div>
              <button className="underline font-semibold">Edit</button>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">Guests</h3>
                <p className="text-gray-500">{guests} guest{guests > 1 ? 's' : ''}</p>
              </div>
              <button className="underline font-semibold">Edit</button>
            </div>
          </section>

          <hr className="mb-10" />

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold mb-6">Pay with</h2>
            <div className="border rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">CARD</div>
                <div>
                  <div className="font-semibold text-gray-900">Credit or debit card</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <input type="text" placeholder="Card number" className="w-full border p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div className="flex gap-4">
                  <input type="text" placeholder="Expiration" className="w-full border p-3 rounded-lg focus:outline-none focus:border-black" />
                  <input type="text" placeholder="CVV" className="w-full border p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div>
                  <input type="text" placeholder="ZIP code" className="w-full border p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div>
                  <select className="w-full border p-3 rounded-lg focus:outline-none focus:border-black appearance-none bg-white">
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
          
          <hr className="mb-10" />

          <section className="mb-10">
            <h2 className="text-[22px] font-semibold mb-4">Ground rules</h2>
            <p className="text-gray-900 mb-4">We ask every guest to remember a few simple things about what makes a great guest.</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-900">
              <li>Follow the house rules</li>
              <li>Treat your Host's home like your own</li>
            </ul>
          </section>
          
          <hr className="mb-10" />
          
          <div className="text-xs text-gray-500 mb-8">
            By selecting the button below, I agree to the Host's House Rules, Ground rules for guests, Airbnb's Rebooking and Refund Policy, and that Airbnb can charge my payment method if I'm responsible for damage.
          </div>

          <button 
            onClick={handleConfirmPay}
            disabled={mutation.isPending}
            className="bg-[#FF385C] text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-[#D70466] transition disabled:opacity-50"
          >
            {mutation.isPending ? 'Confirming...' : 'Confirm and pay'}
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-[450px]">
          <div className="border rounded-2xl p-6 sticky top-28 shadow-sm">
            
            <div className="flex gap-4 mb-6">
              <img 
                src={listing.images[0]?.image_url || '/placeholder.jpg'} 
                alt={listing.title} 
                className="w-28 h-28 object-cover rounded-xl"
              />
              <div className="flex flex-col justify-between py-1">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">{listing.property_type}</p>
                  <p className="text-[14px] text-gray-900 font-semibold leading-tight line-clamp-2">{listing.title}</p>
                </div>
                <div className="flex items-center gap-1 text-[12px] font-semibold">
                  <Star size={12} className="fill-current" />
                  <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
                  <span className="text-gray-500 font-normal">({listing.review_count} reviews)</span>
                </div>
              </div>
            </div>

            <hr className="mb-6" />

            <h3 className="text-[22px] font-semibold mb-6">Price details</h3>
            
            <div className="space-y-4 mb-6 text-gray-900">
              <div className="flex justify-between">
                <span>₹{(listing.price_per_night).toLocaleString()} x {nights} nights</span>
                <span>₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="underline">Cleaning fee</span>
                <span>₹{cleaningFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="underline">Airbnb service fee</span>
                <span>₹{serviceFee.toLocaleString()}</span>
              </div>
            </div>

            <hr className="mb-6" />

            <div className="flex justify-between font-semibold text-gray-900 text-lg">
              <span>Total (INR)</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
