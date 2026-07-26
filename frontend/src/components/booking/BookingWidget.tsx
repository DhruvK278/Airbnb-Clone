import { ListingDetailResponse } from '@/lib/types';
import { Star } from 'lucide-react';

export default function BookingWidget({ listing }: { listing: ListingDetailResponse }) {
  return (
    <div className="border rounded-xl shadow-lg p-6 bg-white sticky top-28">
      <div className="flex items-baseline justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">${listing.price_per_night}</span>
          <span className="text-gray-600">night</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-900 font-semibold">
          <Star size={14} className="fill-current" />
          <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          <span className="text-gray-400 font-normal">·</span>
          <span className="text-gray-500 underline cursor-pointer">{listing.review_count} reviews</span>
        </div>
      </div>

      <div className="border rounded-xl border-gray-400 overflow-hidden mb-4">
        <div className="flex border-b border-gray-400">
          <div className="flex-1 p-3 border-r border-gray-400">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-900">CHECK-IN</div>
            <div className="text-sm text-gray-500 mt-0.5">Add date</div>
          </div>
          <div className="flex-1 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-900">CHECKOUT</div>
            <div className="text-sm text-gray-500 mt-0.5">Add date</div>
          </div>
        </div>
        <div className="p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-900">GUESTS</div>
          <div className="text-sm text-gray-900 mt-0.5">1 guest</div>
        </div>
      </div>

      <button className="w-full bg-[#FF385C] text-white font-semibold py-3.5 rounded-lg hover:bg-[#D70466] transition">
        Check availability
      </button>
    </div>
  );
}
