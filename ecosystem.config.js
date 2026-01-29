// Production configuration - Authentication and paywalls enabled
// All testing mode flags have been removed

module.exports = {
  apps: [
    {
      name: "iiskills-admin",
      script: "node_modules/.bin/next",
      args: "start -p 3023",
      cwd: "/root/iiskills-cloud/apps/iiskills-admin",
      env: { 
        NODE_ENV: "production",
        // Admin app now runs in UNIFIED MODE (Supabase + Local fallback)
        // Supabase credentials should be provided via environment variables
        // Local content is used as fallback if Supabase is unavailable
        // Auth and paywall are disabled for admin access
        NEXT_PUBLIC_DISABLE_AUTH: "true",
        NEXT_PUBLIC_DISABLE_PAYWALL: "true",
        NEXT_PUBLIC_PAYWALL_ENABLED: "false"
      }
    },
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
      cwd: "/root/iiskills-cloud/apps/coming-soon",
      env: { NODE_ENV: "production" }
    },
    {
      name: "iiskills-learn-jee",
      script: "node_modules/.bin/next",
      args: "start -p 3003",
      cwd: "/root/iiskills-cloud/apps/learn-jee",
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
      cwd: "/root/iiskills-cloud/apps/learn-apt",
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
      name: "iiskills-learn-data-science",
      script: "node_modules/.bin/next",
      args: "start -p 3010",
      cwd: "/root/iiskills-cloud/apps/learn-data-science",
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
      name: "iiskills-learn-ias",
      script: "node_modules/.bin/next",
      args: "start -p 3014",
      cwd: "/root/iiskills-cloud/apps/learn-ias",
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
      name: "iiskills-learn-neet",
      script: "node_modules/.bin/next",
      args: "start -p 3018",
      cwd: "/root/iiskills-cloud/apps/learn-neet",
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
      name: "webhook",
      script: "webhook.js",
      cwd: "/root",
      env: { PORT: 9000 }
    }
  ]
};
