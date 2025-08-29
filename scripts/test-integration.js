#!/usr/bin/env node

/**
 * Integration Testing Script for Lead Import System
 * 
 * Tests:
 * - Database operations
 * - Webhook processing
 * - Balance management
 * - Quality scoring
 * - Notification system
 */

import { createClient } from '@supabase/supabase-js';

const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  appUrl: process.env.VITE_APP_URL || 'http://localhost:5173',
  testUserId: process.env.TEST_USER_ID || null
};

const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);

async function main() {
  console.log('🧪 Starting Lead Import Integration Tests...\n');

  try {
    // Create test user if needed
    const testUserId = await setupTestUser();
    console.log(`📝 Using test user ID: ${testUserId}\n`);

    // Run test suite
    await runTestSuite(testUserId);

    console.log('\n✅ All integration tests passed!');
    console.log('\n📊 Test Summary:');
    console.log('- Database operations: ✅ Passed');
    console.log('- Balance management: ✅ Passed');
    console.log('- Quality scoring: ✅ Passed');
    console.log('- Webhook processing: ✅ Passed');
    console.log('- Notification system: ✅ Passed');

  } catch (error) {
    console.error('❌ Integration tests failed:', error.message);
    process.exit(1);
  }
}

/**
 * Setup test user
 */
async function setupTestUser() {
  if (config.testUserId) {
    return config.testUserId;
  }

  // Create test profile
  const testUserId = `test-user-${Date.now()}`;
  
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: testUserId,
      email: 'test@datacsv.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'user'
    });

  if (error && error.code !== '23505') { // Ignore duplicate key error
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  return testUserId;
}

/**
 * Run complete test suite
 */
async function runTestSuite(testUserId) {
  console.log('🔧 Test 1: Database Operations');
  await testDatabaseOperations(testUserId);
  console.log('✅ Database operations test passed\n');

  console.log('💰 Test 2: Balance Management');
  await testBalanceManagement(testUserId);
  console.log('✅ Balance management test passed\n');

  console.log('📊 Test 3: Quality Scoring');
  await testQualityScoring();
  console.log('✅ Quality scoring test passed\n');

  console.log('🔗 Test 4: Webhook Processing');
  await testWebhookProcessing(testUserId);
  console.log('✅ Webhook processing test passed\n');

  console.log('🔔 Test 5: Notification System');
  await testNotificationSystem(testUserId);
  console.log('✅ Notification system test passed\n');
}

/**
 * Test database operations
 */
async function testDatabaseOperations(testUserId) {
  // Test user balance creation
  const { data: balance, error: balanceError } = await supabase
    .from('user_balances')
    .insert({
      user_id: testUserId,
      balance_cents: 10000, // $100
      auto_recharge_enabled: true,
      recharge_threshold_cents: 5000,
      recharge_amount_cents: 20000
    })
    .select()
    .single();

  if (balanceError && balanceError.code !== '23505') {
    throw new Error(`Balance creation failed: ${balanceError.message}`);
  }

  console.log('   ✓ User balance created');

  // Test lead import config creation
  const { data: config, error: configError } = await supabase
    .from('lead_import_configs')
    .insert({
      user_id: testUserId,
      campaign_source: 'facebook',
      campaign_id: 'test_campaign_123',
      campaign_name: 'Test Facebook Campaign',
      webhook_url: `${config.appUrl}/api/webhooks/leads/facebook/${testUserId}`,
      api_credentials: {
        access_token: 'test_token',
        page_id: 'test_page_123'
      },
      lead_mapping: {
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'email',
        phone: 'phone_number'
      },
      pricing: {
        cost_per_lead_cents: 500,
        auto_recharge: true
      },
      filters: {
        quality_score_min: 60
      },
      active: true
    })
    .select()
    .single();

  if (configError) {
    throw new Error(`Config creation failed: ${configError.message}`);
  }

  console.log('   ✓ Lead import config created');

  // Test imported lead creation
  const { data: lead, error: leadError } = await supabase
    .from('imported_leads')
    .insert({
      user_id: testUserId,
      campaign_id: config.campaign_id,
      source_platform: 'facebook',
      source_lead_id: 'test_lead_123',
      lead_data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890'
      },
      quality_score: 85,
      cost_cents: 500,
      status: 'delivered'
    })
    .select()
    .single();

  if (leadError) {
    throw new Error(`Lead creation failed: ${leadError.message}`);
  }

  console.log('   ✓ Imported lead created');
}

/**
 * Test balance management
 */
