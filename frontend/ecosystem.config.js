/**
 * PM2 Ecosystem Configuration - Frontend
 * Mark Corpotax - Finance Website
 *
 * Usage:
 *   First:    npm run build
 *   Start:    pm2 start ecosystem.config.js --env production
 *   Restart:  pm2 restart mark-frontend
 *   Logs:     pm2 logs mark-frontend
 */

module.exports = {
  apps: [
    {
      name: "mark-frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: "/root/mark-corpotax/frontend",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      max_memory_restart: "1G",

      env: {
        NODE_ENV: "development",
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
        NEXT_PUBLIC_API_URL: "https://api.markcorpotax.com/api",
      },

      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/root/mark-corpotax/frontend/logs/error.log",
      out_file: "/root/mark-corpotax/frontend/logs/out.log",
      merge_logs: true,

      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 4000,
    },
  ],
};
