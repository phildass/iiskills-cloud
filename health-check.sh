#!/bin/bash
# Health Check Script for iiskills.cloud Infrastructure
# Run this periodically (e.g., via cron) to monitor system health

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ALERT_EMAIL="${ALERT_EMAIL:-}"  # Set this to receive email alerts
LOG_FILE="/var/log/iiskills-health-check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Subdomains and their ports
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

# Status tracking
ISSUES_FOUND=0
CRITICAL_ISSUES=0
WARNING_ISSUES=0

print_msg() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
    echo "[$TIMESTAMP] $message" >> "$LOG_FILE"
}

log_issue() {
    local severity=$1
    local message=$2
    
    if [[ "$severity" == "CRITICAL" ]]; then
        ((CRITICAL_ISSUES++))
        print_msg "$RED" "❌ CRITICAL: $message"
    elif [[ "$severity" == "WARNING" ]]; then
        ((WARNING_ISSUES++))
        print_msg "$YELLOW" "⚠️  WARNING: $message"
    fi
    
    ((ISSUES_FOUND++))
}

# Check PM2 is running
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        log_issue "CRITICAL" "PM2 is not installed"
        return 1
    fi
    
    # Count running apps
    local running_count=$(pm2 list | grep -c "online" || echo "0")
    local expected_count=10
    
    if [[ $running_count -lt $expected_count ]]; then
        log_issue "CRITICAL" "Only $running_count/$expected_count PM2 apps are running"
        return 1
    else
        print_msg "$GREEN" "✅ PM2: All $running_count apps running"
    fi
}

# Check NGINX is running
check_nginx() {
    if ! systemctl is-active --quiet nginx; then
        log_issue "CRITICAL" "NGINX is not running"
        return 1
    else
        print_msg "$GREEN" "✅ NGINX: Running"
    fi
    
    # Check NGINX config
    if ! nginx -t &> /dev/null; then
        log_issue "CRITICAL" "NGINX configuration has errors"
        return 1
    fi
}

# Check port is listening
check_port() {
    local port=$1
    if lsof -i :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check all localhost ports
check_localhost_ports() {
    local ports_ok=true
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        local port=${SUBDOMAIN_PORTS[$subdomain]}
        if ! check_port $port; then
            log_issue "CRITICAL" "Port $port not listening ($subdomain)"
            ports_ok=false
        fi
    done
    
    if $ports_ok; then
        print_msg "$GREEN" "✅ All localhost ports listening"
    fi
}

# Check HTTPS endpoints
check_https_endpoints() {
    local endpoints_ok=true
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        local https_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "https://${subdomain}" 2>/dev/null || echo "000")
        
        if [[ "$https_code" == "200" ]]; then
            # Success
            :
        elif [[ "$https_code" == "502" ]]; then
            log_issue "CRITICAL" "502 Bad Gateway on $subdomain"
            endpoints_ok=false
        elif [[ "$https_code" == "000" ]]; then
            log_issue "CRITICAL" "Cannot connect to $subdomain"
            endpoints_ok=false
        else
            log_issue "WARNING" "Unexpected HTTP code $https_code on $subdomain"
            endpoints_ok=false
        fi
    done
    
    if $endpoints_ok; then
        print_msg "$GREEN" "✅ All HTTPS endpoints responding (200 OK)"
    fi
}

# Check SSL certificates expiry
check_ssl_certificates() {
    local certs_ok=true
    
    for subdomain in "${!SUBDOMAIN_PORTS[@]}"; do
        local cert_file="/etc/letsencrypt/live/${subdomain}/cert.pem"
        
        if [[ ! -f "$cert_file" ]]; then
            log_issue "CRITICAL" "SSL certificate missing for $subdomain"
            certs_ok=false
            continue
        fi
        
        # Check expiry date
        local expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
        local expiry_epoch=$(date -d "$expiry_date" +%s)
        local now_epoch=$(date +%s)
        local days_until_expiry=$(( ($expiry_epoch - $now_epoch) / 86400 ))
        
        if [[ $days_until_expiry -lt 7 ]]; then
            log_issue "CRITICAL" "SSL certificate for $subdomain expires in $days_until_expiry days"
            certs_ok=false
        elif [[ $days_until_expiry -lt 30 ]]; then
            log_issue "WARNING" "SSL certificate for $subdomain expires in $days_until_expiry days"
            certs_ok=false
        fi
    done
    
    if $certs_ok; then
        print_msg "$GREEN" "✅ All SSL certificates valid and not expiring soon"
    fi
}

# Check disk space
check_disk_space() {
    local usage=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
    
    if [[ $usage -gt 90 ]]; then
        log_issue "CRITICAL" "Disk space usage at ${usage}%"
    elif [[ $usage -gt 80 ]]; then
        log_issue "WARNING" "Disk space usage at ${usage}%"
    else
        print_msg "$GREEN" "✅ Disk space OK (${usage}% used)"
    fi
}

# Check memory usage
check_memory() {
    local usage=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    
    if [[ $usage -gt 90 ]]; then
        log_issue "CRITICAL" "Memory usage at ${usage}%"
    elif [[ $usage -gt 80 ]]; then
        log_issue "WARNING" "Memory usage at ${usage}%"
    else
        print_msg "$GREEN" "✅ Memory OK (${usage}% used)"
    fi
}

# Check for errors in NGINX logs (last 100 lines)
check_nginx_errors() {
    local error_count=$(tail -100 /var/log/nginx/error.log 2>/dev/null | grep -c "error" || echo "0")
    
    if [[ $error_count -gt 10 ]]; then
        log_issue "WARNING" "Found $error_count errors in recent NGINX logs"
    else
        print_msg "$GREEN" "✅ NGINX error log clean (last 100 lines)"
    fi
}

# Send email alert if configured
send_alert() {
    if [[ -n "$ALERT_EMAIL" ]] && command -v mail &> /dev/null; then
        local subject="iiskills.cloud Health Check Alert"
        local body="Health check found issues:
        
Critical Issues: $CRITICAL_ISSUES
Warning Issues: $WARNING_ISSUES

Check $LOG_FILE for details.

Timestamp: $TIMESTAMP"
        
        echo "$body" | mail -s "$subject" "$ALERT_EMAIL"
    fi
}

# Generate summary
print_summary() {
    echo
    print_msg "$BLUE" "=========================================="
    print_msg "$BLUE" "Health Check Summary"
    print_msg "$BLUE" "=========================================="
    echo
    
    if [[ $ISSUES_FOUND -eq 0 ]]; then
        print_msg "$GREEN" "✅ All systems healthy - no issues found"
        exit 0
    else
        print_msg "$YELLOW" "⚠️  Total Issues Found: $ISSUES_FOUND"
        print_msg "$RED" "❌ Critical: $CRITICAL_ISSUES"
        print_msg "$YELLOW" "⚠️  Warnings: $WARNING_ISSUES"
        echo
        print_msg "$YELLOW" "Review log file: $LOG_FILE"
        
        if [[ $CRITICAL_ISSUES -gt 0 ]]; then
            send_alert
            exit 1
        else
            exit 0
        fi
    fi
}

# Main execution
main() {
    print_msg "$BLUE" "=========================================="
    print_msg "$BLUE" "iiskills.cloud Health Check"
    print_msg "$BLUE" "=========================================="
    echo
    
    # Run all checks
    check_pm2
    check_nginx
    check_localhost_ports
    check_https_endpoints
    check_ssl_certificates
    check_disk_space
    check_memory
    check_nginx_errors
    
    # Print summary
    print_summary
}

# Run main function
main "$@"
