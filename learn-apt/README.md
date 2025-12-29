# Learn Your Aptitude - Standalone Next.js Application

This is a standalone Next.js application for the **Learn Your Aptitude** feature of iiskills.cloud. It is designed to be deployed as a separate service on the subdomain `learn-apt.iiskills.cloud`.

## Overview

Learn Your Aptitude is an aptitude learning platform that helps users develop:
- Quantitative aptitude skills
- Logical reasoning abilities
- Data interpretation techniques
- Verbal reasoning skills
- Pattern recognition
- Speed mathematics

## Project Structure

```
learn-apt/
├── components/          # React components
│   ├── AdminNavbar.js  # Admin navigation component
│   └── Footer.js       # Footer component
├── contexts/           # React contexts
│   └── AdminContext.js # Admin authentication context
├── lib/                # Utility libraries
│   ├── adminAuth.js    # Admin authentication utilities
│   └── supabaseClient.js  # Supabase auth client with cross-subdomain support
├── pages/              # Next.js pages
│   ├── admin/          # Admin pages
│   │   ├── index.js    # Admin sign-in page
│   │   ├── dashboard.js # Admin dashboard
│   │   └── change-password.js # Change admin password
│   ├── _app.js         # App wrapper
│   ├── index.js        # Landing page with ENTER/SIGN IN/LOG IN buttons
│   ├── login.js        # Login page
│   ├── register.js     # Registration page
│   └── learn.js        # Main learning page (protected)
├── public/             # Static assets
│   └── images/         # Images and logos
├── styles/             # CSS styles
│   └── globals.css     # Global styles with Tailwind
├── .env.local.example  # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

## Admin Access

### Admin Sign-In

The application includes an admin panel for managing the platform:

**Admin Panel URL:** `/admin`

**Default Credentials:**
- Password: `phil123`

**Features:**
- Dashboard with overview of the application
- Password change functionality
- Quick navigation to all app sections
- Persistent session using localStorage

**How to Access Admin:**

1. Navigate to `/admin` in your browser
2. Enter the admin password (`phil123` by default)
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

**Changing Admin Password:**

1. After signing in, go to "Change Password" from the admin navigation
2. Enter your current password
3. Enter your new password (minimum 6 characters)
4. Confirm your new password
5. Click "Update Password"

**Security Notes:**
- ⚠️ **Development/Demo Mode:** This admin system uses a simple password stored in localStorage for demonstration purposes
- The admin password is stored in your browser's localStorage
- If you clear browser data, the password will reset to the default (`phil123`)
- **For production use:** Implement proper backend authentication with environment variables, secure password hashing, and database storage
- The admin session persists until you sign out or clear browser data
- **Important:** Change the default password immediately after first use and never commit sensitive passwords to version control

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- A Supabase account (shared with main iiskills.cloud app)

### Installation

1. **Navigate to the learn-apt directory:**
   ```bash
   cd learn-apt
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3001
   ```
   
   **Important:** Use the **same Supabase project** as the main iiskills.cloud app for cross-app authentication.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3001`

### Building for Production

```bash
npm run build
npm start
```

## Authentication & Cross-Subdomain Sessions

### Shared Authentication

This app uses the **same Supabase project** as the main iiskills.cloud application, enabling:
- Single sign-on across all `*.iiskills.cloud` subdomains
- Shared user database and profiles
- Synchronized roles and permissions

### Session Cookie Configuration

For cross-subdomain authentication to work in production:

1. **Configure Supabase:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Settings
   - Set the cookie domain to: `.iiskills.cloud`
   - This allows sessions to be shared across all subdomains

2. **Session Storage:**
   - Sessions are stored in localStorage with the key `iiskills-auth-token`
   - This ensures consistency across all iiskills apps

### User Roles & Permissions

User roles are synced via Supabase user metadata:
- `user.user_metadata.role` - User role (admin, user, etc.)
- `user.user_metadata.first_name` - User's first name
- `user.user_metadata.last_name` - User's last name
- Additional profile data from registration

## Deployment

### Deployment Options

