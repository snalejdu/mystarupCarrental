/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Inertia shared page props
interface PageProps {
    auth: {
        user: AuthUser | null;
    };
    flash: {
        success: string | null;
        error: string | null;
        warning: string | null;
    };
    appName: string;
    ziggy: {
        url: string;
        port: number | null;
        defaults: Record<string, unknown>;
        routes: Record<string, unknown>;
        location: string;
    };
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: 'owner' | 'admin';
    avatar: string | null;
}

// Vehicle types
type VehicleType = 'car' | 'van' | 'motorbike' | 'suv';
type VehicleStatus = 'active' | 'inactive' | 'archived';
type BookingStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';

interface Vehicle {
    id: number;
    owner_id: number;
    title: string;
    slug: string;
    description: string;
    type: VehicleType;
    brand: string;
    model: string;
    price_per_day: number;
    location: string;
    status: VehicleStatus;
    avg_rating: number;
    total_reviews: number;
    photos: VehiclePhoto[];
    owner?: VehicleOwner;
    created_at: string;
    updated_at: string;
}

interface VehiclePhoto {
    id: number;
    vehicle_id: number;
    path: string;
    url: string;
    order: number;
    alt_text: string;
}

interface VehicleOwner {
    id: number;
    name: string;
    avatar: string | null;
    avg_rating: number;
    total_vehicles: number;
}

interface Booking {
    id: number;
    vehicle_id: number;
    renter_name: string;
    renter_contact?: string; // Only available after acceptance
    renter_email?: string;
    token: string;
    start_date: string;
    end_date: string;
    total_days: number;
    total_price: number;
    commission_rate: number;
    commission_amount: number;
    status: BookingStatus;
    contact_unlocked_at: string | null;
    accepted_at: string | null;
    completed_at: string | null;
    vehicle?: Vehicle;
    ratings?: Rating[];
    created_at: string;
    updated_at: string;
}

interface Rating {
    id: number;
    booking_id: number;
    rater_type: 'owner' | 'renter';
    rater_identifier: string;
    stars: number;
    comment: string;
    created_at: string;
}

// Availability dates
interface AvailabilityDate {
    date: string;
    status: 'available' | 'booked' | 'blocked';
}

// Bohol municipalities
type BoholLocation =
    | 'Tagbilaran'
    | 'Panglao'
    | 'Dauis'
    | 'Alburquerque'
    | 'Baclayon'
    | 'Loboc'
    | 'Carmen'
    | 'Talibon'
    | 'Tubigon'
    | 'Jagna'
    | 'Ubay'
    | 'Anda'
    | 'Loon'
    | 'Calape'
    | 'Cortes'
    | 'Sikatuna'
    | 'Balilihan'
    | 'Antequera'
    | 'Maribojoc'
    | 'Loay';

// Pagination
interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Filter state
interface VehicleFilters {
    search?: string;
    location?: string;
    type?: VehicleType;
    min_price?: number;
    max_price?: number;
    sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}
