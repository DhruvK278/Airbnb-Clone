import { ListingDetailResponse } from '@/lib/types';
import { Star, Share, Heart } from 'lucide-react';

export default function ListingHeader({ listing }: { listing: ListingDetailResponse }) {
  return (
    <div className="flex flex-col gap-1 pt-2">
      <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">{listing.title}</h1>
      
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-3 text-gray-900">
          <div className="flex items-center gap-1 font-semibold">
            <Star size={14} className="fill-current" />
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
          <span>·</span>
          <span className="font-semibold underline cursor-pointer">{listing.review_count} reviews</span>
          <span>·</span>
          <span className="font-semibold underline cursor-pointer">{listing.location}</span>
        </div>
        
        <div className="flex gap-4 font-semibold underline">
          <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
            <Share size={16} />
            Share
          </button>
          <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition">
            <Heart size={16} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
