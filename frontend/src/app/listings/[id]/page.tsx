"use client";

import { useQuery } from '@tanstack/react-query';
import { getListing } from '@/lib/api';
import { useParams } from 'next/navigation';
import PhotoGallery from '@/components/listing-detail/PhotoGallery';
import ListingHeader from '@/components/listing-detail/ListingHeader';
import AmenitiesSection from '@/components/listing-detail/AmenitiesSection';
import BookingWidget from '@/components/booking/BookingWidget';

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = Number(params.id);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListing(listingId),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-[50vh] bg-gray-200 rounded-2xl mb-8"></div>
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="w-full md:w-[33.333%] lg:w-[30%]">
            <div className="h-80 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
        <h1 className="text-2xl font-semibold">Oops! We couldn't find that listing.</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Header (Title, location, share) */}
      <ListingHeader listing={listing} />

      {/* Photo Gallery Grid */}
      <PhotoGallery images={listing.images} />

      {/* Main Content & Sidebar */}
      <div className="flex flex-col md:flex-row gap-12 mt-8">
        {/* Left Column */}
        <div className="flex-1">
          {/* Host & Property Info */}
          <div className="flex justify-between items-start pb-6 border-b">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                {listing.property_type} hosted by Host #{listing.host_id}
              </h2>
              <ol className="flex flex-wrap gap-1 text-gray-900 mt-1">
                <li>{listing.guests_max} guests</li>
                <li>·</li>
                <li>{listing.bedrooms} bedrooms</li>
                <li>·</li>
                <li>{listing.bathrooms} baths</li>
              </ol>
            </div>
            {/* Host Avatar Placeholder */}
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
               <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 fill-gray-400"><path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path></svg>
            </div>
          </div>

          {/* Description */}
          <div className="py-8 border-b">
            <p className="text-gray-800 leading-relaxed text-balance">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <AmenitiesSection amenities={listing.amenities} />
        </div>

        {/* Right Column / Sticky Sidebar */}
        <div className="w-full md:w-[33.333%] lg:w-[35%] relative">
          <div className="sticky top-28">
            <BookingWidget listing={listing} />
          </div>
        </div>
      </div>
    </div>
  );
}
