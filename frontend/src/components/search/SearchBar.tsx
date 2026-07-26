"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Navigation, Building2, Mountain, Trees, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchBar() {
  const [location, setLocation] = useState('');
  const [activeMenu, setActiveMenu] = useState<'where' | 'when' | 'who' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = activeMenu !== null;

  return (
    <div className="hidden md:flex flex-1 max-w-[850px] w-full relative z-30" ref={containerRef}>
      
      {/* Search Bar Pill */}
      <div className={`flex items-center w-full border border-gray-300 rounded-full transition-colors ${isActive ? 'bg-[#ebebeb]' : 'bg-white shadow-md hover:bg-gray-100'} cursor-pointer relative`}>
        
        {/* Where */}
        <div 
          onClick={() => setActiveMenu('where')}
          className={`flex-[1.2] px-8 py-3 rounded-full transition relative flex flex-col justify-center ${activeMenu === 'where' ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] z-10' : 'hover:bg-gray-200'}`}
        >
          <div className="text-xs font-bold text-gray-900 tracking-wide">Where</div>
          <input 
            type="text" 
            placeholder="Search destinations" 
            className="w-full bg-transparent text-sm text-gray-900 outline-none truncate placeholder-gray-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        {!isActive && <div className="border-l h-8 border-gray-300"></div>}
        
        {/* When */}
        <div 
          onClick={() => setActiveMenu('when')}
          className={`flex-1 px-6 py-3 rounded-full transition flex flex-col justify-center ${activeMenu === 'when' ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] z-10' : 'hover:bg-gray-200'}`}
        >
          <div className="text-xs font-bold text-gray-900 tracking-wide">When</div>
          <div className="text-sm text-gray-500 truncate">Add dates</div>
        </div>
        
        {!isActive && <div className="border-l h-8 border-gray-300"></div>}
        
        {/* Who */}
        <div 
          onClick={() => setActiveMenu('who')}
          className={`flex-[1.2] pl-6 pr-2 py-2 rounded-full transition flex items-center justify-between ${activeMenu === 'who' ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] z-10' : 'hover:bg-gray-200'}`}
        >
          <div className="flex flex-col justify-center truncate mr-2">
            <div className="text-xs font-bold text-gray-900 tracking-wide">Who</div>
            <div className={`text-sm truncate ${activeMenu === 'who' ? 'text-gray-900' : 'text-gray-500'}`}>Add guests</div>
          </div>
          
          {/* Search Button */}
          <div className={`bg-[#FF385C] text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#D70466] transition shadow-md z-20 ${isActive ? 'px-6 py-3 gap-2' : 'p-4'}`}>
            <Search size={isActive ? 18 : 18} strokeWidth={3} />
            {isActive && <span className="font-bold text-base">Search</span>}
          </div>
        </div>
      </div>

      {/* DROPDOWNS */}
      {/* Where Dropdown */}
      {activeMenu === 'where' && (
        <div className="absolute top-[120%] left-0 w-[420px] bg-white rounded-[32px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-gray-200 z-50">
          <div className="text-xs font-bold text-gray-900 mb-4 px-2">Suggested destinations</div>
          <div className="flex flex-col">
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
                <Navigation size={22} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">Nearby</span>
                <span className="text-gray-500 text-sm">Find what's around you</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-gray-700">
                <Building2 size={22} className="text-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">Rishikesh, Uttarakhand</span>
                <span className="text-gray-500 text-sm">Because your wishlist has stays in Rishikesh</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
              <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-gray-700">
                <Mountain size={22} className="text-stone-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">Mussoorie, Uttarakhand</span>
                <span className="text-gray-500 text-sm">For nature lovers</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-gray-700">
                <Trees size={22} className="text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">Dehradun, Uttarakhand</span>
                <span className="text-gray-500 text-sm">For nature lovers</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-gray-700">
                <Mountain size={22} className="text-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">Nainital, Uttarakhand</span>
                <span className="text-gray-500 text-sm">Known for its lakes</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-gray-700">
                <Building2 size={22} className="text-rose-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">Noida, Uttar Pradesh</span>
                <span className="text-gray-500 text-sm">Near you</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-gray-700">
                <Building2 size={22} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-medium">Haridwar, Uttarakhand</span>
                <span className="text-gray-500 text-sm">A hidden gem</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* When Dropdown (Mock Calendar) */}
      {activeMenu === 'when' && (
        <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[850px] bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-gray-200 z-50">
          <div className="flex justify-center mb-6">
            <div className="flex bg-[#ebebeb] rounded-full p-1">
              <button className="px-6 py-2 bg-white rounded-full shadow-sm text-sm font-semibold text-gray-900">Dates</button>
              <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition">Flexible</button>
            </div>
          </div>
          
          <div className="flex justify-between px-4 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronLeft size={20} className="text-gray-400" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition"><ChevronRight size={20} className="text-gray-900" /></button>
          </div>
          
          <div className="flex gap-12 justify-center">
            {/* July 2026 */}
            <div className="w-[320px]">
              <div className="text-center font-semibold mb-6 text-gray-900">July 2026</div>
              <div className="grid grid-cols-7 text-xs text-gray-500 text-center mb-4 font-semibold">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>
              <div className="grid grid-cols-7 text-sm text-center gap-y-2 font-medium">
                <div className="text-gray-300"></div><div className="text-gray-300"></div><div className="text-gray-300"></div>
                <div className="py-2.5 text-gray-300">1</div><div className="py-2.5 text-gray-300">2</div><div className="py-2.5 text-gray-300">3</div><div className="py-2.5 text-gray-300">4</div>
                <div className="py-2.5 text-gray-300">5</div><div className="py-2.5 text-gray-300">6</div><div className="py-2.5 text-gray-300">7</div><div className="py-2.5 text-gray-300">8</div><div className="py-2.5 text-gray-300">9</div><div className="py-2.5 text-gray-300">10</div><div className="py-2.5 text-gray-300">11</div>
                <div className="py-2.5 text-gray-300">12</div><div className="py-2.5 text-gray-300">13</div><div className="py-2.5 text-gray-300">14</div><div className="py-2.5 text-gray-300">15</div><div className="py-2.5 text-gray-300">16</div><div className="py-2.5 text-gray-300">17</div><div className="py-2.5 text-gray-300">18</div>
                <div className="py-2.5 text-gray-300">19</div><div className="py-2.5 text-gray-300">20</div><div className="py-2.5 text-gray-300">21</div><div className="py-2.5 text-gray-300">22</div><div className="py-2.5 text-gray-300">23</div><div className="py-2.5 text-gray-300">24</div><div className="py-2.5 text-gray-300">25</div>
                <div className="py-2.5 text-gray-300">26</div><div className="py-2.5 text-gray-900 font-semibold cursor-pointer hover:border hover:border-black rounded-full">27</div><div className="py-2.5 text-gray-900 font-semibold cursor-pointer hover:border hover:border-black rounded-full">28</div><div className="py-2.5 text-gray-900 font-semibold cursor-pointer hover:border hover:border-black rounded-full">29</div><div className="py-2.5 text-gray-900 font-semibold cursor-pointer hover:border hover:border-black rounded-full">30</div><div className="py-2.5 text-gray-900 font-semibold cursor-pointer hover:border hover:border-black rounded-full">31</div><div></div>
              </div>
            </div>
            
            {/* August 2026 */}
            <div className="w-[320px]">
              <div className="text-center font-semibold mb-6 text-gray-900">August 2026</div>
              <div className="grid grid-cols-7 text-xs text-gray-500 text-center mb-4 font-semibold">
                <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
              </div>
              <div className="grid grid-cols-7 text-sm text-center gap-y-2 font-semibold">
                <div></div><div></div><div></div><div></div><div></div><div></div>
                <div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">1</div>
                <div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">2</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">3</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">4</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">5</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">6</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">7</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">8</div>
                <div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">9</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">10</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">11</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">12</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">13</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">14</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">15</div>
                <div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">16</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">17</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">18</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">19</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">20</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">21</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">22</div>
                <div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">23</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">24</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">25</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">26</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">27</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">28</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">29</div>
                <div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">30</div><div className="py-2.5 hover:border hover:border-black rounded-full cursor-pointer text-gray-900">31</div>
              </div>
            </div>
          </div>
          
          {/* Bottom Pills */}
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 pl-4">
            <button className="px-4 py-2 border-2 border-gray-900 rounded-full text-sm font-semibold bg-gray-50 text-gray-900">Exact dates</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 1 day</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 2 days</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 3 days</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 7 days</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 14 days</button>
          </div>
        </div>
      )}

      {/* Who Dropdown */}
      {activeMenu === 'who' && (
        <div className="absolute top-[120%] right-0 w-[400px] bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-gray-200 z-50">
          <div className="flex flex-col">
            
            <div className="flex justify-between items-center pb-6 border-b border-gray-200">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Adults</span>
                <span className="text-gray-500 text-sm">Ages 13 or above</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-800 hover:text-gray-800 transition"><Minus size={16} strokeWidth={2.5}/></button>
                <span className="w-4 text-center font-medium">0</span>
                <button className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:border-gray-800 hover:text-gray-800 transition"><Plus size={16} strokeWidth={2.5}/></button>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-6 border-b border-gray-200">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Children</span>
                <span className="text-gray-500 text-sm">Ages 2–12</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-800 hover:text-gray-800 transition"><Minus size={16} strokeWidth={2.5}/></button>
                <span className="w-4 text-center font-medium">0</span>
                <button className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:border-gray-800 hover:text-gray-800 transition"><Plus size={16} strokeWidth={2.5}/></button>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-6 border-b border-gray-200">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Infants</span>
                <span className="text-gray-500 text-sm">Under 2</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-800 hover:text-gray-800 transition"><Minus size={16} strokeWidth={2.5}/></button>
                <span className="w-4 text-center font-medium">0</span>
                <button className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:border-gray-800 hover:text-gray-800 transition"><Plus size={16} strokeWidth={2.5}/></button>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-6">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Pets</span>
                <span className="text-gray-500 font-medium text-sm underline cursor-pointer hover:text-gray-900 transition">Bringing a service animal?</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-800 hover:text-gray-800 transition"><Minus size={16} strokeWidth={2.5}/></button>
                <span className="w-4 text-center font-medium">0</span>
                <button className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:border-gray-800 hover:text-gray-800 transition"><Plus size={16} strokeWidth={2.5}/></button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
