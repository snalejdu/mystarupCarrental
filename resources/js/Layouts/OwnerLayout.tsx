import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Car, CarFront, CalendarDays, User, LogOut, Menu, X, Wallet } from 'lucide-react';
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
        { href: '/owner/vehicles', label: 'My Vehicles', icon: CarFront },
        { href: '/owner/bookings', label: 'Bookings', icon: CalendarDays },
        { href: '/owner/earnings', label: 'Earnings & Payouts', icon: Wallet },
    ];

    const isActive = (href: string) => currentUrl.startsWith(href);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-700 selection:text-white">
            {/* Global Apple Dynamic Island Toast HUD */}
            <DynamicToast />

            {/* Mobile header */}
            <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-between">
                <button onClick={() => setSidebarOpen(true)} className="glass-btn-icon p-2 -ml-2 rounded-lg text-slate-700">
                    <Menu className="w-5 h-5" />
                </button>
                <Link href="/" className="flex items-center">
                    <BrandLogo size="sm" subtitle="Host" />
                </Link>
                <div className="w-9" />
            </div>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
                        <SidebarContent navItems={navItems} isActive={isActive} auth={auth} onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Desktop sidebar */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200 z-30">
                    <SidebarContent navItems={navItems} isActive={isActive} auth={auth} />
                </aside>

                {/* Main content */}
                <main className="flex-1 lg:ml-64">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {title && (
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 tracking-tight">
                                {title}
                            </h1>
                        )}
                        <FlashMessages />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarContent({ navItems, isActive, auth, onClose }: any) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <Link href="/" className="flex items-center">
                    <BrandLogo size="md" subtitle="Host Hub" />
                </Link>
                {onClose && (
                    <button onClick={onClose} className="glass-btn-icon p-1 rounded-lg text-slate-500">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item: any) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            isActive(item.href)
                                ? 'glass-btn text-white'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {auth.user?.name?.[0] || 'H'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{auth.user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{auth.user?.email}</p>
                    </div>
                </div>
                <Link
                    href="/user/switch-role"
                    method="post"
                    as="button"
                    className="glass-btn-outline-light w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-primary-700 rounded-lg mb-2"
                >
                    🔄 Switch to Renter Mode
                </Link>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </Link>
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
