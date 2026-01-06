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

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

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
