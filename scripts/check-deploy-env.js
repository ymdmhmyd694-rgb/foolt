const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
    'AUTH_SECRET',
    'DATABASE_URL',
    // Add other required variables here
    // 'STRIPE_SECRET_KEY', 
    // 'STRIPE_WEBHOOK_SECRET',
];

const optionalEnvVars = [
    'NEXT_PUBLIC_APP_URL',
];

function checkEnv() {
    console.log('🔍 Checking environment variables for deployment...');

    // Try to load .env file for local testing logic if needed, 
    // but in production, we expect actual env vars.
    // Next.js handles .env loading, but this script might run before next build

    // We can try to read .env just to be helpful in local context
    try {
        const dotenvPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(dotenvPath)) {
            const dotenvContent = fs.readFileSync(dotenvPath, 'utf8');
            dotenvContent.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split('=');
                if (key && valueParts.length > 0) {
                    const value = valueParts.join('=').trim();
                    if (!process.env[key.trim()]) {
                        process.env[key.trim()] = value;
                    }
                }
            });
        }
    } catch (e) {
        // ignore
    }

    let missing = [];

    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            missing.push(envVar);
        }
    });

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(v => console.error(`   - ${v}`));
        console.error('\nPlease set these variables in your Hostinger VPS configuration or .env file.');
        process.exit(1);
    } else {
        console.log('✅ All required environment variables are present.');
    }
}

checkEnv();
