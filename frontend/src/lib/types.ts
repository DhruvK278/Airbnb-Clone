export interface User {
  id: number;
  email: string;
  full_name: string;
  profile_picture_url?: string;
  bio?: string;
  is_host: boolean;
  is_superhost?: boolean;
  created_at: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon_name: string;
}

export interface ListingImage {
  id: number;
  image_url: string;
  display_order: number;
}

export interface ListingListResponse {
  id: number;
  host_id: number;
  title: string;
  location: string;
  property_type: string;
  price_per_night: number;
  rating: number;
  review_count: number;
  is_active: boolean;
  images: ListingImage[];
}

export interface ListingDetailResponse extends ListingListResponse {
  description: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  guests_max: number;
  cleaning_fee: number;
  created_at: string;
  host: User;
  updated_at: string;
  amenities: Amenity[];
  host_id: number;
}

export interface PaginatedListings {
  listings: ListingListResponse[];
  total: number;
  skip: number;
  limit: number;
}

export interface SearchFilters {
  location?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  bedrooms?: number;
  guests?: number;
  check_in_date?: string;
  check_out_date?: string;
  skip?: number;
  limit?: number;
}

export interface BookingResponse {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  listing?: ListingListResponse;
}

export interface ReviewResponse {
  id: number;
  booking_id: number;
  guest_id: number;
  listing_id: number;
  rating: number;
  comment: string;
  created_at: string;
  guest?: User;
}

export interface AvailabilityResponse {
  booked_dates: string[];
}
