# Resend Domain Authentication - Deployment Checklist

Use this checklist to track your progress in setting up domain authentication for Resend email delivery.

## Prerequisites ✓

- [ ] Access to DNS provider (Cloudflare, GoDaddy, Namecheap, etc.)
- [ ] Administrator permissions for DNS management
- [ ] Resend account created at https://resend.com
- [ ] Domain `iiskills.cloud` ownership verified

## Phase 1: Resend Account Setup

- [ ] Sign up for Resend account
- [ ] Navigate to Domains section
- [ ] Click "Add Domain"
- [ ] Enter domain: `iiskills.cloud`
- [ ] Copy DNS records provided by Resend (save them somewhere safe)
- [ ] Generate API key from API Keys section
- [ ] Save API key securely (starts with `re_`)

## Phase 2: DNS Configuration

### Add DNS Records at Provider

- [ ] Log in to DNS provider dashboard
- [ ] Navigate to DNS management for `iiskills.cloud`

#### DKIM Record (Domain Verification)
- [ ] Type: TXT
- [ ] Name: `resend._domainkey`
- [ ] Value: (Paste DKIM public key from Resend)
- [ ] TTL: 3600 or Auto
- [ ] Record saved successfully

#### MX Record (Bounce Handling)
- [ ] Type: MX
- [ ] Name: `send`
- [ ] Value: `feedback-smtp.ap-northeast-1.amazonses.com`
- [ ] Priority: 10
- [ ] TTL: 3600
- [ ] Record saved successfully

#### SPF Record (Sender Authentication)
- [ ] Type: TXT
- [ ] Name: `send`
- [ ] Value: `v=spf1 include:amazonses.com ~all`
- [ ] TTL: 3600
- [ ] Record saved successfully

#### DMARC Record (Optional but Recommended)
- [ ] Type: TXT
- [ ] Name: `_dmarc`
- [ ] Value: `v=DMARC1; p=none; rua=mailto:dmarc@iiskills.cloud`
- [ ] TTL: 3600
- [ ] Record saved successfully

### Verify Records Added Correctly

- [ ] All 4 records visible in DNS provider dashboard
- [ ] No typos in record names
- [ ] No extra spaces in record values
- [ ] Long DKIM key copied completely
- [ ] All changes saved

## Phase 3: DNS Propagation

### Wait for Propagation (5 min - 48 hours, typically 1-4 hours)

- [ ] Initial wait: 30 minutes minimum
- [ ] Run verification script: `./verify-dns-records.sh`

#### Check Individual Records

- [ ] DKIM: `dig TXT resend._domainkey.iiskills.cloud +short`
- [ ] SPF: `dig TXT send.iiskills.cloud +short`
- [ ] MX: `dig MX send.iiskills.cloud +short`
- [ ] DMARC: `dig TXT _dmarc.iiskills.cloud +short`

#### Online Verification

- [ ] Check https://dnschecker.org for global propagation
- [ ] Verify on https://mxtoolbox.com/SuperTool.aspx
- [ ] All records showing globally

### Resend Verification Status

- [ ] Domain status in Resend dashboard: "Verified" or "Authenticated"
- [ ] No error messages in Resend dashboard
- [ ] Green checkmarks on all required records

## Phase 4: Application Configuration

### Environment Variables

- [ ] Create/update `.env.local` in root directory
- [ ] Add: `EMAIL_PROVIDER=resend`
- [ ] Add: `RESEND_API_KEY=re_xxxxxxxx` (your actual key)
- [ ] Add: `SENDER_EMAIL=newsletter@send.iiskills.cloud`
- [ ] Add: `SENDER_NAME=Skilling by iiskills.cloud`
- [ ] Save `.env.local` file

### Copy to All Apps (if using monorepo)

Each learning module needs the same configuration:

- [ ] apps/main/.env.local
- [ ] learn-apt/.env.local
- [ ] learn-ai/.env.local
- [ ] learn-chemistry/.env.local
- [ ] learn-data-science/.env.local
- [ ] learn-geography/.env.local
- [ ] learn-govt-jobs/.env.local
- [ ] learn-ias/.env.local
- [ ] learn-jee/.env.local
- [ ] learn-leadership/.env.local
- [ ] learn-management/.env.local
- [ ] learn-math/.env.local
- [ ] learn-neet/.env.local
- [ ] learn-physics/.env.local
- [ ] learn-pr/.env.local
- [ ] learn-winning/.env.local

### Verify Configuration

- [ ] Run: `node test-resend-auth.js <your-email>`
- [ ] Script shows: ✅ Environment configuration looks good
- [ ] No errors in configuration check

## Phase 5: Email Testing

### Send Test Email

- [ ] Run test script: `node test-resend-auth.js admin@iiskills.cloud`
- [ ] Script completes successfully
- [ ] Email ID returned from Resend

### Verify Email Delivery

- [ ] Test email received in inbox (check spam if not)
- [ ] Email shows correct sender: `newsletter@send.iiskills.cloud`
- [ ] Email displays properly (HTML formatting intact)
- [ ] Unsubscribe link present and functional

### Check Email Headers

View email headers (usually under "Show Original" or "View Source"):

- [ ] `dkim=pass` (DKIM authentication passed)
- [ ] `spf=pass` (SPF authentication passed)
- [ ] `dmarc=pass` (DMARC authentication passed)
- [ ] All three authentications showing PASS

### Alternative Testing Methods

- [ ] Test via Resend dashboard: https://resend.com/emails
- [ ] Test via admin page: `/admin/test-newsletter`
- [ ] Test via API endpoint: `/api/newsletter/test-send`

