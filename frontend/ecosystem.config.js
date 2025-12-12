/**
 * PM2 Ecosystem Configuration - Frontend
 * Mark Corpotax - Finance Website
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *
 * Commands:
 *   pm2 start ecosystem.config.js          # Start frontend
 *   pm2 stop frontend                      # Stop frontend
 *   pm2 restart frontend                   # Restart frontend
 *   pm2 logs frontend                      # View logs
 *   pm2 monit                              # Monitor
 */

module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npm",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",

      env: {
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
  ],
};
