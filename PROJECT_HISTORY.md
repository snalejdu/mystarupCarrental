# RentBohol Platform — Project Context, Architecture & AI Reference Guide

> **Purpose**: This document serves as the complete technical, architectural, and operational reference for the RentBohol platform. Any developer or AI coding assistant should read this document first to understand the codebase structure, completed features, design standards, database schema, and upcoming roadmap.

---

## 1. Project Overview & Business Domain

* **Platform Name**: RentBohol (`rentbohol.ph`)
* **Business Model**: Peer-to-peer and host-managed car and motorbike rental marketplace in Bohol, Philippines.
* **Target Geographic Area**: Tagbilaran City, Panglao Island, Dauis, Tubigon, Carmen, Anda, Loboc, and surrounding municipalities.
* **User Roles**:
  * `renter`: Tourists and locals browsing listings, booking vehicles, and tracking trip status.
  * `owner` (Host): Boholano vehicle owners managing listings, specs, calendar availability, pricing, and booking requests.
  * `admin`: Platform administrators overseeing users, listings, commissions, and fleet operations.

---

## 2. Technical Stack

* **Backend**: Laravel 13 (PHP 8.2+), MySQL 8+.
* **Frontend**: React 19 (TypeScript), Inertia.js React adapter (`@inertiajs/react`).
* **Styling**: Tailwind CSS v4, custom vanilla CSS design tokens (`app.css`, `GlassIcons.css`, `AccordionGallery.css`).
* **Animations**: GSAP, SVG stroke animations, custom CSS cubic-bezier transitions (`450ms` - `650ms` buttery-smooth curves).
* **Build Tooling**: Vite v8, npm scripts (`npm run dev`, `npm run build`), TypeScript (`npx tsc --noEmit`).
* **Local Development Environment**: Laragon (`c:\laragon\www\CarRental`), PHP built-in server (`php artisan serve`), MySQL on port 3306.

---

## 3. Strict Rules & Architectural Guidelines (Always Enforce)

1. **Mandatory Icon Library**:
   * All frontend icons **MUST strictly be sourced from Lucide Icons** via the `lucide-react` package.
   * **Do NOT use raw inline SVGs, FontAwesome, or other icon packs.**
   * Always import icons directly: `import { Car, MapPin, Calendar, Star, ShieldCheck, Gauge, Fuel } from 'lucide-react';`
