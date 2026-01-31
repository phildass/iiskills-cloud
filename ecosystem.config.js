// Production configuration - Authentication and paywalls enabled
// All learn-* apps are deployed from root directory
// learn-companion is in apps/learn-companion
// Environment validation is performed at startup

module.exports = {
  apps: [
    {
      name: "iiskills-main",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/root/iiskills-cloud/apps/main",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-ai",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: "/root/iiskills-cloud/apps/learn-ai",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-apt",
      script: "node_modules/.bin/next",
      args: "start -p 3002",
      cwd: "/root/iiskills-cloud/learn-apt",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-data-science",
      script: "node_modules/.bin/next",
      args: "start -p 3004",
      cwd: "/root/iiskills-cloud/learn-data-science",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-ias",
      script: "node_modules/.bin/next",
      args: "start -p 3007",
      cwd: "/root/iiskills-cloud/learn-ias",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-jee",
      script: "node_modules/.bin/next",
      args: "start -p 3008",
      cwd: "/root/iiskills-cloud/learn-jee",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-neet",
      script: "node_modules/.bin/next",
      args: "start -p 3012",
      cwd: "/root/iiskills-cloud/learn-neet",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-chemistry",
      script: "node_modules/.bin/next",
      args: "start -p 3005",
      cwd: "/root/iiskills-cloud/apps/learn-chemistry",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-cricket",
      script: "node_modules/.bin/next",
      args: "start -p 3009",
      cwd: "/root/iiskills-cloud/apps/learn-cricket",
      env: { NODE_ENV: "production" }
    },

    {
      name: "iiskills-learn-geography",
      script: "node_modules/.bin/next",
      args: "start -p 3011",
      cwd: "/root/iiskills-cloud/apps/learn-geography",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-govt-jobs",
      script: "node_modules/.bin/next",
      args: "start -p 3013",
      cwd: "/root/iiskills-cloud/apps/learn-govt-jobs",
      env: { NODE_ENV: "production" }
    },

    {
      name: "iiskills-learn-leadership",
      script: "node_modules/.bin/next",
      args: "start -p 3015",
      cwd: "/root/iiskills-cloud/apps/learn-leadership",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-management",
      script: "node_modules/.bin/next",
      args: "start -p 3016",
      cwd: "/root/iiskills-cloud/apps/learn-management",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-math",
      script: "node_modules/.bin/next",
      args: "start -p 3017",
      cwd: "/root/iiskills-cloud/apps/learn-math",
      env: { NODE_ENV: "production" }
    },

    {
      name: "iiskills-learn-physics",
      script: "node_modules/.bin/next",
      args: "start -p 3020",
      cwd: "/root/iiskills-cloud/apps/learn-physics",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-pr",
      script: "node_modules/.bin/next",
      args: "start -p 3021",
      cwd: "/root/iiskills-cloud/apps/learn-pr",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-winning",
      script: "node_modules/.bin/next",
      args: "start -p 3022",
      cwd: "/root/iiskills-cloud/apps/learn-winning",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-companion",
      script: "node_modules/.bin/next",
      args: "start -p 3023",
      cwd: "/root/iiskills-cloud/apps/learn-companion",
      env: { NODE_ENV: "production" }
    },
    {
      name: "webhook",
      script: "webhook.js",
      cwd: "/root",
      env: { PORT: 9000 }
    }
  ]
};
