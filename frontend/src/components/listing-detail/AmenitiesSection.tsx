import { Amenity } from '@/lib/types';
import * as Icons from 'lucide-react';

export default function AmenitiesSection({ amenities }: { amenities: Amenity[] }) {
  return (
    <div className="py-8 border-b">
      <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
      
      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
        {amenities.map(amenity => {
          // Dynamically map icon names if possible, else fallback
          // E.g. 'wifi' -> Wifi, 'tv' -> Tv
          const IconName = amenity.icon_name.charAt(0).toUpperCase() + amenity.icon_name.slice(1);
          // @ts-ignore
          const IconComponent = Icons[IconName] || Icons.CheckCircle;
          
          return (
            <div key={amenity.id} className="flex items-center gap-4 text-gray-800">
              <IconComponent size={24} strokeWidth={1.5} />
              <span className="text-base">{amenity.name}</span>
            </div>
          );
        })}
      </div>
      
      <button className="mt-8 border border-black rounded-lg px-6 py-3 font-semibold text-base hover:bg-gray-100 transition">
        Show all amenities
      </button>
    </div>
  );
}
