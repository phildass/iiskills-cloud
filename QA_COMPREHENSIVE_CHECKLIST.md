# Comprehensive QA Checklist for iiskills.cloud

## Overview

This document provides a systematic QA checklist for validating all apps, pages, and user flows across the iiskills.cloud monorepo. Every item must be validated, documented, and evidenced with screenshots before marking as complete.

**Purpose**: Ensure consistent UI/UX, functionality, and user experience across all deployed applications.

---

## QA Validation Process

### Step 1: Pre-QA Setup

- [ ] Ensure all apps are built and running locally
- [ ] Set up screenshot capture tools
- [ ] Create QA evidence directory structure
- [ ] Configure test accounts (free user, paid user, admin)
- [ ] Document environment details (browser, OS, screen resolution)

### Step 2: Systematic Testing

For each item below:

1. **Test** the functionality
2. **Capture screenshot(s)** showing the feature
3. **Document** any issues found
4. **Verify** fix and capture updated screenshot
5. **Archive** evidence in designated folder

### Step 3: Evidence Package

All screenshots must be organized as:

```
qa-evidence/
├── landing-pages/
│   ├── main-app.png
│   ├── learn-ai.png
│   ├── learn-apt.png
│   └── ...
├── registration/
│   ├── email-registration-form.png
│   ├── google-oauth-flow.png
│   ├── registration-success.png
│   └── ...
├── login/
├── sample-lessons/
├── payment-flows/
└── admin-tools/
```

---

## 1. Universal Landing Pages

### Main App (app.iiskills.cloud)

- [ ] Hero section displays correctly
- [ ] Navigation bar renders with all links
- [ ] Course listings show with correct badges
- [ ] Footer displays with proper links
- [ ] "Get Started" CTA works
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] All images load correctly
- [ ] No console errors
- [ ] Page load time < 3 seconds
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/main-app.png`

### Learn-AI (learn-ai.iiskills.cloud) - PAID

- [ ] Hero section displays correctly
- [ ] Course price shown prominently
- [ ] Blue "PAID" badge displays
- [ ] Sample lesson preview works
- [ ] Bundle pitch (AI + Developer) displays
- [ ] Curriculum table renders completely
- [ ] "Start Learning" CTA redirects correctly
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-ai.png`

### Learn-APT (learn-apt.iiskills.cloud) - FREE

- [ ] Hero section displays correctly
- [ ] Green "FREE" badge displays
- [ ] Course syllabus visible
- [ ] "Start Free" CTA works
- [ ] No payment prompts shown
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-apt.png`

### Learn-Chemistry (learn-chemistry.iiskills.cloud) - FREE

- [ ] Hero section displays correctly
- [ ] Green "FREE" badge displays
- [ ] Curriculum accessible
- [ ] Translation widget available
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-chemistry.png`

### Learn-Developer (learn-developer.iiskills.cloud) - PAID

- [ ] Hero section displays correctly
- [ ] Blue "PAID" badge displays
- [ ] Course price visible
- [ ] Bundle pitch (AI + Developer) displays
- [ ] Sample lesson available
- [ ] Curriculum table complete
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-developer.png`

### Learn-Geography (learn-geography.iiskills.cloud) - FREE

- [ ] Hero section displays correctly
- [ ] Green "FREE" badge displays
- [ ] Full curriculum accessible
- [ ] Translation available
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-geography.png`

### Learn-Management (learn-management.iiskills.cloud) - PAID

- [ ] Hero section displays correctly
- [ ] Blue "PAID" badge displays
- [ ] Pricing information shown
- [ ] Sample lessons available
- [ ] Curriculum table renders
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-management.png`

### Learn-Math (learn-math.iiskills.cloud) - FREE

- [ ] Hero section displays correctly
- [ ] Green "FREE" badge displays
- [ ] Full access available
- [ ] Quiz components work
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-math.png`

### Learn-Physics (learn-physics.iiskills.cloud) - FREE

