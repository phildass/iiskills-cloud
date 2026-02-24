#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const APPS_DIR = path.join(ROOT, 'apps');
const PUBLIC_IMAGES = path.join(ROOT, 'public', 'images');

// Get all app directories (excluding apps-backup)
function getAppDirectories() {
  return fs.readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'apps-backup')
    .map(dirent => dirent.name);
}

// Check if SiteHeader is present in an app
function checkSiteHeaderPresence(appName) {
  const appFile = path.join(APPS_DIR, appName, 'pages', '_app.js');
  const indexFile = path.join(APPS_DIR, appName, 'pages', 'index.js');
  
  let hasSiteHeader = false;
  let location = null;
  
  // Check _app.js
  if (fs.existsSync(appFile)) {
    const content = fs.readFileSync(appFile, 'utf-8');
    if (content.includes('SiteHeader')) {
      hasSiteHeader = true;
      location = '_app.js';
    }
  }
  
  // If not in _app.js, check index.js
  if (!hasSiteHeader && fs.existsSync(indexFile)) {
    const content = fs.readFileSync(indexFile, 'utf-8');
    if (content.includes('SiteHeader')) {
      hasSiteHeader = true;
      location = 'index.js';
    }
  }
  
  return { hasSiteHeader, location };
}

// Check if app uses HeroManager or getHeroImagesForApp
function checkHeroManagerUsage(appName) {
  const indexFile = path.join(APPS_DIR, appName, 'pages', 'index.js');
  
  if (!fs.existsSync(indexFile)) {
    return { usesHeroManager: false, method: null };
  }
  
  const content = fs.readFileSync(indexFile, 'utf-8');
  
  if (content.includes('from "./HeroManager"') || content.includes('from "../../../components/shared/HeroManager"')) {
    return { usesHeroManager: true, method: 'HeroManager import' };
  }
  
  if (content.includes('UniversalLandingPage')) {
    return { usesHeroManager: true, method: 'UniversalLandingPage' };
  }
  
  return { usesHeroManager: false, method: null };
}

// Check for hard-coded "Learn AI" text in non-learn-ai apps
function checkLearnAIText(appName) {
  if (appName === 'learn-ai') {
    return { hasLearnAI: false, isExpected: true };
  }
  
  const indexFile = path.join(APPS_DIR, appName, 'pages', 'index.js');
  
  if (!fs.existsSync(indexFile)) {
    return { hasLearnAI: false, isExpected: false };
  }
  
  const content = fs.readFileSync(indexFile, 'utf-8');
  // Look for literal "Learn AI" in headings/titles (h1, h2, etc.) but not in course listings
  const lines = content.split('\n');
  const learnAILines = lines
    .map((line, idx) => ({ line, num: idx + 1 }))
    .filter(({ line }) => {
      // Ignore import statements, comments, and learn-ai references
      if (line.includes('import') || line.includes('//') || line.includes('learn-ai')) {
        return false;
      }
      // Only flag if it's in a main heading context (h1 or h2 tags typically)
      // Allow course listings and references
      const hasLearnAI = line.includes('Learn AI');
      const isMainHeading = line.includes('<h1') || line.includes('<h2');
      return hasLearnAI && isMainHeading;
    });
  
  return { 
    hasLearnAI: learnAILines.length > 0, 
    isExpected: false,
    lines: learnAILines.map(l => l.num)
  };
}

// Check that cricket images exist and are used correctly
function checkCricketImages() {
  const cricket1 = path.join(PUBLIC_IMAGES, 'cricket1.jpg');
  const cricket2 = path.join(PUBLIC_IMAGES, 'cricket2.jpg');
  
  return {
    cricket1Exists: fs.existsSync(cricket1),
    cricket2Exists: fs.existsSync(cricket2)
  };
}

// Check that default images exist
function checkDefaultImages() {
  const defaultImages = [
    'iiskills-image1.jpg',
    'iiskills-image2.jpg', 
    'iiskills-image3.jpg',
    'iiskills-image4.jpg'
  ];
  
  const results = {};
  defaultImages.forEach(img => {
    results[img] = fs.existsSync(path.join(PUBLIC_IMAGES, img));
  });
  
  return results;
}

