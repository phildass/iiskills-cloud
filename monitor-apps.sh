#!/bin/bash

#
# Multi-App Health Check and Monitoring Script
#
# This script checks the health status of all deployed applications
# and provides a quick overview of system status
#
# Usage: ./monitor-apps.sh [--detailed] [--logs] [--json]
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
DOMAIN="iiskills.cloud"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
DETAILED=false
SHOW_LOGS=false
JSON_OUTPUT=false

for arg in "$@"; do
    case $arg in
        --detailed) DETAILED=true ;;
        --logs) SHOW_LOGS=true ;;
        --json) JSON_OUTPUT=true ;;
        --help)
            echo "Usage: ./monitor-apps.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --detailed    Show detailed app information"
            echo "  --logs        Show recent log entries"
            echo "  --json        Output in JSON format"
            echo "  --help        Show this help message"
            exit 0
            ;;
    esac
done

# App configuration (app_name:port:subdomain)
declare -A APPS
APPS=(
    ["iiskills-main"]="3000:iiskills.cloud"
    ["iiskills-learn-ai"]="3002:learn-ai.iiskills.cloud"
    ["iiskills-learn-apt"]="3001:learn-apt.iiskills.cloud"
    ["iiskills-learn-chemistry"]="3003:learn-chemistry.iiskills.cloud"
    ["iiskills-learn-data-science"]="3004:learn-data-science.iiskills.cloud"
    ["iiskills-learn-geography"]="3005:learn-geography.iiskills.cloud"
    ["iiskills-learn-govt-jobs"]="3006:learn-govt-jobs.iiskills.cloud"
    ["iiskills-learn-ias"]="3007:learn-ias.iiskills.cloud"
    ["iiskills-learn-jee"]="3008:learn-jee.iiskills.cloud"
    ["iiskills-learn-leadership"]="3009:learn-leadership.iiskills.cloud"
    ["iiskills-learn-management"]="3010:learn-management.iiskills.cloud"
    ["iiskills-learn-math"]="3011:learn-math.iiskills.cloud"
    ["iiskills-learn-neet"]="3012:learn-neet.iiskills.cloud"
    ["iiskills-learn-physics"]="3013:learn-physics.iiskills.cloud"
    ["iiskills-learn-pr"]="3014:learn-pr.iiskills.cloud"
    ["iiskills-learn-winning"]="3015:learn-winning.iiskills.cloud"
)

# Check if PM2 is available
check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}❌ PM2 is not installed${NC}"
        exit 1
    fi
}

# Get PM2 status for an app
get_pm2_status() {
    local app_name=$1
    pm2 describe "$app_name" 2>/dev/null || echo "not_found"
}

