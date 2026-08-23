import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X, CarFront, User, LogOut, ChevronDown, PhoneCall } from 'lucide-react';

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { auth } = usePage<any>().props;
    const currentUrl = usePage().url;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-primary-600 selection:text-white">
            {/* Top Navigation Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center text-white">
                                <CarFront className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl text-slate-900 tracking-tight">
                                Rent<span className="text-primary-700">Bohol</span>
                            </span>
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
                                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors text-xs font-semibold border border-primary-200"
                            >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>(038) 501-8888</span>
                            </a>

                            {auth?.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-primary-700 text-white flex items-center justify-center font-semibold text-xs">
                                            {auth.user.name?.[0] || 'U'}
                                        </div>
                                        <span>{auth.user.name}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
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
                                                <span className="flex items-center gap-2"><LogOut className="w-3.5 h-3.5" /> Log Out</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-5 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-lg font-semibold text-sm transition-colors"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                                <Link href="/login" className="flex-1 py-2.5 bg-primary-700 text-white rounded-lg font-semibold text-center text-sm">
                                    Log In
                                </Link>
                                <Link href="/register" className="flex-1 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-semibold text-center text-sm shadow-xs">
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
            <footer className="bg-slate-900 text-white py-16 lg:py-20 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center text-white">
                                    <CarFront className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-lg text-white">
                                    Rent<span className="text-primary-400">Bohol</span>
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                The easiest way to rent vehicles in Bohol, Philippines. No more missed messages or double bookings.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-5">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/vehicles" className="hover:text-white transition-colors">Browse Vehicles</Link></li>
                                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/register?role=owner" className="hover:text-white transition-colors">List Your Vehicle</Link></li>
                                <li><Link href="/login" className="hover:text-white transition-colors">Host / Renter Login</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-5">Bohol, Philippines</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Serving Tagbilaran, Panglao, Dauis, Loboc, Tubigon, and all municipalities across Bohol island.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-5">Customer Support</h4>
                            <div className="space-y-3 text-sm text-slate-400">
                                <p className="flex items-center gap-2 text-primary-300">
                                    <PhoneCall className="w-3.5 h-3.5" /> (038) 501-8888
                                </p>
                                <p>support@rentbohol.ph</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-xs gap-4">
                        <p>© {new Date().getFullYear()} RentBohol. All rights reserved.</p>
                        <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
                            Privacy Policy & Data Protection
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
