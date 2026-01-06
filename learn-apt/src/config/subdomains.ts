// Subdomain Configuration Registry
// This file contains the configuration for all subdomains in the iiskills.cloud ecosystem

export interface SubdomainConfig {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string; // Lucide icon name
  status: "active" | "development" | "maintenance";
  adminPath: string; // Path to the admin area for this subdomain
  category: "learning" | "admin" | "content" | "analytics";
}

// Central registry of all subdomains
export const SUBDOMAINS: SubdomainConfig[] = [
  {
    id: "learn-apt",
    name: "Learn Apt",
    url: "https://learn-apt.iiskills.cloud",
    description: "Comprehensive aptitude testing platform for learning preferences and problem-solving styles",
    icon: "Brain",
    status: "active",
    adminPath: "/admin",
    category: "learning",
  },
];

// Get subdomain configuration by ID
export function getSubdomainById(id: string): SubdomainConfig | undefined {
  return SUBDOMAINS.find(subdomain => subdomain.id === id);
}

// Get subdomain configuration by URL
export function getSubdomainByUrl(url: string): SubdomainConfig | undefined {
  return SUBDOMAINS.find(subdomain => subdomain.url === url);
}

// Get all subdomains by category
export function getSubdomainsByCategory(category: SubdomainConfig["category"]): SubdomainConfig[] {
  return SUBDOMAINS.filter(subdomain => subdomain.category === category);
}

// Get all active subdomains
export function getActiveSubdomains(): SubdomainConfig[] {
  return SUBDOMAINS.filter(subdomain => subdomain.status === "active");
}

// Check if current URL is a known subdomain
export function getCurrentSubdomain(): SubdomainConfig | undefined {
  if (typeof window === "undefined") return undefined;
  
  const currentUrl = window.location.origin;
  return getSubdomainByUrl(currentUrl);
}

// Get the admin URL for a specific subdomain with security validation
export function getAdminUrl(subdomainId: string): string | undefined {
  const subdomain = getSubdomainById(subdomainId);
  if (!subdomain) return undefined;
  
  // Security: Validate that the URL is within the allowed iiskills.cloud domain
  try {
    const url = new URL(subdomain.url);
    if (!url.hostname.endsWith('.iiskills.cloud') && url.hostname !== 'iiskills.cloud') {
      console.error(`Security: Attempted to navigate to unauthorized domain: ${url.hostname}`);
      return undefined;
    }
  } catch (error) {
    console.error(`Invalid URL in subdomain configuration: ${subdomain.url}`, error);
    return undefined;
  }
  
  return `${subdomain.url}${subdomain.adminPath}`;
}
