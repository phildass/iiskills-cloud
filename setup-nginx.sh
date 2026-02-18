#!/bin/bash
# NGINX Reverse Proxy Setup Script for iiskills.cloud
# This script automates the deployment of NGINX configurations for all Next.js app subdomains

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONFIGS_DIR="${SCRIPT_DIR}/nginx-configs"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

# Subdomain to port mapping based on ecosystem.config.js and appRegistry.js
declare -A SUBDOMAIN_PORTS=(
    ["app.iiskills.cloud"]="3000"
    ["learn-ai.iiskills.cloud"]="3024"
    ["learn-apt.iiskills.cloud"]="3002"
    ["learn-chemistry.iiskills.cloud"]="3005"
    ["learn-developer.iiskills.cloud"]="3007"
    ["learn-geography.iiskills.cloud"]="3011"
    ["learn-management.iiskills.cloud"]="3016"
    ["learn-math.iiskills.cloud"]="3017"
    ["learn-physics.iiskills.cloud"]="3020"
    ["learn-pr.iiskills.cloud"]="3021"
)

# Print colored message
print_msg() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Print section header
print_header() {
    echo
    print_msg "$BLUE" "======================================"
    print_msg "$BLUE" "$1"
    print_msg "$BLUE" "======================================"
}

# Check if running as root or with sudo
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_msg "$RED" "This script must be run as root or with sudo"
        exit 1
    fi
}

# Check if NGINX is installed
check_nginx() {
    print_header "Checking NGINX Installation"
    if ! command -v nginx &> /dev/null; then
        print_msg "$RED" "NGINX is not installed. Installing..."
        apt-get update
        apt-get install -y nginx
        print_msg "$GREEN" "✓ NGINX installed successfully"
    else
        print_msg "$GREEN" "✓ NGINX is already installed"
        nginx -v
    fi
}

# Check if PM2 is running and apps are up
check_pm2() {
    print_header "Checking PM2 Processes"
    if ! command -v pm2 &> /dev/null; then
        print_msg "$RED" "✗ PM2 is not installed"
        print_msg "$YELLOW" "Please install PM2 and start your apps first:"
        print_msg "$YELLOW" "  npm install -g pm2"
        print_msg "$YELLOW" "  pm2 start ecosystem.config.js"
        exit 1
    fi
    
    print_msg "$GREEN" "✓ PM2 is installed"
    pm2 list
}

# Check if port is listening
check_port() {
    local port=$1
    if lsof -i :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Validate all app ports are listening
validate_ports() {
    print_header "Validating App Ports"
    local all_ok=true
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        local port=${SUBDOMAIN_PORTS[$subdomain]}
        if check_port $port; then
            print_msg "$GREEN" "✓ $subdomain -> localhost:$port (listening)"
        else
            print_msg "$RED" "✗ $subdomain -> localhost:$port (NOT listening)"
            all_ok=false
        fi
    done
    
    if [ "$all_ok" = false ]; then
        print_msg "$YELLOW" ""
        print_msg "$YELLOW" "Some ports are not listening. Please start the apps with PM2:"
        print_msg "$YELLOW" "  pm2 start ecosystem.config.js"
        exit 1
    fi
}

# Copy NGINX config files
copy_configs() {
    print_header "Copying NGINX Configurations"
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        local config_file="${NGINX_CONFIGS_DIR}/${subdomain}"
        local target_file="${NGINX_SITES_AVAILABLE}/${subdomain}"
        
        if [ ! -f "$config_file" ]; then
            print_msg "$RED" "✗ Config file not found: $config_file"
            continue
        fi
        
        # Copy config
        cp "$config_file" "$target_file"
        print_msg "$GREEN" "✓ Copied: $subdomain"
    done
}

# Enable sites by creating symlinks
enable_sites() {
    print_header "Enabling Sites"
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        local available_file="${NGINX_SITES_AVAILABLE}/${subdomain}"
        local enabled_file="${NGINX_SITES_ENABLED}/${subdomain}"
        
        if [ ! -f "$available_file" ]; then
            print_msg "$RED" "✗ Config not found in sites-available: $subdomain"
            continue
        fi
        
        # Remove old symlink if exists
        if [ -L "$enabled_file" ]; then
            rm "$enabled_file"
        fi
        
        # Create symlink
        ln -s "$available_file" "$enabled_file"
        print_msg "$GREEN" "✓ Enabled: $subdomain"
    done
}

# Test NGINX configuration
test_nginx() {
    print_header "Testing NGINX Configuration"
    if nginx -t; then
        print_msg "$GREEN" "✓ NGINX configuration is valid"
        return 0
    else
        print_msg "$RED" "✗ NGINX configuration has errors"
        return 1
    fi
}

# Reload NGINX
reload_nginx() {
    print_header "Reloading NGINX"
    if systemctl reload nginx; then
        print_msg "$GREEN" "✓ NGINX reloaded successfully"
    else
        print_msg "$RED" "✗ Failed to reload NGINX"
        exit 1
    fi
}

# Verify HTTP to HTTPS redirect
verify_http_redirect() {
    print_header "Verifying HTTP to HTTPS Redirects"
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        # Skip HTTPS check, just check if HTTP responds
        local http_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 5 "http://${subdomain}" 2>/dev/null || echo "000")
        
        if [[ "$http_code" == "301" || "$http_code" == "302" ]]; then
            print_msg "$GREEN" "✓ $subdomain: HTTP redirects (${http_code})"
        elif [[ "$http_code" == "000" ]]; then
            print_msg "$YELLOW" "⚠ $subdomain: Could not connect (check DNS/firewall)"
        else
            print_msg "$YELLOW" "⚠ $subdomain: HTTP responds but no redirect (${http_code})"
        fi
    done
}

