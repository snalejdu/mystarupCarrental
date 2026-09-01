import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MapPin, Mail, PhoneCall, Clock, Send, CheckCircle2,
    ArrowRight
} from 'lucide-react';

export default function Contact() {
    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        vehicle_type: 'car',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout>
            <Head>
                <title>Contact Us — RentBohol</title>
                <meta name="description" content="Have questions about vehicle rentals, airport delivery, or listing your car in Bohol? Contact our Tagbilaran customer care team 24/7." />
            </Head>

            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-200 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                        Contact Us
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16 lg:space-y-24">

                {/* Section 1: Form + Info side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left: Contact form */}
                    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                        <div className="space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                                We'd Love to Hear From You
                            </h2>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Need help choosing a vehicle or asking about Bohol pickups? Send us a direct inquiry.
                            </p>
                        </div>

                        {wasSuccessful && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Thank you! Your message has been sent to RentBohol support.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Your Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Juan Dela Cruz"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="you@email.com"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors placeholder:text-slate-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="0917 123 4567"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Interested Vehicle Type</label>
                                <select
                                    value={data.vehicle_type}
                                    onChange={e => setData('vehicle_type', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors"
                                >
                                    <option value="car">Sedan / Automatic Car</option>
                                    <option value="van">15-Seater Group Van</option>
                                    <option value="motorbike">Scooter / Motorbike</option>
                                    <option value="suv">SUV (4x4)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Message</label>
                                <textarea
                                    rows={3}
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder="Tell us about your trip dates or vehicle inquiries..."
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-primary-200 focus:border-primary-500 transition-colors placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="glass-btn w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>{processing ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Right: Contact info card + image */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Scenic Bohol image */}
                        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 relative h-40 sm:h-48">
                            <img
                                src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
                                alt="Bohol Coastal Scenery"
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-5">
                                <div className="text-white space-y-0.5">
                                    <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider block">Headquarters</span>
                                    <h3 className="text-base sm:text-lg font-bold leading-tight">Tagbilaran City & Panglao Island</h3>
                                </div>
                            </div>
                        </div>

                        {/* Contact details list */}
                        <div className="space-y-3">
                            <div className="group p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-amber-400/60 hover:shadow-md transition-all duration-300 flex items-center gap-4">
                                <div className="glass-3d-badge glass-3d-badge--amber shrink-0">
                                    <span className="glass-3d-badge__back" aria-hidden="true" />
                                    <span className="glass-3d-badge__front" aria-hidden="true">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Address</span>
                                    <span className="text-sm font-bold text-slate-900 block truncate sm:whitespace-normal">CPG Avenue, Tagbilaran City, Bohol 6300</span>
                                </div>
                            </div>

                            <div className="group p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-400/60 hover:shadow-md transition-all duration-300 flex items-center gap-4">
                                <div className="glass-3d-badge shrink-0">
                                    <span className="glass-3d-badge__back" aria-hidden="true" />
                                    <span className="glass-3d-badge__front" aria-hidden="true">
                                        <Mail className="w-5 h-5 text-white" />
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Email</span>
                                    <a href="mailto:support@rentbohol.ph" className="text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors block">support@rentbohol.ph</a>
                                </div>
                            </div>

                            <div className="group p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-400/60 hover:shadow-md transition-all duration-300 flex items-center gap-4">
                                <div className="glass-3d-badge glass-3d-badge--emerald shrink-0">
                                    <span className="glass-3d-badge__back" aria-hidden="true" />
                                    <span className="glass-3d-badge__front" aria-hidden="true">
                                        <PhoneCall className="w-5 h-5 text-white" />
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Phone & WhatsApp</span>
                                    <a href="tel:+639171234567" className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors block">(038) 501-8888 / +63 917 123 4567</a>
                                </div>
                            </div>

                            <div className="group p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-teal-400/60 hover:shadow-md transition-all duration-300 flex items-center gap-4">
                                <div className="glass-3d-badge shrink-0">
                                    <span className="glass-3d-badge__back" aria-hidden="true" />
                                    <span className="glass-3d-badge__front" aria-hidden="true">
                                        <Clock className="w-5 h-5 text-white" />
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Opening Hours</span>
                                    <span className="text-sm font-bold text-slate-900 block">Monday – Sunday: 7:00 AM – 10:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* CTA — matches About Us */}
                <div className="bg-slate-50 rounded-2xl p-10 sm:p-14 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 text-center sm:text-left">
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                            Ready to explore Bohol Island?
                        </h3>
                        <p className="text-sm sm:text-base text-slate-500">
                            Call customer care at <span className="font-semibold text-slate-900">(038) 501-8888</span> or browse our available vehicle fleet now.
                        </p>
                    </div>

                    <Link
                        href="/vehicles"
                        className="glass-btn px-8 py-3.5 rounded-lg font-semibold text-sm shrink-0 flex items-center gap-2"
                    >
                        <span>Browse Vehicles Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </PublicLayout>
    );
}
