# Schema v2 Quick Reference

## 🚀 For Developers: Using the New Schema

This quick reference shows you how to use the new schema v2 tables and functions in your learning apps.

---

## 📊 Track User Progress

### Save Progress

```typescript
const { error } = await supabase
  .from('user_progress')
  .upsert({
    user_id: user.id,
    app_subdomain: 'learn-ai', // your app's subdomain
    content_type: 'course',     // course, module, lesson, quiz
    content_id: courseId,
    content_slug: courseSlug,
    progress_percentage: 75,
    status: 'in_progress',      // not_started, in_progress, completed, abandoned
    time_spent_seconds: 3600
  });
```

### Get User's Progress

```typescript
const { data: progress } = await supabase
  .from('user_progress')
  .select('*')
  .eq('user_id', user.id)
  .eq('app_subdomain', 'learn-ai')
  .order('last_accessed_at', { ascending: false });
```

### Get Progress Summary

```typescript
const { data: summary } = await supabase
  .rpc('get_user_progress_summary', { 
    p_app_subdomain: 'learn-ai' // or null for all apps
  });

// Returns: [{ app, total_items, completed_items, in_progress_items, total_time_seconds, completion_percentage }]
```

---

## 🔒 Check Subscription Access

### Check if User Has Access

```typescript
const { data: hasAccess } = await supabase
  .rpc('has_active_subscription', { 
    p_app_subdomain: 'learn-ai' 
  });

if (!hasAccess) {
  // Show paywall or redirect to pricing
  router.push('/pricing');
}
```

### Create Subscription (Admin/Backend Only)

```typescript
const { error } = await supabase
  .from('subscriptions')
  .insert({
    user_id: userId,
    app_subdomain: 'learn-ai',  // or null for platform-wide
    plan_type: 'yearly',         // free, monthly, yearly, lifetime
    status: 'active',
    starts_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 99.99,
    currency: 'USD',
    payment_provider: 'stripe',
    payment_id: stripePaymentId
  });
```

---

## 🎓 Issue Certificates

### Generate and Issue Certificate

```typescript
// Generate unique certificate number
const { data: certNumber } = await supabase
  .rpc('generate_certificate_number', { 
    p_app_subdomain: 'learn-ai' 
  });

// Generate verification code
const { data: verifyCode } = await supabase
  .rpc('generate_verification_code');

// Create certificate
const { data: cert, error } = await supabase
  .from('certificates')
  .insert({
    certificate_number: certNumber,
    user_id: user.id,
    app_subdomain: 'learn-ai',
    course_id: courseId,
    course_title: 'AI Fundamentals',
    user_name: user.full_name,
    completion_date: new Date().toISOString().split('T')[0],
    verification_code: verifyCode,
    status: 'active'
  })
  .select()
  .single();

// Generate PDF and update URL
// (implement your PDF generation logic)
const pdfUrl = await generateCertificatePDF(cert);

await supabase
  .from('certificates')
  .update({ pdf_url: pdfUrl })
  .eq('id', cert.id);
```

### Get User's Certificates

```typescript
const { data: certificates } = await supabase
  .from('certificates')
  .select('*')
  .eq('user_id', user.id)
  .eq('app_subdomain', 'learn-ai')
  .order('issue_date', { ascending: false });
```

### Verify Certificate (Public)

```typescript
const { data: cert } = await supabase
  .from('certificates')
  .select('*')
  .eq('verification_code', inputCode)
  .eq('status', 'active')
  .single();

if (cert) {
  console.log('Valid certificate:', cert);
} else {
  console.log('Invalid or revoked certificate');
}
```

---

## 📈 Track Analytics

### Log Events

```typescript
const { error } = await supabase
  .from('analytics_events')
  .insert({
    user_id: user?.id,  // nullable for anonymous users
    app_subdomain: 'learn-ai',
    event_type: 'page_view',
    event_category: 'engagement',
    event_data: {
      page: '/courses/ai-fundamentals',
      referrer: document.referrer
    },
    session_id: sessionId,
    user_agent: navigator.userAgent
  });
```

### Common Event Types

```typescript
// Page views
event_type: 'page_view'

// Video engagement
event_type: 'video_started' | 'video_completed' | 'video_paused'
event_data: { video_id, duration_watched, total_duration }

// Quiz/assessment
event_type: 'quiz_started' | 'quiz_completed'
event_data: { quiz_id, score, total_questions }

// Course enrollment
event_type: 'course_enrolled'
event_data: { course_id, course_title }

// Download
event_type: 'resource_downloaded'
event_data: { resource_id, resource_type }
```

---

## 📚 Access Content Library

### Get Shared Content

