# Implementation Guide: Schema-Driven UI

This guide walks you through implementing the Schema-Driven UI approach in your iiskills-cloud apps.

## 🎯 Quick Start (5 Minutes)

### 1. Install the Core Library

```bash
# The core library is already in the monorepo workspace
# Just add it to your app's dependencies
```

In your app's `package.json`:
```json
{
  "dependencies": {
    "@iiskills/core": "workspace:*"
  }
}
```

### 2. Create Your First Module

```typescript
// pages/example.tsx
import { Module } from '@iiskills/core';

const myLesson: Module<'lesson'> = {
  id: 'intro-to-programming',
  title: 'Introduction to Programming',
  content_type: 'lesson',
  status: 'published',
  isPublic: true,
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficulty: 'beginner',
    estimatedDuration: 30,
    tags: ['programming', 'basics']
  },
  content: {
    description: 'Learn the fundamentals of programming',
    objectives: [
      'Understand variables and data types',
      'Learn about functions',
      'Write your first program'
    ],
    sections: [
      {
        id: 'section-1',
        title: 'What is Programming?',
        content: 'Programming is the process of creating instructions...',
        order: 1
      }
    ]
  }
};
```

### 3. Display the Module

```typescript
// pages/lesson/[id].tsx
import { ModuleContainer, useModule } from '@iiskills/core';
import { useRouter } from 'next/router';

export default function LessonPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { module, isLoading, error, refetch } = useModule(id as string);
  
  return (
    <div className="container mx-auto p-6">
      <ModuleContainer
        module={module}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}
```

Done! 🎉 You now have a working Schema-Driven UI implementation.

---

## 📚 Detailed Implementation Steps

### Step 1: Set Up Your App Configuration

Create `config/app.config.json` in your app:

```json
{
  "id": "my-learning-app",
  "name": "My Learning App",
  "version": "1.0.0",
  "environment": "development",
  "features": {
    "isSearchable": true,
    "hasProgressTracking": true,
    "hasCertificates": false,
    "hasAIAssistant": true,
    "hasNewsletterPopup": true,
    "enablePaywall": false,
    "enableSocialSharing": true,
    "enableComments": false,
    "enableBookmarks": true
  },
  "navigation": {
    "depth": 3,
    "showBreadcrumbs": true,
    "enableSearch": true
  },
  "content": {
    "supportedTypes": ["lesson", "test", "article"],
    "defaultType": "lesson",
    "enableUserGenerated": false,
    "moderationRequired": true
  },
  "branding": {
    "appName": "My Learning App",
    "appDescription": "Learn anything, anywhere",
    "primaryColor": "#3b82f6",
    "secondaryColor": "#8b5cf6"
  },
  "api": {
    "baseUrl": "/api",
    "endpoints": {
      "modules": "/modules",
      "auth": "/auth",
      "user": "/user"
    },
    "timeout": 30000,
    "retryAttempts": 3
  }
}
```

### Step 2: Create API Endpoints

Create `pages/api/modules/index.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { Module, ModuleCollection } from '@iiskills/core';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ModuleCollection>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // Parse query parameters
  const {
    page = '1',
    pageSize = '10',
    content_type,
    tags,
    difficulty,
    status,
    q: searchQuery
  } = req.query;

  // Fetch from database (example)
  const modules: Module[] = await fetchModulesFromDB({
    page: parseInt(page as string),
    pageSize: parseInt(pageSize as string),
    content_type: content_type ? (content_type as string).split(',') : undefined,
    tags: tags ? (tags as string).split(',') : undefined,
    difficulty: difficulty ? (difficulty as string).split(',') : undefined,
    status: status ? (status as string).split(',') : undefined,
    searchQuery: searchQuery as string
  });

  const total = await getModulesCount();
  const currentPage = parseInt(page as string);
  const size = parseInt(pageSize as string);

  res.status(200).json({
    modules,
    total,
    page: currentPage,
    pageSize: size,
    hasMore: currentPage * size < total
  });
}

// Placeholder - replace with your actual database logic
async function fetchModulesFromDB(filters: any): Promise<Module[]> {
  // Your database query here
  return [];
}

async function getModulesCount(): Promise<number> {
  // Your count query here
  return 0;
}
```

Create `pages/api/modules/[id].ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { Module } from '@iiskills/core';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Module | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { id } = req.query;

  // Fetch from database
  const module = await fetchModuleById(id as string);

  if (!module) {
    return res.status(404).json({ error: 'Module not found' });
  }

  res.status(200).json(module);
}

async function fetchModuleById(id: string): Promise<Module | null> {
  // Your database query here
  return null;
}
```

### Step 3: Create Module List Page

Create `pages/modules/index.tsx`:

