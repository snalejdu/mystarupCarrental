import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    LuHouse,
    LuCar,
    LuInfo,
    LuPhone,
    LuPhoneCall,
    LuUser,
    LuX,
    LuLogOut,
    LuSettings,
    LuArrowLeftRight,
    LuSparkles,
    LuCirclePlus,
    LuCalendar,
} from 'react-icons/lu';

declare const route: any;

function routeUrl(name: string, fallback: string): string {
    try {
        if (typeof route === 'function') {
            return route(name);
        }
    } catch {
        // route helper not available or route not defined
    }
    return fallback;
}

function isRouteActive(pattern: string): boolean {
    try {
        if (typeof route === 'function') {
            return Boolean(route().current(pattern));
        }
    } catch {
        // route helper not available
    }
    return false;
}

export default function MobileBottomNav() {
    const { auth } = usePage<any>().props;
    const currentUrl = usePage().url;
    const [accountSheetOpen, setAccountSheetOpen] = useState(false);

    // Auto-close sheet when navigating to another URL
    useEffect(() => {
        setAccountSheetOpen(false);
    }, [currentUrl]);

    // Handle ESC key to dismiss sheet
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setAccountSheetOpen(false);
            }
        };

        if (accountSheetOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [accountSheetOpen]);

    // Active state matching (Material Design 3 Variation 6)
    const isHomeActive =
        !accountSheetOpen &&
        (currentUrl === '/' || currentUrl === '' || isRouteActive('home'));

    const isVehiclesActive =
        !accountSheetOpen &&
        (currentUrl === '/vehicles' ||
            (currentUrl.startsWith('/vehicles') && !currentUrl.includes('/create')) ||
            isRouteActive('vehicles.*'));

    const isAboutActive =
        !accountSheetOpen &&
        (currentUrl === '/about' ||
            currentUrl.startsWith('/about') ||
            isRouteActive('about'));

    const isContactActive =
        !accountSheetOpen &&
        (currentUrl === '/contact' ||
            currentUrl.startsWith('/contact') ||
            isRouteActive('contact'));

    const isAccountActive =
        accountSheetOpen ||
        currentUrl.startsWith('/login') ||
        currentUrl.startsWith('/register') ||
        currentUrl.startsWith('/admin') ||
        currentUrl.startsWith('/owner') ||
        currentUrl.startsWith('/renter') ||
        currentUrl.startsWith('/settings') ||
        isRouteActive('login') ||
        isRouteActive('register') ||
        isRouteActive('admin.*') ||
        isRouteActive('owner.*') ||
        isRouteActive('renter.*') ||
        isRouteActive('settings.*');

    const user = auth?.user;

    return (
        <>
            {/* Account Bottom Sheet Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden ${
                    accountSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setAccountSheetOpen(false)}
                aria-hidden="true"
            />

            {/* Account Bottom Sheet */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] transition-transform duration-300 ease-out md:hidden max-h-[85vh] overflow-y-auto ${
                    accountSheetOpen ? 'translate-y-0' : 'translate-y-full'
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Account Options"
            >
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />

                {user ? (
                    /* ── Logged In User Bottom Sheet ── */
                    <div className="space-y-4">
                        {/* User Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                                    {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-900 text-base truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAccountSheetOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Close sheet"
                            >
                                <LuX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Role-based Dashboard Link */}
                        <div className="space-y-1.5">
                            {user.role === 'admin' ? (
                                <Link
                                    href={routeUrl('admin.dashboard', '/admin/dashboard')}
                                    onClick={() => setAccountSheetOpen(false)}
                                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                >
                                    <LuCar className="w-5 h-5 text-teal-600" />
                                    <span>Admin Dashboard</span>
                                </Link>
                            ) : user.role === 'renter' ? (
                                <Link
                                    href={routeUrl('renter.bookings', '/renter/bookings')}
                                    onClick={() => setAccountSheetOpen(false)}
                                    className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                >
                                    <LuCar className="w-5 h-5 text-teal-600" />
                                    <span>My Rental Trips</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={routeUrl('owner.vehicles.index', '/owner/vehicles')}
                                        onClick={() => setAccountSheetOpen(false)}
                                        className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                    >
                                        <LuCar className="w-5 h-5 text-teal-600" />
                                        <span>Host Dashboard (My Vehicles)</span>
                                    </Link>
                                    <Link
                                        href={routeUrl('owner.bookings.index', '/owner/bookings')}
                                        onClick={() => setAccountSheetOpen(false)}
                                        className="flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                                    >
                                        <LuCalendar className="w-5 h-5 text-teal-600" />
                                        <span>Booking Requests</span>
                                    </Link>
                                </>
                            )}

                            {/* "List Your Vehicle" for owners */}
                            {user.role === 'owner' && (
                                <Link
                                    href={routeUrl('owner.vehicles.create', '/owner/vehicles/create')}
                                    onClick={() => setAccountSheetOpen(false)}
                                    className="flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm text-teal-800 bg-teal-50 hover:bg-teal-100/70 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <LuCirclePlus className="w-5 h-5 text-teal-600" />
                                        <span>List Your Vehicle</span>
                                    </div>
                                    <span className="text-xs font-semibold text-teal-700">Add Car →</span>
                                </Link>
                            )}

                            {/* Account Settings */}
                            <Link
                                href={routeUrl('settings.index', '/settings')}
                                onClick={() => setAccountSheetOpen(false)}
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                            >
                                <LuSettings className="w-5 h-5 text-slate-500" />
                                <span>Account Settings</span>
                            </Link>

                            {/* Role Switcher */}
                            {user.role === 'owner' ? (
                                <Link
                                    href="/user/switch-role"
                                    method="post"
                                    as="button"
                                    onClick={() => setAccountSheetOpen(false)}
                                    className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-teal-700 hover:bg-teal-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <LuArrowLeftRight className="w-5 h-5 text-teal-600" />
                                        <span>Switch to Renter Mode</span>
                                    </div>
                                </Link>
                            ) : user.role === 'renter' ? (
                                user.is_host_qualified ? (
                                    <Link
                                        href="/user/switch-role"
                                        method="post"
                                        as="button"
                                        onClick={() => setAccountSheetOpen(false)}
                                        className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-teal-700 hover:bg-teal-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LuArrowLeftRight className="w-5 h-5 text-teal-600" />
                                            <span>Switch to Host Mode</span>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link
                                        href={routeUrl('settings.index', '/settings')}
                                        onClick={() => setAccountSheetOpen(false)}
                                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm text-teal-700 hover:bg-teal-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <LuSparkles className="w-5 h-5 text-teal-600" />
                                            <span>Become a Host (License 🪪)</span>
                                        </div>
                                    </Link>
                                )
                            ) : null}

                            {/* Support Phone Link */}
                            <a
                                href="tel:+63385018888"
                                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
                            >
                                <LuPhoneCall className="w-4 h-4 text-teal-600" />
                                <span>Support: (038) 501-8888</span>
                            </a>
                        </div>

                        {/* Log Out */}
                        <div className="pt-2 border-t border-slate-100">
                            <Link
                                href={routeUrl('logout', '/logout')}
                                method="post"
                                as="button"
                                onClick={() => setAccountSheetOpen(false)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                            >
                                <LuLogOut className="w-4 h-4" />
                                <span>Log Out</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* ── Guest Bottom Sheet ── */
                    <div className="space-y-4">
                        {/* Guest Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Account & Host Access</h3>
                                <p className="text-xs text-slate-500">Sign in to book or manage your Bohol vehicle</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAccountSheetOpen(false)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Close sheet"
                            >
                                <LuX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Log In & Sign Up buttons side-by-side */}
                        <div className="flex gap-2.5 pt-1">
                            <Link
                                href={routeUrl('login', '/login')}
                                onClick={() => setAccountSheetOpen(false)}
                                className="glass-btn flex-1 py-2.5 rounded-lg font-semibold text-center text-sm"
                            >
                                Log In
                            </Link>
                            <Link
                                href={routeUrl('register', '/register')}
                                onClick={() => setAccountSheetOpen(false)}
                                className="glass-btn-accent flex-1 py-2.5 rounded-lg font-semibold text-center text-sm"
                            >
                                Sign Up
                            </Link>
                        </div>

                        {/* List Your Vehicle link */}
                        <Link
                            href="/register?role=owner"
                            onClick={() => setAccountSheetOpen(false)}
                            className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-teal-50 text-slate-800 font-medium text-sm transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-100/60 text-teal-700 flex items-center justify-center">
                                    <LuCar className="w-4 h-4" />
                                </div>
                                <span>List Your Vehicle</span>
                            </div>
                            <span className="text-xs font-semibold text-teal-700">Earn with Waypt →</span>
                        </Link>

                        {/* Phone Support Link */}
                        <a
                            href="tel:+63385018888"
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-teal-700 bg-teal-50/70 hover:bg-teal-50 transition-colors"
                        >
                            <LuPhoneCall className="w-4 h-4 text-teal-600" />
                            <span>Customer Support: (038) 501-8888</span>
                        </a>
                    </div>
                )}
            </div>

            {/* Mobile Bottom Navigation Bar (md:hidden) */}
            <nav
                aria-label="Mobile Navigation"
                className="fixed bottom-0 left-0 right-0 z-40 md:hidden pointer-events-none pb-[env(safe-area-inset-bottom)]"
            >
                <div className="mx-3 mb-3 pointer-events-auto bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/90 px-1 py-1.5">
                    <div className="grid grid-cols-5 items-center">
                        {/* 1. Home Tab */}
                        <Link
                            href={routeUrl('home', '/')}
                            className="flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 w-full text-center transition-colors group focus:outline-none select-none"
                            aria-label="Home"
                        >
                            <LuHouse
                                className={`w-5 h-5 transition-colors ${
                                    isHomeActive ? 'text-teal-600' : 'text-gray-500 group-hover:text-gray-700'
                                }`}
                                strokeWidth={1.5}
                                fill={isHomeActive ? 'currentColor' : 'none'}
                            />
                            {isHomeActive ? (
                                <span className="mt-1 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[12px] font-semibold leading-none shadow-2xs transition-colors">
                                    Home
                                </span>
                            ) : (
                                <span className="mt-1 text-[12px] font-medium text-gray-500 leading-none transition-colors group-hover:text-gray-700">
                                    Home
                                </span>
                            )}
                        </Link>

                        {/* 2. Vehicles Tab */}
                        <Link
                            href={routeUrl('vehicles.index', '/vehicles')}
                            className="flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 w-full text-center transition-colors group focus:outline-none select-none"
                            aria-label="Vehicles"
                        >
                            <LuCar
                                className={`w-5 h-5 transition-colors ${
                                    isVehiclesActive ? 'text-teal-600' : 'text-gray-500 group-hover:text-gray-700'
                                }`}
                                strokeWidth={1.5}
                                fill={isVehiclesActive ? 'currentColor' : 'none'}
                            />
                            {isVehiclesActive ? (
                                <span className="mt-1 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[12px] font-semibold leading-none shadow-2xs transition-colors">
                                    Vehicles
                                </span>
                            ) : (
                                <span className="mt-1 text-[12px] font-medium text-gray-500 leading-none transition-colors group-hover:text-gray-700">
                                    Vehicles
                                </span>
                            )}
                        </Link>

                        {/* 3. About Tab */}
                        <Link
                            href={routeUrl('about', '/about')}
                            className="flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 w-full text-center transition-colors group focus:outline-none select-none"
                            aria-label="About Us"
                        >
                            <LuInfo
                                className={`w-5 h-5 transition-colors ${
                                    isAboutActive
                                        ? 'text-teal-600 [&>circle]:fill-teal-600 [&>circle]:stroke-teal-600 [&>path]:stroke-white'
                                        : 'text-gray-500 group-hover:text-gray-700'
                                }`}
                                strokeWidth={1.5}
                                fill={isAboutActive ? 'currentColor' : 'none'}
                            />
                            {isAboutActive ? (
                                <span className="mt-1 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[12px] font-semibold leading-none shadow-2xs transition-colors">
                                    About
                                </span>
                            ) : (
                                <span className="mt-1 text-[12px] font-medium text-gray-500 leading-none transition-colors group-hover:text-gray-700">
                                    About
                                </span>
                            )}
                        </Link>

                        {/* 4. Contact Tab */}
                        <Link
                            href={routeUrl('contact', '/contact')}
                            className="flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 w-full text-center transition-colors group focus:outline-none select-none"
                            aria-label="Contact Us"
                        >
                            <LuPhone
                                className={`w-5 h-5 transition-colors ${
                                    isContactActive ? 'text-teal-600' : 'text-gray-500 group-hover:text-gray-700'
                                }`}
                                strokeWidth={1.5}
                                fill={isContactActive ? 'currentColor' : 'none'}
                            />
                            {isContactActive ? (
                                <span className="mt-1 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[12px] font-semibold leading-none shadow-2xs transition-colors">
                                    Contact
                                </span>
                            ) : (
                                <span className="mt-1 text-[12px] font-medium text-gray-500 leading-none transition-colors group-hover:text-gray-700">
                                    Contact
                                </span>
                            )}
                        </Link>

                        {/* 5. Account Tab (Opens bottom sheet) */}
                        <button
                            type="button"
                            onClick={() => setAccountSheetOpen(!accountSheetOpen)}
                            className="flex flex-col items-center justify-center min-h-[48px] py-1 px-0.5 w-full text-center transition-colors group focus:outline-none select-none cursor-pointer"
                            aria-label="Account Menu"
                            aria-expanded={accountSheetOpen}
                        >
                            <LuUser
                                className={`w-5 h-5 transition-colors ${
                                    isAccountActive ? 'text-teal-600' : 'text-gray-500 group-hover:text-gray-700'
                                }`}
                                strokeWidth={1.5}
                                fill={isAccountActive ? 'currentColor' : 'none'}
                            />
                            {isAccountActive ? (
                                <span className="mt-1 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[12px] font-semibold leading-none shadow-2xs transition-colors">
                                    Account
                                </span>
                            ) : (
                                <span className="mt-1 text-[12px] font-medium text-gray-500 leading-none transition-colors group-hover:text-gray-700">
                                    Account
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
