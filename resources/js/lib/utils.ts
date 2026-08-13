import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx for conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a number as Philippine Peso.
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format a date string for display.
 */
export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format a date string as short format.
 */
export function formatDateShort(date: string): string {
    return new Date(date).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Calculate the number of days between two dates.
 */
export function daysBetween(start: string, end: string): number {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Mask a name for privacy: "John Doe" → "J***n D**"
 */
export function maskName(name: string): string {
    return name
        .split(' ')
        .map((part) => {
            if (part.length <= 2) return part[0] + '*';
            return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
        })
        .join(' ');
}

/**
 * Get the vehicle type label.
 */
export function vehicleTypeLabel(type: string): string {
    const labels: Record<string, string> = {
        car: 'Car',
        van: 'Van',
        motorbike: 'Motorbike',
        suv: 'SUV',
    };
    return labels[type] || type;
}

/**
 * Get the booking status display info.
 */
export function bookingStatusInfo(status: string): { label: string; color: string } {
    const statuses: Record<string, { label: string; color: string }> = {
        pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800' },
        declined: { label: 'Declined', color: 'bg-red-100 text-red-800' },
        completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
        cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
    };
    return statuses[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
}

/**
 * Bohol municipalities list.
 */
export const BOHOL_LOCATIONS = [
    'Tagbilaran',
    'Panglao',
    'Dauis',
    'Alburquerque',
    'Baclayon',
    'Loboc',
    'Carmen',
    'Talibon',
    'Tubigon',
    'Jagna',
    'Ubay',
    'Anda',
    'Loon',
    'Calape',
    'Cortes',
    'Sikatuna',
    'Balilihan',
    'Antequera',
    'Maribojoc',
    'Loay',
] as const;

/**
 * Vehicle types list.
 */
export const VEHICLE_TYPES = [
    { value: 'car', label: 'Car' },
    { value: 'van', label: 'Van' },
    { value: 'motorbike', label: 'Motorbike' },
    { value: 'suv', label: 'SUV' },
] as const;

/**
 * Generate a star rating display (★★★☆☆ style).
 */
export function starRatingDisplay(rating: number, max: number = 5): string {
    const filled = Math.round(rating);
    return '★'.repeat(filled) + '☆'.repeat(max - filled);
}

/**
 * Truncate text to a maximum length.
 */
export function truncate(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trimEnd() + '…';
}
