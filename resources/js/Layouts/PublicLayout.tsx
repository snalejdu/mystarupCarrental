import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { List, X, CarProfile, User, SignOut, CaretDown, PhoneCall } from '@phosphor-icons/react';
import DynamicToast from '@/Components/DynamicToast';
import BrandLogo from '@/Components/BrandLogo';
import { useVehicleAutoSync } from '@/lib/vehicleSync';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { auth, vehicle } = usePage<any>().props;
    const currentUrl = usePage().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Real-time zero-refresh vehicle synchronization for renter views
    useVehicleAutoSync({
        activeVehicleSlug: vehicle?.slug,
        enablePolling: Boolean(vehicle?.slug),
        pollingIntervalMs: 8000,
        showToastOnSync: true,
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-primary-600 selection:text-white">
            {/* Global Apple Dynamic Island Toast HUD */}
            <DynamicToast />

            {/* Top Navigation Header (GPU Layer Promoted) */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-2xs" style={{ transform: 'translateZ(0)' }}>
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center group">
                            <BrandLogo size="md" />
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                            <Link
                                href="/"
                                className={`transition-colors ${currentUrl === '/' ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'
                                    }`}
                            >
                                Home
                            </Link>

                            <Link
                                href="/vehicles"
                                className={`transition-colors ${currentUrl === '/vehicles' || (currentUrl.startsWith('/vehicles') && !currentUrl.includes('type='))
                                        ? 'text-primary-700 font-semibold'
                                        : 'hover:text-primary-700'
                                    }`}
                            >
                                Vehicles
                            </Link>

                            {/* Only show About Us and Contact Us when not logged in */}
                            {!auth?.user && (
                                <>
                                    <Link
                                        href="/about"
                                        className={`transition-colors ${currentUrl === '/about' ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'
                                            }`}
                                    >
                                        About Us
                                    </Link>

                                    <Link
                                        href="/contact"
                                        className={`transition-colors ${currentUrl === '/contact' ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'
                                            }`}
                                    >
                                        Contact Us
                                    </Link>
                                </>
                            )}

                            {/* Host / Renter Links */}
                            {auth?.user?.role === 'owner' ? (
                                <Link
                                    href="/owner/vehicles"
                                    className={`transition-colors ${currentUrl.startsWith('/owner') ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'
                                        }`}
                                >
                                    Host Dashboard
                                </Link>
                            ) : auth?.user?.role === 'renter' ? (
                                <Link
                                    href="/renter/bookings"
                                    className={`transition-colors ${currentUrl.startsWith('/renter') ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'
                                        }`}
                                >
                                    My Trips
                                </Link>
                            ) : (
                                <Link
                                    href="/register?role=owner"
                                    className={`transition-colors ${currentUrl.includes('role=owner') ? 'text-primary-700 font-semibold' : 'hover:text-primary-700'
                                        }`}
                                >
                                    List Your Vehicle
                                </Link>
                            )}
                        </div>

                        {/* Right Contact Pill & Auth Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <a
                                href="tel:+63385018888"
                                className="glass-btn-outline-light flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-primary-700 text-xs font-semibold"
                            >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>(038) 501-8888</span>
                            </a>

                            {auth?.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="glass-btn-outline-light flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center font-semibold text-xs">
                                            {auth.user.name?.[0] || 'U'}
                                        </div>
                                        <span>{auth.user.name}</span>
                                        <CaretDown className="w-3.5 h-3.5 text-slate-400" />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1 animate-fade-in z-50">
                                            {auth.user.role === 'admin' ? (
                                                <Link href="/admin/dashboard" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">
                                                    Admin Dashboard
                                                </Link>
                                            ) : auth.user.role === 'renter' ? (
                                                <Link href="/renter/bookings" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">
                                                    My Rental Trips
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link href="/owner/vehicles" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">
                                                        My Vehicles
                                                    </Link>
                                                    <Link href="/owner/bookings" className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-primary-50 hover:text-primary-700">
                                                        Booking Requests
                                                    </Link>
                                                </>
                                            )}
                                            {auth.user.role !== 'admin' && (
                                                <Link
                                                    href="/user/switch-role"
                                                    method="post"
                                                    as="button"
                                                    className="w-full text-left block px-4 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-50 border-t border-slate-100"
                                                >
                                                    {auth.user.role === 'owner' ? '🔄 Switch to Renter Mode' : '🔄 Switch to Host Mode'}
                                                </Link>
                                            )}
                                            <hr className="my-1 border-slate-100" />
                                            <Link href="/logout" method="post" as="button" className="w-full text-left block px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
                                                <span className="flex items-center gap-2"><SignOut className="w-3.5 h-3.5" /> Log Out</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="glass-btn px-5 py-2 rounded-lg font-semibold text-sm"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="glass-btn-icon p-2 rounded-lg text-slate-700"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
                        <Link href="/" className="block py-2 text-sm font-medium text-slate-800 border-b border-slate-100">
                            Home
                        </Link>
                        <Link href="/vehicles" className="block py-2 text-sm font-medium text-slate-800 border-b border-slate-100">
                            Vehicles
                        </Link>
                        {!auth?.user && (
                            <>
                                <Link href="/about" className="block py-2 text-sm font-medium text-slate-800 border-b border-slate-100">
                                    About Us
                                </Link>
                                <Link href="/contact" className="block py-2 text-sm font-medium text-slate-800 border-b border-slate-100">
                                    Contact Us
                                </Link>
                            </>
                        )}
                        {auth?.user?.role === 'owner' ? (
                            <Link href="/owner/vehicles" className="block py-2 text-sm font-medium text-slate-800 border-b border-slate-100">
                                Host Dashboard
                            </Link>
                        ) : auth?.user?.role === 'renter' ? (
                            <Link href="/renter/bookings" className="block py-2 text-sm font-medium text-slate-800 border-b border-slate-100">
                                My Trips
                            </Link>
                        ) : (
                            <Link href="/register?role=owner" className="block py-2 text-sm font-medium text-slate-800 border-b border-slate-100">
                                List Your Vehicle
                            </Link>
                        )}
                        <a href="tel:+63385018888" className="flex items-center gap-2 py-2 text-sm font-medium text-primary-700">
                            <PhoneCall className="w-4 h-4" /> (038) 501-8888
                        </a>

                        {auth?.user ? (
                            <Link href="/logout" method="post" as="button" className="w-full text-left py-2 text-sm font-medium text-rose-600">
                                Log Out ({auth.user.name})
                            </Link>
                        ) : (
                            <div className="flex gap-2 pt-2">
                                <Link href="/login" className="glass-btn flex-1 py-2.5 rounded-lg font-semibold text-center text-sm">
                                    Log In
                                </Link>
                                <Link href="/register" className="glass-btn-accent flex-1 py-2.5 rounded-lg font-semibold text-center text-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Main Page Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-6 sm:py-16 lg:py-20 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-4 sm:space-y-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-10 lg:gap-12">
                        {/* Brand & Bio */}
                        <div className="col-span-2 md:col-span-1 space-y-1.5 sm:space-y-4">
                            <Link href="/" className="inline-block">
                                <BrandLogo theme="dark" size="md" />
                            </Link>
                            <p className="text-[11px] sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                                The easiest way to rent vehicles in Bohol, Philippines. Direct from verified local Boholano hosts.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="col-span-1">
                            <h4 className="text-[10px] sm:text-xs font-bold uppercase text-slate-300 tracking-wider mb-1.5 sm:mb-5">Quick Links</h4>
                            <ul className="space-y-1 sm:space-y-3 text-[11px] sm:text-sm text-slate-400">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/vehicles" className="hover:text-white transition-colors">Browse Vehicles</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/register?role=owner" className="hover:text-white transition-colors">List Your Vehicle</Link></li>
                                <li><Link href="/login" className="hover:text-white transition-colors">Host / Renter Login</Link></li>
                            </ul>
                        </div>

                        {/* Location / Coverage */}
                        <div className="col-span-1 space-y-2 sm:space-y-0">
                            <div>
                                <h4 className="text-[10px] sm:text-xs font-bold uppercase text-slate-300 tracking-wider mb-1.5 sm:mb-5">Bohol Island</h4>
                                <p className="text-[11px] sm:text-sm text-slate-400 leading-relaxed">
                                    Tagbilaran, Panglao, Dauis, Loboc, Tubigon, and all island towns.
                                </p>
                            </div>
                            {/* Mobile Support Link */}
                            <div className="pt-2 sm:hidden border-t border-slate-800/80">
                                <h4 className="text-[10px] font-bold uppercase text-slate-300 tracking-wider mb-1">Support 24/7</h4>
                                <a href="tel:+63385018888" className="flex items-center gap-1.5 text-primary-400 font-medium text-[11px] hover:underline">
                                    <PhoneCall className="w-3 h-3 shrink-0" /> (038) 501-8888
                                </a>
                                <p className="text-[10px] text-slate-400 mt-0.5">support@RentalHub.ph</p>
                            </div>
                        </div>

                        {/* Customer Support (Desktop) */}
                        <div className="hidden md:block col-span-1">
                            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-5">Customer Support</h4>
                            <div className="space-y-3 text-sm text-slate-400">
                                <a href="tel:+63385018888" className="flex items-center gap-2 text-primary-300 font-medium hover:underline">
                                    <PhoneCall className="w-3.5 h-3.5" /> (038) 501-8888
                                </a>
                                <p className="text-xs text-slate-400">support@RentalHub.ph</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-3 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[10px] sm:text-xs gap-2 sm:gap-4 text-center sm:text-left">
                        <p>© {new Date().getFullYear()} RentalHub. All rights reserved.</p>
                        <div className="flex items-center gap-3 sm:gap-6">
                            <Link href="/terms" className="hover:text-slate-300 transition-colors">
                                Terms & Conditions
                            </Link>
                            <span className="text-slate-700">•</span>
                            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
