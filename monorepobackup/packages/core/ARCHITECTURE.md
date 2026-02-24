# Schema-Driven UI Architecture Diagrams

## System Architecture Overview

```mermaid
graph TB
    subgraph "Apps Layer"
        A1[Learn Aptitude App]
        A2[Learn Government Jobs App]
        A3[Learn Management App]
        A4[Other Apps...]
    end
    
    subgraph "Core Library (@iiskills/core)"
        subgraph "Types Layer"
            T1[Module Types]
            T2[Config Types]
        end
        
        subgraph "Components Layer"
            C1[ModuleContainer]
            C2[ModuleSwitcher]
        end
        
        subgraph "Hooks Layer"
            H1[useModuleData]
            H2[useModule]
        end
        
        subgraph "Theme Layer"
            TH1[Theme System]
            TH2[CSS Variables]
        end
        
        subgraph "Utils Layer"
            U1[Module Utils]
        end
    end
    
    subgraph "Backend"
        API[API Endpoints]
        DB[(Database)]
    end
    
    A1 --> C1
    A2 --> C1
    A3 --> C1
    A4 --> C1
    
    A1 --> H1
    A2 --> H1
    A3 --> H1
    
    C1 --> C2
    C2 --> T1
    H1 --> API
    H2 --> API
    API --> DB
    
    A1 -.uses.-> T2
    A2 -.uses.-> T2
    A3 -.uses.-> T2
    
    A1 -.applies.-> TH1
    A2 -.applies.-> TH1
    A3 -.applies.-> TH1
```

## Module Data Flow

```mermaid
sequenceDiagram
    participant App
    participant Hook as useModuleData Hook
    participant Cache
    participant API
    participant Container as ModuleContainer
    participant Switcher as ModuleSwitcher
    participant Renderer as Content Renderer
    
    App->>Hook: useModuleData(options)
    Hook->>Cache: Check cache
    
    alt Cache Hit
        Cache-->>Hook: Return cached data
    else Cache Miss
        Hook->>API: Fetch modules
        API-->>Hook: Return modules
        Hook->>Cache: Store in cache
    end
    
    Hook-->>App: Return {modules, isLoading, ...}
    App->>Container: Pass module
    Container->>Switcher: Pass module
    Switcher->>Switcher: Switch on content_type
    
    alt content_type === 'lesson'
        Switcher->>Renderer: Render LessonRenderer
    else content_type === 'test'
        Switcher->>Renderer: Render TestRenderer
    else content_type === 'job_posting'
        Switcher->>Renderer: Render JobPostingRenderer
    else custom type
        Switcher->>Renderer: Render CustomRenderer
    end
    
    Renderer-->>App: Display content
```

## Content Type Switching

```mermaid
flowchart TD
    Start[Module Received] --> Switch{Check content_type}
    
    Switch -->|lesson| L[Lesson Renderer]
    Switch -->|test| T[Test Renderer]
    Switch -->|job_posting| J[Job Posting Renderer]
    Switch -->|quiz| Q[Quiz Renderer]
    Switch -->|article| A[Article Renderer]
    Switch -->|video| V[Video Renderer]
    Switch -->|unknown| F[Fallback Renderer]
    
    L --> Display[Display Content]
    T --> Display
    J --> Display
    Q --> Display
    A --> Display
    V --> Display
    F --> Display
    
    Display --> End[User Views Content]
```

## Module Type Hierarchy

```mermaid
classDiagram
    class Module {
        +string id
        +string title
        +ContentType content_type
        +ModuleMetadata metadata
        +status status
        +boolean isPublic
        +any content
    }
    
    class ModuleMetadata {
        +string createdAt
        +string updatedAt
        +string author
        +string[] tags
        +difficulty difficulty
        +number estimatedDuration
    }
    
    class LessonContent {
        +string description
        +string[] objectives
        +string[] prerequisites
        +Material[] materials
        +Section[] sections
    }
    
    class TestContent {
        +string description
        +testMode testMode
        +number duration
        +number totalQuestions
        +number passingScore
        +string[] instructions
        +Question[] questions
    }
    
    class JobPostingContent {
        +string company
        +string location
        +employmentType employmentType
        +Salary salary
        +string description
        +string[] requirements
        +string[] responsibilities
    }
    
    Module --> ModuleMetadata
    Module --> LessonContent : content_type = 'lesson'
    Module --> TestContent : content_type = 'test'
    Module --> JobPostingContent : content_type = 'job_posting'
```

## App Configuration Structure

```mermaid
graph LR
    subgraph "App Config"
        AC[AppConfig]
        
        AC --> FF[Feature Flags]
        AC --> NC[Navigation Config]
        AC --> CC[Content Config]
        AC --> BC[Branding Config]
        AC --> API[API Config]
        AC --> AN[Analytics Config]
        
        FF --> F1[isSearchable]
        FF --> F2[hasProgressTracking]
        FF --> F3[hasCertificates]
        FF --> F4[enablePaywall]
        
        NC --> N1[depth]
        NC --> N2[showBreadcrumbs]
        NC --> N3[menuItems]
        
        CC --> C1[supportedTypes]
        CC --> C2[defaultType]
        
        BC --> B1[appName]
        BC --> B2[primaryColor]
        BC --> B3[logo]
    end
```

