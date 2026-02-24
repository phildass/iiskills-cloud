# @iiskills/core - Schema-Driven UI Library

A unified, schema-driven UI library for all iiskills-cloud applications. This library provides a standardized approach to building content-driven applications with consistent interfaces, theming, and data handling.

## 📦 Overview

The `@iiskills/core` package implements a Schema-Driven UI architecture that allows multiple apps to share:

- **Unified Data Models**: TypeScript interfaces for Lessons, Tests, Job Postings, and more
- **Reusable Components**: Smart components that render based on content type
- **Configuration Layer**: Feature toggles and app-specific settings
- **Standardized Hooks**: Consistent data fetching across all apps
- **Global Theme System**: CSS Variables + Tailwind integration

## 🏗️ Architecture

### Core Principles

1. **Schema-Driven**: Content defines the UI, not hard-coded pages
2. **Type-Safe**: Full TypeScript support with discriminated unions
3. **Configurable**: Each app can toggle features via config files
4. **Reusable**: Share components and logic across all apps

### Folder Structure

```
packages/core/
├── types/               # TypeScript type definitions
│   ├── module.types.ts  # Module data structures
│   └── config.types.ts  # App configuration types
├── components/          # React components
│   ├── ModuleContainer.tsx
│   └── ModuleSwitcher.tsx
├── hooks/              # Custom React hooks
│   └── useModuleData.ts
├── theme/              # Theme configuration
│   └── theme.ts
├── config/             # Sample app configurations
│   ├── learn-aptitude.config.json
│   ├── learn-govt-jobs.config.json
│   └── learn-management.config.json
└── index.ts            # Main export file
```

## 🚀 Quick Start

### Installation

Since this is a monorepo package, it's automatically available to all workspace members.

```bash
# In your app's package.json, add:
{
  "dependencies": {
    "@iiskills/core": "workspace:*"
  }
}
```

### Basic Usage

#### 1. Using the Module Types

```typescript
import { Module, LessonContent } from '@iiskills/core';

const lessonModule: Module<'lesson'> = {
  id: 'lesson-001',
  title: 'Introduction to React',
  content_type: 'lesson',
  status: 'published',
  isPublic: true,
  metadata: {
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    author: 'John Doe',
    difficulty: 'beginner',
    estimatedDuration: 30,
    tags: ['react', 'javascript', 'frontend']
  },
  content: {
    description: 'Learn the basics of React',
    objectives: [
      'Understand React components',
      'Learn about JSX',
      'Create your first React app'
    ],
    sections: [
      {
        id: 'section-1',
        title: 'What is React?',
        content: 'React is a JavaScript library...',
        order: 1
      }
    ]
  }
};
```

#### 2. Using the ModuleContainer Component

```typescript
import { ModuleContainer, useModule } from '@iiskills/core';

function LessonPage({ id }: { id: string }) {
  const { module, isLoading, error, refetch } = useModule(id);

  return (
    <ModuleContainer
      module={module}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      showMetadata={true}
      showTags={true}
    />
  );
}
```

#### 3. Using the useModuleData Hook

```typescript
import { useModuleData } from '@iiskills/core';

function ModuleList() {
  const {
    modules,
    isLoading,
    hasMore,
    fetchMore,
    updateFilters
  } = useModuleData({
    endpoint: '/api/modules',
    filters: {
      content_type: ['lesson', 'test'],
      difficulty: ['beginner']
    },
    pageSize: 10,
    autoFetch: true
  });

  return (
    <div>
      {modules.map(module => (
        <div key={module.id}>{module.title}</div>
      ))}
      {hasMore && (
        <button onClick={fetchMore}>Load More</button>
      )}
    </div>
  );
}
```

#### 4. Custom Module Renderer

```typescript
import { ModuleContainer, ModuleRendererProps } from '@iiskills/core';

// Custom renderer for lessons
const CustomLessonRenderer: React.FC<ModuleRendererProps<'lesson'>> = ({ module }) => {
  return (
    <div className="custom-lesson">
      <h1>{module.title}</h1>
      <p>{module.content.description}</p>
      {/* Your custom UI here */}
    </div>
  );
};

// Use it in ModuleContainer
<ModuleContainer
  module={module}
  renderLesson={CustomLessonRenderer}
/>
```

## 🎨 Theming

### Using the Theme System

