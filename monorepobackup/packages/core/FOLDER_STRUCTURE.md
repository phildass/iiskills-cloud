# Schema-Driven UI: Folder Structure & Architecture

## 📁 Complete Folder Structure

```
packages/core/                          # Core shared library
│
├── types/                              # TypeScript type definitions
│   ├── module.types.ts                 # Module data structures & interfaces
│   │   ├── Module<T> interface         # Main module type with discriminated unions
│   │   ├── ContentType                 # Union type for content types
│   │   ├── LessonContent               # Lesson-specific data structure
│   │   ├── TestContent                 # Test/Quiz-specific data structure
│   │   ├── JobPostingContent           # Job posting-specific data structure
│   │   ├── ModuleMetadata              # Common metadata interface
│   │   ├── ModuleCollection            # Paginated collection interface
│   │   └── ModuleFilters               # Filtering options interface
│   │
│   └── config.types.ts                 # App configuration types
│       ├── AppConfig                   # Main app configuration interface
│       ├── FeatureFlags                # Feature toggle interface
│       ├── NavigationConfig            # Navigation settings
│       ├── ContentConfig               # Content settings
│       ├── BrandingConfig              # Branding settings
│       ├── APIConfig                   # API endpoint configuration
│       ├── AnalyticsConfig             # Analytics configuration
│       └── createDefaultConfig()       # Factory function for default config
│
├── components/                         # React components
│   ├── ModuleContainer.tsx             # Higher-Order Component (HOC)
│   │   ├── Handles loading states
│   │   ├── Handles error states
│   │   ├── Displays metadata
│   │   └── Wraps ModuleSwitcher
│   │
│   └── ModuleSwitcher.tsx              # Smart content renderer
│       ├── Uses switch statement to render based on content_type
│       ├── DefaultLessonRenderer       # Built-in lesson renderer
│       ├── DefaultTestRenderer         # Built-in test renderer
│       ├── DefaultJobPostingRenderer   # Built-in job posting renderer
│       └── DefaultFallbackRenderer     # Fallback for unknown types
│
├── hooks/                              # Custom React hooks
│   └── useModuleData.ts                # Standardized API hook
│       ├── useModuleData()             # Fetch multiple modules
│       │   ├── Filtering support
│       │   ├── Pagination support
│       │   ├── Caching support
│       │   └── Auto-fetch option
│       │
│       └── useModule(id)               # Fetch single module by ID
│
├── theme/                              # Theme configuration
│   └── theme.ts                        # Global theme system
│       ├── Theme interface             # Complete theme structure
│       ├── ColorPalette                # Color definitions
│       ├── Typography                  # Font settings
│       ├── Spacing                     # Spacing scale
│       ├── BorderRadius                # Border radius values
│       ├── Shadows                     # Shadow definitions
│       ├── Breakpoints                 # Responsive breakpoints
│       ├── defaultTheme                # Default theme object
│       ├── createTheme()               # Theme customization function
│       ├── generateCSSVariables()      # CSS variables generator
│       └── generateTailwindConfig()    # Tailwind config generator
│
├── config/                             # Sample app configurations
│   ├── learn-aptitude.config.json      # Aptitude app configuration
│   │   ├── Features: Progress tracking, certificates, AI assistant
│   │   ├── Content types: lesson, test, quiz
│   │   └── Custom: Test modes, career guidance
│   │
│   ├── learn-govt-jobs.config.json     # Government jobs app configuration
│   │   ├── Features: Search, bookmarks, social sharing
│   │   ├── Content types: job_posting, lesson, article
│   │   └── Custom: Job categories, application alerts
│   │
│   └── learn-management.config.json    # Management app configuration
│       ├── Features: Certificates, comments, progress tracking
│       ├── Content types: lesson, article, video
│       └── Custom: Course categories, discussions
│
├── utils/                              # Utility functions
│   └── moduleUtils.ts                  # Module utility functions
│       ├── sortModules()               # Sort modules by field
│       ├── filterByContentType()       # Filter by content type
│       ├── filterByTags()              # Filter by tags
│       ├── searchModules()             # Full-text search
│       ├── applyFilters()              # Apply multiple filters
│       ├── groupByContentType()        # Group modules
│       ├── getUniqueTags()             # Extract unique tags
│       ├── getEstimatedTime()          # Calculate duration
│       ├── formatMetadata()            # Format metadata for display
│       ├── validateModule()            # Validate module structure
│       ├── createExcerpt()             # Create summary
│       └── calculateProgress()         # Calculate completion %
│
├── examples/                           # Usage examples
│   └── usage.tsx                       # Complete usage examples
│       ├── BasicModuleExample          # Basic module display
│       ├── ModuleListExample           # Module list with filtering
│       ├── CustomRendererExample       # Custom renderer example
│       ├── AppConfigExample            # Configuration usage
│       └── Sample module data          # Example module objects
│
├── index.ts                            # Main export file
├── package.json                        # Package configuration
├── tsconfig.json                       # TypeScript configuration
└── README.md                           # Comprehensive documentation
```

