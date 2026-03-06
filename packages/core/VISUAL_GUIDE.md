# Schema-Driven UI: Visual Guide

## 🎨 What is Schema-Driven UI?

**Schema-Driven UI** is an architectural pattern where the **data structure (schema) determines what UI components to render**, rather than hard-coding different pages for each content type.

### Traditional Approach ❌

```
Lesson Page → Hard-coded Lesson UI
Test Page → Hard-coded Test UI
Job Page → Hard-coded Job UI
```

Problems:

- Code duplication
- Inconsistent interfaces
- Hard to maintain
- Difficult to extend

### Schema-Driven Approach ✅

```
Module Data (with content_type) → ModuleSwitcher → Appropriate Renderer
```

Benefits:

- ✅ Single source of truth
- ✅ Type-safe
- ✅ Consistent UI
- ✅ Easy to extend
- ✅ Reusable components

---

## 📊 Visual Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    APP LAYER                            │
│  Learn Aptitude  │  Learn Govt Jobs  │  Learn Mgmt     │
└─────────────────────────────────────────────────────────┘
                         ↓ ↓ ↓
┌─────────────────────────────────────────────────────────┐
│              CORE LIBRARY (@iiskills/core)              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📦 TYPES                    🎨 THEME                   │
│  ├─ Module<T>                ├─ Colors                  │
│  ├─ LessonContent            ├─ Typography              │
│  ├─ TestContent              ├─ Spacing                 │
│  ├─ JobPostingContent        └─ CSS Variables           │
│  └─ AppConfig                                           │
│                                                          │
│  🧩 COMPONENTS               🔧 HOOKS                   │
│  ├─ ModuleContainer          ├─ useModuleData()         │
│  └─ ModuleSwitcher           └─ useModule()             │
│                                                          │
│  🛠️ UTILS                     ⚙️ CONFIG                 │
│  ├─ sortModules()            ├─ Feature Flags           │
│  ├─ filterModules()          ├─ Navigation              │
│  └─ searchModules()          └─ Branding                │
│                                                          │
└─────────────────────────────────────────────────────────┘
                         ↓ ↓ ↓
┌─────────────────────────────────────────────────────────┐
│                   BACKEND / API                         │
│                     Database                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Visualization

```
┌──────────┐
│   App    │  1. App starts
└────┬─────┘
     │
     ↓
┌─────────────────┐
│ useModuleData() │  2. Hook fetches data
└────┬────────────┘
     │
     ↓
┌──────────┐
│   API    │  3. API returns Module[]
└────┬─────┘
     │
     ↓
┌─────────────────────┐
│ ModuleContainer     │  4. Container receives module
│ ├─ Loading state    │
│ ├─ Error state      │
│ └─ Success state    │
└────┬────────────────┘
     │
     ↓
┌─────────────────────┐
│ ModuleSwitcher      │  5. Switch based on content_type
│                     │
│ switch(content_type)│
│  case 'lesson':     │  ──→  Lesson Renderer  ──→  📚
│  case 'test':       │  ──→  Test Renderer    ──→  📝
│  case 'job_posting':│  ──→  Job Renderer     ──→  💼
│  default:           │  ──→  Fallback         ──→  ⚠️
└─────────────────────┘
```

---

## 💡 Module Type System

```typescript
// Base Module Type
Module<T> {
  id: string
  title: string
  content_type: T  ← This determines the renderer!
  metadata: {
    createdAt
    updatedAt
    author
    tags[]
    difficulty
    estimatedDuration
  }
  content: ContentType<T>  ← Type-safe content
}

// Discriminated Union Pattern
Module<'lesson'>  → content: LessonContent
Module<'test'>    → content: TestContent
Module<'job'>     → content: JobPostingContent
```

### Example: Lesson Module

```typescript
const lesson: Module<'lesson'> = {
  id: 'react-101',
  title: 'React Basics',
  content_type: 'lesson',  // ← Determines UI
  metadata: {
    difficulty: 'beginner',
    estimatedDuration: 30,
    tags: ['react', 'javascript']
  },
  content: {
    description: 'Learn React',
    objectives: [...],
    sections: [...]
  }
}
```

---

## 🎯 Use Case Examples

### Use Case 1: Learn Aptitude (Tests & Progress)

```
Config:
├─ Features: Progress Tracking ✓, Certificates ✓
├─ Content Types: ['lesson', 'test', 'quiz']
└─ Custom: Test modes (short/elaborate)

Module Types Used:
├─ lesson → Theory and concepts
└─ test → Practice tests with timer
```

### Use Case 2: Learn Govt Jobs (Job Postings)

```
Config:
├─ Features: Search ✓, Bookmarks ✓
├─ Content Types: ['job_posting', 'lesson', 'article']
└─ Custom: Job categories, deadlines

Module Types Used:
├─ job_posting → Government job listings
├─ lesson → Exam preparation
└─ article → Study tips
```

### Use Case 3: Learn Management (Courses)

```
Config:
├─ Features: Certificates ✓, Discussions ✓
├─ Content Types: ['lesson', 'article', 'video']
└─ Custom: Course paths, certificates

Module Types Used:
├─ lesson → Management concepts
├─ article → Case studies
└─ video → Expert interviews
```

---

## 🔧 Component Hierarchy

```
Page Component
    │
    ├─→ useModuleData()  ───→  Fetch data from API
    │                           │
    │                           ↓
    └─→ ModuleContainer  ←──  Pass module
            │
            ├─ if (isLoading) → Loading Spinner
            ├─ if (error) → Error Message
            └─ if (module) → ModuleSwitcher
                              │
                              ├─ Metadata Display
                              │   ├─ Author
                              │   ├─ Duration
                              │   ├─ Difficulty
                              │   └─ Tags
                              │
                              └─ Content Renderer
                                  ├─ LessonRenderer
                                  ├─ TestRenderer
                                  └─ JobRenderer
```

