# Profile Page — `/profile`

## Who can see the Profile page

The **Profile** link is visible in the navigation **only** when both conditions are met:
1. The user is **authenticated** (has an active Supabase session), AND
2. The user is a **paid user**.

Logged-out users see only **Login** and **Register** buttons; the Profile link is hidden entirely.
Authenticated but unpaid users also do not see the Profile link.

---

## How paid status is determined

Paid status is checked in the following order (highest to lowest precedence):

1. **`public.profiles.is_paid_user = true`** (preferred — denormalized flag set on first payment confirmation)
2. **Active entitlement in `public.entitlements`** — `status = 'active'` and `expires_at` is either `NULL` or in the future (fallback when the flag hasn't been synced yet)

When an active entitlement is found but `is_paid_user` is still `false`, the system automatically syncs the flag to `true` (and sets `paid_at` on first occurrence).

### Database columns added to `public.profiles`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `is_paid_user` | `boolean` | `false` | Denormalized paid-status flag; updated when entitlement is granted |
| `paid_at` | `timestamptz` | `NULL` | Timestamp of when the user first became a paid user (immutable after first set) |

Apply the migration to add these columns:

```sql
-- supabase/migrations/add_paid_user_to_profiles.sql
\i supabase/migrations/add_paid_user_to_profiles.sql
```

---

## "Paid before register" flow

A user may pay (via Razorpay → OTP gateway) **before** creating an iiskills account.

### How linking works

1. **OTP verification** (`POST /api/verify-otp`): after verifying the 6-digit OTP, the endpoint finds the registered user by email and:
   - Inserts an entitlement record
   - Sets `profiles.is_paid_user = true` (idempotent)
   - Sets `profiles.paid_at` (only on first grant, never overwritten)

2. **OTP gateway success page** (`/otp-gateway`): If the user is **not** logged in, the success state now shows a prominent prompt:
   > "Payment received. Please register / login to access your Profile page and course dashboard."
   
   Two buttons are displayed: **Register** and **Login**, both redirecting to `/profile` after authentication.

3. **Profile page visit** (`/profile`): When a user visits `/profile` with an active entitlement but `is_paid_user = false`, the page's API call automatically syncs the flag.

4. **Manual linking** (`POST /api/profile/link-payment`): An authenticated user can call this endpoint (with their Bearer token) to explicitly trigger payment linking. Useful for edge cases where automatic linking hasn't occurred.

---

## API reference

### `GET /api/profile`

Fetches the authenticated user's profile.

**Auth**: `Authorization: Bearer <access_token>`

**Responses**:
- `200` — `{ profile: { id, first_name, …, is_paid_user, paid_at }, email }`
- `401` — Unauthorized (missing/invalid token)
- `403` — User is authenticated but not a paid user
- `404` — Authenticated and paid, but no profile row exists yet
- `503` — Supabase not configured

### `POST /api/profile/link-payment`

Links pre-existing payment records to the authenticated user's profile.

**Auth**: `Authorization: Bearer <access_token>`

**Responses**:
- `200` — `{ linked: bool, message: string }`
- `401` — Unauthorized

---

## Security notes

- The Profile link is hidden client-side, but **direct URL access** to `/profile` is also protected: the page fetches `/api/profile` which returns `403` for unpaid users, and the client redirects to `/payments/iiskills`.
- The `/api/profile` endpoint verifies the JWT token server-side using Supabase service-role key.
- The `/profile` page is rate-limited by the Edge middleware (60 requests/minute per IP).
- Profile pages have `robots: noindex, nofollow` to prevent search engine indexing.
