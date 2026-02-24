# Learn Biology - Deployment & Launch Guide 🧬

## Overview
Learn Biology is the 12th app in the iiskills ecosystem and the 6th Foundation app (free forever). It completes the science trilogy alongside Physics and Chemistry.

## App Configuration
- **App ID**: `learn-biology`
- **Port**: 3026
- **Subdomain**: app12.learn-biology.iiskills.cloud
- **Theme**: Moss Green (#2E7D32) & Oxygen White
- **Suite**: Foundation (Free Forever)
- **Position**: 12th app in iiskills ecosystem

## What Was Built

### 1. Core App Structure
```
apps/learn-biology/
├── components/         # Navbar, Footer, ModuleCard
├── lib/               # supabaseClient, accessCode
├── pages/
│   ├── api/           # Health check, assessment routes
│   ├── modules/       # Dynamic lesson pages
│   ├── _app.js        # App wrapper with SiteHeader
│   ├── _document.js   # HTML document
│   ├── index.js       # Landing page
│   ├── curriculum.js  # Full course overview
│   └── onboarding.js  # User personalization
├── public/images/     # 3 hero images + logos
├── styles/            # Moss Green theme, DNA animation
└── Configuration files (package.json, next.config.js, tailwind.config.js, etc.)
```

### 2. Content & Features
- **Module 1: Cell Logic (Basic)**
  - Lesson 1: Introduction to Cells (FREE SAMPLE)
  - Lesson 2: Cellular Organelles
  - Lesson 3: Cell Membrane & Transport
  - Gatekeeper: Level 1 Cell Mastery Test

- **Module 2: Body Systems (Intermediate)**
  - 4 lessons on Circulatory, Respiratory, Nervous, Digestive systems
  - Gatekeeper: Level 2 Systems Integration Test

- **Module 3: Genetics & Ecology (Advanced)**
  - 4 lessons on DNA, Inheritance, Evolution, Ecosystems
  - Gatekeeper: Level 3 Advanced Biology Test

### 3. Universal Features
✅ Tri-Level Progression System
✅ Gatekeeper Tests
✅ Sample Engine (Free Module 1, Lesson 1)
✅ XP & Badge System (Cellular Architect, Systems Coordinator, Genetics Strategist)
✅ Cross-App Integration (Chemistry, Physics)
✅ Living Logic Widget (Cell power optimization puzzle)
✅ Foundation Badge (🟢 Free Forever)
✅ Progress Tracking
✅ Onboarding Flow
✅ WCAG Accessibility

### 4. Monorepo Integration Updates
✅ HeroManager.js - Added Biology images
✅ UserProgressContext.js - Added Biology with connections
✅ BentoBoxGrid.js - Added app12 subdomain mapping
✅ BentoBoxGrid.js - Added Biology to scientist path
✅ ecosystem.config.js - Added PM2 config for port 3026
✅ Main landing page - Added Biology to Foundation section

## Deployment Steps

### 1. Pre-Deployment Checklist
- [x] App builds successfully (`yarn build`)
- [x] All images in place (3 hero images)
- [x] Configuration files created
- [x] .env.local.example provided
- [x] Monorepo integration complete
- [x] PM2 configuration added
- [ ] .env.local created with actual Supabase credentials (if needed)

### 2. Build & Deploy
```bash
# From monorepo root
cd /home/runner/work/iiskills-cloud/iiskills-cloud

# Install dependencies (if not already done)
yarn install

# Build Learn Biology
cd apps/learn-biology
yarn build

# Or build from root using turbo
cd ../../
yarn build

# Start with PM2 (production)
pm2 start ecosystem.config.js --only iiskills-learn-biology

# Or start all apps
pm2 start ecosystem.config.js
```

### 3. Environment Variables
Copy `.env.local.example` to `.env.local` and configure:
```bash
cd apps/learn-biology
cp .env.local.example .env.local
# Edit .env.local with actual values
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` (or use placeholder with OPEN_ACCESS=true)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or use placeholder with OPEN_ACCESS=true)
- `OPEN_ACCESS=true` (for Foundation apps)

### 4. DNS Configuration
Add DNS records for:
- `app12.learn-biology.iiskills.cloud` → Server IP
- Ensure SSL/TLS certificate covers the subdomain

