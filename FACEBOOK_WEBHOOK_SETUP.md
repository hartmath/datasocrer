# 🔗 Facebook Lead Ads Webhook Setup Guide

## Prerequisites

Before setting up the Facebook webhook integration, ensure you have:

1. **Facebook Developer Account** with app access
2. **Facebook Business Manager** access
3. **DataCSV Platform** deployed with SSL certificate
4. **Database migrations** applied for lead import system

## Step 1: Facebook App Configuration

### Create Facebook App
```bash
# Go to https://developers.facebook.com/apps/
# Click "Create App" → "Business" → "Continue"
# App Name: "DataCSV Lead Import"
# App Purpose: "Manage business data"
```

### Add Webhooks Product
```bash
# In your app dashboard:
# Products → Add Product → Webhooks → Set Up
```

### Configure Webhook Endpoint
```bash
# Callback URL: https://your-domain.com/api/webhooks/leads/facebook/{user_id}
# Verify Token: your_custom_verify_token (save this in env vars)
# Subscription Fields: leadgen
```

## Step 2: Environment Configuration

### Add to .env file
```env
# Facebook App Configuration
VITE_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_VERIFY_TOKEN=your_custom_verify_token

# Webhook Security  
WEBHOOK_SECRET_KEY=your_webhook_secret_key
```

### Add to Supabase Environment
```sql
-- Add these to your Supabase project settings
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_VERIFY_TOKEN=your_custom_verify_token
```

## Step 3: Deploy Webhook Endpoint

### Serverless Function (Vercel)
```javascript
// api/webhooks/leads/facebook/[userId].js
import { handleFacebookWebhook } from '../../../../src/api/webhooks/leads';

export default async function handler(req, res) {
  req.params = { userId: req.query.userId };
  return await handleFacebookWebhook(req, res);
}
```

### Express.js Route
```javascript
// server.js
app.use('/api/webhooks/leads/facebook/:userId', 
  rateLimitWebhook(),
  logWebhookRequest,
  handleFacebookWebhook
);
```

### Next.js API Route
```javascript
// pages/api/webhooks/leads/facebook/[userId].js
import { handleFacebookWebhook } from '../../../../../src/api/webhooks/leads';

export default async function handler(req, res) {
  req.params = { userId: req.query.userId };
  return await handleFacebookWebhook(req, res);
}
```

## Step 4: Facebook Page Subscription

### Subscribe Page to App
```javascript
// Use Facebook Graph API
const subscribePageToApp = async (pageId, accessToken) => {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscribed_fields: ['leadgen'],
        access_token: accessToken
      })
    }
  );
  
  return response.ok;
};
```

### Get Page Access Token
```javascript
// Exchange user token for page token
const getPageAccessToken = async (pageId, userAccessToken) => {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}?fields=access_token&access_token=${userAccessToken}`
  );
  
  const data = await response.json();
  return data.access_token;
};
```

## Step 5: Lead Form Configuration

### Create Lead Form
```bash
# In Facebook Ads Manager:
# 1. Go to "Lead Ads" → "Forms Library" 
# 2. Click "Create" → "New Form"
# 3. Add fields: first_name, last_name, email, phone_number
# 4. Configure privacy policy and thank you screen
# 5. Save form and note the Form ID
```

### Test Lead Form
```bash
# 1. Create test ad campaign using your lead form
# 2. Submit test lead through Facebook's Lead Testing tool
# 3. Verify webhook receives lead data
# 4. Check DataCSV dashboard for imported lead
```

## Step 6: User Setup Flow

### Client Onboarding Process
```typescript
// In DataCSV Lead Import Dashboard
const setupFacebookIntegration = async () => {
  // 1. User provides Facebook credentials
  const credentials = {
    page_id: "123456789",
    access_token: "user_page_access_token",
    form_id: "form_123456789"
  };
  
  // 2. Verify credentials with Facebook API
  const isValid = await verifyFacebookCredentials(credentials);
  
  // 3. Create import configuration
  const config = await createLeadImportConfig({
    user_id: user.id,
    campaign_source: 'facebook',
    campaign_id: credentials.form_id,
    campaign_name: `Facebook Form ${credentials.form_id}`,
    api_credentials: credentials,
    pricing: {
      cost_per_lead_cents: 500, // $5.00 per lead
      auto_recharge: true,
      recharge_amount_cents: 50000 // $500
    },
    filters: {
      quality_score_min: 60, // Minimum 60% quality
      geo_restrictions: ['US', 'CA'] // US and Canada only
    }
  });
  
  // 4. Subscribe to webhook
  await subscribeFacebookWebhook(
    credentials.page_id, 
    config.webhook_url, 
    credentials.access_token
  );
  
  return config;
};
```

## Step 7: Testing & Validation

### Webhook Testing
```bash
# Use Facebook's Webhook Testing Tool
# URL: https://developers.facebook.com/tools/lead-ads-testing/

