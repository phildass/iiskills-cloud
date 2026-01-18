module.exports = {
  apps: [
    {
      name: "iiskills-cloud",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud",
      env: { NODE_ENV: "production", PORT: 3000 }
    },
    {
      name: "learn-ai",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-ai",
      env: { NODE_ENV: "production", PORT: 3001 }
    },
    {
      name: "learn-apt",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-apt",
      env: { NODE_ENV: "production", PORT: 3002 }
    },
    {
      name: "learn-chemistry",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-chemistry",
      env: { NODE_ENV: "production", PORT: 3003 }
    },
    {
      name: "learn-geography",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-geography",
      env: { NODE_ENV: "production", PORT: 3004 }
    },
    {
      name: "learn-leadership",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-leadership",
      env: { NODE_ENV: "production", PORT: 3005 }
    },
    {
      name: "learn-management",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-management",
      env: { NODE_ENV: "production", PORT: 3006 }
    },
    {
      name: "learn-math",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-math",
      env: { NODE_ENV: "production", PORT: 3007 }
    },
    {
      name: "learn-physics",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-physics",
      env: { NODE_ENV: "production", PORT: 3008 }
    },
    {
      name: "learn-pr",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-pr",
      env: { NODE_ENV: "production", PORT: 3009 }
    },
    {
      name: "learn-winning",
      script: "yarn",
      args: "start",
      cwd: "/root/iiskills-cloud/learn-winning",
      env: { NODE_ENV: "production", PORT: 3010 }
    }
  ]
};