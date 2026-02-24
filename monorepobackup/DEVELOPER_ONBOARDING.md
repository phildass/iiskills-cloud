# Developer Onboarding Guide

Welcome to the IISKILLS Cloud development team! This guide will help you get started with development on our platform.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
  ```bash
  node --version  # Should be >= 18.0.0
  ```

- **Git**: For version control
  ```bash
  git --version
  ```

- **Code Editor**: We recommend VS Code with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - GitLens

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/phildass/iiskills-cloud.git
cd iiskills-cloud
```

### Step 2: Install Dependencies

The repository uses Yarn 4 (automatically via `packageManager` field):

```bash
# Install all dependencies for all apps and packages
yarn install

# This will:
# - Install dependencies for all 10 apps
# - Install dependencies for all shared packages
# - Set up Yarn 4 automatically (no separate installation needed)
```

**First time?** This may take 3-5 minutes as it installs dependencies for 10 apps + 5 packages.

### Step 3: Set Up Environment Variables

Each app needs its own environment configuration:

```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit with your credentials
nano .env.local  # or use your preferred editor
```

**Required credentials:**

1. **Supabase** (Database & Auth)
   - Sign up at https://supabase.com
   - Create a new project
   - Copy URL and keys to `.env.local`

2. **Razorpay** (Payments - optional for testing)
   - Sign up at https://razorpay.com
   - Get test keys from dashboard
   - Add to `.env.local`

3. **SendGrid** (Email - optional)
   - Sign up at https://sendgrid.com
   - Create API key
   - Add to `.env.local`

**Example `.env.local`:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay (use test keys for development)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_secret_key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Quick setup script:**
```bash
# Create env files for all apps
./ensure-env-files.sh
```

### Step 4: Set Up Database

```bash
# Run Supabase migrations
cd supabase
# Follow instructions in supabase/README.md

# Or use Supabase CLI (if installed)
supabase db push
```

**Database tables created:**
- `profiles` - User profiles
- `user_app_access` - Access control records
- `payments` - Payment transactions
- `courses` - Course metadata
- `lessons` - Lesson content
- `user_progress` - Learning progress

### Step 5: Start Development Server

```bash
# Start all apps in development mode
yarn dev

# Or start a specific app
yarn workspace main dev              # Main portal (port 3000)
yarn workspace learn-ai dev          # Learn AI (port 3024)
yarn workspace learn-apt dev         # Learn Aptitude (port 3002)
```

**Accessing apps:**
- Main portal: http://localhost:3000
- Learn AI: http://localhost:3024
- Learn Aptitude: http://localhost:3002
- Learn Chemistry: http://localhost:3005
- (See PORT_ASSIGNMENTS.md for full list)

### Step 6: Verify Setup

```bash
# Run tests to ensure everything works
yarn test

# Expected output: All tests passing
```

**If you see errors:**
- Check that all environment variables are set
- Ensure database migrations have run
- Verify Node.js version (>= 18.0.0)
- Try `yarn install` again

## 🏗️ Repository Structure

Understanding the monorepo structure is crucial:

```
iiskills-cloud/
├── apps/              # 10 Next.js applications
│   ├── main/         # Main portal
│   └── learn-*/      # Learning apps
│
├── packages/         # Shared code
│   ├── access-control/  # Access control logic
│   ├── ui/             # React components
│   ├── core/           # Core utilities (TypeScript)
│   └── schema/         # Database types (TypeScript)
│
├── .github/          # CI/CD workflows
├── supabase/         # Database migrations
├── scripts/          # Automation scripts
└── docs/             # Documentation
```

**Key concepts:**
- **Apps are independent**: Each app can be developed and deployed separately
- **Packages are shared**: Changes to packages affect all apps
- **Turborepo builds**: Only rebuilds what changed

## 📝 Development Workflow

### Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Edit files in appropriate app or package
   - Write tests for new features
   - Update documentation if needed

3. **Run tests locally:**
   ```bash
   yarn test              # Unit tests
   yarn test:e2e          # E2E tests (optional)
   yarn lint              # Linting
   yarn format:check      # Formatting
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   **Commit message format:**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring
   - `style:` - Code style changes

5. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Code Review Process

All PRs must pass automated checks:

1. ✅ **PR Template**: Use the provided template
2. ✅ **ESLint + Prettier**: Code must be properly formatted
3. ✅ **Import Validation**: Must use @iiskills/ui for components
4. ✅ **Unit Tests**: All tests must pass
5. ✅ **E2E Tests**: User flows must work (3 browsers)
6. ✅ **Security Audit**: No vulnerable dependencies
7. ✅ **Build Check**: All 10 apps must build successfully
8. ✅ **Danger.js**: Automated PR analysis

**Common PR issues:**
- Using local component imports instead of @iiskills/ui
- Missing tests for new features
- Not updating documentation
- Committing .env files

### Working with Shared Packages

**Using @iiskills/ui components:**

```javascript
// ✅ CORRECT: Import from @iiskills/ui
import { Button, Card } from '@iiskills/ui/common';
import { LoginForm } from '@iiskills/ui/authentication';
import { PaymentForm } from '@iiskills/ui/payment';

// ❌ WRONG: Local imports will fail PR checks
import Button from '../../../components/shared/Button';
```

**Using @iiskills/access-control:**

```javascript
import { 
  userHasAccess, 
  isFreeApp,
  grantBundleAccess 
} from '@iiskills/access-control';

// Check if user has access to an app
const hasAccess = await userHasAccess(userId, 'learn-ai');

// Check if app is free
const isFree = isFreeApp('learn-apt'); // true
```

**Modifying shared packages:**

```bash
# Navigate to package
cd packages/ui

# Make changes to components
# Test changes in an app
cd ../../apps/main
yarn dev

# Changes to packages are hot-reloaded
```

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage

# Run specific test file
yarn test tests/contentFilter.test.js
```

**Writing tests:**

```javascript
// Example: tests/myFeature.test.js
describe('My Feature', () => {
  it('should do something', () => {
    expect(myFunction()).toBe('expected result');
  });
});
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
yarn test:e2e

# Run in specific browser
yarn test:e2e:chrome
yarn test:e2e:firefox
yarn test:e2e:webkit

# Run in UI mode (recommended for development)
yarn test:e2e:ui

# Run in debug mode
yarn test:e2e:debug
```

**Writing E2E tests:**

```javascript
// Example: tests/e2e/myFlow.spec.js
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## 🔍 Debugging

### Common Issues

**Issue: Port already in use**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Issue: Build fails with module not found**
```bash
# Clean and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
yarn install
```

**Issue: Supabase connection fails**
- Check `.env.local` has correct credentials
- Verify Supabase project is running
- Check network connection

**Issue: Tests fail with timeout**
- Increase timeout in jest.config.js
- Check if database is accessible
- Verify test data exists

### Debugging Tools

**Next.js Debug Mode:**
```bash
NODE_OPTIONS='--inspect' yarn dev
# Open chrome://inspect in Chrome
```

**React DevTools:**
- Install React DevTools browser extension
- Inspect component props and state

**Database Query Debugging:**
- Use Supabase dashboard SQL editor
- Check query performance
- Verify RLS policies

## 📚 Key Documentation

Essential reading for new developers:

1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture overview
2. **[MONOREPO_ARCHITECTURE.md](MONOREPO_ARCHITECTURE.md)** - Monorepo structure
3. **[UNIVERSAL_ACCESS_CONTROL.md](UNIVERSAL_ACCESS_CONTROL.md)** - Access control system
4. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
5. **[docs/PR_REQUIREMENTS_GUIDE.md](docs/PR_REQUIREMENTS_GUIDE.md)** - PR requirements
6. **[E2E_TESTING_FRAMEWORK.md](E2E_TESTING_FRAMEWORK.md)** - E2E testing guide
7. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment procedures

### Quick References

- **[PORT_ASSIGNMENTS.md](PORT_ASSIGNMENTS.md)** - App port numbers
- **[ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)** - Environment setup
- **[ADDING_NEW_APP.md](ADDING_NEW_APP.md)** - Creating new apps
- **[ACCESS_CONTROL_QUICK_REFERENCE.md](ACCESS_CONTROL_QUICK_REFERENCE.md)** - Access control APIs