async function testBalanceManagement(testUserId) {
  // Test balance deduction
  const { error: deductError } = await supabase.rpc('deduct_balance', {
    p_user_id: testUserId,
    p_amount_cents: 500,
    p_lead_id: 'test_lead_123'
  });

  if (deductError) {
    throw new Error(`Balance deduction failed: ${deductError.message}`);
  }

  console.log('   ✓ Balance deduction successful');

  // Test balance addition
  const { error: addError } = await supabase.rpc('add_balance', {
    p_user_id: testUserId,
    p_amount_cents: 2000
  });

  if (addError) {
    throw new Error(`Balance addition failed: ${addError.message}`);
  }

  console.log('   ✓ Balance addition successful');

  // Verify transaction history
  const { data: transactions, error: transError } = await supabase
    .from('balance_transactions')
    .select('*')
    .eq('user_id', testUserId)
    .order('created_at', { ascending: false });

  if (transError) {
    throw new Error(`Transaction history query failed: ${transError.message}`);
  }

  if (!transactions || transactions.length === 0) {
    throw new Error('No transaction history found');
  }

  console.log(`   ✓ Transaction history verified (${transactions.length} transactions)`);
}

/**
 * Test quality scoring
 */
async function testQualityScoring() {
  const testCases = [
    {
      name: 'Complete lead',
      data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        city: 'New York',
        state: 'NY',
        demographics: { age: 30, income: '75000' }
      },
      expected: 100
    },
    {
      name: 'Email only',
      data: {
        email: 'test@example.com'
      },
      expected: 30
    },
    {
      name: 'Name and email',
      data: {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com'
      },
      expected: 50
    }
  ];

  for (const testCase of testCases) {
    const response = await fetch(`${config.appUrl}/api/webhooks/test-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        test_type: 'quality_score',
        lead_data: testCase.data
      })
    });

    if (!response.ok) {
      throw new Error(`Quality score test API failed: ${response.status}`);
    }

    const result = await response.json();
    const actualScore = result.results[0].quality_score;

    if (actualScore !== testCase.expected) {
      throw new Error(`Quality score mismatch for ${testCase.name}: expected ${testCase.expected}, got ${actualScore}`);
    }

    console.log(`   ✓ ${testCase.name}: ${actualScore} points`);
  }
}

/**
 * Test webhook processing
 */
async function testWebhookProcessing(testUserId) {
  // Test webhook health check
  const healthResponse = await fetch(`${config.appUrl}/api/webhooks/test-webhook`, {
    method: 'GET'
  });

  if (!healthResponse.ok) {
    throw new Error(`Webhook health check failed: ${healthResponse.status}`);
  }

  console.log('   ✓ Webhook endpoint healthy');

  // Test Facebook lead processing
  const leadResponse = await fetch(`${config.appUrl}/api/webhooks/test-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      test_type: 'facebook_lead',
      user_id: testUserId,
      lead_data: {
        first_name: 'Test',
        last_name: 'Lead',
        email: 'testlead@example.com',
        phone: '+1987654321'
      }
    })
  });

  if (!leadResponse.ok) {
    throw new Error(`Lead processing test failed: ${leadResponse.status}`);
  }

  const leadResult = await leadResponse.json();
  
  if (!leadResult.success) {
    throw new Error(`Lead processing failed: ${leadResult.error || 'Unknown error'}`);
  }

  console.log(`   ✓ Lead processed successfully (ID: ${leadResult.lead_id})`);
  console.log(`   ✓ Quality score: ${leadResult.quality_score}%`);
}

/**
 * Test notification system
 */
async function testNotificationSystem(testUserId) {
  // Test notification creation via API
  const notifResponse = await fetch(`${config.appUrl}/api/webhooks/test-webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      test_type: 'notification',
      user_id: testUserId
    })
  });

  if (!notifResponse.ok) {
    throw new Error(`Notification test API failed: ${notifResponse.status}`);
  }

  const notifResult = await notifResponse.json();
  
  if (!notifResult.success) {
    throw new Error(`Notification creation failed: ${notifResult.error}`);
  }

  console.log(`   ✓ Notification created (ID: ${notifResult.notification_id})`);

  // Verify notification in database
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', testUserId)
    .eq('type', 'test')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) {
    throw new Error(`Notification query failed: ${error.message}`);
  }

  if (!notifications || notifications.length === 0) {
    throw new Error('Test notification not found in database');
  }

  console.log('   ✓ Notification verified in database');
}

// Run tests
main().catch(console.error);
