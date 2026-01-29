# Learn-Govt-Jobs Content Structure

## Overview
The learn-govt-jobs app provides information about government job openings across India, organized by geographic location (country, state, district).

## Content Types
- **Jobs**: Government job postings with eligibility criteria, deadlines, and location data

## Directory Structure
```
apps/learn-govt-jobs/
├── manifest.json              # Content manifest with all jobs
├── data/
│   ├── geography.json        # Geographic hierarchy (country → state → district)
│   ├── eligibility.ts        # Eligibility criteria definitions
│   └── deadlines.json        # Job application deadlines
├── pages/
│   ├── jobs/
│   │   └── [country]/
│   │       └── [state]/
│   │           └── [district]/  # Job listings by location
│   └── index.js
└── CONTENT.md                # This file
```

## Geographic Structure

### Location Hierarchy
Jobs are organized by:
1. **Country** (e.g., India)
2. **State** (e.g., Bihar, Maharashtra, Delhi)
3. **District** (e.g., Patna, Mumbai, South Delhi)

### Geographic Data (geography.json)
```json
[
  {
    "name": "India",
    "type": "country",
    "children": [
      {
        "name": "Bihar",
        "type": "state",
        "children": [
          { "name": "Patna", "type": "district" },
          { "name": "Gaya", "type": "district" }
        ]
      }
    ]
  }
]
```

## Content Organization

### Job Categories
1. **Central Government Jobs**
   - IAS/IPS (Civil Services)
   - SSC (Staff Selection Commission)
   - Railway Recruitment
   - Banking Sector (IBPS, SBI)

2. **State Government Jobs**
   - State Civil Services
   - Police Department
   - Education Department
   - Health Department

3. **Local Government Jobs**
   - Municipal Corporations
   - District Courts
   - Panchayat Raj

## Metadata Schema
Each job in manifest.json includes:
- `id`: Unique job identifier
- `type`: Always "job" for this app
- `title`: Job title
- `description`: Job description
- `tags`: Keywords (e.g., "government", "clerk", "bihar")
- `app`: "learn-govt-jobs"
- `url`: Job details URL
- `location`: Geographic location object
  - `country`: Country name
  - `state`: State name (optional)
  - `district`: District name (optional)
- `deadline`: Application deadline (ISO 8601)
- `customFields`:
  - `company`: Recruiting organization
  - `employmentType`: "full-time", "part-time", "contract"
  - `salary`: Min/max salary and currency
  - `requirements`: Array of requirements
  - `applicationUrl`: External application link
  - `eligibility`: Structured eligibility criteria

## Geographic Resolution

### Using the Content SDK
```typescript
import { GeographicResolver } from '@iiskills/content-sdk';

// Load geography data
const geography = require('./data/geography.json');
const resolver = new GeographicResolver(geography);

// Query: "Jobs in Bihar"
const locations = resolver.resolveLocation('Bihar');
// Returns: [{ country: 'India', state: 'Bihar' }]

// Expand to all districts
const expanded = resolver.expandLocation({ country: 'India', state: 'Bihar' });
// Returns all Bihar districts: Patna, Gaya, etc.
```

### Example Queries
- "Jobs in Patna, Bihar" → Filter by: `{ country: 'India', state: 'Bihar', district: 'Patna' }`
- "Jobs in Bihar" → Expand to all Bihar districts
- "IAS jobs" → Filter by tags: ["ias", "civil-services"]
- "Teaching jobs in Gaya" → Filter by location + tags: ["teacher", "education"]

## Content Discovery
This app's content is indexed in:
- `/packages/content-sdk/meta-index.json` - Central index
- `manifest.json` - App-specific job listings

## Integration with Content SDK
Use `@iiskills/content-sdk` to:
- Search jobs by location
- Filter by job type, deadline, or salary
- Resolve geographic queries (city → state → districts)
- Aggregate with aptitude tests (e.g., "IAS exam prep" + "IAS jobs")

## Data Files

### eligibility.ts
Defines structured eligibility criteria:
```typescript
export interface Eligibility {
  education: string;
  age: { min: number; max: number };
  experience?: string;
  physicalFitness?: boolean;
  nationality?: string;
}
```

### deadlines.json
Tracks application deadlines:
```json
{
  "job-id": {
    "deadline": "2026-03-15T23:59:59Z",
    "status": "open"
  }
}
```

## Future Enhancements
- Real-time notifications for new job postings
- Deadline reminders
- Application tracking
- Eligibility checker tool
- Exam preparation resources linking
