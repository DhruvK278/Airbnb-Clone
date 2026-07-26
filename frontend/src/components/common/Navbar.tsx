import Link from 'next/link';
import { Search, Globe, Menu, UserCircle } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';

export default function Navbar() {
  return (
    <header className="border-b bg-white z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-20 pt-4 pb-6">
        <div className="flex justify-between items-start mb-6">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center pt-2">
            <Link href="/" className="flex items-center gap-1 text-[#FF385C]">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', height: '32px', width: '32px', fill: 'currentColor' }}>
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.267 3.42-6.414 3.615l-.28.019-.267.006C5.377 31 2.5 28.584 2.5 24.522l.005-.469c.026-.928.23-1.768.83-3.244l.216-.524c.966-2.298 5.083-10.87 7.11-14.836l.53-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.053.539-2.987 2.21l-.523 1.008c-1.926 3.776-6.06 12.43-7.031 14.736l-.226.54c-.47 1.152-.646 1.79-.668 2.454l-.005.334C4.5 27.335 6.22 29 8.857 29c1.773 0 3.87-1.236 5.831-3.354l.495-.546.683-.837.684.836c1.97 2.122 4.04 3.337 5.793 3.354 2.64 0 4.357-1.665 4.357-4.718l-.001-.212c-.021-.659-.196-1.296-.662-2.435l-.23-.556c-.971-2.306-5.105-10.96-7.03-14.736l-.524-1.008C18.053 3.539 17.24 3 16 3zm.01 10.316c-2.01.021-3.177 1.514-3.177 3.42 0 1.797 1.18 3.37 2.96 3.37 1.737 0 2.92-1.503 2.92-3.327 0-1.89-1.127-3.413-2.703-3.463z" />
              </svg>
              <span className="text-xl font-bold tracking-tight hidden lg:block">airbnb</span>
            </Link>
          </div>

          {/* Top Menu (All, Homes, Experiences, Services) */}
          <div className="hidden md:flex items-center gap-6 text-gray-500 font-medium">
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

          {/* Right menu */}
          <div className="flex items-center gap-1 sm:gap-2 pt-2">
            <Link href="/host" className="hidden sm:block text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-full transition">
              Become a host
            </Link>
            <button className="hidden sm:flex items-center p-2 hover:bg-gray-100 rounded-full transition">
              <Globe size={18} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-2 border rounded-full p-1 pl-3 hover:shadow-md transition cursor-pointer ml-1 sm:ml-2">
              <Menu size={18} className="text-gray-500" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full object-cover" alt="User" />
            </div>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