- [ ] Hero section displays correctly
- [ ] Green "FREE" badge displays
- [ ] Curriculum accessible
- [ ] Interactive elements work
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-physics.png`

### Learn-PR (learn-pr.iiskills.cloud) - PAID

- [ ] Hero section displays correctly
- [ ] Blue "PAID" badge displays
- [ ] Course pricing shown
- [ ] Sample content available
- [ ] Purchase flow clear
- [ ] Responsive design verified
- [ ] **Screenshot captured**: `qa-evidence/landing-pages/learn-pr.png`

---

## 2. Registration Flows

### Standard Email Registration

- [ ] Registration form displays correctly
- [ ] Email field validation works
- [ ] Password field with requirements shown
- [ ] Password strength indicator works
- [ ] "Register" button enabled when valid
- [ ] Terms of service link works
- [ ] Privacy policy link works
- [ ] Platform recommendation message displays:
  > "Google login is available, but we recommend registering with our platform for certification eligibility, progress tracking, and full course access."
- [ ] Form submission successful
- [ ] Confirmation email sent (< 30s)
- [ ] User redirected to correct post-registration page
- [ ] **Screenshots captured**:
  - `qa-evidence/registration/email-form.png`
  - `qa-evidence/registration/email-success.png`

### Google OAuth Registration

- [ ] "Continue with Google" button displays
- [ ] Google OAuth popup appears
- [ ] Account selection works
- [ ] Permissions request clear
- [ ] OAuth flow completes successfully
- [ ] User created in database
- [ ] User redirected to correct page
- [ ] Profile populated with Google data
- [ ] **Screenshots captured**:
  - `qa-evidence/registration/google-button.png`
  - `qa-evidence/registration/google-success.png`

### Multi-App Registration

Test registration from each app subdomain:

- [ ] Main app registration
- [ ] Learn-AI registration
- [ ] Learn-Developer registration
- [ ] Learn-Management registration
- [ ] Learn-PR registration

Verify each redirects to app-specific post-registration page.

---

## 3. Login Flows

### Standard Email Login

- [ ] Login form displays correctly
- [ ] Email field accepts input
- [ ] Password field masked properly
- [ ] "Login" label used (not "Sign in")
- [ ] "Remember me" checkbox works
- [ ] "Forgot password" link functional
- [ ] Invalid credentials show error
- [ ] Valid credentials log in successfully
- [ ] User redirected to app-specific page
- [ ] Session persists across page refreshes
- [ ] **Screenshots captured**:
  - `qa-evidence/login/email-form.png`
  - `qa-evidence/login/email-success.png`

### Google OAuth Login

- [ ] "Login with Google" button displays
- [ ] OAuth flow initiates correctly
- [ ] Existing user logs in successfully
- [ ] New user creates account via OAuth
- [ ] Redirects work correctly
- [ ] **Screenshot captured**: `qa-evidence/login/google-login.png`

### Multi-App Login

Test login from each app subdomain:

- [ ] Main app login
- [ ] Learn-AI login
- [ ] Learn-APT login
- [ ] Learn-Developer login

Verify app-specific redirects work.

### Logout Flow

- [ ] Logout button accessible
- [ ] Logout clears session
- [ ] User redirected to homepage
- [ ] Protected pages inaccessible after logout

---

## 4. Sample Lesson Flows

### Paid Apps - Sample Lessons

For each paid app (Learn-AI, Learn-Developer, Learn-Management, Learn-PR):

- [ ] Sample lesson clearly marked
- [ ] Sample lesson accessible without payment
- [ ] Sample lesson content displays fully
- [ ] Interactive elements work
- [ ] Quiz components function
- [ ] "Unlock Full Course" CTA displays
- [ ] Premium content locked appropriately
- [ ] **Screenshots captured** for each app

### Free Apps - Full Access

For each free app (Learn-APT, Learn-Chemistry, Learn-Geography, Learn-Math, Learn-Physics):

- [ ] All lessons accessible
- [ ] No payment prompts
- [ ] Full curriculum available
- [ ] Progress tracking works
- [ ] Quizzes functional
- [ ] Certificates available
- [ ] **Screenshots captured** for each app

---

## 5. Payment Flows

### Razorpay Integration

#### Single Course Purchase

- [ ] "Buy Now" button displays
- [ ] Price shown correctly
- [ ] Click triggers Razorpay modal
- [ ] Modal shows correct amount
- [ ] Payment methods available:
  - [ ] Credit/Debit card
  - [ ] UPI
  - [ ] Net Banking
  - [ ] Wallets
- [ ] Test payment successful
- [ ] Payment confirmation shown
- [ ] Access granted immediately
- [ ] Receipt email sent (< 30s)
- [ ] Transaction recorded in database
- [ ] **Screenshots captured**:
  - `qa-evidence/payments/single-purchase-button.png`
  - `qa-evidence/payments/razorpay-modal.png`
  - `qa-evidence/payments/payment-success.png`

#### Bundle Purchase

- [ ] Bundle pricing displayed
- [ ] Savings highlighted
- [ ] "Buy Bundle" button works
- [ ] Razorpay modal shows bundle price
- [ ] Payment successful
- [ ] Access granted to all bundled courses
- [ ] Confirmation email sent
- [ ] **Screenshots captured**:
  - `qa-evidence/payments/bundle-offer.png`
  - `qa-evidence/payments/bundle-success.png`

#### Payment Error Handling

- [ ] Card decline handled gracefully
- [ ] Network error shows message
- [ ] Retry option available
- [ ] Failed payments logged
- [ ] User notified appropriately

---

## 6. OTP Flows

### OTP Generation

- [ ] Admin can generate OTP
- [ ] OTP format correct (6 digits)
- [ ] OTP stored in database
- [ ] OTP expires after set time
- [ ] Multiple OTPs can be active

### OTP Redemption

- [ ] OTP entry form displays
- [ ] Valid OTP grants access
- [ ] Invalid OTP shows error
- [ ] Expired OTP rejected
- [ ] Used OTP cannot be reused
- [ ] Access granted immediately after valid OTP
- [ ] **Screenshots captured**:
  - `qa-evidence/otp/entry-form.png`
  - `qa-evidence/otp/success.png`

### OTP Dispatch

- [ ] OTP sent via email (< 30s)
- [ ] OTP sent via SMS (< 30s)
- [ ] Email contains correct OTP
- [ ] SMS contains correct OTP
- [ ] Delivery confirmation received

---

## 7. Access Control

### Free Course Access

- [ ] No login required for sample content
- [ ] Login required for progress tracking
- [ ] Full curriculum accessible after free registration
- [ ] No payment gates

### Paid Course Access

- [ ] Sample lessons open without payment
- [ ] Premium content locked
- [ ] Payment gate displays pricing
- [ ] Payment successful unlocks content
- [ ] Access persists across sessions

### Cross-App Access

- [ ] Payment for AI course doesn't grant Developer access
- [ ] Bundle payment grants multi-app access
- [ ] Admin grants work per app
- [ ] OTP codes work per app or all apps as configured

---

## 8. Admin Tools

### Admin Authentication

- [ ] Admin login separate from user login
- [ ] Admin OTP required
- [ ] Admin session secure
- [ ] Admin logout works

### User Management

- [ ] View all users
- [ ] Search users by email
- [ ] View user purchase history
- [ ] View user progress per app

### Access Grant/Revocation

- [ ] Admin can grant course access
- [ ] Admin can specify app
- [ ] Admin can revoke access
- [ ] Changes take effect immediately
- [ ] Audit log created for all actions
- [ ] **Screenshots captured**:
  - `qa-evidence/admin/grant-access.png`
  - `qa-evidence/admin/revoke-access.png`

### OTP Management

- [ ] Admin can generate OTPs
- [ ] OTPs can be app-specific or universal
- [ ] OTPs can be bulk-generated
- [ ] OTP validity period configurable
- [ ] OTP usage tracked
- [ ] **Screenshot captured**: `qa-evidence/admin/otp-generation.png`

### App-Specific Curriculum Display

- [ ] Admin sees correct curriculum per app
- [ ] No cross-app curriculum mixing
- [ ] Curriculum data accurate
- [ ] Search/filter works

### Notification Testing

- [ ] Email notifications sent
- [ ] SMS notifications sent
- [ ] Delivery time < 30s
- [ ] Notification templates correct
- [ ] No failed deliveries

---

## 9. Progressive Web App (PWA)

### Installation

- [ ] Install prompt appears (mobile)
- [ ] Install prompt appears (desktop)
- [ ] Installation successful
- [ ] App icon correct
- [ ] App name correct
- [ ] App opens in standalone mode

### Offline Functionality

- [ ] Service worker registered
- [ ] Core pages cached
- [ ] Offline fallback works
- [ ] Online status detection

---

## 10. Cross-Browser Testing

Test all critical flows in:

### Desktop Browsers

- [ ] Google Chrome (latest)
- [ ] Mozilla Firefox (latest)
- [ ] Safari (latest)
- [ ] Microsoft Edge (latest)

### Mobile Browsers

- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Samsung Internet

Document browser-specific issues.

---

## 11. Performance Testing

### Page Load Times

Measure and document:

- [ ] Landing pages < 3s
- [ ] Login page < 2s
- [ ] Registration page < 2s
- [ ] Course pages < 3s
- [ ] Admin dashboard < 4s

### Lighthouse Scores

Target scores (minimum):

- [ ] Performance: 85+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

**Screenshot captured**: `qa-evidence/performance/lighthouse-scores.png`

---

## 12. Accessibility (A11y)

### Keyboard Navigation

- [ ] All interactive elements keyboard-accessible
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Screen Reader

- [ ] Alt text on all images
- [ ] ARIA labels where appropriate
- [ ] Semantic HTML used
- [ ] Headings in logical order

### Color Contrast

- [ ] Text readable (4.5:1 minimum)
- [ ] Interactive elements visible
- [ ] Error messages clear

---

## 13. Security Testing

### Authentication Security

- [ ] Passwords hashed (not plaintext)
- [ ] Session tokens secure
- [ ] HTTPS enforced
- [ ] CSRF protection enabled
- [ ] XSS protection in place

### Payment Security

- [ ] Payment processed via Razorpay (PCI compliant)
- [ ] No card details stored locally
- [ ] Payment webhooks verified
- [ ] Transaction logs encrypted

### Admin Security

- [ ] Admin pages require authentication
- [ ] Admin OTP required
- [ ] Role-based access control
- [ ] Audit logs for all actions

---

## 14. Translation Features

### Google Translate Widget

- [ ] Widget displays on all pages
- [ ] Language selection works
- [ ] Translation accurate
- [ ] Page layout preserved after translation

### Translation Disclaimer

- [ ] Disclaimer visible
- [ ] Message clear
- [ ] Link to original language works

---

## QA Sign-Off

### Evidence Package Checklist

- [ ] All screenshots captured and organized
- [ ] Issues documented with severity levels
- [ ] Fixed issues re-tested and verified
- [ ] Performance reports generated
- [ ] Accessibility audit complete
- [ ] Security scan results included

### Client Approval

- [ ] QA checklist reviewed by client
- [ ] Screenshot evidence approved
- [ ] All critical issues resolved
- [ ] Non-critical issues documented for future sprint

### Deployment Readiness

- [ ] All tests passed
- [ ] Evidence archived
- [ ] Deployment plan approved
- [ ] Rollback plan documented

---

**QA Completed By**: _________________  
**Date**: _________________  
**Client Sign-Off**: _________________  
**Date**: _________________

---

## Appendix: Issue Tracking Template

Use this template to document issues found during QA:

```markdown
### Issue #XXX

**Severity**: Critical | High | Medium | Low  
**Component**: [Component/Page name]  
**Description**: [Brief description]  
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. ...

**Expected Behavior**: [What should happen]  
**Actual Behavior**: [What actually happens]  
**Screenshot**: [Path to screenshot]  
**Environment**: [Browser, OS, device]  
**Status**: Open | In Progress | Fixed | Won't Fix  
**Assigned To**: [Developer name]  
**Fixed In**: [PR number or commit hash]  
**Verified By**: [QA tester name]  
**Verification Date**: [Date]
```

---

**Last Updated**: 2026-02-18  
**Document Version**: 1.0.0  
**Maintained By**: QA Team
