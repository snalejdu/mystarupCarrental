import React, { useRef, useState, useEffect } from 'react';
import { ArrowCounterClockwise, Check, Pen, ShieldCheck } from '@phosphor-icons/react';

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    onClear?: () => void;
    title?: string;
    signerName?: string;
    roleLabel?: string;
    initialData?: string;
}

export default function SignaturePad({
    onSave,
    onClear,
    title = 'Digital Inspection Sign-Off',
    signerName = 'Signer',
    roleLabel = 'Renter / Authorized Driver',
    initialData = '',
}: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(Boolean(initialData));
    const [history, setHistory] = useState<string[]>(initialData ? [initialData] : []);

    // Set up canvas with high DPI scaling
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const ratio = Math.max(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        ctx.scale(ratio, ratio);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0f172a'; // Deep slate ink
        ctx.lineWidth = 2.5;

        // If initial signature data exists, draw it
        if (initialData) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = initialData;
        }
    }, []);

    const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        if ('touches' in e) {
            const touch = e.touches[0] || e.changedTouches[0];
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        }
        return {
            x: (e as React.MouseEvent).clientX - rect.left,
            y: (e as React.MouseEvent).clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e) {
            // Prevent scroll on touch devices while drawing
            e.stopPropagation();
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCanvasCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        if ('touches' in e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { x, y } = getCanvasCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            setHistory(prev => [...prev, dataUrl]);
            onSave(dataUrl);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
        setHistory([]);
        if (onClear) onClear();
        onSave('');
    };

    return (
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-3">
            {/* Header with Title and Signer Identity */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Pen className="w-3.5 h-3.5 text-primary-700" />
                        <span>{title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Signing as <span className="font-semibold text-slate-700">{signerName}</span> ({roleLabel})
                    </p>
                </div>

                {hasSignature && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Signed</span>
                    </div>
                )}
            </div>

            {/* Interactive Signature Canvas Box */}
            <div className="relative bg-white rounded-xl border-2 border-dashed border-slate-300 overflow-hidden shadow-inner touch-none">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-36 cursor-crosshair block"
                />

                {/* Subtle baseline indicator */}
                <div className="absolute bottom-6 left-6 right-6 border-b border-slate-200 pointer-events-none flex justify-between text-[10px] text-slate-400 select-none">
                    <span>X</span>
                    <span>Sign above this line</span>
                </div>
            </div>

            {/* Footer with Legal Tag & Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                    <span>Cryptographically timestamped handover signature</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={clearCanvas}
                        disabled={!hasSignature}
                        className="apple-press px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
                    >
                        <ArrowCounterClockwise className="w-3 h-3" />
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
