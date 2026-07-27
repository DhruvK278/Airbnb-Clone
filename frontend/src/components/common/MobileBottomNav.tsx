"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, User, MessageSquare } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on booking page and host pages
  if (pathname.startsWith('/book') || pathname.startsWith('/host')) {
    return null;
  }

  const navItems = [
    { label: 'Explore', href: '/', icon: Search },
    { label: 'Wishlists', href: '/favorites', icon: Heart },
    { label: 'Trips', href: '/trips', icon: () => (
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '24px', width: '24px', fill: 'currentColor' }}>
            <path d="M16 1.928 5.76 20.301l-2.072 6.136c-.328.988-.124 2.062.54 2.871A3.2 3.2 0 0 0 6.72 30.4h18.56a3.2 3.2 0 0 0 2.492-1.092c.664-.81.868-1.883.54-2.871l-2.072-6.136zM16 5.86l8.28 14.86H7.72z" />
        </svg>
    )},
    { label: 'Messages', href: '#', icon: MessageSquare },
    { label: 'Profile', href: '#', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] px-6 py-3 flex justify-between items-center pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.label} 
            href={item.href}
            className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#FF385C]' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#FF385C]' : ''} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
