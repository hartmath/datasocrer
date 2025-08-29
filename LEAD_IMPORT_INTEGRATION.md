# 🚀 Lead Import Integration - DataCSV Platform

## Overview

The **Lead Import Integration** system allows clients to automatically import leads from advertising platforms (Facebook Ads, Google Ads, LinkedIn Ads) directly into their DataCSV account with **automatic balance deduction**.

## 🎯 Key Features

### ✅ Real-Time Lead Processing
- **Instant webhook processing** from ad platforms
- **Quality scoring** (0-100%) based on completeness
- **Automatic balance deduction** per lead
- **Real-time notifications** to users

### ✅ Multi-Platform Support
- **Facebook Lead Ads** ✅ (Fully Implemented)
- **Google Ads** 🔄 (Coming Soon)
- **LinkedIn Ads** 🔄 (Coming Soon)
- **Custom Webhook APIs** ✅ (Implemented)

### ✅ Smart Balance Management
- **Auto-recharge** via saved payment methods
- **Threshold-based** recharging ($100 threshold, $500 recharge)
- **Balance reservations** for pending transactions
- **Transaction history** and analytics

### ✅ Advanced Filtering
- **Quality score thresholds**
- **Geographic restrictions**
- **Demographic filters**
- **Custom field mapping**

## 🏗️ Architecture

### Database Schema
```sql
-- Core Tables
- lead_import_configs     # Platform configurations
- imported_leads          # All imported leads
- user_balances          # User account balances
- balance_transactions   # Transaction history
- saved_payment_methods  # Auto-recharge setup
- notifications          # Real-time alerts
```

### API Endpoints
```
POST /api/webhooks/leads/facebook/{userId}    # Facebook webhook
POST /api/webhooks/leads/google/{userId}      # Google webhook  
POST /api/webhooks/leads/linkedin/{userId}    # LinkedIn webhook
POST /api/webhooks/leads/custom/{configId}    # Custom webhook
```

## 📱 User Interface

### Lead Import Dashboard (`/lead-import`)
- **Account balance** with add funds functionality
- **Real-time statistics** (leads, spend, quality, configs)
- **Platform configuration** management
- **Recent leads** activity feed
- **Quick actions** (recharge, refresh, settings)

### Setup Flows
1. **Choose Platform** (Facebook, Google, LinkedIn, Custom)
2. **Configure API credentials** and authentication
3. **Set pricing** (cost per lead, auto-recharge)
4. **Define filters** (quality, geo, demographics)
5. **Test webhook** and activate

## 🔧 Implementation Details

### Facebook Lead Ads Integration

#### Setup Process
```typescript
const config = await setupFacebookLeadAds(userId, {
  page_id: "facebook_page_id",
  form_id: "lead_form_id", 
  access_token: "facebook_access_token",
  cost_per_lead_cents: 500 // $5.00 per lead
});
```

#### Webhook Flow
1. **Facebook sends webhook** → `/api/webhooks/leads/facebook/{userId}`
2. **Verify webhook signature** and form configuration
3. **Fetch lead data** from Facebook Graph API
4. **Map fields** to standardized format
5. **Calculate quality score** (email, phone, name, address)
6. **Check user balance** and apply filters
7. **Deduct balance** atomically
8. **Store lead** and send notification

#### Field Mapping
```json
{
  "first_name": "first_name",
  "last_name": "last_name", 
  "email": "email",
  "phone": "phone_number",
  "city": "city",
  "state": "state",
  "zip_code": "zip_code"
}
```

### Quality Scoring Algorithm
```typescript
// Email validation (30 points)
// Phone validation (25 points)  
// Name completeness (20 points)
// Address completeness (15 points)
// Additional demographics (10 points)
// Total: 100 points maximum
```

### Balance Management
```typescript
// Atomic balance operations
await deductUserBalance(userId, costCents, leadId);

// Auto-recharge when below threshold
if (balance < threshold && autoRecharge) {
  await attemptAutoRecharge(userId, rechargeAmount);
}
```

## 🛡️ Security & Rate Limiting