---

## 📁 File Organization

```
packages/core/
│
├── 📘 Documentation (6 files)
│   ├── README.md              ← Start here
│   ├── IMPLEMENTATION_GUIDE.md← How to integrate
│   ├── ARCHITECTURE.md        ← Diagrams
│   ├── FOLDER_STRUCTURE.md    ← File reference
│   └── VISUAL_GUIDE.md        ← This file
│
├── 📦 Types (2 files, ~300 LOC)
│   ├── module.types.ts        ← Module<T> definition
│   └── config.types.ts        ← AppConfig definition
│
├── 🧩 Components (2 files, ~630 LOC)
│   ├── ModuleContainer.tsx    ← HOC wrapper
│   └── ModuleSwitcher.tsx     ← Content switcher
│
├── 🔧 Hooks (1 file, ~280 LOC)
│   └── useModuleData.ts       ← Data fetching
│
├── 🎨 Theme (1 file, ~270 LOC)
│   └── theme.ts               ← Theme system
│
├── 🛠️ Utils (1 file, ~230 LOC)
│   └── moduleUtils.ts         ← Helpers
│
├── ⚙️ Config (3 sample files)
│   ├── learn-aptitude.config.json
│   ├── learn-govt-jobs.config.json
│   └── learn-management.config.json
│
└── 📚 Examples (1 file)
    └── usage.tsx              ← Code examples
```

---

## 🚀 Quick Integration Steps

### Step 1: Install (30 seconds)

```json
// package.json
{
  "dependencies": {
    "@iiskills/core": "workspace:*"
  }
}
```

### Step 2: Create Config (2 minutes)

```json
// config/app.config.json
{
  "id": "my-app",
  "features": {
    "isSearchable": true,
    "hasProgressTracking": true
  }
}
```

### Step 3: Use in Page (3 minutes)

```typescript
import { ModuleContainer, useModule } from '@iiskills/core';

function Page({ id }) {
  const { module, isLoading, error } = useModule(id);
  return <ModuleContainer module={module} isLoading={isLoading} error={error} />;
}
```

**Total Time: ~5 minutes** ⚡

---

## 🎨 Theme Customization

### Before (Manual CSS)

```css
/* app1.css */
.button {
  background: #3b82f6;
}
.heading {
  color: #1e3a8a;
}

/* app2.css */
.button {
  background: #10b981;
}
.heading {
  color: #065f46;
}

/* app3.css */
.button {
  background: #8b5cf6;
}
.heading {
  color: #5b21b6;
}
```

❌ Inconsistent, hard to maintain

### After (Schema-Driven Theme)

```typescript
// All apps use the same system
const theme = createTheme({
  colors: {
    primary: { 500: "#3b82f6" }, // Your brand color
  },
});

const cssVars = generateCSSVariables(theme);
```

✅ Consistent, maintainable, type-safe

---

## 📊 Statistics

```
Core Library Stats:
├─ Total Files: 18
├─ TypeScript/TSX: 8 files
├─ Configuration: 4 files
├─ Documentation: 6 files
├─ Lines of Code: ~2,800
└─ Documentation: ~42,000 words

Content Types Supported: 6
├─ lesson
├─ test
├─ job_posting
├─ quiz
├─ article
└─ video

Apps That Can Use This:
├─ learn-ai
├─ learn-aptitude
├─ learn-chemistry
├─ learn-data-science
├─ learn-geography
├─ learn-govt-jobs
├─ learn-ias
├─ learn-jee
├─ learn-leadership
├─ learn-management
├─ learn-math
├─ learn-neet
├─ learn-physics
├─ learn-pr
└─ learn-winning
   (15+ apps!)
```

---

## 🎯 Key Advantages

### 1. Type Safety

```typescript
// ❌ Without types
const module = fetchModule(id);
module.content.description; // Might not exist!

// ✅ With types
const module: Module<"lesson"> = fetchModule(id);
module.content.description; // TypeScript knows this exists!
```

### 2. Single Source of Truth

```typescript
// ❌ Before: Multiple definitions
// app1/types.ts: interface Lesson { ... }
// app2/types.ts: interface Lesson { ... }  // Might differ!

// ✅ After: One definition
import { Module } from "@iiskills/core";
```

### 3. Easy Extensibility

```typescript
// Add a new content type in ONE place
type ContentType = "lesson" | "test" | "job_posting" | "workshop"; // ← New type!

// All apps automatically support it!
```

---

## 🏆 Success Metrics

Before Schema-Driven UI:

- ❌ 15 apps with duplicate code
- ❌ Inconsistent interfaces
- ❌ Hard to add new features
- ❌ Type safety issues
- ❌ Maintenance nightmare

After Schema-Driven UI:

- ✅ Shared core library
- ✅ Consistent interfaces
- ✅ Easy feature additions
- ✅ Full type safety
- ✅ Easy maintenance

---

## 📚 Learn More

1. **Getting Started**: Read `packages/core/README.md`
2. **Implementation**: Follow `packages/core/IMPLEMENTATION_GUIDE.md`
3. **Architecture**: See `packages/core/ARCHITECTURE.md`
4. **File Structure**: Check `packages/core/FOLDER_STRUCTURE.md`

---

## 🎉 You're Ready!

With this Schema-Driven UI system, you can:

✅ Build consistent learning apps
✅ Share code across all apps
✅ Add new content types easily
✅ Maintain type safety
✅ Customize per app
✅ Deploy faster

**Next Step**: Follow the Implementation Guide to integrate into your first app!

---

_Made with ❤️ for iiskills.cloud_
