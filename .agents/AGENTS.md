# Project Guidelines

## Icon Library Standards
- **Mandatory Icon Library**: All icons used across the frontend MUST strictly be sourced from [Phosphor Icons](https://phosphoricons.com/) via the `@phosphor-icons/react` package.
- Do NOT use inline raw SVGs, FontAwesome, or other third-party icon packages.
- Always import icons directly from `@phosphor-icons/react` (e.g. `import { Car, MapPin, Calendar, Star, ShieldCheck } from '@phosphor-icons/react';`).

## Animation & Asset Resources
- **Car Animations (LottieFiles)**: [LottieFiles Free Car Animations](https://lottiefiles.com/free-animations/car?asset=all)
  - Use for interactive micro-animations, loading states, empty states, and vehicle status transitions.

## Project History & Complete AI Reference
- **Comprehensive Guide**: See [PROJECT_HISTORY.md](file:///c:/laragon/www/CarRental/PROJECT_HISTORY.md) for the complete chronological development history, database schema, real-time live sync architecture, GPS tracking guidelines, and full directory sitemap.
- **Real-Time Zero-Refresh Sync**: When adding or updating owner vehicle actions, always broadcast using `broadcastVehicleUpdate` from `resources/js/lib/vehicleSync.ts` so renter views update in real time without manual page refreshes.
- **Smooth Animations**: Maintain global `450ms` - `650ms` buttery-smooth transition deceleration curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

