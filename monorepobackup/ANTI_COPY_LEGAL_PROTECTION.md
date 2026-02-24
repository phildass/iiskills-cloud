# Anti-Copy & Legal Protection Guide

**Document Version:** 1.0  
**Last Updated:** 2026-02-19  
**Purpose:** Comprehensive guide to preventing unauthorized copying and establishing legal protections

---

## Table of Contents

1. [Overview](#overview)
2. [Technical Anti-Copy Measures](#technical-anti-copy-measures)
3. [Legal Protections](#legal-protections)
4. [Detection & Monitoring](#detection--monitoring)
5. [Enforcement](#enforcement)
6. [Response Procedures](#response-procedures)

---

## Overview

### Protection Strategy

Our anti-copy approach uses **layered defense**:

1. **Technical deterrents** - Make copying difficult (not impossible)
2. **Watermarking** - Track source of leaks
3. **Legal protections** - Copyright, trademarks, terms of service
4. **Monitoring** - Detect unauthorized copies
5. **Enforcement** - Rapid response to violations

### Realistic Expectations

⚠️ **Important:** No technical protection is foolproof. Skilled attackers can bypass client-side protections. Our goal is to:
- Deter casual copying (99% of potential copiers)
- Track and identify the source of leaks
- Provide legal basis for enforcement
- Rapidly respond to violations

---

## Technical Anti-Copy Measures

### 1. Code Protection

#### Source Maps Disabled
```javascript
// All Next.js configs now have:
productionBrowserSourceMaps: false
```

**Why:** Prevents easy reverse engineering of minified code.

**Verification:**
```bash
# After production build
ls .next/static/**/*.map 2>/dev/null
# Should return nothing
```

#### Code Minification
- Automatically enabled by Next.js
- Variable names shortened
- Whitespace removed
- Dead code eliminated

#### Environment Variable Protection
```javascript
// NEVER expose secrets on client
// ❌ BAD
const API_KEY = "secret-key-here";

// ✅ GOOD - Server-side only
const API_KEY = process.env.API_KEY;

// ✅ GOOD - Public variables only
const PUBLIC_URL = process.env.NEXT_PUBLIC_SITE_URL;
```

### 2. Content Protection

#### Client-Side Protections

**Implementation:**
```javascript
import { enableProtections } from '@/utils/client-protection';
import { useEffect } from 'react';

export default function PremiumContent() {
  useEffect(() => {
    // Only enable for premium/sensitive content
    if (process.env.NEXT_PUBLIC_ENABLE_COPY_PROTECTION === 'true') {
      const cleanup = enableProtections({
        contextMenu: true,      // Disable right-click
        textSelection: true,    // Disable text selection
        copyShortcuts: true,    // Disable Ctrl+C, etc.
        dragDrop: true,         // Disable drag & drop
        watermark: {
          text: `${user.email} - ${sessionId}`,
          opacity: 0.1
        }
      });
      
      return cleanup;
    }
  }, [user, sessionId]);
  
  return (
    <div>
      <h1>Premium Content</h1>
      {/* Your premium content */}
    </div>
  );
}
```

**Features:**
- ✅ Disables right-click context menu
- ✅ Disables text selection
- ✅ Blocks common copy shortcuts (Ctrl+C, Ctrl+V, Ctrl+A)
- ✅ Prevents drag and drop
- ✅ Adds visible/invisible watermarks
- ✅ Detects DevTools opening

**Limitations:**
- ❌ Can be bypassed with browser extensions
- ❌ Can be bypassed by disabling JavaScript
- ❌ Can be bypassed using browser DevTools
- ❌ May frustrate legitimate users

**Recommendation:** Use selectively for most sensitive content only.

#### Security Headers

**Prevents embedding in iframes (clickjacking):**
```
X-Frame-Options: SAMEORIGIN
```

**Prevents MIME-type sniffing:**
```
X-Content-Type-Options: nosniff
```

**Content Security Policy:**
```
Content-Security-Policy: frame-ancestors 'self'
```

### 3. Watermarking

#### Visible Watermarks

**For images:**
```javascript
// Add watermark overlay to images
<div className="relative">
  <img src={imageUrl} alt="Content" />
  <div className="absolute top-4 right-4 opacity-50 text-white text-sm">
    © iiskills.cloud - {user.email}
  </div>
</div>
```

#### Invisible Watermarks

**For PDFs (certificates):**
```javascript
import jsPDF from 'jspdf';

function generateCertificate(userName, userId, sessionId) {
  const doc = new jsPDF();
  
  // Visible content
  doc.text(`Certificate for ${userName}`, 10, 10);
  
  // Invisible watermark in metadata
  doc.setProperties({
    title: 'iiskills Certificate',
    subject: `Issued to: ${userName}`,
    author: 'iiskills.cloud',
    keywords: `user-${userId}-session-${sessionId}-${Date.now()}`,
    creator: 'iiskills.cloud Certificate System v1.0'
  });
  
  // Hidden text (white on white) - forensic tracking
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6);
  doc.text(`TRACKING: ${userId}|${sessionId}|${Date.now()}`, 200, 290);
  
  return doc;
}
```

**Benefits:**
- Track source of leaks
- Identify which user shared content
- Provide evidence for legal action

#### User Session Tracking

**Database schema:**
```sql
CREATE TABLE content_access_log (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  content_id TEXT,
  content_type TEXT,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  accessed_at TIMESTAMP DEFAULT NOW()
);
```

**Logging access:**
```javascript
// Log every premium content access
await supabase.from('content_access_log').insert({
  user_id: userId,
  content_id: contentId,
  content_type: 'premium_lesson',
  session_id: sessionId,
  ip_address: req.ip,
  user_agent: req.headers['user-agent']
});
```

### 4. Asset Protection

#### CDN Configuration

**Hotlink protection:**
```nginx
# In nginx or CDN config
location ~* \.(jpg|jpeg|png|gif|pdf)$ {
    valid_referers none blocked iiskills.cloud *.iiskills.cloud;
    if ($invalid_referer) {
        return 403;
    }
}
```

**Prevents:**
- Direct linking to images/PDFs from other sites
- Bandwidth theft
- Unauthorized distribution

#### Image Resolution Strategy

**Free tier:**
- Low-resolution previews (800px max width)
- Visible watermark
- Compressed quality (70%)

**Paid tier:**
- High-resolution images (original size)
- Minimal/no watermark
- High quality (90%)

```javascript
function getImageUrl(contentId, isPremium) {
  if (isPremium) {
    return `/api/content/image/${contentId}?quality=high`;
  } else {
    return `/api/content/image/${contentId}?quality=preview`;
  }
}
```

---

## Legal Protections

### 1. Copyright

#### Copyright Notice

**Required placement:**
- Footer of every page
- Inside PDFs/certificates
- README files
- Source code headers

**Format:**
```
© 2026 iiskills.cloud. All rights reserved.

This content is protected by copyright law and international treaties.
Unauthorized reproduction or distribution may result in civil and criminal penalties.
```

**In code:**
```javascript
// components/Footer.js
<footer>
  <p>© 2026 iiskills.cloud. All rights reserved.</p>
  <a href="/legal/dmca">DMCA Policy</a>
  <a href="/legal/terms">Terms of Service</a>
</footer>
```

#### Copyright Registration

**Recommended:**
- Register copyright with U.S. Copyright Office (or local equivalent)
- Provides legal benefits:
  - Statutory damages (up to $150,000 per work)
  - Attorney's fees
  - Public record of ownership

**How to register:**
1. Visit https://copyright.gov/registration/
2. Complete online application (eCO)
3. Pay registration fee ($65-$125 USD)
4. Submit copy of work
5. Receive certificate (3-9 months)

### 2. Terms of Service

**Must include:**

#### Ownership & Copyright
```
1. INTELLECTUAL PROPERTY

All content, features, and functionality on iiskills.cloud, including but not limited to:
- Text, graphics, images, videos
- Courses, lessons, quizzes, assessments
- Software, code, interfaces
- Trademarks, logos, service marks

are the exclusive property of iiskills.cloud and are protected by copyright, 
trademark, and other intellectual property laws.
```

#### Prohibited Uses
```
2. PROHIBITED ACTIVITIES

You may NOT:
- Copy, reproduce, or distribute our content without written permission
- Reverse engineer, decompile, or disassemble our software
- Create derivative works based on our content
- Remove or alter copyright notices
- Share your account credentials with others
- Use bots, scrapers, or automated tools to access our service
- Frame or embed our content on other websites
```

#### License Grant
```
3. LIMITED LICENSE

Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, 
revocable license to access and use our services for your personal, non-commercial use.

This license does NOT include the right to:
- Download (except where explicitly permitted)
- Modify, reproduce, or distribute our content
- Use our content for commercial purposes
- Share access with others
```

#### Enforcement
```
4. ENFORCEMENT

We reserve the right to:
- Monitor and investigate violations
- Suspend or terminate accounts
- Remove infringing content
- Pursue legal action including injunctive relief and damages
- Cooperate with law enforcement
```

#### DMCA Safe Harbor
```
5. COPYRIGHT INFRINGEMENT CLAIMS (DMCA)

We respect intellectual property rights and expect our users to do the same.

If you believe your work has been copied in a way that constitutes copyright 
infringement, please notify our DMCA Agent at: dmca@iiskills.in

Your notice must include:
- Identification of the copyrighted work
- Identification of the infringing material
- Your contact information
- A statement of good faith belief
- A statement under penalty of perjury
- Your physical or electronic signature
```

### 3. Trademark Protection

#### Trademark Registration

**Trademarks to register:**
- "iiskills.cloud" (name)
- iiskills logo
- "Skilling by iiskills.cloud" (tagline)

**Benefits:**
- Exclusive right to use mark
- Legal presumption of ownership
- Ability to use ® symbol
- Stronger enforcement

**How to register:**
1. Conduct trademark search
2. File application (USPTO or local office)
3. Pay filing fee ($250-$750 USD)
4. Respond to office actions
5. Receive registration (6-12 months)

#### Trademark Usage

**Proper format:**
```
iiskills.cloud® (if registered)
iiskills.cloud™ (if not yet registered)
```

**Enforcement:**
- Monitor for unauthorized use
- Send cease and desist letters
- Protect brand reputation

### 4. Non-Disclosure Agreements (NDAs)

**For team members:**
```
NON-DISCLOSURE AGREEMENT

All employees, contractors, and consultants must sign NDAs covering:
- Proprietary code and algorithms
- Business strategies and plans
- User data and analytics
- Trade secrets
- Unreleased features
```

**For partners:**
```
MUTUAL NON-DISCLOSURE AGREEMENT

When sharing information with partners, require mutual NDAs to protect:
- Technical specifications
- API documentation
- Business terms
- User demographics
```

---

## Detection & Monitoring

### 1. Plagiarism Detection

#### Google Alerts

**Set up alerts for:**
```
- "iiskills.cloud"
- Unique phrases from your content
- Course titles
- Distinctive terminology
```

**Configuration:**
1. Visit https://www.google.com/alerts
2. Add search terms
3. Set frequency: Daily or As-it-happens
4. Deliver to: Your email

#### Reverse Image Search

**Check for image theft:**
1. Use Google Images: https://images.google.com/
2. Upload your image or paste URL
3. Click "Search by image"
4. Review results for unauthorized use

**Automate:**
```bash
# Use Google's Vision API or similar
# Check periodically for unauthorized image use
```

#### Code Theft Detection

**Copyscape / Plagiarism Checkers:**
- Copyscape: https://www.copyscape.com/
- Grammarly Plagiarism Checker
- Turnitin (for educational content)

### 2. Web Scraping Detection

#### Bot Detection

**Implement reCAPTCHA:**
```javascript
// Already configured in iiskills-cloud
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

**Rate limiting:**
```javascript
// API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Max 100 requests per minute
  message: 'Too many requests, please slow down'
});
```

#### Honeypot Links

**Add hidden links that bots will follow:**
```html
<!-- Hidden from humans, visible to scrapers -->
<a href="/admin/honeypot" style="display:none;">Admin</a>
```

```javascript
// pages/admin/honeypot.js
export default function Honeypot({ req }) {
  // Log bot IP
  logSuspiciousAccess(req.ip, req.headers);
  
  // Block IP
  blockIP(req.ip);
  
  return <div>Page not found</div>;
}
```

### 3. Clone Site Detection

#### Monitor for Similar Domains

**Tools:**
- DomainTools: https://www.domaintools.com/
- Brand Monitoring Services

**Watch for:**
- iiskills-cloud.com
- iskills.cloud
- iiskill.cloud
- i-iskills.cloud

#### Content Fingerprinting

**Create unique content signatures:**
```javascript
// Add unique, invisible strings to content
const contentFingerprint = crypto
  .createHash('sha256')
  .update(content + secretSalt + timestamp)
  .digest('hex');

// Store in database
await supabase.from('content_fingerprints').insert({
  content_id: contentId,
  fingerprint: contentFingerprint,
  created_at: new Date()
});
```

**Benefits:**
- Prove content originated from your site
- Identify which version was copied
- Track distribution

---

## Enforcement

### 1. Cease and Desist Letter

**Template:**
```
[Your Letterhead]
[Date]

VIA CERTIFIED MAIL
[Infringer Name]
[Infringer Address]

RE: Cease and Desist - Copyright Infringement

Dear [Infringer Name]:

We represent iiskills.cloud, the owner of copyrighted works including [describe content].

It has come to our attention that you are using our copyrighted materials without 
authorization at [infringing URL/location].

This letter serves as formal notice that your actions constitute copyright infringement 
under the Copyright Act [cite specific law].

We demand that you:
1. Immediately cease and desist from using our copyrighted materials
2. Remove all infringing content from your website/platform
3. Provide written confirmation of compliance within 10 business days

Failure to comply will result in legal action seeking:
- Injunctive relief
- Actual damages or statutory damages up to $150,000 per work
- Attorney's fees and costs

This letter is not exhaustive of our rights and remedies, all of which are 
expressly reserved.

Sincerely,
[Your Name]
[Your Title]
iiskills.cloud

cc: Legal Counsel
```

### 2. DMCA Takedown Notice

**For content hosted on third-party platforms:**

```
DMCA Takedown Notice

To: [Platform DMCA Agent]

I, [Your Name], am the [owner/authorized representative] of iiskills.cloud.

I have a good faith belief that the material at the following URL:
[Infringing URL]

infringes our copyright in [describe copyrighted work].

The infringing material should be removed or access to it disabled.

Original material can be found at: [Your original URL]

My contact information:
Name: [Your Name]
Address: [Your Address]
Email: [Your Email]
Phone: [Your Phone]

I swear, under penalty of perjury, that the information in this notice is accurate 
and that I am the copyright owner or authorized to act on behalf of the owner.

Signature: [Your Signature]
Date: [Date]
```

**Send to:**
- YouTube: https://www.youtube.com/copyright_complaint_form
- Facebook: https://www.facebook.com/help/contact/634636770043106
- Google: https://support.google.com/legal/answer/3110420
- Hosting providers: Check their DMCA page

### 3. Legal Action

**When to pursue:**
- Repeated violations after C&D
- Significant financial damage
- Damage to reputation
- Willful infringement

**Types of legal action:**
1. **Cease and Desist Order:** Court order to stop infringement
2. **Preliminary Injunction:** Immediate stop pending trial
3. **Damages:** Financial compensation
4. **Destruction of Infringing Materials:** Court-ordered removal
5. **Criminal Prosecution:** For willful, commercial infringement

**Finding legal counsel:**
- Intellectual Property lawyers
- Tech/Internet law specialists
- Local bar association referral

---

## Response Procedures

### 1. Incident Response Workflow

```
1. DETECT
   ↓
2. DOCUMENT
   - Screenshots
   - URLs
   - Timestamps
   - Access logs
   ↓
3. ASSESS
   - Scope of infringement
   - Impact (financial, reputation)
   - Infringer identity
   ↓
4. RESPOND
   - Internal: Minor violations
   - C&D Letter: Significant violations
   - DMCA: Platform-hosted content
   - Legal Action: Repeated/severe
   ↓
5. MONITOR
   - Verify compliance
   - Track repeat offenders
   - Update protections
```

### 2. Documentation

**Evidence to collect:**

1. **Screenshots:**
   - Full page screenshots
   - URL visible in browser
   - Timestamp visible
   - Multiple angles if needed

2. **Logs:**
   - Access logs showing IP, timestamp
   - User agent strings
   - Session IDs
   - Request patterns

3. **Archive:**
   - Use Wayback Machine: https://web.archive.org/
   - Download infringing content
   - Save HTML source
   - Record video if interactive

4. **Metadata:**
   - WHOIS lookup of infringing domain
   - Hosting provider information
   - Contact information if available

### 3. Communication

**Email template:**
```
Subject: Copyright Infringement Notification

Dear [Name/Webmaster],

I am writing on behalf of iiskills.cloud regarding unauthorized use of our 
copyrighted content on your website [URL].

Specifically, we have identified the following infringing materials:
[List specific content and URLs]

Our original content can be found at:
[Your URLs]

We request that you:
1. Remove the infringing content within 48 hours
2. Confirm removal via email
3. Refrain from future unauthorized use

We prefer to resolve this amicably. However, failure to comply may result in 
formal legal action.

Please contact us at legal@iiskills.in to discuss this matter.

Sincerely,
[Your Name]
iiskills.cloud
```

---

## Appendix

### A. Checklist for New Content

Before publishing premium content:

- [ ] Add copyright notice
- [ ] Implement watermarking
- [ ] Enable client-side protections (if applicable)
- [ ] Log content access
- [ ] Configure CDN/hotlink protection
- [ ] Create content fingerprint
- [ ] Set up monitoring alerts

### B. Regular Maintenance

**Weekly:**
- [ ] Review Google Alerts
- [ ] Check access logs for anomalies
- [ ] Monitor for unauthorized copies

**Monthly:**
- [ ] Reverse image search on key assets
- [ ] Review Terms of Service violations
- [ ] Update plagiarism detection tools

**Quarterly:**
- [ ] Audit security measures
- [ ] Review legal protections
- [ ] Update watermarking strategies
- [ ] Train team on procedures

### C. Resources

**Legal Templates:**
- Terms of Service generator: https://www.termsfeed.com/
- Privacy Policy generator: https://www.freeprivacypolicy.com/
- DMCA template: https://www.dmca.com/Takedowns/

**Monitoring Tools:**
- Google Alerts: https://www.google.com/alerts
- Copyscape: https://www.copyscape.com/
- Brand monitoring: https://brandmonitor.com/

**Legal Resources:**
- U.S. Copyright Office: https://www.copyright.gov/
- USPTO (Trademarks): https://www.uspto.gov/
- EFF: https://www.eff.org/

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-19 | Initial document creation |

---

**Document Owner:** Legal & Security Team  
**Contact:** legal@iiskills.in  
**Review Frequency:** Quarterly

---

*This guide is for internal use and educational purposes. Consult with legal counsel before taking legal action.*