2. **Animation Standards**:
   * Interactive micro-animations and loading states should leverage LottieFiles ([LottieFiles Free Car Animations](https://lottiefiles.com/free-animations/car?asset=all)) and GSAP.
   * All UI hover interactions must use smooth deceleration curves (`cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0.2, 0.8, 0.2, 1)`) with durations between `400ms` and `650ms` ("smooth like butter").
3. **No Unnecessary Manual Refreshes**:
   * The platform relies on real-time cross-tab synchronization (`resources/js/lib/vehicleSync.ts`) so updates reflect live on renter screens without pressing F5.

---

## 4. Chronological Development History & Completed Milestones

### Milestone 1: Dynamic Vehicle Specifications & Fuel Types
* **Database Migration**: `2026_09_04_223000_add_fuel_type_and_features_to_vehicles.php` added:
  * `fuel_type` (`string`, default `'Unleaded Gas'`)
  * `features` (`json`, array of strings)
* **Model** (`app/Models/Vehicle.php`): Added `fuel_type` and `features` to `$fillable`, with `'features' => 'array'` in `$casts`.
* **Owner Forms** (`Create.tsx` & `Edit.tsx`):
  * Selectable Fuel Types: `Unleaded Gas`, `Diesel`, `Hybrid`, `Electric`.
  * Dynamic Equipment Checkboxes tailored by vehicle type:
    * **Cars / Vans / SUVs**: ABS Brakes, Dual Air Bags, Cruise Control, Cold Air Conditioner, Bluetooth Audio, Backup Camera, Front Dashcam, USB Charging Ports, GPS Navigation, Leather Seats.
    * **Motorbikes**: 2 Clean Helmets Included, Cell Phone Holder / Mount, Rear Top Box / Storage, Front Disc Brakes, Raincoat / Rain Poncho, USB Phone Charger Port, Anti-Theft Disc Lock.
* **Public View** (`Vehicles/Show.tsx`): Dynamic checklist rendering with vehicle type fallbacks.

### Milestone 2: Status Dropdown Overflow Fix
* **Location**: `resources/js/Pages/Owner/Vehicles/Index.tsx`
* **Issue**: The "Change Vehicle Status" popover was clipped at the bottom of the photo container due to `overflow-hidden` on `aspect-[16/10]`.
* **Resolution**: Moved image clipping to an inner `rounded-t-[23px] overflow-hidden` wrapper, allowed outer card overflow to stay visible, added dynamic z-indexing (`z-30`), and attached a full-screen dismiss backdrop.

### Milestone 3: "View Details" Accent Button Fix
* **Location**: `resources/js/Pages/Vehicles/Show.tsx`
* **Issue**: The "View Details" button was styled in plain dark `bg-slate-900`.
* **Resolution**: Upgraded to the vibrant emerald-teal `glass-btn` aesthetic with subtle hover scaling.

### Milestone 4: Unified Save Action Button
* **Location**: `resources/js/Pages/Owner/Vehicles/Edit.tsx`
* **Issue**: Redundant duplicate save buttons (one in the middle of the form and a separate one for the calendar).
* **Resolution**: Replaced both with a single sticky bottom action bar containing a single **"Save Changes"** button (`glass-btn`). Submits vehicle specs and staged availability dates in one clean, unified flow.

### Milestone 5: Luxury Save Confirmation Modal
* **Location**: `resources/js/Pages/Owner/Vehicles/Edit.tsx` & `resources/css/app.css`
* **Features**:
  * Pure-white glassmorphism card (removed top accent line and green dot).
  * Smooth SVG checkmark with `stroke-dashoffset` drawing animation.
  * Delayed pill reveal: `Successfully Saved` emerges beside the checkmark.
  * Vehicle snapshot card (photo thumbnail, title, price/day, status).
  * Two primary actions: **"Go Back to My Vehicles"** (`/owner/vehicles`) and **"Want to Edit"** (dismisses modal to continue editing).

### Milestone 6: Buttery Smooth Global Animations
* **Locations**: `app.css`, `GlassIcons.css`, `SpotlightCard.tsx`
* **Specification**: Global `@theme` transition duration set to `450ms` with luxury curve `cubic-bezier(0.16, 1, 0.3, 1)`. Photo hover zooms slowed to `650ms` for a cinematic glide.

### Milestone 7: Real-Time Zero-Refresh Live Synchronization
* **Utility**: `resources/js/lib/vehicleSync.ts`
* **Architecture**: 4-layer real-time sync system:
  1. `BroadcastChannel('rentbohol-vehicle-sync')`: Millisecond cross-tab message delivery.
  2. `localStorage` `'storage'` event: Fallback across different browser windows.
  3. `visibilitychange` & `window.onfocus`: Automatically reloads fresh props when a user switches tabs from the Owner dashboard back to the Renter view.
  4. Active Page Background Poll: Runs an 8s check on vehicle show pages for cross-device updates.
* **Layout Mount**: `resources/js/Layouts/PublicLayout.tsx` automatically listens for updates and triggers `router.reload({ preserveScroll: true, preserveState: true })` with an Apple Dynamic Island toast HUD (`⚡ Listing Updated Live`).
* **Owner Emitters**: Broadcasts events upon specs save, availability update, photo uploads, reordering, focal cropping, and quick status toggles.

### Milestone 8: Distance / Mileage Limit Specification
* **Database Migration**: `2026_09_04_155657_add_distance_limit_to_vehicles_table.php` added:
  * `distance_limit` (`string`, default `'Unlimited'`)
* **Model** (`Vehicle.php`): Added `distance_limit` to `$fillable`.
* **Owner Forms** (`Edit.tsx` & `Create.tsx`):
  * Added 5th column under **Key Specifications** alongside Transmission, Fuel Type, Seats, and AC Unit.
  * Presets: `Unlimited Mileage`, `Bohol Island Only`, `100 km / day`, `150 km / day`, `200 km / day`, `250 km / day`, `300 km / day`, and `Custom Limit...` (with custom text field).
* **Public View** (`Vehicles/Show.tsx`): Displays dynamic `{vehicle.distance_limit || 'Unlimited'}` in the Technical Specification grid and Renter POV preview.

### Milestone 9: Database Security Hardening & 3NF Normalization
* **Database Normalization (3NF)**:
  * **Features (1NF -> 3NF)**: Migrated multivalued JSON features array into dedicated relational tables:
    * `features` table: `id`, `name`, `slug`, `category`, `vehicle_type`, `icon`.
    * `vehicle_feature` pivot table: `vehicle_id`, `feature_id`, timestamps, unique constraint.
    * `Vehicle::featuresRel()`: `belongsToMany(Feature::class)` relation with automated two-way synchronization on save.
  * **Handover Inspections (2NF/3NF)**: Extracted 6 check-in/check-out inspection columns into a separate entity:
    * `booking_handovers` table: `id`, `booking_id` (unique FK), `checkin_odometer`, `checkin_fuel`, `checkin_notes`, `checkin_verified_at`, `checkout_odometer`, `checkout_fuel`, `checkout_notes`, `checkout_deposit_refunded`, `checkout_verified_at`.
    * `Booking::handover()`: `hasOne(BookingHandover::class)` relation with delegated property accessors.
  * **Ratings Referential Integrity**: Added `rater_id` foreign key referencing `users(id)` with `nullOnDelete()`, replacing freeform text identifiers.
* **Database Connection Security (`config/database.php`)**:
  * Real binary server-side prepared statements: `PDO::ATTR_EMULATE_PREPARES => false` (mathematical SQL injection immunity across all charsets).
  * Arbitrary local file exfiltration disabled: `PDO::MYSQL_ATTR_LOCAL_INFILE => false`.
  * Exception mode enforced: `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`.
* **Model Mass-Assignment Lockdown**:
  * `User`: Removed `driver_license_status` from `#[Fillable]`.
  * `Vehicle`: Removed `owner_id`, `avg_rating`, and `total_reviews` from `$fillable`.
  * `Booking`: Removed `token`, `commission_rate`, `commission_amount`, `contact_unlocked_at`, `accepted_at`, `completed_at` from `$fillable`.
* **SQL Injection & DoS Defense**:
  * Escaped `%` and `_` SQL `LIKE` wildcard characters in public search queries (`PublicVehicleController.php`).
  * Enforced strict numeric casting on price range filters (`min_price`, `max_price`).
  * Whitelisted `location` and `type` inputs against application configurations.
  * Constrained route token parameters to UUIDv4 format (`->whereUuid('token')`).
  * Guarded mock Google authentication from production execution (`app()->isProduction()`).
  * Intercepted database query exceptions in `bootstrap/app.php` to log to `security.log` without exposing database internals to visitors.

### Milestone 10: Official Terms & Conditions Page Implementation
* **Location**: `resources/js/Pages/Terms.tsx`, `routes/web.php`, `resources/js/Layouts/PublicLayout.tsx`
* **Features**:
  * Comprehensive legal and operational rental terms specifically tailored to Bohol island driving.
  * **Driver Eligibility**: Covers LTO 90-day tourist driving permit regulations and Philippine resident license restrictions (Codes 1/2).
  * **Geographic Boundary & Ferry Prohibition**: Explicit ban on loading vehicles onto RoRo ferries, barges, or cargo ships to travel outside Bohol (e.g. to Cebu or Leyte) without written host authorization; GPS tracking disclosure compliant with RA 10173.
  * **Same-to-Same Fuel & Mutual Handover Inspection**: Integrated with normalized `booking_handovers` odometer and fuel verification protocol.
  * **Weather & Typhoon Cancellation Guarantee**: 100% free date rescheduling or cancellation when Philippine Coast Guard (PCG) suspends sea trips or flights due to gale warnings.
  * **Road Safety & Helmet Compliance**: Enforces RA 10054 helmet compliance with 2 included helmets per motorbike.
  * **Navigation Mounting**: Linked in the footer under Quick Links and the legal links bar alongside the Privacy Policy.

### Milestone 11: Fake Metrics Cleanup & Global Navigation Integration for Rental Terms
* **Location**: `resources/js/Pages/Welcome.tsx`, `resources/js/Layouts/PublicLayout.tsx`, `resources/js/Pages/Vehicles/Show.tsx`, `app/Http/Controllers/PublicVehicleController.php`
* **Features**:
  * **Removed Fake Metrics**: Eliminated the artificial animated counter strip (`4.9 ★ HOST RATING`, `6+ VEHICLES LISTED`, `2+ VERIFIED HOSTS`, `20 BOHOL TOWNS`) and hardcoded `$stats['avg_rating'] = 4.9`.
  * **Authentic Value Guarantee Strip**: Added clean Boholano host guarantees (`Verified Boholano Hosts`, `Panglao & Tagbilaran Delivery`, `Zero Platform Booking Fees`) using standard `lucide-react` icons.
  * **Global Navigation**: Integrated **Rental Terms** directly into the desktop header navigation bar (between About Us and Contact Us with active state highlight) and the mobile drawer.
  * **Booking Form Disclosure**: Linked Rental Terms into the public vehicle checkout form under the submit request action.

### Milestone 12: Luxury Host Hub Sidebar Enhancement
* **Location**: `resources/js/Layouts/OwnerLayout.tsx`
* **Features**:
  * **Brand & Node Status**: Added live pulsing host status badge (`Verified Host Portal • Bohol Node`).
  * **Quick Action CTA**: Prominent `+ List New Vehicle` shortcut button at top of sidebar for fast fleet expansion.
  * **Semantic Navigation Groups**: Organized navigation into `Fleet & Bookings` (`My Vehicles`, `Bookings`, `Earnings & Payouts`) and `Marketplace & Rules` (`View Marketplace`, `Bohol Rental Rules`).
  * **Island Shield Host Protection Card**: Added a tactile card summarizing the Bohol geographic boundary guarantee (strict RoRo ferry prohibition) with direct policy link.
  * **Host Profile & Role Switcher**: Upgraded avatar with active status ring, host badge pill, and replaced raw emoji role switch with standard `ArrowLeftRight` Lucide icon.

### Milestone 13: Full Platform Icon Migration to Phosphor Icons
* **Location**: `package.json`, `.agents/AGENTS.md`, and all 27 frontend components in `resources/js/`
* **Features**:
  * **Installed `@phosphor-icons/react`**: Switched from `lucide-react` to official Phosphor Icons package (`https://phosphoricons.com/`).
  * **104 Unique Icons Migrated**: Completely mapped and replaced all icon imports across Public, Owner, Renter, Admin, and Component directories.
  * **Rule Update**: Updated `.agents/AGENTS.md` to establish `@phosphor-icons/react` as the mandatory icon standard.
  * **Motorcycle & Van Category Refinements**: Replaced pedal bicycle (`Bicycle`) with dedicated Phosphor `Motorcycle`, and replaced people/avatars icon (`Users`) with the dedicated Phosphor `Van` component for all Minivan categories and vehicle filters.
  * **0 Leftover Lucide References**: Uninstalled `lucide-react`, verified 0 compilation errors via `npx tsc --noEmit` and production build with Vite.

### Milestone 14: RentalHub Rebrand & React Icons (Lucide) Migration
* **Location**: Entire frontend and backend (`resources/js`, `public/images/logo`, `app/`, `.agents/AGENTS.md`)
* **Features**:
  * **Brand Name & Logo**: Rebranded platform from RentBohol to **RentalHub** ("Rent. Book. Drive.") with modern car + pin + road logo.
  * **React Icons (`react-icons/lu`)**: Migrated all 28 TSX views and components to use the modern, unified, stroke-consistent Lucide icon set from `react-icons`.
  * **Cleaned Package Dependencies**: Uninstalled `@phosphor-icons/react`, installed `react-icons`.
  * **Rule Update**: Updated `.agents/AGENTS.md` to establish `react-icons/lu` as the mandatory icon standard.
  * **Zero Errors**: Verified with `npx tsc --noEmit`, production Vite build, PHPUnit (67/67 tests passing), and full headless browser verification.

---

## 5. Vehicle Distance, Mileage & GPS Tracking Architecture

### How Kilometers Are Measured in Operations
1. **Odometer Handover & Return (Standard Method)**:
   * Starting odometer recorded at pickup; ending odometer recorded at return.
   * Total km = `Return Odometer - Pickup Odometer`.
   * The database records this in the normalized `booking_handovers` table (`checkin_odometer` and `checkout_odometer`).
2. **Why Most Bohol Hosts Use "Unlimited" or "Bohol Island Only"**:
   * Bohol's coastal perimeter is ~260 km. A round-trip from Panglao to Chocolate Hills (Carmen) is ~140 km.
   * Because tourists cannot drive off the island without loading onto a RoRo ferry, "Unlimited" or "Bohol Island Only" avoids complex daily km disputes while strictly enforcing a no-ferry policy.
3. **GPS Tracking Hardware (Philippine Context)**:
   * **OBD-II Trackers** (e.g. SinoTrack ST-902, Micodus MV55G): Plug under the dash in 5 seconds; report live location and km.
   * **Hardwired Trackers with Relay** (e.g. SinoTrack ST-906, Concox WeTrack2): Hidden under dash with remote fuel/engine cutoff capabilities for anti-theft.
   * **SIM Cards**: Prepaid Globe (GOMO) or Smart with non-expiring data (~30-50MB/month).
4. **Legal Compliance (Data Privacy Act of 2012 / RA 10173)**:
   * GPS tracking for fleet security is **100% legal** under Philippine law **provided it is disclosed in advance**.
   * The checkout screen and rental agreement must state: *"Vehicles are equipped with GPS tracking for roadside safety and island boundary security."*

---

## 6. Key File & Directory Sitemap

```
CarRental/
├── app/
│   ├── Http/Controllers/
│   │   ├── Owner/VehicleController.php      # Owner listing management (store, update, status)
│   │   ├── PublicVehicleController.php      # Public catalog & vehicle details (show, search)
│   │   ├── RenterBookingController.php      # Renter trip management & checkout
│   ├── Models/
│   │   ├── Vehicle.php                      # Specs, pricing, distance, fuel, features, photos
│   │   ├── Feature.php                      # Normalized 3NF catalog of equipment & amenities
│   │   ├── Booking.php                      # Dates, pricing, status, financial calculations
│   │   ├── BookingHandover.php              # Normalized 3NF checkin/checkout inspection records
│   │   ├── Rating.php                       # Reviews with rater_id FK referential integrity
│   │   ├── VehiclePhoto.php                 # Gallery, ordering, focal position (X, Y)
│   │   └── VehicleAvailability.php          # 90-day block/available calendar dates
├── database/migrations/                     # Full schema history (fuel, specs, distance, indexes)
├── resources/
│   ├── css/
│   │   └── app.css                          # Tailwind v4 theme, luxury transition bezier tokens
│   ├── js/
│   │   ├── Components/
│   │   │   ├── DynamicToast.tsx             # Apple Dynamic Island HUD toast notifications
│   │   │   ├── SpotlightCard.tsx            # Interactive GPU lighting cards
│   │   │   └── GlassIcons.tsx               # 3D tactile glass icon boxes
│   │   ├── Layouts/
│   │   │   ├── PublicLayout.tsx             # Renter layout with live sync & toast mounting
│   │   │   ├── OwnerLayout.tsx              # Host dashboard navigation & fleet bar
│   │   │   └── AdminLayout.tsx              # System administration layout
│   │   ├── lib/
│   │   │   ├── utils.ts                     # formatCurrency (PHP), formatDate, cn()
│   │   │   └── vehicleSync.ts               # BroadcastChannel & real-time live sync hook
│   │   └── Pages/
│   │       ├── Owner/Vehicles/
│   │       │   ├── Index.tsx                # Fleet list with status dropdown popovers
│   │       │   ├── Create.tsx               # Add vehicle with 5-col specs & equipment
│   │       │   └── Edit.tsx                 # Full editor, 5-col specs, calendar, live sync
│   │       ├── Owner/Bookings/Index.tsx     # Booking requests, accept/complete/cancel
│   │       ├── Vehicles/Show.tsx            # Public details page, dynamic specs & booking form
│   │       └── Welcome.tsx                  # High-density landing page with featured fleet
├── .agents/
│   └── AGENTS.md                            # Agent instructions & icon rules
└── PROJECT_HISTORY.md                       # This comprehensive project reference file
```

---

## 7. Instructions for Future AI Assistants

When assisting the user with RentalHub:
1. **Always read this file first** before proposing changes.
2. **Never break React Icons (Lucide) compliance**: Do NOT introduce FontAwesome or raw inline `<svg>` blocks. Strictly use `react-icons/lu`.
3. **Preserve live sync**: Ensure any new owner actions invoke `broadcastVehicleUpdate()` from `@/lib/vehicleSync` so renter tabs update without F5.
4. **Always test with TypeScript**: Run `npx tsc --noEmit` and `npm run build` to verify 0 errors before reporting completion.
5. **Keep animations smooth**: Adhere to `450ms` - `650ms` deceleration curves for transitions.
