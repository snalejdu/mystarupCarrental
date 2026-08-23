import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Shield, LayoutDashboard, Percent, CalendarDays, Users, LogOut,
    Menu, X, CarFront, Search, Bell, Activity, ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth } = usePage<any>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentUrl = usePage().url;

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/commissions', label: 'Commission Ledger', icon: Percent },
        { href: '/admin/bookings', label: 'Master Bookings', icon: CalendarDays },
        { href: '/admin/owners', label: 'Vehicle Owners', icon: Users },
    ];

    const isActive = (href: string) => currentUrl.startsWith(href);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans selection:bg-primary-700 selection:text-white">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950 text-white px-4 h-16 flex items-center justify-between border-b border-slate-800">
                <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 font-bold text-lg">
                    <div className="w-7 h-7 bg-primary-700 rounded-lg flex items-center justify-center text-white">
                        <CarFront className="w-4 h-4" />
                    </div>
                    <span>Rent<span className="text-primary-400">Bohol</span> Admin</span>
                </div>
                <div className="w-9" />
            </div>

            {/* Mobile Drawer Overlay */}
            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-950 text-white shadow-2xl border-r border-slate-800">
                        <AdminSidebarContent navItems={navItems} isActive={isActive} auth={auth} onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-950 text-white border-r border-slate-800/80 z-30">
                <AdminSidebarContent navItems={navItems} isActive={isActive} auth={auth} />
            </aside>

            {/* Main Area */}
            <div className="flex-1 lg:ml-64 min-h-screen bg-slate-900 flex flex-col pt-16 lg:pt-0">
                {/* Top Desktop Bar */}
                <header className="hidden lg:flex h-16 bg-slate-950 border-b border-slate-800/80 px-8 items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-400">
                            <Search className="w-3.5 h-3.5 text-primary-400" />
                            <input
                                type="text"
                                placeholder="Search platform bookings, hosts, vehicles..."
                                className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none w-64"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary-700/10 border border-primary-700/30 text-primary-300 rounded-lg text-xs font-semibold">
                            <Activity className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Bohol Live Node • 4% Global Rate</span>
                        </div>

                        <div className="h-4 w-px bg-slate-800" />

                        <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Page Content Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {title && (
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                                    {title}
                                </h1>
                                <p className="text-slate-400 text-xs font-medium mt-1">
                                    RentBohol Platform Management & Revenue Console
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5" /> SUPERADMIN MODE
                                </span>
                            </div>
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}

function AdminSidebarContent({ navItems, isActive, auth, onClose }: any) {
    return (
        <div className="flex flex-col h-full">
            {/* Header Brand */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white">
                        <CarFront className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-white block leading-none">
                            Rent<span className="text-primary-400">Bohol</span>
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold mt-1">
                            Platform Console
                        </span>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation items */}
            <nav className="flex-1 px-4 py-6 space-y-1.5">
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Main Menu
                </div>
                {navItems.map((item: any) => {
                    const active = isActive(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                                active
                                    ? 'bg-primary-700 text-white shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                                <span>{item.label}</span>
                            </div>
                            {active && <ChevronRight className="w-4 h-4 text-white/70" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
                <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-primary-700 text-white font-semibold text-xs flex items-center justify-center">
                        {auth.user?.name?.[0] || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{auth.user?.name}</p>
                        <p className="text-[10px] font-medium text-primary-400 truncate">Super Admin</p>
                    </div>
                </div>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl border border-rose-500/20 transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                </Link>
            </div>
        </div>
    );
}
