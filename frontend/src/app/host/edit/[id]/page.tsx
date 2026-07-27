"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { getListing } from '@/lib/api';

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const listingId = Number(params.id);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListing(listingId),
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    property_type: 'Entire home',
    price_per_night: 50,
    guests_max: 1,
    bedrooms: 1,
    bathrooms: 1,
    image_url: '',
  });

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description || '',
        location: listing.location,
        property_type: listing.property_type,
        price_per_night: listing.price_per_night,
        guests_max: listing.guests_max,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        image_url: listing.images?.[0]?.image_url || '',
      });
    }
  }, [listing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { image_url, ...rest } = data;
      const payload = {
        ...rest,
        image_urls: image_url ? [image_url] : [],
      };
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await axios.put(`${API_URL}/listings/${listingId}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Listing updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      router.push('/host');
    },
    onError: () => {
      toast.error('Failed to update listing.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="max-w-[800px] mx-auto px-4 py-12 pt-32 text-center animate-pulse">Loading listing details...</div>;
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12 pt-32">
      <h1 className="text-[32px] font-semibold tracking-tight mb-8">Edit listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <section className="space-y-4 border-b pb-8">
          <h2 className="text-xl font-semibold">The basics</h2>
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input 
              required
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea 
              required
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Location</label>
            <input 
              required
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Cover Image URL</label>
            <input 
              type="url" 
              name="image_url" 
              value={formData.image_url} 
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
              placeholder="https://images.unsplash.com/photo-..."
            />
          </div>
        </section>

        <section className="space-y-4 border-b pb-8">
          <h2 className="text-xl font-semibold">Property details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Property Type</label>
              <select 
                name="property_type" 
                value={formData.property_type} 
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:border-black appearance-none bg-white"
              >
                <option value="Entire home">Entire home</option>
                <option value="Private room">Private room</option>
                <option value="Apartment">Apartment</option>
                <option value="Cabin">Cabin</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Price per night (USD)</label>
              <input 
                required
                type="number" 
                min="10"
                name="price_per_night" 
                value={formData.price_per_night} 
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Max Guests</label>
              <input type="number" min="1" name="guests_max" value={formData.guests_max} onChange={handleChange} className="w-full border rounded-lg p-3" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Bedrooms</label>
              <input type="number" min="0" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full border rounded-lg p-3" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Bathrooms</label>
              <input type="number" min="0.5" step="0.5" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full border rounded-lg p-3" />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg font-semibold border hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="px-8 py-3 rounded-lg font-semibold bg-[#FF385C] text-white hover:bg-[#D70466] transition disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
