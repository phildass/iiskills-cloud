#!/bin/bash

#
# Multi-App Subdomain Deployment Script for iiskills-cloud
#
# This script automates the deployment of all learning apps to their respective subdomains
# on Hostinger VPS (72.60.203.189)
#
# Features:
#   1. DNS Verification
#   2. App Build & Launch (PM2)
#   3. Nginx Reverse Proxy Configuration
#   4. SSL Certificate Management (Certbot)
#   5. Process Management & Monitoring
#   6. Deployment Report Generation
#
# Usage: sudo ./deploy-subdomains.sh [--skip-dns] [--skip-build] [--skip-nginx] [--skip-ssl]
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
DOMAIN="iiskills.cloud"
VPS_IP="72.60.203.189"
DEPLOY_USER="${SUDO_USER:-$USER}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
LOG_DIR="$REPO_ROOT/logs"
REPORT_FILE="$REPO_ROOT/DEPLOYMENT_REPORT.md"

# Parse command line arguments
SKIP_DNS=false
SKIP_BUILD=false
SKIP_NGINX=false
SKIP_SSL=false
DRY_RUN=false

for arg in "$@"; do
    case $arg in
        --skip-dns) SKIP_DNS=true ;;
        --skip-build) SKIP_BUILD=true ;;
        --skip-nginx) SKIP_NGINX=true ;;
        --skip-ssl) SKIP_SSL=true ;;
        --dry-run) DRY_RUN=true ;;
        --help)
            echo "Usage: sudo ./deploy-subdomains.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-dns      Skip DNS verification"
            echo "  --skip-build    Skip building apps"
            echo "  --skip-nginx    Skip Nginx configuration"
            echo "  --skip-ssl      Skip SSL setup"
            echo "  --dry-run       Show what would be done without executing"
            echo "  --help          Show this help message"
            exit 0
            ;;
    esac
done

# Check if running as root (required for Nginx and Certbot)
if [ "$EUID" -ne 0 ] && { [ "$SKIP_NGINX" = false ] || [ "$SKIP_SSL" = false ]; }; then
    echo -e "${RED}❌ This script must be run as root (use sudo)${NC}"
    echo "   Required for: Nginx configuration, SSL certificate management"
    echo "   If you only want to build/deploy apps: use --skip-nginx --skip-ssl"
    exit 1
fi

