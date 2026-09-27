import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    LuX,
    LuShieldCheck,
    LuCreditCard,
    LuQrCode,
    LuSmartphone,
    LuArrowRight,
    LuCopy,
    LuCheck,
    LuPrinter,
    LuBuilding,
    LuLock,
    LuCalendar,
    LuCar,
    LuSparkles,
    LuCircleCheck
} from 'react-icons/lu';
import { triggerToast } from './DynamicToast';

export interface PaymentReceipt {
    referenceNumber: string;
    paidAmount: number;
    paymentMethod: 'gcash' | 'maya' | 'card' | 'bank_transfer' | 'qrph';
    paidAt: string;
    bookingId: number;
    vehicleName: string;
    status: 'paid';
}

interface PaymentModalProps {
    show: boolean;
    onClose: () => void;
    onPaymentSuccess?: (receipt: PaymentReceipt) => void;
    payEndpoint?: string; // Optional custom endpoint, defaults to /renter/bookings/{booking.id}/pay
    initialReceipt?: PaymentReceipt | null;
    booking: {
        id: number;
        token?: string;
        vehicle_name?: string;
        total_price: number;
        security_deposit?: number;
        start_date: string;
        end_date: string;
        days?: number;
        host_name?: string;
    };
}

export default function PaymentModal({
    show,
    onClose,
    onPaymentSuccess,
    payEndpoint,
    initialReceipt,
    booking
}: PaymentModalProps) {
    const [method, setMethod] = useState<'gcash' | 'maya' | 'card' | 'bank_transfer'>('gcash');

    // GCash Form
    const [gcashPhone, setGcashPhone] = useState('0917-888-2345');
    const [gcashPayMode, setGcashPayMode] = useState<'express' | 'qr'>('express');

    // Maya Form
    const [mayaPhone, setMayaPhone] = useState('0918-777-6543');
    const [mayaPayMode, setMayaPayMode] = useState<'qr' | 'number'>('qr');

    // Card Form
    const [cardHolder, setCardHolder] = useState('JUAN DELA CRUZ');
    const [cardNumber, setCardNumber] = useState('4532 8901 2345 4242');
    const [cardExpiry, setCardExpiry] = useState('08/28');
    const [cardCvv, setCardCvv] = useState('888');

    // Bank Selection
    const [selectedBank, setSelectedBank] = useState<'bdo' | 'bpi' | 'unionbank'>('bpi');

    // States
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState<string>('');
    const [receipt, setReceipt] = useState<PaymentReceipt | null>(initialReceipt || null);

    React.useEffect(() => {
        setReceipt(initialReceipt || null);
    }, [initialReceipt]);

    if (!show) return null;

    const amountToPay = Number(booking.total_price);
    const formattedAmount = `₱${amountToPay.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const destinationEndpoint = payEndpoint || (booking.token ? `/booking/${booking.token}/pay` : `/renter/bookings/${booking.id}/pay`);

    const handleConfirmPayment = () => {
        setIsProcessing(true);
        setProcessingStep('Connecting to Philippine Payment Switch...');

        setTimeout(() => {
            setProcessingStep(`Authorizing with ${method.toUpperCase()} PGW...`);
        }, 600);

        setTimeout(() => {
            const refNumber = `PAY-BOHOL-${Date.now().toString().slice(-8)}`;

            // Send POST to server to persist payment in database
            router.post(
                destinationEndpoint,
                {
                    method: method,
                    reference_number: refNumber,
                    amount: amountToPay,
                    notes: `Paid via Waypt ${method.toUpperCase()} Gateway`,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        const newReceipt: PaymentReceipt = {
                            referenceNumber: refNumber,
                            paidAmount: amountToPay,
                            paymentMethod: method,
                            paidAt: new Date().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                            bookingId: booking.id,
                            vehicleName: booking.vehicle_name || 'Bohol Island Rental Vehicle',
                            status: 'paid',
                        };

                        setIsProcessing(false);
                        setReceipt(newReceipt);
                        if (onPaymentSuccess) {
                            onPaymentSuccess(newReceipt);
                        }

                        triggerToast({
                            title: 'Payment Confirmed!',
                            description: `Received ${formattedAmount} via ${method.toUpperCase()}. Ref: ${refNumber}`,
                            type: 'payment',
                            duration: 5000,
                        });
                    },
                    onError: (errors) => {
                        setIsProcessing(false);
                        triggerToast({
                            title: 'Payment Error',
                            description: 'Unable to record payment. Please try again.',
                            type: 'error',
                            duration: 4000,
                        });
                    }
                }
            );
        }, 1200);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        triggerToast({
            title: `${label} Copied!`,
            description: text,
            type: 'success',
            duration: 2500,
        });
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-md transition-all animate-fade-in">
            <div
                className="w-full max-w-xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-spring-scale max-h-[92dvh] sm:max-h-[90vh] flex flex-col pb-safe"
                style={{
                    boxShadow: '0 25px 70px -15px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.08)',
                }}
            >
                {/* ── LUXURY FINTECH HEADER ── */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 text-white px-5 sm:px-7 py-4.5 flex items-center justify-between relative overflow-hidden shrink-0 border-b border-slate-800">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 shadow-inner">
                            <LuShieldCheck className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                                    Waypt Secure Checkout
                                </h3>
                                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                                    256-Bit SSL
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                                <span>Bangko Sentral ng Pilipinas (BSP) Regulated Channels</span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer relative z-10"
                        aria-label="Close Checkout"
                    >
                        <LuX className="w-5 h-5" />
                    </button>
                </div>

                {receipt ? (
                    /* ── OFFICIAL E-RECEIPT SCREEN ── */
                    <div className="p-6 sm:p-8 space-y-6 text-center overflow-y-auto flex-1 bg-slate-50/50">
                        {/* Success Icon */}
                        <div className="relative inline-block">
                            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-spring-scale">
                                <LuCircleCheck className="w-10 h-10" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-1.5 rounded-full shadow-md">
                                <LuSparkles className="w-4 h-4" />
                            </div>
                        </div>

                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
                                Official Transaction Confirmed
                            </span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formattedAmount}</h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                                Reservation #{booking.id} • {receipt.vehicleName}
                            </p>
                        </div>

                        {/* Perforated Official Receipt Ledger */}
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm text-left relative overflow-hidden space-y-3.5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Waypt E-Receipt</span>
                                    <h4 className="text-xs font-bold text-slate-800">Verified Bohol Vehicle Rental</h4>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">STATUS: CONFIRMED</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-slate-400 block text-[11px]">Reference No.</span>
                                    <div className="flex items-center gap-1 font-mono font-bold text-slate-900 mt-0.5">
                                        <span className="truncate">{receipt.referenceNumber}</span>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(receipt.referenceNumber, 'Reference Number')}
                                            className="p-1 hover:bg-slate-100 rounded text-teal-600 cursor-pointer"
                                            title="Copy"
                                        >
                                            <LuCopy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <span className="text-slate-400 block text-[11px]">Payment Method</span>
                                    <span className="font-bold text-slate-900 block mt-0.5 uppercase">
                                        {receipt.paymentMethod} Express
                                    </span>
                                </div>

                                <div>
                                    <span className="text-slate-400 block text-[11px]">Date & Time</span>
                                    <span className="font-medium text-slate-800 block mt-0.5">{receipt.paidAt}</span>
                                </div>

                                <div>
                                    <span className="text-slate-400 block text-[11px]">Vehicle Guarantee</span>
                                    <span className="font-bold text-emerald-600 block mt-0.5">Host Guaranteed</span>
                                </div>
                            </div>

                            {/* Watermark security footer */}
                            <div className="pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                    <LuLock className="w-3 h-3 text-emerald-500" />
                                    <span>Waypt Escrow Protected</span>
                                </span>
                                <span>Tagbilaran • Panglao • Bohol</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={handlePrintReceipt}
                                className="min-h-[48px] px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs border border-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                            >
                                <LuPrinter className="w-4 h-4 text-slate-600" />
                                <span>Print / Save Receipt</span>
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="glass-btn flex-1 min-h-[48px] py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                <LuCheck className="w-4 h-4" />
                                <span>Done & View Confirmed Trip</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── PAYMENT SELECTION FORM ── */
                    <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1">

                        {/* Itemized Order Breakdown */}
                        <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-teal-50/60 border border-teal-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
                            <div className="flex items-center justify-between pb-3 border-b border-teal-200/60">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                                        Total Amount Due
                                    </span>
                                    <div className="text-2xl font-black text-slate-900 tracking-tight">
                                        {formattedAmount}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                                        <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>0% Renter Fee</span>
                                    </span>
                                </div>
                            </div>

                            <div className="pt-3 space-y-1.5 text-xs text-slate-600">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5">
                                        <LuCar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                        <span className="font-medium text-slate-800 truncate max-w-[240px]">
                                            {booking.vehicle_name || 'Vehicle Rental'}
                                        </span>
                                    </span>
                                    <span className="font-bold text-slate-900">{formattedAmount}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <LuCalendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                        <span>Rental Dates: {booking.start_date} to {booking.end_date}</span>
                                    </span>
                                    <span>{booking.days || 3} days</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-700 font-medium pt-1 border-t border-teal-200/40">
                                    <span>24/7 Island Emergency Road Assistance</span>
                                    <span className="font-bold uppercase text-[10px] bg-emerald-200/60 px-1.5 py-0.5 rounded">
                                        Free / Included
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selector Tabs */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                                Select Instant Philippine Payment Method
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {/* GCash Tab */}
                                <button
                                    type="button"
                                    onClick={() => setMethod('gcash')}
                                    className={`p-2.5 rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                                        method === 'gcash'
                                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                                        method === 'gcash' ? 'bg-[#007dfe] text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        G
                                    </div>
                                    <span className="text-xs font-extrabold">GCash</span>
                                </button>

                                {/* Maya Tab */}
                                <button
                                    type="button"
                                    onClick={() => setMethod('maya')}
                                    className={`p-2.5 rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                                        method === 'maya'
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                                        method === 'maya' ? 'bg-[#00D66F] text-slate-950' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        M
                                    </div>
                                    <span className="text-xs font-extrabold">Maya</span>
                                </button>

                                {/* Card Tab */}
                                <button
                                    type="button"
                                    onClick={() => setMethod('card')}
                                    className={`p-2.5 rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                                        method === 'card'
                                            ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-xs ring-2 ring-purple-500/20'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                        method === 'card' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <LuCreditCard className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-extrabold">Card</span>
                                </button>

                                {/* Bank / QR Ph Tab */}
                                <button
                                    type="button"
                                    onClick={() => setMethod('bank_transfer')}
                                    className={`p-2.5 rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                                        method === 'bank_transfer'
                                            ? 'bg-amber-50 border-amber-500 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                        method === 'bank_transfer' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <LuBuilding className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-extrabold">QR Ph</span>
                                </button>
                            </div>
                        </div>

                        {/* ── METHOD 1: GCASH ── */}
                        {method === 'gcash' && (
                            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-[#007dfe] text-white flex items-center justify-center text-xs font-black">
                                            G
                                        </span>
                                        <span className="font-extrabold text-sm text-slate-900">GCash Express Checkout</span>
                                    </div>
                                    <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-bold">
                                        <button
                                            type="button"
                                            onClick={() => setGcashPayMode('express')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${
                                                gcashPayMode === 'express' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                                            }`}
                                        >
                                            Mobile Number
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGcashPayMode('qr')}
                                            className={`px-2.5 py-1 rounded-md transition-all ${
                                                gcashPayMode === 'qr' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600'
                                            }`}
                                        >
                                            Scan QR Ph
                                        </button>
                                    </div>
                                </div>

                                {gcashPayMode === 'express' ? (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                                            Registered GCash Mobile Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                value={gcashPhone}
                                                onChange={e => setGcashPhone(e.target.value)}
                                                placeholder="0917 123 4567"
                                                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-base sm:text-sm font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none"
                                            />
                                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            🔒 You will receive a direct GCash MPIN authorization prompt to complete payment.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-2.5">
                                        <div className="w-36 h-36 mx-auto bg-slate-50 p-2.5 rounded-2xl border-2 border-dashed border-blue-400 flex flex-col items-center justify-center">
                                            {/* Stylized National QR Ph Graphic */}
                                            <div className="relative w-28 h-28 bg-slate-900 rounded-xl p-2 flex items-center justify-center">
                                                <LuQrCode className="w-full h-full text-white" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="w-6 h-6 rounded-full bg-[#007dfe] text-white flex items-center justify-center font-black text-[10px] border-2 border-white">
                                                        G
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-600">
                                            <span className="font-bold block text-slate-800">Scan via GCash App</span>
                                            <span>Open GCash → Tap <b>QR</b> → Scan to pay <b>{formattedAmount}</b></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── METHOD 2: MAYA ── */}
                        {method === 'maya' && (
                            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-lg bg-[#00D66F] text-slate-950 flex items-center justify-center text-xs font-black">
                                            M
                                        </span>
                                        <span className="font-extrabold text-sm text-slate-900">Maya / Maya Wallet</span>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                        Instant Pay
                                    </span>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-2.5">
                                    <div className="w-36 h-36 mx-auto bg-slate-50 p-2.5 rounded-2xl border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center">
                                        <div className="relative w-28 h-28 bg-slate-950 rounded-xl p-2 flex items-center justify-center">
                                            <LuQrCode className="w-full h-full text-[#00D66F]" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="w-6 h-6 rounded-full bg-slate-950 text-[#00D66F] flex items-center justify-center font-black text-[10px] border-2 border-[#00D66F]">
                                                    M
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-600">
                                        <span className="font-bold block text-slate-800">Scan via Maya App or Camera</span>
                                        <span>Merchant: <b>Waypt Bohol Mobility</b> • Amount: <b>{formattedAmount}</b></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── METHOD 3: CREDIT / DEBIT CARD WITH INTERACTIVE CARD ── */}
                        {method === 'card' && (
                            <div className="space-y-4 animate-fade-in">
                                {/* Interactive Card Preview */}
                                <div className="bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden border border-slate-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300 flex items-center justify-center shadow-inner">
                                            <div className="w-6 h-4 border border-amber-600 rounded-sm opacity-60" />
                                        </div>
                                        <span className="text-xs font-black tracking-widest text-slate-300">VISA / MASTERCARD</span>
                                    </div>

                                    <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100 mb-4 truncate">
                                        {cardNumber || '•••• •••• •••• ••••'}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <div>
                                            <span className="text-[9px] uppercase tracking-wider block">Cardholder</span>
                                            <span className="font-bold text-slate-200 tracking-wide uppercase">{cardHolder || 'JUAN DELA CRUZ'}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] uppercase tracking-wider block">Expires</span>
                                            <span className="font-mono font-bold text-slate-200">{cardExpiry || 'MM/YY'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Inputs */}
                                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                    <div>
                                        <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Cardholder Name</label>
                                        <input
                                            type="text"
                                            value={cardHolder}
                                            onChange={e => setCardHolder(e.target.value.toUpperCase())}
                                            placeholder="JUAN DELA CRUZ"
                                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={e => setCardNumber(e.target.value)}
                                            placeholder="4532 8901 2345 4242"
                                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">Expiry (MM/YY)</label>
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={e => setCardExpiry(e.target.value)}
                                                placeholder="08/28"
                                                maxLength={5}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold uppercase text-slate-600 block mb-1">CVV / CVC</label>
                                            <input
                                                type="password"
                                                value={cardCvv}
                                                onChange={e => setCardCvv(e.target.value)}
                                                placeholder="•••"
                                                maxLength={4}
                                                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-center font-bold text-slate-900 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── METHOD 4: BANK TRANSFER / QR PH ── */}
                        {method === 'bank_transfer' && (
                            <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-4 sm:p-5 space-y-4 animate-fade-in">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <LuBuilding className="w-5 h-5 text-amber-600" />
                                        <span className="font-extrabold text-sm text-slate-900">National QR Ph & Philippine Banks</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'bpi', name: 'BPI', acct: '0098-4521-88' },
                                        { id: 'bdo', name: 'BDO Unibank', acct: '1098-7654-3210' },
                                        { id: 'unionbank', name: 'UnionBank', acct: '1092-8765-4321' },
                                    ].map(b => (
                                        <button
                                            type="button"
                                            key={b.id}
                                            onClick={() => setSelectedBank(b.id as any)}
                                            className={`p-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                                                selectedBank === b.id
                                                    ? 'bg-amber-100/70 border-amber-500 text-amber-950 shadow-2xs'
                                                    : 'bg-white border-slate-200 text-slate-700'
                                            }`}
                                        >
                                            <span>{b.name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                        <span className="text-slate-500">Account Name:</span>
                                        <span className="font-bold text-slate-900">Waypt Bohol Mobility Inc.</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500">Account Number:</span>
                                        <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                                            <span>
                                                {selectedBank === 'bpi' ? '0098-4521-88' : selectedBank === 'bdo' ? '1098-7654-3210' : '1092-8765-4321'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard(
                                                    selectedBank === 'bpi' ? '0098-4521-88' : selectedBank === 'bdo' ? '1098-7654-3210' : '1092-8765-4321',
                                                    'Account Number'
                                                )}
                                                className="p-1 hover:bg-slate-100 rounded text-teal-600"
                                            >
                                                <LuCopy className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pay Submit Button */}
                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={handleConfirmPayment}
                                disabled={isProcessing}
                                className="glass-btn w-full min-h-[52px] py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg transition-all"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{processingStep || 'Processing Payment...'}</span>
                                    </div>
                                ) : (
                                    <>
                                        <LuLock className="w-4 h-4 text-teal-200" />
                                        <span>Pay {formattedAmount} via {method.toUpperCase()}</span>
                                        <LuArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[11px] text-slate-400 mt-2.5 flex items-center justify-center gap-1.5">
                                <LuShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                                <span>Immediate confirmation • Host is notified instantly • 100% Guaranteed</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
