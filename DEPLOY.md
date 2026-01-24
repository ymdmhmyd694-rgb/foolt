# Deploying Cash App Clone to Hostinger VPS

This guide assumes you have a Hostinger VPS with **Ubuntu 22.04** or **Debian 11/12**.

## Prerequisites
1.  **SSH Access**: You know your VPS IP (e.g., `123.45.67.89`) and root password.
2.  **Neon Database**: You have your connection string `postgres://...`
3.  **Code**: You have pushed your latest code to GitHub.

---

## Step 1: Connect to your VPS
Open your terminal (PowerShell on Windows, Terminal on Mac) and run:
```bash
ssh root@<YOUR_VPS_IP>
# Type yes if asked about fingerprint
# Enter your password (it won't show on screen when typing)
```

## Step 2: Install Node.js 20 and Git
Copy and paste these commands into your VPS terminal:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git

# Install PM2 (Process Manager) globally
npm install -g pm2
```

## Step 3: Clone Your Project
Navigate to the web directory and clone your repo.
*Replace `<YOUR_GITHUB_REPO_URL>` with your actual URL (e.g., https://github.com/username/repo.git)*
```bash
mkdir -p /var/www
cd /var/www

# Clone the repo
git clone <YOUR_GITHUB_REPO_URL> cash-app

# Enter the directory
cd cash-app
```

## Step 4: Install Dependencies & Build
```bash
# Install packages
npm install

# Generate Prisma Client
npx prisma generate

# Build the project
npm run build
```

## Step 5: Configure Environment Variables
You need to create a `.env` file on the server.
```bash
nano .env
```
**Paste inside the file (Right-click in terminal to paste):**
```env
DATABASE_URL="<YOUR_NEON_DATABASE_URL>"
AUTH_SECRET="<YOUR_AUTH_SECRET>"
NEXTAUTH_URL="http://<YOUR_VPS_IP>:3000"
# Add other secrets here (STRIPE_SECRET_KEY, etc.)
```
*Save and Exit: Press `Ctrl+X`, then `Y`, then `Enter`.*

## Step 6: Start the App with PM2
Use the `ecosystem.config.js` file we created.
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# Run the command displayed by pm2 startup if any
```

## Step 7: Verify
Open your browser and search: `http://<YOUR_VPS_IP>:3000`

---

### (Optional) Setup Nginx for Domain Name
If you have a domain (e.g., `myapp.com`), configure Nginx to forward port 80 to 3000.

1. Install Nginx: `apt install -y nginx`
2. Create config: `nano /etc/nginx/sites-available/cash-app`
3. Paste:
```nginx
server {
    listen 80;
    server_name myapp.com www.myapp.com; # <--- CHANGE THIS
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
4. Enable and Restart:
```bash
ln -s /etc/nginx/sites-available/cash-app /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl restart nginx
```
