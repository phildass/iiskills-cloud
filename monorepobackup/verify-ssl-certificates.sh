#!/bin/bash
# SSL Certificate Verification Script for iiskills.cloud
# Comprehensive checks for certificate validity, expiration, chain, and security

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
QUIET_MODE=false
DETAILED_MODE=false
SINGLE_DOMAIN=""
EXPIRY_WARNING_DAYS=30

# All subdomains to check
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

# Print colored message
print_msg() {
    local color=$1
    local message=$2
    if [ "$QUIET_MODE" = false ]; then
        echo -e "${color}${message}${NC}"
    fi
}

# Print header
print_header() {
    if [ "$QUIET_MODE" = false ]; then
        echo
        print_msg "$BLUE" "======================================"
        print_msg "$BLUE" "$1"
        print_msg "$BLUE" "======================================"
    fi
}

# Usage information
usage() {
    cat << EOF
SSL Certificate Verification Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              Show this help message
    -q, --quiet             Quiet mode (only show errors)
    -d, --domain DOMAIN     Check only specific domain
    -v, --verbose           Verbose mode (show detailed certificate info)
    -w, --warning DAYS      Certificate expiry warning threshold (default: 30 days)

Examples:
    $0                                      # Check all subdomains
    $0 -d learn-apt.iiskills.cloud         # Check single subdomain
    $0 -q                                   # Quiet mode for cron jobs
    $0 -v                                   # Verbose output with details

EOF
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -q|--quiet)
            QUIET_MODE=true
            shift
            ;;
        -d|--domain)
            SINGLE_DOMAIN="$2"
            shift 2
            ;;
        -v|--verbose)
            DETAILED_MODE=true
            shift
            ;;
        -w|--warning)
            EXPIRY_WARNING_DAYS="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Check certificate expiration
check_expiration() {
    local domain=$1
    
    # Get certificate expiration date
    local expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
                       openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -z "$expiry_date" ]; then
        print_msg "$RED" "  ✗ Cannot retrieve certificate expiration date"
        return 1
    fi
    
    # Convert to epoch time
    local expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$expiry_date" +%s 2>/dev/null)
    local current_epoch=$(date +%s)
    local days_until_expiry=$(( ($expiry_epoch - $current_epoch) / 86400 ))
    
    if [ $days_until_expiry -lt 0 ]; then
        print_msg "$RED" "  ✗ Certificate EXPIRED ${days_until_expiry#-} days ago"
        return 1
    elif [ $days_until_expiry -lt $EXPIRY_WARNING_DAYS ]; then
        print_msg "$YELLOW" "  ⚠ Certificate expires in $days_until_expiry days (Warning threshold: $EXPIRY_WARNING_DAYS days)"
        return 2
    else
        print_msg "$GREEN" "  ✓ Certificate valid for $days_until_expiry days"
        return 0
    fi
}

# Check certificate chain
check_certificate_chain() {
    local domain=$1
    
    # Get certificate chain
    local cert_count=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" -showcerts 2>/dev/null | \
                      grep -c "BEGIN CERTIFICATE" || echo "0")
    
    if [ "$cert_count" -lt 2 ]; then
        print_msg "$RED" "  ✗ Incomplete certificate chain (found $cert_count certificates, expected 2+)"
        print_msg "$YELLOW" "    Should include: Server certificate + Intermediate certificate(s)"
        return 1
    else
        print_msg "$GREEN" "  ✓ Complete certificate chain ($cert_count certificates)"
        return 0
    fi
}

# Check certificate issuer
check_issuer() {
    local domain=$1
    
    local issuer=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
                  openssl x509 -noout -issuer 2>/dev/null | sed 's/issuer=//')
    
    if [ -z "$issuer" ]; then
        print_msg "$RED" "  ✗ Cannot retrieve certificate issuer"
        return 1
    fi
    
    # Check if it's a trusted CA (Let's Encrypt is trusted)
    if echo "$issuer" | grep -qi "Let's Encrypt"; then
        print_msg "$GREEN" "  ✓ Issued by: Let's Encrypt (trusted CA)"
        return 0
    elif echo "$issuer" | grep -qi "self-signed"; then
        print_msg "$RED" "  ✗ Self-signed certificate detected"
        return 1
    else
        print_msg "$GREEN" "  ✓ Issued by: $issuer"
        return 0
    fi
}

# Check certificate subject/CN
check_subject() {
    local domain=$1
    
    local subject=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
                   openssl x509 -noout -subject 2>/dev/null | sed 's/subject=//')
    
    if [ -z "$subject" ]; then
        print_msg "$RED" "  ✗ Cannot retrieve certificate subject"
        return 1
    fi
    
    # Check if domain is in subject
    if echo "$subject" | grep -q "$domain"; then
        print_msg "$GREEN" "  ✓ Certificate subject matches domain"
        return 0
    else
        print_msg "$YELLOW" "  ⚠ Certificate subject: $subject"
        return 2
    fi
}

