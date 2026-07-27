"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, Globe, Menu, SlidersHorizontal } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';

const quickFilters = [
  'Free parking', 'Washing machine', 'Wifi', 'Air conditioning',
  'Kitchen', 'TV', 'Self check-in', 'Allows pets', '1+ bathrooms',
];

function SearchNavContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';
  const guests = searchParams.get('guests') || '';

  const locationLabel = location || 'Homes nearby';
  const dateLabel = checkIn && checkOut
    ? `${new Date(checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : 'Any week';
  const guestLabel = guests ? `${guests} guest${Number(guests) > 1 ? 's' : ''}` : 'Add guests';

  return (
    <>
      {/* Compact search pill — centered in the top row */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-4 z-10">
        <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition bg-white px-2 py-1.5 gap-0 cursor-pointer">
          <div className="flex items-center gap-2 border-r border-gray-300 px-4 font-medium text-sm text-gray-900">
            <span className="text-base">🏠</span> {locationLabel}
          </div>
          <div className="border-r border-gray-300 px-4 font-medium text-sm text-gray-900">
            {dateLabel}
          </div>
          <div className={`px-4 text-sm ${guests ? 'font-medium text-gray-900' : 'font-normal text-gray-500'}`}>
            {guestLabel}
          </div>
          <div className="bg-[#FF385C] text-white p-2 rounded-full">
            <Search size={14} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Filter row — right below the top search pill, centered */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-full flex justify-center px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-fit">
          <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-200 rounded-full text-[13px] text-gray-600 hover:border-gray-900 transition flex-shrink-0">
            <SlidersHorizontal size={14} />
            Filters
          </button>
          <div className="h-4 border-l border-gray-200 flex-shrink-0 mx-1"></div>
          {quickFilters.map((f) => (
            <button
              key={f}
              className="px-4 py-1.5 border border-gray-200 rounded-full text-[13px] text-gray-600 hover:border-gray-900 transition flex-shrink-0 whitespace-nowrap"
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else if (window.scrollY < 20) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isBookPage = pathname === '/book';
  const isSearchPage = pathname.startsWith('/search');
  const isListingPage = pathname.startsWith('/listings/');
  const isCompactNavbar = pathname === '/profile' || pathname === '/trips' || pathname === '/host';

  // Determine navbar height
  const getNavbarHeight = () => {
    if (isSearchPage) return 'h-[80px] md:h-[120px]'; // room for pill + filter row
    if (isListingPage || isCompactNavbar || isBookPage) return 'h-[80px] md:h-[80px]';
    return isScrolled ? 'h-[80px] md:h-[80px]' : 'h-[80px] md:h-[170px]';
  };

  // Determine spacer height
  const getSpacerHeight = () => {
    if (isSearchPage) return 'h-[120px]';
    if (isListingPage || isCompactNavbar || isBookPage) return 'h-[80px]';
    return null; // handled by the existing home page spacer
  };

  return (
    <>
      {/* Spacer */}
      {isSearchPage ? (
        <div className="h-[80px] md:h-[120px] w-full"></div>
      ) : isListingPage || isCompactNavbar || isBookPage ? (
        <div className="h-[80px] md:h-[80px] w-full"></div>
      ) : (
        <>
          <div className="h-[180px] w-full hidden md:block"></div>
          <div className="h-[90px] w-full md:hidden"></div>
        </>
      )}

      <header className={`border-b border-[#ebebea] bg-[#f9f9f9] z-50 fixed top-0 w-full transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${getNavbarHeight()}`}>
        <div className="max-w-[2520px] mx-auto px-4 sm:px-10 xl:px-20 h-full relative">

          {/* Top Row: Logo & Right Menu */}
          <div className="hidden md:flex justify-between items-center pt-5">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center z-20 relative">
              <Link href="/">
                <svg width="102" height="32" viewBox="0 0 3490 1080" color='rgb(255, 56, 92)' style={{ display: 'block' }}><path d="M1494.71 456.953C1458.28 412.178 1408.46 389.892 1349.68 389.892C1233.51 389.892 1146.18 481.906 1146.18 605.892C1146.18 729.877 1233.51 821.892 1349.68 821.892C1408.46 821.892 1458.28 799.605 1494.71 754.83L1500.95 810.195H1589.84V401.588H1500.95L1494.71 456.953ZM1369.18 736.895C1295.33 736.895 1242.08 683.41 1242.08 605.892C1242.08 528.373 1295.33 474.888 1369.18 474.888C1443.02 474.888 1495.49 529.153 1495.49 605.892C1495.49 682.63 1443.8 736.895 1369.18 736.895ZM1656.11 810.195H1750.46V401.588H1656.11V810.195ZM948.912 666.715C875.618 506.859 795.308 344.664 713.438 184.809C698.623 155.177 670.554 98.2527 645.603 67.8412C609.736 24.1733 556.715 0.779785 502.915 0.779785C449.115 0.779785 396.094 24.1733 360.227 67.8412C335.277 98.2527 307.207 155.177 292.392 184.809C210.522 344.664 130.212 506.859 56.9187 666.715C47.5621 687.769 24.9504 737.675 16.3736 760.289C6.2373 787.581 0.779297 817.213 0.779297 846.845C0.779297 975.509 101.362 1079.22 235.473 1079.22C346.193 1079.22 434.3 1008.26 502.915 934.18C571.53 1008.26 659.638 1079.22 770.357 1079.22C904.468 1079.22 1005.83 975.509 1005.83 846.845C1005.83 817.213 999.593 787.581 989.457 760.289C980.88 737.675 958.268 687.769 948.912 666.715ZM502.915 810.195C447.555 738.455 396.094 649.56 396.094 577.819C396.094 506.079 446.776 470.209 502.915 470.209C559.055 470.209 610.516 508.419 610.516 577.819C610.516 647.22 558.275 738.455 502.915 810.195ZM770.357 998.902C688.362 998.902 618.032 941.557 555.741 872.656C619.966 792.541 690.826 679.121 690.826 577.819C690.826 458.513 598.04 389.892 502.915 389.892C407.79 389.892 315.784 458.513 315.784 577.819C315.784 679.098 386.145 792.478 450.144 872.593C387.845 941.526 317.491 998.902 235.473 998.902C146.586 998.902 81.0898 931.061 81.0898 846.845C81.0898 826.57 84.2087 807.856 91.2261 788.361C98.2436 770.426 120.855 720.52 130.212 701.025C203.505 541.17 282.256 380.534 364.126 220.679C378.941 191.047 403.891 141.921 422.605 119.307C442.877 94.3538 470.947 81.0975 502.915 81.0975C534.883 81.0975 562.953 94.3538 583.226 119.307C601.939 141.921 626.89 191.047 641.704 220.679C723.574 380.534 802.325 541.17 875.618 701.025C884.975 720.52 907.587 770.426 914.604 788.361C921.622 807.856 925.52 826.57 925.52 846.845C925.52 931.061 859.244 998.902 770.357 998.902ZM3285.71 389.892C3226.91 389.892 3175.97 413.098 3139.91 456.953V226.917H3045.56V810.195H3134.45L3140.69 754.83C3177.12 799.605 3226.94 821.892 3285.71 821.892C3401.89 821.892 3489.22 729.877 3489.22 605.892C3489.22 481.906 3401.89 389.892 3285.71 389.892ZM3266.22 736.895C3191.6 736.895 3139.91 682.63 3139.91 605.892C3139.91 529.153 3191.6 474.888 3266.22 474.888C3340.85 474.888 3393.32 528.373 3393.32 605.892C3393.32 683.41 3340.07 736.895 3266.22 736.895ZM2827.24 389.892C2766.15 389.892 2723.56 418.182 2699.37 456.953L2693.13 401.588H2604.24V810.195H2698.59V573.921C2698.59 516.217 2741.47 474.888 2800.73 474.888C2856.87 474.888 2888.84 513.097 2888.84 578.599V810.195H2983.19V566.903C2983.19 457.733 2923.15 389.892 2827.24 389.892ZM1911.86 460.072L1905.62 401.588H1816.73V810.195H1911.08V604.332C1911.08 532.592 1954.74 486.585 2027.26 486.585C2042.85 486.585 2058.44 488.144 2070.92 492.043V401.588C2059.22 396.91 2044.41 395.35 2028.04 395.35C1978.58 395.35 1936.66 421.177 1911.86 460.072ZM2353.96 389.892C2295.15 389.892 2244.21 413.098 2208.15 456.953V226.917H2113.8V810.195H2202.69L2208.93 754.83C2245.36 799.605 2295.18 821.892 2353.96 821.892C2470.13 821.892 2557.46 729.877 2557.46 605.892C2557.46 481.906 2470.13 389.892 2353.96 389.892ZM2334.46 736.895C2259.84 736.895 2208.15 682.63 2208.15 605.892C2208.15 529.153 2259.84 474.888 2334.46 474.888C2409.09 474.888 2461.56 528.373 2461.56 605.892C2461.56 683.41 2408.31 736.895 2334.46 736.895ZM1703.28 226.917C1669.48 226.917 1642.08 254.326 1642.08 288.13C1642.08 321.934 1669.48 349.343 1703.28 349.343C1737.09 349.343 1764.49 321.934 1764.49 288.13C1764.49 254.326 1737.09 226.917 1703.28 226.917Z" fill="currentColor"></path></svg>
              </Link>
            </div>

            {/* Right menu */}
            {!isBookPage && (
              <div className="flex items-center gap-3 z-20 relative">
                <Link href="/host" className="hidden sm:block text-[14px] font-semibold hover:bg-gray-100 px-4 py-2 rounded-full transition text-gray-900">
                  Become a host
                </Link>

                <Link href="/profile" className="flex items-center gap-3 relative">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-9 h-9 rounded-full object-cover cursor-pointer shadow-sm border border-gray-200" alt="User" />

                  <div className="flex items-center justify-center w-9 h-9 bg-gray-50 border border-gray-300 hover:shadow-md rounded-full cursor-pointer transition">
                    <Menu size={16} className="text-gray-700" />
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* MOBILE SEARCH PILL */}
          {!isBookPage && (
            <div className="md:hidden flex flex-col pt-4 pb-2 w-full z-20 relative">
              <Link href="/" className="w-full flex items-center gap-4 bg-white border border-gray-300 rounded-full shadow-[0_3px_10px_rgb(0,0,0,0.08)] py-3 px-4 h-[54px]">
                <Search size={20} strokeWidth={3} className="text-gray-800" />
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-semibold text-gray-900 leading-[1.2]">Start your search</span>
                  <span className="text-[12px] text-gray-500 leading-[1.2]">Anywhere · Anytime · Add guests</span>
                </div>
              </Link>
            </div>
          )}

          {/* ── Search Page: compact pill + filter row inside navbar ── */}
          {!isBookPage && isSearchPage && (
            <Suspense fallback={<div />}>
              <SearchNavContent />
            </Suspense>
          )}

          {/* ── Listing Page: static compact pill ── */}
          {!isBookPage && isListingPage && (
            <div className="hidden md:flex absolute top-5 left-1/2 -translate-x-1/2 justify-center z-10">
              <Link href="/">
                <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition bg-white pl-2 pr-2 py-2 gap-2 cursor-pointer">
                  <div className="flex items-center gap-2 border-r border-gray-300 px-4 font-medium text-sm text-gray-900">
                    <span className="text-lg">🏠</span> Anywhere
                  </div>
                  <div className="border-r border-gray-300 px-4 font-medium text-sm text-gray-900">
                    Anytime
                  </div>
                  <div className="font-normal text-sm text-gray-500 pl-4 pr-2">
                    Add guests
                  </div>
                  <div className="bg-[#FF385C] text-white p-2 rounded-full">
                    <Search size={14} strokeWidth={3} />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── Home Page: full search bar with crossfade ── */}
          {!isBookPage && !isListingPage && !isCompactNavbar && !isSearchPage && (
            <>
              {/* Center Crossfade Section (Top Menu vs Compact Search) */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full max-w-[850px] flex justify-center z-10 pointer-events-none">

                {/* Top Menu (All, Homes, Experiences, Services) */}
                <div className={`absolute flex items-center gap-8 text-gray-500 font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isScrolled ? 'opacity-0 scale-75 -translate-y-4' : 'opacity-100 scale-100 translate-y-0 pointer-events-auto'}`}>

                  <div className="flex items-center gap-2 cursor-pointer text-gray-900 border-b-[3px] border-gray-900 pb-2">
                    <img src="/All logo.png" alt="All" className="w-9 h-9 object-contain" />
                    <span className="text-[14px]">All</span>
                  </div>

                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 hover:border-gray-300 transition pb-2 border-b-[3px] border-transparent">
                    <img src="/Homes logo.png" alt="Homes" className="w-9 h-9 object-contain opacity-70 group-hover:opacity-100" />
                    <span className="text-[14px]">Homes</span>
                  </div>

                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 hover:border-gray-300 transition pb-2 border-b-[3px] border-transparent">
                    <img src="/experiences logo.png" alt="Experiences" className="w-9 h-9 object-contain opacity-70 group-hover:opacity-100" />
                    <span className="text-[14px]">Experiences</span>
                  </div>

                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 hover:border-gray-300 transition pb-2 border-b-[3px] border-transparent">
                    <img src="/Service logo.png" alt="Services" className="w-9 h-9 object-contain opacity-70 group-hover:opacity-100" />
                    <span className="text-[14px]">Services</span>
                  </div>

                </div>

                {/* Compact Search Bar (appears on scroll) */}
                <div
                  className={`absolute flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] bg-white pl-2 pr-2 py-2 gap-2 ${isScrolled ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto cursor-pointer' : 'opacity-0 scale-125 translate-y-14'}`}
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  <div className="flex items-center gap-2 border-r border-gray-300 px-4 font-medium text-sm text-gray-900">
                    <span className="text-lg">🏠</span> Anywhere
                  </div>
                  <div className="border-r border-gray-300 px-4 font-medium text-sm text-gray-900">
                    Anytime
                  </div>
                  <div className="font-normal text-sm text-gray-500 pl-4 pr-2">
                    Add guests
                  </div>
                  <div className="bg-[#FF385C] text-white p-2 rounded-full">
                    <Search size={14} strokeWidth={3} />
                  </div>
                </div>

              </div>

              {/* Big Search Bar Container */}
              <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-full justify-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] origin-center ${isScrolled ? 'top-[20px] opacity-0 scale-50 pointer-events-none' : 'top-[85px] opacity-100 scale-100'}`}>
                <SearchBar />
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
}
