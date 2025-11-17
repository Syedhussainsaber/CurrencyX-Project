# Global CurrencyX - Real-Time Currency Converter + Blog + Admin Dashboard

A production-ready, full-stack Next.js application featuring real-time currency conversion, blog management, and an admin dashboard.

## 🚀 Features

- **Real-Time Currency Converter**: Convert between 170+ currencies with live exchange rates
- **Blog System**: Full CMS with admin dashboard for creating, editing, and managing blog posts
- **Contact Form**: Backend email integration with database storage
- **Admin Dashboard**: Secure authentication, blog management, contact submissions, and site settings
- **Responsive Design**: Mobile-first, fully responsive UI with dark/light mode
- **SEO Optimized**: Complete metadata, sitemap, and structured data

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt password hashing
- **Email**: Resend API
- **Image Upload**: Cloudinary
- **Currency API**: FastForex.io / OpenExchangeRates

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- (Optional) Resend API key for email functionality
- (Optional) FastForex/OpenExchangeRates API key for live rates
- (Optional) Cloudinary account for image uploads

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd currencyX-project
npm install --legacy-peer-deps
```

### 2. Environment Configuration

Run the setup script to generate a `.env` file with default values:

```bash
npm run setup
```

Or manually create a `.env` file in the root directory with the following variables:

```env
# Node Environment
NODE_ENV=development

# MongoDB Connection
# Local: mongodb://localhost:27017/currencyx
# Atlas: mongodb+srv://user:password@cluster.mongodb.net/currencyx
MONGODB_URI=mongodb://localhost:27017/currencyx

# Admin Authentication
# Default: admin@currencyx.com / password123
ADMIN_EMAIL=admin@currencyx.com
ADMIN_PASSWORD_HASH=$2b$10$QMSh7MeNGSNg./zbn6xnM.idOZiSCMeKAEXPWDRKGW.hEssfbZM.a

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_JWT_SECRET=your-secret-key-min-32-characters-long

# Site Configuration
SITE_URL=http://localhost:3000

# Email Configuration (Optional)
RESEND_API_KEY=
CONTACT_INBOX_EMAIL=

# Currency API Configuration (Optional - will use mock data if not provided)
CURRENCY_API_BASE_URL=https://api.fastforex.io/fetch-all
CURRENCY_API_KEY=
CURRENCY_API_DEFAULT_BASE=USD

# Cloudinary Configuration (Optional - for blog cover images)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Generate Admin Password Hash

To create a new admin password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('yourPassword', 10))"
```

Replace `ADMIN_PASSWORD_HASH` in `.env` with the generated hash.

### 4. Start MongoDB

**Local MongoDB:**
```bash
# macOS/Linux
mongod

# Windows
# Start MongoDB service from Services panel
```

**MongoDB Atlas:**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string and update `MONGODB_URI`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Admin Access

- **URL**: `http://localhost:3000/admin/login`
- **Default Email**: `admin@currencyx.com`
- **Default Password**: `password123`

⚠️ **Important**: Change the default password in production!

## 📁 Project Structure

```
currencyX-project/
├── app/                    # Next.js app directory
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── blog/               # Blog pages
│   └── [pages]/            # Public pages
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   └── [components]/       # Custom components
├── lib/                    # Utility functions
│   ├── db.ts              # MongoDB connection
│   ├── env.ts             # Environment validation
│   ├── auth.ts            # Authentication
│   └── currency.ts        # Currency API
├── models/                 # Mongoose models
├── data/                   # Static data (currencies)
└── public/                 # Static assets
```

## 🎨 Theme Colors

The application uses a green color scheme:

- **Primary**: `#075E54` (Dark Green)
- **Accent**: `#25D366` (Light Green)
- **Highlight**: `#128C7E` (Surf Green)

## 🚢 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all required environment variables in your hosting platform:

- `MONGODB_URI` - Your MongoDB connection string
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD_HASH` - Bcrypt hash of admin password
- `ADMIN_JWT_SECRET` - Secure random string (32+ chars)
- `SITE_URL` - Your production URL
- `RESEND_API_KEY` - (Optional) For email functionality
- `CURRENCY_API_KEY` - (Optional) For live exchange rates
- `CLOUDINARY_*` - (Optional) For image uploads

## 🐛 Troubleshooting

### "Cannot set property message" Error

This error occurs when environment variables are missing. Ensure your `.env` file exists and contains all required variables. Run `npm run setup` to generate a default `.env` file.

### MongoDB Connection Issues

- Verify MongoDB is running (local) or connection string is correct (Atlas)
- Check firewall settings if using Atlas
- Ensure network access is configured in Atlas dashboard

### Currency Rates Not Loading

- If `CURRENCY_API_KEY` is not set, the app will use mock data
- For live rates, sign up at [FastForex.io](https://fastforex.io) or [OpenExchangeRates](https://openexchangerates.org)
- Add your API key to `.env`

## 📝 License

This project is private and proprietary.

## 🤝 Support

For issues or questions, please contact the development team.

