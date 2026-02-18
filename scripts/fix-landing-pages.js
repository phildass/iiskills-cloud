#!/usr/bin/env node

/**
 * Script to replace copied learn-ai landing pages with UniversalLandingPage component
 * 
 * This script:
 * 1. Identifies apps with copied learn-ai/pages/index.js (MD5: f3594b50b30d3ab1d9b02039c078f5ae)
 * 2. Creates backup files (pages/index.js.bak)
 * 3. Replaces with new index.js using UniversalLandingPage component
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// MD5 hash of the copied learn-ai landing page
const LEARN_AI_MD5 = 'f3594b50b30d3ab1d9b02039c078f5ae';

// Base directory
const BASE_DIR = path.join(__dirname, '..');
const APPS_DIR = path.join(BASE_DIR, 'apps');

/**
 * Calculate MD5 hash of a file
 */
function getMD5(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Convert app name to friendly title
 * e.g., "learn-chemistry" -> "Learn Chemistry"
 */
function appNameToTitle(appName) {
  return appName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate app-specific content based on app name
 */
function getAppContent(appId) {
  const appName = appNameToTitle(appId);
  
  const contentMap = {
    'learn-ai': {
      title: 'Master Artificial Intelligence',
      description: 'Transform your career with comprehensive AI training. Learn AI fundamentals to advanced techniques and discover multiple earning opportunities.',
      features: [
        { emoji: '🤖', title: 'AI Fundamentals', description: 'Master the core concepts and technologies powering artificial intelligence' },
        { emoji: '🧠', title: 'Machine Learning', description: 'Build and deploy machine learning models that solve real-world problems' },
        { emoji: '💼', title: 'Career Growth', description: 'Open doors to high-paying AI careers and consulting opportunities' },
      ]
    },
    'learn-chemistry': {
      title: 'Master Chemistry Concepts',
      description: 'Build a strong foundation in chemistry with interactive lessons covering all key topics from basic concepts to advanced principles.',
      features: [
        { emoji: '⚗️', title: 'Chemical Reactions', description: 'Understand reaction mechanisms and chemical processes' },
        { emoji: '🔬', title: 'Lab Techniques', description: 'Learn proper laboratory procedures and safety protocols' },
        { emoji: '📊', title: 'Periodic Table', description: 'Master element properties and periodic trends' },
      ]
    },
    'learn-cricket': {
      title: 'Master Cricket Skills',
      description: 'Learn cricket techniques, rules, and strategies from basics to advanced gameplay. Perfect for players and enthusiasts.',
      features: [
        { emoji: '🏏', title: 'Batting Techniques', description: 'Master strokes, stance, and shot selection' },
        { emoji: '⚡', title: 'Bowling Skills', description: 'Learn different bowling styles and variations' },
        { emoji: '🎯', title: 'Game Strategy', description: 'Understand match tactics and field placements' },
      ]
    },
    'learn-geography': {
      title: 'Explore World Geography',
      description: 'Discover the world through comprehensive geography lessons covering physical features, cultures, and global relationships.',
      features: [
        { emoji: '🌍', title: 'World Regions', description: 'Explore continents, countries, and major cities' },
        { emoji: '🗺️', title: 'Physical Geography', description: 'Understand landforms, climate, and natural phenomena' },
        { emoji: '🏛️', title: 'Cultural Geography', description: 'Learn about populations, cultures, and civilizations' },
      ]
    },
    // MOVED TO apps-backup as per cleanup requirements
    // 'learn-govt-jobs': {
    //   title: 'Prepare for Government Jobs',
    //   description: 'Comprehensive preparation for government job exams with practice tests, study materials, and expert guidance.',
    //   features: [
    //     { emoji: '📚', title: 'Exam Preparation', description: 'Structured content aligned with major govt exams' },
    //     { emoji: '✍️', title: 'Practice Tests', description: 'Take mock tests and assess your readiness' },
    //     { emoji: '🎓', title: 'Career Guidance', description: 'Navigate different govt job opportunities' },
    //   ]
    // },
    'learn-leadership': {
      title: 'Develop Leadership Skills',
      description: 'Build essential leadership capabilities to inspire teams, drive change, and achieve organizational success.',
      features: [
        { emoji: '👥', title: 'Team Management', description: 'Learn to build and lead high-performing teams' },
        { emoji: '💡', title: 'Strategic Thinking', description: 'Develop vision and strategic planning skills' },
        { emoji: '🗣️', title: 'Communication', description: 'Master effective communication and influence' },
      ]
    },
    'learn-management': {
      title: 'Master Management Principles',
      description: 'Learn core management concepts, techniques, and best practices to excel in business and organizational leadership.',
      features: [
        { emoji: '📊', title: 'Business Strategy', description: 'Understand strategic planning and execution' },
        { emoji: '⚙️', title: 'Operations', description: 'Master process optimization and resource management' },
        { emoji: '📈', title: 'Performance', description: 'Learn metrics, KPIs, and performance improvement' },
      ]
    },
    'learn-math': {
      title: 'Master Mathematics',
      description: 'Build strong mathematical foundations from arithmetic to advanced calculus with step-by-step lessons and practice.',
      features: [
        { emoji: '🔢', title: 'Core Concepts', description: 'Master algebra, geometry, and trigonometry' },
        { emoji: '📐', title: 'Problem Solving', description: 'Develop analytical and logical thinking skills' },
        { emoji: '∞', title: 'Advanced Math', description: 'Explore calculus, statistics, and more' },
      ]
    },
    'learn-physics': {
      title: 'Understand Physics Principles',
      description: 'Explore the fundamental laws of nature through interactive physics lessons covering mechanics, energy, and modern physics.',
      features: [
        { emoji: '⚛️', title: 'Classical Mechanics', description: 'Master motion, forces, and energy principles' },
        { emoji: '💡', title: 'Electricity & Magnetism', description: 'Understand electromagnetic phenomena' },
        { emoji: '🌌', title: 'Modern Physics', description: 'Explore quantum mechanics and relativity' },
      ]
    },
    'learn-pr': {
      title: 'Master Public Relations',
      description: 'Learn PR strategies, media relations, and communication skills to build and maintain a positive public image.',
      features: [
        { emoji: '📢', title: 'Media Relations', description: 'Build relationships with press and media outlets' },
        { emoji: '✍️', title: 'Content Strategy', description: 'Create compelling PR campaigns and messages' },
        { emoji: '📱', title: 'Digital PR', description: 'Master social media and online reputation management' },
      ]
    },
    'learn-winning': {
      title: 'Develop a Winning Mindset',
      description: 'Build mental toughness, positive habits, and success strategies to achieve your personal and professional goals.',
      features: [
        { emoji: '🎯', title: 'Goal Setting', description: 'Learn to set and achieve ambitious goals' },
        { emoji: '💪', title: 'Mental Toughness', description: 'Build resilience and overcome challenges' },
        { emoji: '🏆', title: 'Success Habits', description: 'Develop daily practices of high achievers' },
      ]
    },
  };

  return contentMap[appId] || {
    title: appName,
    description: `Comprehensive learning platform for ${appName.toLowerCase()}.`,
    features: [
      { emoji: '📚', title: 'Comprehensive Content', description: 'In-depth lessons and learning materials' },
      { emoji: '🎯', title: 'Structured Learning', description: 'Follow a clear path from basics to advanced' },
      { emoji: '✅', title: 'Track Progress', description: 'Monitor your learning journey and achievements' },
    ]
  };
}

/**
 * Generate new index.js content using UniversalLandingPage
 */
function generateNewIndexJS(appId) {
  const content = getAppContent(appId);
  
  return `"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="${appId}"
      appName="${content.title}"
      title="${content.title} - iiskills.cloud"
      description="${content.description}"
      features={${JSON.stringify(content.features, null, 2)}}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
`;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Scanning apps for copied learn-ai landing pages...\n');

  const apps = fs.readdirSync(APPS_DIR).filter(dir => {
    const fullPath = path.join(APPS_DIR, dir);
    return fs.statSync(fullPath).isDirectory() && dir !== 'apps-backup';
  });

  const affectedApps = [];

  // Find affected apps
  for (const app of apps) {
    const indexPath = path.join(APPS_DIR, app, 'pages', 'index.js');
    
    if (fs.existsSync(indexPath)) {
      const md5 = getMD5(indexPath);
      if (md5 === LEARN_AI_MD5) {
        affectedApps.push(app);
      }
    }
  }

  console.log(`Found ${affectedApps.length} affected apps:\n`);
  affectedApps.forEach(app => console.log(`  - ${app}`));
  console.log();

  // Process each affected app
  let successCount = 0;
  let errorCount = 0;

  for (const app of affectedApps) {
    try {
      console.log(`Processing ${app}...`);
      
      const indexPath = path.join(APPS_DIR, app, 'pages', 'index.js');
      const backupPath = path.join(APPS_DIR, app, 'pages', 'index.js.bak');
      
      // Create backup
      fs.copyFileSync(indexPath, backupPath);
      console.log(`  ✓ Created backup: ${backupPath}`);
      
      // Generate new content
      const newContent = generateNewIndexJS(app);
      
      // Write new index.js
      fs.writeFileSync(indexPath, newContent, 'utf8');
      console.log(`  ✓ Replaced index.js with UniversalLandingPage`);
      console.log();
      
      successCount++;
    } catch (error) {
      console.error(`  ✗ Error processing ${app}:`, error.message);
      console.log();
      errorCount++;
    }
  }

  console.log('📊 Summary:');
  console.log(`  Total apps processed: ${affectedApps.length}`);
  console.log(`  Successful: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log();
  console.log('✅ Done!');
}

// Run the script
main();
