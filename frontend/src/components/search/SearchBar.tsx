"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  
  // This will be expanded in later phases to actually update URL/context
  
  return (
    <div className="hidden md:flex flex-1 max-w-[850px] w-full">
      <div className="flex items-center w-full bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-100 transition-colors cursor-pointer group">
        
        {/* Where */}
        <div className="flex-1 px-8 py-3 rounded-full hover:bg-white transition flex flex-col justify-center">
          <div className="text-xs font-bold text-gray-900 tracking-wide">Where</div>
          <input 
            type="text" 
            placeholder="Search destinations" 
            className="w-full bg-transparent text-sm text-gray-500 outline-none truncate placeholder-gray-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div className="border-l h-8 border-gray-300 group-hover:border-transparent"></div>
        
        {/* When */}
        <div className="flex-1 px-6 py-3 hover:bg-white rounded-full transition flex flex-col justify-center">
          <div className="text-xs font-bold text-gray-900 tracking-wide">When</div>
          <div className="text-sm text-gray-500 truncate">Add dates</div>
        </div>
        
        <div className="border-l h-8 border-gray-300 group-hover:border-transparent"></div>
        
        {/* Who */}
        <div className="flex-1 pl-6 pr-2 py-2 hover:bg-white rounded-full transition flex items-center justify-between">
          <div className="flex flex-col justify-center truncate">
            <div className="text-xs font-bold text-gray-900 tracking-wide">Who</div>
            <div className="text-sm text-gray-500 truncate">Add guests</div>
          </div>
          <div className="bg-[#FF385C] text-white p-4 rounded-full flex-shrink-0 hover:bg-[#D70466] transition shadow-md">
            <Search size={18} strokeWidth={3} />
          </div>
        </div>
        
      </div>
    </div>
  );
}
