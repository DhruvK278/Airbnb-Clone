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
  guest_timezone?: string;
}): Promise<BookingResponse> => {
  // Auto-detect guest timezone if not provided
  const payload = {
    ...bookingData,
    guest_timezone: bookingData.guest_timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  const { data } = await api.post('/bookings', payload);
  return data;
};

export const getMyBookings = async (): Promise<BookingResponse[]> => {
  const { data } = await api.get('/bookings');
  return data;
};

/**
 * Format a UTC ISO datetime string for display in a specific timezone.
 * Uses the browser's Intl.DateTimeFormat for localized output.
 */
export function formatInTimezone(
  utcDateStr: string,
  timezone: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(utcDateStr);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    ...options,
  }).format(date);
}

/**
 * Get a human-readable timezone abbreviation (e.g., "EST", "PST").
 */
export function getTimezoneAbbr(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value || timezone;
  } catch {
    return timezone;
  }
}

/**
 * Get a human-readable timezone label (e.g., "Eastern Time", "Pacific Time").
 */
export function getTimezoneLabel(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'long',
    }).formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value || timezone;
  } catch {
    return timezone;
  }
}
