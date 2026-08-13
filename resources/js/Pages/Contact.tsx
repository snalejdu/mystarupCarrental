import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import {
    MapPin, Mail, PhoneCall, Clock, Send, CheckCircle2,
    ArrowRight, Users
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

    const blogPosts = [
        {
            title: "How To Choose The Right Rental Vehicle in Bohol",
            category: "Bohol Travel Guide",
            date: "12 August 2026",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Which Vehicle Type Fits Your Group Size & Itinerary?",
            category: "Rental Tips",
            date: "10 August 2026",
            image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80",
        },
        {
            title: "Enjoy Speed, Choice & Total Control On Bohol Roads",
            category: "Island Driving",
            date: "08 August 2026",
            image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
        }
    ];

    return (
        <PublicLayout>
            <Head>
                <title>Contact Us — RentBohol</title>
                <meta name="description" content="Have questions about vehicle rentals, airport delivery, or listing your car in Bohol? Contact our Tagbilaran customer care team 24/7." />
            </Head>

            {/* Header — compact clean banner */}
            <div className="bg-slate-50 border-b border-slate-200/80 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                        Contact Us
                    </h1>
                </div>
            </div>

            {/* Main Content — compact container fitting viewport height */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 space-y-16 lg:space-y-24">

                {/* ─── Section 1: Two-column hero (form + info side-by-side) ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Left: Contact form on a sleek white card background */}
                    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-lg space-y-5">
                        <div className="space-y-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-bold uppercase tracking-wider border border-indigo-200/80 inline-flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-indigo-600" /> Send Us a Message
                            </span>

                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                                We'd Love to Hear From You
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
                                Need help choosing a vehicle or asking about Bohol pickups? Send us a direct inquiry.
                            </p>
                        </div>

                        {wasSuccessful && (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Thank you! Your message has been sent to RentBohol support.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Your Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Juan Dela Cruz"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="you@email.com"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        placeholder="0917 123 4567"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Interested Vehicle Type</label>
                                <select
                                    value={data.vehicle_type}
                                    onChange={e => setData('vehicle_type', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                                >
                                    <option value="car">Sedan / Automatic Car</option>
                                    <option value="van">15-Seater Group Van</option>
                                    <option value="motorbike">Scooter / Motorbike</option>
                                    <option value="suv">SUV (4x4)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">Message</label>
                                <textarea
                                    rows={3}
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder="Tell us about your trip dates or vehicle inquiries..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                <span>{processing ? 'Sending...' : 'Send Message'}</span>
                            </button>
                        </form>
                    </div>

                    {/* Right: Contact info card + scenic image (compact stacked) */}
                    <div className="lg:col-span-5 space-y-4">
                        {/* Scenic Bohol image */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 relative h-40 sm:h-48 group">
                            <img
                                src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
                                alt="Bohol Coastal Scenery"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-5">
                                <div className="text-white space-y-1">
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Headquarters</span>
                                    <h3 className="text-base sm:text-lg font-bold leading-tight">Tagbilaran City & Panglao Island</h3>
                                </div>
                            </div>
                        </div>

                        {/* Contact details list */}
                        <div className="space-y-2.5">
                            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3 shadow-xs">
                                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Address</span>
                                    <span className="text-xs font-bold text-slate-900 block">CPG Avenue, Tagbilaran City, Bohol 6300</span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3 shadow-xs">
                                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-500/20">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email</span>
                                    <span className="text-xs font-bold text-slate-900 block">support@rentbohol.ph</span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3 shadow-xs">
                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20">
                                    <PhoneCall className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Phone & WhatsApp</span>
                                    <span className="text-xs font-bold text-slate-900 block">(038) 501-8888 / +63 917 123 4567</span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center gap-3 shadow-xs">
                                <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 border border-purple-500/20">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Opening Hours</span>
                                    <span className="text-xs font-bold text-slate-900 block">Monday – Sunday: 7:00 AM – 10:00 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ─── Section 2: Latest Blog Posts & News ─── */}
                <div className="space-y-14 lg:space-y-20">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
                            Latest blog posts & news
                        </h2>
                        <p className="text-slate-500 text-base font-medium leading-relaxed">
                            Bohol island driving tips & vehicle selection guides
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {blogPosts.map((post, idx) => (
                            <div key={idx} className="p-0 rounded-3xl bg-slate-50 border border-slate-200/80 overflow-hidden hover:shadow-xl hover:bg-white transition-all duration-300 flex flex-col group">
                                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-8 sm:p-10 space-y-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                                            {post.category} • {post.date}
                                        </span>
                                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                                            {post.title}
                                        </h3>
                                    </div>
                                    <Link href="/vehicles" className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2">
                                        <span>Read article</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Section 3: CTA — matches About Us ─── */}
                <div className="bg-slate-50 rounded-3xl p-12 sm:p-16 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-10 shadow-sm">
                    <div className="space-y-4 text-center sm:text-left">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                            Ready to explore Bohol Island?
                        </h3>
                        <p className="text-sm sm:text-base text-slate-500 font-medium">
                            Call customer care at <span className="font-bold text-slate-900">(038) 501-8888</span> or browse our available vehicle fleet now.
                        </p>
                    </div>

                    <Link
                        href="/vehicles"
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all shrink-0 flex items-center gap-2"
                    >
                        <span>Browse Vehicles Now</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </PublicLayout>
    );
}
