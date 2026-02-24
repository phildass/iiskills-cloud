#!/bin/bash
# Verification Script for NGINX Reverse Proxy Setup
# Tests all subdomains for proper HTTP/HTTPS operation and absence of 502 errors

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# All subdomains
SUBDOMAINS=(
    "app.iiskills.cloud"
    "learn-ai.iiskills.cloud"
    "learn-apt.iiskills.cloud"
    "learn-chemistry.iiskills.cloud"
    "learn-developer.iiskills.cloud"
    "learn-geography.iiskills.cloud"
    "learn-management.iiskills.cloud"
    "learn-math.iiskills.cloud"
    "learn-physics.iiskills.cloud"
    "learn-pr.iiskills.cloud"
)

print_msg() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_header() {
    echo
    print_msg "$BLUE" "======================================"
    print_msg "$BLUE" "$1"
    print_msg "$BLUE" "======================================"
}

# Test HTTP endpoint
test_http() {
    local subdomain=$1
    local url="http://${subdomain}"
    
    # Get HTTP status code
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$url" 2>/dev/null || echo "000")
    
    if [[ "$http_code" == "301" || "$http_code" == "302" ]]; then
        print_msg "$GREEN" "✓ HTTP ${http_code}: $subdomain (redirect working)"
        return 0
    elif [[ "$http_code" == "200" ]]; then
        print_msg "$YELLOW" "⚠ HTTP 200: $subdomain (should redirect to HTTPS)"
        return 1
    elif [[ "$http_code" == "000" ]]; then
        print_msg "$RED" "✗ HTTP failed: $subdomain (cannot connect)"
        return 1
    else
        print_msg "$RED" "✗ HTTP ${http_code}: $subdomain"
        return 1
    fi
}

# Test HTTPS endpoint
test_https() {
    local subdomain=$1
    local url="https://${subdomain}"
    
    # Get HTTPS status code and check for actual response
    local https_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$url" 2>/dev/null || echo "000")
    
    if [[ "$https_code" == "200" ]]; then
        # Also check that it's not a 502 by fetching a bit of content
        local content=$(curl -s --max-time 10 "$url" 2>/dev/null | head -c 100)
        if [[ -n "$content" ]]; then
            print_msg "$GREEN" "✓ HTTPS 200: $subdomain (serving content)"
            return 0
        else
            print_msg "$YELLOW" "⚠ HTTPS 200: $subdomain (but no content)"
            return 1
        fi
    elif [[ "$https_code" == "502" ]]; then
        print_msg "$RED" "✗ HTTPS 502: $subdomain (Bad Gateway - backend not responding)"
        return 1
    elif [[ "$https_code" == "000" ]]; then
        print_msg "$RED" "✗ HTTPS failed: $subdomain (SSL cert missing or cannot connect)"
        return 1
    else
        print_msg "$YELLOW" "⚠ HTTPS ${https_code}: $subdomain"
        return 1
    fi
}

# Test localhost port
test_localhost() {
    local port=$1
    local subdomain=$2
    
    if curl -s --max-time 5 "http://localhost:${port}" > /dev/null 2>&1; then
        print_msg "$GREEN" "✓ localhost:${port} responding ($subdomain)"
        return 0
    else
        print_msg "$RED" "✗ localhost:${port} NOT responding ($subdomain)"
        return 1
    fi
}

# Main verification
main() {
    print_header "NGINX Reverse Proxy Verification"
    
    local total=0
    local passed=0
    local failed=0
    
    # Test localhost ports first
    print_header "Testing Localhost Ports"
    declare -A PORTS=(
        ["3000"]="app.iiskills.cloud"
        ["3024"]="learn-ai.iiskills.cloud"
        ["3002"]="learn-apt.iiskills.cloud"
        ["3005"]="learn-chemistry.iiskills.cloud"
        ["3007"]="learn-developer.iiskills.cloud"
        ["3011"]="learn-geography.iiskills.cloud"
        ["3016"]="learn-management.iiskills.cloud"
        ["3017"]="learn-math.iiskills.cloud"
        ["3020"]="learn-physics.iiskills.cloud"
        ["3021"]="learn-pr.iiskills.cloud"
    )
    
    for port in "${!PORTS[@]}"; do
        if test_localhost "$port" "${PORTS[$port]}"; then
            ((passed++))
        else
            ((failed++))
        fi
        ((total++))
    done
    
    # Test HTTP redirects
    print_header "Testing HTTP to HTTPS Redirects"
    for subdomain in "${SUBDOMAINS[@]}"; do
        if test_http "$subdomain"; then
            ((passed++))
        else
            ((failed++))
        fi
        ((total++))
    done
    
    # Test HTTPS endpoints
    print_header "Testing HTTPS Endpoints"
    for subdomain in "${SUBDOMAINS[@]}"; do
        if test_https "$subdomain"; then
            ((passed++))
        else
            ((failed++))
        fi
        ((total++))
    done
    
    # Summary
    print_header "Verification Summary"
    echo
    print_msg "$BLUE" "Total tests: $total"
    print_msg "$GREEN" "Passed: $passed"
    print_msg "$RED" "Failed: $failed"
    echo
    
    if [[ $failed -eq 0 ]]; then
        print_msg "$GREEN" "✓ All tests passed! All subdomains are working correctly."
        exit 0
    else
        print_msg "$RED" "✗ Some tests failed. Please review the errors above."
        echo
        print_msg "$YELLOW" "Common issues:"
        print_msg "$YELLOW" "  1. PM2 apps not running: pm2 list && pm2 restart all"
        print_msg "$YELLOW" "  2. DNS not configured: check A records for all subdomains"
        print_msg "$YELLOW" "  3. SSL certificates missing: run certbot --nginx"
        print_msg "$YELLOW" "  4. Firewall blocking: check ports 80 and 443"
        exit 1
    fi
}

main "$@"