# Utility functions
log_header() {
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}$1${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

log_section() {
    echo ""
    echo -e "${BOLD}${BLUE}▶ $1${NC}"
    echo ""
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Load app configuration from ecosystem.config.js
load_app_config() {
    log_section "Loading Application Configuration"
    
    # Parse ecosystem.config.js to extract app configurations
    if [ ! -f "$REPO_ROOT/ecosystem.config.js" ]; then
        log_error "ecosystem.config.js not found!"
        exit 1
    fi
    
    # Extract apps using Node.js
    cat > /tmp/extract-apps.js << 'EOF'
const config = require(process.argv[2]);
const apps = config.apps || [];
apps.forEach(app => {
    const port = app.env?.PORT || 'auto';
    const dir = app.cwd;
    const name = app.name;
    console.log(`${name}|${dir}|${port}`);
});
EOF
    
    node /tmp/extract-apps.js "$REPO_ROOT/ecosystem.config.js" > /tmp/apps-config.txt
    
    # Count apps
    APP_COUNT=$(wc -l < /tmp/apps-config.txt)
    log_success "Loaded $APP_COUNT applications from ecosystem.config.js"
    
    rm /tmp/extract-apps.js
}

# DNS Verification
verify_dns() {
    log_header "PHASE 1: DNS VERIFICATION"
    
    if [ "$SKIP_DNS" = true ]; then
        log_warning "Skipping DNS verification (--skip-dns flag)"
        return 0
    fi
    
    # Check if dig is available
    if ! command -v dig &> /dev/null; then
        log_warning "'dig' command not found. Skipping DNS verification."
        log_info "Install with: sudo apt-get install dnsutils"
        return 0
    fi
    
    local dns_errors=0
    
    # Check main domain
    log_info "Checking main domain: $DOMAIN"
    check_dns_record "$DOMAIN" "$VPS_IP" || dns_errors=$((dns_errors + 1))
    
    # Check www subdomain
    log_info "Checking www subdomain"
    check_dns_record "www.$DOMAIN" "$VPS_IP" || dns_errors=$((dns_errors + 1))
    
    # Check all learn-* subdomains
    while IFS='|' read -r name dir port; do
        if [[ $name == iiskills-main ]]; then
            continue
        fi
        
        # Extract subdomain from app name (e.g., iiskills-learn-apt -> learn-apt)
        subdomain=$(echo "$name" | sed 's/^iiskills-//')
        full_domain="${subdomain}.${DOMAIN}"
        
        log_info "Checking subdomain: $full_domain"
        check_dns_record "$full_domain" "$VPS_IP" || dns_errors=$((dns_errors + 1))
    done < /tmp/apps-config.txt
    
    echo ""
    if [ $dns_errors -eq 0 ]; then
        log_success "All DNS records verified successfully"
    else
        log_warning "Found $dns_errors DNS issues - see details above"
        log_info "DNS changes can take up to 48 hours to propagate"
        log_info "You can continue deployment, but apps won't be accessible until DNS is correct"
        echo ""
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

check_dns_record() {
    local domain=$1
    local expected_ip=$2
    
    local result=$(dig +short A "$domain" | head -n1)
    
    if [ -z "$result" ]; then
        log_error "   $domain -> NO A RECORD FOUND"
        return 1
    elif [ "$result" = "$expected_ip" ]; then
        log_success "   $domain -> $result"
        return 0
    else
        log_error "   $domain -> $result (expected: $expected_ip)"
        return 1
    fi
}

# Build and deploy apps with PM2
build_and_deploy_apps() {
    log_header "PHASE 2: BUILD & DEPLOY APPLICATIONS"
    
    if [ "$SKIP_BUILD" = true ]; then
        log_warning "Skipping build and deployment (--skip-build flag)"
        return 0
    fi
    
    # Ensure logs directory exists
    mkdir -p "$LOG_DIR"
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    log_info "Node version: $(node --version)"
    
    # Check if npm/yarn is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        log_warning "PM2 is not installed globally"
        log_info "Installing PM2..."
        npm install -g pm2
    fi
    
    log_info "PM2 version: $(pm2 --version)"
    
    # Validate environment files
    validate_env_files
    
    # Build all apps
    build_all_apps
    
    # Deploy with PM2
    deploy_with_pm2
}

validate_env_files() {
    log_section "Validating Environment Files"
    
    local missing_env=0
    
    while IFS='|' read -r name dir port; do
        local app_dir=$(echo "$dir" | sed "s|path.join(__dirname, '||;s|')||;s|__dirname|$REPO_ROOT|")
        local env_file="$app_dir/.env.local"
        
        if [ -f "$env_file" ]; then
            log_success "$name: .env.local found"
        elif [ -f "$app_dir/.env.local.example" ]; then
            log_warning "$name: .env.local missing (example exists)"
            log_info "   Copy .env.local.example to .env.local and configure it"
            missing_env=$((missing_env + 1))
        else
            log_warning "$name: No environment file found"
            missing_env=$((missing_env + 1))
        fi
    done < /tmp/apps-config.txt
    
    if [ $missing_env -gt 0 ]; then
        log_warning "$missing_env apps are missing .env.local files"
        log_info "Apps may not function correctly without proper environment configuration"
        echo ""
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

build_all_apps() {
    log_section "Building All Applications"
    
    local build_errors=0
    
    while IFS='|' read -r name dir port; do
        local app_dir=$(echo "$dir" | sed "s|path.join(__dirname, '||;s|')||;s|__dirname|$REPO_ROOT|")
        
        log_info "Building $name..."
        
        cd "$app_dir"
        
        # Install dependencies
        if [ -f "package.json" ]; then
            if [ "$DRY_RUN" = false ]; then
                # Use npm ci for production builds if package-lock.json exists, otherwise npm install
                if [ -f "package-lock.json" ]; then
                    if ! npm ci 2>&1 | tee "$LOG_DIR/${name}-install.log"; then
                        log_error "Failed to install dependencies for $name"
                        build_errors=$((build_errors + 1))
                        continue
                    fi
                else
                    if ! npm install 2>&1 | tee "$LOG_DIR/${name}-install.log"; then
                        log_error "Failed to install dependencies for $name"
                        build_errors=$((build_errors + 1))
                        continue
                    fi
                fi
                
                # Build the app
                if ! npm run build 2>&1 | tee "$LOG_DIR/${name}-build.log"; then
                    log_error "Failed to build $name"
                    build_errors=$((build_errors + 1))
                    continue
                fi
                
                log_success "Built $name successfully"
            else
                log_info "[DRY RUN] Would build $name"
            fi
        else
            log_warning "No package.json found in $app_dir"
            build_errors=$((build_errors + 1))
        fi
    done < /tmp/apps-config.txt
    
    cd "$REPO_ROOT"
    
    if [ $build_errors -gt 0 ]; then
        log_error "$build_errors apps failed to build"
        exit 1
    fi
    
    log_success "All apps built successfully"
}

deploy_with_pm2() {
    log_section "Deploying with PM2"
    
    if [ "$DRY_RUN" = false ]; then
        # Stop all existing PM2 processes
        log_info "Stopping existing PM2 processes..."
        pm2 delete all 2>/dev/null || true
        
        # Start all apps using ecosystem file
        log_info "Starting all apps with PM2..."
        if pm2 start "$REPO_ROOT/ecosystem.config.js"; then
            log_success "All apps started with PM2"
        else
            log_error "Failed to start apps with PM2"
            exit 1
        fi
        
        # Save PM2 process list
        pm2 save
        
        # Setup PM2 startup script
        log_info "Configuring PM2 to start on boot..."
        pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER" | tail -n 1 | bash || true
        
        # Show PM2 status
        echo ""
        pm2 status
        echo ""
    else
        log_info "[DRY RUN] Would deploy with PM2"
    fi
}

# Generate Nginx configuration
generate_nginx_config() {
    log_header "PHASE 3: NGINX CONFIGURATION"
    
    if [ "$SKIP_NGINX" = true ]; then
        log_warning "Skipping Nginx configuration (--skip-nginx flag)"
        return 0
    fi
    
    # Check if Nginx is installed
    if ! command -v nginx &> /dev/null; then
        log_error "Nginx is not installed"
        log_info "Install with: sudo apt-get install nginx"
        exit 1
    fi
    
    log_info "Nginx version: $(nginx -v 2>&1)"
    
    # Ensure directories exist
    mkdir -p "$NGINX_SITES_AVAILABLE"
    mkdir -p "$NGINX_SITES_ENABLED"
    
    # Generate main app config
    generate_main_nginx_config
    
    # Generate config for each learning app
    generate_learn_apps_nginx_config
    
    # Test Nginx configuration
    log_section "Testing Nginx Configuration"
    if nginx -t; then
        log_success "Nginx configuration is valid"
        
        if [ "$DRY_RUN" = false ]; then
            # Reload Nginx
            log_info "Reloading Nginx..."
            systemctl reload nginx
            log_success "Nginx reloaded successfully"
        else
            log_info "[DRY RUN] Would reload Nginx"
        fi
    else
        log_error "Nginx configuration test failed"
        exit 1
    fi
}

generate_main_nginx_config() {
    log_section "Generating Nginx Config for Main App"
    
    local config_file="$NGINX_SITES_AVAILABLE/iiskills-main"
    
    if [ "$DRY_RUN" = false ]; then
        cat > "$config_file" << EOF
# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
        
        # Enable the site
        ln -sf "$config_file" "$NGINX_SITES_ENABLED/iiskills-main"
        
        log_success "Generated config for main app (iiskills.cloud)"
    else
        log_info "[DRY RUN] Would generate config for main app"
    fi
}

generate_learn_apps_nginx_config() {
    log_section "Generating Nginx Configs for Learning Apps"
    
    while IFS='|' read -r name dir port; do
        if [[ $name == iiskills-main ]]; then
            continue
        fi
        
        # Extract subdomain and port
        local subdomain=$(echo "$name" | sed 's/^iiskills-//')
        local full_domain="${subdomain}.${DOMAIN}"
        local app_port=$(extract_port_from_ecosystem "$name")
        
        if [ -z "$app_port" ]; then
            log_warning "Could not determine port for $name, skipping"
            continue
        fi
        
        local config_file="$NGINX_SITES_AVAILABLE/$name"
        
        if [ "$DRY_RUN" = false ]; then
            cat > "$config_file" << EOF
# HTTP redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $full_domain;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $full_domain;
    
    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/$full_domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$full_domain/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Proxy settings
    location / {
        proxy_pass http://localhost:$app_port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF
            
            # Enable the site
            ln -sf "$config_file" "$NGINX_SITES_ENABLED/$name"
            
            log_success "Generated config for $full_domain (port $app_port)"
        else
            log_info "[DRY RUN] Would generate config for $full_domain (port $app_port)"
        fi
    done < /tmp/apps-config.txt
}

extract_port_from_ecosystem() {
    local app_name=$1
    
    # Extract port from ecosystem config using Node.js
    cat > /tmp/extract-port.js << EOF
const config = require('$REPO_ROOT/ecosystem.config.js');
const app = config.apps.find(a => a.name === '$app_name');
if (app) {
    const port = app.env?.PORT;
    if (port) {
        console.log(port);
    } else {
        // Try to extract from package.json start script
        const fs = require('fs');
        const path = require('path');
        try {
            const pkgPath = path.join(app.cwd, 'package.json');
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            const startScript = pkg.scripts?.start || '';
            const match = startScript.match(/-p\s+(\d+)|--port\s+(\d+)/);
            if (match) {
                console.log(match[1] || match[2]);
            }
        } catch (e) {
            // Ignore
        }
    }
}
EOF
    
    node /tmp/extract-port.js
    rm /tmp/extract-port.js
}

# SSL Certificate Setup
setup_ssl_certificates() {
    log_header "PHASE 4: SSL CERTIFICATE SETUP"
    
    if [ "$SKIP_SSL" = true ]; then
        log_warning "Skipping SSL certificate setup (--skip-ssl flag)"
        return 0
    fi
    
    # Check if Certbot is installed
    if ! command -v certbot &> /dev/null; then
        log_warning "Certbot is not installed"
        log_info "Installing Certbot..."
        
        if [ "$DRY_RUN" = false ]; then
            apt-get update
            apt-get install -y certbot python3-certbot-nginx
        else
            log_info "[DRY RUN] Would install Certbot"
        fi
    fi
    
    log_info "Certbot version: $(certbot --version 2>&1)"
    
    # Get certificate for main domain
    get_ssl_certificate "$DOMAIN" "www.$DOMAIN"
    
    # Get certificates for all learning apps
    while IFS='|' read -r name dir port; do
        if [[ $name == iiskills-main ]]; then
            continue
        fi
        
        local subdomain=$(echo "$name" | sed 's/^iiskills-//')
        local full_domain="${subdomain}.${DOMAIN}"
        
        get_ssl_certificate "$full_domain"
    done < /tmp/apps-config.txt
    
    # Setup automatic renewal
    setup_ssl_renewal
}

get_ssl_certificate() {
    local domain=$1
    local extra_domains=$2
    
    log_section "Obtaining SSL Certificate for $domain"
    
    if [ "$DRY_RUN" = false ]; then
        # Use environment variable or default email
        local ssl_email="${SSL_EMAIL:-admin@$DOMAIN}"
        
        local certbot_cmd="certbot --nginx -d $domain"
        
        if [ -n "$extra_domains" ]; then
            certbot_cmd="$certbot_cmd -d $extra_domains"
        fi
        
        certbot_cmd="$certbot_cmd --non-interactive --agree-tos --email $ssl_email --redirect"
        
        if $certbot_cmd; then
            log_success "SSL certificate obtained for $domain"
        else
            log_error "Failed to obtain SSL certificate for $domain"
            log_info "Certificate may already exist or DNS may not be configured"
        fi
    else
        log_info "[DRY RUN] Would obtain certificate for $domain"
    fi
}

setup_ssl_renewal() {
    log_section "Setting Up Automatic SSL Renewal"
    
    if [ "$DRY_RUN" = false ]; then
        # Certbot automatically sets up a systemd timer for renewal
        # Let's verify it's enabled
        if systemctl is-enabled certbot.timer &> /dev/null; then
            log_success "Certbot automatic renewal is enabled"
        else
            log_info "Enabling Certbot automatic renewal..."
            systemctl enable certbot.timer
            systemctl start certbot.timer
            log_success "Certbot automatic renewal enabled"
        fi
        
        # Test renewal (dry run)
        log_info "Testing certificate renewal..."
        if certbot renew --dry-run; then
            log_success "Certificate renewal test passed"
        else
            log_warning "Certificate renewal test failed"
        fi
    else
        log_info "[DRY RUN] Would setup automatic SSL renewal"
    fi
}

# Process monitoring
setup_monitoring() {
    log_header "PHASE 5: PROCESS MANAGEMENT & MONITORING"
    
    log_section "PM2 Process Status"
    
    if [ "$DRY_RUN" = false ]; then
        pm2 status
        
        log_section "Verifying App Health"
        verify_app_health
    else
        log_info "[DRY RUN] Would verify app health"
    fi
}

verify_app_health() {
    local unhealthy=0
    
    while IFS='|' read -r name dir port; do
        local app_port=$(extract_port_from_ecosystem "$name")
        
        if [ -z "$app_port" ]; then
            continue
        fi
        
        log_info "Checking $name on port $app_port..."
        
        if curl -f -s -o /dev/null http://localhost:$app_port; then
            log_success "$name is responding"
        else
            log_error "$name is not responding"
            unhealthy=$((unhealthy + 1))
        fi
    done < /tmp/apps-config.txt
    
    if [ $unhealthy -eq 0 ]; then
        log_success "All apps are healthy"
    else
        log_warning "$unhealthy apps are not responding"
        log_info "Check PM2 logs with: pm2 logs"
    fi
}

# Generate deployment report
generate_report() {
    log_header "PHASE 6: DEPLOYMENT REPORT"
    
    log_info "Generating deployment report..."
    
    cat > "$REPORT_FILE" << EOF
# Multi-App Subdomain Deployment Report

**Generated:** $(date)  
**VPS IP:** $VPS_IP  
**Domain:** $DOMAIN

## Deployment Summary

EOF
    
    # Add deployment status table
    echo "| Subdomain | App Name | Port | Status | Notes |" >> "$REPORT_FILE"
    echo "|-----------|----------|------|--------|-------|" >> "$REPORT_FILE"
    
    while IFS='|' read -r name dir port; do
        local subdomain
        local full_domain
        local app_port=$(extract_port_from_ecosystem "$name")
        local status="❓"
        local notes=""
        
        if [[ $name == iiskills-main ]]; then
            subdomain="@"
            full_domain="$DOMAIN"
        else
            subdomain=$(echo "$name" | sed 's/^iiskills-//')
            full_domain="${subdomain}.${DOMAIN}"
        fi
        
        # Check PM2 status
        if [ "$DRY_RUN" = false ]; then
            if pm2 describe "$name" &> /dev/null; then
                status="✅ LIVE"
                notes="PM2 running"
                
                # Check if app is responding
                if ! curl -f -s -o /dev/null http://localhost:$app_port 2>/dev/null; then
                    status="⚠️ STARTING"
                    notes="PM2 running, app not responding yet"
                fi
            else
                status="❌ STOPPED"
                notes="Not running in PM2"
            fi
            
            # Check SSL certificate
            if [ -d "/etc/letsencrypt/live/$full_domain" ]; then
                notes="$notes, SSL configured"
            else
                notes="$notes, SSL pending"
            fi
        else
            status="🔧 DRY RUN"
            notes="Would be deployed"
        fi
        
        echo "| $full_domain | $name | $app_port | $status | $notes |" >> "$REPORT_FILE"
    done < /tmp/apps-config.txt
    
    # Add configuration details
    cat >> "$REPORT_FILE" << EOF

## Configuration Details

### Nginx Configuration
- **Location:** \`$NGINX_SITES_AVAILABLE/\`
- **Enabled Sites:** \`$NGINX_SITES_ENABLED/\`

### PM2 Process List
\`\`\`
EOF
    
    if [ "$DRY_RUN" = false ]; then
        pm2 list >> "$REPORT_FILE"
    else
        echo "[DRY RUN] PM2 process list not available" >> "$REPORT_FILE"
    fi
    
    cat >> "$REPORT_FILE" << EOF
\`\`\`

### SSL Certificates
- **Certbot Config:** \`/etc/letsencrypt/\`
- **Renewal:** Automatic via systemd timer

### Logs
- **PM2 Logs:** \`$LOG_DIR/\`
- **Nginx Logs:** \`/var/log/nginx/\`
- **Certbot Logs:** \`/var/log/letsencrypt/\`

## Management Commands

### PM2 Commands
\`\`\`bash
# View all processes
pm2 status

# View logs
pm2 logs

# Restart all apps
pm2 restart all

# Restart specific app
pm2 restart iiskills-learn-chemistry

# Monitor resources
pm2 monit

# Save process list
pm2 save
\`\`\`

### Nginx Commands
\`\`\`bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# View status
sudo systemctl status nginx
\`\`\`

### SSL Certificate Commands
\`\`\`bash
# List certificates
sudo certbot certificates

# Renew certificates (dry run)
sudo certbot renew --dry-run

# Renew certificates
sudo certbot renew
\`\`\`

## Troubleshooting

### App Not Responding
1. Check PM2 status: \`pm2 status\`
2. Check PM2 logs: \`pm2 logs <app-name>\`
3. Restart app: \`pm2 restart <app-name>\`

### SSL Issues
1. Check certificate: \`sudo certbot certificates\`
2. Verify DNS: \`dig A <subdomain>.iiskills.cloud\`
3. Test renewal: \`sudo certbot renew --dry-run\`

### Nginx Issues
1. Test config: \`sudo nginx -t\`
2. Check error log: \`sudo tail -f /var/log/nginx/error.log\`
3. Reload config: \`sudo systemctl reload nginx\`

## Next Steps

1. Verify all subdomains are accessible via HTTPS
2. Test cross-subdomain authentication
3. Monitor PM2 processes for stability
4. Setup external monitoring (e.g., UptimeRobot)
5. Configure backup strategy

---

**Deployment completed at:** $(date)
EOF
    
    log_success "Deployment report generated: $REPORT_FILE"
    
    # Display summary
    echo ""
    echo -e "${BOLD}${MAGENTA}Deployment Summary${NC}"
    echo -e "${BOLD}${MAGENTA}═══════════════════${NC}"
    cat "$REPORT_FILE" | grep "^|" | head -20
}

# Main execution
main() {
    log_header "MULTI-APP SUBDOMAIN DEPLOYMENT"
    echo -e "${CYAN}Domain: ${BOLD}$DOMAIN${NC}"
    echo -e "${CYAN}VPS IP: ${BOLD}$VPS_IP${NC}"
    echo -e "${CYAN}Repository: ${BOLD}$REPO_ROOT${NC}"
    
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}${BOLD}MODE: DRY RUN (no changes will be made)${NC}"
    fi
    
    echo ""
    
    # Load configuration
    load_app_config
    
    # Execute deployment phases
    verify_dns
    build_and_deploy_apps
    generate_nginx_config
    setup_ssl_certificates
    setup_monitoring
    generate_report
    
    # Final summary
    log_header "DEPLOYMENT COMPLETE! 🎉"
    
    echo -e "${GREEN}✅ All phases completed${NC}"
    echo ""
    echo -e "${CYAN}📊 View full report:${NC} $REPORT_FILE"
    echo -e "${CYAN}📝 View PM2 status:${NC} pm2 status"
    echo -e "${CYAN}📋 View logs:${NC} pm2 logs"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo "  1. Verify all subdomains are accessible"
    echo "  2. Test HTTPS on all domains"
    echo "  3. Verify cross-subdomain authentication"
    echo "  4. Setup external monitoring"
    echo ""
    
    # Cleanup
    rm -f /tmp/apps-config.txt
}

# Run main function
main
