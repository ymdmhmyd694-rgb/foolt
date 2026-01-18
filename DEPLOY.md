# Deployment Guide for Cash App Clone (Hostinger VPS)

This guide walks you through deploying your Next.js application to a Hostinger VPS (Virtual Private Server).

> [!IMPORTANT]
> This guide is for **VPS Hosting** (e.g., Ubuntu 22.04). If you have "Web Hosting" or "Cloud Hosting", you cannot run this app effectively because it requires a persistent Node.js server and database process.

## Prerequisites

1.  **Hostinger VPS Plan** (KVM 1 or higher recommended).
2.  **Domain Name** pointed to your VPS IP address (A Record).
3.  **SSH Access** to your VPS.

---

## Step 1: Server Setup (First Time Only)

Connect to your VPS via SSH:
```bash
ssh root@your_vps_ip
```

### 1. Update System
```bash
apt update && apt upgrade -y
```

### 2. Install Node.js (v20)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### 3. Install Process Manager (PM2)
PM2 keeps your app running 24/7.
```bash
npm install -g pm2
```

### 4. Install Nginx (Web Server)
Nginx will handle traffic and SSL.
```bash
apt install -y nginx
```

---

## Step 2: Deploying the App

### 1. Upload Your Code
You can clone from GitHub (recommended) or use SCP/FileZilla.

**Option A: GitHub (Recommended)**
```bash
# Generate secure SSH key for GitHub
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Add this key to your GitHub Repo -> Settings -> Deploy Keys

# Clone into /var/www/cash-app
mkdir -p /var/www
cd /var/www
git clone git@github.com:yourusername/cash-app.git
cd cash-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file for production keys.
```bash
nano .env.local
```

Paste your secrets (Right-click to paste in Nano):
```env
AUTH_SECRET="your_generated_secret_here" # run `npx auth secret` to generate
DATABASE_URL="file:./dev.db" 
# Add your Stripe keys here
```
*Press `Ctrl+X`, then `Y`, then `Enter` to save.*

### 4. Build the Application
Run the check script first to ensure everything is ready.
```bash
npm run deploy:check
npm run build
```

---

## Step 3: Run with PM2

Start the application in the background.

```bash
pm2 start npm --name "cash-app" -- start
pm2 save
pm2 startup
# Run the command PM2 prints out to ensure it starts on reboot
```

---

## Step 4: Configure Nginx & SSL

### 1. Setup Nginx Proxy
Remove default config and create a new one:
```bash
rm /etc/nginx/sites-enabled/default
nano /etc/nginx/sites-available/cash-app
```

Paste the following (replace `yourdomain.com`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/cash-app /etc/nginx/sites-enabled/
nginx -t # Check for errors
systemctl restart nginx
```

### 2. Install SSL (HTTPS)
Use Certbot for free SSL.
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Done!** Your app should now be live at `https://yourdomain.com`.

---

## Troubleshooting

-   **App offline?**: Run `pm2 status` or `pm2 logs cash-app`.
-   **Database locked?**: SQLite on VPS works well for single-instance. If you scale, switch to PostgreSQL.
