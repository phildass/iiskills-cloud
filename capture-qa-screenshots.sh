#!/bin/bash
# Screenshot Capture Automation Script
# Captures screenshots of all critical pages across iiskills.cloud apps

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EVIDENCE_DIR="qa-evidence"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EVIDENCE_SESSION_DIR="${EVIDENCE_DIR}/${TIMESTAMP}"

# Create directory structure
create_directories() {
    echo -e "${BLUE}Creating QA evidence directory structure...${NC}"
    
    mkdir -p "${EVIDENCE_SESSION_DIR}/landing-pages"
    mkdir -p "${EVIDENCE_SESSION_DIR}/registration"
    mkdir -p "${EVIDENCE_SESSION_DIR}/login"
    mkdir -p "${EVIDENCE_SESSION_DIR}/sample-lessons"
    mkdir -p "${EVIDENCE_SESSION_DIR}/payment-flows"
    mkdir -p "${EVIDENCE_SESSION_DIR}/admin-tools"
    mkdir -p "${EVIDENCE_SESSION_DIR}/otp-flows"
    mkdir -p "${EVIDENCE_SESSION_DIR}/performance"
    
    echo -e "${GREEN}✓ Directory structure created at ${EVIDENCE_SESSION_DIR}${NC}"
}

# Check if required tools are installed
check_prerequisites() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    
    local missing_tools=()
    
    # Check for playwright or puppeteer
    if ! command -v playwright &> /dev/null && ! npm list -g playwright &> /dev/null; then
        missing_tools+=("playwright")
    fi
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        missing_tools+=("node")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo -e "${RED}Missing required tools: ${missing_tools[*]}${NC}"
        echo -e "${YELLOW}Install with: npm install -g playwright${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✓ All prerequisites met${NC}"
    return 0
}

# Print usage information
usage() {
    cat << EOF
Screenshot Capture Automation Script

Usage: $0 [OPTIONS]

Options:
    -h, --help              Show this help message
    -b, --base-url URL      Base URL for main app (default: http://localhost:3000)
    -a, --all               Capture all pages (landing, auth, flows)
    -l, --landing-only      Capture only landing pages
    -p, --production        Use production URLs instead of localhost
    -w, --headless          Run in headless mode (no browser UI)
    -d, --device DEVICE     Specify device for screenshots (desktop, mobile, tablet)

Examples:
    $0 --all                         # Capture all screenshots from localhost
    $0 --landing-only --production   # Capture only landing pages from production
    $0 --device mobile               # Capture mobile screenshots

EOF
    exit 0
}

# Configuration variables
BASE_URL="http://localhost:3000"
MODE="all"
USE_PRODUCTION=false
HEADLESS=true
DEVICE="desktop"

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                ;;
            -b|--base-url)
                BASE_URL="$2"
                shift 2
                ;;
            -a|--all)
                MODE="all"
                shift
                ;;
            -l|--landing-only)
                MODE="landing"
                shift
                ;;
            -p|--production)
                USE_PRODUCTION=true
                shift
                ;;
            -w|--headless)
                HEADLESS=true
                shift
                ;;
            -d|--device)
                DEVICE="$2"
                shift 2
                ;;
            *)
                echo -e "${RED}Unknown option: $1${NC}"
                usage
                ;;
        esac
    done
}

# Get URLs based on environment
get_urls() {
    if [ "$USE_PRODUCTION" = true ]; then
        cat << EOF
app.iiskills.cloud
learn-ai.iiskills.cloud
learn-apt.iiskills.cloud
learn-chemistry.iiskills.cloud
learn-developer.iiskills.cloud
learn-geography.iiskills.cloud
learn-management.iiskills.cloud
learn-math.iiskills.cloud
learn-physics.iiskills.cloud
learn-pr.iiskills.cloud
EOF
    else
        cat << EOF
localhost:3000
localhost:3024
localhost:3002
localhost:3005
localhost:3007
localhost:3011
localhost:3016
localhost:3017
localhost:3020
localhost:3021
EOF
    fi
}

# Create a Node.js script for screenshot capture
create_screenshot_script() {
    cat > /tmp/capture-screenshots.js << 'EOFJS'
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const config = {
    evidenceDir: process.argv[2] || 'qa-evidence',
    baseUrl: process.argv[3] || 'http://localhost:3000',
    headless: process.argv[4] === 'true',
    device: process.argv[5] || 'desktop',
    useProduction: process.argv[6] === 'true'
};

const devices = {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 812 }
};