```typescript
const { data: content } = await supabase
  .from('content_library')
  .select('*')
  .or('is_public.eq.true,allowed_apps.cs.{learn-ai}')
  .eq('content_type', 'video')
  .order('access_count', { ascending: false });
```

### Track Content Access

```typescript
await supabase
  .rpc('increment_content_access_count', { 
    p_content_id: contentId 
  });
```

---

## 🎨 Get App Configuration

### Get App Details

```typescript
const { data: app } = await supabase
  .from('apps')
  .select('*')
  .eq('subdomain', 'learn-ai')
  .single();

// Access features
const hasCertificates = app.features.certificates;
const hasPaywall = app.features.paywall;

// Access theme
const primaryColor = app.theme_colors?.primary;
```

### List All Active Apps

```typescript
const { data: apps } = await supabase
  .from('apps')
  .select('*')
  .eq('status', 'active')
  .order('display_name');
```

---

## 👤 Update User Profile

### Track Last Visited App

```typescript
const { error } = await supabase
  .from('profiles')
  .update({
    last_visited_app: 'learn-ai',
    last_visited_at: new Date().toISOString(),
    app_preferences: {
      ...existingPreferences,
      'learn-ai': {
        theme: 'dark',
        notifications: true
      }
    }
  })
  .eq('id', user.id);
```

---

## 🔧 Utility Functions

### Check Admin Status

```typescript
const { data: isAdmin } = await supabase
  .rpc('is_admin');

if (isAdmin) {
  // Show admin features
}
```

---

## 📱 Example: Complete Learning Flow

```typescript
// 1. User starts a course
async function startCourse(courseId: string, courseSlug: string) {
  const { error } = await supabase
    .from('user_progress')
    .insert({
      user_id: user.id,
      app_subdomain: 'learn-ai',
      content_type: 'course',
      content_id: courseId,
      content_slug: courseSlug,
      status: 'in_progress',
      progress_percentage: 0
    });
  
  // Track analytics
  await supabase.from('analytics_events').insert({
    user_id: user.id,
    app_subdomain: 'learn-ai',
    event_type: 'course_started',
    event_data: { course_id: courseId }
  });
}

// 2. Update progress as user learns
async function updateProgress(courseId: string, percentage: number, timeSpent: number) {
  await supabase
    .from('user_progress')
    .update({
      progress_percentage: percentage,
      time_spent_seconds: timeSpent,
      last_accessed_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('content_id', courseId);
}

// 3. Mark as completed and issue certificate
async function completeCourse(courseId: string, courseTitle: string) {
  // Update progress
  await supabase
    .from('user_progress')
    .update({
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString()
    })
    .eq('user_id', user.id)
    .eq('content_id', courseId);
  
  // Issue certificate
  const { data: certNumber } = await supabase
    .rpc('generate_certificate_number', { p_app_subdomain: 'learn-ai' });
  
  const { data: verifyCode } = await supabase
    .rpc('generate_verification_code');
  
  const { data: cert } = await supabase
    .from('certificates')
    .insert({
      certificate_number: certNumber,
      user_id: user.id,
      app_subdomain: 'learn-ai',
      course_title: courseTitle,
      user_name: user.full_name,
      completion_date: new Date().toISOString().split('T')[0],
      verification_code: verifyCode
    })
    .select()
    .single();
  
  // Track analytics
  await supabase.from('analytics_events').insert({
    user_id: user.id,
    app_subdomain: 'learn-ai',
    event_type: 'course_completed',
    event_data: { 
      course_id: courseId,
      certificate_id: cert.id
    }
  });
  
  return cert;
}
```

---

## 🎯 Best Practices

1. **Always use app_subdomain** - Ensures data is properly scoped to your app
2. **Use upsert for progress** - Prevents duplicate entries
3. **Track time consistently** - Use seconds for all time tracking
4. **Log analytics asynchronously** - Don't block user actions
5. **Verify subscriptions** - Always check before showing premium content
6. **Generate unique codes** - Use helper functions for certificate numbers and verification codes

---

## 🔍 Common Queries

### Get User Dashboard Data

```typescript
const { data: summary } = await supabase
  .rpc('get_user_progress_summary', { p_app_subdomain: null });

const { data: certificates } = await supabase
  .from('certificates')
  .select('*')
  .eq('user_id', user.id)
  .order('issue_date', { ascending: false })
  .limit(5);

const { data: subscription } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', user.id)
  .eq('status', 'active')
  .order('created_at', { ascending: false })
  .limit(1)
  .single();
```

### Get Popular Courses

```typescript
const { data: courses } = await supabase
  .from('courses')
  .select('*')
  .eq('subdomain', 'learn-ai')
  .eq('status', 'published')
  .order('enrollment_count', { ascending: false })
  .limit(10);
```

---

**Last Updated:** 2026-01-26  
**Schema Version:** 2.0
