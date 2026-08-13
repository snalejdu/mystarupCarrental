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
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-indigo-600 selection:text-white">
            {/* Unified Top Navigation Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                                <CarFront className="w-6 h-6" />
                            </div>
                            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                                Rent<span className="text-indigo-600">Bohol</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-bold text-slate-700">
                            <Link
                                href="/"
                                className={`transition-colors ${currentUrl === '/' ? 'text-indigo-600 font-extrabold' : 'hover:text-indigo-600'
                                    }`}
                            >
                                Home
                            </Link>

                            <Link
                                href="/vehicles"
                                className={`transition-colors ${currentUrl === '/vehicles' || (currentUrl.startsWith('/vehicles') && !currentUrl.includes('type='))
                                        ? 'text-indigo-600 font-extrabold'
                                        : 'hover:text-indigo-600'
                                    }`}
                            >
                                Vehicles
                            </Link>

                            <Link
                                href="/about"
                                className={`transition-colors ${currentUrl === '/about' ? 'text-indigo-600 font-extrabold' : 'hover:text-indigo-600'
                                    }`}
                            >
                                About Us
                            </Link>

                            <Link
                                href="/contact"
                                className={`transition-colors ${currentUrl === '/contact' ? 'text-indigo-600 font-extrabold' : 'hover:text-indigo-600'
                                    }`}
                            >
                                Contact Us
                            </Link>

                            <Link
                                href="/register?role=owner"
                                className={`transition-colors ${currentUrl.includes('role=owner') ? 'text-indigo-600 font-extrabold' : 'hover:text-indigo-600'
                                    }`}
                            >
                                List Your Vehicle
                            </Link>
                        </div>

                        {/* Right Contact Pill & Auth Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <a
                                href="tel:+63385018888"
                                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-xs font-extrabold border border-indigo-200"
                            >
                                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                    <PhoneCall className="w-3.5 h-3.5" />
                                </div>
                                <span>(038) 501-8888</span>
                            </a>

                            {auth?.user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                                            {auth.user.name?.[0] || 'U'}
                                        </div>
                                        <span>{auth.user.name}</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                    </button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 animate-fade-in z-50">
                                            {auth.user.role === 'admin' ? (
                                                <Link href="/admin/dashboard" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
                                                    Admin Dashboard
                                                </Link>
                                            ) : auth.user.role === 'renter' ? (
                                                <Link href="/renter/bookings" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
                                                    My Rental Trips
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link href="/owner/vehicles" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
                                                        My Vehicles
                                                    </Link>
                                                    <Link href="/owner/bookings" className="block px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600">
                                                        Booking Requests
                                                    </Link>
                                                </>
                                            )}
                                            <hr className="my-1 border-slate-100" />
                                            <Link href="/logout" method="post" as="button" className="w-full text-left block px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50">
                                                <span className="flex items-center gap-2"><LogOut className="w-3.5 h-3.5" /> Log Out</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-extrabold text-xs shadow-md shadow-indigo-600/20 transition-all"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-2">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
                        <Link href="/" className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100">
                            Home
                        </Link>
                        <Link href="/vehicles" className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100">
                            Vehicles
                        </Link>
                        <Link href="/about" className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100">
                            About Us
                        </Link>
                        <Link href="/contact" className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100">
                            Contact Us
                        </Link>
                        <Link href="/register?role=owner" className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100">
                            List Your Vehicle
                        </Link>
                        <a href="tel:+63385018888" className="flex items-center gap-2 py-2 text-sm font-bold text-indigo-600">
                            <PhoneCall className="w-4 h-4" /> (038) 501-8888
                        </a>

                        {auth?.user ? (
                            <Link href="/logout" method="post" as="button" className="w-full text-left py-2 text-sm font-bold text-rose-600">
                                Log Out ({auth.user.name})
                            </Link>
                        ) : (
                            <div className="flex gap-2 pt-2">
                                <Link href="/login" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-center text-xs">
                                    Log In
                                </Link>
                                <Link href="/register" className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-center text-xs">
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
            <footer className="bg-slate-950 text-white py-16 lg:py-24 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                    <CarFront className="w-5 h-5" />
                                </div>
                                <span className="font-extrabold text-xl text-white">
                                    Rent<span className="text-indigo-400">Bohol</span>
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                The easiest way to rent vehicles in Bohol, Philippines. No more missed messages or double bookings.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-slate-400 font-semibold">
                                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link href="/vehicles" className="hover:text-white transition-colors">Browse Vehicles</Link></li>
                                <li><Link href="/register?role=owner" className="hover:text-white transition-colors">List Your Vehicle</Link></li>
                                <li><Link href="/login" className="hover:text-white transition-colors">Host / Renter Login</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-6">Bohol, Philippines</h4>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                Serving Tagbilaran, Panglao, Dauis, Loboc, Tubigon, and all municipalities across Bohol island.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider mb-6">Customer Support</h4>
                            <div className="space-y-3 text-sm text-slate-400 font-semibold">
                                <p className="flex items-center gap-2 text-indigo-300">
                                    <PhoneCall className="w-3.5 h-3.5" /> (038) 501-8888
                                </p>
                                <p>support@rentbohol.ph</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-900 pt-8 text-center text-slate-500 text-xs font-medium">
                        © {new Date().getFullYear()} RentBohol. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
