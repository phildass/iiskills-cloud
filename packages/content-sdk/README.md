# @iiskills/content-sdk

Content discovery and management SDK for the iiskills-cloud monorepo.

## Overview

This SDK provides utilities for discovering, searching, and managing content across all apps in the monorepo. It enables:

- **Cross-app content search**: Find lessons, tests, jobs, and other content across all apps
- **Geographic resolution**: Match location queries to specific regions (for gov-jobs)
- **Content aggregation**: Combine content from multiple apps into unified results
- **Semantic search**: Placeholder for vector-based semantic search (extensible)

## Installation

```bash
yarn add @iiskills/content-sdk
```

## Usage

### Basic Content Search

```typescript
import { searchContent, paginateContent } from '@iiskills/content-sdk';
import type { UnifiedContent, ContentFilters } from '@iiskills/content-sdk';

// Sample content
const content: UnifiedContent[] = [
  {
    id: '1',
    type: 'lesson',
    title: 'Introduction to Algebra',
    description: 'Learn basic algebra concepts',
    tags: ['math', 'algebra'],
    app: 'learn-math',
  },
  // ... more content
];

// Search with filters
const filters: ContentFilters = {
  type: ['lesson', 'test'],
  tags: ['math'],
  searchQuery: 'algebra',
};

const results = searchContent(content, filters);
const paginated = paginateContent(results, 1, 10);

console.log(paginated);
// {
//   items: [...],
//   total: 5,
//   page: 1,
//   pageSize: 10,
//   hasMore: false
// }
```

### Geographic Resolution

```typescript
import { GeographicResolver } from '@iiskills/content-sdk';

// Define geography hierarchy
const geography = [
  {
    name: 'India',
    type: 'country' as const,
    children: [
      {
        name: 'Bihar',
        type: 'state' as const,
        children: [
          { name: 'Patna', type: 'district' as const },
          { name: 'Gaya', type: 'district' as const },
        ],
      },
    ],
  },
];

const resolver = new GeographicResolver(geography);

// Resolve a location query
const locations = resolver.resolveLocation('Patna');
console.log(locations);
// [{ country: 'India', state: 'Bihar', district: 'Patna' }]

// Expand a location to sub-locations
const expanded = resolver.expandLocation({ country: 'India', state: 'Bihar' });
console.log(expanded);
// [
//   { country: 'India', state: 'Bihar', district: 'Patna' },
//   { country: 'India', state: 'Bihar', district: 'Gaya' }
// ]
```

### Content Aggregation

```typescript
import { aggregateContent } from '@iiskills/content-sdk';
import type { ContentManifest } from '@iiskills/content-sdk';

const manifests: ContentManifest[] = [
  {
    app: 'learn-apt',
    version: '1.0.0',
    contentTypes: ['test'],
    items: [/* ... */],
    lastUpdated: '2024-01-01T00:00:00Z',
  },
  {
    app: 'learn-math',
    version: '1.0.0',
    contentTypes: ['lesson', 'test'],
    items: [/* ... */],
    lastUpdated: '2024-01-01T00:00:00Z',
  },
];

// Aggregate all content from manifests
const allContent = aggregateContent(manifests);
```

### Semantic Search (Placeholder)

```typescript
import { semanticSearch } from '@iiskills/content-sdk';

// Note: This is a placeholder implementation
// In production, integrate with OpenAI embeddings, FAISS, Pinecone, or Qdrant
const results = semanticSearch('How to solve quadratic equations', content, 5);
```

## API Reference

### Functions

#### `searchContent(items, filters): UnifiedContent[]`
Filter content based on various criteria.

#### `paginateContent(items, page, pageSize): ContentCollection`
Paginate content results.

#### `aggregateContent(manifests): UnifiedContent[]`
Combine content from multiple app manifests.

#### `validateContent(content): boolean`
Check if an object conforms to the UnifiedContent interface.

### Classes

#### `GeographicResolver`
Resolve and expand geographic locations.

**Methods:**
- `resolveLocation(query: string): Location[]` - Find locations matching a query
- `expandLocation(location: Partial<Location>): Location[]` - Expand to sub-locations

## Integration with Apps

### Creating a Manifest

Each app should have a `manifest.json` file:

```json
{
  "app": "learn-apt",
  "version": "1.0.0",
  "contentTypes": ["test"],
  "items": [
    {
      "id": "apt-1",
      "type": "test",
      "title": "Logical Reasoning Test",
      "description": "Test your logical reasoning skills",
      "tags": ["aptitude", "reasoning"],
      "app": "learn-apt",
      "url": "/tests/logical-reasoning"
    }
  ],
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### Creating a Meta-Index

Create a centralized `meta-index.json`:

```json
{
  "version": "1.0.0",
  "apps": [
    {
      "name": "learn-apt",
      "path": "apps/learn-apt",
      "manifestPath": "apps/learn-apt/manifest.json",
      "contentTypes": ["test"]
    },
    {
      "name": "learn-math",
      "path": "apps/learn-math",
      "manifestPath": "apps/learn-math/manifest.json",
      "contentTypes": ["lesson", "test"]
    }
  ],
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

## Future Enhancements

- **Vector Embeddings**: Integration with OpenAI, FAISS, Pinecone, or Qdrant
- **Real-time Indexing**: Watch for content changes and update index
- **Analytics**: Track search queries and popular content
- **Caching**: Add Redis or in-memory caching for performance
- **API Endpoints**: Create REST/GraphQL APIs for content discovery

## License

MIT
