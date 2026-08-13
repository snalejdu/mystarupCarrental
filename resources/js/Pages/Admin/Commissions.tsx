import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { DollarSign, PhoneCall, Mail, CarFront, CheckCircle2, Percent, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OwnerCommission {
    id: number;
    name: string;
    email: string;
    phone: string;
    vehicles_count: number;
    total_bookings: number;
    completed_bookings: number;
    total_revenue: number;
    commission_owed: number;
}

interface Props {
    owners: OwnerCommission[];
}

export default function CommissionsPage({ owners }: Props) {
    const totalCommissionOwed = owners.reduce((acc, o) => acc + Number(o.commission_owed), 0);
    const totalGrossRevenue = owners.reduce((acc, o) => acc + Number(o.total_revenue), 0);

    return (
        <AdminLayout title="Commission Ledger">
            <Head title="Commission Ledger — RentBohol Admin" />

            {/* Banner Overview */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="space-y-1 relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/30">
                        <Percent className="w-3.5 h-3.5" /> 4% Global Platform Rate
                    </span>
                    <h2 className="text-3xl font-black text-white tracking-tight pt-2">
                        {formatCurrency(totalCommissionOwed)} Total Commission
                    </h2>
                    <p className="text-xs text-indigo-200/70 font-medium">
                        Platform earnings calculated from {formatCurrency(totalGrossRevenue)} in completed rental volume.
                    </p>
                </div>
            </div>

            {/* Commissions Owed Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="font-extrabold text-base text-white">Owner Commission Breakdown</h3>
                        <p className="text-slate-400 text-xs font-medium">Earnings per registered vehicle host</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                        {owners.length} Registered Hosts
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                                <th className="pb-3 px-3">Vehicle Owner</th>
                                <th className="pb-3 px-3">Listings</th>
                                <th className="pb-3 px-3">Completed Trips</th>
                                <th className="pb-3 px-3">Gross Revenue</th>
                                <th className="pb-3 px-3 text-right">4% Commission Owed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                            {owners.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">
                                        No vehicle hosts registered yet.
                                    </td>
                                </tr>
                            ) : (
                                owners.map((owner) => (
                                    <tr key={owner.id} className="hover:bg-slate-900/60 transition-colors">
                                        <td className="py-4 px-3">
                                            <p className="font-extrabold text-white text-sm">{owner.name}</p>
                                            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-medium">
                                                <span>{owner.phone}</span> • <span>{owner.email}</span>
                                            </p>
                                        </td>
                                        <td className="py-4 px-3 text-slate-300 font-bold">
                                            {owner.vehicles_count} vehicle{owner.vehicles_count !== 1 ? 's' : ''}
                                        </td>
                                        <td className="py-4 px-3 text-slate-300">
                                            <span className="font-extrabold text-white">{owner.completed_bookings}</span> of {owner.total_bookings} rentals
                                        </td>
                                        <td className="py-4 px-3 font-extrabold text-white">
                                            {formatCurrency(Number(owner.total_revenue))}
                                        </td>
                                        <td className="py-4 px-3 text-right">
                                            <span className="font-black text-indigo-400 text-base">
                                                {formatCurrency(Number(owner.commission_owed))}
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
