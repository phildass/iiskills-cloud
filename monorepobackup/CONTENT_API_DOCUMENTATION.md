# Unified Content API Documentation

## Overview

The Unified Content API provides a consistent interface to access all educational content stored in Supabase across all learn-apps. All endpoints are RESTful and return JSON responses.

## Base URL

```
/api/content/
```

## Authentication

Currently, all content endpoints are publicly accessible (matching the platform's public access mode). When authentication is re-enabled, requests will require a valid session token.

## Endpoints

### 1. Courses

**GET** `/api/content/courses`

Fetch courses with filtering and pagination.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `subdomain` | string | - | Filter by app subdomain (e.g., 'learn-math') |
| `category` | string | - | Filter by category (e.g., 'Mathematics') |
| `status` | string | 'published' | Filter by status (draft/published/archived) |
| `is_free` | boolean | - | Filter by free/paid courses |
| `limit` | number | 50 | Number of results to return |
| `offset` | number | 0 | Offset for pagination |
| `include_modules` | boolean | false | Include modules in response |

#### Example Request

```bash
curl "/api/content/courses?subdomain=learn-math&include_modules=true&limit=10"
```

#### Example Response

```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Advanced Mathematics",
      "slug": "advanced-mathematics",
      "short_description": "Master advanced math concepts",
      "category": "Mathematics",
      "subdomain": "learn-math",
      "price": 4999,
      "is_free": false,
      "status": "published",
      "modules": [
        {
          "id": "uuid",
          "title": "Calculus I",
          "slug": "calculus-1",
          "order_index": 0
        }
      ]
    }
  ],
  "total": 15,
  "limit": 10,
  "offset": 0
}
```

---

### 2. Modules

**GET** `/api/content/modules`

Fetch modules for a specific course.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `course_id` | UUID | Yes* | Course UUID |
| `course_slug` | string | Yes* | Course slug (alternative to course_id) |
| `include_lessons` | boolean | No | Include lessons in response |
| `is_published` | boolean | Yes | Filter published/draft modules |

*Either `course_id` or `course_slug` must be provided.

#### Example Request

```bash
curl "/api/content/modules?course_slug=advanced-mathematics&include_lessons=true"
```

#### Example Response

```json
{
  "modules": [
    {
      "id": "uuid",
      "course_id": "uuid",
      "title": "Calculus I",
      "slug": "calculus-1",
      "description": "Introduction to calculus",
      "order_index": 0,
      "lessons": [
        {
          "id": "uuid",
          "title": "Limits and Continuity",
          "slug": "limits-continuity",
          "content_type": "text",
          "order_index": 0
        }
      ]
    }
  ],
  "course_id": "uuid"
}
```

---

### 3. Lessons

**GET** `/api/content/lessons`

Fetch lessons for a specific module.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `module_id` | UUID | Yes* | Module UUID |
| `module_slug` | string | Yes* | Module slug (alternative to module_id) |
| `content_type` | string | No | Filter by content type (text/video/audio/quiz) |
| `is_published` | boolean | Yes | Filter published/draft lessons |
| `include_questions` | boolean | No | Include quiz questions |

*Either `module_id` or `module_slug` must be provided.

#### Example Request

```bash
curl "/api/content/lessons?module_slug=calculus-1&include_questions=true"
```

#### Example Response

```json
{
  "lessons": [
    {
      "id": "uuid",
      "module_id": "uuid",
      "title": "Limits and Continuity",
      "slug": "limits-continuity",
      "content": "Lesson content here...",
      "content_type": "text",
      "duration": "45 minutes",
      "order_index": 0,
      "is_free": false,
      "questions": [
        {
          "id": "uuid",
          "question_text": "What is a limit?",
          "question_type": "multiple_choice",
          "options": ["...", "...", "..."],
          "difficulty": "medium"
        }
      ]
    }
  ],
  "module_id": "uuid"
}
```

---

### 4. Government Jobs

**GET** `/api/content/government-jobs`

Fetch government job postings with filtering.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `level` | string | - | Job level (district/state/central) |
| `state` | string | - | Filter by state |
| `district` | string | - | Filter by district |
| `status` | string | 'open' | Job status (open/closed/cancelled) |
| `position_type` | string | - | Position type (clerk/teacher/police/ias) |
| `limit` | number | 50 | Number of results |
| `offset` | number | 0 | Pagination offset |

#### Example Request

```bash
curl "/api/content/government-jobs?state=Bihar&status=open&limit=10"
```

#### Example Response

```json
{
  "jobs": [
    {
      "id": "uuid",
      "job_id": "job-bihar-patna-clerk-001",
      "title": "Clerk Position",
      "department": "Various Departments",
      "level": "state",
      "location_state": "Bihar",
      "location_district": "Patna",
      "education_requirement": "12th pass",
      "age_min": 18,
      "age_max": 30,
      "application_deadline": "2026-03-15T23:59:59Z",
      "status": "open"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

---

### 5. Geography

**GET** `/api/content/geography`

Fetch hierarchical geography data (country > state > district > city).

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by type (country/state/district/city) |
| `parent_id` | UUID | Filter by parent location |
| `name` | string | Search by name (case-insensitive, partial match) |
| `include_children` | boolean | Include child locations in response |

#### Example Request

```bash
curl "/api/content/geography?type=state&include_children=true"
```

#### Example Response

```json
{
  "geography": [
    {
      "id": "uuid",
      "name": "Bihar",
      "type": "state",
      "parent_id": "country-uuid",
      "children": [
        {
          "id": "uuid",
          "name": "Patna",
          "type": "district",
          "code": "BH-PAT"
        },
        {
          "id": "uuid",
          "name": "Gaya",
          "type": "district",
          "code": "BH-GAY"
        }
      ]
    }
  ]
}
```

---

### 6. Trivia

**GET** `/api/content/trivia`

Fetch trivia questions for cricket, general knowledge, etc.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `app_subdomain` | string | - | Filter by app (e.g., 'learn-cricket') |
| `category` | string | - | Main category (cricket/history/science) |
| `subcategory` | string | - | Subcategory (players/matches/records) |
| `difficulty` | string | - | Difficulty level (easy/medium/hard) |
| `limit` | number | 20 | Number of results |
| `offset` | number | 0 | Pagination offset |
| `random` | boolean | false | Randomize results |

#### Example Request

```bash
curl "/api/content/trivia?category=cricket&difficulty=medium&random=true&limit=10"
```

#### Example Response

```json
{
  "trivia": [
    {
      "id": "uuid",
      "app_subdomain": "learn-cricket",
      "category": "cricket",
      "subcategory": "records",
      "question": "Who holds the record for most runs in ODI cricket?",
      "answer": "Sachin Tendulkar",
      "difficulty": "medium",
      "fun_fact": "Sachin scored 18,426 runs in his ODI career",
      "tags": ["records", "batting", "ODI"]
    }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

---

## Error Responses

All endpoints use standard HTTP status codes:

- `200 OK` - Successful request
- `400 Bad Request` - Missing or invalid parameters
- `404 Not Found` - Resource not found
- `405 Method Not Allowed` - Wrong HTTP method
- `500 Internal Server Error` - Server error

Error response format:

```json
{
  "error": "Error message describing the issue"
}
```

## Rate Limiting

Currently, no rate limiting is enforced. This may change in production to prevent abuse.

## Caching

Consider caching responses on the client side for better performance. Content is relatively static and can be cached for:
- Courses: 1 hour
- Modules/Lessons: 1 hour
- Government Jobs: 5 minutes (frequently updated)
- Geography: 24 hours (rarely changes)
- Trivia: 1 hour

## Best Practices

1. **Use slugs when possible** - Slugs are more stable than UUIDs
2. **Request only needed fields** - Use `include_*` parameters judiciously
3. **Implement pagination** - Don't fetch all records at once
4. **Cache responses** - Reduce server load and improve performance
5. **Handle errors gracefully** - Always check for error responses

## Examples in Different Languages

### JavaScript (Fetch API)

```javascript
async function getCourses(subdomain) {
  const response = await fetch(
    `/api/content/courses?subdomain=${subdomain}&include_modules=true`
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.courses;
}
```

### React Hook

```javascript
import { useState, useEffect } from 'react';

function useCourses(subdomain) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(
          `/api/content/courses?subdomain=${subdomain}`
        );
        const data = await response.json();
        setCourses(data.courses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [subdomain]);

  return { courses, loading, error };
}
```

### Python (requests)

```python
import requests

def get_government_jobs(state, status='open'):
    response = requests.get(
        '/api/content/government-jobs',
        params={'state': state, 'status': status}
    )
    response.raise_for_status()
    return response.json()['jobs']
```

## Support

For issues or questions about the API:
1. Check this documentation
2. Review the source code in `apps/main/pages/api/content/`
3. Test endpoints with curl or Postman
4. Check Supabase dashboard for data

---

**Last Updated**: 2026-01-29  
**Version**: 1.0.0  
**Maintainer**: iiskills-cloud content migration team
