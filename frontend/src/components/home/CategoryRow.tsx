import { useState } from 'react';

const categories = [
  { label: 'Icons', icon: '🌟' },
  { label: 'National parks', icon: '🌲' },
  { label: 'Amazing pools', icon: '🏊' },
  { label: 'Beachfront', icon: '🏖️' },
  { label: 'Farms', icon: '🚜' },
  { label: 'Cabin', icon: '🪵' },
  { label: 'Tiny homes', icon: '🏠' },
  { label: 'Lakefront', icon: '🌊' },
  { label: 'Castles', icon: '🏰' },
  { label: 'Skiing', icon: '⛷️' },
  { label: 'Camping', icon: '🏕️' },
  { label: 'Arctic', icon: '❄️' },
  { label: 'Desert', icon: '🏜️' },
  { label: 'Treehouse', icon: '🌳' },
];

export default function CategoryRow() {
  const [selected, setSelected] = useState('Icons');

  return (
    <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4 mt-2">
      {categories.map((cat) => (
        <div
          key={cat.label}
          onClick={() => setSelected(cat.label)}
          className={`flex flex-col items-center gap-2 cursor-pointer min-w-max pb-2 border-b-2 transition-colors ${selected === cat.label
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
            }`}
        >
          <span className="text-2xl">{cat.icon}</span>
          <span className="text-xs font-semibold">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}
