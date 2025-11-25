#!/usr/bin/env node
/**
 * Setup script to create .env file with default values
 * Run: node scripts/setup-env.js
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const envPath = path.join(process.cwd(), '.env')
const examplePath = path.join(process.cwd(), '.env.example')

// Generate secure values
const jwtSecret = crypto.randomBytes(32).toString('hex')
const passwordHash = bcrypt.hashSync('password123', 10)

const envContent = `# Environment Configuration for PayIn Global
# Generated on ${new Date().toISOString()}

# Node Environment
NODE_ENV=development

# MongoDB Connection
# For local development, use: mongodb://localhost:27017/payinglobal
# For MongoDB Atlas, use your connection string from Atlas dashboard
MONGODB_URI=mongodb://localhost:27017/payinglobal

# Admin Authentication
# Default admin credentials: admin@payinglobal.com / password123
ADMIN_EMAIL=admin@payinglobal.com
ADMIN_PASSWORD_HASH=${passwordHash}

# JWT Secret
ADMIN_JWT_SECRET=${jwtSecret}

# Site Configuration
SITE_URL=http://localhost:3000

# Email Configuration (Optional - for contact form emails)
# Get API key from https://resend.com
RESEND_API_KEY=
CONTACT_INBOX_EMAIL=

# Currency API Configuration
# Get API key from https://fastforex.io or https://openexchangerates.org
CURRENCY_API_BASE_URL=https://api.fastforex.io/fetch-all
CURRENCY_API_KEY=
CURRENCY_API_DEFAULT_BASE=USD

# Cloudinary Configuration (Optional - for blog cover images)
# Get credentials from https://cloudinary.com
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
`

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.')
  console.log('   If you want to regenerate, delete .env and run this script again.')
} else {
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env file with default values')
  console.log('📝 Default admin credentials: admin@payinglobal.com / password123')
  console.log('🔐 JWT secret and password hash have been generated')
}

// Also create .env.example if it doesn't exist
if (!fs.existsSync(examplePath)) {
  const exampleContent = envContent.replace(passwordHash, '$2b$10$example.hash.replace.with.your.own')
    .replace(jwtSecret, 'your-secret-key-min-32-characters-long')
  fs.writeFileSync(examplePath, exampleContent)
  console.log('✅ Created .env.example file')
}

