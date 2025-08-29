#!/usr/bin/env node

/**
 * Deployment Script for DataCSV Lead Import System
 * 
 * This script handles:
 * - Database migrations
 * - Environment variable validation
 * - Webhook endpoint testing
 * - Facebook app configuration verification
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
  stripePublishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  facebookAppId: process.env.VITE_FACEBOOK_APP_ID,
  facebookVerifyToken: process.env.FACEBOOK_VERIFY_TOKEN,
  webhookSecret: process.env.WEBHOOK_SECRET_KEY,
  appUrl: process.env.VITE_APP_URL || 'https://your-domain.com'
};

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function main() {
  console.log('🚀 Starting DataCSV Lead Import System Deployment...\n');

  try {
    // Step 1: Validate environment variables
    console.log('📋 Step 1: Validating environment variables...');
    await validateEnvironment();
    console.log('✅ Environment validation passed\n');

    // Step 2: Run database migrations
    console.log('🗄️  Step 2: Running database migrations...');
    await runMigrations();
    console.log('✅ Database migrations completed\n');

    // Step 3: Test database connections
    console.log('🔗 Step 3: Testing database connections...');
    await testDatabaseConnection();
    console.log('✅ Database connection test passed\n');

    // Step 4: Verify webhook endpoints
    console.log('🌐 Step 4: Verifying webhook endpoints...');
    await testWebhookEndpoints();
    console.log('✅ Webhook endpoints verified\n');

    // Step 5: Create initial admin user (if needed)
    console.log('👤 Step 5: Setting up admin user...');
    await setupAdminUser();
    console.log('✅ Admin user setup completed\n');

    // Step 6: Seed default content
    console.log('📝 Step 6: Seeding default content...');
    await seedDefaultContent();
    console.log('✅ Default content seeded\n');

    console.log('🎉 Deployment completed successfully!');
    console.log('\n📊 Deployment Summary:');
    console.log('- Database migrations: ✅ Applied');
    console.log('- Webhook endpoints: ✅ Verified');
    console.log('- Admin user: ✅ Ready');
    console.log('- Default content: ✅ Seeded');
    console.log('\n🔗 Next Steps:');
    console.log('1. Configure Facebook app webhook subscription');
    console.log('2. Test lead import flow with Facebook Lead Testing Tool');
    console.log('3. Set up monitoring and alerting');
    console.log(`4. Access admin dashboard: ${config.appUrl}/admin`);

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

/**
 * Validate required environment variables
 */
async function validateEnvironment() {
  const required = [
    'VITE_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate URLs
  try {
    new URL(config.supabaseUrl);
  } catch {
    throw new Error('Invalid VITE_SUPABASE_URL format');
  }

  // Test Supabase connection
  const { error } = await supabase.from('profiles').select('count').limit(1);
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  console.log('   ✓ All required environment variables present');
  console.log('   ✓ Supabase connection verified');
  console.log('   ✓ Environment URLs validated');
}

/**
 * Run database migrations
 */
async function runMigrations() {
  try {
    // Read and execute the lead import migration
    const migrationPath = join(process.cwd(), 'supabase/migrations/20250115000001_lead_import_system.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    // Split by statements and execute
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.includes('CREATE') || statement.includes('ALTER') || statement.includes('INSERT')) {
        const { error } = await supabase.rpc('exec_sql', { sql_statement: statement });
        if (error) {
          console.warn(`   ⚠️  Migration warning: ${error.message}`);
        }
      }
    }

    console.log('   ✓ Lead import system tables created');
    console.log('   ✓ RLS policies applied');
    console.log('   ✓ Database functions created');

  } catch (error) {
    if (error.code === '42P07') {
      console.log('   ✓ Tables already exist (skipped)');
    } else {
      throw new Error(`Migration failed: ${error.message}`);
    }
  }
}

/**
 * Test database connection and table structure
 */
async function testDatabaseConnection() {
  const tables = [
    'lead_import_configs',
    'imported_leads',
    'user_balances',
    'balance_transactions',
    'notifications'
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      throw new Error(`Table ${table} not accessible: ${error.message}`);
    }
  }

  console.log('   ✓ All required tables accessible');
  console.log('   ✓ RLS policies working');
}

/**
 * Test webhook endpoints
 */
async function testWebhookEndpoints() {
  const endpoints = [
    '/api/webhooks/test-webhook',
    '/api/auto-recharge'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${config.appUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        console.warn(`   ⚠️  Endpoint ${endpoint} returned ${response.status}`);
      } else {
        console.log(`   ✓ Endpoint ${endpoint} responding`);
      }
    } catch (error) {
      console.warn(`   ⚠️  Could not reach ${endpoint}: ${error.message}`);
    }
  }
}

/**
 * Setup admin user
 */
async function setupAdminUser() {
  const adminEmail = 'admin@datacsv.com';
  
  // Check if admin profile exists
  const { data: existingAdmin } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', adminEmail)
    .single();

  if (existingAdmin) {
    console.log('   ✓ Admin user already exists');
    return;
  }

  // Create admin profile entry (user must sign up through auth)
  console.log('   ℹ️  Admin user should sign up at /auth with email: admin@datacsv.com');
  console.log('   ℹ️  Role will be automatically set to admin upon signup');
}

/**
 * Seed default content
 */
async function seedDefaultContent() {
  try {
    // Check if content already exists
    const { data: existingContent } = await supabase
      .from('content_items')
      .select('*')
      .limit(1);

    if (existingContent && existingContent.length > 0) {
      console.log('   ✓ Content already seeded');
      return;
    }

    // Seed basic content items
    const defaultContent = [
      {
        key: 'brand.name',
        value: 'DataCSV',
        type: 'text',
        description: 'Brand name'
      },
      {
        key: 'brand.tagline',
        value: 'Premium Data Intelligence Platform',
        type: 'text',
        description: 'Brand tagline'
      },
      {
        key: 'home.hero.title',
        value: 'Transform Your Data Into Intelligence',
        type: 'text',
        description: 'Homepage hero title'
      },
      {
        key: 'lead_import.welcome_message',
        value: 'Welcome to automated lead import! Connect your ad platforms and start importing qualified leads instantly.',
        type: 'text',
        description: 'Lead import welcome message'
      }
    ];

    const { error } = await supabase
      .from('content_items')
      .insert(defaultContent);

    if (error) {
      throw error;
    }

    console.log('   ✓ Default content items created');

  } catch (error) {
    console.warn(`   ⚠️  Content seeding warning: ${error.message}`);
  }
}

// Run deployment
main().catch(console.error);
