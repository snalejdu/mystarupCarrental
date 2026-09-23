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
    role: 'owner' | 'admin' | 'renter';
    avatar: string | null;
    address?: string | null;
    date_of_birth?: string | null;
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    driver_license_number?: string | null;
    driver_license_expiry?: string | null;
    driver_license_status?: 'unverified' | 'pending' | 'verified' | 'rejected';
}

// Vehicle types
type VehicleType = 'car' | 'van' | 'motorbike' | 'suv';
type VehicleStatus = 'active' | 'inactive' | 'archived' | 'maintenance';
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
    year?: number | null;
    plate_number?: string | null;
    color?: string | null;
    vin?: string | null;
    price_per_day: number;
    location: string;
    status: VehicleStatus;
    insurance_type?: string | null;
    insurance_expiry?: string | null;
    minimum_rental_days?: number;
    late_fee_per_hour?: number;
    registration_expiry?: string | null;
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
    renter_id?: number | null;
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
    pickup_location?: string | null;
    dropoff_location?: string | null;
    pickup_time?: string | null;
    dropoff_time?: string | null;
    cancelled_at?: string | null;
    declined_at?: string | null;
    cancellation_reason?: string | null;
    owner_notes?: string | null;
    late_fee_charged?: number;
    delivery_address?: string | null;
    status: BookingStatus;
    contact_unlocked_at: string | null;
    accepted_at: string | null;
    completed_at: string | null;
    vehicle?: Vehicle;
    ratings?: Rating[];
    payments?: Payment[];
    damage_reports?: DamageReport[];
    created_at: string;
    updated_at: string;
}

interface Payment {
    id: number;
    booking_id: number;
    payer_id: number | null;
    type: 'deposit' | 'rental' | 'late_fee' | 'damage' | 'refund' | 'delivery_fee';
    method: 'cash' | 'gcash' | 'bank_transfer' | 'credit_card' | 'paymaya' | string;
    amount: number;
    reference_number: string | null;
    status: 'pending' | 'confirmed' | 'failed' | 'refunded';
    paid_at: string | null;
    confirmed_by: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

interface DamageReport {
    id: number;
    booking_id: number;
    reported_by: number;
    type: 'pre_existing' | 'new_damage' | 'wear_and_tear';
    description: string;
    location_on_vehicle: string;
    photo_path: string | null;
    repair_cost: number | null;
    resolved: boolean;
    resolved_at: string | null;
    resolution_notes: string | null;
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
