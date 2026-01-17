# Resend DNS Configuration - Quick Reference

## DNS Records to Add

Copy these exact records to your DNS provider for `iiskills.cloud`:

### 1. DKIM Verification (TXT Record)
```
Type:     TXT
Name:     resend._domainkey
Value:    [Get from Resend Dashboard → Domains → iiskills.cloud]
TTL:      3600 (or Auto)
```

### 2. MX Record for Bounce Handling
```
Type:     MX
Name:     send
Value:    feedback-smtp.ap-northeast-1.amazonses.com
Priority: 10
TTL:      3600
```

### 3. SPF Authentication (TXT Record)
```
Type:     TXT
Name:     send
Value:    v=spf1 include:amazonses.com ~all
TTL:      3600
```

### 4. DMARC Policy (TXT Record) - Optional but Recommended
```
Type:     TXT
Name:     _dmarc
Value:    v=DMARC1; p=none; rua=mailto:dmarc@iiskills.cloud
TTL:      3600
```

## Quick Verification Commands

```bash
# Check DKIM
dig TXT resend._domainkey.iiskills.cloud +short

# Check SPF
dig TXT send.iiskills.cloud +short

# Check MX
dig MX send.iiskills.cloud +short

# Check DMARC
dig TXT _dmarc.iiskills.cloud +short
```

## Environment Variables to Update

After DNS verification, update `.env.local`:

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=newsletter@send.iiskills.cloud
SENDER_NAME=Skilling by iiskills.cloud
```

## Quick Test

Send a test email from Resend dashboard or use:

```bash
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "newsletter@send.iiskills.cloud",
    "to": "test@example.com",
    "subject": "Domain Authentication Test",
    "html": "<p>This email confirms domain authentication is working!</p>"
  }'
```

## Checklist

- [ ] Added DKIM record
- [ ] Added MX record  
- [ ] Added SPF record
- [ ] Added DMARC record (optional)
- [ ] Waited for DNS propagation (1-48 hours)
- [ ] Verified in Resend dashboard (status = "Verified")
- [ ] Updated environment variables
- [ ] Sent test email
- [ ] Verified email in inbox (not spam)
- [ ] Checked email headers (DKIM/SPF/DMARC all pass)

## Need Help?

See full documentation: [RESEND_DOMAIN_SETUP.md](RESEND_DOMAIN_SETUP.md)
