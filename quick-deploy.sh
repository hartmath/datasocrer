#!/bin/bash

# DataCSV Lead Import - Quick Deployment Script
# This script automates the deployment process

set -e

echo "🚀 DataCSV Lead Import - Quick Deployment"
echo "========================================"

# Check if environment file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create .env file with required variables:"
    echo "   - VITE_SUPABASE_URL"
    echo "   - VITE_SUPABASE_ANON_KEY" 
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - VITE_STRIPE_PUBLISHABLE_KEY"
    echo "   - STRIPE_SECRET_KEY"
    echo "   - VITE_FACEBOOK_APP_ID"
    echo "   - FACEBOOK_VERIFY_TOKEN"
    echo "   - VITE_APP_URL"
    exit 1
fi

echo "✅ Environment file found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Test webhook endpoints (if running locally)
if [ "$1" = "local" ]; then
    echo "🧪 Testing local webhook endpoints..."
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 5
    
    # Test webhook endpoint
    if curl -s http://localhost:5173/api/webhooks/test-webhook > /dev/null; then
        echo "✅ Webhook endpoints responding"
    else
        echo "⚠️  Webhook endpoints not responding (may need Vercel deployment)"
    fi
    
    # Kill dev server
    kill $SERVER_PID 2>/dev/null || true
fi

# Deploy to Vercel (if vercel CLI is available)
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    
    # Check if project is linked
    if [ ! -f .vercel/project.json ]; then
        echo "🔗 Linking Vercel project..."
        vercel link --yes
    fi
    
    # Deploy
    vercel --prod
    
    echo "✅ Deployment completed!"
    echo "🔗 Your app is now live at: $(vercel --prod --meta)"
    
else
    echo "⚠️  Vercel CLI not found. Please install with: npm install -g vercel"
    echo "📝 Manual deployment steps:"
    echo "   1. Run: vercel login"
    echo "   2. Run: vercel --prod"
    echo "   3. Configure environment variables in Vercel dashboard"
fi

echo ""
echo "🎉 Quick Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. 🔧 Configure Facebook app webhook subscription"
echo "2. 🧪 Test lead import flow with Facebook Lead Testing Tool"  
echo "3. 💰 Add funds to user account for testing"
echo "4. 📊 Monitor webhook logs and lead processing"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: DEPLOYMENT_GUIDE.md"
echo "   - Integration Docs: LEAD_IMPORT_INTEGRATION.md"
echo "   - Facebook Setup: FACEBOOK_WEBHOOK_SETUP.md"
echo ""
echo "🎯 Ready to import leads automatically! 🚀"
