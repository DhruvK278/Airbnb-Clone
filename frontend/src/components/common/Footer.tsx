"use client";

import React from 'react';
import { Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  if (pathname === '/book') return null;

  return (
    <footer className="bg-[#f7f7f7] border-t border-gray-200 mt-12 py-12 text-[#222222]">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-10 xl:px-20">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-300">
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-[14px] mb-4">Support</h3>
            <ul className="flex flex-col gap-3 text-[14px]">
              <li><a href="#" className="hover:underline">Help Centre</a></li>
              <li><a href="#" className="hover:underline">Get help with a safety issue</a></li>
              <li><a href="#" className="hover:underline">AirCover</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
              <li><a href="#" className="hover:underline">Report neighbourhood concern</a></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="font-semibold text-[14px] mb-4">Hosting</h3>
            <ul className="flex flex-col gap-3 text-[14px]">
              <li><a href="#" className="hover:underline">Airbnb your home</a></li>
              <li><a href="#" className="hover:underline">Airbnb your experience</a></li>
              <li><a href="#" className="hover:underline">Airbnb your service</a></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Hosting resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
              <li><a href="#" className="hover:underline">Join a free hosting class</a></li>
              <li><a href="#" className="hover:underline">Find a co-host</a></li>
              <li><a href="#" className="hover:underline">Refer a host</a></li>
            </ul>
          </div>

          {/* Airbnb */}
          <div>
            <h3 className="font-semibold text-[14px] mb-4">Airbnb</h3>
            <ul className="flex flex-col gap-3 text-[14px]">
              <li><a href="#" className="hover:underline">2026 Summer Release</a></li>
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
              <li><a href="#" className="hover:underline">Airbnb.org emergency stays</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[14px]">
          
          <div className="flex flex-wrap items-center gap-2">
            <span>© 2026 Airbnb, Inc.</span>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Terms</a>
            <span className="hidden md:inline">·</span>
            <a href="#" className="hover:underline">Company details</a>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <div className="flex items-center gap-4">
              <a href="#" className="flex items-center gap-2 hover:underline">
                <Globe size={16} />
                <span>English (IN)</span>
              </a>
              <a href="#" className="flex items-center gap-1 hover:underline">
                <span>₹</span>
                <span>INR</span>
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-gray-600">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 2.04c-5.5 0-10 4.48-10 10 0 4.99 3.66 9.12 8.44 9.88v-6.99h-2.54V12.04h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.34 21.16 22 17.03 22 12.04c0-5.52-4.5-10-10-10z"/>
                 </svg>
              </a>
              <a href="#" className="hover:text-gray-600">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                 </svg>
              </a>
              <a href="#" className="hover:text-gray-600">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                 </svg>
              </a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
