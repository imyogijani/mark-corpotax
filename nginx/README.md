# NGINX Configuration for MARK Corpotax

This directory contains NGINX configuration files for deploying the MARK Corpotax website on a Hostinger Ubuntu VPS.

## Domains

- **Frontend**: `markcorpotax.com` (Next.js on port 3000)
- **Backend API**: `api.markcorpotax.com` (Express.js on port 5000)

## Prerequisites

1. Ubuntu VPS with root/sudo access
2. NGINX installed
3. Node.js 18+ installed
4. PM2 installed globally
5. Domain DNS configured to point to your VPS IP

## Installation Steps

### 1. Install NGINX (if not already installed)

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2. Copy Configuration Files

```bash
# Copy frontend config
sudo cp markcorpotax.com.conf /etc/nginx/sites-available/markcorpotax.com

# Copy backend config
sudo cp api.markcorpotax.com.conf /etc/nginx/sites-available/api.markcorpotax.com

# Create symbolic links to enable sites
sudo ln -s /etc/nginx/sites-available/markcorpotax.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.markcorpotax.com /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default
```

### 3. Add Proxy Cache Configuration

Edit the main NGINX config to add caching:

```bash
sudo nano /etc/nginx/nginx.conf
```

Add this inside the `http` block:

```nginx
# Proxy cache settings
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=STATIC:10m inactive=7d use_temp_path=off;

# Rate limiting zone for API
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

### 4. Create Required Directories

```bash
# Create web root directories
sudo mkdir -p /var/www/markcorpotax.com
sudo mkdir -p /var/www/html

# Set permissions
sudo chown -R www-data:www-data /var/www/
sudo chmod -R 755 /var/www/
```

### 5. Install SSL Certificates (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificates for both domains
sudo certbot --nginx -d markcorpotax.com -d www.markcorpotax.com
sudo certbot --nginx -d api.markcorpotax.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 6. Test and Reload NGINX

```bash
# Test configuration syntax
sudo nginx -t

# If test passes, reload NGINX
sudo systemctl reload nginx
```

### 7. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Deploy Application with PM2

### 1. Clone Repository

```bash
cd /var/www
git clone <your-repo-url> markcorpotax
cd markcorpotax
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
cd backend
npm install
npm run build
cd ..
```

### 3. Configure Environment Variables

```bash
# Frontend
cp frontend/.env.production frontend/.env.local
nano frontend/.env.local
# Verify NEXT_PUBLIC_API_URL=https://api.markcorpotax.com/api

# Backend
cp backend/.env.production backend/.env
nano backend/.env
# Update all production values:
# - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
# - SMTP_USER and SMTP_PASS for email
# - Firebase credentials (either serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT env var)
```

### 4. Start with PM2

```bash
# Start Backend
cd /var/www/markcorpotax/backend
pm2 start ecosystem.config.js --env production
cd ..

# Start Frontend
cd /var/www/markcorpotax/frontend
pm2 start ecosystem.config.js --env production
cd ..

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup
# Follow the output instructions
```

## Monitoring & Logs

### View NGINX Logs

```bash
# Frontend access logs
sudo tail -f /var/log/nginx/markcorpotax.access.log

# Frontend error logs
sudo tail -f /var/log/nginx/markcorpotax.error.log

# Backend access logs
sudo tail -f /var/log/nginx/api.markcorpotax.access.log

# Backend error logs
sudo tail -f /var/log/nginx/api.markcorpotax.error.log
```

### View PM2 Logs

```bash
# All logs
pm2 logs

# Frontend logs
pm2 logs frontend-prod

# Backend logs
pm2 logs backend-prod
```

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Process list
pm2 list

# Process details
pm2 show frontend-prod
pm2 show backend-prod
```

## Troubleshooting

### NGINX won't start

```bash
# Check syntax
sudo nginx -t

# Check error logs
sudo journalctl -xe
sudo tail -50 /var/log/nginx/error.log
```

### SSL Certificate Issues

```bash
# Renew certificates manually
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### Application not responding

```bash
# Check if apps are running
pm2 list

# Restart applications
pm2 restart all

# Check application logs
pm2 logs --lines 100
```

### Port conflicts

```bash
# Check what's using ports 3000 and 5000
sudo lsof -i :3000
sudo lsof -i :5000
sudo netstat -tulpn | grep -E '3000|5000'
```

## Security Recommendations

1. **Enable HSTS**: Uncomment the HSTS header in config files after confirming SSL works
2. **Firewall**: Only allow necessary ports (80, 443, 22)
3. **Fail2ban**: Install and configure for brute-force protection
4. **Regular Updates**: Keep system and packages updated

```bash
# Install fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Regular updates
sudo apt update && sudo apt upgrade -y
```

## Quick Commands Reference

```bash
# NGINX
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo nginx -t

# PM2 (run from respective folders)
# Backend
cd /var/www/markcorpotax/backend && pm2 start ecosystem.config.js --env production
# Frontend
cd /var/www/markcorpotax/frontend && pm2 start ecosystem.config.js --env production

pm2 restart all
pm2 stop all
pm2 delete all
pm2 logs
pm2 monit

# SSL
sudo certbot renew
sudo certbot certificates
```
