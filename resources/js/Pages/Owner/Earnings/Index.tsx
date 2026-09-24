import { Head } from '@inertiajs/react';
import OwnerLayout from '@/Layouts/OwnerLayout';
import { CurrencyDollar, Percent, TrendUp, CheckCircle, CalendarBlank, Wallet } from '@phosphor-icons/react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Props {
    earnings: {
        total_gross: number;
        total_commission: number;
        net_payout: number;
        completed_count: number;
    };
    statements: any[];
}

export default function OwnerEarnings({ earnings, statements }: Props) {
    return (
        <OwnerLayout title="Earnings & Payout Statement">
            <Head title="Earnings & Commission — RentalHub Host" />

            {/* Overview Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
                {/* Net Payout */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Net Host Payout (96%)
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 shrink-0">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {formatCurrency(Number(earnings.net_payout))}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-2">
                        Take-home revenue from {earnings.completed_count} completed trips
                    </p>
                </div>

                {/* Gross Rental Volume */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Gross Rental Value
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center border border-primary-100 shrink-0">
                            <TrendUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {formatCurrency(Number(earnings.total_gross))}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-2">
                        Total value of completed customer rentals
                    </p>
                </div>

                {/* Platform Fee (4%) */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Platform Fee (4%)
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
                            <Percent className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {formatCurrency(Number(earnings.total_commission))}
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-2">
                        Fixed 4% host fee deducted upon trip completion
                    </p>
                </div>
            </div>

            {/* Payout Statement Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="font-semibold text-base text-slate-900">Completed Trip Ledger</h3>
                        <p className="text-slate-500 text-xs font-medium">Individual rental payouts and 4% fee deductions</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
                        {statements.length} Payout Logs
                    </span>
                </div>

                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <table className="w-full text-left border-collapse min-w-[520px]">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 tracking-wider">
                                <th className="pb-3 px-3">Vehicle Title</th>
                                <th className="pb-3 px-3">Rental Dates</th>
                                <th className="pb-3 px-3">Gross Rental</th>
                                <th className="pb-3 px-3">4% Platform Fee</th>
                                <th className="pb-3 px-3 text-right">Net Payout</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {statements.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">
                                        No completed rental payouts yet. Completed trips will automatically log here.
                                    </td>
                                </tr>
                            ) : (
                                statements.map((b) => {
                                    const gross = Number(b.total_price);
                                    const fee = Number(b.commission_amount);
                                    const net = gross - fee;
                                    return (
                                        <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-3 font-semibold text-slate-900">
                                                {b.vehicle?.title || 'Vehicle'}
                                            </td>
                                            <td className="py-4 px-3 text-slate-600">
                                                {formatDate(b.start_date)} - {formatDate(b.end_date)}
                                            </td>
                                            <td className="py-4 px-3 font-semibold text-slate-900">
                                                {formatCurrency(gross)}
                                            </td>
                                            <td className="py-4 px-3 text-amber-700 font-semibold">
                                                - {formatCurrency(fee)}
                                            </td>
                                            <td className="py-4 px-3 text-right font-bold text-emerald-700 text-sm">
                                                {formatCurrency(net)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </OwnerLayout>
    );
}
