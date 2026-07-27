"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Navigation, Building2, Mountain, Trees, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, addMonths } from 'date-fns';
import 'react-day-picker/style.css';

const suggestions = [
  { name: 'Nearby', subtitle: "Find what's around you", icon: Navigation, color: 'text-blue-500', bg: 'bg-gray-100' },
  { name: 'Rishikesh, Uttarakhand', subtitle: 'Because your wishlist has stays in Rishikesh', icon: Building2, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Mussoorie, Uttarakhand', subtitle: 'For nature lovers', icon: Mountain, color: 'text-stone-700', bg: 'bg-stone-100' },
  { name: 'Dehradun, Uttarakhand', subtitle: 'For nature lovers', icon: Trees, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { name: 'Nainital, Uttarakhand', subtitle: 'Known for its lakes', icon: Mountain, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Noida, Uttar Pradesh', subtitle: 'Near you', icon: Building2, color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Haridwar, Uttarakhand', subtitle: 'A hidden gem', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
];

export default function SearchBar() {
  const router = useRouter();

  // --- State ---
  const [location, setLocation] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [activeMenu, setActiveMenu] = useState<'where' | 'when' | 'who' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Derived ---
  const isActive = activeMenu !== null;
  const totalGuests = adults + children;
  const guestLabel = totalGuests > 0
    ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}${infants > 0 ? `, ${infants} infant${infants > 1 ? 's' : ''}` : ''}`
    : 'Add guests';
  const dateLabel = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d')}`
    : 'Add dates';

  // --- Handlers ---
  const handleDestinationClick = useCallback((name: string) => {
    if (name === 'Nearby') {
      setLocation('');
    } else {
      setLocation(name.split(',')[0]);
    }
    // Auto-advance to When
    setActiveMenu('when');
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (dateRange?.from) params.set('check_in', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.set('check_out', format(dateRange.to, 'yyyy-MM-dd'));
    if (totalGuests > 0) params.set('guests', totalGuests.toString());
    router.push(`/search?${params.toString()}`);
    setActiveMenu(null);
  }, [location, dateRange, totalGuests, router]);

  // --- Counter helper ---
  const Counter = ({ label, subtitle, value, onChange, min = 0 }: {
    label: string; subtitle: string; value: number; onChange: (v: number) => void; min?: number;
  }) => (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{label}</span>
        <span className="text-gray-500 text-sm">{subtitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${value <= min ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-gray-800 hover:text-gray-800'}`}
        ><Minus size={16} strokeWidth={2.5} /></button>
        <span className="w-5 text-center font-medium text-gray-900">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:border-gray-800 hover:text-gray-800 transition"
        ><Plus size={16} strokeWidth={2.5} /></button>
      </div>
    </div>
  );

  return (
    <div className="hidden md:flex flex-1 max-w-[850px] w-full relative z-30" ref={containerRef}>

      {/* ───── Search Bar Pill ───── */}
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
            onFocus={() => setActiveMenu('where')}
          />
        </div>

        {!isActive && <div className="border-l h-8 border-gray-300"></div>}

        {/* When */}
        <div
          onClick={() => setActiveMenu('when')}
          className={`flex-1 px-6 py-3 rounded-full transition flex flex-col justify-center ${activeMenu === 'when' ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] z-10' : 'hover:bg-gray-200'}`}
        >
          <div className="text-xs font-bold text-gray-900 tracking-wide">When</div>
          <div className={`text-sm truncate ${dateRange?.from ? 'text-gray-900' : 'text-gray-500'}`}>{dateLabel}</div>
        </div>

        {!isActive && <div className="border-l h-8 border-gray-300"></div>}

        {/* Who */}
        <div
          onClick={() => setActiveMenu('who')}
          className={`flex-[1.2] pl-6 pr-2 py-2 rounded-full transition flex items-center justify-between ${activeMenu === 'who' ? 'bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)] z-10' : 'hover:bg-gray-200'}`}
        >
          <div className="flex flex-col justify-center truncate mr-2">
            <div className="text-xs font-bold text-gray-900 tracking-wide">Who</div>
            <div className={`text-sm truncate ${totalGuests > 0 ? 'text-gray-900' : 'text-gray-500'}`}>{guestLabel}</div>
          </div>

          {/* Search Button */}
          <div
            onClick={(e) => { e.stopPropagation(); handleSearch(); }}
            className={`bg-[#FF385C] text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#D70466] transition shadow-md z-20 ${isActive ? 'px-6 py-3 gap-2' : 'p-4'}`}
          >
            <Search size={18} strokeWidth={3} />
            {isActive && <span className="font-bold text-base">Search</span>}
          </div>
        </div>
      </div>

      {/* ───── DROPDOWNS ───── */}

      {/* Where Dropdown */}
      {activeMenu === 'where' && (
        <div className="absolute top-[120%] left-0 w-[420px] bg-white rounded-[32px] p-6 shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-gray-200 z-50">
          <div className="text-xs font-bold text-gray-900 mb-4 px-2">Suggested destinations</div>
          <div className="flex flex-col">
            {suggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  onClick={() => handleDestinationClick(s.name)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-2xl cursor-pointer"
                >
                  <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={22} className={s.color} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">{s.name}</span>
                    <span className="text-gray-500 text-sm">{s.subtitle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* When Dropdown — Real Calendar */}
      {activeMenu === 'when' && (
        <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[850px] bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-gray-200 z-50 flex flex-col items-center">
          {/* Dates / Flexible toggle */}
          <div className="flex justify-center mb-4">
            <div className="flex bg-[#ebebeb] rounded-full p-1">
              <button className="px-6 py-2 bg-white rounded-full shadow-sm text-sm font-semibold text-gray-900">Dates</button>
              <button className="px-6 py-2 rounded-full text-sm font-semibold text-gray-500 hover:text-gray-900 transition">Flexible</button>
            </div>
          </div>

          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={(selected: DateRange | undefined) => {
              setDateRange(selected);
              // Auto-advance to "Who" once both dates are picked
              if (selected?.from && selected?.to) {
                setTimeout(() => setActiveMenu('who'), 300);
              }
            }}
            numberOfMonths={2}
            disabled={[{ before: new Date() }]}
            startMonth={new Date()}
            endMonth={addMonths(new Date(), 11)}
            className="rdp-airbnb"
            formatters={{
              formatWeekdayName: (day) => day.toLocaleDateString('en-US', { weekday: 'narrow' })
            }}
          />

          {/* Bottom flex pills */}
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2 pl-2">
            <button className="px-4 py-2 border-2 border-gray-900 rounded-full text-sm font-semibold bg-gray-50 text-gray-900">Exact dates</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 1 day</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 2 days</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 3 days</button>
            <button className="px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-900 text-gray-900 transition">± 7 days</button>
          </div>
        </div>
      )}

      {/* Who Dropdown */}
      {activeMenu === 'who' && (
        <div className="absolute top-[120%] right-0 w-[400px] bg-white rounded-[32px] p-8 shadow-[0_6px_20px_rgba(0,0,0,0.2)] border border-gray-200 z-50">
          <div className="flex flex-col gap-0">
            <div className="pb-6 border-b border-gray-200">
              <Counter label="Adults" subtitle="Ages 13 or above" value={adults} onChange={setAdults} />
            </div>
            <div className="py-6 border-b border-gray-200">
              <Counter label="Children" subtitle="Ages 2–12" value={children} onChange={setChildren} />
            </div>
            <div className="py-6 border-b border-gray-200">
              <Counter label="Infants" subtitle="Under 2" value={infants} onChange={setInfants} />
            </div>
            <div className="pt-6">
              <Counter label="Pets" subtitle="Bringing a service animal?" value={pets} onChange={setPets} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