## 🏛️ Architecture Layers

### 1. Data Layer (types/)
- **Purpose**: Define the shape of all data structures
- **Key Concept**: Discriminated unions for type safety
- **Files**: module.types.ts, config.types.ts

### 2. Logic Layer (hooks/, utils/)
- **Purpose**: Handle data fetching and transformations
- **Key Concept**: Reusable hooks and utility functions
- **Files**: useModuleData.ts, moduleUtils.ts

### 3. Presentation Layer (components/)
- **Purpose**: Render UI based on data and config
- **Key Concept**: Schema-driven rendering with switch statements
- **Files**: ModuleContainer.tsx, ModuleSwitcher.tsx

### 4. Configuration Layer (config/, theme/)
- **Purpose**: Define app-specific settings and styling
- **Key Concept**: JSON-based configuration, CSS variables
- **Files**: *.config.json, theme.ts

## 🔄 Data Flow

```
1. App loads config
   ↓
2. useModuleData() fetches data from API
   ↓
3. Data validated against Module<T> types
   ↓
4. ModuleContainer receives module
   ↓
5. ModuleSwitcher determines renderer based on content_type
   ↓
6. Appropriate renderer displays content
   ↓
7. Theme applied via CSS variables
```

## 🎨 How Content Types Work

Each content type has:
1. **Type Definition** (in module.types.ts)
2. **Default Renderer** (in ModuleSwitcher.tsx)
3. **Custom Renderer** (optional, app-specific)

Example flow for a lesson:
```
Module<'lesson'> → ModuleSwitcher → DefaultLessonRenderer or CustomLessonRenderer
```

## 🔧 Extension Points

Apps can customize:

1. **Renderers**: Provide custom components for any content type
2. **Config**: Toggle features, branding, navigation
3. **Theme**: Override colors, fonts, spacing
4. **API**: Change endpoints, add custom fetching logic

## 📦 Usage in Apps

### Step 1: Install
Add to app's package.json:
```json
{
  "dependencies": {
    "@iiskills/core": "workspace:*"
  }
}
```

### Step 2: Configure
Create `config/app.config.json` based on templates

### Step 3: Import & Use
```typescript
import { ModuleContainer, useModule } from '@iiskills/core';
```

### Step 4: Customize
Override renderers, theme, or configuration as needed

## 🌟 Key Benefits

1. **Type Safety**: Full TypeScript support prevents errors
2. **Consistency**: Same structure across all apps
3. **Reusability**: Share components and logic
4. **Flexibility**: Each app can customize as needed
5. **Maintainability**: Single source of truth for types
6. **Scalability**: Easy to add new content types

## 📚 File Responsibilities

| File | Responsibility | Size |
|------|---------------|------|
| module.types.ts | Define all module data structures | ~150 LOC |
| config.types.ts | Define configuration structure | ~180 LOC |
| useModuleData.ts | Data fetching hook with caching | ~280 LOC |
| ModuleContainer.tsx | HOC with loading/error states | ~230 LOC |
| ModuleSwitcher.tsx | Content-type-based renderer | ~400 LOC |
| theme.ts | Theme system with CSS variables | ~270 LOC |
| moduleUtils.ts | Utility functions for modules | ~230 LOC |

Total: ~1,740 lines of reusable code
