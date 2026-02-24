# Portal Enhancement - Developer Extension Guide

## 🔧 How to Extend Portal Features

This guide provides instructions for developers who want to extend, modify, or add to the portal enhancement features.

---

## Adding New Apps to the Portal

### Step 1: Update UserProgressContext.js

Add your new app to the `INITIAL_APPS` array:

```javascript
{
  id: "learn-your-app",
  name: "Learn Your App",
  category: "YourCategory", // e.g., "Technology", "Science", "Professional"
  color: "#HEX_COLOR", // Choose a unique color
  progress: {
    basics: 0,
    intermediate: 0,
    advanced: 0,
  },
  connections: ["learn-related-app1", "learn-related-app2"], // Apps this connects to
  microQuiz: {
    question: "Your quiz question?",
    options: ["Option 1", "Option 2", "Option 3"],
    correctAnswer: 0, // Index of correct answer (0, 1, or 2)
  },
}
```

### Step 2: Add Tagline (Optional)

In `UniversalProgressDashboard.js`, add a tagline:

```javascript
const APP_TAGLINES = {
  // ... existing taglines
  "learn-your-app": "Welcome back, Your Custom Title",
};
```

### Step 3: Add Search Content (Optional)

In `MagicSearchBar.js`, add modules/lessons:

```javascript
const SEARCH_DATA = [
  // ... existing items
  { id: 21, title: "Your Module Name", app: "learn-your-app", type: "module" },
  { id: 22, title: "Your Lesson Name", app: "learn-your-app", type: "lesson" },
];
```

### Step 4: Add Cross-Pollination Bridges (Optional)

In `CrossPollinationFeed.js`, add connections:

```javascript
const BRIDGE_DATA = [
  // ... existing bridges
  {
    id: 5,
    from: "Learn Your App",
    to: "Learn Related App",
    fromModule: "Your Module",
    toModule: "Related Module",
    description: "How they connect...",
    stats: "X,XXX users",
  },
];
```

---

## Customizing Visual Appearance

### Changing Colors

Edit `tailwind.config.js` in the root directory:

```javascript
theme: {
  extend: {
    colors: {
      primary: "#YOUR_PRIMARY_COLOR",
      accent: "#YOUR_ACCENT_COLOR",
      // Add new colors
      "your-custom-color": "#HEX_CODE",
    },
  },
},
```

Use in components:

```jsx
<div className="bg-your-custom-color text-white">...</div>
```

### Adjusting Animations

All animations use Framer Motion. Common patterns:

```jsx
// Change duration
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 1.0 }} // Increase for slower
>

// Change animation type
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", bounce: 0.5 }}
>

// Disable animation
<motion.div
  initial={false}
  animate={false}
>
```

### Modifying Layout

**Bento Grid Columns:**

Edit `BentoBoxGrid.js`:

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
  {/* Change lg:grid-cols-5 to desired column count */}
</div>
```

**Dashboard Layout:**

Edit `index.js` in the portal section:

```jsx
<div className="grid lg:grid-cols-2 gap-8">
  {/* Change grid-cols ratio for different layouts */}
  <div className="lg:col-span-1">...</div>
</div>
```

---

## Integrating Real API Data

### Step 1: Create API Service

Create `apps/main/services/progressService.js`:

```javascript
export async function fetchUserProgress(userId) {
  const response = await fetch(`/api/progress/${userId}`);
  return response.json();
}

