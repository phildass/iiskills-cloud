# learn-apt

**Learn Your Aptitude** - A comprehensive aptitude testing platform that helps users discover their learning preferences, problem-solving styles, and motivation drivers.

## Features

- **Elaborate Test**: Comprehensive assessment with **20 modules and 200 questions total** (10 questions per module)
  
  **Learning & Cognitive Assessment:**
  - Learning Styles Assessment
  - Cognitive Patterns
  - Problem-Solving Approach
  - Motivation & Drive
  - Learning Environment Preferences
  
  **Aptitude & Reasoning:**
  - Numerical & Data Reasoning (with 5 options including "I don't know")
  - Quantitative Aptitude (with 5 options including "I don't know")
  - Abstract & Logical Reasoning (with 5 options including "I don't know")
  - Spatial & Visual Reasoning (with 5 options including "I don't know")
  - Verbal Reasoning & Comprehension
  
  **Professional Skills:**
  - Critical Thinking
  - Time Management & Organization
  - Communication Preferences
  - Decision Making
  - Attention to Detail
  
  **Personal Effectiveness:**
  - Data Interpretation
  - Stress Management & Resilience
  - Creativity & Innovation
  - Memory & Retention
  - Collaborative Learning Styles
  
- **Brief Test**: Quick assessment with five key modules:
  - Learning Preferences
  - Problem-Solving Style
  - Motivation Drivers
  - Numerical & Data Reasoning (with 5 options including "I don't know")
  - Abstract & Logical Reasoning (with 5 options including "I don't know")

**Note**: Mathematical, quantitative, logical, spatial, and mechanical reasoning questions include a fifth option "E) I don't know" to allow test-takers to skip questions they're uncertain about. All currency references use ₹ (Rupee) or Rs instead of $ for localization.
- **Brief Test**: Quick assessment with four key modules:
  - Learning Preferences
  - Problem-Solving Style
  - Motivation Drivers
  - Numerical Reasoning
- **Indian Context**: All monetary examples use Indian Rupee (₹) for relevance to Indian users
- **Comprehensive Assessment**: Includes both personality and quantitative aptitude questions

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/phildass/learn-apt.git
cd learn-apt
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

**For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Deploy to Subdomain (learn-apt.iiskills.cloud)

This application is configured to run on the exclusive subdomain `learn-apt.iiskills.cloud`. Follow these steps for deployment:

#### Option 1: Deploy to Vercel (Recommended)

1. **One-Click Deploy**

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/phildass/learn-apt)

2. **Or Deploy via Vercel CLI**

   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy to production
   vercel --prod
   ```

3. **Configure Custom Subdomain**

   After deployment:
   - Go to your Vercel project settings
   - Navigate to "Domains"
   - Add `learn-apt.iiskills.cloud`
   - Update your DNS records as instructed by Vercel

#### Option 2: Deploy to Your Own Server

1. **Build the application**

   ```bash
   npm install
   npm run build
   ```

2. **Start the production server**

   ```bash
   npm start
   ```

   Or use PM2 for process management:

   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

3. **Configure Nginx (if applicable)**

   Example Nginx configuration for the subdomain:

   ```nginx
   server {
       listen 80;
       server_name learn-apt.iiskills.cloud;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable HTTPS with Let's Encrypt**

   ```bash
   sudo certbot --nginx -d learn-apt.iiskills.cloud
   ```

### Environment Variables

The application requires Supabase configuration for authentication:

1. **Create `.env.local` file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Supabase credentials**:
   - Get credentials from the main iiskills-cloud Supabase project
   - Update `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - See [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) for detailed setup instructions

3. **Important**: Use the **SAME** Supabase project as the main iiskills-cloud repository to enable cross-subdomain authentication.

## Available Scripts

- `npm run dev` or `yarn dev` - Start development server on port 3002
- `npm run build` or `yarn build` - Build for production
- `npm run start` or `yarn start` - Start production server on port 3002 (uses custom server.js)
- `npm run start:default` or `yarn start:default` - Start production server using default Next.js server
- `npm run lint` or `yarn lint` - Run ESLint

## Troubleshooting Production Server Issues

If the production server fails to start or nginx returns 502 errors, follow these steps:

### Check if the server is running and bound to the correct port

```bash
# Check if the process is listening on port 3002
ss -tlnp | grep :3002
# OR
netstat -tlnp | grep :3002
# OR
lsof -i :3002
```

Expected output should show a process bound to `0.0.0.0:3002` or `*:3002`.

### Verify the build completed successfully

```bash
cd /path/to/learn-apt
ls -la .next/
```

The `.next` directory should exist and contain `BUILD_ID`, `server/`, and other build artifacts.

### Test the server manually

```bash
cd /path/to/learn-apt
PORT=3002 NODE_ENV=production yarn start
```

You should see:
```
✅ Server ready and listening
   URL: http://localhost:3002
   Binding: 0.0.0.0:3002
```

### Test with curl

```bash
curl -v http://localhost:3002/
```

Should return HTTP 200 with the HTML page.

### Common Issues and Solutions

**Issue: Port already in use**
```bash
# Find process using port 3002
lsof -ti:3002
# Kill the process
lsof -ti:3002 | xargs kill -9
# Or with PM2
pm2 delete iiskills-learn-apt
pm2 start ecosystem.config.js --only iiskills-learn-apt
```

**Issue: Wrong port configured**
- Check `ecosystem.config.js` - should have `PORT: 3001` for learn-apt
- Check `.env.local` - should have `PORT=3002`
- Check nginx config - should proxy to `localhost:3002`

**Issue: Server says "ready" but nothing is listening**
- This was the original issue - fixed by using custom `server.js`
- Make sure you're using `yarn start` (which runs `node server.js`)
- NOT `next start` which may not bind reliably in some environments

**Issue: Build fails with Supabase errors**
- The app now allows builds with placeholder Supabase values
- For development/testing: use the provided `.env.local` template
- For production: update `.env.local` with real Supabase credentials
- See `.env.example` for configuration details

**Issue: PM2 shows app as running but it crashes immediately**
```bash
# Check PM2 logs
pm2 logs iiskills-learn-apt --lines 50

# Common causes:
# 1. Missing dependencies - run: yarn install
# 2. Missing .next folder - run: yarn build
# 3. Port conflict - check with: lsof -i :3002
# 4. Environment variables - check .env.local exists
```

### Verify nginx configuration

Your nginx config should proxy to port 3002:

```nginx
location / {
    proxy_pass http://localhost:3002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Production deployment checklist

1. ✅ Install dependencies: `yarn install`
2. ✅ Build the app: `yarn build`
3. ✅ Verify .next folder exists: `ls -la .next/`
4. ✅ Test manual start: `PORT=3002 yarn start`
5. ✅ Verify port binding: `ss -tlnp | grep :3002`
6. ✅ Test with curl: `curl http://localhost:3002/`
7. ✅ Configure PM2 with PORT=3002 in `ecosystem.config.js`
8. ✅ Start with PM2: `pm2 start ecosystem.config.js --only iiskills-learn-apt`
9. ✅ Save PM2 config: `pm2 save`
10. ✅ Test nginx proxy: `curl http://your-domain.com/`


## Project Structure

```
src/
├── app/
│   ├── brief-test/     # Brief test flow
│   ├── elaborate-test/ # Elaborate test flow
│   ├── results/        # Test results display
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/         # Reusable components
└── lib/               # Utility functions
```

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For deployment assistance, see [DEPLOYMENT.md](./DEPLOYMENT.md).

For issues or questions, please open an issue on GitHub.
