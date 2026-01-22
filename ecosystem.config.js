module.exports = {
  apps: [
    {
      // Main iiskills.cloud website
      // Note: Uses root directory as cwd since the main app files (package.json, pages/, etc.) 
      // are located in the repository root
      name: "iiskills-main",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud",
      env: { NODE_ENV: "production", PORT: 3000, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-jee",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-jee",
      env: { NODE_ENV: "production", PORT: 3008, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-ai",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-ai",
      env: { NODE_ENV: "production", PORT: 3001, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-apt",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-apt",
      env: { NODE_ENV: "production", PORT: 3001, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-chemistry",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-chemistry",
      env: { NODE_ENV: "production", PORT: 3003, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-cricket",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-cricket",
      env: { NODE_ENV: "production", PORT: 3016, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-data-science",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-data-science",
      env: { NODE_ENV: "production", PORT: 3004, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-geography",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-geography",
      env: { NODE_ENV: "production", PORT: 3005, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-govt-jobs",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-govt-jobs",
      env: { NODE_ENV: "production", PORT: 3006, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-ias",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-ias",
      env: { NODE_ENV: "production", PORT: 3007, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-leadership",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-leadership",
      env: { NODE_ENV: "production", PORT: 3009, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-management",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-management",
      env: { NODE_ENV: "production", PORT: 3010, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-math",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-math",
      env: { NODE_ENV: "production", PORT: 3011, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-neet",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-neet",
      env: { NODE_ENV: "production", PORT: 3012, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-physics",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-physics",
      env: { NODE_ENV: "production", PORT: 3013, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-pr",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-pr",
      env: { NODE_ENV: "production", PORT: 3014, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "iiskills-learn-winning",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-winning",
      env: { NODE_ENV: "production", PORT: 3015, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      name: "webhook",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/webhook",
      env: { NODE_ENV: "production", PORT: 3018, NEXT_PUBLIC_PAYWALL_ENABLED: "true" }
    },
    {
      // Coming Soon Apps landing page
      // Note: No paywall needed - this is a public announcement page
      name: "iiskills-coming-soon",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/coming-soon",
      env: { NODE_ENV: "production", PORT: 3019 }
    }
  ]
};