# Check SAN (Subject Alternative Names)
check_san() {
    local domain=$1
    
    local san=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
               openssl x509 -noout -text 2>/dev/null | grep -A1 "Subject Alternative Name" | tail -1)
    
    if [ -z "$san" ]; then
        print_msg "$YELLOW" "  ⚠ No Subject Alternative Names found"
        return 2
    fi
    
    if echo "$san" | grep -q "$domain"; then
        print_msg "$GREEN" "  ✓ Domain present in SAN"
        if [ "$DETAILED_MODE" = true ]; then
            print_msg "$CYAN" "    SANs: $san"
        fi
        return 0
    else
        print_msg "$RED" "  ✗ Domain NOT found in SAN"
        print_msg "$YELLOW" "    Available SANs: $san"
        return 1
    fi
}

# Check TLS protocols
check_tls_protocols() {
    local domain=$1
    
    # Test TLS 1.2
    if echo | openssl s_client -servername "$domain" -connect "$domain:443" -tls1_2 2>/dev/null | grep -q "Protocol.*TLSv1.2"; then
        local tls12="✓"
    else
        local tls12="✗"
    fi
    
    # Test TLS 1.3
    if echo | openssl s_client -servername "$domain" -connect "$domain:443" -tls1_3 2>/dev/null | grep -q "Protocol.*TLSv1.3"; then
        local tls13="✓"
    else
        local tls13="✗"
    fi
    
    # Check for old/weak protocols (should fail)
    if echo | openssl s_client -servername "$domain" -connect "$domain:443" -ssl3 2>/dev/null | grep -q "Protocol.*SSLv3"; then
        print_msg "$RED" "  ✗ SSLv3 is enabled (CRITICAL SECURITY ISSUE)"
        return 1
    fi
    
    if [ "$tls12" = "✓" ] || [ "$tls13" = "✓" ]; then
        print_msg "$GREEN" "  ✓ TLS protocols: TLS 1.2[$tls12] TLS 1.3[$tls13]"
        return 0
    else
        print_msg "$RED" "  ✗ No modern TLS protocols detected"
        return 1
    fi
}

# Check cipher strength
check_cipher_strength() {
    local domain=$1
    
    local cipher=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
                  grep "Cipher" | head -1 | awk '{print $3}')
    
    if [ -z "$cipher" ]; then
        print_msg "$YELLOW" "  ⚠ Cannot determine cipher suite"
        return 2
    fi
    
    # Check for weak ciphers
    if echo "$cipher" | grep -qiE "NULL|EXPORT|DES|MD5|RC4"; then
        print_msg "$RED" "  ✗ Weak cipher detected: $cipher"
        return 1
    else
        print_msg "$GREEN" "  ✓ Strong cipher in use: $cipher"
        return 0
    fi
}

# Check HTTPS accessibility
check_https_accessible() {
    local domain=$1
    
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "https://${domain}" 2>/dev/null || echo "000")
    
    if [ "$http_code" = "200" ]; then
        print_msg "$GREEN" "  ✓ HTTPS accessible (200 OK)"
        return 0
    elif [ "$http_code" = "502" ]; then
        print_msg "$RED" "  ✗ HTTPS returns 502 Bad Gateway (backend issue)"
        return 1
    elif [ "$http_code" = "000" ]; then
        print_msg "$RED" "  ✗ Cannot connect via HTTPS"
        return 1
    else
        print_msg "$YELLOW" "  ⚠ HTTPS returns HTTP $http_code"
        return 2
    fi
}

# Check HSTS header
check_hsts() {
    local domain=$1
    
    local hsts=$(curl -s -I "https://${domain}" 2>/dev/null | grep -i "Strict-Transport-Security" || echo "")
    
    if [ -n "$hsts" ]; then
        print_msg "$GREEN" "  ✓ HSTS header present"
        if [ "$DETAILED_MODE" = true ]; then
            print_msg "$CYAN" "    $hsts"
        fi
        return 0
    else
        print_msg "$YELLOW" "  ⚠ HSTS header not found (recommended for security)"
        return 2
    fi
}

# Get detailed certificate info
get_certificate_details() {
    local domain=$1
    
    if [ "$DETAILED_MODE" = true ]; then
        print_msg "$CYAN" "\n  Certificate Details:"
        echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
            openssl x509 -noout -text 2>/dev/null | \
            grep -E "Subject:|Issuer:|Not Before|Not After|DNS:" | \
            sed 's/^/    /'
    fi
}

# Check local Certbot certificate
check_local_certificate() {
    local domain=$1
    
    if command -v certbot &> /dev/null && [ -d "/etc/letsencrypt/live/$domain" ]; then
        local cert_path="/etc/letsencrypt/live/$domain"
        
        # Check if fullchain.pem exists
        if [ -f "$cert_path/fullchain.pem" ]; then
            print_msg "$GREEN" "  ✓ Local certificate files present"
            
            # Check file permissions
            local perms=$(stat -c "%a" "$cert_path/privkey.pem" 2>/dev/null || stat -f "%Lp" "$cert_path/privkey.pem" 2>/dev/null)
            if [ "$perms" = "600" ] || [ "$perms" = "400" ]; then
                print_msg "$GREEN" "  ✓ Private key permissions secure ($perms)"
            else
                print_msg "$YELLOW" "  ⚠ Private key permissions: $perms (should be 600 or 400)"
            fi
            
            return 0
        else
            print_msg "$YELLOW" "  ⚠ Local certificate directory exists but files missing"
            return 2
        fi
    else
        if [ "$DETAILED_MODE" = true ]; then
            print_msg "$YELLOW" "  ⚠ No local Certbot certificate found (may use different cert method)"
        fi
        return 2
    fi
}

