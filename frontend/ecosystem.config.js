/**
 * PM2 Ecosystem Configuration - Frontend
 * MARK GROUP - Finance Website
 *
 * Usage:
 *   Development: pm2 start ecosystem.config.js --only frontend-dev
 *   Production:  pm2 start ecosystem.config.js --env production
 *
 * Commands:
 *   pm2 start ecosystem.config.js          # Start frontend
 *   pm2 stop frontend-prod                 # Stop production
 *   pm2 restart frontend-prod              # Restart production
 *   pm2 logs frontend-prod                 # View logs
 *   pm2 monit                              # Monitor
 */

module.exports = {
  apps: [
    // ==========================================
    // Frontend Next.js Server - Production
    // ==========================================
    {
      name: "frontend-prod",
      script: "npm",
      args: "start",
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
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      merge_logs: true,

      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000,
    },

    // ==========================================
    // Frontend Next.js Server - Development
    // ==========================================
    {
      name: "frontend-dev",
      script: "npm",
      args: "run dev",
      instances: 1,
      exec_mode: "fork",
      watch: false, // Next.js has its own HMR

      env: {
        NODE_ENV: "development",
        PORT: 9002,
      },

      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/dev-error.log",
      out_file: "logs/dev-out.log",

      autorestart: true,
    },
  ],
};
