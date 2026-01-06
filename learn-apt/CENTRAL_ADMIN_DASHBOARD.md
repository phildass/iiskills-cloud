# Central Admin Dashboard

The Central Admin Dashboard provides a unified interface for managing all subdomains in the iiskills.cloud ecosystem.

## Overview

The central admin dashboard allows administrators to:
- View all subdomains across iiskills.cloud
- Access each subdomain's admin area with a single click
- Filter subdomains by category and status
- Use shared authentication across all subdomains

## Features

### Subdomain Registry

All subdomains are registered in `/src/config/subdomains.ts`. Each subdomain has:

- **ID**: Unique identifier
- **Name**: Display name
- **URL**: Full subdomain URL
- **Description**: Brief description of the subdomain's purpose
- **Icon**: Lucide icon name for visual representation
- **Status**: Active, Development, or Maintenance
- **Admin Path**: Path to the admin area for this subdomain
- **Category**: Learning, Admin, Content, or Analytics

### Central Dashboard Page

Located at `/admin/subdomains`, the central dashboard displays:

1. **Statistics**
   - Total number of subdomains
   - Count by status (Active, Development, Maintenance)

2. **Category Filters**
   - Filter subdomains by category
   - View all or filter by Learning, Admin, Content, Analytics

3. **Subdomain Cards**
   - Visual cards for each subdomain
   - Status indicators
   - Quick access buttons:
     - "Open Admin": Navigate to the subdomain's admin area
     - External link icon: Open subdomain in a new tab

### Admin Panel Integration

The main admin panel at `/admin` includes a "Subdomains" tab that:
- Provides an overview of the central admin dashboard
- Links to the full subdomain management page
- Displays key features and subdomain categories

## Usage

### Accessing the Central Dashboard

1. Navigate to `/admin` and log in with your admin credentials
2. Click on the "Subdomains" tab in the navigation
3. Click "Open Central Admin Dashboard" to view all subdomains

### Adding New Subdomains

To add a new subdomain to the registry:

1. Edit `/src/config/subdomains.ts`
2. Add a new entry to the `SUBDOMAINS` array:

```typescript
{
  id: "new-subdomain",
  name: "New Subdomain",
  url: "https://new-subdomain.iiskills.cloud",
  description: "Description of the subdomain",
  icon: "IconName", // Lucide icon name
  status: "active", // or "development" or "maintenance"
  adminPath: "/admin",
  category: "learning", // or "admin", "content", "analytics"
}
```

3. Ensure the icon is imported in `/src/app/admin/subdomains/page.tsx` if it's a new icon

### Authentication

The central admin dashboard uses the same shared Supabase authentication as all other subdomains. This means:

- Administrators only need to log in once
- Sessions are shared across all `*.iiskills.cloud` subdomains
- Role-based access control is enforced via `user_metadata.is_admin`

## File Structure

```
src/
├── config/
│   └── subdomains.ts          # Subdomain registry and helper functions
├── app/
│   └── admin/
│       ├── page.tsx            # Main admin panel with Subdomains tab
│       └── subdomains/
│           └── page.tsx        # Central admin dashboard page
```

## API Reference

### Subdomain Configuration Interface

```typescript
interface SubdomainConfig {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  status: "active" | "development" | "maintenance";
  adminPath: string;
  category: "learning" | "admin" | "content" | "analytics";
}
```

### Helper Functions

- `getSubdomainById(id: string)`: Get subdomain by ID
- `getSubdomainByUrl(url: string)`: Get subdomain by URL
- `getSubdomainsByCategory(category)`: Filter subdomains by category
- `getActiveSubdomains()`: Get all active subdomains
- `getCurrentSubdomain()`: Get the current subdomain configuration
- `getAdminUrl(subdomainId: string)`: Get the admin URL for a subdomain

## Security

- Only authenticated administrators can access the central dashboard
- Server-side middleware validates authentication on `/admin` routes
- Admin role is verified via `user_metadata.is_admin` in Supabase
- Cross-subdomain authentication is enabled via shared cookies

## Future Enhancements

Potential improvements for the central admin dashboard:

- Real-time subdomain health monitoring
- User management across all subdomains
- Analytics and usage statistics
- Deployment and version management
- Cross-subdomain content management
- Centralized logging and error tracking

---

**Last Updated**: January 2026  
**Version**: 1.0.0
