# Content Discovery Agent Implementation Guide

## Overview

This document describes the implementation of a unified content discovery system for the iiskills-cloud monorepo. The system enables cross-app content search, geographic resolution for job postings, and centralized content management.

## Architecture

### Core Components

1. **@iiskills/schema** (`packages/schema/`)
   - Unified content interfaces (`UnifiedContent`, `Job`, `Lesson`, `Test`, etc.)
   - Type guards for runtime type checking
   - Content filters and pagination interfaces

2. **@iiskills/content-sdk** (`packages/content-sdk/`)
   - Search and filtering utilities
   - Geographic resolver for location-based queries
   - Content aggregation from multiple apps
   - Semantic search placeholders (extensible)

3. **App Manifests** (`apps/*/manifest.json`)
   - Per-app content listings
   - Standardized metadata format
   - Integration points for search indexing

4. **Meta-Index** (`packages/content-sdk/meta-index.json`)
   - Central registry of all apps
   - Content type definitions per app
   - Manifest locations

5. **CONTENT.md Steering Files** (`apps/*/CONTENT.md`)
   - Human-readable documentation
   - Directory structure explanation
   - Content organization guides

## Implementation Details

### 1. Unified Schema

The `UnifiedContent` interface is the foundation of the system:

```typescript
interface UnifiedContent {
  id: string;                    // Unique identifier
  type: ContentType;             // 'job' | 'lesson' | 'test' | 'module' | 'sports' | etc.
  title: string;                 // Content title
  description?: string;          // Brief description
  tags?: string[];               // Search keywords
  metadata?: Record<string, any>; // Additional metadata
  location?: Location;           // Geographic data (for jobs)
  deadline?: string;             // Time-sensitive content
  url?: string;                  // Link to full content
  app?: string;                  // Source app identifier
  status?: 'draft' | 'published' | 'archived';
  customFields?: Record<string, any>; // App-specific data
}
```

### 2. Content SDK Functions

#### Search and Filter

```typescript
import { searchContent, paginateContent } from '@iiskills/content-sdk';

// Search with filters
const results = searchContent(allContent, {
  type: ['lesson', 'test'],
  tags: ['math'],
  searchQuery: 'algebra',
  status: ['published'],
});

// Paginate results
const page = paginateContent(results, 1, 10);
```

#### Geographic Resolution

```typescript
import { GeographicResolver } from '@iiskills/content-sdk';

const geography = require('./apps/learn-govt-jobs/data/geography.json');
const resolver = new GeographicResolver(geography);

// Resolve location query
const locations = resolver.resolveLocation('Bihar');
// Returns: [{ country: 'India', state: 'Bihar' }]

// Expand to sub-locations
const districts = resolver.expandLocation({ country: 'India', state: 'Bihar' });
// Returns all districts in Bihar
```

#### Content Aggregation

```typescript
import { aggregateContent } from '@iiskills/content-sdk';

// Load manifests
const manifests = [aptManifest, jobsManifest, cricketManifest];

// Aggregate all content
const allContent = aggregateContent(manifests);
```

### 3. App Integration

#### Creating a Manifest

Each app should have a `manifest.json` file:

```json
{
  "app": "learn-apt",
  "version": "1.0.0",
  "contentTypes": ["test"],
  "items": [
    {
      "id": "apt-logical-reasoning-1",
      "type": "test",
      "title": "Logical Reasoning - Pattern Recognition",
      "description": "Test your ability to identify patterns",
      "tags": ["aptitude", "logical-reasoning", "beginner"],
      "app": "learn-apt",
      "url": "/tests/logical-reasoning-1",
      "status": "published",
      "customFields": {
        "duration": 30,
        "totalQuestions": 20,
        "difficulty": "beginner"
      }
    }
  ],
  "lastUpdated": "2024-01-15T10:00:00Z"
}
```

#### Creating CONTENT.md

Document your app's content structure:

```markdown
# App-Name Content Structure

## Overview
Brief description of the app and its content.

## Content Types
- List of content types used

## Directory Structure
```
apps/app-name/
├── manifest.json
├── data/
└── pages/
```

## Content Organization
How content is organized and categorized.

## Metadata Schema
Explanation of manifest structure and custom fields.
```

### 4. Cross-App Search Examples

#### Example 1: IAS Exam Preparation

```typescript
// Query: "IAS exam preparation"
const iasContent = searchContent(allContent, {
  searchQuery: 'ias',
  type: ['lesson', 'test', 'job'],
});

// Results might include:
// - Aptitude tests for IAS from learn-apt
// - IAS syllabus lessons from learn-ias
// - IAS job postings from learn-govt-jobs
```

#### Example 2: Location-Based Job Search

```typescript
// Query: "Jobs in Patna, Bihar"
const patnaJobs = searchContent(allContent, {
  type: ['job'],
  location: {
    country: 'India',
    state: 'Bihar',
    district: 'Patna',
  },
});
```

#### Example 3: Time-Sensitive Content