const apps = [
    { name: 'main', subdomain: 'app', port: 3000, type: 'main' },
    { name: 'learn-ai', subdomain: 'learn-ai', port: 3024, type: 'paid' },
    { name: 'learn-apt', subdomain: 'learn-apt', port: 3002, type: 'free' },
    { name: 'learn-chemistry', subdomain: 'learn-chemistry', port: 3005, type: 'free' },
    { name: 'learn-developer', subdomain: 'learn-developer', port: 3007, type: 'paid' },
    { name: 'learn-geography', subdomain: 'learn-geography', port: 3011, type: 'free' },
    { name: 'learn-management', subdomain: 'learn-management', port: 3016, type: 'paid' },
    { name: 'learn-math', subdomain: 'learn-math', port: 3017, type: 'free' },
    { name: 'learn-physics', subdomain: 'learn-physics', port: 3020, type: 'free' },
    { name: 'learn-pr', subdomain: 'learn-pr', port: 3021, type: 'paid' }
];

function getUrl(app) {
    if (config.useProduction) {
        return `https://${app.subdomain}.iiskills.cloud`;
    } else {
        return `http://localhost:${app.port}`;
    }
}

async function captureScreenshots() {
    console.log('🚀 Starting screenshot capture...');
    console.log(`📁 Evidence directory: ${config.evidenceDir}`);
    console.log(`🌐 Environment: ${config.useProduction ? 'Production' : 'Local'}`);
    console.log(`📱 Device: ${config.device}`);
    
    const browser = await chromium.launch({ headless: config.headless });
    const context = await browser.newContext({
        viewport: devices[config.device],
        deviceScaleFactor: config.device === 'mobile' ? 2 : 1
    });
    const page = await context.newPage();
    
    // Capture landing pages
    console.log('\n📸 Capturing landing pages...');
    for (const app of apps) {
        try {
            const url = getUrl(app);
            console.log(`  → ${app.name}...`);
            
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(2000); // Wait for animations
            
            const screenshotPath = path.join(
                config.evidenceDir,
                'landing-pages',
                `${app.name}-${config.device}.png`
            );
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`    ✓ Saved to ${screenshotPath}`);
        } catch (error) {
            console.error(`    ✗ Error capturing ${app.name}: ${error.message}`);
        }
    }
    
    // Capture registration page
    console.log('\n📸 Capturing registration pages...');
    for (const app of [apps[0], apps[1]]) { // Main and one learning app
        try {
            const url = `${getUrl(app)}/register`;
            console.log(`  → ${app.name} registration...`);
            
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(2000);
            
            const screenshotPath = path.join(
                config.evidenceDir,
                'registration',
                `${app.name}-registration-${config.device}.png`
            );
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`    ✓ Saved to ${screenshotPath}`);
        } catch (error) {
            console.error(`    ✗ Error capturing ${app.name} registration: ${error.message}`);
        }
    }
    
    // Capture login page
    console.log('\n📸 Capturing login pages...');
    for (const app of [apps[0], apps[1]]) {
        try {
            const url = `${getUrl(app)}/login`;
            console.log(`  → ${app.name} login...`);
            
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(2000);
            
            const screenshotPath = path.join(
                config.evidenceDir,
                'login',
                `${app.name}-login-${config.device}.png`
            );
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`    ✓ Saved to ${screenshotPath}`);
        } catch (error) {
            console.error(`    ✗ Error capturing ${app.name} login: ${error.message}`);
        }
    }
    
    await browser.close();
    console.log('\n✅ Screenshot capture complete!');
    console.log(`📁 All evidence saved to: ${config.evidenceDir}`);
}

captureScreenshots().catch(console.error);
EOFJS
}

# Main execution
main() {
    parse_args "$@"
    
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   QA Screenshot Capture Automation                       ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo
    
    # Check prerequisites
    if ! check_prerequisites; then
        echo -e "${YELLOW}Installing playwright...${NC}"
        npm install -g playwright
        playwright install chromium
    fi
    
    # Create directories
    create_directories
    
    # Create screenshot capture script
    echo -e "${BLUE}Creating screenshot capture script...${NC}"
    create_screenshot_script
    
    # Run screenshot capture
    echo -e "${BLUE}Running screenshot capture...${NC}"
    node /tmp/capture-screenshots.js \
        "${EVIDENCE_SESSION_DIR}" \
        "${BASE_URL}" \
        "${HEADLESS}" \
        "${DEVICE}" \
        "${USE_PRODUCTION}"
    
    # Generate summary report
    echo
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   Screenshot Capture Complete                             ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo
    echo -e "${BLUE}Evidence Location:${NC} ${EVIDENCE_SESSION_DIR}"
    echo -e "${BLUE}Total Screenshots:${NC} $(find "${EVIDENCE_SESSION_DIR}" -name "*.png" | wc -l)"
    echo
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Review screenshots in ${EVIDENCE_SESSION_DIR}"
    echo "2. Document any issues found"
    echo "3. Update QA checklist with evidence paths"
    echo "4. Submit for client approval"
    echo
}

# Run main function
main "$@"
