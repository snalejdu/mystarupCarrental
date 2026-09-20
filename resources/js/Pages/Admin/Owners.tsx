import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatDate } from '@/lib/utils';
import { Users, CarProfile, PhoneCall, EnvelopeSimple } from '@phosphor-icons/react';

interface Props {
    owners: any;
}

export default function AdminOwners({ owners }: Props) {
    return (
        <AdminLayout title="Vehicle Owners Directory">
            <Head title="Vehicle Owners Directory — RentBohol Admin" />

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                        <h3 className="font-semibold text-base text-white">Registered Bohol Hosts</h3>
                        <p className="text-slate-400 text-xs font-medium">Directory of verified vehicle owners on RentBohol</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        {owners.data.length} Total Hosts
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                                <th className="pb-3 px-3">Owner Name</th>
                                <th className="pb-3 px-3">Email Address</th>
                                <th className="pb-3 px-3">Phone Number</th>
                                <th className="pb-3 px-3">Fleet Listings</th>
                                <th className="pb-3 px-3 text-right">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                            {owners.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">
                                        No registered vehicle owners yet.
                                    </td>
                                </tr>
                            ) : (
                                owners.data.map((owner: any) => (
                                    <tr key={owner.id} className="hover:bg-slate-900/60 transition-colors">
                                        <td className="py-4 px-3 font-semibold text-white text-sm">
                                            {owner.name}
                                        </td>
                                        <td className="py-4 px-3 text-slate-300">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <EnvelopeSimple className="w-3.5 h-3.5 text-primary-400" />
                                                <span>{owner.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-slate-300">
                                            <div className="flex items-center gap-1.5 font-medium">
                                                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>{owner.phone || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-primary-400 font-semibold">
                                            {owner.vehicles_count} vehicle{owner.vehicles_count !== 1 ? 's' : ''} listed
                                        </td>
                                        <td className="py-4 px-3 text-right text-slate-400 text-xs font-medium">
                                            {formatDate(owner.created_at)}
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