```typescript
import { defaultTheme, createTheme, generateCSSVariables } from '@iiskills/core';

// Create a custom theme
const myTheme = createTheme({
  colors: {
    primary: {
      500: '#ff6b6b',
      600: '#ee5a52',
      // ... other shades
    }
  }
});

// Generate CSS variables
const cssVars = generateCSSVariables(myTheme);

// Use in your app (e.g., in _app.js or layout)
<style dangerouslySetInnerHTML={{ __html: cssVars }} />
```

### Tailwind Integration

```javascript
// tailwind.config.js
import { generateTailwindConfig, defaultTheme } from '@iiskills/core';

module.exports = {
  ...generateTailwindConfig(defaultTheme),
  // Your other Tailwind config
};
```

## ⚙️ App Configuration

### Creating an App Config

```typescript
import { AppConfig, createDefaultConfig } from '@iiskills/core';

const config: AppConfig = createDefaultConfig({
  id: 'my-app',
  name: 'My Learning App',
  features: {
    isSearchable: true,
    hasProgressTracking: true,
    hasCertificates: false,
  },
  branding: {
    appName: 'My Learning App',
    primaryColor: '#3b82f6',
  }
});
```

### Using Config in Components

```typescript
import config from '../config/app.config.json';

function MyComponent() {
  if (config.features.hasProgressTracking) {
    return <ProgressTracker />;
  }
  return null;
}
```

## 📋 Available Content Types

The system supports the following content types out of the box:

1. **lesson** - Educational content with sections and materials
2. **test** - Assessments with questions and scoring
3. **job_posting** - Job listings with requirements and details
4. **quiz** - Quick quizzes (falls back to test renderer)
5. **article** - Articles (falls back to lesson renderer)
6. **video** - Video content (requires custom renderer)

### Extending with Custom Types

```typescript
import { Module } from '@iiskills/core';

// Define custom content
interface CustomContent {
  customField: string;
  // ... other fields
}

// Use with Module type
type CustomModule = Module & {
  content_type: 'custom';
  content: CustomContent;
};

// Provide custom renderer
<ModuleSwitcher
  module={customModule}
  renderCustom={CustomRenderer}
/>
```

## 🔧 API Reference

### Types

- `Module<T>` - Main module interface with content type
- `ModuleMetadata` - Common metadata fields
- `LessonContent`, `TestContent`, `JobPostingContent` - Content type interfaces
- `AppConfig` - App configuration interface
- `Theme` - Theme configuration interface

### Components

- `ModuleContainer` - HOC for module rendering with loading/error states
- `ModuleSwitcher` - Component that switches between renderers based on content type

### Hooks

- `useModuleData()` - Fetch multiple modules with filtering and pagination
- `useModule(id)` - Fetch a single module by ID

### Utilities

- `createDefaultConfig()` - Create app configuration with defaults
- `createTheme()` - Create custom theme
- `generateCSSVariables()` - Generate CSS variables from theme
- `generateTailwindConfig()` - Generate Tailwind config from theme

## 💡 Best Practices

1. **Type Safety**: Always use TypeScript and the provided types
2. **Consistent Metadata**: Use the standard metadata structure
3. **Config-Driven**: Use app config for feature toggles, not environment variables
4. **Theme Variables**: Use CSS variables for dynamic theming
5. **Error Handling**: Always provide error states in your renderers

## 🎯 Use Cases

### Use Case 1: Learn Aptitude
- Content Types: `lesson`, `test`
- Features: Progress tracking, certificates, AI assistance
- Custom: Career guidance, test modes (short/elaborate)

### Use Case 2: Learn Government Jobs
- Content Types: `job_posting`, `lesson`, `article`
- Features: Job alerts, bookmarks, search
- Custom: Application deadlines, job categories

### Use Case 3: Learn Management
- Content Types: `lesson`, `article`, `video`
- Features: Certificates, discussions, progress tracking
- Custom: Course categories, learning paths

## 📚 Examples

See the `config/` directory for complete app configuration examples:
- `learn-aptitude.config.json`
- `learn-govt-jobs.config.json`
- `learn-management.config.json`

## 🤝 Contributing

When adding new features to the core library:

1. Keep types generic and reusable
2. Add proper JSDoc comments
3. Update this README
4. Test with at least 2 different apps
5. Maintain backward compatibility

## 📄 License

MIT