## 🎓 Learning Path

### Week 1: Getting Familiar
- [ ] Set up development environment
- [ ] Run all apps locally
- [ ] Explore the codebase structure
- [ ] Read ARCHITECTURE.md
- [ ] Run tests successfully

### Week 2: Making Small Changes
- [ ] Fix a small bug or typo
- [ ] Add a unit test
- [ ] Create your first PR
- [ ] Pass all automated checks
- [ ] Get your PR merged

### Week 3: Feature Development
- [ ] Add a new feature to an app
- [ ] Write comprehensive tests
- [ ] Update documentation
- [ ] Work with shared packages

### Week 4: Advanced Topics
- [ ] Modify access control logic
- [ ] Add E2E tests
- [ ] Optimize performance
- [ ] Work on payment flows

## 💡 Best Practices

### Code Style

- **Use TypeScript** for new packages and critical logic
- **Follow existing patterns** in the codebase
- **Write tests** for all new features
- **Document public APIs** with JSDoc comments
- **Use meaningful variable names**

### Component Development

```javascript
// Good: Descriptive name, clear props
function CourseCard({ title, description, price, onEnroll }) {
  return (
    <Card className="p-4">
      <h3>{title}</h3>
      <p>{description}</p>
      <Button onClick={onEnroll}>
        Enroll - ₹{price}
      </Button>
    </Card>
  );
}

// Bad: Unclear, no types, inline styles
function CC({ t, d, p, fn }) {
  return (
    <div style={{ padding: '16px' }}>
      <h3>{t}</h3>
      <button onClick={fn}>{p}</button>
    </div>
  );
}
```

### Database Queries

```javascript
// Good: Parameterized query
const { data } = await supabase
  .from('courses')
  .select('*')
  .eq('id', courseId);

// Bad: String concatenation (SQL injection risk)
const query = `SELECT * FROM courses WHERE id = '${courseId}'`;
```

### Error Handling

```javascript
// Good: Proper error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  return { error: 'Something went wrong' };
}

// Bad: Swallowing errors
try {
  await riskyOperation();
} catch (e) {
  // Silent failure
}
```

## 🆘 Getting Help

### Resources

- **Documentation**: Check docs/ folder first
- **Code Examples**: Look at existing apps
- **GitHub Issues**: Search for similar issues
- **PR History**: See how others solved problems

### Team Communication

- **Slack/Discord**: #iiskills-dev channel
- **GitHub Discussions**: For longer discussions
- **Code Review Comments**: Ask questions on PRs
- **Weekly Standup**: Share blockers

### Common Questions

**Q: Which app should I modify?**
A: Depends on the feature. Main portal for catalog, specific learning app for course content.

**Q: Should this be a shared component?**
A: If used in 2+ apps, make it shared. Otherwise, keep it app-specific.

**Q: How do I add a new learning app?**
A: See [ADDING_NEW_APP.md](ADDING_NEW_APP.md) for step-by-step guide.

**Q: Can I update dependencies?**
A: Yes, but check for security issues first with `npm audit`.

## ✅ Checklist: First Week

By the end of your first week, you should have:

- [ ] Cloned repository and installed dependencies
- [ ] Set up environment variables for all apps
- [ ] Run database migrations successfully
- [ ] Started all apps locally
- [ ] Read ARCHITECTURE.md
- [ ] Run tests (unit + E2E)
- [ ] Made a small code change
- [ ] Created and merged your first PR
- [ ] Understood the monorepo structure
- [ ] Familiarized with CI/CD checks

## 🎉 Welcome!

You're now ready to start contributing to IISKILLS Cloud! Remember:

- **Ask questions** - Better to ask than to make wrong assumptions
- **Read the docs** - Most answers are already documented
- **Test thoroughly** - All changes should have tests
- **Follow conventions** - Consistency is key
- **Be patient** - The codebase is large, but you'll learn it

Happy coding! 🚀
