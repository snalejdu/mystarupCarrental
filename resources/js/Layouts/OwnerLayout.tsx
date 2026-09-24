import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LuCar,
    LuCalendar,
    LuWallet,
    LuPlus,
    LuShieldCheck,
    LuArrowLeftRight,
    LuLogOut,
    LuMenu,
    LuX,
    LuChevronRight,
    LuCompass,
    LuFileText
} from 'react-icons/lu';
import DynamicToast from '@/Components/DynamicToast';
import BrandLogo from '@/Components/BrandLogo';

interface OwnerLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function OwnerLayout({ children, title }: OwnerLayoutProps) {
    const { auth } = usePage<any>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUrl = usePage().url;

    const navItems = [
        { href: '/owner/vehicles', label: 'My Vehicles', icon: LuCar },
        { href: '/owner/bookings', label: 'Bookings', icon: LuCalendar },
        { href: '/owner/earnings', label: 'Earnings & Payouts', icon: LuWallet },
    ];

    const secondaryNavItems = [
        { href: '/vehicles', label: 'View Marketplace', icon: LuCompass },
        { href: '/terms', label: 'Bohol Rental Rules', icon: LuFileText },
    ];

    const isActive = (href: string) => currentUrl.startsWith(href);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-700 selection:text-white">
            {/* Global Apple Dynamic Island Toast HUD */}
            <DynamicToast />

            {/* Mobile header */}
            <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between pt-safe">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="glass-btn-icon touch-target rounded-xl text-slate-700 -ml-2"
                    aria-label="Open Sidebar"
                >
                    <LuMenu className="w-6 h-6" />
                </button>
                <Link href="/" className="flex items-center">
                    <BrandLogo size="sm" subtitle="Host Hub" />
                </Link>
                <Link
                    href="/owner/vehicles/create"
                    className="touch-target text-teal-700 font-semibold text-xs flex items-center gap-1"
                    title="List New Vehicle"
                >
                    <LuPlus className="w-5 h-5" />
                </Link>
            </div>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col pt-safe pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
                        <SidebarContent
                            navItems={navItems}
                            secondaryNavItems={secondaryNavItems}
                            isActive={isActive}
                            auth={auth}
                            onClose={() => setSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Desktop sidebar */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/90 z-30 shadow-xs">
                    <SidebarContent
                        navItems={navItems}
                        secondaryNavItems={secondaryNavItems}
                        isActive={isActive}
                        auth={auth}
                    />
                </aside>

                {/* Main content */}
                <main className="flex-1 lg:ml-64 pb-20 lg:pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                        {title && (
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">
                                {title}
                            </h1>
                        )}
                        <FlashMessages />
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar (Host Quick Access) */}
            <nav
                aria-label="Host Quick Navigation"
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg pb-safe"
            >
                <div className="grid grid-cols-4 h-14 items-center px-2">
                    <Link
                        href="/owner/vehicles"
                        className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.startsWith('/owner/vehicles') && !currentUrl.includes('/create') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <LuCar className="w-5 h-5" />
                        <span className="text-xs mt-0.5 font-medium">Fleet</span>
                    </Link>

                    <Link
                        href="/owner/bookings"
                        className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.startsWith('/owner/bookings') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <LuCalendar className="w-5 h-5" />
                        <span className="text-xs mt-0.5 font-medium">Bookings</span>
                    </Link>

                    <Link
                        href="/owner/earnings"
                        className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.startsWith('/owner/earnings') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <LuWallet className="w-5 h-5" />
                        <span className="text-xs mt-0.5 font-medium">Earnings</span>
                    </Link>

                    <Link
                        href="/owner/vehicles/create"
                        className={`flex flex-col items-center justify-center h-full touch-target transition-colors ${currentUrl.includes('/owner/vehicles/create') ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <LuPlus className="w-5 h-5" />
                        <span className="text-xs mt-0.5 font-medium">Add Car</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}

function SidebarContent({ navItems, secondaryNavItems, isActive, auth, onClose }: any) {
    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header: Logo & Host Badge */}
            <div className="p-4 border-b border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <BrandLogo size="md" subtitle="Host Hub" />
                    </Link>
                    {onClose && (
                        <button onClick={onClose} className="glass-btn-icon touch-target rounded-lg text-slate-500 hover:text-slate-800" aria-label="Close sidebar">
                            <LuX className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <div className="flex items-center justify-between px-0.5 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Verified Host Portal
                    </span>
                    <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                        Bohol Node
                    </span>
                </div>

                {/* Quick Add Vehicle Action Button */}
                <Link
                    href="/owner/vehicles/create"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-semibold text-xs shadow-xs hover:shadow-md transition-all group"
                >
                    <LuPlus className="w-4 h-4 text-teal-200 group-hover:rotate-90 transition-transform duration-300" />
                    <span>List New Vehicle</span>
                </Link>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                {/* Fleet Operations */}
                <div>
                    <p className="px-3 mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Fleet & Bookings
                    </p>
                    <nav className="space-y-1">
                        {navItems.map((item: any) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center justify-between min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                                        active
                                            ? 'glass-btn text-white shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {active && <span className="w-1.5 h-1.5 rounded-full bg-teal-200" />}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Market & Policies */}
                <div>
                    <p className="px-3 mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Marketplace & Rules
                    </p>
                    <nav className="space-y-1">
                        {secondaryNavItems.map((item: any) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center justify-between min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 transition-colors"
                            >
                                <div className="flex items-center gap-2.5">
                                    <item.icon className="w-4 h-4 text-slate-400" />
                                    <span>{item.label}</span>
                                </div>
                                <LuChevronRight className="w-3 h-3 text-slate-300" />
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bohol Island Host Protection Card */}
                <div className="p-3 rounded-2xl border border-teal-100/90 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-teal-600/10 text-teal-700 flex items-center justify-center shrink-0">
                            <LuShieldCheck className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">Island Shield</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        RoRo ferry departures outside Bohol are strictly prohibited under verified rental terms.
                    </p>
                    <Link
                        href="/terms"
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 touch-target-compact"
                    >
                        <span>Review Guidelines</span>
                        <LuChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            </div>

            {/* Footer Profile & Mode Switcher */}
            <div className="p-3 border-t border-slate-200/80 bg-slate-50/90 space-y-2.5">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {auth.user?.name?.[0]?.toUpperCase() || 'H'}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" title="Host Online" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-900 truncate">{auth.user?.name}</p>
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-1.5 py-0.5 rounded">Host</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{auth.user?.email}</p>
                    </div>
                </div>

                <div className="space-y-1">
                    <Link
                        href="/user/switch-role"
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 min-h-[44px] px-3 py-2 text-xs font-semibold text-teal-800 bg-white hover:bg-teal-50 border border-teal-200/80 hover:border-teal-300 rounded-xl transition-all shadow-2xs group"
                    >
                        <LuArrowLeftRight className="w-3.5 h-3.5 text-teal-600 group-hover:rotate-180 transition-transform duration-300" />
                        <span>Switch to Renter Mode</span>
                    </Link>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-1.5 min-h-[44px] px-3 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 rounded-lg transition-colors group"
                    >
                        <LuLogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Log Out</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function FlashMessages() {
    const { flash } = usePage<any>().props;
    if (!flash.success && !flash.error) return null;
    return (
        <div className="mb-6">
            {flash.success && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
