/**
 * PM2 Ecosystem Configuration
 * MARK GROUP - Finance Website
 *
 * Usage:
 *   Development: pm2 start ecosystem.config.js --only mark-backend-dev
 *   Production:  pm2 start ecosystem.config.js --env production
 *
 * Commands:
 *   pm2 start ecosystem.config.js          # Start all apps
 *   pm2 stop all                           # Stop all apps
 *   pm2 restart all                        # Restart all apps
 *   pm2 logs                               # View logs
 *   pm2 monit                              # Monitor apps
 *   pm2 delete all                         # Delete all apps
 */

module.exports = {
  apps: [
    // ==========================================
    // Backend API Server
    // ==========================================
    {
      name: "mark-backend",
      script: "dist/server.js",
      cwd: "./backend",
      instances: "max", // Use all CPU cores in production
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",

      // Environment variables
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },

      // Logging
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },

    // Backend Development (with watch)
    {
      name: "mark-backend-dev",
      script: "npx",
      args: "ts-node src/server.ts",
      cwd: "./backend",
      instances: 1,
      exec_mode: "fork",
      watch: ["src"],
      watch_delay: 1000,
      ignore_watch: ["node_modules", "logs", "uploads"],

      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },

      // Logging
      error_file: "./logs/backend-dev-error.log",
      out_file: "./logs/backend-dev-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      autorestart: true,
    },

    // ==========================================
    // Frontend Next.js Server
    // ==========================================
    {
      name: "mark-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      instances: 1, // Next.js handles its own clustering
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",

      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Logging
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000,
    },

    // Frontend Development (with Turbopack)
    {
      name: "mark-frontend-dev",
      script: "npm",
      args: "run dev",
      cwd: "./frontend",
      instances: 1,
      exec_mode: "fork",
      watch: false, // Next.js has its own HMR

      env: {
        NODE_ENV: "development",
        PORT: 9002,
      },

      // Logging
      error_file: "./logs/frontend-dev-error.log",
      out_file: "./logs/frontend-dev-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      autorestart: true,
    },
  ],

  // ==========================================
  // Deployment Configuration
  // ==========================================
  deploy: {
    production: {
      user: "deploy",
      host: ["your-server.com"],
      ref: "origin/main",
      repo: "git@github.com:your-username/mark-corpotax.git",
      path: "/var/www/mark-corpotax",
      "pre-deploy-local": "",
      "post-deploy":
        "cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      env: {
        NODE_ENV: "production",
      },
    },
    staging: {
      user: "deploy",
      host: ["staging.your-server.com"],
      ref: "origin/develop",
      repo: "git@github.com:your-username/mark-corpotax.git",
      path: "/var/www/mark-corpotax-staging",
      "post-deploy":
        "cd backend && npm install && npm run build && cd ../frontend && npm install && npm run build && pm2 reload ecosystem.config.js --env staging",
      env: {
        NODE_ENV: "staging",
      },
    },
  },
};
