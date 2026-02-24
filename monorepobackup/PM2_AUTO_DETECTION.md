# PM2 Entry Point Auto-Detection

This document explains the automatic entry point detection system for PM2 configuration in the iiskills-cloud repository.

## Overview

The `generate-ecosystem.js` script automatically detects all Next.js applications in the repository, inspects their configurations, and generates a complete PM2 ecosystem configuration file (`ecosystem.config.js`). This ensures that running `pm2 start ecosystem.config.js` on a fresh clone reliably starts all applications without manual configuration.

## How It Works

### 1. Application Discovery

The script scans the repository to find all Next.js applications:
- Checks the root directory
- Scans all subdirectories
- Identifies Next.js apps by checking for `package.json` with Next.js dependencies

### 2. Entry Point Detection

For each detected application, the script:
- Reads the `package.json` file
- Extracts the `start` script (e.g., `next start -p 3002`)
- Detects any port specifications in the start script
- Determines the correct entry point strategy (npm start for Next.js apps)

### 3. Port Assignment

The script intelligently assigns ports:
- **From package.json**: Uses ports explicitly defined in start scripts
- **Auto-assigned**: Assigns the next available port if not specified
- **Conflict resolution**: Automatically reassigns ports when conflicts are detected

### 4. Configuration Generation

The script generates:
- `ecosystem.config.js`: Complete PM2 configuration for all apps
- `PM2_ENTRY_POINTS.md`: Documentation of all detected entry points

## Usage

### Generate Configuration

To generate or regenerate the PM2 ecosystem configuration:

```bash
npm run generate-pm2-config
```

Or directly:

```bash
node generate-ecosystem.js
```

### Dry Run

To preview the configuration without writing files:

```bash
node generate-ecosystem.js --dry-run
```

### Custom Output File

To generate the configuration to a different file:

```bash
node generate-ecosystem.js --output custom-ecosystem.config.js
```

### Validate Configuration

After generation, validate the configuration:

```bash
npm run validate-pm2-config
```

Or directly:

```bash
node validate-ecosystem.js
```

## When to Regenerate

Regenerate the configuration when:
- Adding new Next.js applications to the repository
- Removing existing applications
- Changing port assignments in package.json files
- Setting up a fresh clone of the repository
- After pulling changes that affect application structure

## Output Files

### ecosystem.config.js

The main PM2 configuration file with:
- Complete app definitions
- Port assignments (explicit or auto-assigned)
- Log file paths
- Environment variables
- Memory limits and restart policies

**Important**: This file is auto-generated. Do not edit manually - regenerate using `node generate-ecosystem.js` instead.

### PM2_ENTRY_POINTS.md

Documentation file containing:
- Table of all detected applications
- Port assignments with sources (package.json, auto-assigned, or reassigned)
- Detailed breakdown by assignment type
- Entry point strategy explanation
- Instructions for regeneration

## Entry Point Strategy

For Next.js applications, the script uses the following strategy:

1. **Script**: `npm` (the npm executable)
2. **Args**: `start` (runs the package.json start script)
3. **Port**: 
   - If specified in package.json: Uses that port (no ENV override)
   - If not specified: Assigns PORT via environment variable
   - If conflict: Reassigns and overrides via environment variable

This approach ensures that:
- Each app uses its own configured build process
- Port assignments are clear and conflict-free
- The configuration works on a fresh clone without manual intervention
- All apps can be started with a single PM2 command

## Port Conflict Resolution

When multiple apps specify the same port in their package.json files:

1. The first app keeps its original port
2. Subsequent conflicting apps are automatically reassigned to the next available port
3. The reassignment is documented in both the ecosystem.config.js and PM2_ENTRY_POINTS.md
4. The PORT environment variable is set to override the package.json port

Example:
```
Original: 
- learn-jee: 3009
- learn-chemistry: 3009
- learn-physics: 3009

After resolution:
- learn-chemistry: 3009 (keeps original)
- learn-jee: 3011 (reassigned)
- learn-physics: 3013 (reassigned)
```

## Integration with Deployment

The auto-detection system integrates with the deployment workflow:

1. **Fresh Clone**: 
   ```bash
   git clone https://github.com/phildass/iiskills-cloud.git
   cd iiskills-cloud
   npm run generate-pm2-config  # Optional - config already in repo
   npm run validate-pm2-config  # Validate
   pm2 start ecosystem.config.js
   ```

2. **After Adding New Apps**:
   ```bash
   npm run generate-pm2-config  # Regenerate
   npm run validate-pm2-config  # Validate
   pm2 reload all               # Reload PM2
   ```

3. **Continuous Integration**:
   ```bash
   npm run validate-pm2-config  # Validate in CI pipeline
   ```

## Troubleshooting

### Script Not Finding Apps

If apps aren't being detected:
- Ensure `package.json` exists in each app directory
- Verify `next` is in dependencies
- Check that `start` script exists in package.json

### Port Conflicts

If you see port conflict warnings:
- Review `PM2_ENTRY_POINTS.md` for reassignments
- Update package.json files to use unique ports if preferred
- Regenerate configuration after changes

### Configuration Not Working

If PM2 fails to start apps:
1. Validate the configuration: `npm run validate-pm2-config`
2. Check app directories exist
3. Ensure dependencies are installed: `npm install` in each directory
4. Verify apps are built: `npm run build` in each directory
5. Check logs in the `logs/` directory

## Advanced Usage

### Modifying Detection Logic

The `generate-ecosystem.js` script can be modified to:
- Add custom detection rules
- Change port assignment strategy
- Modify configuration templates
- Add additional validation checks

After modifications, test with:
```bash
node generate-ecosystem.js --dry-run
```

### Custom Port Ranges

To use a specific port range, modify the `assignPorts` function in `generate-ecosystem.js`:

```javascript
let nextAvailablePort = 4000;  // Start from 4000 instead of 3000
```

### Excluding Directories

To exclude specific directories from detection, modify the `detectApps` function:

```javascript
if (!entry.isDirectory() || 
    entry.name.startsWith('.') ||
    entry.name === 'node_modules' ||
    entry.name === 'my-excluded-dir') {
  continue;
}
```

## Best Practices

1. **Always regenerate** after structural changes to the repository
2. **Validate** the configuration before deploying
3. **Review** PM2_ENTRY_POINTS.md to understand port assignments
4. **Commit** both ecosystem.config.js and PM2_ENTRY_POINTS.md to version control
5. **Document** any manual changes to package.json port configurations
6. **Test** the configuration on a fresh clone before deploying to production

## Related Documentation

- [PM2_DEPLOYMENT.md](PM2_DEPLOYMENT.md) - Complete deployment guide
- [PM2_ENTRY_POINTS.md](PM2_ENTRY_POINTS.md) - Detected entry points summary
- [validate-ecosystem.js](validate-ecosystem.js) - Validation script
- [generate-ecosystem.js](generate-ecosystem.js) - Generation script

## Support

For issues with auto-detection:
1. Check this documentation
2. Review the script output for warnings
3. Validate the generated configuration
4. Check PM2_ENTRY_POINTS.md for detailed information

For PM2-specific issues, consult the [PM2 documentation](https://pm2.keymetrics.io/docs/).
