# Deployment Guide - iiskills-cloud

This guide provides step-by-step instructions for reliable, safe deployments of the iiskills-cloud platform.

## Quick Start

```bash
# Deploy with all automated checks
./deploy.sh
```

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Process](#deployment-process)
3. [Post-Deployment Validation](#post-deployment-validation)
4. [Troubleshooting](#troubleshooting)
5. [Rollback Procedure](#rollback-procedure)

---

## Pre-Deployment Checklist

### 1. Environment Configuration

**Verify Configuration:**
```bash
# Run environment validation
node scripts/validate-env.js
```

### 2. Code Quality

```bash
# Run linter
yarn lint:fix
```

### 3. Verify Production Configuration

```bash
# Check for testing mode flags
./verify-production-config.sh
```

---

## Deployment Process

### Automated Deployment (Recommended)

```bash
./deploy.sh
```

This performs:
1. Pre-deployment validation
2. Git pull
3. Install dependencies
4. Clean build directories
5. Build all apps
6. Start/Restart PM2
7. Post-deployment health check

---

## Post-Deployment Validation

```bash
# Basic health check
./scripts/post-deploy-check.sh --wait

# Monitor all apps
./monitor-apps.sh --detailed
```

---

## Troubleshooting

### Admin Panel Shows Blank Page

**Fixed:** Variable initialization bug corrected in this update.

```bash
# Rebuild and restart
cd apps/main && yarn build && cd ../..
pm2 restart iiskills-main
```

### Testing Mode Accidentally Enabled

```bash
# Check for testing flags
./verify-production-config.sh

# Fix ecosystem.config.js and restart
pm2 start ecosystem.config.js --update-env
```

---

## Rollback Procedure

```bash
# Reset to previous commit
git reset --hard <commit-hash>
yarn install && yarn build
pm2 restart all
```

---

**Last Updated:** 2026-01-29
