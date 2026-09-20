import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, QrCode, DeviceMobile, ArrowRight, DownloadSimple, Copy, Buildings } from '@phosphor-icons/react';
import { triggerToast } from './DynamicToast';

interface PaymentModalProps {
    show: boolean;
    onClose: () => void;
    onPaymentSuccess: (receipt: PaymentReceipt) => void;
    booking: {
        id: number;
        vehicle_name?: string;
        total_price: number;
        security_deposit?: number;
        start_date: string;
        end_date: string;
        days?: number;
        host_name?: string;
    };
}

export interface PaymentReceipt {
    referenceNumber: string;
    paidAmount: number;
    paymentMethod: 'gcash' | 'maya' | 'card';
    paidAt: string;
    bookingId: number;
    vehicleName: string;
    status: 'paid';
}

export default function PaymentModal({ show, onClose, onPaymentSuccess, booking }: PaymentModalProps) {
    const [method, setMethod] = useState<'gcash' | 'maya' | 'card'>('gcash');
    const [gcashNumber, setGcashNumber] = useState('0917-888-2345');
    const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
    const [cardExpiry, setCardExpiry] = useState('08/28');
    const [cardCvc, setCardCvc] = useState('123');
    const [isProcessing, setIsProcessing] = useState(false);
    const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

    if (!show) return null;

    const amountToPay = booking.total_price;
    const formattedAmount = `₱${amountToPay.toLocaleString()}`;

    const handleConfirmPayment = () => {
        setIsProcessing(true);

        setTimeout(() => {
            const newReceipt: PaymentReceipt = {
                referenceNumber: `PAY-BOHOL-${Date.now().toString().slice(-8)}`,
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
            onPaymentSuccess(newReceipt);

            triggerToast({
                title: 'Payment Successful!',
                description: `Received ${formattedAmount} via ${method.toUpperCase()}. Reference: ${newReceipt.referenceNumber}`,
                type: 'payment',
                duration: 5000,
            });
        }, 1300);
    };

    const copyReference = () => {
        if (!receipt) return;
        navigator.clipboard.writeText(receipt.referenceNumber);
        triggerToast({
            title: 'Reference Copied',
            description: receipt.referenceNumber,
            type: 'success',
            duration: 3000,
        });
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md transition-all">
            <div
                className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-spring-scale max-h-[92dvh] sm:max-h-[85vh] flex flex-col pb-safe"
                style={{
                    boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
            >
                {/* Header */}
                <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between relative overflow-hidden shrink-0">
                    <div className="flex items-center gap-2.5 relative z-10">
                        <div className="w-8 h-8 rounded-xl bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-primary-300">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-tight">RentBohol Secure Checkout</h3>
                            <p className="text-xs text-slate-400">256-Bit Encrypted Island Payment Gateway</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="glass-btn-icon touch-target rounded-xl text-slate-400 hover:text-white transition-colors relative z-10"
                        aria-label="Close Checkout"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {receipt ? (
                    /* ── SUCCESS RECEIPT SCREEN ── */
                    <div className="p-6 sm:p-8 space-y-5 text-center overflow-y-auto flex-1">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 animate-spring-scale">
                            <CheckCircle className="w-8 h-8" />
                        </div>

                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                                Payment Confirmed
                            </span>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{formattedAmount}</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Reservation #{booking.id} — {receipt.vehicleName}
                            </p>
                        </div>

                        {/* Receipt Ledger Box */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 text-xs space-y-2.5 text-left">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                                <span className="text-slate-500">Reference Number</span>
                                <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                                    <span>{receipt.referenceNumber}</span>
                                    <button
                                        type="button"
                                        onClick={copyReference}
                                        className="touch-target p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                                        title="Copy reference"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Payment Channel</span>
                                <span className="font-bold text-slate-800 uppercase">{receipt.paymentMethod}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Transaction Time</span>
                                <span className="font-medium text-slate-700">{receipt.paidAt}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Booking Status</span>
                                <span className="font-bold text-emerald-600">Reserved & Guaranteed</span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="apple-press w-full min-h-[48px] py-3 bg-primary-700 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                            >
                                Done & View Reservation
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── PAYMENT SELECTION FORM ── */
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
                        {/* Booking Summary Pill */}
                        <div className="bg-primary-50/70 border border-primary-100 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-extrabold uppercase text-primary-700 tracking-wider">Amount Due</span>
                                <div className="text-xl font-extrabold text-slate-900 tracking-tight">{formattedAmount}</div>
                                <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px] sm:max-w-[240px]">
                                    {booking.vehicle_name || 'Island Rental Vehicle'}
                                </div>
                            </div>

                            <div className="text-right text-xs">
                                <span className="text-xs font-bold text-slate-400 block">Renter Service Fee</span>
                                <span className="font-bold text-emerald-600">FREE (₱0)</span>
                            </div>
                        </div>

                        {/* Payment Method Selector Tabs */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-2">Choose Instant Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMethod('gcash')}
                                    className={`p-2.5 sm:p-3 min-h-[56px] rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                        method === 'gcash'
                                            ? 'glass-pill-active'
                                            : 'glass-pill text-slate-700'
                                    }`}
                                >
                                    <DeviceMobile className="w-5 h-5" />
                                    <span className="text-xs font-bold">GCash</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMethod('maya')}
                                    className={`p-2.5 sm:p-3 min-h-[56px] rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                        method === 'maya'
                                            ? 'glass-pill-active'
                                            : 'glass-pill text-slate-700'
                                    }`}
                                >
                                    <QrCode className="w-5 h-5" />
                                    <span className="text-xs font-bold">Maya</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMethod('card')}
                                    className={`p-2.5 sm:p-3 min-h-[56px] rounded-2xl text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                        method === 'card'
                                            ? 'glass-pill-active'
                                            : 'glass-pill text-slate-700'
                                    }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    <span className="text-xs font-bold">Card</span>
                                </button>
                            </div>
                        </div>

                        {/* Method Specific Details */}
                        {method === 'gcash' && (
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 animate-fade-in">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-700">GCash Mobile Number</span>
                                    <span className="text-xs text-blue-600 font-bold">Instant Express Pay</span>
                                </div>
                                <input
                                    type="tel"
                                    inputMode="tel"
                                    value={gcashNumber}
                                    onChange={e => setGcashNumber(e.target.value)}
                                    placeholder="09XX-XXX-XXXX"
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-3 text-base sm:text-sm font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none min-h-[48px]"
                                />
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>You will receive an instant OTP authorization SMS.</span>
                                </div>
                            </div>
                        )}

                        {method === 'maya' && (
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-center space-y-2 animate-fade-in">
                                <div className="w-28 h-28 bg-white rounded-xl border border-slate-200 mx-auto flex items-center justify-center p-2 shadow-inner">
                                    {/* Mock Maya Dynamic QR Box */}
                                    <div className="w-full h-full border-2 border-dashed border-emerald-400 rounded-lg flex flex-col items-center justify-center text-emerald-600">
                                        <QrCode className="w-10 h-10" />
                                        <span className="text-xs font-bold mt-1">SCAN VIA MAYA</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">Scan QR Code using your Maya app or click pay below.</p>
                            </div>
                        )}

                        {method === 'card' && (
                            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 animate-fade-in">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1">Card Number</label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="cc-number"
                                        value={cardNumber}
                                        onChange={e => setCardNumber(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm font-mono text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">Expiry</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="MM/YY"
                                            value={cardExpiry}
                                            onChange={e => setCardExpiry(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 text-center min-h-[48px]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 block mb-1">CVC</label>
                                        <input
                                            type="password"
                                            inputMode="numeric"
                                            maxLength={4}
                                            value={cardCvc}
                                            onChange={e => setCardCvc(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-slate-900 outline-none focus:ring-2 focus:ring-primary-500 text-center min-h-[48px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pay Button */}
                        <button
                            type="button"
                            onClick={handleConfirmPayment}
                            disabled={isProcessing}
                            className="glass-btn w-full min-h-[48px] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Authorizing with Bank...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Pay {formattedAmount} Now</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
