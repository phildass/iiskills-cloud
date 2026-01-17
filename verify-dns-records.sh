#!/bin/bash

#
# DNS Verification Script for Resend Domain Authentication
# 
# This script checks if all required DNS records are properly configured
# for iiskills.cloud domain authentication with Resend.
#
# Usage: ./verify-dns-records.sh
#

echo ""
echo "🔍 Verifying DNS Records for Resend Domain Authentication"
echo "=========================================================="
echo ""

# Configuration
DOMAIN="iiskills.cloud"
SEND_DOMAIN="send.iiskills.cloud"
DKIM_DOMAIN="resend._domainkey.iiskills.cloud"
DMARC_DOMAIN="_dmarc.iiskills.cloud"
MAX_DISPLAY_LENGTH=100

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if dig is available
if ! command -v dig &> /dev/null; then
    echo -e "${RED}❌ Error: 'dig' command not found${NC}"
    echo ""
    echo "Please install dig using:"
    echo "  Ubuntu/Debian: sudo apt-get install dnsutils"
    echo "  macOS: dig is pre-installed"
    echo "  CentOS/RHEL: sudo yum install bind-utils"
    echo ""
    echo "Alternatively, use online tools:"
    echo "  - https://dnschecker.org"
    echo "  - https://mxtoolbox.com"
    exit 1
fi

# Function to check DNS record
check_record() {
    local record_type=$1
    local domain=$2
    local expected=$3
    local name=$4
    
    echo -e "${BLUE}Checking ${name}...${NC}"
    
    result=$(dig +short ${record_type} ${domain} | tr '\n' ' ')
    
    if [ -z "$result" ]; then
        echo -e "${RED}❌ NOT FOUND${NC}"
        echo "   Domain: ${domain}"
        echo "   Expected: ${expected}"
        echo "   Status: Record not found or not yet propagated"
        echo ""
        return 1
    else
        # Check if result matches expected pattern
        if echo "$result" | grep -qi "${expected}"; then
            echo -e "${GREEN}✅ FOUND${NC}"
            echo "   Domain: ${domain}"
            # Properly truncate long results
            if [ ${#result} -gt ${MAX_DISPLAY_LENGTH} ]; then
                echo "   Value: ${result:0:${MAX_DISPLAY_LENGTH}}..."
            else
                echo "   Value: ${result}"
            fi
            echo ""
            return 0
        else
            echo -e "${YELLOW}⚠️  FOUND BUT MAY BE INCORRECT${NC}"
            echo "   Domain: ${domain}"
            # Properly truncate long results
            if [ ${#result} -gt ${MAX_DISPLAY_LENGTH} ]; then
                echo "   Value: ${result:0:${MAX_DISPLAY_LENGTH}}..."
            else
                echo "   Value: ${result}"
            fi
            echo "   Expected to contain: ${expected}"
            echo ""
            return 1
        fi
    fi
}

# Track overall status
all_passed=true

# Check DKIM record
echo "1️⃣  DKIM (Domain Verification)"
echo "────────────────────────────"
if ! check_record "TXT" "${DKIM_DOMAIN}" "DKIM1" "DKIM Record"; then
    all_passed=false
fi

# Check MX record
echo "2️⃣  MX (Bounce Handling)"
echo "────────────────────────────"
if ! check_record "MX" "${SEND_DOMAIN}" "feedback-smtp" "MX Record"; then
    all_passed=false
fi

# Check SPF record
echo "3️⃣  SPF (Sender Authentication)"
echo "────────────────────────────"
if ! check_record "TXT" "${SEND_DOMAIN}" "spf1" "SPF Record"; then
    all_passed=false
fi

# Check DMARC record (optional but recommended)
echo "4️⃣  DMARC (Email Policy) - Optional"
echo "────────────────────────────"
if ! check_record "TXT" "${DMARC_DOMAIN}" "DMARC1" "DMARC Record"; then
    echo -e "${YELLOW}ℹ️  DMARC is optional but recommended${NC}"
    echo ""
fi

# Summary
echo "=========================================================="
echo ""

if [ "$all_passed" = true ]; then
    echo -e "${GREEN}✅ All required DNS records are configured correctly!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Check Resend dashboard for domain verification status"
    echo "  2. Wait for 'Verified' status (can take up to 48 hours)"
    echo "  3. Run test: node test-resend-auth.js <your-email>"
    echo ""
    echo "Resend Dashboard: https://resend.com/domains"
else
    echo -e "${RED}❌ Some DNS records are missing or incorrect${NC}"
    echo ""
    echo "What to do:"
    echo "  1. Add the missing records at your DNS provider"
    echo "  2. Wait 5-60 minutes for DNS propagation"
    echo "  3. Run this script again to verify"
    echo ""
    echo "Documentation:"
    echo "  - Quick reference: RESEND_DNS_QUICK_REFERENCE.md"
    echo "  - Full guide: RESEND_DOMAIN_SETUP.md"
    echo ""
    echo "DNS Provider Login:"
    echo "  - Cloudflare: https://dash.cloudflare.com"
    echo "  - GoDaddy: https://dcc.godaddy.com/manage/dns"
    echo "  - Namecheap: https://ap.www.namecheap.com/domains/list/"
fi

echo ""

# Additional DNS propagation check info
echo "📊 Check DNS Propagation Globally:"
echo "   https://dnschecker.org/#TXT/${DKIM_DOMAIN}"
echo ""

exit 0
