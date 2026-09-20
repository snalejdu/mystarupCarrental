import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CurrencyDollar, PhoneCall, EnvelopeSimple, CarProfile, CheckCircle, Percent, TrendUp } from '@phosphor-icons/react';
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
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-700/20 text-primary-300 rounded-lg text-xs font-semibold border border-primary-700/30">
                        <Percent className="w-3.5 h-3.5" /> 4% Global Platform Rate
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight pt-2">
                        {formatCurrency(totalCommissionOwed)} Total Commission
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                        Platform earnings calculated from {formatCurrency(totalGrossRevenue)} in completed rental volume.
                    </p>
                </div>
            </div>

            {/* Commissions Owed Table */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="font-semibold text-base text-white">Owner Commission Breakdown</h3>
                        <p className="text-slate-400 text-xs font-medium">Earnings per registered vehicle host</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
                        {owners.length} Registered Hosts
                    </span>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <table className="w-full text-left border-collapse min-w-[560px]">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-semibold uppercase text-slate-400 tracking-wider">
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
                                            <p className="font-semibold text-white text-sm">{owner.name}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-medium flex-wrap">
                                                <span>{owner.phone}</span> • <span>{owner.email}</span>
                                            </p>
                                        </td>
                                        <td className="py-4 px-3 text-slate-300 font-semibold">
                                            {owner.vehicles_count} vehicle{owner.vehicles_count !== 1 ? 's' : ''}
                                        </td>
                                        <td className="py-4 px-3 text-slate-300">
                                            <span className="font-semibold text-white">{owner.completed_bookings}</span> of {owner.total_bookings} rentals
                                        </td>
                                        <td className="py-4 px-3 font-semibold text-white">
                                            {formatCurrency(Number(owner.total_revenue))}
                                        </td>
                                        <td className="py-4 px-3 text-right">
                                            <span className="font-bold text-primary-400 text-base">
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
