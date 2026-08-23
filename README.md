# RentBohol — Vehicle Rental Marketplace for Bohol, Philippines

**RentBohol** is a vehicle rental marketplace specifically built for Bohol, Philippines (Tagbilaran, Panglao, Dauis, Loboc, Carmen, etc.). It replaces informal Facebook group postings with an organized booking platform featuring a privacy-first **hidden contact until accepted** mechanic.

---

## Key Features & Security Mechanics

1. **Renter Privacy & Hidden Contact Protection**
   - Renters submit requests without creating an account.
   - Contact numbers are encrypted at rest and **never exposed in API responses** for pending requests.
   - Once the owner accepts, contact details unlock for both parties and calendar dates are automatically blocked.

2. **Owner Trust & Business Model**
   - Free listing for vehicle owners.
   - **4% global commission rate** logged only upon confirmed and completed rentals.

3. **Security Hardening**
   - **Rate limiting** on all public endpoints (browse 60/min, booking requests 10/min, renter status 30/min, login/register 5/min).
   - **Resource Authorization Policies** (`VehiclePolicy`, `BookingPolicy`) verifying resource ownership.
   - **Secure File Uploads**: Server-side MIME validation (JPEG/PNG/WebP), stored outside public root (`storage/app/private/uploads`), served via signed URLs.
   - **Security Logging**: Dedicated security channel (`storage/logs/security.log`) for failed auth and booking request audits.

4. **SEO & Performance**
   - Inertia.js SSR entry point ready for VPS deployment (`resources/js/ssr.tsx`).
   - Dynamic title and meta descriptions per vehicle listing.
   - Auto-generated XML Sitemap command (`php artisan sitemap:generate`).
   - WebP image compression pipeline.

---

## Tech Stack

- **Backend**: Laravel 13 (PHP 8.3)
- **Frontend**: React 19 + Inertia.js v2
- **Styling**: Tailwind CSS v4 + Custom Bohol Design System
- **Database**: MySQL (via Laragon)

---

## Design, Icons & Animation Resources

- **Icons**: [Lucide React](https://lucide.dev/icons/)
- **Car Animations**: [LottieFiles Free Car Animations](https://lottiefiles.com/free-animations/car?asset=all) (For micro-interactions, loading states, and status transitions)

---

## Pre-Deployment Checklist

Before deploying to production, run the following security audit commands:

```bash
# 1. Check for PHP package vulnerabilities
composer audit

# 2. Check for Node package vulnerabilities
npm audit

# 3. Build minified production frontend assets
npm run build

# 4. Generate XML sitemap
php artisan sitemap:generate

# 5. Run PHP unit/feature test suite
php artisan test
```

---

## Local Development Setup (Laragon)

1. **Start Laragon**: Click "Start All" on Laragon dashboard (Apache + MySQL).
2. **Run Migrations & Seeders**:
   ```bash
   php artisan migrate:fresh --seed
   ```
3. **Start Development Servers**:
   ```bash
   npm run dev
   ```
   and in a second terminal:
   ```bash
   php artisan serve
   ```

### Default Demo Accounts
- **Admin**: `admin@rentbohol.com` / `password123`
- **Owner 1**: `maria@boholrentals.ph` / `password123`
- **Owner 2**: `juan@panglaowheels.com` / `password123`