# Test payload structure:
{
  "entry": [{
    "id": "page_id",
    "time": 1234567890,
    "changes": [{
      "field": "leadgen",
      "value": {
        "form_id": "form_123",
        "leadgen_id": "lead_123",
        "created_time": 1234567890,
        "page_id": "page_123",
        "adgroup_id": "ad_123"
      }
    }]
  }]
}
```

### Manual Testing
```bash
# 1. Create test ad with lead form
# 2. Submit lead through mobile/desktop
# 3. Check webhook logs for successful processing
# 4. Verify lead appears in DataCSV dashboard
# 5. Confirm balance was deducted correctly
```

## Step 8: Monitoring & Troubleshooting

### Common Issues

#### Webhook Not Receiving Data
```bash
# Check 1: Verify webhook URL is accessible
curl -X GET "https://your-domain.com/api/webhooks/leads/facebook/test?hub.mode=subscribe&hub.verify_token=your_token&hub.challenge=test"

# Check 2: Verify page subscription
curl -X GET "https://graph.facebook.com/v18.0/PAGE_ID/subscribed_apps?access_token=PAGE_ACCESS_TOKEN"

# Check 3: Check Facebook app webhook logs
# Go to App Dashboard → Webhooks → Recent Deliveries
```

#### Lead Processing Failures
```bash
# Check database logs
SELECT * FROM webhook_logs 
WHERE path LIKE '/api/webhooks/leads/facebook%' 
AND status_code != 200 
ORDER BY created_at DESC LIMIT 10;

# Check user balance
SELECT * FROM user_balances WHERE user_id = 'user_id';

# Check import configuration
SELECT * FROM lead_import_configs 
WHERE campaign_source = 'facebook' 
AND active = true;
```

#### Quality Score Issues
```typescript
// Debug quality scoring
const debugQualityScore = (leadData: any) => {
  console.log('Lead data:', leadData);
  console.log('Email valid:', isValidEmail(leadData.email));
  console.log('Phone valid:', isValidPhone(leadData.phone));
  console.log('Name complete:', !!(leadData.first_name && leadData.last_name));
  console.log('Address complete:', !!(leadData.city && leadData.state));
  
  const score = calculateQualityScore(leadData);
  console.log('Final quality score:', score);
  return score;
};
```

## Step 9: Production Deployment

### SSL Certificate
```bash
# Ensure your webhook endpoint has valid SSL
# Facebook requires HTTPS for all webhook URLs
# Use Let's Encrypt, Cloudflare, or your hosting provider
```

### Rate Limiting
```javascript
// Implement rate limiting for webhook endpoints
app.use('/api/webhooks/leads/facebook', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many webhook requests'
}));
```

### Error Handling
```javascript
// Implement comprehensive error handling
const handleWebhookError = (error, req, res) => {
  console.error('Webhook error:', error);
  
  // Log to monitoring service (Sentry, LogRocket, etc.)
  logger.error('Facebook webhook failed', {
    error: error.message,
    userId: req.params.userId,
    payload: req.body
  });
  
  // Return success to Facebook to prevent retries for permanent errors
  if (error.type === 'PERMANENT') {
    return res.status(200).json({ received: true });
  }
  
  // Return error for temporary issues to trigger Facebook retry
  return res.status(500).json({ error: 'Temporary processing error' });
};
```

### Monitoring Dashboard
```sql
-- Create monitoring views
CREATE VIEW facebook_webhook_stats AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status_code = 200) as successful_requests,
  COUNT(*) FILTER (WHERE status_code != 200) as failed_requests,
  AVG(duration_ms) as avg_duration_ms
FROM webhook_logs 
WHERE path LIKE '/api/webhooks/leads/facebook%'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;
```

## 🎉 Congratulations!

Your Facebook Lead Ads integration is now live! Leads will automatically flow from your Facebook campaigns into DataCSV accounts with real-time processing and balance deduction.

### Next Steps:
1. **Monitor** webhook performance and lead quality
2. **Optimize** quality filters based on client feedback  
3. **Scale** to additional Facebook pages and forms
4. **Add** Google Ads and LinkedIn integrations
5. **Implement** advanced analytics and reporting

---

**Need help?** Contact our integration team at tech@datacsv.com for personalized setup assistance! 🚀