# Check if app is responding on its port
check_port_health() {
    local port=$1
    if curl -f -s -o /dev/null --connect-timeout 2 http://localhost:$port 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Check HTTPS health
check_https_health() {
    local domain=$1
    if curl -f -s -o /dev/null --connect-timeout 2 https://$domain 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Get uptime for an app
get_uptime() {
    local app_name=$1
    # Use basic regex instead of Perl regex for compatibility
    pm2 describe "$app_name" 2>/dev/null | grep 'uptime:' | sed 's/.*uptime: //' | awk '{print $1}' || echo "N/A"
}

# Get memory usage
get_memory() {
    local app_name=$1
    # Use basic regex instead of Perl regex for compatibility
    pm2 describe "$app_name" 2>/dev/null | grep 'memory:' | sed 's/.*memory: //' | awk '{print $1}' || echo "N/A"
}

# Get CPU usage
get_cpu() {
    local app_name=$1
    # Use basic regex instead of Perl regex for compatibility
    pm2 describe "$app_name" 2>/dev/null | grep 'cpu:' | sed 's/.*cpu: //' | awk '{print $1}' || echo "N/A"
}

# Main monitoring function
monitor_apps() {
    if [ "$JSON_OUTPUT" = true ]; then
        monitor_json
    else
        monitor_table
    fi
}

# Monitor in table format
monitor_table() {
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}${CYAN}Multi-App Health Monitoring Dashboard${NC}"
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${CYAN}Time:${NC} $(date)"
    echo -e "${CYAN}Domain:${NC} $DOMAIN"
    echo ""
    
    # Table header
    echo -e "${BOLD}App Status Overview${NC}"
    echo ""
    printf "%-30s %-8s %-10s %-10s %-15s\n" "SUBDOMAIN" "PORT" "PM2" "HTTP" "HTTPS"
    echo "────────────────────────────────────────────────────────────────────────────"
    
    local total_apps=0
    local healthy_apps=0
    local pm2_running=0
    local http_ok=0
    local https_ok=0
    
    # Sort apps by subdomain
    for app_name in $(echo "${!APPS[@]}" | tr ' ' '\n' | sort); do
        IFS=':' read -r port subdomain <<< "${APPS[$app_name]}"
        
        total_apps=$((total_apps + 1))
        
        # Check PM2 status
        local pm2_status="❌"
        local pm2_color=$RED
        if pm2 describe "$app_name" &> /dev/null; then
            # Use basic regex for compatibility instead of Perl regex  
            local status=$(pm2 describe "$app_name" 2>/dev/null | grep 'status' | grep -o 'online\|stopped\|errored' | head -n1)
            if [ "$status" = "online" ]; then
                pm2_status="✅"
                pm2_color=$GREEN
                pm2_running=$((pm2_running + 1))
            elif [ "$status" = "stopped" ]; then
                pm2_status="⏸️"
                pm2_color=$YELLOW
            else
                pm2_status="❌"
                pm2_color=$RED
            fi
        fi
        
        # Check HTTP health
        local http_status="❌"
        local http_color=$RED
        if check_port_health "$port"; then
            http_status="✅"
            http_color=$GREEN
            http_ok=$((http_ok + 1))
        fi
        
        # Check HTTPS health (skip in CI/local)
        local https_status="❓"
        local https_color=$YELLOW
        if [ -n "$CI" ] || [ "$subdomain" = "localhost" ]; then
            https_status="⊘"
        elif check_https_health "$subdomain"; then
            https_status="✅"
            https_color=$GREEN
            https_ok=$((https_ok + 1))
        else
            https_status="❌"
            https_color=$RED
        fi
        
        # Count healthy apps (PM2 online AND HTTP responding)
        if [ "$pm2_status" = "✅" ] && [ "$http_status" = "✅" ]; then
            healthy_apps=$((healthy_apps + 1))
        fi
        
        printf "%-30s %-8s ${pm2_color}%-10s${NC} ${http_color}%-10s${NC} ${https_color}%-15s${NC}\n" \
            "$subdomain" "$port" "$pm2_status" "$http_status" "$https_status"
    done
    
    echo ""
    echo -e "${BOLD}Summary${NC}"
    echo "────────────────────────────────────────────────────────────────────────────"
    echo -e "Total Apps:       $total_apps"
    echo -e "Healthy:          ${GREEN}$healthy_apps${NC}"
    echo -e "PM2 Running:      ${GREEN}$pm2_running${NC}"
    echo -e "HTTP OK:          ${GREEN}$http_ok${NC}"
    
    if [ -z "$CI" ]; then
        echo -e "HTTPS OK:         ${GREEN}$https_ok${NC}"
    fi
    
    echo ""
    
    # Detailed information
    if [ "$DETAILED" = true ]; then
        echo -e "${BOLD}Detailed Information${NC}"
        echo "────────────────────────────────────────────────────────────────────────────"
        
        for app_name in $(echo "${!APPS[@]}" | tr ' ' '\n' | sort); do
            IFS=':' read -r port subdomain <<< "${APPS[$app_name]}"
            
            echo ""
            echo -e "${CYAN}${app_name}${NC}"
            
            if pm2 describe "$app_name" &> /dev/null; then
                echo "  Uptime:   $(get_uptime "$app_name")"
                echo "  Memory:   $(get_memory "$app_name")"
                echo "  CPU:      $(get_cpu "$app_name")"
                echo "  Port:     $port"
                echo "  URL:      https://$subdomain"
            else
                echo -e "  ${RED}Not running in PM2${NC}"
            fi
        done
        echo ""
    fi
    
    # Show logs
    if [ "$SHOW_LOGS" = true ]; then
        echo -e "${BOLD}Recent Logs (Last 10 Lines)${NC}"
        echo "────────────────────────────────────────────────────────────────────────────"
        pm2 logs --lines 10 --nostream
    fi
    
    # Health verdict
    echo ""
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
    
    if [ $healthy_apps -eq $total_apps ]; then
        echo -e "${GREEN}${BOLD}✅ All systems operational!${NC}"
    elif [ $healthy_apps -gt $((total_apps / 2)) ]; then
        echo -e "${YELLOW}${BOLD}⚠️  Some apps need attention${NC}"
    else
        echo -e "${RED}${BOLD}❌ Critical: Multiple apps down${NC}"
    fi
    
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Monitor in JSON format
monitor_json() {
    echo "{"
    echo "  \"timestamp\": \"$(date -Iseconds)\","
    echo "  \"domain\": \"$DOMAIN\","
    echo "  \"apps\": ["
    
    local first=true
    for app_name in $(echo "${!APPS[@]}" | tr ' ' '\n' | sort); do
        IFS=':' read -r port subdomain <<< "${APPS[$app_name]}"
        
        if [ "$first" = false ]; then
            echo ","
        fi
        first=false
        
        # Gather status information
        local pm2_online=false
        local http_ok=false
        local https_ok=false
        
        if pm2 describe "$app_name" &> /dev/null; then
            # Use basic regex for compatibility instead of Perl regex
            local status=$(pm2 describe "$app_name" 2>/dev/null | grep 'status' | grep -o 'online\|stopped\|errored' | head -n1)
            if [ "$status" = "online" ]; then
                pm2_online=true
            fi
        fi
        
        if check_port_health "$port"; then
            http_ok=true
        fi
        
        if [ -z "$CI" ] && check_https_health "$subdomain"; then
            https_ok=true
        fi
        
        echo "    {"
        echo "      \"name\": \"$app_name\","
        echo "      \"subdomain\": \"$subdomain\","
        echo "      \"port\": $port,"
        echo "      \"pm2_online\": $pm2_online,"
        echo "      \"http_healthy\": $http_ok,"
        echo "      \"https_healthy\": $https_ok,"
        echo "      \"uptime\": \"$(get_uptime "$app_name")\","
        echo "      \"memory\": \"$(get_memory "$app_name")\","
        echo "      \"cpu\": \"$(get_cpu "$app_name")\""
        echo -n "    }"
    done
    
    echo ""
    echo "  ]"
    echo "}"
}

# Main execution
check_pm2
monitor_apps
