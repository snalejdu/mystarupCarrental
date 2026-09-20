# RentBohol Session Notes — Sept 9, 2026 (Morning)

## What We Did Today

### 1. AccordionGallery Animation Smoothing
**Files changed:**
- `resources/js/Components/AccordionGallery.tsx`
- `resources/js/Components/AccordionGallery.css`

**What changed:**
- GSAP easing upgraded from `power2.out` → `expo.out` (buttery deceleration)
- Base duration `0.75s` → `0.85s`, media runs at `dur * 1.1` for trailing parallax
- Subtle scale effect on inactive panels (`0.97`)
- Label reveal delayed by `dur * 0.15` for sequenced entrance
- Label hide uses `power3.in` for snappy exit
- All CSS transitions bumped to `0.65s` with project's `cubic-bezier(0.16, 1, 0.3, 1)` curve

---

### 2. Removed "Rental Terms" from Navigation
**File changed:**
- `resources/js/Layouts/PublicLayout.tsx`

**What changed:**
- Removed "Rental Terms" link from desktop nav and mobile drawer
- Footer link to `/terms` is still there (unchanged)

---

### 3. Real Google OAuth Sign-In (Laravel Socialite)
Replaced the mock/demo Google sign-in with real Google OAuth 2.0.

**Files changed:**

| File | What |
|------|------|
| `composer.json` | Added `laravel/socialite v5.31.0` |
| `.env` | Added `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` |
| `config/services.php` | Added `google` service block |
| `database/migrations/2026_09_09_021230_add_google_id_to_users_table.php` | Added `google_id` column, made `password` nullable |
| `app/Models/User.php` | Added `google_id` to `$fillable` |
| `app/Http/Controllers/Auth/LoginController.php` | Replaced mock `google()` with real `redirectToGoogle()` + `handleGoogleCallback()` |
| `routes/web.php` | `GET /auth/google/redirect` + `GET /auth/google/callback` |
| `resources/js/Pages/Auth/Login.tsx` | `window.location.href` redirect to Google |
| `resources/js/Pages/Auth/Register.tsx` | Same redirect change |

**How it works now:**
1. User clicks "Continue with Google" → redirected to Google's consent screen
2. User grants permission → Google redirects to `/auth/google/callback`
3. Backend finds user by `google_id` or `email`, or creates new renter
4. User is logged in and redirected to their dashboard

---

## PENDING — Do This Tonight

### Google Cloud Console Setup (Required for Google Sign-In to Work)

1. Go to **Google Cloud Console** — https://console.cloud.google.com/
2. **Create a new project** named `RentBohol`
3. Go to **APIs & Services → OAuth consent screen**
   - Choose **External**, fill in app name (`RentBohol`), your email
   - Add scopes: `email`, `profile`, `openid`
4. Go to **APIs & Services → Credentials**
   - Click **+ Create Credentials → OAuth client ID**
   - Type: **Web application**, name: `RentBohol Web`
   - **Authorized JavaScript origins**: `http://localhost:8000`
   - **Authorized redirect URIs**: `http://localhost:8000/auth/google/callback`
   - Click **Create**
5. Copy the **Client ID** and **Client Secret**
6. Open `.env` and replace:
   ```
   GOOGLE_CLIENT_ID=paste-your-client-id-here
   GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
   ```
7. **Restart `php artisan serve`** to pick up the new env values
8. Test by clicking "Continue with Google" on the login page

---

## Current State
- Migration already ran ✅
- Socialite installed ✅
- TypeScript compiles clean ✅
- Routes registered ✅
- Just needs your Google Cloud credentials in `.env` to go live
