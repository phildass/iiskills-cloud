# GO-LIVE Incident Response Playbook

**Date**: February 19, 2026  
**Document Version**: 1.0  
**Audience**: DevOps, Security, Management  
**Status**: ✅ **PRODUCTION READY**

---

## Executive Summary

This playbook defines procedures for identifying, responding to, and recovering from production incidents in the iiskills-cloud platform. It provides step-by-step guidance for common incident scenarios and establishes communication protocols.

---

## Table of Contents

1. [Incident Classification](#1-incident-classification)
2. [Incident Response Team](#2-incident-response-team)
3. [General Incident Response Process](#3-general-incident-response-process)
4. [Security Incident Response](#4-security-incident-response)
5. [Availability Incident Response](#5-availability-incident-response)
6. [Data Incident Response](#6-data-incident-response)
7. [Payment System Incident Response](#7-payment-system-incident-response)
8. [Communication Protocols](#8-communication-protocols)
9. [Post-Incident Review](#9-post-incident-review)
10. [Incident Response Checklists](#10-incident-response-checklists)

---

## 1. Incident Classification

### 1.1 Severity Levels

| Severity | Impact | Response Time | Examples |
|----------|--------|---------------|----------|
| **P0 - Critical** | Complete service unavailability or data breach | Immediate | Site down, database compromised, payment data exposed |
| **P1 - High** | Major feature broken, significant user impact | 15 minutes | Authentication broken, payment processing down, major app down |
| **P2 - Medium** | Minor feature broken, limited user impact | 1 hour | Single app issue, UI bug, email delivery issues |
| **P3 - Low** | Cosmetic issue, minimal user impact | 4 hours | Minor UI glitch, performance degradation |

### 1.2 Incident Types

**Availability Incidents**:
- Site completely down
- Multiple apps unavailable
- Database unreachable
- Critical feature non-functional

**Security Incidents**:
- Data breach or suspected breach
- Unauthorized access
- DDoS attack
- Credential compromise
- Malware detection

**Data Incidents**:
- Data loss
- Data corruption
- Incorrect data processing
- Migration failures

**Performance Incidents**:
- Severe performance degradation
- Timeout errors
- Resource exhaustion

**Third-Party Incidents**:
- Supabase outage
- Razorpay issues
- SendGrid problems
- CDN/DNS issues

---

## 2. Incident Response Team

### 2.1 Core Team Roles

**Incident Commander** (DevOps Lead):
- Overall incident coordination
- Decision making authority
- Resource allocation
- Communication coordination

**Technical Lead** (Senior Engineer):
- Technical investigation
- Solution implementation
- Rollback decisions
- Technical communication

**Communication Lead** (Support/Marketing):
- User communication
- Status updates
- Stakeholder notifications
- Social media management

**Security Lead** (Security Team):
- Security assessment
- Threat analysis
- Security remediation
- Compliance reporting

### 2.2 Contact Information

**Primary Contacts**:
- Incident Commander: devops-lead@iiskills.in / [Phone]
- Technical Lead: tech@iiskills.in / [Phone]
- Communication Lead: support@iiskills.in / [Phone]
- Security Lead: security@iiskills.in / [Phone]

**Escalation**:
- Management: management@iiskills.in / [Phone]
- Emergency Hotline: [24/7 On-call Number]

**Communication Channels**:
- Slack: #incident-response
- Email: incidents@iiskills.in
- Phone: Emergency hotline

---

## 3. General Incident Response Process

### 3.1 Detection Phase

**How incidents are detected**:
- Automated monitoring alerts
- User reports
- Team member observation
- Third-party notifications

**Initial Actions**:
1. Acknowledge detection immediately
2. Create incident ticket/thread
3. Assess initial severity
4. Alert appropriate team members

### 3.2 Response Phase

**Step 1: Assess (2 minutes)**

```
Incident Commander Actions:
- Confirm incident is real
- Classify severity (P0-P3)
- Identify affected systems
- Assemble response team
- Create incident log
```

**Step 2: Communicate (3 minutes)**

```
Communication Lead Actions:
- Post internal notification (Slack)
- Update status page (if external)
- Notify management (P0/P1)
- Start incident log
```

**Step 3: Investigate (5-15 minutes)**

```
Technical Lead Actions:
- Access affected systems
- Review logs and metrics
- Identify root cause
- Determine impact scope
- Document findings in real-time
```

**Step 4: Mitigate (10-30 minutes)**

```
Technical Team Actions:
- Implement immediate fix OR
- Execute rollback plan OR
- Implement workaround
- Verify mitigation successful
- Monitor for stability
```

**Step 5: Verify (5-10 minutes)**

```
Team Actions:
- Test affected functionality
- Confirm services restored
- Check metrics/logs normal
- Verify user experience
- Document resolution
```

### 3.3 Recovery Phase

**Step 6: Monitor (1-24 hours)**

```
DevOps Actions:
- Continuous monitoring
- Watch for recurrence
- Track key metrics
- Document any issues
```

**Step 7: Communicate Resolution**

```
Communication Lead Actions:
- Internal notification: "Incident resolved"
- External notification: "Services restored"
- Update status page
- Thank team for response
```

### 3.4 Post-Incident Phase

**Step 8: Post-Mortem (Within 24-48 hours)**

```
Team Actions:
- Schedule post-mortem meeting
- Document timeline
- Identify root cause
- Create action items
- Update procedures
- See Section 9 for details
```

---

## 4. Security Incident Response

### 4.1 Security Incident Detection

**Indicators of Compromise (IoC)**:
- Unusual login patterns
- Unexpected database queries
- Unauthorized access attempts
- Data exfiltration signs
- Malware alerts
- Credential leaks

**Immediate Actions**:

```bash
# DO NOT make changes before documenting!
# Document everything you observe

# 1. Take screenshots
# 2. Save log files
# 3. Note timestamps
# 4. Document affected systems
```

### 4.2 Security Incident Response Steps

**Step 1: Contain (Immediate)**

```bash
# Isolate affected systems
pm2 stop [affected-app]

# If credential compromise suspected:
# - Rotate ALL credentials immediately
# - See GO_LIVE_CREDENTIAL_ROTATION_CONFIRMATION.md

# If data breach suspected:
# - DO NOT delete evidence
# - Document current state
# - Contact security team immediately
```

**Step 2: Assess (15 minutes)**

```
Security Lead Actions:
- Determine type of incident
- Assess scope of compromise
- Identify affected data/systems
- Evaluate risk level
- Determine regulatory requirements (GDPR, etc.)
```

**Step 3: Eradicate (30-60 minutes)**

```
Technical Actions:
- Remove malware/backdoors
- Rotate compromised credentials
- Patch vulnerabilities
- Update access controls
- Verify no persistent threats
```

**Step 4: Recover (1-2 hours)**

```
Recovery Actions:
- Restore systems from clean backup (if needed)
- Verify integrity of restored data
- Implement enhanced monitoring
- Gradually restore services
- Verify security controls
```

**Step 5: Notify (As required)**

```
Legal/Compliance Actions:
- Determine notification requirements
- GDPR: Within 72 hours if personal data affected
- User notification (if credentials compromised)
- Regulatory authorities (if required)
- Law enforcement (if criminal activity)
```

### 4.3 Security Incident Checklist

**Data Breach Response**:

- [ ] Contain breach immediately
- [ ] Document scope of data affected
- [ ] Preserve evidence
- [ ] Notify security team
- [ ] Assess regulatory requirements
- [ ] Rotate all credentials
- [ ] Notify affected users (if required)
- [ ] Notify authorities (if required)
- [ ] Implement additional security measures
- [ ] Conduct full security audit
- [ ] Update security procedures

**Credential Compromise**:

- [ ] Identify compromised credentials
- [ ] Rotate compromised credentials immediately
- [ ] Audit for unauthorized access
- [ ] Review access logs
- [ ] Terminate active sessions
- [ ] Notify affected users
- [ ] Implement additional authentication
- [ ] Update credential management procedures

**DDoS Attack**:

- [ ] Confirm DDoS attack
- [ ] Enable DDoS protection (CloudFlare, etc.)
- [ ] Contact hosting provider
- [ ] Implement rate limiting
- [ ] Monitor traffic patterns
- [ ] Document attack characteristics
- [ ] Consider permanent DDoS protection

---

## 5. Availability Incident Response

### 5.1 Complete Site Down

**Symptoms**:
- All apps returning 502/503 errors
- No apps responding
- Users cannot access any service

**Response Steps**:

```bash
# Step 1: Quick diagnostics (30 seconds)
pm2 status
curl -I https://iiskills.cloud

# Step 2: Attempt quick restart (1 minute)
pm2 restart all
sleep 10
curl -I https://iiskills.cloud

# Step 3: If not resolved, check infrastructure (2 minutes)
sudo systemctl status nginx
df -h  # Check disk space
free -h  # Check memory

# Step 4: Check logs (2 minutes)
pm2 logs --err --lines 100
sudo tail -100 /var/log/nginx/error.log

# Step 5: If still down, initiate rollback (5 minutes)
# See GO_LIVE_OPERATIONS_RUNBOOK.md Section 3.2
```

### 5.2 Single App Down

**Symptoms**:
- One specific app not responding
- Other apps working fine

**Response Steps**:

```bash
# Step 1: Identify affected app
pm2 status

# Step 2: Check logs for that app
pm2 logs [app-name] --err --lines 50

# Step 3: Restart specific app
pm2 restart [app-name]

# Step 4: Monitor for 5 minutes
pm2 logs [app-name] --lines 20

# Step 5: If recurring, investigate root cause
# Check for memory leaks, database issues, etc.
```

### 5.3 Database Unavailable

**Symptoms**:
- "Cannot connect to database" errors
- All apps affected
- Authentication fails

**Response Steps**:

```bash
# Step 1: Check Supabase status
# Visit https://status.supabase.com

# Step 2: Test database connectivity
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/health_check" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY"

# Step 3: If Supabase down
# - Contact Supabase support immediately
# - Post status update for users
# - Monitor Supabase status page
# - No action we can take on our side

# Step 4: If credentials issue
# - Verify credentials in .env.production
# - Check Supabase dashboard for key status
# - Regenerate keys if needed
# - Restart applications
```

---

## 6. Data Incident Response

### 6.1 Data Loss

**Symptoms**:
- Data missing from database
- User reports lost data
- Tables empty or corrupted

**Response Steps**:

```bash
# STOP - Do not make any changes!
# Data loss is critical and requires careful handling

# Step 1: Document (2 minutes)
# - What data is missing?
# - When was it last seen?
# - How was loss discovered?
# - Take screenshots

# Step 2: Assess (5 minutes)
# - Check database directly (Supabase dashboard)
# - Verify it's actual loss, not access issue
# - Determine scope (how much data?)

# Step 3: Prevent further loss (Immediate)
# - Stop all write operations if needed
pm2 stop all

# Step 4: Contact senior engineer
# DO NOT attempt recovery without consultation!

# Step 5: Restore from backup (With approval)
# - Identify most recent good backup
# - Restore to staging first
# - Verify integrity
# - Then restore to production
```

### 6.2 Data Corruption

**Symptoms**:
- Data exists but incorrect
- Unexpected values in database
- Calculation errors

**Response Steps**:

```
# Step 1: Isolate (Immediate)
# - Identify affected data
# - Determine when corruption started
# - Stop processes that might corrupt more data

# Step 2: Assess impact (10 minutes)
# - How many records affected?
# - Is it still spreading?
# - What caused it?

# Step 3: Fix (30-60 minutes)
# - Create SQL script to fix data
# - Test on staging first!
# - Apply to production
# - Verify fix successful

# Step 4: Prevent recurrence
# - Fix bug that caused corruption
# - Add validation to prevent future corruption
# - Enhance monitoring
```

---

## 7. Payment System Incident Response

### 7.1 Payment Processing Down

**Symptoms**:
- Users cannot complete payments
- Razorpay checkout fails
- Payment confirmations not processing

**Response Steps**:

```bash
# Step 1: Check Razorpay status (1 minute)
# Visit https://status.razorpay.com
# Check Razorpay dashboard

# Step 2: If Razorpay down
# - Post status update
# - No action on our side
# - Monitor Razorpay status

# Step 3: If credentials issue (5 minutes)
# - Verify Razorpay keys in .env.production
# - Check key status in Razorpay dashboard
# - Regenerate if needed
# - Restart applications

# Step 4: If webhook issue (10 minutes)
# - Check webhook URL accessible
curl https://learn-ai.iiskills.cloud/api/payment/webhook
# - Verify webhook secret correct
# - Check webhook logs in Razorpay dashboard
# - Manually process pending payments if needed
```

### 7.2 Incorrect Payment Processing

**Symptoms**:
- Wrong amount charged
- Access not granted after payment
- Duplicate charges

**Response Steps**:

```
# Step 1: Immediate containment
# - If wrong amounts being charged: STOP payment processing
pm2 stop learn-ai learn-developer learn-management learn-pr

# Step 2: Document issue (5 minutes)
# - Collect affected payment IDs
# - Document expected vs actual behavior
# - Screenshot evidence

# Step 3: User impact assessment (10 minutes)
# - How many users affected?
# - What is financial impact?
# - Any refunds needed?

# Step 4: Fix issue (30 minutes)
# - Identify bug
# - Deploy fix to staging
# - Test thoroughly
# - Deploy to production

# Step 5: Remediation (Hours/Days)
# - Process refunds for affected users
# - Grant correct access
# - Notify affected users
# - Document lessons learned
```

### 7.3 Bundle Logic Failure

**Symptoms**:
- Purchasing learn-ai doesn't unlock learn-developer
- Bundle access not granted correctly

**Response Steps**:

```bash
# Step 1: Verify issue (5 minutes)
# - Check specific user's access records
# - Query database: user_app_access table
# - Verify payment record shows bundle

# Step 2: Manual fix for affected users (10 minutes)
# - Use admin panel to grant missing access
# - Or run SQL to fix access records
# - Verify user can access both apps

# Step 3: Fix code bug (30 minutes)
# - Identify bug in bundle logic
# - Fix in packages/access-control
# - Test thoroughly
# - Deploy fix

# Step 4: Audit for other affected users
# - Query database for similar cases
# - Fix all affected users
# - Send apology email if needed
```

---

## 8. Communication Protocols

### 8.1 Internal Communication

**Slack Protocol**:

```
#incident-response channel

Initial Alert:
🚨 INCIDENT DETECTED
Severity: [P0/P1/P2/P3]
Type: [Availability/Security/Data/Payment]
Description: [Brief description]
Affected: [Systems/users affected]
Incident Commander: @devops-lead
Status: INVESTIGATING

Updates (every 15-30 minutes):
⏰ UPDATE: [Timestamp]
Status: [Investigating/Mitigating/Resolved]
Progress: [What we've done]
Next steps: [What's next]
ETA: [If known]

Resolution:
✅ RESOLVED: [Timestamp]
Duration: [Total time]
Root Cause: [Brief explanation]
Post-Mortem: [Scheduled for...]
```

### 8.2 User Communication

**Status Page Updates**:

```
Initial Notice (P0/P1 only):
Title: "Service Disruption - [Feature/App]"
Status: Investigating
Message: "We are aware of issues affecting [feature]. 
Our team is investigating and will provide updates."
Time: [Timestamp]

Progress Update (every 30 minutes):
Status: Identified/Monitoring
Message: "We have identified the issue and are working 
on a fix. Expected resolution: [time if known]"
Time: [Timestamp]

Resolution:
Status: Resolved
Message: "The issue has been resolved. All services are 
now operating normally. We apologize for the inconvenience."
Time: [Timestamp]
```

**Email Template (for significant incidents)**:

```
Subject: iiskills.cloud Service Update - [Date]

Dear iiskills users,

We want to inform you about a service issue that 
affected our platform on [date/time].

What happened:
[Brief description]

Impact:
[What users experienced]

Resolution:
[What we did to fix it]

Prevention:
[Steps we're taking to prevent recurrence]

We sincerely apologize for any inconvenience caused.

Best regards,
The iiskills Team
```

### 8.3 Management Communication

**Executive Summary Template**:

```
INCIDENT SUMMARY
================
Incident ID: INC-[YYYYMMDD-number]
Date: [Date]
Severity: [P0/P1/P2/P3]
Duration: [X hours/minutes]

IMPACT:
- Users affected: [Number/%]
- Services affected: [List]
- Financial impact: [If any]
- Reputation impact: [Assessment]

ROOT CAUSE:
[Technical explanation]

RESOLUTION:
[What was done]

PREVENTION:
- Immediate: [Actions taken]
- Short-term: [Actions planned]
- Long-term: [Process improvements]

LESSONS LEARNED:
[Key takeaways]
```

---

## 9. Post-Incident Review

### 9.1 Post-Mortem Meeting

**Schedule**: Within 24-48 hours of incident resolution

**Attendees**:
- Incident Response Team
- Relevant engineers
- Management (for P0/P1)

**Agenda**:
1. Timeline review (10 min)
2. Root cause analysis (15 min)
3. Response effectiveness (10 min)
4. Action items (15 min)
5. Process improvements (10 min)

### 9.2 Post-Mortem Document

**Template**:

```markdown
# Incident Post-Mortem: [Title]

**Date**: [Date]
**Severity**: [P0/P1/P2/P3]
**Duration**: [X hours/minutes]
**Impact**: [Brief description]

## Summary

[2-3 sentence summary of what happened]

## Timeline

[List chronological events]
- 14:00 - Incident detected
- 14:02 - Team alerted
- 14:05 - Root cause identified
- 14:15 - Fix deployed
- 14:20 - Incident resolved

## Root Cause

[Detailed technical explanation]

## Resolution

[What was done to fix it]

## Impact Assessment

- Users affected: [Number]
- Downtime: [Duration]
- Data loss: [Yes/No, details]
- Financial impact: [If any]

## What Went Well

- [Things that worked]

## What Went Wrong

- [Things that didn't work]

## Action Items

- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

## Lessons Learned

[Key takeaways and improvements]
```

---

## 10. Incident Response Checklists

### 10.1 P0 - Critical Incident Checklist

**Detection (Immediate)**:
- [ ] Confirm incident is real and critical
- [ ] Alert entire incident response team
- [ ] Create incident log/ticket
- [ ] Start timer for response time

**Assessment (2 minutes)**:
- [ ] Classify severity as P0
- [ ] Identify affected systems
- [ ] Estimate user impact
- [ ] Assign Incident Commander

**Communication (3 minutes)**:
- [ ] Post to #incident-response channel
- [ ] Notify management
- [ ] Update status page (if external issue)
- [ ] Start incident log document

**Investigation (5 minutes)**:
- [ ] Access affected systems
- [ ] Review logs
- [ ] Check monitoring dashboards
- [ ] Identify root cause
- [ ] Document findings

**Mitigation (10-30 minutes)**:
- [ ] Implement fix OR rollback OR workaround
- [ ] Verify mitigation successful
- [ ] Test affected functionality
- [ ] Monitor for stability

**Recovery (30 minutes)**:
- [ ] Confirm all services restored
- [ ] Monitor metrics and logs
- [ ] Update status page: "Resolved"
- [ ] Notify management of resolution
- [ ] Post resolution to #incident-response

**Post-Incident (24-48 hours)**:
- [ ] Schedule post-mortem meeting
- [ ] Write post-mortem document
- [ ] Create action items
- [ ] Update procedures
- [ ] Brief team on lessons learned

### 10.2 P1 - High Severity Checklist

**Detection (Immediate)**:
- [ ] Confirm incident
- [ ] Alert incident response team
- [ ] Create incident ticket

**Assessment (5 minutes)**:
- [ ] Classify as P1
- [ ] Identify affected feature
- [ ] Estimate impact

**Communication (10 minutes)**:
- [ ] Post to #incident-response
- [ ] Notify relevant stakeholders

**Investigation (15 minutes)**:
- [ ] Access systems
- [ ] Review logs
- [ ] Identify root cause

**Mitigation (30-60 minutes)**:
- [ ] Implement fix
- [ ] Test thoroughly
- [ ] Deploy to production
- [ ] Verify resolution

**Post-Incident (48 hours)**:
- [ ] Write incident summary
- [ ] Document lessons learned
- [ ] Update procedures if needed

### 10.3 Security Incident Checklist

**Detection**:
- [ ] Confirm security incident
- [ ] Alert security team immediately
- [ ] Do NOT modify affected systems yet

**Containment (Immediate)**:
- [ ] Isolate affected systems
- [ ] Preserve evidence
- [ ] Document current state
- [ ] Stop spread of compromise

**Assessment (15 minutes)**:
- [ ] Determine type of incident
- [ ] Assess scope
- [ ] Identify affected data
- [ ] Evaluate regulatory requirements

**Eradication (30-60 minutes)**:
- [ ] Remove threats
- [ ] Rotate credentials
- [ ] Patch vulnerabilities
- [ ] Update access controls

**Recovery (1-2 hours)**:
- [ ] Restore from clean backup (if needed)
- [ ] Verify integrity
- [ ] Implement enhanced monitoring
- [ ] Gradually restore services

**Notification (As required)**:
- [ ] Assess notification requirements
- [ ] Notify regulatory authorities (if required)
- [ ] Notify affected users (if required)
- [ ] Document all notifications

**Post-Incident**:
- [ ] Conduct security audit
- [ ] Update security procedures
- [ ] Implement additional controls
- [ ] Train team on lessons learned

---

## 11. Appendices

### Appendix A: Incident Log Template

```
INCIDENT LOG
============
Incident ID: INC-[YYYYMMDD-###]
Severity: [P0/P1/P2/P3]
Type: [Availability/Security/Data/Payment]
Start Time: [Timestamp]
End Time: [Timestamp]
Duration: [Minutes/Hours]

TIMELINE:
---------
[HH:MM] - [Event description]
[HH:MM] - [Event description]
...

PEOPLE INVOLVED:
----------------
- Incident Commander: [Name]
- Technical Lead: [Name]
- Other responders: [Names]

SYSTEMS AFFECTED:
-----------------
- [List of apps/services]

USER IMPACT:
------------
- Users affected: [Number/%]
- Features impacted: [List]

ROOT CAUSE:
-----------
[Description]

RESOLUTION:
-----------
[What was done]

ACTION ITEMS:
-------------
- [ ] [Action] - Owner - Due date
```

### Appendix B: Escalation Flowchart

```
Incident Detected
      ↓
 Assess Severity
      ↓
    ┌─┴─┐
    ↓   ↓
   P0/P1  P2/P3
    ↓      ↓
 Alert    Alert
 All      Team
 Team     Only
    ↓      ↓
Notify   Handle
Mgmt     Normally
    ↓      ↓
    └─┬──┘
      ↓
  Investigate
      ↓
   Mitigate
      ↓
  Not Resolved
  After 30min?
      ↓
   Escalate
      ↓
  Technical
    Lead
      ↓
  Not Resolved
  After 1hr?
      ↓
   Escalate
      ↓
  Management
```

### Appendix C: Contact Card

```
╔══════════════════════════════════════╗
║   IISKILLS INCIDENT RESPONSE         ║
║   QUICK REFERENCE CARD               ║
╠══════════════════════════════════════╣
║ INCIDENT HOTLINE: [Phone]            ║
║ SLACK: #incident-response            ║
║ EMAIL: incidents@iiskills.in         ║
╠══════════════════════════════════════╣
║ DEVOPS LEAD: [Phone]                 ║
║ TECHNICAL LEAD: [Phone]              ║
║ SECURITY LEAD: [Phone]               ║
╠══════════════════════════════════════╣
║ SUPABASE SUPPORT:                    ║
║ https://supabase.com/support         ║
║                                      ║
║ RAZORPAY SUPPORT:                    ║
║ support@razorpay.com                 ║
╚══════════════════════════════════════╝
```

---

**Document Status**: ✅ FINAL - PRODUCTION READY  
**Distribution**: All engineering, DevOps, security, management  
**Next Review**: Quarterly or after major incidents

---

**END OF INCIDENT RESPONSE PLAYBOOK**