# Main verification for a single domain
verify_domain() {
    local domain=$1
    local total_checks=0
    local passed_checks=0
    local warnings=0
    local failed_checks=0
    
    print_header "Checking: $domain"
    
    # Run all checks
    if check_https_accessible "$domain"; then ((passed_checks++)); else ((failed_checks++)); fi
    ((total_checks++))
    
    if check_expiration "$domain"; then 
        ((passed_checks++))
    else 
        local ret=$?
        if [ $ret -eq 2 ]; then
            ((warnings++))
        else
            ((failed_checks++))
        fi
    fi
    ((total_checks++))
    
    if check_certificate_chain "$domain"; then ((passed_checks++)); else ((failed_checks++)); fi
    ((total_checks++))
    
    if check_issuer "$domain"; then ((passed_checks++)); else ((failed_checks++)); fi
    ((total_checks++))
    
    if check_subject "$domain"; then 
        ((passed_checks++))
    else 
        local ret=$?
        if [ $ret -eq 2 ]; then
            ((warnings++))
        else
            ((failed_checks++))
        fi
    fi
    ((total_checks++))
    
    if check_san "$domain"; then 
        ((passed_checks++))
    else 
        local ret=$?
        if [ $ret -eq 2 ]; then
            ((warnings++))
        else
            ((failed_checks++))
        fi
    fi
    ((total_checks++))
    
    if check_tls_protocols "$domain"; then ((passed_checks++)); else ((failed_checks++)); fi
    ((total_checks++))
    
    if check_cipher_strength "$domain"; then 
        ((passed_checks++))
    else 
        local ret=$?
        if [ $ret -eq 2 ]; then
            ((warnings++))
        else
            ((failed_checks++))
        fi
    fi
    ((total_checks++))
    
    if check_hsts "$domain"; then 
        ((passed_checks++))
    else 
        ((warnings++))
    fi
    ((total_checks++))
    
    check_local_certificate "$domain"
    
    get_certificate_details "$domain"
    
    # Print domain summary
    if [ "$QUIET_MODE" = false ]; then
        echo
        if [ $failed_checks -eq 0 ]; then
            print_msg "$GREEN" "  Summary: $passed_checks/$total_checks checks passed"
            if [ $warnings -gt 0 ]; then
                print_msg "$YELLOW" "  Warnings: $warnings"
            fi
        else
            print_msg "$RED" "  Summary: $failed_checks/$total_checks checks FAILED, $passed_checks passed"
            if [ $warnings -gt 0 ]; then
                print_msg "$YELLOW" "  Warnings: $warnings"
            fi
        fi
    fi
    
    return $failed_checks
}

# Main execution
main() {
    print_header "SSL/TLS Certificate Verification for iiskills.cloud"
    
    local overall_failed=0
    local overall_passed=0
    local domains_to_check=()
    
    # Determine which domains to check
    if [ -n "$SINGLE_DOMAIN" ]; then
        domains_to_check=("$SINGLE_DOMAIN")
    else
        domains_to_check=("${SUBDOMAINS[@]}")
    fi
    
    # Check each domain
    for domain in "${domains_to_check[@]}"; do
        if verify_domain "$domain"; then
            ((overall_passed++))
        else
            ((overall_failed++))
        fi
    done
    
    # Overall summary
    print_header "Overall Summary"
    print_msg "$BLUE" "Total domains checked: ${#domains_to_check[@]}"
    print_msg "$GREEN" "Domains passing all checks: $overall_passed"
    print_msg "$RED" "Domains with failures: $overall_failed"
    
    if [ $overall_failed -eq 0 ]; then
        echo
        print_msg "$GREEN" "✓ All SSL certificates are properly configured!"
        print_msg "$GREEN" "✓ No security warnings should appear in any browser or security tool."
        echo
        exit 0
    else
        echo
        print_msg "$RED" "✗ Some domains have SSL certificate issues."
        print_msg "$YELLOW" "⚠ Review the errors above and consult SSL_CERTIFICATE_SETUP.md for solutions."
        echo
        print_msg "$YELLOW" "Quick fixes:"
        print_msg "$YELLOW" "  1. Renew expired certificates: sudo certbot renew --force-renewal"
        print_msg "$YELLOW" "  2. Reinstall certificate: sudo certbot --nginx -d DOMAIN --force-renewal"
        print_msg "$YELLOW" "  3. Reload NGINX: sudo systemctl reload nginx"
        print_msg "$YELLOW" "  4. Test with SSL Labs: https://www.ssllabs.com/ssltest/"
        echo
        exit 1
    fi
}

# Run main function
main "$@"
