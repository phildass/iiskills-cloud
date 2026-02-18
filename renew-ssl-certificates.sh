#!/bin/bash
# SSL Certificate Renewal Script for iiskills.cloud
# Automates certificate renewal and verification

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="${SCRIPT_DIR}/logs/ssl-renewal-$(date +%Y%m%d-%H%M%S).log"
DRY_RUN=false
FORCE_RENEWAL=false
EMAIL="admin@iiskills.cloud"

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

# Create logs directory if it doesn't exist
mkdir -p "${SCRIPT_DIR}/logs"

# Print colored message
print_msg() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}" | tee -a "$LOG_FILE"
}

# Print header
print_header() {
    echo | tee -a "$LOG_FILE"
    print_msg "$BLUE" "======================================"
    print_msg "$BLUE" "$1"
    print_msg "$BLUE" "======================================"
}

# Usage information
usage() {
    cat << EOF
SSL Certificate Renewal Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              Show this help message
    -d, --dry-run           Perform a dry run (test without actually renewing)
    -f, --force             Force renewal even if certificates are not due
    -e, --email EMAIL       Contact email for Let's Encrypt (default: admin@iiskills.cloud)

Examples:
    $0                      # Renew certificates that are due (within 30 days)
    $0 --dry-run            # Test renewal without making changes
    $0 --force              # Force renewal of all certificates

EOF
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            usage
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        -f|--force)
            FORCE_RENEWAL=true
            shift
            ;;
        -e|--email)
            EMAIL="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_msg "$RED" "This script must be run as root or with sudo"
        exit 1
    fi
}

# Check if Certbot is installed
check_certbot() {
    if ! command -v certbot &> /dev/null; then
        print_msg "$RED" "Certbot is not installed"
        print_msg "$YELLOW" "Install with: sudo apt-get install certbot python3-certbot-nginx"
        exit 1
    fi
    
    print_msg "$GREEN" "✓ Certbot is installed"
    certbot --version | tee -a "$LOG_FILE"
}

# List current certificates
list_certificates() {
    print_header "Current Certificates"
    certbot certificates | tee -a "$LOG_FILE"
}

# Check certificate expiration
check_expiration() {
    local domain=$1
    
    if [ ! -d "/etc/letsencrypt/live/$domain" ]; then
        print_msg "$YELLOW" "  ⚠ Certificate not found for $domain"
        return 2
    fi
    
    local expiry_date=$(openssl x509 -in "/etc/letsencrypt/live/$domain/cert.pem" -noout -enddate | cut -d= -f2)
    local expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$expiry_date" +%s 2>/dev/null)
    local current_epoch=$(date +%s)
    local days_until_expiry=$(( ($expiry_epoch - $current_epoch) / 86400 ))
    
    if [ $days_until_expiry -lt 0 ]; then
        print_msg "$RED" "  ✗ $domain: EXPIRED ${days_until_expiry#-} days ago"
        return 1
    elif [ $days_until_expiry -lt 30 ]; then
        print_msg "$YELLOW" "  ⚠ $domain: Expires in $days_until_expiry days (renewal recommended)"
        return 0
    else
        print_msg "$GREEN" "  ✓ $domain: Valid for $days_until_expiry days"
        return 3
    fi
}