1. **Vercel (Recommended for Next.js):**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```
   
   Configure environment variables in Vercel dashboard.

2. **VPS with Nginx:**
   
   Build the application:
   ```bash
   npm run build
   ```
   
   Set up Nginx reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name learn-apt.iiskills.cloud;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Run with PM2:
   ```bash
   pm2 start npm --name "learn-apt" -- start
   pm2 save
   pm2 startup
   ```

3. **Docker:**
   
   Create `Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3001
   CMD ["npm", "start"]
   ```
   
   Build and run:
   ```bash
   docker build -t learn-apt .
   docker run -p 3001:3001 learn-apt
   ```

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_SITE_URL=https://learn-apt.iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

## Shared Components

### SharedNavbar Component

The `SharedNavbar` component is located in `/components/shared/SharedNavbar.js` at the root of the repository. This component is shared between the main app and learn-apt app.

**Usage in learn-apt:**
```javascript
import SharedNavbar from '../../components/shared/SharedNavbar'

<SharedNavbar 
  user={user}
  onLogout={handleLogout}
  appName="Learn Your Aptitude"
  homeUrl="/"
  showAuthButtons={true}
  customLinks={[
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ]}
/>
```

### Syncing Shared Components

When the SharedNavbar or other shared components are updated in the main repo:

1. The component is already in a shared location (`/components/shared/`)
2. Both apps reference the same file
3. No manual sync required - just ensure the path is correct

## Development Workflow

### Running Both Apps Simultaneously

Main app runs on port 3000, learn-apt on port 3001:

```bash
# Terminal 1 - Main app
cd /path/to/iiskills-cloud
npm run dev

# Terminal 2 - Learn-apt app
cd /path/to/iiskills-cloud/learn-apt
npm run dev
```

### Testing Cross-Subdomain Auth Locally

1. **Edit hosts file** to simulate subdomains:
   ```bash
   # /etc/hosts (Linux/Mac) or C:\Windows\System32\drivers\etc\hosts (Windows)
   127.0.0.1  local.iiskills.cloud
   127.0.0.1  learn-apt.local.iiskills.cloud
   ```

2. **Access the apps:**
   - Main app: `http://local.iiskills.cloud:3000`
   - Learn-apt: `http://learn-apt.local.iiskills.cloud:3001`

3. **Note:** Cookie sharing won't work on localhost without the hosts file setup.

## Features

### Current Features

✅ Landing page with ENTER, SIGN IN, LOG IN buttons  
✅ User authentication (login/register)  
✅ Cross-subdomain session sharing  
✅ Protected routes  
✅ Shared branding with main app  
✅ Responsive design  
✅ **Admin authentication system**  
✅ **Admin dashboard with navigation**  
✅ **Password change functionality**  
✅ **Persistent admin sessions (localStorage)**  

### Upcoming Features

🚧 Learning modules content  
🚧 Quiz system  
🚧 Progress tracking  
🚧 Certificate generation  
🚧 Backend database integration (Supabase)  

## Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework:** Next.js 16.1.1
- **React:** Latest
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Deployment:** Vercel / VPS / Docker

## Troubleshooting

### Sessions not shared between apps

1. Verify both apps use the same Supabase project
2. Check that cookie domain is set to `.iiskills.cloud` in Supabase settings
3. Ensure `NEXT_PUBLIC_COOKIE_DOMAIN` is set correctly in production
4. Clear browser cookies and try again

### Images not loading

1. Ensure images are copied to `/learn-apt/public/images/`
2. Verify image paths in components use `/images/...` (not `../public/images/...`)
3. Check file permissions

### Build errors

1. Clear `.next` folder: `rm -rf .next`
2. Clear node_modules: `rm -rf node_modules && npm install`
3. Check Node.js version: `node -v` (should be 16.x or higher)

## Support

For issues or questions:
- Email: info@iiskills.cloud
- Main site: https://iiskills.cloud

## License

This project is part of iiskills.cloud - Indian Institute of Professional Skills Development.
© 2024 AI Cloud Enterprises. All rights reserved.
