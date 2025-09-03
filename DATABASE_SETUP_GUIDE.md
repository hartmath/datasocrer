# 🚀 DataCSV Database Setup Guide

This guide will help you set up your DataCSV platform database automatically with all necessary tables, policies, and sample data.

## 📋 Prerequisites

Before running the setup, ensure you have:

1. **Supabase Project** created at [supabase.com](https://supabase.com)
2. **Environment Variables** configured in your `.env` file
3. **Node.js** installed (version 16 or higher)

## 🔧 Environment Setup

### 1. Create `.env` file

Create a `.env` file in your project root with your Supabase credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 2. Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

## 🎯 Automatic Database Setup

### Option 1: Using npm script (Recommended)

```bash
# Install dependencies if not already done
npm install

# Run the database setup
npm run setup-db
```

### Option 2: Direct execution

```bash
# Run the setup script directly
node scripts/setup-database.js
```

## 📊 What Gets Created

The setup script automatically creates:

### 🗄️ Database Tables
- **profiles** - User profiles and authentication
- **content_items** - Dynamic website content
- **datasets** - Data products and leads
- **categories** - Product categories
- **providers** - Data providers
- **cart_items** - Shopping cart
- **orders** - Purchase orders
- **order_items** - Order line items
- **downloads** - File downloads
- **subscriptions** - User subscriptions
- **wishlist_items** - User wishlists
- **reviews** - Product reviews
- **lead_import_configs** - Lead import settings
- **imported_leads** - Imported lead data
- **user_balances** - User account balances
- **balance_transactions** - Balance history
- **saved_payment_methods** - Payment methods
- **notifications** - User notifications

### 🔒 Security Policies
- **Row Level Security (RLS)** enabled on all tables
- **User isolation** - Users can only access their own data
- **Admin privileges** - Admin users can manage all data
- **Public access** - Certain data (datasets, reviews) publicly viewable

### ⚙️ Database Functions
- **add_balance()** - Add funds to user account
- **deduct_balance()** - Deduct funds from user account
- **generate_order_number()** - Create unique order numbers

### 📈 Sample Data
- **Sample datasets** with realistic pricing
- **Insurance categories** (Health, Life, Medicare, etc.)
- **Verified providers** with descriptions
- **Sample content** for website sections

## 🔍 Verification

After running the setup, verify everything is working:

### 1. Check Database Tables
Go to your Supabase dashboard → **Table Editor** and verify all tables exist.

### 2. Test Authentication
Try signing up a new user in your app.

### 3. Check Sample Data
Visit your marketplace page to see sample datasets.

## 🛠️ Troubleshooting

### Common Issues

#### 1. "exec_sql function not found"
**Solution**: Enable the `exec_sql` function in Supabase:
1. Go to **SQL Editor** in Supabase dashboard
2. Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

#### 2. "Permission denied"
**Solution**: Check your Supabase API key permissions in **Settings** → **API**.

#### 3. "Connection failed"
**Solution**: Verify your environment variables and internet connection.

### Manual Setup (if automatic fails)

If the automatic setup fails, you can run the SQL manually:

1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste the SQL from `scripts/setup-database.js`
3. Run each section separately

## 🔄 Reset Database

To reset your database and start fresh:

```bash
# This will clear all data and recreate tables
npm run db:reset
```

## 📱 Next Steps

After successful database setup:

1. **Test the platform** - Sign up and browse datasets
2. **Configure Stripe** - Add your Stripe keys for payments
3. **Customize content** - Use the admin panel to edit website content
4. **Add real data** - Upload your actual datasets and leads

## 🆘 Support

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your Supabase project settings
3. Ensure all environment variables are set correctly
4. Check the Supabase logs in your dashboard

## 🎉 Success!

Once setup is complete, you'll see:

```
🎉 Database setup completed successfully!
Your DataCSV platform is ready to use.
```

Your DataCSV platform is now fully configured with:
- ✅ Complete database schema
- ✅ Security policies
- ✅ Sample data
- ✅ Admin functionality
- ✅ Payment integration ready
- ✅ Lead import system ready

Happy data selling! 🚀
