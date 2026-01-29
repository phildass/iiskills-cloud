# @iiskills/schema

Shared type definitions and interfaces for the iiskills-cloud monorepo.

## Overview

This package provides unified data structures for cross-app content discovery and retrieval across all educational apps in the iiskills-cloud platform.

## Key Exports

### UnifiedContent

The core interface that all content across apps should conform to:

- `UnifiedContent` - Base interface for all content
- `Job` - Job posting extension
- `Lesson` - Lesson content extension
- `Test` - Test/quiz content extension
- `Module` - Module (collection) extension

### Geographic Types

For location-based content (primarily for gov-jobs):

- `GeographicHierarchy` - Complete country → state → district hierarchy
- `Location` - Geographic location information
- `resolveGeographicPath()` - Resolve paths to breadcrumbs

### Content Discovery

- `ContentManifest` - Manifest structure for each app
- `MetaIndex` - Meta-index for cross-app search
- `ContentFilters` - Search and filter options

## Usage

```typescript
import { UnifiedContent, Job, Lesson, isJob } from '@iiskills/schema';

const content: UnifiedContent = {
  id: 'job-123',
  type: 'job',
  title: 'Software Engineer',
  location: {
    country: 'India',
    state: 'Bihar',
    district: 'Patna'
  }
};

if (isJob(content)) {
  console.log('This is a job posting');
}
```

## Development

```bash
# Build the package
yarn build

# Watch mode
yarn dev

# Clean build artifacts
yarn clean
```