### 5. Nginx/Reverse Proxy
Add configuration for port 3026:
```nginx
server {
    server_name app12.learn-biology.iiskills.cloud;
    
    location / {
        proxy_pass http://localhost:3026;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Verification
After deployment, verify:
- [ ] App loads at https://app12.learn-biology.iiskills.cloud
- [ ] Landing page displays with Moss Green theme
- [ ] Curriculum page shows all 3 modules
- [ ] Sample lesson (Module 1, Lesson 1) is accessible
- [ ] Images load correctly
- [ ] Foundation badge appears
- [ ] Links to Chemistry and Physics work
- [ ] Onboarding flow works
- [ ] Health check: https://app12.learn-biology.iiskills.cloud/api/health

### 7. Dashboard Integration
- [ ] Biology appears in main dashboard at https://iiskills.cloud
- [ ] Biology shows in Foundation grid
- [ ] Biology appears in scientist path
- [ ] Progress tracking works
- [ ] Cross-app navigation functions

## PM2 Management
```bash
# View logs
pm2 logs iiskills-learn-biology

# Restart app
pm2 restart iiskills-learn-biology

# Monitor
pm2 monit

# Save configuration
pm2 save
```

## Port Assignments Summary
- Main: 3000
- Learn AI: 3024
- Learn Apt: 3002
- Learn Chemistry: 3005
- Learn Developer: 3007
- Learn Geography: 3011
- Learn Govt Jobs: 3013
- Learn Management: 3016
- Learn Math: 3017
- Learn Physics: 3020
- Learn PR: 3021
- Learn Finesse: 3025
- **Learn Biology: 3026** ← NEW

## Subdomain Mapping
| App | Subdomain | Port |
|-----|-----------|------|
| Learn AI | app1.learn-ai.iiskills.cloud | 3024 |
| Learn Management | app2.learn-management.iiskills.cloud | 3016 |
| Learn PR | app3.learn-pr.iiskills.cloud | 3021 |
| Learn Developer | app4.learn-developer.iiskills.cloud | 3007 |
| Learn Apt | app5.learn-apt.iiskills.cloud | 3002 |
| Learn Physics | app6.learn-physics.iiskills.cloud | 3020 |
| Learn Chemistry | app7.learn-chemistry.iiskills.cloud | 3005 |
| Learn Math | app8.learn-math.iiskills.cloud | 3017 |
| Learn Geography | app9.learn-geography.iiskills.cloud | 3011 |
| Learn Govt Jobs | app10.learn-govt-jobs.iiskills.cloud | 3013 |
| Learn Finesse | app11.learn-finesse.iiskills.cloud | 3025 |
| **Learn Biology** | **app12.learn-biology.iiskills.cloud** | **3026** |

## Foundation Suite Apps (All Free)
1. Learn Math (app8) - Crimson Red
2. Learn Physics (app6) - Electric Blue
3. Learn Chemistry (app7) - Atomic Purple
4. **Learn Biology (app12) - Moss Green** ← NEW
5. Learn Geography (app9) - Emerald Green
6. Learn Aptitude (app5) - Various

## Academy Suite Apps (Premium)
1. Learn AI (app1)
2. Learn Developer (app4)
3. Learn Govt Jobs (app10)
4. Learn PR (app3)
5. Learn Management (app2)
6. Learn Finesse (app11)

## Success Criteria
✅ App builds and runs without errors
✅ All universal features implemented
✅ Tri-level progression system functional
✅ Sample lesson accessible
✅ Cross-app links working
✅ Foundation branding consistent
✅ Images and theme correct
✅ Monorepo integration complete
✅ PM2 configuration ready
✅ Ready for production deployment

## Next Steps (Post-Deployment)
1. Monitor logs for any errors
2. Test user flows end-to-end
3. Verify analytics tracking
4. Update marketing materials
5. Announce 12th app launch
6. Add to email templates
7. Update documentation
8. Celebrate completion of 12-app ecosystem! 🎉

## Support & Troubleshooting
- Logs: `pm2 logs iiskills-learn-biology`
- Health check: `/api/health`
- Restart: `pm2 restart iiskills-learn-biology`
- Rebuild: `cd apps/learn-biology && yarn build`

---

**Built with ❤️ | The 12th app in the iiskills ecosystem | Foundation Suite | Free Forever 🧬**
