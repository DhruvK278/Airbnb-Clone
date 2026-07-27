import { ListingDetailResponse } from '@/lib/types';
import { Star, Share, Heart } from 'lucide-react';

export default function ListingHeader({ listing }: { listing: ListingDetailResponse }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
      <h1 className="text-[26px] font-semibold text-gray-900 tracking-tight">{listing.title}</h1>
      
      <div className="flex gap-4 font-semibold underline text-sm shrink-0">
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
  );
}