```typescript
// Query: "Jobs with upcoming deadlines"
const urgentJobs = searchContent(allContent, {
  type: ['job'],
  hasDeadline: true,
}).filter(job => {
  const deadline = new Date(job.deadline!);
  const daysUntil = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return daysUntil > 0 && daysUntil <= 30; // Within next 30 days
});
```

## Admin Dashboard Integration

### Content Overview

Display aggregated content from all apps:

```typescript
// Load all manifests
const manifests = await Promise.all(
  metaIndex.apps.map(app => loadManifest(app.manifestPath))
);

// Aggregate content
const allContent = aggregateContent(manifests);

// Group by type
const contentByType = {
  tests: allContent.filter(item => item.type === 'test'),
  lessons: allContent.filter(item => item.type === 'lesson'),
  jobs: allContent.filter(item => item.type === 'job'),
};
```

### Search Interface

Implement a search endpoint:

```typescript
// pages/api/admin/content/search.ts
export default async function handler(req, res) {
  const { query, type, tags, location } = req.query;
  
  // Load content
  const allContent = await loadAllContent();
  
  // Apply filters
  const results = searchContent(allContent, {
    searchQuery: query,
    type: type ? [type] : undefined,
    tags: tags ? tags.split(',') : undefined,
    location: location ? JSON.parse(location) : undefined,
  });
  
  // Paginate
  const page = paginateContent(results, req.query.page || 1, 20);
  
  res.json(page);
}
```

### Inline Editing

Update manifest data:

```typescript
// pages/api/admin/content/update.ts
export default async function handler(req, res) {
  const { app, itemId, updates } = req.body;
  
  // Load manifest
  const manifest = await loadManifest(`apps/${app}/manifest.json`);
  
  // Update item
  const itemIndex = manifest.items.findIndex(item => item.id === itemId);
  if (itemIndex >= 0) {
    manifest.items[itemIndex] = {
      ...manifest.items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Save manifest
    await saveManifest(`apps/${app}/manifest.json`, manifest);
    
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
}
```

### Location Filtering

Geographic search UI:

```tsx
// components/admin/LocationFilter.tsx
import { GeographicResolver } from '@iiskills/content-sdk';

export function LocationFilter({ geography, onLocationChange }) {
  const resolver = new GeographicResolver(geography);
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  
  const handleSearch = () => {
    onLocationChange({ country, state, district });
  };
  
  return (
    <div>
      <select onChange={e => setCountry(e.target.value)}>
        <option value="">All Countries</option>
        {geography.map(c => <option key={c.name}>{c.name}</option>)}
      </select>
      
      {country && (
        <select onChange={e => setState(e.target.value)}>
          <option value="">All States</option>
          {/* ... */}
        </select>
      )}
      
      {state && (
        <select onChange={e => setDistrict(e.target.value)}>
          <option value="">All Districts</option>
          {/* ... */}
        </select>
      )}
      
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
```

## Testing

Run the test script:

```bash
npx ts-node test-content-discovery.ts
```

Expected output:
- Loads manifests from multiple apps
- Aggregates content
- Performs searches by type, tags, location
- Tests geographic resolver
- Validates pagination

## Future Enhancements

### 1. Vector Embeddings for Semantic Search

```typescript
// Integration with OpenAI or similar
import { OpenAI } from 'openai';

async function generateEmbedding(content: UnifiedContent): Promise<number[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const text = `${content.title} ${content.description || ''} ${content.tags?.join(' ') || ''}`;
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  
  return response.data[0].embedding;
}
```

### 2. Real-time Indexing

Watch for manifest changes and update index:

```typescript
import { watch } from 'fs';

watch('apps/*/manifest.json', async (event, filename) => {
  console.log(`Manifest changed: ${filename}`);
  await rebuildIndex();
});
```

### 3. Content Analytics

Track popular searches and content:

```typescript
interface SearchAnalytics {
  query: string;
  timestamp: string;
  resultsCount: number;
  clickedItems: string[];
}

// Store in database for analysis
```

### 4. API Endpoints

Create REST or GraphQL APIs:

```typescript
// pages/api/content/search.ts
// pages/api/content/[id].ts
// pages/api/jobs/by-location.ts
```

## Deployment

### 1. Build Packages

```bash
cd packages/schema && yarn build
cd ../content-sdk && yarn build
```

### 2. Update App Dependencies

```json
{
  "dependencies": {
    "@iiskills/schema": "*",
    "@iiskills/content-sdk": "*"
  }
}
```

### 3. Generate Manifests

Create manifests for all apps using templates.

### 4. Deploy

Deploy apps with updated manifests and SDK.

## Maintenance

### Adding New Content

1. Update app's `manifest.json`
2. Update `lastUpdated` timestamp
3. Regenerate meta-index if needed
4. Rebuild search index

### Adding New Apps

1. Create `manifest.json` in new app
2. Create `CONTENT.md` documentation
3. Add entry to `meta-index.json`
4. Deploy updated configuration

### Updating Schema

1. Update `packages/schema/index.ts`
2. Bump version number
3. Update all affected manifests
4. Rebuild and redeploy

## Support

For questions or issues:
- Check CONTENT.md files in each app
- Review this implementation guide
- Refer to Content SDK README
- Consult the unified schema documentation

## License

MIT