// Main audit function
function auditLandingPages() {
  const apps = getAppDirectories();
  const results = {
    timestamp: new Date().toISOString(),
    summary: {
      totalApps: apps.length,
      appsWithSiteHeader: 0,
      appsWithHeroManager: 0,
      appsWithLearnAIText: 0
    },
    images: {
      cricket: checkCricketImages(),
      default: checkDefaultImages()
    },
    apps: {}
  };
  
  apps.forEach(appName => {
    const siteHeader = checkSiteHeaderPresence(appName);
    const heroManager = checkHeroManagerUsage(appName);
    const learnAI = checkLearnAIText(appName);
    
    if (siteHeader.hasSiteHeader) results.summary.appsWithSiteHeader++;
    if (heroManager.usesHeroManager) results.summary.appsWithHeroManager++;
    if (learnAI.hasLearnAI) results.summary.appsWithLearnAIText++;
    
    results.apps[appName] = {
      siteHeader,
      heroManager,
      learnAI
    };
  });
  
  return results;
}

// Report function
function generateReport(results) {
  console.log('\n=== Landing Pages Audit Report ===\n');
  console.log(`Timestamp: ${results.timestamp}`);
  console.log(`Total Apps: ${results.summary.totalApps}\n`);
  
  // Image checks
  console.log('=== Image Availability ===');
  console.log(`Cricket Images:`);
  console.log(`  cricket1.jpg: ${results.images.cricket.cricket1Exists ? '✓' : '✗'}`);
  console.log(`  cricket2.jpg: ${results.images.cricket.cricket2Exists ? '✓' : '✗'}`);
  console.log(`Default Images:`);
  Object.entries(results.images.default).forEach(([img, exists]) => {
    console.log(`  ${img}: ${exists ? '✓' : '✗'}`);
  });
  console.log('');
  
  // Summary
  console.log('=== Summary ===');
  console.log(`Apps with SiteHeader: ${results.summary.appsWithSiteHeader}/${results.summary.totalApps}`);
  console.log(`Apps with HeroManager: ${results.summary.appsWithHeroManager}/${results.summary.totalApps}`);
  console.log(`Apps with "Learn AI" text: ${results.summary.appsWithLearnAIText}`);
  console.log('');
  
  // Detailed app-by-app
  console.log('=== App Details ===');
  Object.entries(results.apps).forEach(([appName, data]) => {
    console.log(`\n${appName}:`);
    console.log(`  SiteHeader: ${data.siteHeader.hasSiteHeader ? '✓' : '✗'} ${data.siteHeader.location ? `(in ${data.siteHeader.location})` : ''}`);
    console.log(`  HeroManager: ${data.heroManager.usesHeroManager ? '✓' : '✗'} ${data.heroManager.method ? `(${data.heroManager.method})` : ''}`);
    
    if (data.learnAI.hasLearnAI) {
      console.log(`  ⚠️  Contains "Learn AI" text at lines: ${data.learnAI.lines.join(', ')}`);
    } else if (!data.learnAI.isExpected) {
      console.log(`  "Learn AI" text: ✓ (none found)`);
    }
  });
  
  // Issues
  console.log('\n=== Issues Found ===');
  let issuesFound = false;
  
  // Check for missing SiteHeader
  Object.entries(results.apps).forEach(([appName, data]) => {
    if (!data.siteHeader.hasSiteHeader) {
      console.log(`⚠️  ${appName}: Missing SiteHeader`);
      issuesFound = true;
    }
  });
  
  // Check for missing HeroManager (excluding learn-companion which is a chat interface)
  Object.entries(results.apps).forEach(([appName, data]) => {
    if (!data.heroManager.usesHeroManager && appName !== 'learn-companion') {
      console.log(`⚠️  ${appName}: Not using HeroManager or UniversalLandingPage`);
      issuesFound = true;
    }
  });
  
  // Check for "Learn AI" text in wrong apps
  Object.entries(results.apps).forEach(([appName, data]) => {
    if (data.learnAI.hasLearnAI) {
      console.log(`⚠️  ${appName}: Contains hard-coded "Learn AI" text`);
      issuesFound = true;
    }
  });
  
  if (!issuesFound) {
    console.log('✓ No issues found!');
  }
  
  console.log('\n');
}

// Run audit
const results = auditLandingPages();
generateReport(results);

// Output JSON for programmatic use
if (process.argv.includes('--json')) {
  console.log('\n=== JSON Output ===');
  console.log(JSON.stringify(results, null, 2));
}

// Exit with error code if issues found
const hasIssues = results.summary.appsWithSiteHeader < results.summary.totalApps ||
                  results.summary.appsWithLearnAIText > 0;

process.exit(hasIssues ? 1 : 0);
