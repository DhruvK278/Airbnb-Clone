import Link from 'next/link';
import { ListingListResponse } from '@/lib/types';
import { Star } from 'lucide-react';

interface ListingCardProps {
  listing: ListingListResponse;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0].image_url 
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';

  // Mocking the price calculation for 2 nights based on the screenshot
  const priceForTwoNights = Math.round(listing.price_per_night * 2 * 83); // roughly mocking USD to INR conversion

  return (
    <Link href={`/listings/${listing.id}`} className="group flex flex-col gap-3 cursor-pointer">
      {/* Image container with 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-gray-200">
        <img 
          src={imageUrl} 
          alt={listing.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Guest favourite badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm border border-gray-200/50">
          Guest favourite
        </div>

        {/* Heart Icon */}
        <div className="absolute top-3 right-3 text-white">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'white', strokeWidth: 2, overflow: 'visible' }}>
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
          </svg>
        </div>
      </div>
      
      {/* Details */}
      <div className="flex flex-col gap-0.5">
        <h3 className="font-medium text-gray-900 truncate">{listing.property_type} in {listing.location.split(',')[0]}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <span className="truncate">₹{priceForTwoNights.toLocaleString()} for 2 nights</span>
          <span className="mx-1.5 font-normal">·</span>
          <div className="flex items-center gap-1 font-medium text-gray-900">
            <Star size={12} className="fill-current" />
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
