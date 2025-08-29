# 🚀 DataCSV Lead Import - Deployment Guide

## Prerequisites

- **Node.js 18+** and npm
- **Supabase** project with database
- **Stripe** account (live keys for production)
- **Facebook Developer** account and app
- **Vercel** account (or preferred hosting platform)

## 🔧 Environment Setup

### 1. Clone and Install
```bash
git clone <your-repo>
cd datacsv-main
npm install
```

### 2. Environment Variables

Create `.env` file with all required variables:

```env
# ===== SUPABASE CONFIGURATION =====
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ===== STRIPE CONFIGURATION =====
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key

# ===== FACEBOOK INTEGRATION =====
VITE_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_VERIFY_TOKEN=your_custom_verify_token

# ===== APPLICATION CONFIGURATION =====
VITE_APP_URL=https://your-domain.com
WEBHOOK_SECRET_KEY=your_webhook_secret_key
NODE_ENV=production

# ===== OPTIONAL TEST CONFIGURATION =====
TEST_USER_ID=test-user-123
```

### 3. Supabase Setup

#### Enable Required Extensions
```sql
-- In Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
```

#### Set Environment Variables in Supabase
Go to **Project Settings → Environment Variables** and add:
```
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_VERIFY_TOKEN=your_custom_verify_token
WEBHOOK_SECRET_KEY=your_webhook_secret_key
```

## 🗄️ Database Migration

### Method 1: Automated Migration (Recommended)
```bash
# Run deployment script
npm run deploy
```

### Method 2: Manual Migration
```bash
# Copy SQL from migration file
# Paste into Supabase SQL Editor
# Execute the migration script
```

### Verify Migration
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'lead_import_configs',
  'imported_leads', 
  'user_balances',
  'balance_transactions',
  'notifications'
);
```

## 🚀 Deployment to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Configure Project
```bash
# Login to Vercel
vercel login

# Initialize project
vercel init

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add VITE_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add VITE_FACEBOOK_APP_ID
vercel env add FACEBOOK_APP_SECRET
vercel env add FACEBOOK_VERIFY_TOKEN
vercel env add WEBHOOK_SECRET_KEY
vercel env add VITE_APP_URL
```

### 3. Deploy
```bash
# Deploy to production
vercel --prod
```

### 4. Verify Deployment
```bash
# Test webhook endpoints
curl https://your-domain.com/api/webhooks/test-webhook

# Check health
curl https://your-domain.com/api/webhooks/facebook-webhook/test?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test
```

## 📱 Facebook App Configuration

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click **"Create App"** → **"Business"** → **"Continue"**
3. App Name: **"DataCSV Lead Import"**
4. Contact Email: Your business email

### 2. Add Webhooks Product
1. **Products** → **Add Product** → **Webhooks** → **Set Up**
2. **Callback URL**: `https://your-domain.com/api/webhooks/leads/facebook/{user_id}`
3. **Verify Token**: Your `FACEBOOK_VERIFY_TOKEN`
4. **Subscription Fields**: `leadgen`

### 3. Configure Lead Ads Permissions
1. **App Review** → **Permissions and Features**
2. Request **"leads_retrieval"** permission
3. Submit for review if required

### 4. Get Page Access Token
```javascript
// Test in Graph API Explorer
// GET /{page-id}?fields=access_token
// Use this token in lead import configurations
```

## 🧪 Testing

### 1. Run Integration Tests
```bash
# Set test environment
export TEST_USER_ID=your-test-user-id

# Run tests
npm run test:integration
```

### 2. Test Webhook Manually
```bash
# Test webhook health
curl -X GET https://your-domain.com/api/webhooks/test-webhook

# Test Facebook lead processing
curl -X POST https://your-domain.com/api/webhooks/test-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "test_type": "facebook_lead",
    "user_id": "test-user-123",
    "lead_data": {
      "first_name": "John",
      "last_name": "Doe", 
      "email": "john.doe@example.com",
      "phone": "+1234567890"
    }
  }'
```