export async function updateUserProgress(userId, appId, level, value) {
  const response = await fetch(`/api/progress/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appId, level, value }),
  });
  return response.json();
}
```

### Step 2: Update UserProgressContext

Replace mock data with API calls:

```javascript
export function UserProgressProvider({ children }) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await fetchUserProgress(userId);
        setApps(data.apps);
      } catch (error) {
        console.error("Failed to load progress:", error);
        // Fallback to INITIAL_APPS
        setApps(INITIAL_APPS);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  const updateProgress = async (appId, level, value) => {
    // Optimistic update
    setApps(prevApps => /* update logic */);
    
    // API call
    try {
      await updateUserProgress(userId, appId, level, value);
    } catch (error) {
      console.error("Failed to update progress:", error);
      // Revert on error
    }
  };

  if (loading) return <div>Loading...</div>;

  return <UserProgressContext.Provider value={value}>
    {children}
  </UserProgressContext.Provider>;
}
```

### Step 3: Create Backend API

Example Next.js API route (`pages/api/progress/[userId].js`):

```javascript
export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    // Fetch from database
    const progress = await db.progress.findByUser(userId);
    res.json(progress);
  }

  if (req.method === 'PUT') {
    // Update database
    const { appId, level, value } = req.body;
    await db.progress.update(userId, appId, level, value);
    res.json({ success: true });
  }
}
```

---

## Adding New Portal Features

### Example: Add a Leaderboard Component

**Step 1: Create Component**

`apps/main/components/portal/Leaderboard.js`:

```javascript
import { motion } from "framer-motion";
import { useUserProgress } from "../../contexts/UserProgressContext";

export default function Leaderboard() {
  const { apps } = useUserProgress();

  // Calculate top users (mock data)
  const topUsers = [
    { name: "User 1", score: 85, avatar: "👤" },
    { name: "User 2", score: 78, avatar: "👤" },
    { name: "User 3", score: 72, avatar: "👤" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-xl p-6"
    >
      <h2 className="text-2xl font-bold text-primary mb-4">
        Top Learners This Week
      </h2>
      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
          >
            <span className="text-3xl">{user.avatar}</span>
            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.score}% avg progress</p>
            </div>
            <span className="text-2xl">#{index + 1}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
```

**Step 2: Import and Use**

In `apps/main/pages/index.js`:

```javascript
import Leaderboard from "../components/portal/Leaderboard";

// Add to the portal section
<div className="grid lg:grid-cols-2 gap-8 mb-12">
  <UniversalProgressDashboard />
  <Leaderboard />
</div>
```

---

## Performance Optimization Tips

### 1. Memoize Heavy Computations

```javascript
import { useMemo } from "react";

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    // Heavy computation here
    return data.map(item => /* process */);
  }, [data]); // Only recompute when data changes

  return <div>{/* Use processedData */}</div>;
}
```

### 2. Lazy Load Components

```javascript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});
```

### 3. Debounce User Input

```javascript
import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in search
const [searchQuery, setSearchQuery] = useState("");
const debouncedQuery = useDebounce(searchQuery, 300);
```

### 4. Virtualize Long Lists

For very long lists (100+ items), use virtualization:

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from "react-window";

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

---

## Testing Portal Components

### Unit Testing Example

Create `apps/main/components/portal/__tests__/BentoBoxGrid.test.js`:

```javascript
import { render, screen } from "@testing-library/react";
import { UserProgressProvider } from "../../../contexts/UserProgressContext";
import BentoBoxGrid from "../BentoBoxGrid";

describe("BentoBoxGrid", () => {
  it("renders all app tiles", () => {
    render(
      <UserProgressProvider>
        <BentoBoxGrid />
      </UserProgressProvider>
    );

    expect(screen.getByText("Learn AI")).toBeInTheDocument();
    expect(screen.getByText("Learn Math")).toBeInTheDocument();
  });

  it("shows micro-quiz on hover", async () => {
    // Test hover interaction
  });
});
```

### E2E Testing Example

Using Playwright:

```javascript
test("portal features are interactive", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Test search bar
  await page.click('button:has-text("Search Skills")');
  await page.fill('input[placeholder*="Search"]', "Python");
  await expect(page.locator('text=HTML & CSS')).toBeVisible();

  // Test galaxy map
  await page.click('button:has-text("Expand")');
  await expect(page.locator('.skill-galaxy-map')).toHaveClass(/h-\[600px\]/);
});
```

---

## Accessibility Checklist

When extending features, ensure:

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels on icon-only buttons
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Alt text on images
- [ ] Semantic HTML (headings, lists, etc.)
- [ ] Form labels associated with inputs
- [ ] Error messages are clear and linked to fields
- [ ] Content is readable at 200% zoom
- [ ] Supports reduced motion preference

### Example: Reduced Motion

```javascript
import { useReducedMotion } from "framer-motion";

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? false : { opacity: 1 }}
    >
      Content
    </motion.div>
  );
}
```

---

## Troubleshooting Common Issues

### Issue: Components Not Rendering

**Check:**
1. Import paths are correct
2. Component is exported (default or named)
3. UserProgressProvider wraps the component tree
4. No console errors

### Issue: State Not Updating

**Check:**
1. Using `setApps` to update state, not mutating directly
2. Context provider is above the consuming component
3. Dependencies array in `useEffect` is correct
4. No infinite loops in useEffect

### Issue: Poor Performance

**Check:**
1. Memoize expensive calculations with `useMemo`
2. Use `React.memo` for components that don't need frequent updates
3. Avoid inline function definitions in render
4. Use `useCallback` for event handlers
5. Check for unnecessary re-renders with React DevTools

### Issue: Build Errors

**Check:**
1. All dependencies are installed (`npm install`)
2. Import paths match actual file structure
3. No syntax errors (check ESLint)
4. TypeScript types if using TS
5. Next.js version compatibility

---

## Best Practices

### Code Organization
- One component per file
- Group related components in folders
- Use index.js for barrel exports
- Keep components under 300 lines

### State Management
- Lift state to appropriate level
- Use Context for truly global state
- Consider local state first
- Avoid prop drilling with composition

### Styling
- Use Tailwind utility classes
- Extract repeated patterns to components
- Use safelist for dynamic classes
- Follow existing color scheme

### Performance
- Lazy load below the fold
- Optimize images
- Minimize bundle size
- Use production builds for testing

---

## Resources

### Documentation
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Recharts Documentation](https://recharts.org/)
- [React Force Graph](https://github.com/vasturiano/react-force-graph)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tools
- React DevTools (browser extension)
- Next.js DevTools
- Lighthouse (performance auditing)
- axe DevTools (accessibility testing)

### Community
- GitHub Issues for bug reports
- Discussions for feature requests
- Stack Overflow for questions

---

## Contributing

When contributing new features:

1. Follow existing code style
2. Add tests for new components
3. Update documentation
4. Ensure accessibility
5. Test on multiple browsers/devices
6. Create clear commit messages
7. Submit PR with description

---

## License

This portal enhancement is part of the iiskills.cloud project. See LICENSE file for details.