```typescript
import { useModuleData } from '@iiskills/core';
import Link from 'next/link';

export default function ModulesPage() {
  const {
    modules,
    isLoading,
    hasMore,
    fetchMore,
    updateFilters
  } = useModuleData({
    endpoint: '/api/modules',
    filters: {
      status: ['published']
    },
    pageSize: 12,
    autoFetch: true
  });

  if (isLoading && modules.length === 0) {
    return <div>Loading modules...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Browse Modules</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => updateFilters({ content_type: ['lesson'] })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Lessons
        </button>
        <button
          onClick={() => updateFilters({ content_type: ['test'] })}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Tests
        </button>
        <button
          onClick={() => updateFilters({ content_type: undefined })}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          All
        </button>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link key={module.id} href={`/modules/${module.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                {module.content_type}
              </span>
              {module.metadata.tags && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {module.metadata.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={fetchMore}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### Step 4: Create Module Detail Page

Create `pages/modules/[id].tsx`:

```typescript
import { ModuleContainer, useModule } from '@iiskills/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ModuleDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const { module, isLoading, error, refetch } = useModule(
    id as string,
    '/api/modules'
  );

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-4">
        <Link href="/modules" className="text-blue-600 hover:underline">
          ← Back to Modules
        </Link>
      </div>

      {/* Module Content */}
      <ModuleContainer
        module={module}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        showMetadata={true}
        showTags={true}
      />
    </div>
  );
}
```

### Step 5: Apply Custom Theme

Create `styles/theme.ts`:

```typescript
import { createTheme, generateCSSVariables } from '@iiskills/core';

export const customTheme = createTheme({
  colors: {
    primary: {
      500: '#3b82f6', // Your brand color
      600: '#2563eb',
      // ... other shades
    }
  }
});

export const cssVariables = generateCSSVariables(customTheme);
```

Update `pages/_app.tsx`:

```typescript
import { cssVariables } from '../styles/theme';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
```

### Step 6: Custom Renderer (Optional)

Create `components/CustomLessonRenderer.tsx`:

```typescript
import { ModuleRendererProps } from '@iiskills/core';

export const CustomLessonRenderer: React.FC<ModuleRendererProps<'lesson'>> = ({
  module,
  onComplete
}) => {
  const content = module.content;

  return (
    <div className="custom-lesson">
      <h1 className="text-4xl font-bold mb-4">{module.title}</h1>
      <p className="text-lg text-gray-600 mb-6">{content.description}</p>

      {/* Your custom UI here */}
      {content.sections?.map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
          <div className="prose">{section.content}</div>
        </div>
      ))}

      <button
        onClick={onComplete}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg"
      >
        Mark as Complete
      </button>
    </div>
  );
};
```

Use it in your page:

```typescript
import { ModuleContainer } from '@iiskills/core';
import { CustomLessonRenderer } from '../components/CustomLessonRenderer';

<ModuleContainer
  module={module}
  renderLesson={CustomLessonRenderer}
/>
```

---

## 🎨 Customization Options

### Option 1: Custom Config per App

Each app can have its own config:
- `learn-aptitude/config/app.config.json`
- `learn-govt-jobs/config/app.config.json`
- `learn-management/config/app.config.json`

### Option 2: Custom Renderers

Override default renderers:
```typescript
<ModuleSwitcher
  module={module}
  renderLesson={MyLessonRenderer}
  renderTest={MyTestRenderer}
  renderJobPosting={MyJobRenderer}
/>
```

### Option 3: Custom Theme

Create app-specific themes:
```typescript
const myTheme = createTheme({
  colors: {
    primary: { 500: '#your-color' }
  }
});
```

### Option 4: Extend Module Types

Add custom fields:
```typescript
interface CustomModule extends Module {
  customFields: {
    rating: number;
    views: number;
  }
}
```

---

## 🧪 Testing Your Implementation

### 1. Type Checking

```bash
cd packages/core
npx tsc --noEmit
```

### 2. Manual Testing Checklist

- [ ] Modules load correctly
- [ ] Filtering works
- [ ] Pagination works
- [ ] Different content types render correctly
- [ ] Loading states display
- [ ] Error states display
- [ ] Theme is applied
- [ ] Config is respected

### 3. Create Test Data

```typescript
// lib/testData.ts
import { Module } from '@iiskills/core';

export const testModules: Module[] = [
  {
    id: '1',
    title: 'Test Lesson',
    content_type: 'lesson',
    // ... rest of the module
  },
  // ... more test modules
];
```

---

## 🚀 Going to Production

### 1. Environment Configuration

Create production config:
```json
{
  "environment": "production",
  "api": {
    "baseUrl": "https://api.iiskills.cloud"
  }
}
```

### 2. Build and Deploy

```bash
# Build your app
npm run build

# Deploy
npm run deploy
```

### 3. Monitor and Iterate

- Check analytics for module views
- Monitor error rates
- Gather user feedback
- Iterate on custom renderers

---

## 📖 Additional Resources

- [Module Types Reference](./types/module.types.ts)
- [Config Types Reference](./types/config.types.ts)
- [Theme System Guide](./theme/theme.ts)
- [Example Usage](./examples/usage.tsx)
- [Architecture Diagrams](./ARCHITECTURE.md)

---

## 🆘 Troubleshooting

### Issue: Module not rendering

**Solution**: Check that your module data matches the Module<T> type:
```typescript
import { validateModule } from '@iiskills/core';

if (!validateModule(myModule)) {
  console.error('Invalid module structure');
}
```

### Issue: API returns 404

**Solution**: Ensure your API endpoint matches the config:
```typescript
// Check config
console.log(appConfig.api.endpoints.modules);

// Verify useModuleData endpoint
useModuleData({
  endpoint: appConfig.api.endpoints.modules
});
```

### Issue: Theme not applying

**Solution**: Make sure CSS variables are included:
```typescript
// In _app.tsx
import { cssVariables } from '../styles/theme';

<style dangerouslySetInnerHTML={{ __html: cssVariables }} />
```

---

## ✅ Best Practices

1. **Always use TypeScript types** - Leverage the type system for safety
2. **Keep configs in JSON** - Easier to manage and validate
3. **Use custom renderers sparingly** - Override only when necessary
4. **Cache API responses** - useModuleData has built-in caching
5. **Validate module data** - Use type guards before rendering
6. **Follow naming conventions** - Keep content_type values consistent
7. **Document custom fields** - If extending types, document thoroughly

---

Happy coding! 🎉