## Theme System Architecture

```mermaid
graph TB
    subgraph "Theme Definition"
        TD[Theme Object]
        TD --> Colors
        TD --> Typography
        TD --> Spacing
        TD --> BorderRadius
        TD --> Shadows
    end
    
    subgraph "Generation"
        TD --> Gen1[generateCSSVariables]
        TD --> Gen2[generateTailwindConfig]
    end
    
    subgraph "Application"
        Gen1 --> CSS[CSS Variables in :root]
        Gen2 --> TW[Tailwind Config]
        
        CSS --> App1[App Styles]
        TW --> App2[Tailwind Classes]
    end
    
    subgraph "Usage"
        App1 --> UI1[UI Components]
        App2 --> UI2[UI Components]
    end
```

## Component Hierarchy

```mermaid
graph TD
    App[App Component] --> MC[ModuleContainer]
    
    MC --> Loading{isLoading?}
    Loading -->|true| LS[Loading State]
    Loading -->|false| Error{error?}
    
    Error -->|true| ES[Error State]
    Error -->|false| Empty{module exists?}
    
    Empty -->|false| EmptyS[Empty State]
    Empty -->|true| Metadata[Module Metadata Display]
    
    Metadata --> MS[ModuleSwitcher]
    
    MS --> Switch{content_type}
    Switch -->|lesson| LR[Lesson Renderer]
    Switch -->|test| TR[Test Renderer]
    Switch -->|job_posting| JR[Job Posting Renderer]
    Switch -->|other| CR[Custom/Fallback Renderer]
    
    style MC fill:#e1f5ff
    style MS fill:#fff4e1
    style LR fill:#e8f5e9
    style TR fill:#e8f5e9
    style JR fill:#e8f5e9
    style CR fill:#e8f5e9
```

## Usage Pattern: From Data to UI

```mermaid
flowchart LR
    subgraph "1. Data Definition"
        D1[Define Module<'lesson'>]
    end
    
    subgraph "2. Data Fetching"
        D2[useModuleData hook]
        D3[API Call]
        D4[Type Validation]
    end
    
    subgraph "3. State Management"
        S1[Loading State]
        S2[Data State]
        S3[Error State]
    end
    
    subgraph "4. Rendering"
        R1[ModuleContainer]
        R2[ModuleSwitcher]
        R3[LessonRenderer]
    end
    
    subgraph "5. Display"
        U1[User Interface]
    end
    
    D1 --> D2
    D2 --> D3
    D3 --> D4
    D4 --> S1
    S1 --> S2
    S2 --> R1
    R1 --> R2
    R2 --> R3
    R3 --> U1
    
    S3 -.error.-> R1
```

## Folder Structure Visualization

```
packages/core/
├── 📄 index.ts                 (Main export)
├── 📦 package.json
├── 🔧 tsconfig.json
├── 📖 README.md
├── 📋 FOLDER_STRUCTURE.md
│
├── 📁 types/                   (Type Definitions)
│   ├── module.types.ts         ⭐ Module<T> interface
│   └── config.types.ts         ⭐ AppConfig interface
│
├── 📁 components/              (React Components)
│   ├── ModuleContainer.tsx     ⭐ HOC wrapper
│   └── ModuleSwitcher.tsx      ⭐ Content switcher
│
├── 📁 hooks/                   (Custom Hooks)
│   └── useModuleData.ts        ⭐ Data fetching hook
│
├── 📁 theme/                   (Theming)
│   └── theme.ts                ⭐ Theme system
│
├── 📁 utils/                   (Utilities)
│   └── moduleUtils.ts          🛠️ Helper functions
│
├── 📁 config/                  (Sample Configs)
│   ├── learn-aptitude.config.json
│   ├── learn-govt-jobs.config.json
│   └── learn-management.config.json
│
└── 📁 examples/                (Usage Examples)
    └── usage.tsx
```

## Extension Pattern

```mermaid
graph TB
    subgraph "Core Library (Base)"
        Core[Core Components]
        Types[Core Types]
        Hooks[Core Hooks]
    end
    
    subgraph "App 1: Learn Aptitude"
        A1Config[Custom Config]
        A1Renderer[Custom Test Renderer]
        A1Theme[Custom Theme]
    end
    
    subgraph "App 2: Learn Govt Jobs"
        A2Config[Custom Config]
        A2Renderer[Custom Job Renderer]
        A2Theme[Custom Theme]
    end
    
    subgraph "App 3: Learn Management"
        A3Config[Custom Config]
        A3Renderer[Custom Lesson Renderer]
        A3Theme[Custom Theme]
    end
    
    Core --> A1Config
    Core --> A2Config
    Core --> A3Config
    
    Types --> A1Renderer
    Types --> A2Renderer
    Types --> A3Renderer
    
    Hooks --> A1Config
    Hooks --> A2Config
    Hooks --> A3Config
    
    style Core fill:#4CAF50
    style A1Config fill:#2196F3
    style A2Config fill:#FF9800
    style A3Config fill:#9C27B0
```
