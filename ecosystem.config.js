module.exports = {
  apps: [
    {
      name: "iiskills-main",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/apps/main",
      env: { NODE_ENV: "production", PORT: 3000 }
    },
    {
      name: "iiskills-learn-jee",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-jee",
      env: { NODE_ENV: "production", PORT: 3008 }
    },
    {
      name: "iiskills-learn-ai",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-ai",
      env: { NODE_ENV: "production", PORT: 3001 }
    },
    {
      name: "iiskills-learn-apt",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-apt",
      env: { NODE_ENV: "production", PORT: 3002 }
    },
    {
      name: "iiskills-learn-chemistry",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-chemistry",
      env: { NODE_ENV: "production", PORT: 3003 }
    },
    {
      name: "iiskills-learn-cricket",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-cricket",
      env: { NODE_ENV: "production", PORT: 3016 }
    },
    {
      name: "iiskills-learn-data-science",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-data-science",
      env: { NODE_ENV: "production", PORT: 3004 }
    },
    {
      name: "iiskills-learn-geography",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-geography",
      env: { NODE_ENV: "production", PORT: 3005 }
    },
    {
      name: "iiskills-learn-govt-jobs",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-govt-jobs",
      env: { NODE_ENV: "production", PORT: 3006 }
    },
    {
      name: "iiskills-learn-ias",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-ias",
      env: { NODE_ENV: "production", PORT: 3007 }
    },
    {
      name: "iiskills-learn-leadership",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-leadership",
      env: { NODE_ENV: "production", PORT: 3009 }
    },
    {
      name: "iiskills-learn-management",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-management",
      env: { NODE_ENV: "production", PORT: 3010 }
    },
    {
      name: "iiskills-learn-math",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-math",
      env: { NODE_ENV: "production", PORT: 3011 }
    },
    {
      name: "iiskills-learn-neet",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-neet",
      env: { NODE_ENV: "production", PORT: 3012 }
    },
    {
      name: "iiskills-learn-physics",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-physics",
      env: { NODE_ENV: "production", PORT: 3013 }
    },
    {
      name: "iiskills-learn-pr",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-pr",
      env: { NODE_ENV: "production", PORT: 3014 }
    },
    {
      name: "iiskills-learn-winning",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/learn-winning",
      env: { NODE_ENV: "production", PORT: 3015 }
    },
    {
      name: "webhook",
      script: "yarn",
      args: "start",
      interpreter: "none",
      cwd: "/root/iiskills-cloud/webhook",
      env: { NODE_ENV: "production", PORT: 3018 }
    }
  ]
};