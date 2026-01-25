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
      name: "iiskills-comingsoon",
      script: "node_modules/.bin/next",
      args: "start -p 3019",
      cwd: "/root/iiskills-cloud/coming-soon",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-jee",
      script: "node_modules/.bin/next",
      args: "start -p 3003",
      cwd: "/root/iiskills-cloud/learn-jee",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-ai",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: "/root/iiskills-cloud/learn-ai",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-apt",
      script: "node_modules/.bin/next",
      args: "start -p 3002",
      cwd: "/root/iiskills-cloud/learn-apt",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-chemistry",
      script: "node_modules/.bin/next",
      args: "start -p 3005",
      cwd: "/root/iiskills-cloud/learn-chemistry",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-cricket",
      script: "node_modules/.bin/next",
      args: "start -p 3009",
      cwd: "/root/iiskills-cloud/learn-cricket",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-data-science",
      script: "node_modules/.bin/next",
      args: "start -p 3010",
      cwd: "/root/iiskills-cloud/learn-data-science",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-geography",
      script: "node_modules/.bin/next",
      args: "start -p 3011",
      cwd: "/root/iiskills-cloud/learn-geography",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-govt-jobs",
      script: "node_modules/.bin/next",
      args: "start -p 3013",
      cwd: "/root/iiskills-cloud/learn-govt-jobs",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-ias",
      script: "node_modules/.bin/next",
      args: "start -p 3014",
      cwd: "/root/iiskills-cloud/learn-ias",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-leadership",
      script: "node_modules/.bin/next",
      args: "start -p 3015",
      cwd: "/root/iiskills-cloud/learn-leadership",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-management",
      script: "node_modules/.bin/next",
      args: "start -p 3016",
      cwd: "/root/iiskills-cloud/learn-management",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-math",
      script: "node_modules/.bin/next",
      args: "start -p 3017",
      cwd: "/root/iiskills-cloud/learn-math",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-neet",
      script: "node_modules/.bin/next",
      args: "start -p 3018",
      cwd: "/root/iiskills-cloud/learn-neet",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-physics",
      script: "node_modules/.bin/next",
      args: "start -p 3020",
      cwd: "/root/iiskills-cloud/learn-physics",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-pr",
      script: "node_modules/.bin/next",
      args: "start -p 3021",
      cwd: "/root/iiskills-cloud/learn-pr",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-winning",
      script: "node_modules/.bin/next",
      args: "start -p 3022",
      cwd: "/root/iiskills-cloud/learn-winning",
      env: { NODE_ENV: "production", NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "webhook",
      script: "webhook.js",
      cwd: "/root",
      env: { PORT: 9000 }
    }
  ]
};