### Webhook Security
- **Signature verification** for platform webhooks
- **Token authentication** for custom webhooks
- **IP allowlisting** for known platforms
- **Request logging** and monitoring

### Rate Limiting
- **100 requests per minute** per IP
- **Exponential backoff** for failed requests
- **DDoS protection** via Cloudflare

### Data Privacy
- **Row Level Security** (RLS) on all tables
- **Encrypted API credentials** in database
- **PII handling** compliance (GDPR/CCPA)

## 📊 Analytics & Monitoring

### Real-Time Views
```sql
-- Lead import analytics by day/platform
lead_import_analytics

-- User balance and spending summary  
user_balance_summary

-- Revenue from lead imports by month
lead_import_revenue
```

### Key Metrics
- **Lead volume** by platform and time
- **Quality score** trends
- **Revenue per lead** by source
- **User engagement** and retention
- **Failed import** analysis

## 🚀 Deployment

### Environment Variables
```env
# Facebook Integration
VITE_FACEBOOK_APP_ID=your_app_id
FACEBOOK_VERIFY_TOKEN=your_verify_token

# Webhook Security
WEBHOOK_SECRET_KEY=your_secret_key

# Auto-recharge
STRIPE_SECRET_KEY=sk_live_...
```

### Database Migration
```bash
# Apply lead import tables
npx supabase db reset --linked
```

### Webhook Registration
```bash
# Facebook webhook URL
https://your-domain.com/api/webhooks/leads/facebook/{user_id}

# Verification token: FACEBOOK_VERIFY_TOKEN
# Subscribed fields: leadgen
```

## 🎯 Business Impact

### Revenue Opportunities
- **$5-50 per lead** depending on quality and industry
- **10-20% commission** on lead imports
- **Monthly subscriptions** for heavy users
- **Premium features** (advanced filtering, analytics)

### User Benefits  
- **Instant lead delivery** (no manual exports)
- **Quality filtering** (only pay for good leads)
- **Automated billing** (set and forget)
- **Multi-platform** centralized management

### Competitive Advantages
- **First-to-market** automated ad lead imports
- **Pay-per-lead** model vs. monthly subscriptions
- **Quality scoring** vs. raw lead dumps
- **Real-time processing** vs. batch exports

## 🔄 Future Enhancements

### Platform Integrations
- [ ] **Google Ads** Lead Form Extensions
- [ ] **LinkedIn Lead Gen Forms**
- [ ] **Twitter Lead Generation Cards**
- [ ] **TikTok Lead Generation**
- [ ] **Snapchat Lead Ads**

### Advanced Features
- [ ] **Lead scoring ML models**
- [ ] **Duplicate detection** across platforms
- [ ] **Lead enrichment** (append demographic data)
- [ ] **CRM integrations** (Salesforce, HubSpot)
- [ ] **Zapier/Make.com** connectors

### Enterprise Features  
- [ ] **Team management** and permissions
- [ ] **White-label** platform for agencies
- [ ] **Advanced analytics** and reporting
- [ ] **Custom SLAs** and support
- [ ] **Enterprise security** (SSO, audit logs)

## 📞 Support & Documentation

### Setup Assistance
1. **Contact support** at support@datacsv.com
2. **Schedule onboarding** call for enterprise clients
3. **Self-service** documentation portal
4. **Video tutorials** for each platform

### API Documentation
- **OpenAPI/Swagger** specification
- **Postman collection** for testing
- **SDK libraries** (JavaScript, Python, PHP)
- **Rate limits** and error codes

---

## 🎉 Getting Started

1. **Navigate** to `/lead-import` in your DataCSV dashboard
2. **Add funds** to your account balance
3. **Choose platform** (Facebook recommended to start)
4. **Configure** your ad account credentials
5. **Set pricing** and quality filters
6. **Test webhook** with sample lead
7. **Activate** and start importing!

---

**🔥 Ready to 10x your lead generation ROI?**

The Lead Import Integration turns your ad spend into instant, qualified leads delivered directly to your DataCSV account. No more manual exports, CSV downloads, or lead delays.

**Start importing leads in under 5 minutes!** 🚀
