"use client";

import { useState, useEffect } from 'react';
import { ListingDetailResponse } from '@/lib/types';
import { Star } from 'lucide-react';

export default function StickyListingNav({ listing }: { listing: ListingDetailResponse }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const widget = document.getElementById('booking-widget-container');
      if (widget) {
        const rect = widget.getBoundingClientRect();
        // The StickyListingNav is 80px tall. We show it when the widget scrolls up and its bottom is near or above 80px.
        if (rect.bottom < 100) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        // Fallback if widget isn't found
        if (window.scrollY > 800) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-[60] transition-transform duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 xl:px-20 h-[80px] flex items-center justify-between">
        
        {/* Left: Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-[14px] font-semibold text-gray-900">
          <a href="#photos" className="hover:underline transition">Photos</a>
          <a href="#amenities" className="hover:underline transition">Amenities</a>
          <a href="#reviews" className="hover:underline transition">Reviews</a>
          <a href="#location" className="hover:underline transition">Location</a>
        </div>

        {/* Right: Mini Booking Widget */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="hidden sm:flex flex-col text-right">
            <div className="text-gray-900 flex items-baseline justify-end gap-1 mb-0.5">
              <span className="text-[14px] font-semibold text-gray-500 line-through">
                ₹{Math.round(listing.price_per_night * 2 * 1.91).toLocaleString('en-IN')}
              </span>
              <span className="text-[16px] font-bold">
                ₹{(listing.price_per_night * 2).toLocaleString('en-IN')}
              </span>
              <span className="text-[14px] font-normal text-gray-600">for 2 nights</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-[12px] font-semibold text-gray-900">
              <Star size={10} className="fill-current" />
              <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
              <span className="text-gray-500 font-normal">·</span>
              <span className="text-gray-500 font-normal underline">{listing.review_count} reviews</span>
            </div>
          </div>
          
          <button 
            onClick={() => {
              const widget = document.getElementById('booking-widget-container');
              if (widget) {
                const y = widget.getBoundingClientRect().top + window.scrollY - 100; // Offset for header
                window.scrollTo({ top: y, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="bg-[#FF385C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D70466] transition"
          >
            Reserve
          </button>
        </div>

      </div>
    </div>
  );
}
