# Resend Domain Authentication Setup Guide

## Overview

This guide provides step-by-step instructions for authenticating the `iiskills.cloud` domain with Resend to ensure reliable, trusted delivery of all newsletters and transactional emails.

## Why Domain Authentication Matters

Domain authentication through DNS records:
- ✅ Prevents emails from landing in spam folders
- ✅ Builds sender reputation and trust
- ✅ Enables email tracking and analytics
- ✅ Required for production email sending
- ✅ Protects against email spoofing and phishing

## Prerequisites

Before starting, ensure you have:
- [x] Access to your DNS provider (GoDaddy, Cloudflare, Namecheap, etc.)
- [x] Resend account with API key
- [x] Administrator permissions for DNS management
- [x] `iiskills.cloud` domain ownership

## Step 1: Get DNS Records from Resend Dashboard

1. Log in to [Resend Dashboard](https://resend.com/domains)
2. Navigate to **Domains** section
3. Click **Add Domain**
4. Enter your domain: `iiskills.cloud`
5. Resend will generate unique DNS records for your domain
6. **Important:** Copy these records - you'll need them in the next step

## Step 2: Add DNS Records at Your DNS Provider

You need to add the following DNS records at your DNS hosting provider. The exact values will be provided by Resend, but here's the structure:

### A. Domain Verification (DKIM Record)

DKIM (DomainKeys Identified Mail) proves that emails are legitimately from your domain.

```
Type: TXT
Name: resend._domainkey
Value: <DKIM public key provided by Resend>
TTL: Auto (or 3600)
```

**Example value from Resend:**
```
v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
```

**Important Notes:**
- Copy the ENTIRE DKIM key from Resend - it's a long string
- Some DNS providers require you to remove quotes or escape special characters
- Do NOT add extra spaces or line breaks

### B. Email Sending Configuration (SPF & MX Records)

#### MX Record for Send Subdomain

This tells mail servers where to send bounce notifications.

```
Type: MX
Name: send
Value: feedback-smtp.ap-northeast-1.amazonses.com
Priority: 10
TTL: 3600
```

**Note:** Resend uses Amazon SES infrastructure for email delivery.

#### SPF Record for Send Subdomain

SPF (Sender Policy Framework) specifies which mail servers can send email on behalf of your domain.

```
Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

**What this means:**
- `v=spf1` - SPF version 1
- `include:amazonses.com` - Allow Amazon SES to send emails
- `~all` - Soft fail for other servers (recommended for initial setup)

### C. DMARC Policy (Optional but Highly Recommended)

DMARC (Domain-based Message Authentication, Reporting, and Conformance) tells receiving servers what to do with emails that fail authentication.

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@iiskills.cloud
TTL: Auto (or 3600)
```

**DMARC Policy Options:**
- `p=none` - Monitor only (recommended for initial setup)
- `p=quarantine` - Send suspicious emails to spam
- `p=reject` - Reject suspicious emails completely

**After monitoring for 1-2 weeks, you can upgrade to stricter policies:**
```
v=DMARC1; p=quarantine; rua=mailto:dmarc@iiskills.cloud; pct=100
```

## Step 3: DNS Provider-Specific Instructions

### Cloudflare
1. Log in to Cloudflare Dashboard
2. Select your domain `iiskills.cloud`
3. Go to **DNS** → **Records**
4. Click **Add record** for each DNS record above
5. Ensure proxy status is **DNS only** (gray cloud) for email records

### GoDaddy
1. Log in to GoDaddy Domain Manager
2. Select `iiskills.cloud`
3. Go to **DNS** → **Manage Zones**
4. Click **Add** for each record
5. For TXT records with long values, GoDaddy may split them - this is normal

### Namecheap
1. Log in to Namecheap
2. Go to **Domain List** → Select `iiskills.cloud`
3. Click **Advanced DNS**
4. Add each record using **Add New Record** button
5. Save all changes

### AWS Route 53
1. Open Route 53 Console
2. Select hosted zone for `iiskills.cloud`
3. Click **Create record**
4. Add each DNS record
5. Wait for changes to propagate

## Step 4: Verify DNS Propagation

After adding DNS records, they need to propagate across the internet. This can take anywhere from **5 minutes to 48 hours**.

### Check DNS Propagation

Use these tools to verify your records:

1. **Resend Dashboard** (Primary verification)
   - Go to [Resend Domains](https://resend.com/domains)
   - Check the status of `iiskills.cloud`
   - Wait for **"Verified"** or **"Authenticated"** status

2. **DNS Lookup Tools:**
   - https://dnschecker.org
   - https://mxtoolbox.com/SuperTool.aspx
   - https://toolbox.googleapps.com/apps/checkmx/

3. **Command Line Tools:**
   ```bash
   # Check DKIM record
   dig TXT resend._domainkey.iiskills.cloud
   
   # Check SPF record
   dig TXT send.iiskills.cloud
   
   # Check DMARC record
   dig TXT _dmarc.iiskills.cloud
   
   # Check MX record
   dig MX send.iiskills.cloud
   ```

### Expected Results

**DKIM Record:**
```
resend._domainkey.iiskills.cloud. 3600 IN TXT "v=DKIM1; k=rsa; p=..."
```

**SPF Record:**
```
send.iiskills.cloud. 3600 IN TXT "v=spf1 include:amazonses.com ~all"
```

**MX Record:**
```
send.iiskills.cloud. 3600 IN MX 10 feedback-smtp.ap-northeast-1.amazonses.com.
```

**DMARC Record:**
```
_dmarc.iiskills.cloud. 3600 IN TXT "v=DMARC1; p=none; rua=mailto:dmarc@iiskills.cloud"
```

## Step 5: Configure Sending Domain in Code

Once DNS records are verified, update your environment configuration:

### Update `.env.local` (All Apps)

```env
# Email Provider Configuration
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Sender Configuration - Use authenticated domain
SENDER_EMAIL=newsletter@send.iiskills.cloud
SENDER_NAME=Skilling by iiskills.cloud

# Site URL
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
```

**Important:** 
- Use `newsletter@send.iiskills.cloud` as the sender email (with the 'send' subdomain)
- Or verify the root domain and use `newsletter@iiskills.cloud`
- The sender email MUST match your verified domain in Resend

## Step 6: Test Email Sending

After DNS verification, send a test email to confirm everything works:

### Option 1: Using Admin Dashboard

1. Navigate to `https://iiskills.cloud/admin/test-newsletter`
2. Enter a test email address
3. Click **Send Test Email**
4. Check the inbox (and spam folder)
5. Verify:
   - Email arrives in inbox (not spam)
   - From address shows `newsletter@send.iiskills.cloud`
   - Email headers show DKIM/SPF authentication passed

### Option 2: Using API Endpoint

```bash
curl -X POST https://iiskills.cloud/api/newsletter/test-send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email from iiskills.cloud",
    "html": "<h1>Test Email</h1><p>This is a test email from the authenticated domain.</p>"
  }'
```

### Option 3: Using Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Click **Send Email**
3. Fill in:
   - From: `newsletter@send.iiskills.cloud`
   - To: Your test email
   - Subject: Test Email
   - Body: Test content
4. Click **Send**
5. Check email headers for authentication results

### Verify Email Headers

Check these authentication results in email headers:

```
Authentication-Results: 
  dkim=pass header.d=iiskills.cloud
  spf=pass smtp.mailfrom=send.iiskills.cloud
  dmarc=pass
```

All three should show **PASS** for proper authentication.

## Step 7: Monitor and Optimize

### Check Email Deliverability

1. **Resend Analytics** - Monitor open rates, bounce rates, and spam complaints
2. **DMARC Reports** - Review aggregate reports sent to `dmarc@iiskills.cloud`
3. **Sender Reputation** - Use tools like:
   - https://www.senderscore.org
   - https://postmaster.google.com
   - https://sendersupport.olc.protection.outlook.com/snds/

### Best Practices

1. **Start Small** - Send to engaged subscribers first
2. **Warm Up Domain** - Gradually increase sending volume
3. **Monitor Metrics** - Watch bounce rates, spam complaints, and engagement
4. **Clean Lists** - Remove inactive/bouncing email addresses
5. **Authenticate All** - Ensure DKIM, SPF, and DMARC are all passing
6. **Consistent Sending** - Maintain regular sending patterns

### Upgrade DMARC Policy

After 2-4 weeks of monitoring with `p=none`, upgrade to stricter policy:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@iiskills.cloud; pct=100; adkim=r; aspf=r
TTL: 3600
```

## Troubleshooting

### DNS Records Not Showing

**Problem:** DNS records don't appear in lookup tools

**Solutions:**
- Wait longer (can take up to 48 hours)
- Clear DNS cache: `sudo systemd-resolve --flush-caches`
- Check for typos in record names
- Ensure you're adding records to the correct domain
- Verify your DNS provider saved the changes

### DKIM Verification Failed

**Problem:** Resend shows DKIM not verified

**Solutions:**
- Verify DKIM record name: `resend._domainkey` (not `resend._domainkey.iiskills.cloud`)
- Remove quotes from DKIM value if your DNS provider adds them automatically
- Ensure no extra spaces or line breaks in the DKIM key
- Some providers require you to concatenate long TXT records
- Wait for full DNS propagation (24-48 hours)

### Emails Going to Spam

**Problem:** Test emails land in spam folder

**Solutions:**
- Verify all DNS records are passing (DKIM, SPF, DMARC)
- Check sender reputation scores
- Warm up the domain with small batches first
- Ensure email content isn't triggering spam filters
- Add unsubscribe links to all emails
- Avoid spam trigger words in subject lines
- Send to engaged subscribers who've opted in

### SPF Lookup Limit Exceeded

**Problem:** SPF record has too many DNS lookups

**Solutions:**
- Keep SPF simple: `v=spf1 include:amazonses.com ~all`
- Don't add multiple email providers to SPF
- Use subdomain delegation for different services
- Consider using SPF flattening tools

### Wrong Sender Domain

**Problem:** Emails show from incorrect domain

**Solutions:**
- Verify `SENDER_EMAIL` in `.env.local` matches verified domain
- Use `newsletter@send.iiskills.cloud` not `newsletter@iiskills.cloud`
- Restart your Next.js application after changing environment variables
- Clear application cache

## DNS Records Summary

Here's a complete checklist of all records to add:

- [ ] **DKIM Record**
  - Type: TXT
  - Name: `resend._domainkey`
  - Value: (Provided by Resend)

- [ ] **MX Record** 
  - Type: MX
  - Name: `send`
  - Value: `feedback-smtp.ap-northeast-1.amazonses.com`
  - Priority: 10

- [ ] **SPF Record**
  - Type: TXT
  - Name: `send`
  - Value: `v=spf1 include:amazonses.com ~all`

- [ ] **DMARC Record** (Optional)
  - Type: TXT
  - Name: `_dmarc`
  - Value: `v=DMARC1; p=none; rua=mailto:dmarc@iiskills.cloud`

## Verification Checklist

Before going to production:

- [ ] All DNS records added at DNS provider
- [ ] DNS propagation completed (verified with dig/dnschecker)
- [ ] Resend dashboard shows domain as "Verified"
- [ ] Environment variables updated with correct sender email
- [ ] Test email sent successfully
- [ ] Test email received in inbox (not spam)
- [ ] Email headers show DKIM=pass, SPF=pass, DMARC=pass
- [ ] Unsubscribe links working correctly
- [ ] DMARC reports being received (if configured)

## Support and Escalation

### If DNS Setup Issues Persist

1. **Take Screenshots** of:
   - DNS records in your provider's dashboard
   - Resend verification status
   - Error messages from Resend
   - DNS lookup results from dig/dnschecker

2. **Document**:
   - DNS provider name
   - When records were added
   - Current propagation status
   - Error messages encountered

3. **Contact**:
   - **Resend Support**: support@resend.com
   - **DNS Provider Support**: Check your provider's help center
   - **Include**: Domain name, screenshots, and error messages

### Estimated Timeline

- **DNS Record Addition**: 5-15 minutes
- **DNS Propagation**: 5 minutes - 48 hours (usually 1-4 hours)
- **Domain Verification**: Automatic after propagation
- **First Test Email**: 5 minutes after verification
- **Total Time**: 1-48 hours (average: 2-6 hours)

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend Domain Verification](https://resend.com/docs/dashboard/domains/introduction)
- [SPF Record Syntax](https://www.rfc-editor.org/rfc/rfc7208)
- [DKIM Specification](https://www.rfc-editor.org/rfc/rfc6376)
- [DMARC Specification](https://www.rfc-editor.org/rfc/rfc7489)
- [Email Authentication Best Practices](https://support.google.com/a/answer/81126)

## Next Steps

After completing domain authentication:

1. ✅ Test newsletter sending to a small group
2. ✅ Monitor email analytics in Resend dashboard
3. ✅ Set up automated newsletter campaigns
4. ✅ Configure DMARC reporting and monitoring
5. ✅ Gradually increase sending volume
6. ✅ Maintain good sender reputation

---

**Last Updated:** January 2026  
**Maintained By:** iiskills.cloud Development Team  
**Questions?** Contact: admin@iiskills.cloud
