import axios from 'axios';
import {
  PaginatedListings,
  ListingDetailResponse,
  SearchFilters,
  BookingResponse,
  ReviewResponse,
  AvailabilityResponse
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getListings = async (filters: SearchFilters = {}): Promise<PaginatedListings> => {
  const { data } = await api.get('/listings', { params: filters });
  return data;
};

export const getListing = async (id: number): Promise<ListingDetailResponse> => {
  const { data } = await api.get(`/listings/${id}`);
  return data;
};

export const getListingAvailability = async (id: number, year: number, month: number): Promise<AvailabilityResponse> => {
  const { data } = await api.get(`/listings/${id}/availability`, { params: { year, month } });
  return data;
};

export const getReviews = async (listingId: number): Promise<ReviewResponse[]> => {
  const { data } = await api.get('/reviews', { params: { listing_id: listingId } });
  return data;
};

export const createBooking = async (bookingData: {
  listing_id: number;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
}): Promise<BookingResponse> => {
  const { data } = await api.post('/bookings', bookingData);
  return data;
};

export const getMyBookings = async (): Promise<BookingResponse[]> => {
  const { data } = await api.get('/bookings');
  return data;
};
