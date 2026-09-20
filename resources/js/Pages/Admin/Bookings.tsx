import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CalendarBlank, Funnel, User } from '@phosphor-icons/react';

interface Props {
    bookings: any;
    filters: { status?: string };
}

export default function AdminBookings({ bookings, filters }: Props) {
    const handleFilterStatus = (status: string | null) => {
        router.get('/admin/bookings', status ? { status } : {}, { preserveState: true });
    };

    return (
        <AdminLayout title="Master Bookings Ledger">
            <Head title="Master Bookings — RentBohol Admin" />

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6 bg-slate-950 p-2 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 px-3 flex items-center gap-1.5">
                    <Funnel className="w-3.5 h-3.5 text-primary-400" /> Filter:
                </span>
                {['', 'pending', 'accepted', 'completed', 'declined'].map((s) => (
                    <button
                        key={s}
                        onClick={() => handleFilterStatus(s || null)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase ${
                            (filters.status || '') === s
                                ? 'glass-pill-active'
                                : 'glass-btn-outline text-slate-400 hover:text-white'
                        }`}
                    >
                        {s === '' ? 'All Statuses' : s}
                    </button>
                ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="font-semibold text-base text-white">All Platform Rentals</h3>
                        <p className="text-slate-400 text-xs font-medium">Complete record of Bohol vehicle bookings</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        {bookings.data.length} Rentals Shown
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                                <th className="pb-3 px-3">Vehicle & Owner</th>
                                <th className="pb-3 px-3">Renter Name</th>
                                <th className="pb-3 px-3">Rental Dates</th>
                                <th className="pb-3 px-3">Total Value</th>
                                <th className="pb-3 px-3">4% Commission</th>
                                <th className="pb-3 px-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                            {bookings.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        No bookings found matching filter.
                                    </td>
                                </tr>
                            ) : (
                                bookings.data.map((b: any) => (
                                    <tr key={b.id} className="hover:bg-slate-900/60 transition-colors">
                                        <td className="py-4 px-3">
                                            <p className="font-semibold text-white text-sm">{b.vehicle?.title || 'Vehicle'}</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                                                Host: <span className="text-slate-300 font-semibold">{b.vehicle?.owner?.name}</span>
                                            </p>
                                        </td>
                                        <td className="py-4 px-3">
                                            <div className="font-semibold text-white flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5 text-primary-400" />
                                                <span>{b.renter_name}</span>
                                            </div>
                                            {b.renter_email && (
                                                <span className="text-[10px] text-slate-400 block mt-0.5">{b.renter_email}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-3 text-slate-300">
                                            {formatDate(b.start_date)} - {formatDate(b.end_date)}
                                        </td>
                                        <td className="py-4 px-3 font-semibold text-white">
                                            {formatCurrency(Number(b.total_price))}
                                        </td>
                                        <td className="py-4 px-3 font-semibold text-primary-400">
                                            {formatCurrency(Number(b.commission_amount))}
                                        </td>
                                        <td className="py-4 px-3 text-right">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase ${
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
