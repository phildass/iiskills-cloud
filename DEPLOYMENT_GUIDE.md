# Deployment Checklist

## Pre-Deployment

- [ ] All PRs have passed CI/CD checks
- [ ] `./scripts/pre-deploy-check.sh` passes locally
- [ ] `.env.local` is up to date on server
- [ ] Backup current PM2 state: `pm2 save`
- [ ] Note current git commit: `git rev-parse HEAD > /tmp/pre-deploy-commit.txt`

## Deployment

- [ ] SSH into server: `ssh root@72.60.203.189`
- [ ] Navigate to project: `cd ~/iiskills-cloud`
- [ ] Run deployment script: `./scripts/deploy.sh`

## Post-Deployment Verification

- [ ] All PM2 processes show "online": `pm2 list`
- [ ] No errors in logs: `pm2 logs --lines 100 --nostream`
- [ ] Test live URLs (HTTP 200):
  - [ ] https://iiskills.cloud
  - [ ] https://app.iiskills.cloud
  - [ ] https://app1.learn-ai.iiskills.cloud
  - [ ] https://app1.learn-apt.iiskills.cloud
  - [ ] https://app1.learn-chemistry.iiskills.cloud
  - [ ] https://app1.learn-cricket.iiskills.cloud
  - [ ] https://app1.learn-geography.iiskills.cloud
  - [ ] https://app1.learn-leadership.iiskills.cloud
  - [ ] https://app1.learn-management.iiskills.cloud
  - [ ] https://app1.learn-math.iiskills.cloud
  - [ ] https://app1.learn-physics.iiskills.cloud
  - [ ] https://app1.learn-pr.iiskills.cloud
  - [ ] https://app1.learn-winning.iiskills.cloud

## If Deployment Fails

- [ ] Check which step failed in deployment script output
- [ ] Review error logs: `cat logs/build-*.log`
- [ ] Review PM2 logs: `pm2 logs --err --lines 50`
- [ ] Decide: Fix forward or rollback?

### Rollback Procedure

```bash
# Get previous commit
PREV_COMMIT=$(cat /tmp/pre-deploy-commit.txt)

# Rollback code
git checkout $PREV_COMMIT

# Rebuild and restart
./scripts/deploy.sh
```

## Post-Deployment Tasks

- [ ] Monitor PM2 for 10 minutes: `pm2 monit`
- [ ] Check error rate in logs
- [ ] Test one complete user journey (browse course, auth bypass works)
- [ ] Update deployment log with timestamp and commit hash
