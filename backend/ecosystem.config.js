/**
 * PM2 Ecosystem Configuration - Backend
 * MARK GROUP - Finance Website API
 *
 * Usage:
 *   Development: pm2 start ecosystem.config.js --only backend-dev
 *   Production:  pm2 start ecosystem.config.js --env production
 *
 * Commands:
 *   pm2 start ecosystem.config.js          # Start backend
 *   pm2 stop backend-prod                  # Stop production
 *   pm2 restart backend-prod               # Restart production
 *   pm2 logs backend-prod                  # View logs
 *   pm2 monit                              # Monitor
 */

module.exports = {
  apps: [
    // ==========================================
    // Backend API Server - Production
    // ==========================================
    {
      name: "mark-backend",
      script: "dist/server.js",
      instances: 1,
      exec_mode: "fork",
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
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "logs/error.log",
      out_file: "logs/out.log",
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
  ],
};
