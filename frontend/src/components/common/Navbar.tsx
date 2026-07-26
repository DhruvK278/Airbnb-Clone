"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Globe, Menu } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hysteresis: wait until scrolled past the height difference to shrink,
      // but unshrink only when very close to top. This prevents the infinite layout-shift loop.
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else if (window.scrollY < 20) {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent content from hiding under the fixed navbar. */}
      <div className="h-[180px] w-full hidden md:block"></div>
      <div className="h-[90px] w-full md:hidden"></div>

      <header className={`border-b bg-white z-50 fixed top-0 w-full transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isScrolled ? 'h-[80px]' : 'h-[170px]'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 h-full relative">
          
          {/* Top Row: Logo & Right Menu (Always visible at the top) */}
          <div className="flex justify-between items-center pt-5">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center z-20 relative">
              <Link href="/" className="flex items-center gap-1 text-[#FF385C]">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentColor' }}>
                  <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.414 3.615l-.28.019-.267.006C5.377 31 2.5 28.584 2.5 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 5.083-10.87 7.11-14.836l.53-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.736l-.226.54c-.47 1.152-.646 1.79-.668 2.454l-.005.334C4.5 27.335 6.22 29 8.857 29c1.773 0 3.87-1.236 5.831-3.354l.495-.546.683-.837.684.836c1.97 2.122 4.04 3.337 5.793 3.354 2.64 0 4.357-1.665 4.357-4.718l-.001-.212c-.021-.659-.196-1.296-.662-2.435l-.23-.556c-.971-2.306-5.105-10.96-7.03-14.736l-.524-1.008C18.053 3.539 17.24 3 16 3zm.01 10.316c-2.01.021-3.177 1.514-3.177 3.42 0 1.797 1.18 3.37 2.96 3.37 1.737 0 2.92-1.503 2.92-3.327 0-1.89-1.127-3.413-2.703-3.463z" />
                </svg>
                <span className="text-xl font-bold tracking-tight hidden lg:block">airbnb</span>
              </Link>
            </div>

            {/* Right menu */}
            <div className="flex items-center gap-3 z-20 relative">
              <Link href="/host" className="hidden sm:block text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full transition text-gray-900">
                Become a host
              </Link>
              
              <div className="relative group flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-9 h-9 rounded-full object-cover cursor-pointer shadow-sm border border-gray-200" alt="User" />
                
                <div className="flex items-center justify-center w-9 h-9 bg-gray-50 border border-gray-300 hover:shadow-md rounded-full cursor-pointer transition">
                  <Menu size={16} className="text-gray-700" />
                </div>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-60 bg-white border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                  <Link href="/trips" className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 text-gray-900">
                    Trips
                  </Link>
                  <Link href="/wishlists" className="block px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 text-gray-900">
                    Wishlists
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <Link href="/host" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-900">
                    Manage listings
                  </Link>
                  <Link href="/host" className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-900">
                    Host an experience
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <div className="block px-4 py-2.5 text-sm hover:bg-gray-50 text-gray-900 cursor-pointer">
                    Log out
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Crossfade Section (Top Menu vs Compact Search) */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full max-w-[850px] flex justify-center z-10 pointer-events-none">
            
            {/* Top Menu (All, Homes, Experiences, Services) */}
            <div className={`absolute flex items-center gap-6 text-gray-500 font-medium transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isScrolled ? 'opacity-0 scale-75 -translate-y-4' : 'opacity-100 scale-100 translate-y-0 pointer-events-auto'}`}>
              <div className="flex flex-col items-center gap-1 cursor-pointer text-gray-900 border-b-2 border-gray-900 pb-1">
                <span className="text-xl">🌍</span>
                <span className="text-sm">All</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-gray-900 transition pb-1 border-b-2 border-transparent">
                <span className="text-xl">🏠</span>
                <span className="text-sm">Homes</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-gray-900 transition pb-1 border-b-2 border-transparent">
                <span className="text-xl">🎈</span>
                <span className="text-sm">Experiences</span>
              </div>
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-gray-900 transition pb-1 border-b-2 border-transparent">
                <span className="text-xl">🛎️</span>
                <span className="text-sm">Services</span>
              </div>
            </div>

            {/* Compact Search Bar */}
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
          <div className={`absolute left-1/2 -translate-x-1/2 w-full flex justify-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] origin-center ${isScrolled ? 'top-[20px] opacity-0 scale-50 pointer-events-none' : 'top-[85px] opacity-100 scale-100'}`}>
            <SearchBar />
          </div>

        </div>
      </header>
    </>
  );
}
