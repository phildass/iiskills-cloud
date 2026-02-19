#!/bin/bash
set -e

# Script to update Next.js configs with production security settings
# Adds security headers and ensures source maps are disabled

echo "Updating Next.js configurations with security settings..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONFIGS_UPDATED=0
CONFIGS_SKIPPED=0

# Root next.config.js
ROOT_CONFIG="./next.config.js"

if [ -f "$ROOT_CONFIG" ]; then
    echo -e "${BLUE}Checking root next.config.js...${NC}"
    
    # Check if security headers already configured
    if grep -q "security-headers" "$ROOT_CONFIG"; then
        echo -e "${YELLOW}  ↳ Security headers already configured${NC}"
        CONFIGS_SKIPPED=$((CONFIGS_SKIPPED + 1))
    else
        echo -e "${GREEN}  ↳ Adding security headers...${NC}"
        
        # Backup original
        cp "$ROOT_CONFIG" "$ROOT_CONFIG.bak"
        
        # Add security headers import and config
        cat > "$ROOT_CONFIG" << 'EOF'
const path = require("path");
const { getHeadersConfig } = require("./config/security-headers");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  turbopack: {
    root: __dirname,
  },

  // Expose OPEN_ACCESS env var to the client side
  env: {
    NEXT_PUBLIC_OPEN_ACCESS: process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false',
  },

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return getHeadersConfig(isDev);
  },

  async rewrites() {
    return [
      // Rewrite admin subdomain to /admin routes
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin/:path*",
      },
      // Rewrite admin subdomain root to /admin
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin",
      },
    ];
  },
};

module.exports = nextConfig;
EOF
        
        echo -e "${GREEN}  ✓ Updated${NC}"
        CONFIGS_UPDATED=$((CONFIGS_UPDATED + 1))
    fi
fi

# Update all app configs
APP_CONFIGS=$(find apps -name "next.config.js" -type f 2>/dev/null)

for CONFIG in $APP_CONFIGS; do
    APP_NAME=$(dirname "$CONFIG" | sed 's|apps/||')
    echo -e "${BLUE}Checking $APP_NAME/next.config.js...${NC}"
    
    # Check if security headers already configured
    if grep -q "security-headers" "$CONFIG"; then
        echo -e "${YELLOW}  ↳ Security headers already configured${NC}"
        CONFIGS_SKIPPED=$((CONFIGS_SKIPPED + 1))
    else
        echo -e "${GREEN}  ↳ Adding security headers...${NC}"
        
        # Backup original
        cp "$CONFIG" "$CONFIG.bak"
        
        # Add security headers import and config
        cat > "$CONFIG" << 'EOF'
/** @type {import('next').NextConfig} */
const path = require('path');
const { getHeadersConfig } = require('../../config/security-headers');

const nextConfig = {
  reactStrictMode: true,
  
  // Disable source maps in production for security
  productionBrowserSourceMaps: false,

  // Turbopack configuration for module resolution
  turbopack: {
    resolveAlias: {
      '@lib': path.resolve(__dirname, '../../lib'),
      '@utils': path.resolve(__dirname, '../../utils'),
      '@config': path.resolve(__dirname, '../../config'),
    },
  },

  // Webpack configuration for module resolution (for non-Turbopack builds)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.resolve(__dirname, '../../lib'),
      '@utils': path.resolve(__dirname, '../../utils'),
      '@config': path.resolve(__dirname, '../../config'),
    };
    return config;
  },

  // Expose OPEN_ACCESS env var to the client side
  env: {
    NEXT_PUBLIC_OPEN_ACCESS: process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false',
  },

  // Security headers
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return getHeadersConfig(isDev);
  },

  async rewrites() {
    return [
      // Rewrite admin subdomain to /admin routes
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin/:path*",
      },
      // Rewrite admin subdomain root to /admin
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "admin.iiskills.cloud",
          },
        ],
        destination: "/admin",
      },
    ];
  },
};

module.exports = nextConfig;
EOF
        
        echo -e "${GREEN}  ✓ Updated${NC}"
        CONFIGS_UPDATED=$((CONFIGS_UPDATED + 1))
    fi
done

echo ""
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}Configs updated: $CONFIGS_UPDATED${NC}"
echo -e "${YELLOW}Configs skipped: $CONFIGS_SKIPPED${NC}"
echo ""

if [ $CONFIGS_UPDATED -gt 0 ]; then
    echo -e "${GREEN}✓ Next.js configurations updated with security settings${NC}"
    echo ""
    echo "Security features added:"
    echo "  • productionBrowserSourceMaps: false"
    echo "  • Security headers (CSP, HSTS, X-Frame-Options, etc.)"
    echo "  • Headers configured for production and development"
    echo ""
    echo "Backup files created with .bak extension"
    echo "Test your build with: npm run build"
else
    echo -e "${YELLOW}No configurations needed updating${NC}"
fi
