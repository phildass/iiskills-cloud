# Quick Reference: Path Aliases in iiskills-cloud

## Available Path Aliases

All learning apps and shared components can now use these path aliases:

```javascript
// Shared components (from components/shared/)
import UniversalLogin from "@shared/UniversalLogin";
import SharedNavbar from "@shared/SharedNavbar";
import SubdomainNavbar from "@shared/SubdomainNavbar";
import AIAssistant from "@shared/AIAssistant";

// General components (from components/)
import ErrorBoundary from "@components/ErrorBoundary";
import PaidUserProtectedRoute from "@components/PaidUserProtectedRoute";

// Library functions (from lib/)
import { getCurrentUser, signInWithEmail } from "@lib/supabaseClient";
import { getCurrentApp } from "@lib/appRegistry";
import { recordLoginApp } from "@lib/sessionManager";

// Utilities (from utils/)
import { genderOptions, countries } from "@utils/data";
```

## Before and After Examples

### Example 1: App Page Import
```javascript
// ❌ BEFORE (Relative paths)
import SharedNavbar from "../../components/shared/SharedNavbar";
import { getCurrentUser } from "../../lib/supabaseClient";

// ✅ AFTER (Absolute aliases)
import SharedNavbar from "@shared/SharedNavbar";
import { getCurrentUser } from "@lib/supabaseClient";
```

### Example 2: Shared Component Import
```javascript
// ❌ BEFORE (Relative paths in shared components)
import { signInWithEmail } from "../../lib/supabaseClient";
import { getCurrentApp } from "../../lib/appRegistry";

// ✅ AFTER (Absolute aliases)
import { signInWithEmail } from "@lib/supabaseClient";
import { getCurrentApp } from "@lib/appRegistry";
```

## Local Imports

For app-specific files, continue using relative imports:

```javascript
// Local component (stays relative)
import Footer from "../components/Footer";

// Local utility (stays relative)
import { getLandingPageImages } from "../lib/imageUtils";
```

## IDE Configuration

The path aliases are configured in:
- Root: `jsconfig.json`
- Each learning app: `jsconfig.json` or `tsconfig.json`

Your IDE should automatically provide:
- ✅ Autocomplete for path aliases
- ✅ Go-to-definition support
- ✅ Import suggestions
- ✅ Error detection

## Build Configuration

All apps use Turbopack with proper root configuration:

```javascript
// next.config.js (for JS apps)
const path = require('path');
module.exports = {
  experimental: {
    turbopack: {
      root: path.resolve(__dirname, '../../'),
    },
  },
};
```

## Troubleshooting

### Issue: Import not found
**Solution**: Make sure you're using the correct alias prefix:
- `@shared/*` for shared components
- `@components/*` for general components
- `@lib/*` for library functions
- `@utils/*` for utilities

### Issue: Build fails with module not found
**Solution**: 
1. Check that `jsconfig.json` exists in your app directory
2. Verify `baseUrl: "../.."` is set correctly
3. Restart your IDE/editor

### Issue: Local imports don't work
**Solution**: Local app-specific files should use relative paths (e.g., `../components/Footer`), not path aliases.

## Migration Checklist

When creating a new learning app:
- [ ] Copy `jsconfig.json` from an existing learning app
- [ ] Add Turbopack configuration to `next.config.js`
- [ ] Use `@shared/*` for all shared component imports
- [ ] Use `@lib/*` for all library function imports
- [ ] Keep local imports relative (e.g., `../components/Footer`)
- [ ] Test build with `yarn build`

## Benefits

✅ **Easier to maintain** - No more counting `../../` levels
✅ **IDE friendly** - Better autocomplete and navigation
✅ **Consistent** - Same import pattern across all apps
✅ **Refactor safe** - Moving files won't break imports
✅ **Better DX** - Developers can focus on code, not paths
