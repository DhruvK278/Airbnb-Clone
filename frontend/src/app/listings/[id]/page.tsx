"use client";

import { useQuery } from '@tanstack/react-query';
import { getListing } from '@/lib/api';
import { useParams } from 'next/navigation';
import PhotoGallery from '@/components/listing-detail/PhotoGallery';
import ListingHeader from '@/components/listing-detail/ListingHeader';
import AmenitiesSection from '@/components/listing-detail/AmenitiesSection';
import BookingWidget from '@/components/booking/BookingWidget';
import StickyListingNav from '@/components/listing-detail/StickyListingNav';
import { Star, Wind, Key, Maximize, Medal } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { addDays } from 'date-fns';

export default function ListingDetailPage() {
  const params = useParams();
  const listingId = Number(params.id);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListing(listingId),
  });

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 xl:px-20 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-[50vh] bg-gray-200 rounded-2xl mb-8"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-12 text-center text-red-500">
        <h1 className="text-2xl font-semibold">Oops! We couldn't find that listing.</h1>
      </div>
    );
  }

  const locationName = listing.location.split(',')[0];

  return (
    <>
      <StickyListingNav listing={listing} />
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-10 xl:px-20 py-6 pb-24">
        {/* Header (Title, share) */}
        <ListingHeader listing={listing} />

        {/* Photo Gallery Grid */}
        <div id="photos" className="mt-6">
          <PhotoGallery images={listing.images} />
        </div>

        {/* Main Content & Sidebar */}
        <div className="flex flex-col md:flex-row gap-12 mt-8">
          {/* Left Column */}
          <div className="flex-1 w-full md:w-[60%] lg:w-[65%]">
            
            {/* Host & Property Info (Sub-header) */}
            <div className="flex justify-between items-start pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-[22px] font-semibold text-gray-900">
                  Entire {listing.property_type.toLowerCase()} in {locationName}
                </h2>
                <ol className="flex flex-wrap gap-1 text-[15.5px] text-gray-900 mt-1">
                  <li>{listing.guests_max} guests</li>
                  <li>·</li>
                  <li>{listing.bedrooms} bedrooms</li>
                  <li>·</li>
                  <li>{listing.bedrooms} beds</li>
                  <li>·</li>
                  <li>{listing.bathrooms} baths</li>
                </ol>
                <div className="flex items-center gap-1 font-semibold text-[15.5px] mt-2">
                  <Star size={14} className="fill-current" />
                  <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
                  <span>·</span>
                  <span className="underline cursor-pointer">{listing.review_count} reviews</span>
                </div>
              </div>
            </div>

            {/* Host Profile Row */}
            <div className="flex items-center gap-4 py-6 border-b border-gray-200">
              <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                 <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-full h-full object-cover" alt="Host" />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-gray-900">Hosted by Ajay Singh</div>
                <div className="text-[14px] text-gray-500">Superhost · 5 years hosting</div>
              </div>
            </div>

            {/* Highlights (Hardcoded as per screenshot) */}
            <div className="py-8 border-b border-gray-200 flex flex-col gap-6">
              <div className="flex items-start gap-4 text-gray-900">
                <Wind className="mt-1 flex-shrink-0" size={26} strokeWidth={1.5} />
                <div>
                  <div className="font-semibold text-[16px]">Designed for staying cool</div>
                  <div className="text-[14px] text-gray-500 mt-0.5">Beat the heat with the A/C and ceiling fan.</div>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-900">
                <Key className="mt-1 flex-shrink-0" size={26} strokeWidth={1.5} />
                <div>
                  <div className="font-semibold text-[16px]">Self check-in</div>
                  <div className="text-[14px] text-gray-500 mt-0.5">Check yourself in with the lockbox.</div>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-900">
                <Maximize className="mt-1 flex-shrink-0" size={26} strokeWidth={1.5} />
                <div>
                  <div className="font-semibold text-[16px]">Extra spacious</div>
                  <div className="text-[14px] text-gray-500 mt-0.5">Guests love this home's spaciousness for a comfortable stay.</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-8 border-b border-gray-200">
              <div className="bg-[#f7f7f7] p-4 rounded-xl border border-gray-200 mb-6">
                <p className="text-gray-900 text-[16px] leading-relaxed">
                  Welcome to your Rishikesh retreat! Our 3BHK offers two ensuite bathrooms for those who enjoy VIP treatment — and a third bathroom just outside the room for those who love a little adventure. Bonus? You'll wake up to stunning Ganga River views that might just make your morning tea taste more spiritual. Ground floor convenience means no stair-climbing marathons — unless you're feeling extra zen and want to jog around the house. Come for the view, stay for the vibes!
                </p>
              </div>
              
              <div className="font-semibold text-[16px] mb-2">The space...</div>
              <button className="font-semibold underline flex items-center gap-1 mt-4 px-4 py-2 border border-black rounded-lg hover:bg-gray-50">
                Show more
              </button>
            </div>

            {/* Where you'll sleep */}
            <div className="py-10 border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[22px] font-semibold text-gray-900">Where you'll sleep</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                <div className="min-w-[280px] w-[320px] snap-start">
                  <img src="https://images.unsplash.com/photo-1522771731474-c9412495b412?w=800&q=80" className="w-full h-48 object-cover rounded-xl mb-4" />
                  <div className="font-semibold text-[16px]">Bedroom 1</div>
                  <div className="text-gray-500 text-[14px]">1 double bed</div>
                </div>
                <div className="min-w-[280px] w-[320px] snap-start">
                  <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80" className="w-full h-48 object-cover rounded-xl mb-4" />
                  <div className="font-semibold text-[16px]">Bedroom 2</div>
                  <div className="text-gray-500 text-[14px]">1 queen bed</div>
                </div>
                <div className="min-w-[280px] w-[320px] snap-start">
                  <img src="https://images.unsplash.com/photo-1505691938895-1758d7def511?w=800&q=80" className="w-full h-48 object-cover rounded-xl mb-4" />
                  <div className="font-semibold text-[16px]">Bedroom 3</div>
                  <div className="text-gray-500 text-[14px]">2 single beds</div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div id="amenities" className="py-10 border-b border-gray-200">
              <AmenitiesSection amenities={listing.amenities} />
            </div>

            {/* Calendar View */}
            <div className="py-10 border-b border-gray-200">
              <h3 className="text-[22px] font-semibold text-gray-900 mb-1">2 nights in {locationName}</h3>
              <p className="text-gray-500 text-[14px] mb-6">7 Aug 2026 - 9 Aug 2026</p>
              
              <div className="flex justify-start w-full">
                <DayPicker 
                  mode="range"
                  defaultMonth={new Date(2026, 7)} // August 2026
                  selected={{ from: new Date(2026, 7, 7), to: new Date(2026, 7, 9) }}
                  numberOfMonths={2}
                  className="rdp-airbnb"
                  formatters={{
                    formatWeekdayName: (day) => day.toLocaleDateString('en-US', { weekday: 'narrow' })
                  }}
                  modifiers={{
                    disabled: { before: new Date(2026, 7, 7) }
                  }}
                />
              </div>
            </div>
            
          </div>

          {/* Right Column / Sticky Sidebar */}
          <div className="w-full md:w-[35%] lg:w-[33.333%] relative">
            <div id="booking-widget-container" className="sticky top-28 z-10">
              <BookingWidget listing={listing} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Full width bottom sections */}
      <div className="border-t border-gray-200 pt-12 pb-16 px-4 sm:px-10 xl:px-20 max-w-[1280px] mx-auto">
        {/* Reviews Section */}
        <div id="reviews" className="mb-12">
          <div className="flex items-center gap-2 mb-8">
            <Star className="fill-current w-6 h-6" />
            <h2 className="text-[22px] font-semibold">4.84 · {listing.review_count} reviews</h2>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 mb-4">
             {/* Rating Bars */}
             <div className="flex gap-12 w-full max-w-[900px] mb-8 pb-8 border-b border-gray-200">
                {/* Simulated rating bars layout */}
                <div className="flex-1">
                  <div className="text-[14px] font-medium mb-1">Overall rating</div>
                  {/* Bars */}
                  <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2 text-xs">5 <div className="h-1 bg-black rounded-full flex-1 w-24"></div></div>
                     <div className="flex items-center gap-2 text-xs">4 <div className="h-1 bg-black rounded-full w-4"></div></div>
                     <div className="flex items-center gap-2 text-xs">3 <div className="h-1 bg-gray-200 rounded-full w-24"></div></div>
                     <div className="flex items-center gap-2 text-xs">2 <div className="h-1 bg-gray-200 rounded-full w-24"></div></div>
                     <div className="flex items-center gap-2 text-xs">1 <div className="h-1 bg-gray-200 rounded-full w-24"></div></div>
                  </div>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-8">
                  <div className="text-[14px] font-medium mb-1">Cleanliness</div>
                  <div className="text-[18px] font-semibold">4.8</div>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-8">
                  <div className="text-[14px] font-medium mb-1">Accuracy</div>
                  <div className="text-[18px] font-semibold">4.9</div>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-8">
                  <div className="text-[14px] font-medium mb-1">Check-in</div>
                  <div className="text-[18px] font-semibold">4.9</div>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-8 hidden md:block">
                  <div className="text-[14px] font-medium mb-1">Communication</div>
                  <div className="text-[18px] font-semibold">4.8</div>
                </div>
                <div className="flex-1 border-l border-gray-200 pl-8 hidden md:block">
                  <div className="text-[14px] font-medium mb-1">Location</div>
                  <div className="text-[18px] font-semibold">4.6</div>
                </div>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
             {/* Review 1 */}
             <div>
                <div className="flex items-center gap-3 mb-3">
                   <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" className="w-12 h-12 rounded-full object-cover" />
                   <div>
                     <div className="font-semibold text-[16px]">Jash</div>
                     <div className="text-[14px] text-gray-500">4 years on Airbnb</div>
                   </div>
                </div>
                <div className="flex items-center gap-1 text-[12px] mb-2">
                   <Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" />
                   <span className="text-gray-500 font-medium ml-1">· May 2026</span>
                </div>
                <p className="text-gray-800 text-[16px] leading-normal">
                   Very nice flat, modern, with a premium finish. Owner has fairly optimised the entire booking process, so didn't face many issues there...
                </p>
                <button className="underline font-semibold mt-2 text-[15px]">Show more</button>
             </div>

             {/* Review 2 */}
             <div>
                <div className="flex items-center gap-3 mb-3">
                   <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" className="w-12 h-12 rounded-full object-cover" />
                   <div>
                     <div className="font-semibold text-[16px]">Anoop</div>
                     <div className="text-[14px] text-gray-500">5 years on Airbnb</div>
                   </div>
                </div>
                <div className="flex items-center gap-1 text-[12px] mb-2">
                   <Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" />
                   <span className="text-gray-500 font-medium ml-1">· 2 weeks ago</span>
                </div>
                <p className="text-gray-800 text-[16px] leading-normal">
                   Overall experience is good. Need to improvement in neat & clean, towels torn, no foot mat, asked to fill toilet soap etc. No view from balconies...
                </p>
                <button className="underline font-semibold mt-2 text-[15px]">Show more</button>
             </div>

             {/* Review 3 */}
             <div>
                <div className="flex items-center gap-3 mb-3">
                   <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" className="w-12 h-12 rounded-full object-cover" />
                   <div>
                     <div className="font-semibold text-[16px]">Deergha</div>
                     <div className="text-[14px] text-gray-500">2 years on Airbnb</div>
                   </div>
                </div>
                <div className="flex items-center gap-1 text-[12px] mb-2">
                   <Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" />
                   <span className="text-gray-500 font-medium ml-1">· June 2026</span>
                </div>
                <p className="text-gray-800 text-[16px] leading-normal">
                   We had a wonderful stay at this Airbnb! The property was clean, comfortable, and exactly as described. The host was welcoming, responsive, and ensured that everything we...
                </p>
                <button className="underline font-semibold mt-2 text-[15px]">Show more</button>
             </div>
             
             {/* Review 4 */}
             <div>
                <div className="flex items-center gap-3 mb-3">
                   <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" className="w-12 h-12 rounded-full object-cover" />
                   <div>
                     <div className="font-semibold text-[16px]">Navya Sowjanya</div>
                     <div className="text-[14px] text-gray-500">7 months on Airbnb</div>
                   </div>
                </div>
                <div className="flex items-center gap-1 text-[12px] mb-2">
                   <Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" /><Star className="fill-current w-3 h-3" />
                   <span className="text-gray-500 font-medium ml-1">· June 2026</span>
                </div>
                <p className="text-gray-800 text-[16px] leading-normal">
                   It's a nice place to stay, Ganga river view from balcony is good but it is lil far from Rishikesh, it will take long to reach Rishikesh when there is traffic.
                </p>
             </div>
          </div>
        </div>

        <hr className="my-10" />

        {/* Location Section */}
        <div id="location" className="mb-12">
          <h2 className="text-[22px] font-semibold mb-6">Where you'll be</h2>
          <div className="text-[16px] mb-4">{listing.location}</div>
          <div className="w-full h-[480px] bg-gray-200 rounded-xl overflow-hidden relative">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              style={{ border: 0 }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyA_YOUR_ACTUAL_KEY_IS_NOT_NEEDED_HERE_BECAUSE_WE_HARDCODE&q=${encodeURIComponent(listing.location)}`} 
              allowFullScreen>
            </iframe>
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center pointer-events-none">
              <span className="text-gray-500 font-semibold">Map View (Simulated)</span>
            </div>
          </div>
        </div>
        
        <hr className="my-10" />
        
        {/* Meet your host */}
        <div>
          <h2 className="text-[22px] font-semibold mb-8">Meet your host</h2>
          
          <div className="flex flex-col lg:flex-row gap-20">
            
            {/* Left Column: Host Card & Bio */}
            <div className="flex flex-col w-[350px] shrink-0">
              
              {/* Host Card */}
              <div className="bg-white rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] p-6 mb-8 flex items-center justify-between">
                 {/* Left side of card */}
                 <div className="flex flex-col items-center pl-4">
                    <div className="relative mb-2">
                       <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" className="w-[104px] h-[104px] rounded-full object-cover" />
                       <div className="absolute bottom-0 -right-1 bg-[#FF385C] text-white p-1.5 rounded-full border-[3px] border-white">
                          <Medal size={16} />
                       </div>
                    </div>
                    <h3 className="text-[26px] font-bold tracking-tight">Ajay Singh</h3>
                    <div className="flex items-center gap-1 font-semibold text-[14px] text-gray-900 mt-1">
                      <Medal size={14} /> Superhost
                    </div>
                 </div>

                 {/* Right side of card (Stats) */}
                 <div className="flex flex-col pr-4">
                    <div className="mb-4">
                      <div className="font-bold text-[20px] mb-0.5">3619</div>
                      <div className="text-[10px] font-semibold text-gray-900">Reviews</div>
                    </div>
                    <div className="border-t border-gray-200 mb-4 pt-4">
                      <div className="font-bold text-[20px] flex items-center gap-1 mb-0.5">4.89 <Star size={12} className="fill-current" /></div>
                      <div className="text-[10px] font-semibold text-gray-900">Rating</div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="font-bold text-[20px] mb-0.5">5</div>
                      <div className="text-[10px] font-semibold text-gray-900">Years hosting</div>
                    </div>
                 </div>
              </div>
              
              {/* Bio & Details */}
              <div className="flex flex-col gap-5 text-[16px] text-gray-900 mb-6">
                <div className="flex items-start gap-4">
                   <div className="mt-1 shrink-0"><svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor"><path d="M26 8h-4V5a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3v3H6a3 3 0 0 0-3 3v16a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3V11a3 3 0 0 0-3-3zm-14-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3h-8zm15 22a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V13h22zm-22-16v-2a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v2z"></path></svg></div>
                   <div>My work: Merakii Hospitality</div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="mt-1 shrink-0"><svg width="24" height="24" viewBox="0 0 32 32" fill="currentColor"><path d="M25.5 2C26.328 2 27 2.672 27 3.5v16.166a4.5 4.5 0 1 1-2-3.742V10.222l-14 3.111v11.333a4.5 4.5 0 1 1-2-3.742V5.5C9 4.672 9.672 4 10.5 4h1a1.5 1.5 0 0 1 1.463 1.175l.135.534 11.266-2.504A1.5 1.5 0 0 1 25.5 2z"></path></svg></div>
                   <div>Favourite song in secondary school: was 'Blowin' in the wind' by Bob Dylan.</div>
                </div>
              </div>
              
              <p className="text-[16px] text-gray-900 leading-relaxed">
                Ajay Singh, born in a defence family in Chandigarh only to move and live most of his life in Chennai—Quit a well paying job in his early 20's to start exploring and help explore the Himalayas. Currently, the Managing Director at Merakii Hospitality. Very early in his 20's he had figured his love towards appreciating the world and meeting new friends along the wayy—This majorly pushed him to start up homes for people travelling.
              </p>
            </div>

            {/* Right Column: Host Details */}
            <div className="flex-1 max-w-[450px]">
               <h3 className="text-[22px] font-bold mb-4">Ajay Singh is a Superhost</h3>
               <p className="text-gray-900 text-[16px] mb-8 leading-relaxed">
                 Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
               </p>
               
               <h4 className="font-semibold text-[16px] mb-2">Host details</h4>
               <p className="text-gray-900 mb-1 text-[16px]">Response rate: 100%</p>
               <p className="text-gray-900 mb-8 text-[16px]">Responds within an hour</p>
               
               <button className="bg-gray-100 text-gray-900 px-6 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition text-[16px]">
                  Message host
               </button>
               
               <div className="flex items-center gap-3 mt-10 pt-8 border-t border-gray-200 text-[12px] text-gray-500">
                  <div className="shrink-0 w-6 h-6 bg-pink-100 text-[#FF385C] rounded flex items-center justify-center font-bold">🛡️</div>
                  To help protect your payment, always use Airbnb to send money and communicate with hosts.
               </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