## Phase 6: Production Testing

### Send to Small Group

- [ ] Create test newsletter in admin dashboard
- [ ] Send to 5-10 test subscribers
- [ ] All emails delivered successfully
- [ ] No bounces or delivery failures
- [ ] Emails landing in inbox (not spam)

### Monitor Resend Dashboard

- [ ] Check email logs: https://resend.com/emails
- [ ] Verify delivery status
- [ ] Check open rates (if tracked)
- [ ] No error messages or bounces

### Monitor DMARC Reports (if configured)

- [ ] Set up email inbox for `dmarc@iiskills.cloud`
- [ ] Receive first DMARC report (can take 24-48 hours)
- [ ] Review report for authentication failures
- [ ] All reports showing 100% DMARC pass

## Phase 7: Production Rollout

### Gradual Volume Increase

- [ ] Week 1: Send to 10% of subscribers
- [ ] Week 2: Send to 25% of subscribers
- [ ] Week 3: Send to 50% of subscribers
- [ ] Week 4: Send to 100% of subscribers

### Monitor Metrics

- [ ] Delivery rate > 99%
- [ ] Bounce rate < 1%
- [ ] Spam complaint rate < 0.1%
- [ ] Open rate within expected range
- [ ] Unsubscribe rate acceptable

### Sender Reputation

- [ ] Check sender score: https://www.senderscore.org
- [ ] Monitor Google Postmaster: https://postmaster.google.com
- [ ] Check Microsoft SNDS: https://sendersupport.olc.protection.outlook.com/snds/
- [ ] Sender reputation score > 90

## Phase 8: Optimization

### Upgrade DMARC Policy (After 2-4 Weeks)

- [ ] Review DMARC reports for 2-4 weeks
- [ ] Confirm 100% authentication pass rate
- [ ] Update DMARC record to: `v=DMARC1; p=quarantine; pct=100`
- [ ] Wait for propagation
- [ ] Continue monitoring reports

### Email List Hygiene

- [ ] Remove bounced email addresses
- [ ] Remove inactive subscribers (no opens in 6 months)
- [ ] Implement re-engagement campaigns
- [ ] Maintain clean, engaged list

### Content Optimization

- [ ] Monitor spam trigger words
- [ ] Test subject lines
- [ ] Optimize email design
- [ ] Include clear unsubscribe link
- [ ] Maintain consistent sending schedule

## Troubleshooting Completed

If you encountered issues, document resolutions here:

- [ ] Issue: ________________________
      Solution: ________________________

- [ ] Issue: ________________________
      Solution: ________________________

- [ ] Issue: ________________________
      Solution: ________________________

## Documentation Completed

- [ ] Screenshot DNS records saved
- [ ] Screenshot Resend verification status saved
- [ ] Test email headers saved
- [ ] DMARC reports archived
- [ ] Troubleshooting notes documented

## Final Sign-Off

### Technical Validation

- [ ] All DNS records verified and propagated
- [ ] Domain authenticated in Resend dashboard
- [ ] Test emails delivered successfully
- [ ] Email headers show full authentication (DKIM/SPF/DMARC)
- [ ] Environment variables configured correctly
- [ ] Application using authenticated domain

### Production Readiness

- [ ] Small batch test successful
- [ ] Delivery metrics acceptable
- [ ] Sender reputation established
- [ ] Monitoring systems in place
- [ ] Team trained on email best practices

### Compliance & Security

- [ ] Unsubscribe mechanism working
- [ ] Privacy policy updated (if needed)
- [ ] CAN-SPAM compliance verified
- [ ] GDPR compliance (if applicable)
- [ ] Email content reviewed

## Success Criteria

All of the following must be true:

✅ Domain shows "Verified" in Resend dashboard  
✅ Test emails consistently land in inbox (not spam)  
✅ Email headers show DKIM=pass, SPF=pass, DMARC=pass  
✅ No delivery failures or bounces  
✅ Sender reputation score > 90  
✅ Team ready to manage email campaigns  

## Timeline Tracking

| Phase | Estimated | Started | Completed | Notes |
|-------|-----------|---------|-----------|-------|
| 1. Resend Setup | 15 min | _______ | _________ | _____ |
| 2. DNS Config | 30 min | _______ | _________ | _____ |
| 3. Propagation | 1-48 hrs | _______ | _________ | _____ |
| 4. App Config | 30 min | _______ | _________ | _____ |
| 5. Testing | 1 hour | _______ | _________ | _____ |
| 6. Production | 1 week | _______ | _________ | _____ |
| 7. Rollout | 4 weeks | _______ | _________ | _____ |
| 8. Optimize | Ongoing | _______ | _________ | _____ |

**Total Estimated Time:** 1-2 days for initial setup, 4 weeks for full rollout

## Notes & Comments

_Add any additional notes, lessons learned, or important information here:_

---

**Completed By:** _________________  
**Date:** _________________  
**Sign-off:** _________________

---

## Quick Links

- **Documentation:** [RESEND_DOMAIN_SETUP.md](RESEND_DOMAIN_SETUP.md)
- **Quick Reference:** [RESEND_DNS_QUICK_REFERENCE.md](RESEND_DNS_QUICK_REFERENCE.md)
- **Resend Dashboard:** https://resend.com/domains
- **DNS Checker:** https://dnschecker.org
- **MX Toolbox:** https://mxtoolbox.com

## Support Contacts

- **Resend Support:** support@resend.com
- **DNS Provider:** [Your provider's support contact]
- **Internal Team:** [Your team contact]
