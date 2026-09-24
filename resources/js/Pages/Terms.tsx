import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    LuFileText,
    LuShieldCheck,
    LuCompass,
    LuFuel,
    LuTriangleAlert,
    LuCloudRain,
    LuKey,
    LuCar,
    LuCircleCheck,
    LuPhoneCall,
    LuArrowRight,
    LuMapPin,
    LuCalendarCheck,
    LuCircleHelp
} from 'react-icons/lu';

export default function Terms() {
    return (
        <PublicLayout>
            <Head>
                <title>Terms and Conditions | RentalHub</title>
                <meta 
                    name="description" 
                    content="Official Terms and Conditions for renting vehicles in Bohol. Read rental guidelines, license requirements, island boundary rules, and cancellation policies." 
                />
            </Head>

            {/* Header Banner */}
            <div className="bg-slate-900 text-white py-12 sm:py-16 border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 text-teal-300 rounded-lg text-xs font-semibold border border-teal-500/25">
                        <LuFileText className="w-3.5 h-3.5 text-teal-400" /> Rental Agreement & Marketplace Standards
                    </span>
                    <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                        Terms and Conditions
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        Effective: September 2026. These terms govern vehicle reservations, host agreements, and island driving guidelines across Bohol, Philippines.
                    </p>
                </div>
            </div>

            {/* Terms Content Body */}
            <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-10">

                    {/* Section 1: Driver License & Eligibility */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-5">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                                <LuShieldCheck className="w-5 h-5" />
                            </div>
                            <h2>1. Driver Eligibility and License Requirements</h2>
                        </div>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            To ensure safety and legal compliance on Bohol roads, all renters operating motor vehicles must meet the following Philippine Land Transportation Office (LTO) standards:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-teal-500" /> Philippine Residents
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Must present an original, valid LTO Non-Professional or Professional Driver's License with the appropriate vehicle restriction codes (Restriction Code 1 / Condition A for motorbikes, Code 2 / Condition B for cars and light passenger vans).
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-teal-500" /> International Tourists
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Under Philippine LTO rules, foreign tourists may drive with any valid national driver's license from their home country for up to 90 days from their arrival date in the Philippines. Licenses not in English should be accompanied by an International Driving Permit (IDP) or an official embassy translation.
                                </p>
                            </div>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-700 pl-4 border-l-2 border-teal-500">
                            <li className="flex items-start gap-2">
                                <LuCircleCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                <span>Minimum driving age is 18 years for scooters/motorbikes and 21 years for cars, vans, and SUVs.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <LuCircleCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                <span>The primary renter must be present at vehicle pickup and is legally responsible for the vehicle during the rental period.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 2: Island Geographic Boundary & No-Ferry Rule */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-5">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
                                <LuCompass className="w-5 h-5" />
                            </div>
                            <h2>2. Island Boundary Restrictions and No-Ferry Policy</h2>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-2 text-amber-900">
                            <div className="flex items-center gap-2 font-bold text-sm">
                                <LuTriangleAlert className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Strict Bohol Island Boundary Enforcement</span>
                            </div>
                            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                                All rental vehicles are licensed and registered for operation exclusively within Bohol Mainland and Panglao Island (including connected bridges to Dauis and Panglao).
                            </p>
                        </div>
                        <ul className="space-y-2.5 text-sm text-slate-700 pl-4 border-l-2 border-amber-400">
                            <li className="flex items-start gap-2">
                                <LuCircleCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <span><strong>No RoRo Ferry Transport:</strong> Loading rented vehicles onto Roll-on/Roll-off (RoRo) ferries, barges, or cargo vessels to travel outside Bohol (e.g. to Cebu, Dumaguete, Siquijor, Leyte, or Mindanao) is strictly prohibited without prior written authorization from the host.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <LuCircleCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <span><strong>GPS Monitoring Disclosure:</strong> In accordance with the Philippine Data Privacy Act of 2012 (RA 10173), vehicles are equipped with GPS telemetry solely for roadside safety, theft prevention, and island perimeter verification.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3: Handover Inspection & Fuel Policy */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-5">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <LuFuel className="w-5 h-5" />
                            </div>
                            <h2>3. Vehicle Handover Checklist and Fuel Policy</h2>
                        </div>
                        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <p>
                                At pickup, the host and renter complete a mutual digital handover checklist recording the starting odometer, fuel gauge level, and existing cosmetic condition.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Same-to-Same Fuel</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Return the vehicle with the exact same fuel level as received. If returned with less fuel, the renter covers the pump refueling difference plus local service pump pricing.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                                    <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Digital Odometer Log</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Starting and ending kilometers are verified on the platform. Most host listings feature Unlimited Mileage or Bohol Island Only coverage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Security Deposit and Refund Protocol */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-5">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <LuKey className="w-5 h-5" />
                            </div>
                            <h2>4. Security Deposit and Return Inspection</h2>
                        </div>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Security deposits protect hosts against unreturned gear, minor cosmetic scrapes, or fuel discrepancies:
                        </p>
                        <ul className="space-y-2 text-sm text-slate-700 pl-4 border-l-2 border-slate-300">
                            <li className="flex items-start gap-2">
                                <LuCircleCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Deposits (typically ₱1,000 to ₱3,000 for sedans/SUVs, or ₱500 for scooters) are handled directly between host and renter at physical handover.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <LuCircleCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>The full deposit is refunded immediately upon return inspection when the vehicle is returned clean, with matching fuel, and free of damage.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 5: Island Road Safety & Helmet Regulations */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-5">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                                <LuCar className="w-5 h-5" />
                            </div>
                            <h2>5. Road Safety, Speed Limits, and Helmet Laws</h2>
                        </div>
                        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <p>
                                Renters are required to follow all Philippine traffic laws (Republic Act No. 4136) and Bohol provincial ordinances:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                <li>
                                    <strong>Mandatory Helmet Law (RA 10054):</strong> Motorcycle drivers and passengers must wear approved safety helmets at all times. Two clean helmets are included with every motorbike rental on RentalHub.
                                </li>
                                <li>
                                    <strong>Speed Limits:</strong> 30 km/h in crowded town centers and school zones; 50 km/h on provincial highways; 60 km/h on open coastal roads (Panglao Circumferential Road).
                                </li>
                                <li>
                                    <strong>Zero Tolerance for Impairment (RA 10586):</strong> Driving under the influence of alcohol or drugs is strictly illegal and immediately voids host roadside assistance and insurance coverage.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 6: Weather & Typhoon Guarantee */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-5">
                        <div className="flex items-center gap-3 text-teal-700 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
                                <LuCloudRain className="w-5 h-5" />
                            </div>
                            <h2>6. Typhoon and Coast Guard Weather Guarantee</h2>
                        </div>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            Bohol weather can occasionally impact travel plans. We offer island-specific fair weather protections:
                        </p>
                        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200/80 space-y-2 text-teal-950">
                            <p className="text-xs sm:text-sm leading-relaxed font-medium">
                                If the Philippine Coast Guard (PCG) or Civil Aviation Authority of the Philippines (CAAP) cancels sea trips or flights to Tagbilaran Port or Panglao Airport due to public storm warning signals, renters are entitled to <strong>100% free date rescheduling or cancellation with no penalties</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Section 7: Platform Role */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <LuCircleHelp className="w-5 h-5" />
                            </div>
                            <h2>7. Platform Marketplace Role</h2>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            RentalHub acts as a direct software platform connecting verified Bohol vehicle hosts with travelers. Rental agreements and vehicle handovers are executed directly between hosts and renters. We do not charge renters booking fees or commission markups.
                        </p>
                    </div>

                    {/* Contact Support Box */}
                    <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-700">
                        <div className="space-y-1 text-center sm:text-left">
                            <h3 className="font-bold text-lg text-white">Questions about our rental terms?</h3>
                            <p className="text-xs sm:text-sm text-slate-300">
                                Our local Bohol support desk is available to assist your booking coordination.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href="/contact"
                                className="glass-btn px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                            >
                                <span>Contact Support</span>
                                <LuArrowRight className="w-4 h-4 text-teal-200" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
