# Coming Soon Apps - Landing Page

A standalone "Coming Soon" landing page that showcases upcoming revolutionary education apps from iiskills.cloud.

## Features

- **Live Background**: Displays the iiskills.cloud homepage as a dimmed/blurred background
- **Prominent Message**: Centered overlay with "Coming Soon Apps that will revolutionise education like never before!"
- **No Navigation**: All links and interactions with the background are disabled
- **Email Notifications**: Optional sign-up form to notify users when apps launch
- **SEO Optimized**: Proper meta tags for search engines
- **Accessible**: WCAG compliant design
- **Responsive**: Works on all devices and screen sizes
- **Modern Design**: Sleek, high-impact visual design with animations

## Quick Start

### 1. Install Dependencies

```bash
cd coming-soon
npm install
# or
yarn install
```

### 2. Configure Environment (Optional)

If you want to store email notifications in Supabase:

1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Create the `coming_soon_notifications` table in Supabase:
   ```sql
   CREATE TABLE coming_soon_notifications (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     subscribed_at TIMESTAMP DEFAULT NOW()
   );
   ```

**Note**: The app works perfectly fine without Supabase. Email submissions will simply log to the console.

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3019`

### 4. Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Deployment Options

### Option 1: Standalone Deployment on Custom Port

The app is pre-configured to run on port **3019**.

1. Build the app:
   ```bash
   npm run build
   ```

2. Start with PM2:
   ```bash
   pm2 start npm --name "coming-soon" -- start
   pm2 save
   ```

3. Configure Nginx reverse proxy:
   ```nginx
   server {
       listen 80;
       server_name coming-soon.iiskills.cloud;

       location / {
           proxy_pass http://localhost:3019;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. Setup SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d coming-soon.iiskills.cloud
   ```

### Option 2: Using PM2 Ecosystem

The app is already configured in the main `ecosystem.config.js` file. From the root directory:

```bash
# Start only the coming-soon app
pm2 start ecosystem.config.js --only iiskills-coming-soon

# Or start all apps including coming-soon
pm2 start ecosystem.config.js
```

### Option 3: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd coming-soon
   vercel
   ```

3. Configure custom domain in Vercel dashboard

### Option 4: Deploy with Docker

1. Create `Dockerfile` in the `coming-soon` directory:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3019
   CMD ["npm", "start"]
   ```

2. Build and run:
   ```bash
   docker build -t coming-soon .
   docker run -p 3019:3019 coming-soon
   ```

## DNS Configuration

To set up `coming-soon.iiskills.cloud`:

1. Add an A record or CNAME in your DNS provider:
   - **Type**: A or CNAME
   - **Name**: coming-soon
   - **Value**: Your server IP or domain
   - **TTL**: 3600

2. Wait for DNS propagation (can take up to 48 hours)

3. Verify DNS:
   ```bash
   nslookup coming-soon.iiskills.cloud
   ```

## Customization

### Background Design

The page uses an animated gradient background with the iiskills.cloud brand colors (primary blue #1e40af and accent purple #7c3aed). This approach was chosen for:
- **Reliability**: Works across all browsers without iframe restrictions
- **Performance**: No external resources to load
- **Visual Impact**: Smooth animated gradient creates a dynamic, modern look
- **Brand Consistency**: Uses the official iiskills.cloud color palette

**Alternative: Use a Live Website Background**

If you want to show a live website in the background (like the original requirement), you can replace the gradient with an iframe. However, note that many websites block iframe embedding:

```jsx
{/* Replace the gradient background div with: */}
<div className="fixed inset-0 z-0">
  <iframe
    src="https://iiskills.cloud"
    className="w-full h-full pointer-events-none"
    style={{
      filter: "blur(8px) brightness(0.4)",
      transform: "scale(1.1)",
    }}
    title="background"
    aria-hidden="true"
  />
</div>
```

**Note**: If the target website has X-Frame-Options or CSP headers, the iframe will be blocked. Consider using a screenshot image as an alternative.

### Change the Message

Edit `/pages/index.js` and modify the main heading and description:

```jsx
<h1>Coming Soon Apps</h1>
<p>that will revolutionise education like never before!</p>
```

### Customize Background Gradient

Edit the gradient colors in `/pages/index.js`:

```jsx
style={{
  background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #1e40af 100%)',
  // Change colors to match your brand
}}
```

### Change Colors

Edit `/tailwind.config.js`:

```js
colors: {
  primary: "#1e40af",    // Change to your brand color
  accent: "#7c3aed",     // Change to your accent color
  // ...
}
```

### Disable Email Notifications

Remove or comment out the form section in `/pages/index.js`.

## Switching Off the Coming Soon Page

When you're ready to launch your apps:

### Option 1: Stop the PM2 Process
```bash
pm2 stop iiskills-coming-soon
pm2 delete iiskills-coming-soon
pm2 save
```

### Option 2: Update Nginx Configuration
Comment out or remove the Nginx configuration for `coming-soon.iiskills.cloud`.

### Option 3: Redirect to Main Site
Update Nginx to redirect to the main site:
```nginx
server {
    server_name coming-soon.iiskills.cloud;
    return 301 https://iiskills.cloud$request_uri;
}
```

## Port Assignment

- **Port**: 3019
- Assigned sequentially after learn-cricket (3016)
- See `/PORT_ASSIGNMENTS.md` in the root repository for all port assignments

## File Structure

```
coming-soon/
├── pages/
│   ├── _app.js           # Next.js app wrapper
│   ├── index.js          # Main coming soon page
│   └── api/
│       └── notify.js     # Email notification API endpoint
├── styles/
│   └── globals.css       # Global styles
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── postcss.config.js     # PostCSS configuration
├── .env.local.example    # Environment variables example
└── README.md             # This file
```

## Troubleshooting

### Background Not Showing

If the background iframe is blocked:
- Ensure the target URL (iiskills.cloud) allows iframe embedding
- Check for CSP (Content Security Policy) headers
- Consider using a screenshot instead of an iframe

### Email Notifications Not Working

- Check Supabase credentials in `.env.local`
- Verify the database table exists
- Check browser console and server logs for errors
- The app will still work; emails just won't be saved

### Port Already in Use

If port 3019 is already in use:
- Update `package.json` scripts to use a different port
- Update the port in `ecosystem.config.js` if using PM2

## Security Considerations

- The background iframe has `pointer-events: none` to prevent interactions
- Email validation is performed on both client and server
- No sensitive data is exposed
- HTTPS is recommended for production deployment

## Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Sufficient color contrast
- Responsive design for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2024 AI Cloud Enterprises - Indian Institute of Professional Skills Development. All rights reserved.

## Support

For questions or issues:
- Email: info@iiskills.cloud
- Check the main repository documentation
