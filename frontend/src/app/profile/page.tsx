"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="max-w-[2520px] mx-auto px-4 sm:px-10 xl:px-20 mt-12 mb-24 text-gray-900">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <h1 className="text-3xl font-semibold mb-8">Profile</h1>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "about" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}`}
            >
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" className="w-6 h-6 rounded-full object-cover" alt="User" />
              About me
            </button>
            <Link
              href="/trips"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-gray-50 text-gray-900"
            >
              <span className="text-xl">🧳</span>
              Past trips
            </Link>
            <button
              onClick={() => setActiveTab("connections")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === "connections" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}`}
            >
              <span className="text-xl">🤝</span>
              Connections
            </button>
          </nav>
        </div>

        {/* Right Content */}
        <div className="flex-1 max-w-4xl border-l border-gray-200 pl-0 md:pl-12 lg:pl-24 pt-2">
          
          {activeTab === "about" && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold">About me</h2>
                <button className="border border-gray-900 rounded-lg px-4 py-1.5 text-sm font-semibold hover:bg-gray-50 transition">
                  Edit
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-12">
                
                {/* Profile Card */}
                <div className="bg-white rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.12)] p-8 border border-gray-100 w-full lg:w-[340px] flex-shrink-0 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" className="w-28 h-28 rounded-full object-cover mb-4" alt="Dhruv" />
                        <div className="absolute bottom-4 right-0 bg-[#FF385C] text-white p-1 rounded-full border-2 border-white">
                          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current"><path d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.707 10.707-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L15 18.586l7.293-7.293a1 1 0 0 1 1.414 1.414Z"></path></svg>
                        </div>
                      </div>
                      <h3 className="text-3xl font-semibold">Dhruv</h3>
                      <p className="text-gray-500 text-sm mt-1">Ghaziabad, India</p>
                    </div>
                    
                    <div className="flex flex-col gap-4 mt-2">
                      <div>
                        <p className="text-xl font-bold">2</p>
                        <p className="text-xs font-semibold text-gray-500">Trips</p>
                      </div>
                      <hr className="w-8 border-gray-300" />
                      <div>
                        <p className="text-xl font-bold">1</p>
                        <p className="text-xs font-semibold text-gray-500">Review</p>
                      </div>
                      <hr className="w-8 border-gray-300" />
                      <div>
                        <p className="text-xl font-bold">2</p>
                        <p className="text-xs font-semibold text-gray-500">Years on Airbnb</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info & Verified */}
                <div className="flex flex-col gap-4 mt-4 lg:mt-8">
                  <div className="flex items-center gap-3 text-[15px]">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M16 1a15 15 0 1 0 15 15A15.017 15.017 0 0 0 16 1Zm10.159 7h-4.385a37.893 37.893 0 0 0-2.311-5.3A13.067 13.067 0 0 1 26.159 8ZM16 3.037A37.18 37.18 0 0 1 19.516 8h-7.032A37.18 37.18 0 0 1 16 3.037ZM5.841 8h4.385a37.893 37.893 0 0 0 2.311-5.3A13.067 13.067 0 0 1 5.841 8Zm-2.613 6h4.032a35.031 35.031 0 0 0 0 4H3.228a13.059 13.059 0 0 1 0-4ZM5.841 24a13.067 13.067 0 0 1 6.703-5.3A37.893 37.893 0 0 0 10.226 24Zm6.703 5.3A13.067 13.067 0 0 1 5.841 24h4.385A37.893 37.893 0 0 0 12.544 29.3ZM16 28.963A37.18 37.18 0 0 1 12.484 24h7.032A37.18 37.18 0 0 1 16 28.963ZM19.742 22h-7.484a34.316 34.316 0 0 1 0-4h7.484a34.316 34.316 0 0 1 0 4ZM19.456 29.3a37.893 37.893 0 0 0 2.311-5.3h4.385a13.067 13.067 0 0 1-6.696 5.3Zm2.311-7.3a37.893 37.893 0 0 0-2.311-5.3h4.385a13.067 13.067 0 0 1-2.074 5.3Zm7.005-4a13.059 13.059 0 0 1 0 4h-4.032a35.031 35.031 0 0 0 0-4Z"></path></svg>
                    Speaks English and Hindi
                  </div>
                  <div className="flex items-center gap-3 text-[15px]">
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M16 30S2 24.3 2 12V3a1 1 0 0 1 .4-.8A18.8 18.8 0 0 0 16 0a18.8 18.8 0 0 0 13.6 2.2A1 1 0 0 1 30 3v9c0 12.3-14 18-14 18Zm7.7-17.7a1 1 0 0 0-1.4-1.4L15 18.2l-3.3-3.3a1 1 0 0 0-1.4 1.4l4 4a1 1 0 0 0 1.4 0Z"></path></svg>
                    Identity verified
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <h3 className="text-[22px] font-semibold mb-6">My reviews</h3>
                
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-serif text-sm">
                      VA
                    </div>
                    <div>
                      <p className="font-semibold text-[15px]">Ven A Casa Stays</p>
                      <p className="text-gray-500 text-sm">Jaipur, India</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[14px] mb-2">July 2024</p>
                  <p className="text-[15px] mb-4">Looking forward to host you again.</p>
                  
                  <div className="flex flex-col items-start gap-3">
                    <button className="border border-gray-900 rounded-lg px-4 py-2 font-semibold hover:bg-gray-50 transition">
                      Show review
                    </button>
                    <p className="text-xs text-gray-500">
                      Some info has been automatically translated. <span className="underline cursor-pointer">Show original</span>
                    </p>
                  </div>
                </div>

                <hr className="mb-6" />
                
                <button className="flex items-center gap-3 font-semibold text-[15px] hover:bg-gray-50 px-4 py-3 -ml-4 rounded-xl transition">
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"><path d="M26 2H6a4 4 0 0 0-4 4v16a4 4 0 0 0 4 4h4v4.586a1 1 0 0 0 1.707.707L17.414 26H26a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Zm2 20a2 2 0 0 1-2 2H17a1 1 0 0 0-.707.293L12 28.586V25a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2Z"></path><path d="M10 12h12v2H10zM10 16h8v2h-8z"></path></svg>
                  Show reviews I've written
                </button>

              </div>
            </div>
          )}

          {activeTab === "connections" && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-3xl font-semibold mb-8">Connections</h2>
              <div className="p-8 border border-dashed rounded-2xl text-center text-gray-500">
                <p>You have no connections yet.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
