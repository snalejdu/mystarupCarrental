import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { List, X, CarProfile, User, SignOut, CaretDown, PhoneCall, House, CalendarBlank, Compass } from '@phosphor-icons/react';
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
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-2xs pt-safe" style={{ transform: 'translateZ(0)' }}>
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
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
                                className="glass-btn-outline-light flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-primary-700 text-xs font-semibold touch-target-compact"
                            >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>(038) 501-8888</span>
                            </a>

                            {auth?.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                                            {auth.user.name}
                                        </span>
                                        <CaretDown className="w-3.5 h-3.5 text-slate-400" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-spring-up">
                                            <div className="px-4 py-2 border-b border-slate-100">
                                                <p className="text-xs font-semibold text-slate-900 truncate">{auth.user.name}</p>
                                                <p className="text-[11px] text-slate-500 truncate">{auth.user.email}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700">
                                                    {auth.user.role}
                                                </span>
                                            </div>

                                            {auth.user.role === 'renter' && (
                                                <Link href="/renter/bookings" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                                                    My Trips & Bookings
                                                </Link>
                                            )}
                                            {auth.user.role === 'owner' && (
                                                <>
                                                    <Link href="/owner/vehicles" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                                                        My Vehicle Fleet
                                                    </Link>
                                                    <Link href="/owner/bookings" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                                                        Host Bookings
                                                    </Link>
                                                    <Link href="/owner/earnings" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                                                        Host Earnings & Statements
                                                    </Link>
                                                </>
                                            )}
                                            {auth.user.role === 'admin' && (
                                                <>
                                                    <Link href="/admin/dashboard" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                                                        Admin Dashboard
                                                    </Link>
                                                    <Link href="/admin/commissions" className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">
                                                        Commission Ledger
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
                                className="glass-btn-icon touch-target rounded-xl text-slate-700"
                                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
                        <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col pt-safe pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <BrandLogo size="sm" />
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="glass-btn-icon touch-target rounded-lg text-slate-600"
                                    aria-label="Close Navigation"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
                                <Link
                                    href="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium ${currentUrl === '/' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/vehicles"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium ${currentUrl.startsWith('/vehicles') ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
                                >
                                    Vehicles
                                </Link>
                                {!auth?.user && (
                                    <>
                                        <Link
                                            href="/about"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium ${currentUrl === '/about' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
                                        >
                                            About Us
                                        </Link>
                                        <Link
                                            href="/contact"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium ${currentUrl === '/contact' ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
                                        >
                                            Contact Us
                                        </Link>
                                    </>
                                )}
                                {auth?.user?.role === 'owner' ? (
                                    <Link
                                        href="/owner/vehicles"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium ${currentUrl.startsWith('/owner') ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
                                    >
                                        Host Dashboard
                                    </Link>
                                ) : auth?.user?.role === 'renter' ? (
                                    <Link
                                        href="/renter/bookings"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium ${currentUrl.startsWith('/renter') ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
                                    >
                                        My Trips
                                    </Link>
                                ) : (
                                    <Link
                                        href="/register?role=owner"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium ${currentUrl.includes('role=owner') ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-800 hover:bg-slate-50'}`}
                                    >
                                        List Your Vehicle
                                    </Link>
                                )}

                                <div className="pt-2 border-t border-slate-100 my-2">
                                    <a
                                        href="tel:+63385018888"
                                        className="flex items-center gap-2 min-h-[44px] px-3 rounded-xl text-sm font-medium text-primary-700 hover:bg-primary-50"
                                    >
                                        <PhoneCall className="w-4 h-4" /> (038) 501-8888
                                    </a>
                                </div>

                                {auth?.user ? (
                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                        <div className="px-3 py-1">
                                            <p className="text-xs font-semibold text-slate-900">{auth.user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                                        </div>
                                        {auth.user.role !== 'admin' && (
                                            <Link
                                                href="/user/switch-role"
                                                method="post"
                                                as="button"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="w-full text-left flex items-center min-h-[44px] px-3 rounded-xl text-xs font-semibold text-primary-700 bg-primary-50"
                                            >
                                                {auth.user.role === 'owner' ? '🔄 Switch to Renter Mode' : '🔄 Switch to Host Mode'}
                                            </Link>
                                        )}
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full text-left flex items-center min-h-[44px] px-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
                                        >
                                            <SignOut className="w-4 h-4 mr-2" />
                                            Log Out
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 pt-4">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="glass-btn w-full min-h-[48px] flex items-center justify-center rounded-xl font-semibold text-sm"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="glass-btn-accent w-full min-h-[48px] flex items-center justify-center rounded-xl font-semibold text-sm"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Page Content (with bottom-bar safe padding on mobile) */}
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>

            {/* Mobile Bottom Navigation Bar (56px-64px + safe area bottom) */}
            <nav
                aria-label="Mobile Quick Navigation"
                className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg pb-safe"
            >
                <div className="grid grid-cols-4 h-14 items-center px-2">
                    <Link
                        href="/"
                        className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl === '/' ? 'text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <House className="w-5 h-5" weight={currentUrl === '/' ? 'fill' : 'regular'} />
                        <span className="text-xs mt-0.5 font-medium">Home</span>
                    </Link>

                    <Link
                        href="/vehicles"
                        className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.startsWith('/vehicles') ? 'text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <CarProfile className="w-5 h-5" weight={currentUrl.startsWith('/vehicles') ? 'fill' : 'regular'} />
                        <span className="text-xs mt-0.5 font-medium">Vehicles</span>
                    </Link>

                    {auth?.user?.role === 'owner' ? (
                        <Link
                            href="/owner/vehicles"
                            className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.startsWith('/owner') ? 'text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Compass className="w-5 h-5" weight={currentUrl.startsWith('/owner') ? 'fill' : 'regular'} />
                            <span className="text-xs mt-0.5 font-medium">Host Hub</span>
                        </Link>
                    ) : auth?.user?.role === 'renter' ? (
                        <Link
                            href="/renter/bookings"
                            className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.startsWith('/renter') ? 'text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <CalendarBlank className="w-5 h-5" weight={currentUrl.startsWith('/renter') ? 'fill' : 'regular'} />
                            <span className="text-xs mt-0.5 font-medium">Trips</span>
                        </Link>
                    ) : (
                        <Link
                            href="/register?role=owner"
                            className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.includes('role=owner') ? 'text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <Compass className="w-5 h-5" weight={currentUrl.includes('role=owner') ? 'fill' : 'regular'} />
                            <span className="text-xs mt-0.5 font-medium">List Car</span>
                        </Link>
                    )}

                    {auth?.user ? (
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="flex flex-col items-center justify-center h-full touch-target text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                            <User className="w-5 h-5" />
                            <span className="text-xs mt-0.5 font-medium truncate max-w-[60px]">Account</span>
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl === '/login' ? 'text-primary-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            <User className="w-5 h-5" weight={currentUrl === '/login' ? 'fill' : 'regular'} />
                            <span className="text-xs mt-0.5 font-medium">Log In</span>
                        </Link>
                    )}
                </div>
            </nav>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-6 sm:py-16 lg:py-20 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-4 sm:space-y-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-10 lg:gap-12">
                        {/* Brand & Bio */}
                        <div className="col-span-2 md:col-span-1 space-y-1.5 sm:space-y-4">
                            <Link href="/" className="inline-block">
                                <BrandLogo theme="dark" size="md" />
                            </Link>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                                The easiest way to rent vehicles in Bohol, Philippines. Direct from verified local Boholano hosts.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="col-span-1">
                            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2 sm:mb-5">Quick Links</h4>
                            <ul className="space-y-1.5 sm:space-y-3 text-xs sm:text-sm text-slate-400">
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
                                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-2 sm:mb-5">Bohol Island</h4>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                    Tagbilaran, Panglao, Dauis, Loboc, Tubigon, and all island towns.
                                </p>
                            </div>
                            {/* Mobile Support Link */}
                            <div className="pt-2 sm:hidden border-t border-slate-800/80">
                                <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-1">Support 24/7</h4>
                                <a href="tel:+63385018888" className="flex items-center gap-1.5 text-primary-400 font-medium text-xs hover:underline">
                                    <PhoneCall className="w-3.5 h-3.5 shrink-0" /> (038) 501-8888
                                </a>
                                <p className="text-xs text-slate-400 mt-0.5">support@rentbohol.ph</p>
                            </div>
                        </div>

                        {/* Customer Support (Desktop) */}
                        <div className="hidden md:block col-span-1">
                            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-5">Customer Support</h4>
                            <div className="space-y-3 text-sm text-slate-400">
                                <a href="tel:+63385018888" className="flex items-center gap-2 text-primary-300 font-medium hover:underline">
                                    <PhoneCall className="w-3.5 h-3.5" /> (038) 501-8888
                                </a>
                                <p className="text-xs text-slate-400">support@rentbohol.ph</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-3 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-2 sm:gap-4 text-center sm:text-left">
                        <p>© {new Date().getFullYear()} RentBohol. All rights reserved.</p>
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
