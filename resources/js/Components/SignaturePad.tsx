import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LuCheck, LuPenTool, LuRotateCcw, LuShieldCheck } from 'react-icons/lu';

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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(Boolean(initialData));
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    const currentSignatureRef = useRef<string>(initialData);

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        if (rect.width === 0) return;

        const ratio = Math.max(window.devicePixelRatio || 1, 2);
        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;
        ctx.scale(ratio, ratio);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#0f172a'; // Deep slate ink
        ctx.lineWidth = 2.5;

        // Restore existing signature if any
        if (currentSignatureRef.current) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, rect.width, rect.height);
            };
            img.src = currentSignatureRef.current;
        }
    }, []);

    // Set up canvas and handle resize / orientation changes
    useEffect(() => {
        setupCanvas();

        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            setupCanvas();
        });
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, [setupCanvas]);

    const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            canvas.setPointerCapture(e.pointerId);
        } catch {
            // Ignore if pointer capture fails
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const coords = getCanvasCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(coords.x, coords.y);
        lastPoint.current = coords;
        setIsDrawing(true);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const coords = getCanvasCoordinates(e);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        lastPoint.current = coords;
        setHasSignature(true);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        e.preventDefault();
        setIsDrawing(false);
        lastPoint.current = null;

        const canvas = canvasRef.current;
        if (canvas) {
            try {
                canvas.releasePointerCapture(e.pointerId);
            } catch {
                // Ignore if already released
            }

            const dataUrl = canvas.toDataURL('image/png');
            currentSignatureRef.current = dataUrl;
            onSave(dataUrl);
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentSignatureRef.current = '';
        setHasSignature(false);
        if (onClear) onClear();
        onSave('');
    };

    return (
        <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-3.5 sm:p-5 space-y-3">
            {/* Header with Title and Signer Identity */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <LuPenTool className="w-3.5 h-3.5 text-primary-700" />
                        <span>{title}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Signing as <span className="font-semibold text-slate-700">{signerName}</span> ({roleLabel})
                    </p>
                </div>

                {hasSignature && (
                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Signed</span>
                    </div>
                )}
            </div>

            {/* Interactive Signature Canvas Box (touch-action: none prevents scrolling) */}
            <div
                ref={containerRef}
                className="relative bg-white rounded-xl border-2 border-dashed border-slate-300 overflow-hidden shadow-inner h-36 sm:h-40"
                style={{ touchAction: 'none' }}
            >
                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="w-full h-full cursor-crosshair block select-none"
                    style={{ touchAction: 'none' }}
                />

                {/* Subtle baseline indicator */}
                <div className="absolute bottom-5 left-4 right-4 border-b border-slate-200 pointer-events-none flex justify-between text-xs text-slate-400 select-none">
                    <span>X</span>
                    <span>Sign above this line</span>
                </div>
            </div>

            {/* Footer with Legal Tag & Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                    <LuShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                    <span>Cryptographically timestamped handover signature</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={clearCanvas}
                        disabled={!hasSignature}
                        className="apple-press touch-target px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-2xs"
                    >
                        <LuRotateCcw className="w-3.5 h-3.5" />
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
