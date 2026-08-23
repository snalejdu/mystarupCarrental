import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Lock, ShieldCheck, EyeOff, FileText, Database, PhoneCall, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <PublicLayout>
            <Head>
                <title>Privacy Policy — RentBohol</title>
                <meta name="description" content="Read RentBohol's Privacy Policy. Learn how we protect renter phone numbers, handle vehicle host data, and maintain 100% transparent direct booking privacy in Bohol." />
            </Head>

            {/* Header Banner */}
            <div className="bg-slate-900 text-white py-12 sm:py-16 border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-700/30 text-primary-300 rounded-lg text-xs font-semibold border border-primary-700/40">
                        <Lock className="w-3.5 h-3.5" /> Privacy & Data Governance
                    </span>
                    <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                        RentBohol Privacy Policy
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        Last updated: August 13, 2026. Your privacy and contact protection are core to how our marketplace operates.
                    </p>
                </div>
            </div>

            {/* Policy Content Body */}
            <div className="py-12 sm:py-16 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-10">

                    {/* Section 1: Renter Phone Privacy Highlight */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 text-primary-700 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0 border border-primary-100">
                                <EyeOff className="w-5 h-5" />
                            </div>
                            <h2>1. Renter Contact Privacy Guarantee</h2>
                        </div>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            RentBohol is built to protect renters from spam calls and unsolicited messages. When you submit a vehicle rental request:
                        </p>
                        <ul className="space-y-2 text-sm text-slate-700 pl-4 border-l-2 border-primary-500">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Your mobile phone number and email are <strong>encrypted and hidden from vehicle hosts</strong> while your request is pending review.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>Host contact details and renter contact details are <strong>only unlocked</strong> after the host explicitly accepts your booking request.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>If a host declines your request, your contact information is never disclosed to them.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Section 2: Information We Collect */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <Database className="w-5 h-5" />
                            </div>
                            <h2>2. Information We Collect</h2>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            To facilitate vehicle rentals across Bohol municipalities, we collect only necessary operational data:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">For Renters</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Name, mobile phone number, email address, requested trip dates, and pickup/return location preferences.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                                <h4 className="font-semibold text-xs text-slate-900 uppercase tracking-wider">For Vehicle Hosts</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Host full name, phone number, email, vehicle specs (brand, model, transmission, rates, location, photos), and availability calendar dates.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: How We Use Your Data */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h2>3. How We Use Your Information</h2>
                        </div>
                        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                            <p>We strictly use your information for the following purposes:</p>
                            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                                <li>Coordinating rental requests between renters and Bohol vehicle hosts.</li>
                                <li>Sending booking status updates (Pending, Accepted, Completed, Cancelled).</li>
                                <li>Calculating platform commissions (4% host rate upon completed rentals).</li>
                                <li>Preventing fraudulent listings and maintaining trust across Tagbilaran, Panglao, and Bohol towns.</li>
                            </ul>
                            <p className="font-medium text-slate-900 pt-2">
                                We NEVER sell, rent, or trade your personal information or contact list to third-party ad networks.
                            </p>
                        </div>
                    </div>

                    {/* Section 4: Data Security & Retention */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-4">
                        <div className="flex items-center gap-3 text-slate-900 font-bold text-lg">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h2>4. Security & Data Rights</h2>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            All passwords and contact data are encrypted in transit and at rest using industry-standard protocols. Users may request full account deletion or data inspection at any time by contacting our Tagbilaran support team.
                        </p>
                    </div>

                    {/* Section 5: Contact Support */}
                    <div className="bg-primary-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-white">Have questions about your data privacy?</h3>
                            <p className="text-slate-300 text-xs font-medium">Reach out to our Tagbilaran City privacy officer 24/7.</p>
                        </div>
                        <div className="flex flex-wrap gap-3 shrink-0">
                            <Link
                                href="/contact"
                                className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-2"
                            >
                                <span>Contact Privacy Support</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