### 3. Facebook Lead Testing Tool
1. Go to [Facebook Lead Ads Testing](https://developers.facebook.com/tools/lead-ads-testing/)
2. Enter your **Form ID** and **Page ID**
3. Submit test lead
4. Verify webhook receives and processes lead

## 🔍 Monitoring & Debugging

### 1. Vercel Function Logs
```bash
# View function logs
vercel logs

# Real-time logs
vercel logs --follow
```

### 2. Supabase Logs
1. **Dashboard** → **Logs** → **Database Logs**
2. Filter by webhook functions and RLS policies

### 3. Database Monitoring
```sql
-- Check webhook logs
SELECT * FROM webhook_logs 
ORDER BY created_at DESC 
LIMIT 20;

-- Check recent leads
SELECT * FROM imported_leads 
ORDER BY imported_at DESC 
LIMIT 10;

-- Check balance transactions
SELECT * FROM balance_transactions 
ORDER BY created_at DESC 
LIMIT 10;
```

### 4. Error Tracking
Consider integrating error tracking:
- **Sentry** for client-side errors
- **LogRocket** for user session replay
- **DataDog** for infrastructure monitoring

## 🔒 Security Checklist

### Environment Security
- [ ] All secrets in environment variables (not hardcoded)
- [ ] Production keys separate from development
- [ ] Webhook verify tokens properly configured
- [ ] CORS configured for production domain

### Database Security
- [ ] RLS policies enabled on all tables
- [ ] Service role key secured
- [ ] Regular security updates applied

### Webhook Security
- [ ] Signature verification enabled
- [ ] Rate limiting configured
- [ ] HTTPS only in production
- [ ] Input validation on all endpoints

## 📊 Performance Optimization

### 1. Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_imported_leads_user_date 
ON imported_leads(user_id, imported_at);

CREATE INDEX IF NOT EXISTS idx_balance_transactions_user_date 
ON balance_transactions(user_id, created_at);
```

### 2. Function Optimization
- Enable function caching where appropriate
- Use connection pooling for database
- Implement request caching for repeated queries

### 3. CDN Setup
- Configure Vercel CDN for static assets
- Enable gzip compression
- Optimize images and reduce bundle size

## 🎯 Go-Live Checklist

### Pre-Launch
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Webhook endpoints tested
- [ ] Facebook app approved
- [ ] Stripe live mode activated
- [ ] SSL certificate valid
- [ ] Error monitoring configured
- [ ] Backup strategy implemented

### Launch Day
- [ ] Monitor webhook processing
- [ ] Check error rates and response times
- [ ] Verify lead quality scoring
- [ ] Test balance deduction flow
- [ ] Confirm notification delivery
- [ ] Monitor database performance

### Post-Launch
- [ ] Set up monitoring alerts
- [ ] Schedule regular database maintenance
- [ ] Plan capacity scaling
- [ ] Gather user feedback
- [ ] Optimize based on usage patterns

## 🚨 Troubleshooting

### Common Issues

#### Webhook Not Receiving Data
```bash
# Check endpoint accessibility
curl -I https://your-domain.com/api/webhooks/leads/facebook/test

# Verify Facebook subscription
curl -X GET "https://graph.facebook.com/v18.0/PAGE_ID/subscribed_apps?access_token=PAGE_ACCESS_TOKEN"
```

#### Database Connection Errors
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" https://YOUR_PROJECT.supabase.co/rest/v1/profiles?select=count
```

#### Balance Deduction Failures
```sql
-- Check user balance
SELECT * FROM user_balances WHERE user_id = 'user_id';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'user_balances';
```

#### Quality Score Issues
```bash
# Test quality scoring
curl -X POST https://your-domain.com/api/webhooks/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"test_type": "quality_score", "lead_data": {"email": "test@example.com"}}'
```

### Support Channels
- **GitHub Issues**: Technical problems
- **Email**: support@datacsv.com
- **Documentation**: Full API docs available
- **Community**: Discord server for developers

---

## 🎉 Congratulations!

Your DataCSV Lead Import system is now deployed and ready to process leads from Facebook ad campaigns with automatic balance deduction!

### Next Steps:
1. 📈 **Monitor** initial lead imports
2. 🔧 **Optimize** quality filters based on data
3. 🚀 **Scale** to additional platforms (Google, LinkedIn)
4. 📊 **Analyze** performance and ROI
5. 🎯 **Expand** to enterprise features

**Happy lead importing!** 🚀
