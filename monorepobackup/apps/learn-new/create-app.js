#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const appName = process.argv[2];

if (!appName) {
  console.error("Usage: yarn create-app <app-name>");
  process.exit(1);
}

const appDir = path.join(__dirname, 'apps', appName);

// Basic template
const indexPage = `import { CoreLayout } from '../../packages/ui';
import { useAuth } from '../../packages/auth';
import { usePayment } from '../../packages/payment';

export default function ${appName.charAt(0).toUpperCase() + appName.slice(1)}() {
  const auth = useAuth();
  const payment = usePayment();
  return (
    <CoreLayout appName="${appName}">
      {/* Your content/modules here */}
    </CoreLayout>
  );
}
`;

const configFile = `module.exports = {
  appName: "${appName}",
  accessType: "free", // set to 'paid' if required
  syllabusPath: "/syllabus",
  usesSharedComponents: true
};
`;

fs.mkdirSync(appDir, { recursive: true });
fs.writeFileSync(path.join(appDir, 'index.js'), indexPage);
fs.writeFileSync(path.join(appDir, 'app.config.js'), configFile);

console.log(`App scaffolded at ${appDir}`);
