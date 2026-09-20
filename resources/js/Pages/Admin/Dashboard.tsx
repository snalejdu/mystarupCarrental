import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Users, CarProfile, CalendarCheck, CurrencyDollar, TrendUp, Clock, CheckCircle, ArrowUpRight, Shield, MapPin, ArrowRight } from '@phosphor-icons/react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
    stats: {
        total_owners: number;
        total_vehicles: number;
        active_vehicles: number;
        total_bookings: number;
        pending_bookings: number;
        confirmed_bookings: number;
        completed_bookings: number;
        total_revenue: number;
        total_commission: number;
        commission_rate: number;
    };
    recentBookings: any[];
}

export default function AdminDashboard({ stats, recentBookings }: Props) {
    return (
        <AdminLayout title="Platform Analytics">
            <Head title="Admin Dashboard — RentBohol" />

            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
                {/* Stat 1: Total Commission */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary-300">
                            Total Commission (4%)
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-primary-700/20 text-primary-300 flex items-center justify-center border border-primary-700/30 shrink-0">
                            <CurrencyDollar className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                        <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {formatCurrency(Number(stats.total_commission))}
                        </p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-0.5">
                            <ArrowUpRight className="w-3 h-3" /> +14.2%
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-2">
                        Earned from {stats.completed_bookings} completed bookings
                    </p>
                </div>

                {/* Stat 2: Gross Rentals Revenue */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Completed Volume
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
                            <TrendUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {formatCurrency(Number(stats.total_revenue))}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-2">
                        Gross booking value across Bohol hosts
                    </p>
                </div>

                {/* Stat 3: Registered Vehicle Hosts */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Vehicle Hosts
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-primary-700/20 text-primary-300 flex items-center justify-center border border-primary-700/30 shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {stats.total_owners}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-2">
                        Verified Bohol car & van owners
                    </p>
                </div>

                {/* Stat 4: Active Fleet Listings */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Active Fleet
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
                            <CarProfile className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {stats.total_vehicles}
                    </p>
                    <p className="text-xs text-amber-400 font-semibold mt-2">
                        {stats.active_vehicles} active listings in Bohol
                    </p>
                </div>
            </div>

            {/* Middle Section: Booking Summary + Location Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-6 sm:mb-8">

                {/* Bookings Status Breakdown (5 cols) */}
                <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h3 className="font-semibold text-base text-white">Bookings Breakdown</h3>
                            <p className="text-slate-400 text-xs font-medium">Status distribution across marketplace</p>
                        </div>
                        <span className="px-2.5 py-1 bg-primary-700/10 text-primary-300 border border-primary-700/30 rounded-lg text-xs font-semibold">
                            {stats.total_bookings} Total
                        </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        {/* Pending */}
                        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-xs text-white block">Pending Requests</span>
                                    <span className="text-xs text-slate-400 font-medium">Awaiting host review</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-amber-400 px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                {stats.pending_bookings}
                            </span>
                        </div>

                        {/* Confirmed */}
                        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                                    <CalendarCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-xs text-white block">Confirmed / Active</span>
                                    <span className="text-xs text-slate-400 font-medium">Accepted by host</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                {stats.confirmed_bookings}
                            </span>
                        </div>

                        {/* Completed */}
                        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-700/20 text-primary-300 flex items-center justify-center border border-primary-700/30 shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-semibold text-xs text-white block">Completed Trips</span>
                                    <span className="text-xs text-slate-400 font-medium">Returned & commission logged</span>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-primary-300 px-3 py-1 bg-primary-700/10 rounded-lg border border-primary-700/20">
                                {stats.completed_bookings}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bohol Municipalities & Fleet Coverage (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h3 className="font-semibold text-base text-white">Bohol Coverage Hub</h3>
                            <p className="text-slate-400 text-xs font-medium">Active listings by primary municipality</p>
                        </div>
                        <span className="text-xs font-semibold text-primary-300 bg-primary-700/10 px-3 py-1 rounded-lg border border-primary-700/20">
                            15+ Municipalities
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                            <MapPin className="w-4 h-4 text-primary-400 mx-auto mb-1.5" />
                            <span className="text-xs font-semibold text-white block">Tagbilaran</span>
                            <span className="text-xs text-slate-400 font-semibold">Airport / Pier</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                            <MapPin className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
                            <span className="text-xs font-semibold text-white block">Panglao</span>
                            <span className="text-xs text-slate-400 font-semibold">Alona Beach</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                            <MapPin className="w-4 h-4 text-amber-400 mx-auto mb-1.5" />
                            <span className="text-xs font-semibold text-white block">Dauis</span>
                            <span className="text-xs text-slate-400 font-semibold">Bohol Coast</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                            <MapPin className="w-4 h-4 text-accent-400 mx-auto mb-1.5" />
                            <span className="text-xs font-semibold text-white block">Loboc</span>
                            <span className="text-xs text-slate-400 font-semibold">River Tourism</span>
                        </div>
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-xs font-semibold text-white block">4.0% Global Commission Active</span>
                            <p className="text-xs text-slate-400 font-medium">Free listings for hosts • Platform charges 4% upon acceptance</p>
                        </div>
                        <Link href="/admin/commissions" className="glass-btn min-h-[44px] px-4 py-2 rounded-lg font-semibold text-xs shrink-0 inline-flex items-center justify-center">
                            Ledger & Payouts
                        </Link>
                    </div>
                </div>

            </div>

            {/* Bottom Table: Recent Activity Master Ledger */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="font-semibold text-base text-white">Recent Activity Ledger</h3>
                        <p className="text-slate-400 text-xs font-medium">Latest vehicle rental requests and commission logs</p>
                    </div>
                    <Link
                        href="/admin/bookings"
                        className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-primary-300 hover:text-primary-200 transition-colors self-start sm:self-auto"
                    >
                        <span>View Master Bookings</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                                <th className="pb-3 px-3">Vehicle Details</th>
                                <th className="pb-3 px-3">Renter Name</th>
                                <th className="pb-3 px-3">Rental Dates</th>
                                <th className="pb-3 px-3">Total Value</th>
                                <th className="pb-3 px-3">4% Commission</th>
                                <th className="pb-3 px-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                            {recentBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No recent bookings logged yet.
                                    </td>
                                </tr>
                            ) : (
                                recentBookings.map((b) => {
                                    const totalVal = Number(b.total_price);
                                    const commVal = totalVal * 0.04;
                                    return (
                                        <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                                            <td className="py-3.5 px-3 font-semibold text-white">
                                                {b.vehicle?.title || 'Vehicle'}
                                            </td>
                                            <td className="py-3.5 px-3 text-slate-300 font-semibold">
                                                {b.renter_name}
                                            </td>
                                            <td className="py-3.5 px-3 text-slate-400">
                                                {formatDate(b.start_date)} ({b.total_days || 1}d)
                                            </td>
                                            <td className="py-3.5 px-3 font-semibold text-white">
                                                {formatCurrency(totalVal)}
                                            </td>
                                            <td className="py-3.5 px-3 font-semibold text-primary-400">
                                                {formatCurrency(commVal)}
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                                                    b.status === 'completed'
                                                        ? 'bg-primary-700/20 text-primary-300 border border-primary-700/30'
                                                        : b.status === 'accepted'
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