# Test HTTPS endpoints
verify_https() {
    print_header "Verifying HTTPS Endpoints"
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        # Test HTTPS connection
        local https_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 5 "https://${subdomain}" 2>/dev/null || echo "000")
        
        if [[ "$https_code" == "200" ]]; then
            print_msg "$GREEN" "✓ $subdomain: HTTPS working (200 OK)"
        elif [[ "$https_code" == "502" ]]; then
            print_msg "$RED" "✗ $subdomain: Bad Gateway (502) - Backend not responding"
        elif [[ "$https_code" == "000" ]]; then
            print_msg "$YELLOW" "⚠ $subdomain: Could not connect (SSL cert missing or DNS issue)"
        else
            print_msg "$YELLOW" "⚠ $subdomain: HTTPS responds with code ${https_code}"
        fi
    done
}

# Generate SSL certificates with Certbot
setup_ssl() {
    print_header "SSL Certificate Setup"
    
    print_msg "$YELLOW" "⚠ CRITICAL: SSL certificate warnings must NEVER appear on any subdomain."
    print_msg "$YELLOW" "All certificates must be valid, properly issued, and correctly installed."
    echo
    
    print_msg "$BLUE" "Checking for existing certificates..."
    
    local missing_certs=()
    local expired_certs=()
    local valid_certs=()
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        if [ -d "/etc/letsencrypt/live/$subdomain" ]; then
            # Check if certificate is expired
            local expiry_date=$(openssl x509 -in "/etc/letsencrypt/live/$subdomain/cert.pem" -noout -enddate 2>/dev/null | cut -d= -f2)
            if [ -n "$expiry_date" ]; then
                local expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$expiry_date" +%s 2>/dev/null)
                local current_epoch=$(date +%s)
                local days_until_expiry=$(( ($expiry_epoch - $current_epoch) / 86400 ))
                
                if [ $days_until_expiry -lt 0 ]; then
                    print_msg "$RED" "  ✗ $subdomain: Certificate EXPIRED ${days_until_expiry#-} days ago"
                    expired_certs+=("$subdomain")
                elif [ $days_until_expiry -lt 30 ]; then
                    print_msg "$YELLOW" "  ⚠ $subdomain: Certificate expires in $days_until_expiry days"
                    valid_certs+=("$subdomain")
                else
                    print_msg "$GREEN" "  ✓ $subdomain: Certificate valid for $days_until_expiry days"
                    valid_certs+=("$subdomain")
                fi
            else
                print_msg "$YELLOW" "  ⚠ $subdomain: Certificate exists but cannot verify expiry"
                missing_certs+=("$subdomain")
            fi
        else
            print_msg "$RED" "  ✗ $subdomain: No certificate found"
            missing_certs+=("$subdomain")
        fi
    done
    
    echo
    print_msg "$BLUE" "Certificate Status Summary:"
    print_msg "$GREEN" "  Valid: ${#valid_certs[@]}"
    print_msg "$RED" "  Missing: ${#missing_certs[@]}"
    print_msg "$RED" "  Expired: ${#expired_certs[@]}"
    echo
    
    if [ ${#missing_certs[@]} -gt 0 ] || [ ${#expired_certs[@]} -gt 0 ]; then
        print_msg "$RED" "⚠ ACTION REQUIRED: SSL certificates must be obtained or renewed"
        echo
        
        print_msg "$YELLOW" "To obtain/renew certificates for all subdomains at once:"
        echo
        echo "  sudo certbot --nginx \\"
        for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
            echo "    -d ${subdomain} \\"
        done
        echo "    --email admin@iiskills.cloud \\"
        echo "    --agree-tos \\"
        echo "    --no-eff-email \\"
        echo "    --redirect"
        echo
        
        print_msg "$YELLOW" "Or use our automated renewal script:"
        echo "  sudo ./renew-ssl-certificates.sh --force"
        echo
        
        if [ ${#expired_certs[@]} -gt 0 ]; then
            print_msg "$RED" "CRITICAL: Expired certificates MUST be renewed immediately!"
            print_msg "$RED" "Users will see security warnings until certificates are renewed."
            echo
        fi
    else
        print_msg "$GREEN" "✓ All SSL certificates are valid"
        echo
    fi
    
    print_msg "$YELLOW" "After obtaining/renewing certificates:"
    print_msg "$YELLOW" "  1. Reload NGINX: sudo systemctl reload nginx"
    print_msg "$YELLOW" "  2. Verify SSL: ./verify-ssl-certificates.sh"
    print_msg "$YELLOW" "  3. Test with SSL Labs: https://www.ssllabs.com/ssltest/"
    print_msg "$YELLOW" "  4. Check in multiple browsers (Chrome, Firefox, Safari)"
    print_msg "$YELLOW" "  5. Ensure no warnings from security tools (Kaspersky, etc.)"
    echo
}

# Print summary
print_summary() {
    print_header "Setup Summary"
    echo
    print_msg "$GREEN" "NGINX reverse proxy configuration complete!"
    echo
    print_msg "$BLUE" "Configured subdomains:"
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        echo "  • $subdomain -> localhost:${SUBDOMAIN_PORTS[$subdomain]}"
    done
    echo
    print_msg "$YELLOW" "Next steps:"
    print_msg "$YELLOW" "1. Ensure DNS A records point to this server for all subdomains"
    print_msg "$YELLOW" "2. Obtain/renew SSL certificates (CRITICAL - see instructions above)"
    print_msg "$YELLOW" "3. Test all subdomains with ./verify-ssl-certificates.sh"
    print_msg "$YELLOW" "4. Verify SSL with https://www.ssllabs.com/ssltest/ (should achieve A+)"
    print_msg "$YELLOW" "5. Test in multiple browsers to ensure no security warnings"
    print_msg "$YELLOW" "6. Monitor logs: tail -f /var/log/nginx/*.log"
    echo
    print_msg "$GREEN" "Documentation:"
    print_msg "$GREEN" "  • SSL Setup Guide: SSL_CERTIFICATE_SETUP.md"
    print_msg "$GREEN" "  • NGINX Setup: NGINX_SETUP.md"
    print_msg "$GREEN" "  • Verification: ./verify-ssl-certificates.sh --help"
    print_msg "$GREEN" "  • Renewal: ./renew-ssl-certificates.sh --help"
}

# Main execution
main() {
    print_header "NGINX Reverse Proxy Setup for iiskills.cloud"
    
    # Pre-flight checks
    check_root
    check_nginx
    check_pm2
    validate_ports
    
    # Deploy configurations
    copy_configs
    enable_sites
    
    # Test and reload
    if test_nginx; then
        reload_nginx
    else
        print_msg "$RED" "Configuration test failed. Please fix errors and run again."
        exit 1
    fi
    
    # Verification
    verify_http_redirect
    verify_https
    
    # SSL setup instructions
    setup_ssl
    
    # Summary
    print_summary
}

# Run main function
main "$@"
