#!/bin/bash

#
# DNS Verification Script for Multi-App Subdomain Deployment
#
# This script checks if all required DNS A records are properly configured
# for all learning app subdomains.
#
# Usage: ./verify-subdomain-dns.sh
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
DOMAIN="iiskills.cloud"
EXPECTED_IP="72.60.203.189"

# List of all subdomains to check
SUBDOMAINS=(
    "www"
    "learn-ai"
    "learn-apt"
    "learn-chemistry"
    "learn-data-science"
    "learn-geography"
    "learn-govt-jobs"
    "learn-ias"
    "learn-jee"
    "learn-leadership"
    "learn-management"
    "learn-math"
    "learn-neet"
    "learn-physics"
    "learn-pr"
    "learn-winning"
)

echo ""
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}DNS Verification for Multi-App Subdomain Deployment${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Domain:${NC} $DOMAIN"
echo -e "${CYAN}Expected IP:${NC} $EXPECTED_IP"
echo -e "${CYAN}Total subdomains to check:${NC} $((${#SUBDOMAINS[@]} + 1))"
echo ""

# Check if dig is available
if ! command -v dig &> /dev/null; then
    echo -e "${RED}❌ Error: 'dig' command not found${NC}"
    echo ""
    echo "Please install dig using:"
    echo -e "${CYAN}  Ubuntu/Debian:${NC} sudo apt-get install dnsutils"
    echo -e "${CYAN}  macOS:${NC} dig is pre-installed"
    echo -e "${CYAN}  CentOS/RHEL:${NC} sudo yum install bind-utils"
    echo ""
    echo "Alternatively, use online tools:"
    echo "  - https://dnschecker.org"
    echo "  - https://mxtoolbox.com"
    exit 1
fi

# Function to check DNS record
check_dns_record() {
    local domain=$1
    local expected=$2
    
    local result=$(dig +short A "$domain" | head -n1)
    
    if [ -z "$result" ]; then
        echo -e "${RED}❌ NOT FOUND${NC} - $domain"
        echo -e "   ${CYAN}Action:${NC} Add A record: $domain -> $expected"
        return 1
    elif [ "$result" = "$expected" ]; then
        echo -e "${GREEN}✅ VERIFIED${NC}  - $domain -> $result"
        return 0
    else
        echo -e "${YELLOW}⚠️  INCORRECT${NC} - $domain -> $result (expected: $expected)"
        echo -e "   ${CYAN}Action:${NC} Update A record to point to $expected"
        return 1
    fi
}

# Track results
total_checked=0
successful=0
failed=0
missing=0

# Create arrays to store results
declare -a failed_domains
declare -a missing_domains

echo -e "${BOLD}Checking DNS Records...${NC}"
echo ""

# Check main domain
echo -e "${BLUE}[1/17]${NC} Checking main domain..."
total_checked=$((total_checked + 1))
if check_dns_record "$DOMAIN" "$EXPECTED_IP"; then
    successful=$((successful + 1))
else
    if [ -z "$(dig +short A "$DOMAIN")" ]; then
        missing=$((missing + 1))
        missing_domains+=("$DOMAIN")
    else
        failed=$((failed + 1))
        failed_domains+=("$DOMAIN")
    fi
fi
echo ""

# Check all subdomains
counter=2
for subdomain in "${SUBDOMAINS[@]}"; do
    full_domain="${subdomain}.${DOMAIN}"
    echo -e "${BLUE}[$counter/17]${NC} Checking $full_domain..."
    total_checked=$((total_checked + 1))
    
    if check_dns_record "$full_domain" "$EXPECTED_IP"; then
        successful=$((successful + 1))
    else
        if [ -z "$(dig +short A "$full_domain")" ]; then
            missing=$((missing + 1))
            missing_domains+=("$full_domain")
        else
            failed=$((failed + 1))
            failed_domains+=("$full_domain")
        fi
    fi
    echo ""
    counter=$((counter + 1))
done

# Summary
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}Summary${NC}"
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Total checked:${NC} $total_checked"
echo -e "${GREEN}Successful:${NC}    $successful"
echo -e "${YELLOW}Incorrect:${NC}     $failed"
echo -e "${RED}Missing:${NC}       $missing"
echo ""

# Show detailed results
if [ $failed -gt 0 ]; then
    echo -e "${YELLOW}${BOLD}Domains with Incorrect DNS:${NC}"
    for domain in "${failed_domains[@]}"; do
        echo -e "  ${YELLOW}⚠️${NC}  $domain"
    done
    echo ""
fi

if [ $missing -gt 0 ]; then
    echo -e "${RED}${BOLD}Domains with Missing DNS:${NC}"
    for domain in "${missing_domains[@]}"; do
        echo -e "  ${RED}❌${NC} $domain"
    done
    echo ""
fi

# Final verdict
echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
if [ $successful -eq $total_checked ]; then
    echo -e "${GREEN}${BOLD}✅ SUCCESS! All DNS records are configured correctly!${NC}"
    echo ""
    echo -e "${CYAN}Next steps:${NC}"
    echo "  1. Run the deployment script: sudo ./deploy-subdomains.sh"
    echo "  2. Wait for apps to build and deploy"
    echo "  3. Verify HTTPS access to all subdomains"
else
    echo -e "${RED}${BOLD}❌ DNS CONFIGURATION INCOMPLETE${NC}"
    echo ""
    echo -e "${CYAN}Required Actions:${NC}"
    echo ""
    
    if [ $missing -gt 0 ]; then
        echo -e "${BOLD}Add the following A records in your DNS provider:${NC}"
        for domain in "${missing_domains[@]}"; do
            if [[ $domain == $DOMAIN ]]; then
                echo "  ${BOLD}@${NC} (root) -> $EXPECTED_IP"
            else
                subdomain=${domain%.$DOMAIN}
                echo "  ${BOLD}$subdomain${NC} -> $EXPECTED_IP"
            fi
        done
        echo ""
    fi
    
    if [ $failed -gt 0 ]; then
        echo -e "${BOLD}Update the following A records to point to $EXPECTED_IP:${NC}"
        for domain in "${failed_domains[@]}"; do
            current=$(dig +short A "$domain" | head -n1)
            if [[ $domain == $DOMAIN ]]; then
                echo "  ${BOLD}@${NC} (root): $current -> $EXPECTED_IP"
            else
                subdomain=${domain%.$DOMAIN}
                echo "  ${BOLD}$subdomain${NC}: $current -> $EXPECTED_IP"
            fi
        done
        echo ""
    fi
    
    echo -e "${CYAN}How to configure DNS:${NC}"
    echo "  1. Log in to your DNS provider (Hostinger, Cloudflare, etc.)"
    echo "  2. Navigate to DNS management for $DOMAIN"
    echo "  3. Add or update A records as shown above"
    echo "  4. Wait 5-60 minutes for DNS propagation"
    echo "  5. Run this script again to verify"
    echo ""
    echo -e "${CYAN}Useful tools:${NC}"
    echo "  - Check propagation: https://dnschecker.org"
    echo "  - DNS lookup: https://mxtoolbox.com/SuperTool.aspx"
fi

echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Exit with appropriate code
if [ $successful -eq $total_checked ]; then
    exit 0
else
    exit 1
fi
