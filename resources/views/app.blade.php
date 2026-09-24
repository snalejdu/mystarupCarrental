<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- Favicons & Browser Tab Icons (RentalHub Brand Logo) -->
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=4">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=4">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=4">
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=4">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="antialiased">
    <!-- Initial Page Preloader (High-Performance 60fps GPU Accelerated) -->
    <div id="app-preloader" style="position: fixed; inset: 0; z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ffffff; transform: translateZ(0); will-change: opacity, transform; transition: opacity 0.25s ease-out, visibility 0.25s ease-out;">
        <style>
            @keyframes rbSuspension {
                0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
                25% { transform: translate3d(0, -2.5px, 0) rotate(-0.5deg); }
                50% { transform: translate3d(0, 1px, 0) rotate(0.3deg); }
                75% { transform: translate3d(0, -1.5px, 0) rotate(-0.2deg); }
            }
            @keyframes rbWheelSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes rbRoadMove {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-80px, 0, 0); }
            }
            @keyframes rbWindFlow {
                0% { opacity: 0; transform: translate3d(40px, 0, 0); }
                50% { opacity: 0.8; }
                100% { opacity: 0; transform: translate3d(-80px, 0, 0); }
            }
            @keyframes rbExhaustPuff {
                0% { opacity: 0; transform: translate3d(88px, 133px, 0) scale(0.2); }
                40% { opacity: 0.7; transform: translate3d(65px, 126px, 0) scale(0.7); }
                100% { opacity: 0; transform: translate3d(35px, 120px, 0) scale(1.4); }
            }
            @keyframes rbPreloaderProgress {
                0% { transform: translate3d(-100%, 0, 0); }
                50% { transform: translate3d(100%, 0, 0); }
                100% { transform: translate3d(300%, 0, 0); }
            }

            .rb-car { animation: rbSuspension 0.65s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; transform-origin: 190px 130px; will-change: transform; }
            .rb-wheel { animation: rbWheelSpin 0.35s linear infinite; transform-box: fill-box; transform-origin: center; will-change: transform; }
            .rb-road { animation: rbRoadMove 0.32s linear infinite; will-change: transform; }
            .rb-wind-1 { animation: rbWindFlow 0.5s ease-out infinite; will-change: transform, opacity; }
            .rb-wind-2 { animation: rbWindFlow 0.65s ease-out 0.15s infinite; will-change: transform, opacity; }
            .rb-wind-3 { animation: rbWindFlow 0.45s ease-out 0.3s infinite; will-change: transform, opacity; }
            .rb-ex-1 { animation: rbExhaustPuff 0.55s ease-out infinite; will-change: transform, opacity; }
            .rb-ex-2 { animation: rbExhaustPuff 0.55s ease-out 0.18s infinite; will-change: transform, opacity; }
            .rb-ex-3 { animation: rbExhaustPuff 0.55s ease-out 0.36s infinite; will-change: transform, opacity; }
        </style>

        <div style="background: #ffffff; border: 1px solid #f1f5f9; box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.08); border-radius: 28px; padding: 32px 36px; max-width: 350px; width: 90%; text-align: center; contain: content;">
            <div style="position: relative; display: inline-block; width: 230px; height: 115px; margin: 0 auto;">
                <!-- High-Performance GPU Radial Aura (No CSS Filter Blur) -->
                <div style="position: absolute; inset: -10px; background: radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, rgba(13, 148, 136, 0) 70%); border-radius: 9999px; pointer-events: none;"></div>
                
                <svg viewBox="0 0 400 200" width="100%" height="100%" style="position: relative; display: block; overflow: visible; contain: layout paint;">
                    <defs>
                        <linearGradient id="pCarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#2dd4bf"/>
                            <stop offset="50%" stop-color="#0d9488"/>
                            <stop offset="100%" stop-color="#115e59"/>
                        </linearGradient>
                        <linearGradient id="pGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.95"/>
                            <stop offset="100%" stop-color="#0284c7" stop-opacity="0.7"/>
                        </linearGradient>
                        <linearGradient id="pHeadlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
                            <stop offset="0%" stop-color="#fef08a" stop-opacity="0.9"/>
                            <stop offset="40%" stop-color="#fef08a" stop-opacity="0.35"/>
                            <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
                        </linearGradient>
                        <linearGradient id="pRoadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#0d9488" stop-opacity="0"/>
                            <stop offset="50%" stop-color="#0d9488" stop-opacity="0.35"/>
                            <stop offset="100%" stop-color="#0d9488" stop-opacity="0"/>
                        </linearGradient>
                    </defs>

                    <!-- Speed Wind Lines -->
                    <g stroke="#5eead4" stroke-width="2" stroke-linecap="round" opacity="0.8">
                        <line class="rb-wind-1" x1="160" y1="55" x2="220" y2="55" />
                        <line class="rb-wind-2" x1="120" y1="75" x2="190" y2="75" />
                        <line class="rb-wind-3" x1="90" y1="95" x2="150" y2="95" />
                    </g>

                    <!-- Exhaust Smoke Puffs -->
                    <g fill="#cbd5e1">
                        <circle class="rb-ex-1" cx="0" cy="0" r="5" />
                        <circle class="rb-ex-2" cx="0" cy="0" r="6" />
                        <circle class="rb-ex-3" cx="0" cy="0" r="4" />
                    </g>

                    <!-- Headlight Light Beam Cone -->
                    <polygon points="292,125 395,95 400,158 292,131" fill="url(#pHeadlightBeam)" opacity="0.85" />

                    <!-- Road Base -->
                    <rect x="0" y="148" width="400" height="8" rx="4" fill="#e2e8f0" />
                    <rect x="50" y="148" width="300" height="3" fill="url(#pRoadGlow)" />

                    <!-- Animated Dashed Lane Road Markings -->
                    <g class="rb-road" stroke="#0d9488" stroke-width="3.5" stroke-linecap="round">
                        <line x1="0" y1="152" x2="40" y2="152" />
                        <line x1="80" y1="152" x2="120" y2="152" />
                        <line x1="160" y1="152" x2="200" y2="152" />
                        <line x1="240" y1="152" x2="280" y2="152" />
                        <line x1="320" y1="152" x2="360" y2="152" />
                        <line x1="400" y1="152" x2="440" y2="152" />
                        <line x1="480" y1="152" x2="520" y2="152" />
                    </g>

                    <!-- CAR ASSEMBLY -->
                    <g class="rb-car">
                        <!-- Shadow Under Car -->
                        <ellipse cx="195" cy="148" rx="105" ry="7" fill="#0f172a" opacity="0.15" />

                        <!-- Body Silhouette -->
                        <path d="M 95 130 L 100 115 Q 105 105 120 102 L 155 100 L 185 70 Q 195 65 210 65 L 255 65 Q 275 65 285 85 L 300 105 Q 312 110 315 122 L 315 133 Q 315 138 310 138 L 278 138 A 20 20 0 0 0 238 138 L 158 138 A 20 20 0 0 0 118 138 L 98 138 Q 95 138 95 130 Z" fill="url(#pCarGrad)" stroke="#0f766e" stroke-width="1.5" />

                        <!-- Windows -->
                        <path d="M 188 73 L 162 99 L 218 99 L 218 73 Q 205 72 188 73 Z" fill="url(#pGlassGrad)" />
                        <path d="M 224 73 L 224 99 L 290 99 L 277 82 Q 268 73 252 73 Z" fill="url(#pGlassGrad)" />
                        <line x1="221" y1="72" x2="221" y2="100" stroke="#042f2e" stroke-width="3" />
                        <path d="M 158 100 L 293 100" stroke="#134e4a" stroke-width="1.5" />

                        <!-- Door Cutlines -->
                        <path d="M 221 100 L 221 136" stroke="#042f2e" stroke-width="1" opacity="0.7"/>
                        <path d="M 160 100 L 155 136" stroke="#042f2e" stroke-width="1" opacity="0.7"/>
                        <rect x="226" y="104" width="10" height="2.5" rx="1.2" fill="#042f2e" />

                        <!-- Lights -->
                        <path d="M 305 116 Q 314 118 314 125 L 302 125 Z" fill="#fef08a" />
                        <path d="M 96 112 Q 95 120 98 123 L 104 123 L 102 112 Z" fill="#f43f5e" />

                        <!-- Wheel Arches -->
                        <circle cx="138" cy="138" r="18" fill="#1e293b" />
                        <circle cx="258" cy="138" r="18" fill="#1e293b" />

                        <!-- Front Wheel -->
                        <g transform="translate(258, 138)">
                            <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
                            <circle cx="0" cy="0" r="11" fill="#475569" />
                            <g class="rb-wheel">
                                <circle cx="0" cy="0" r="8.5" fill="#334155" stroke="#94a3b8" stroke-width="1" />
                                <line x1="-7" y1="0" x2="7" y2="0" stroke="#f1f5f9" stroke-width="2" />
                                <line x1="0" y1="-7" x2="0" y2="7" stroke="#f1f5f9" stroke-width="2" />
                                <line x1="-5" y1="-5" x2="5" y2="5" stroke="#f1f5f9" stroke-width="1.5" />
                                <line x1="-5" y1="5" x2="5" y2="-5" stroke="#f1f5f9" stroke-width="1.5" />
                                <circle cx="0" cy="0" r="3" fill="#2dd4bf" />
                            </g>
                        </g>

                        <!-- Rear Wheel -->
                        <g transform="translate(138, 138)">
                            <circle cx="0" cy="0" r="16" fill="#1e293b" stroke="#0f172a" stroke-width="1.5" />
                            <circle cx="0" cy="0" r="11" fill="#475569" />
                            <g class="rb-wheel">
                                <circle cx="0" cy="0" r="8.5" fill="#334155" stroke="#94a3b8" stroke-width="1" />
                                <line x1="-7" y1="0" x2="7" y2="0" stroke="#f1f5f9" stroke-width="2" />
                                <line x1="0" y1="-7" x2="0" y2="7" stroke="#f1f5f9" stroke-width="2" />
                                <line x1="-5" y1="-5" x2="5" y2="5" stroke="#f1f5f9" stroke-width="1.5" />
                                <line x1="-5" y1="5" x2="5" y2="-5" stroke="#f1f5f9" stroke-width="1.5" />
                                <circle cx="0" cy="0" r="3" fill="#2dd4bf" />
                            </g>
                        </g>
                    </g>
                </svg>
            </div>

            <div style="margin-top: 14px;">
                <div style="color: #0f172a; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 800; font-size: 19px; letter-spacing: -0.02em;">Rental<span style="color: #0d9488;">Hub</span></div>
                <div style="color: #64748b; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12.5px; margin-top: 4px; font-weight: 500;">Loading vehicles & availability...</div>
            </div>

            <div style="margin-top: 16px; width: 130px; height: 3.5px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 999px; margin-left: auto; margin-right: auto; overflow: hidden; position: relative;">
                <div style="height: 100%; width: 50%; background: linear-gradient(90deg, #2dd4bf, #0d9488, #2dd4bf); border-radius: 999px; animation: rbPreloaderProgress 1.2s infinite ease-in-out; will-change: transform;"></div>
            </div>
        </div>
    </div>

    <script>
        (function() {
            var dismissed = false;
            function hidePreloader() {
                if (dismissed) return;
                dismissed = true;
                var p = document.getElementById('app-preloader');
                if (!p) return;

                p.style.opacity = '0';
                p.style.pointerEvents = 'none';
                setTimeout(function() {
                    if (p && p.parentNode) p.parentNode.removeChild(p);
                }, 280);
            }

            if (document.readyState === 'complete') {
                hidePreloader();
            } else {
                window.addEventListener('load', hidePreloader);
                document.addEventListener('DOMContentLoaded', function() {
                    // Start soft dismiss as soon as DOM is interactive
                    setTimeout(hidePreloader, 200);
                });
            }

            // Fallback safety timeout
            setTimeout(hidePreloader, 2500);
        })();
    </script>

    @inertia
</body>
</html>
