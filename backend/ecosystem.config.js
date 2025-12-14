/**
 * PM2 Ecosystem Configuration - Backend
 * MARK Corpotax - Finance Website API
 *
 * Usage:
 *   Production:  pm2 start ecosystem.config.js --env production
 *   Restart:     pm2 restart mark-backend
 *   Logs:        pm2 logs mark-backend
 */

module.exports = {
  apps: [
    {
      name: "mark-backend",
      script: "dist/server.js",
      cwd: "/root/mark-corpotax/backend",
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
      error_file: "/root/mark-corpotax/backend/logs/error.log",
      out_file: "/root/mark-corpotax/backend/logs/out.log",
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
