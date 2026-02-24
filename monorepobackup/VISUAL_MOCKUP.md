# Visual Mockup - TESTING ONLY Legend & Admin Setup

## 1. Testing Mode Legend (Top Right Corner)

The "TESTING ONLY" legend appears as a fixed badge in the top-right corner of ALL pages when feature flags are enabled:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                    ┌──────────────────┐ │
│                                    │ ⚠️ TESTING ONLY   │ │
│                                    │ Admin Setup Mode │ │
│                                    └──────────────────┘ │
│                                                         │
│    Your Page Content Here                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Styling:**
- Fixed position: `top: 1rem; right: 1rem;`
- Z-index: `99999` (appears above everything)
- Background: Yellow (`#EAB308`)
- Border: 2px solid darker yellow (`#CA8A04`)
- Animation: Pulse (2s infinite)
- Padding: 16px
- Border radius: 8px
- Font: Bold, black text

**Variants:**
```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ ⚠️ TESTING ONLY   │     │ ⚠️ TESTING ONLY   │     │ ⚠️ TESTING ONLY   │
│ Admin Setup Mode │     │ Auth Suspended   │     │ Test Mode Active │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

---

## 2. Admin Setup Page (`/admin/setup`)

### When ADMIN_SETUP_MODE=true and No Admin Exists

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                  ┌─────────────────────────────────┐            │
│                  │ ⚠️ SETUP MODE ACTIVE            │            │
│                  │ This page is only accessible    │            │
│                  │ with ADMIN_SETUP_MODE enabled.  │            │
│                  └─────────────────────────────────┘            │
│                                                                 │
│              First-Time Admin Setup                             │
│         Create the first admin account for secure access        │
│                                                                 │
│    Email (Optional)                                             │
│    ┌─────────────────────────────────────────┐                 │
│    │ admin@example.com                       │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│    Create Password *                                            │
│    ┌─────────────────────────────────────────┐ 👁️              │
│    │ ••••••••••••                            │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│    Confirm Password *                                           │
│    ┌─────────────────────────────────────────┐                 │
│    │ ••••••••••••                            │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│    ┌─────────────────────────────────────────┐                 │
│    │      Create Admin Account               │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│    ┌─────────────────────────────────────────┐                 │
│    │ Security Notes:                         │                 │
│    │ • Password will be hashed with bcrypt   │                 │
│    │ • Setup event will be logged for audit  │                 │
│    │ • Setup mode disables automatically     │                 │
│    │ • You must set ADMIN_SETUP_MODE=false   │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### When ADMIN_SETUP_MODE=false (Feature Disabled)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        🚫                                        │
│                                                                 │
│                  Admin Setup Disabled                           │
│                                                                 │
│       ADMIN_SETUP_MODE is not enabled.                          │
│       Set ADMIN_SETUP_MODE=true to enable                       │
│       first-time setup.                                         │
│                                                                 │
│       Redirecting to admin login...                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### When Admin Already Exists

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ✅                                        │
│                                                                 │
│                  Setup Already Complete                         │
│                                                                 │
│       Admin account already exists.                             │
│       Redirecting to login...                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Success Page (After Setup)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                        ✅                                        │
│                                                                 │
│                  Setup Complete!                                │
│                                                                 │
│       Admin account created successfully.                       │
│       You will be redirected to the admin dashboard.            │
│                                                                 │
│    ┌─────────────────────────────────────────┐                 │
│    │ ⚠️ IMPORTANT NEXT STEPS                  │                 │
│    │ 1. Set ADMIN_SETUP_MODE=false            │                 │
│    │ 2. Restart the server                    │                 │
│    │ 3. Keep your password secure             │                 │
│    │ 4. Review audit logs for security        │                 │
│    └─────────────────────────────────────────┘                 │
│                                                                 │
│       Redirecting in 5 seconds...                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Example Page with Testing Legend

Any page in the app when testing mode is active:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  iiskills.cloud                            ┌──────────────────┐ │
│  ═══════════════                           │ ⚠️ TESTING ONLY   │ │
│                                            │ Admin Setup Mode │ │
│  [Home] [Learn] [About] [Contact]         └──────────────────┘ │
│                                                                 │
│                                                                 │
│                    Welcome to iiskills.cloud                    │
│                   ─────────────────────────                     │
│                                                                 │
│              Your learning platform content here...             │
│                                                                 │
│                                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │   Course 1    │  │   Course 2    │  │   Course 3    │       │
│  │               │  │               │  │               │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
│                                                                 │
│                                                                 │
│  © 2026 iiskills.cloud                                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Note:** The testing legend ALWAYS appears in the top right when ANY feature flag is enabled, regardless of which page you're on.

---

## 4. Console Warnings

When testing modes are active, developers see warnings in the browser console:

```
Console Output:
═══════════════════════════════════════════════════════════

