import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Car, LayoutDashboard, CarFront, CalendarDays, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';

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
    ];

    const isActive = (href: string) => currentUrl.startsWith(href);

    return (
        <div className="min-h-screen bg-[var(--color-sand-50)]">
            {/* Mobile header */}
            <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-[var(--color-sand-200)] px-4 h-14 flex items-center justify-between">
                <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-[var(--color-sand-100)]">
                    <Menu className="w-5 h-5 text-[var(--color-sand-700)]" />
                </button>
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-accent-500)] rounded-lg flex items-center justify-center">
                        <Car className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-[var(--font-heading)] text-lg font-bold text-[var(--color-primary-600)]">
                        Rent<span className="text-[var(--color-accent-500)]">Bohol</span>
                    </span>
                </Link>
                <div className="w-9" /> {/* Spacer */}
            </div>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl animate-slide-in-left">
                        <SidebarContent navItems={navItems} isActive={isActive} auth={auth} onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Desktop sidebar */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-[var(--color-sand-200)]">
                    <SidebarContent navItems={navItems} isActive={isActive} auth={auth} />
                </aside>

                {/* Main content */}
                <main className="flex-1 lg:ml-64">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {title && (
                            <h1 className="font-[var(--font-heading)] text-2xl lg:text-3xl font-bold text-[var(--color-primary-900)] mb-6">
                                {title}
                            </h1>
                        )}
                        {/* Flash messages */}
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
            <div className="p-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-accent-500)] rounded-xl flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-[var(--font-heading)] text-xl font-bold text-[var(--color-primary-600)]">
                        Rent<span className="text-[var(--color-accent-500)]">Bohol</span>
                    </span>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--color-sand-100)]">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item: any) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            isActive(item.href)
                                ? 'bg-[var(--color-primary-600)] text-white shadow-sm'
                                : 'text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)]'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-[var(--color-sand-200)]">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                        <User className="w-5 h-5 text-[var(--color-primary-600)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--color-primary-900)] truncate">{auth.user?.name}</p>
                        <p className="text-xs text-[var(--color-sand-500)] truncate">{auth.user?.email}</p>
                    </div>
                </div>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm animate-fade-in">
                    {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm animate-fade-in">
                    {flash.error}
                </div>
            )}
        </div>
    );
}