# Check all certificates expiration
check_all_expiration() {
    print_header "Certificate Expiration Status"
    
    local needs_renewal=()
    local expired=()
    local valid=()
    
    for domain in "${SUBDOMAINS[@]}"; do
        check_expiration "$domain"
        local ret=$?
        
        case $ret in
            0)  # Needs renewal (< 30 days)
                needs_renewal+=("$domain")
                ;;
            1)  # Expired
                expired+=("$domain")
                needs_renewal+=("$domain")
                ;;
            2)  # Not found
                needs_renewal+=("$domain")
                ;;
            3)  # Valid (> 30 days)
                valid+=("$domain")
                ;;
        esac
    done
    
    echo | tee -a "$LOG_FILE"
    print_msg "$BLUE" "Summary:"
    print_msg "$GREEN" "  Valid (>30 days): ${#valid[@]}"
    print_msg "$YELLOW" "  Needs renewal (<30 days): ${#needs_renewal[@]}"
    print_msg "$RED" "  Expired: ${#expired[@]}"
    
    if [ ${#expired[@]} -gt 0 ]; then
        echo | tee -a "$LOG_FILE"
        print_msg "$RED" "CRITICAL: The following certificates are EXPIRED:"
        for domain in "${expired[@]}"; do
            print_msg "$RED" "  - $domain"
        done
    fi
    
    echo "${needs_renewal[@]}"
}

# Renew certificates
renew_certificates() {
    print_header "Renewing SSL Certificates"
    
    local renewal_cmd="certbot renew"
    
    if [ "$DRY_RUN" = true ]; then
        print_msg "$YELLOW" "Running in DRY RUN mode (no actual changes)"
        renewal_cmd="$renewal_cmd --dry-run"
    fi
    
    if [ "$FORCE_RENEWAL" = true ]; then
        print_msg "$YELLOW" "Force renewal enabled"
        renewal_cmd="$renewal_cmd --force-renewal"
    fi
    
    print_msg "$BLUE" "Executing: $renewal_cmd"
    
    if $renewal_cmd 2>&1 | tee -a "$LOG_FILE"; then
        print_msg "$GREEN" "✓ Certificate renewal completed successfully"
        return 0
    else
        print_msg "$RED" "✗ Certificate renewal failed"
        return 1
    fi
}

# Test NGINX configuration
test_nginx() {
    print_header "Testing NGINX Configuration"
    
    if nginx -t 2>&1 | tee -a "$LOG_FILE"; then
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
    
    if [ "$DRY_RUN" = true ]; then
        print_msg "$YELLOW" "DRY RUN: Would reload NGINX"
        return 0
    fi
    
    if systemctl reload nginx 2>&1 | tee -a "$LOG_FILE"; then
        print_msg "$GREEN" "✓ NGINX reloaded successfully"
        return 0
    else
        print_msg "$RED" "✗ Failed to reload NGINX"
        return 1
    fi
}

# Verify certificates after renewal
verify_certificates() {
    print_header "Verifying Renewed Certificates"
    
    if [ "$DRY_RUN" = true ]; then
        print_msg "$YELLOW" "DRY RUN: Skipping verification"
        return 0
    fi
    
    # Run verification script if it exists
    if [ -f "${SCRIPT_DIR}/verify-ssl-certificates.sh" ]; then
        print_msg "$BLUE" "Running SSL verification script..."
        if "${SCRIPT_DIR}/verify-ssl-certificates.sh" 2>&1 | tee -a "$LOG_FILE"; then
            print_msg "$GREEN" "✓ All certificates verified successfully"
            return 0
        else
            print_msg "$YELLOW" "⚠ Some certificates have issues (see above)"
            return 1
        fi
    else
        print_msg "$YELLOW" "⚠ Verification script not found, skipping detailed verification"
        return 0
    fi
}

# Send notification email
send_notification() {
    local subject=$1
    local body=$2
    
    if command -v mail &> /dev/null; then
        echo "$body" | mail -s "$subject" "$EMAIL"
        print_msg "$GREEN" "✓ Notification email sent to $EMAIL"
    else
        print_msg "$YELLOW" "⚠ 'mail' command not found, skipping email notification"
        print_msg "$YELLOW" "  Install with: sudo apt-get install mailutils"
    fi
}

# Create backup of certificates
backup_certificates() {
    print_header "Backing Up Certificates"
    
    local backup_dir="${SCRIPT_DIR}/backups"
    mkdir -p "$backup_dir"
    
    local backup_file="${backup_dir}/letsencrypt-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    if [ "$DRY_RUN" = true ]; then
        print_msg "$YELLOW" "DRY RUN: Would create backup at $backup_file"
        return 0
    fi
    
    if tar -czf "$backup_file" /etc/letsencrypt/ 2>&1 | tee -a "$LOG_FILE"; then
        print_msg "$GREEN" "✓ Backup created: $backup_file"
        
        # Keep only last 10 backups
        ls -t "$backup_dir"/letsencrypt-backup-*.tar.gz | tail -n +11 | xargs -r rm
        print_msg "$BLUE" "  Retained last 10 backups"
        
        return 0
    else
        print_msg "$RED" "✗ Failed to create backup"
        return 1
    fi
}

# Main execution
main() {
    print_header "SSL Certificate Renewal for iiskills.cloud"
    print_msg "$BLUE" "Started at: $(date)"
    print_msg "$BLUE" "Log file: $LOG_FILE"
    
    # Pre-flight checks
    check_root
    check_certbot
    
    # Create backup before renewal
    backup_certificates
    
    # List current certificates
    list_certificates
    
    # Check expiration status
    local domains_needing_renewal=$(check_all_expiration)
    
    # Decide whether to proceed with renewal
    if [ "$FORCE_RENEWAL" = true ]; then
        print_msg "$YELLOW" "Force renewal enabled, proceeding with all certificates"
    elif [ -z "$domains_needing_renewal" ] && [ "$DRY_RUN" = false ]; then
        echo | tee -a "$LOG_FILE"
        print_msg "$GREEN" "All certificates are valid for more than 30 days"
        print_msg "$BLUE" "No renewal needed at this time"
        print_msg "$YELLOW" "Use --force to renew anyway, or --dry-run to test"
        exit 0
    fi
    
    # Perform renewal
    if renew_certificates; then
        # Test NGINX configuration
        if test_nginx; then
            # Reload NGINX
            reload_nginx
            
            # Verify certificates
            verify_certificates
            
            # Success summary
            print_header "Renewal Complete"
            print_msg "$GREEN" "✓ SSL certificates have been successfully renewed"
            print_msg "$GREEN" "✓ NGINX has been reloaded with new certificates"
            print_msg "$BLUE" "Completed at: $(date)"
            
            if [ "$DRY_RUN" = false ]; then
                send_notification "SSL Certificate Renewal Success" "SSL certificates for iiskills.cloud have been successfully renewed. Log: $LOG_FILE"
            fi
            
            exit 0
        else
            print_msg "$RED" "✗ NGINX configuration test failed"
            print_msg "$RED" "Certificates were renewed but NGINX was not reloaded"
            print_msg "$YELLOW" "Fix NGINX configuration and manually reload: sudo systemctl reload nginx"
            
            send_notification "SSL Certificate Renewal - NGINX Error" "Certificates renewed but NGINX has configuration errors. Manual intervention required. Log: $LOG_FILE"
            
            exit 1
        fi
    else
        print_msg "$RED" "✗ Certificate renewal failed"
        print_msg "$YELLOW" "Check the log file for details: $LOG_FILE"
        
        send_notification "SSL Certificate Renewal Failed" "Failed to renew SSL certificates for iiskills.cloud. Manual intervention required. Log: $LOG_FILE"
        
        exit 1
    fi
}

# Run main function
main "$@"