⚠️ ADMIN_SETUP_MODE is enabled - First-time admin setup is available

Visit http://localhost:3000/admin/setup to create admin account

Remember to set ADMIN_SETUP_MODE=false after setup!

═══════════════════════════════════════════════════════════
```

Or when auth is suspended:

```
Console Output:
═══════════════════════════════════════════════════════════

⚠️ TEMP_SUSPEND_AUTH is enabled - Authentication checks are suspended

THIS IS FOR EMERGENCY USE ONLY!

Set TEMP_SUSPEND_AUTH=false and ADMIN_SUSPEND_CONFIRM=false when done

═══════════════════════════════════════════════════════════
```

---

## 5. Color Scheme

**Testing Legend:**
- Background: `#EAB308` (Yellow 500)
- Border: `#CA8A04` (Yellow 600)
- Text: `#000000` (Black)
- Icon: `currentColor` (Black)
- Shadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

**Setup Page Warning Banner:**
- Background: `#FEF3C7` (Yellow 100)
- Border Left: 4px solid `#F59E0B` (Yellow 500)
- Text: `#92400E` (Yellow 800)

**Success/Error States:**
- Success: Green (`#10B981`)
- Error: Red (`#EF4444`)
- Warning: Yellow (`#F59E0B`)
- Info: Blue (`#3B82F6`)

---

## 6. Responsive Behavior

**Desktop (>768px):**
- Legend: Fixed top-right corner
- Padding: 16px
- Font size: 14px

**Mobile (<768px):**
- Legend: Still fixed top-right
- Smaller padding: 12px
- Smaller font: 12px
- May overlap content (intentionally visible)

**Always On Top:**
The legend has `z-index: 99999` to ensure it's visible even over modals, dropdowns, or other overlays.

---

## 7. Animation

The "TESTING ONLY" legend uses a pulse animation:

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

This makes it subtly pulse to draw attention without being too distracting.

---

## Implementation Notes

### Component Structure

```jsx
<TestingModeBanner>
  <div className="fixed top-4 right-4 z-[99999]">
    <div className="bg-yellow-500 border-2 border-yellow-600 
                    px-4 py-2 rounded-lg shadow-2xl animate-pulse">
      <div className="flex items-center gap-2">
        <svg>⚠️</svg>
        <span>TESTING ONLY</span>
      </div>
      {mode && (
        <div className="text-xs mt-1">
          {modeName}
        </div>
      )}
    </div>
  </div>
</TestingModeBanner>
```

### Usage in _app.js

```jsx
import TestingModeBanner from '../components/TestingModeBanner';

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <TestingModeBanner /> {/* Always included */}
    </ErrorBoundary>
  );
}
```

The component automatically checks environment variables and shows/hides itself accordingly.

---

This visual mockup demonstrates the key UI elements:
1. **Prominent "TESTING ONLY" legend** - Always visible in top right
2. **Admin setup page** - Feature-flagged with clear warnings
3. **Success/error states** - Clear user feedback
4. **Security warnings** - Console and visual indicators
5. **Responsive design** - Works on all screen sizes
