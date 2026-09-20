import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MapPin,
    EnvelopeSimple,
    PhoneCall,
    Clock,
    PaperPlaneTilt,
    CheckCircle,
    ArrowRight,
    User,
    Car,
    ChatCircleDots,
    WhatsappLogo,
    CaretDown,
    Sparkle,
    ShieldCheck,
} from '@phosphor-icons/react';

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

            {/* Header (Desktop Only) */}
            <div className="hidden sm:block bg-slate-50 border-b border-slate-200 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-1">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-teal-600">
                        GET IN TOUCH
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        Contact Us
                    </h1>
                </div>
            </div>

            {/* Mobile Hero Header & Instant Contact Bar */}
            <div className="sm:hidden px-4 pt-3.5 pb-1">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/70 text-teal-700 text-xs font-bold tracking-wide uppercase">
                            <Sparkle className="w-3 h-3 text-teal-600" weight="fill" />
                            24/7 Island Care
                        </span>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                            Contact Us
                        </h1>
                    </div>
                    {/* Instant Call Button */}
                    <a
                        href="tel:+639171234567"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-bold text-xs active:scale-95 transition-transform shadow-2xs"
                    >
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-600" weight="bold" />
                        <span>Call</span>
                    </a>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Need car delivery, airport pickup, or quick support? Reach out anytime.
                </p>
            </div>

            {/* Mobile Quick Action Pills */}
            <div className="sm:hidden grid grid-cols-2 gap-2 px-4 mt-2.5">
                <a
                    href="https://wa.me/639171234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs active:scale-[0.98] transition-all hover:border-teal-400 min-h-[48px]"
                >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 border border-teal-500/20">
                        <WhatsappLogo className="w-4 h-4" weight="bold" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp</div>
                        <div className="text-xs font-bold text-slate-900 truncate">Chat Instantly</div>
                    </div>
                </a>

                <a
                    href="mailto:support@rentbohol.ph"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs active:scale-[0.98] transition-all hover:border-teal-400 min-h-[48px]"
                >
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 border border-teal-500/20">
                        <EnvelopeSimple className="w-4 h-4" weight="bold" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</div>
                        <div className="text-xs font-bold text-slate-900 truncate">support@rentbohol.ph</div>
                    </div>
                </a>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 lg:py-12 space-y-4 sm:space-y-16 lg:space-y-24">

                {/* Section 1: Form + Info side-by-side */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-8 lg:gap-12 items-start">

                    {/* Left: Contact form */}
                    <div className="lg:col-span-7 bg-white p-4 sm:p-8 rounded-2xl border border-slate-200/90 shadow-xs sm:shadow-sm space-y-3 sm:space-y-5">
                        <div className="space-y-1 sm:space-y-2">
                            <div className="flex items-center gap-2">
                                <ChatCircleDots className="w-4 h-4 text-teal-600 shrink-0 sm:hidden" weight="bold" />
                                <h2 className="text-base sm:text-3xl font-extrabold text-slate-900 leading-snug">
                                    <span className="sm:hidden">Send Us An Inquiry</span>
                                    <span className="hidden sm:inline">We'd Love to Hear From You</span>
                                </h2>
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                Need help choosing a vehicle or asking about Bohol pickups? Send us a direct inquiry.
                            </p>
                        </div>

                        {wasSuccessful && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Thank you! Your message has been sent to RentBohol support.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Your Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Juan Dela Cruz"
                                        className="w-full pl-9.5 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email & Phone: Side-by-Side */}
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 truncate">
                                        Email <span className="hidden sm:inline">Address</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <EnvelopeSimple className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            placeholder="you@email.com"
                                            className="w-full pl-9.5 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors placeholder:text-slate-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 truncate">
                                        Phone <span className="hidden sm:inline">Number</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <PhoneCall className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="0917 123 4567"
                                            className="w-full pl-9.5 pr-3 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Type */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Interested Vehicle Type
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Car className="w-4 h-4" />
                                    </div>
                                    <select
                                        value={data.vehicle_type}
                                        onChange={e => setData('vehicle_type', e.target.value)}
                                        className="w-full pl-9.5 pr-8 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="car">Sedan / Automatic Car</option>
                                        <option value="van">15-Seater Group Van</option>
                                        <option value="motorbike">Scooter / Motorbike</option>
                                        <option value="suv">SUV (4x4)</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                        <CaretDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder="Tell us about your trip dates or vehicle inquiries..."
                                    className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors placeholder:text-slate-400 sm:rows-3"
                                    required
                                />
                            </div>

                            <button
                                 type="submit"
                                 disabled={processing}
                                 className="glass-btn w-full min-h-[48px] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-700/10 active:scale-[0.99] transition-all"
                            >
                                <PaperPlaneTilt className="w-4 h-4" weight="bold" />
                                <span>{processing ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Right: Contact info card + image */}
                    <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                        {/* Scenic Bohol image */}
                        <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-slate-900 relative h-32 sm:h-48">
                            <img
                                src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
                                alt="Bohol Coastal Scenery"
                                className="w-full h-full object-cover opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-3.5 sm:p-5">
                                <div className="text-white space-y-0.5">
                                    <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider block">Headquarters</span>
                                    <h3 className="text-sm sm:text-lg font-bold leading-tight">Tagbilaran City & Panglao Island</h3>
                                </div>
                            </div>
                        </div>

                        {/* Contact details list — 2x2 Grid on Mobile, Single Column on Desktop */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                            <div className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-teal-400/60 transition-all duration-300 flex items-center gap-2.5 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-amber-600" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Address</span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate sm:whitespace-normal">CPG Ave, Tagbilaran</span>
                                </div>
                            </div>

                            <div className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-teal-400/60 transition-all duration-300 flex items-center gap-2.5 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center shrink-0">
                                    <EnvelopeSimple className="w-4 h-4 text-teal-600" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Email</span>
                                    <a href="mailto:support@rentbohol.ph" className="text-xs sm:text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors block truncate">support@rentbohol.ph</a>
                                </div>
                            </div>

                            <div className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-teal-400/60 transition-all duration-300 flex items-center gap-2.5 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
                                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Hotline</span>
                                    <a href="tel:+639171234567" className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors block truncate">(038) 501-8888</a>
                                </div>
                            </div>

                            <div className="group p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-teal-400/60 transition-all duration-300 flex items-center gap-2.5 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center shrink-0">
                                    <Clock className="w-4 h-4 text-teal-600" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Hours</span>
                                    <span className="text-xs sm:text-sm font-bold text-slate-900 block truncate sm:whitespace-normal">7:00 AM – 10:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* CTA Banner */}
                <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-12 border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-8 text-center sm:text-left">
                    <div className="space-y-1 sm:space-y-2">
                        <h3 className="text-base sm:text-3xl font-extrabold text-slate-900 leading-snug">
                            Ready to explore Bohol Island?
                        </h3>
                        <p className="text-xs sm:text-base text-slate-500">
                            Call customer care at <span className="font-semibold text-slate-900">(038) 501-8888</span> or browse our available vehicle fleet now.
                        </p>
                    </div>

                    <Link
                        href="/vehicles"
                        className="glass-btn min-h-[48px] px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-semibold text-sm shrink-0 flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        <span>Browse Vehicles Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </PublicLayout>
    );
}
