import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Test Webhook Handler
 * For testing webhook functionality without external dependencies
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      message: 'Test webhook endpoint is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  }

  if (req.method === 'POST') {
    try {
      const { test_type, user_id, lead_data } = req.body;

      console.log('Test webhook received:', { test_type, user_id, lead_data });

      switch (test_type) {
        case 'facebook_lead':
          return await testFacebookLead(user_id, lead_data, res);
        
        case 'balance_check':
          return await testBalanceCheck(user_id, res);
        
        case 'quality_score':
          return await testQualityScore(lead_data, res);
        
        case 'notification':
          return await testNotification(user_id, res);
        
        default:
          return res.status(400).json({
            error: 'Invalid test_type',
            supported_types: ['facebook_lead', 'balance_check', 'quality_score', 'notification']
          });
      }

    } catch (error) {
      console.error('Test webhook error:', error);
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Test Facebook lead processing
 */
async function testFacebookLead(userId, leadData, res) {
  try {
    // Generate test lead data if not provided
    const testLeadData = leadData || {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      city: 'New York',
      state: 'NY',
      zip_code: '10001'
    };

    // Calculate quality score
    const qualityScore = calculateQualityScore(testLeadData);

    // Check if user has active Facebook config
    const { data: config, error: configError } = await supabase
      .from('lead_import_configs')
      .select('*')
      .eq('user_id', userId)
      .eq('campaign_source', 'facebook')
      .eq('active', true)
      .limit(1)
      .single();

    if (configError) {
      return res.status(404).json({
        error: 'No active Facebook configuration found',
        user_id: userId,
        suggestion: 'Create a Facebook lead import configuration first'
      });
    }

    // Check user balance
    const { data: balance } = await supabase
      .from('user_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    const sufficientBalance = balance && balance.balance_cents >= config.pricing.cost_per_lead_cents;

    // Create test lead record
    const { data: testLead, error: leadError } = await supabase
      .from('imported_leads')
      .insert({
        user_id: userId,
        campaign_id: config.campaign_id,
        source_platform: 'facebook',
        source_lead_id: `test_${Date.now()}`,
        lead_data: testLeadData,
        quality_score: qualityScore,
        cost_cents: config.pricing.cost_per_lead_cents,
        imported_at: new Date().toISOString(),
        status: sufficientBalance ? 'delivered' : 'failed',
        metadata: { test: true }
      })
      .select()
      .single();

    if (leadError) {
      throw new Error(`Failed to create test lead: ${leadError.message}`);
    }

    // Deduct balance if sufficient
    if (sufficientBalance) {
      await supabase.rpc('deduct_balance', {
        p_user_id: userId,
        p_amount_cents: config.pricing.cost_per_lead_cents,
        p_lead_id: testLead.id
      });
    }

    return res.status(200).json({
      success: true,
      test_type: 'facebook_lead',
      lead_id: testLead.id,
      quality_score: qualityScore,
      cost_cents: config.pricing.cost_per_lead_cents,
      sufficient_balance: sufficientBalance,
      status: testLead.status,
      lead_data: testLeadData
    });

  } catch (error) {
    console.error('Test Facebook lead error:', error);
    return res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
}

/**
 * Test balance check
 */
async function testBalanceCheck(userId, res) {
  try {
    const { data: balance, error } = await supabase
      .from('user_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Create initial balance if doesn't exist
      const { data: newBalance } = await supabase
        .from('user_balances')
        .insert({
          user_id: userId,
          balance_cents: 0,
          reserved_cents: 0,
          auto_recharge_enabled: false,
          recharge_threshold_cents: 10000,
          recharge_amount_cents: 50000
        })
        .select()
        .single();

      return res.status(200).json({
        success: true,
        test_type: 'balance_check',
        balance: newBalance,
        message: 'Created new balance record'
      });
    }

    if (error) {
      throw new Error(`Balance check failed: ${error.message}`);
    }

    // Get recent transactions
    const { data: transactions } = await supabase
      .from('balance_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    return res.status(200).json({
      success: true,
      test_type: 'balance_check',
      balance: balance,
      recent_transactions: transactions || []
    });

  } catch (error) {
    console.error('Test balance check error:', error);
    return res.status(500).json({
      error: 'Balance check test failed',
      message: error.message
    });
  }
}

/**
 * Test quality score calculation
 */
async function testQualityScore(leadData, res) {
  try {
    const testCases = [
      leadData || {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        city: 'New York',
        state: 'NY'
      },
      {
        email: 'incomplete@example.com'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90210',
        demographics: { age: 25, income: '50000' }
      }
    ];

    const results = testCases.map((testCase, index) => ({
      test_case: index + 1,
      lead_data: testCase,
      quality_score: calculateQualityScore(testCase),
      breakdown: getQualityBreakdown(testCase)
    }));

    return res.status(200).json({
      success: true,
      test_type: 'quality_score',
      results: results
    });

  } catch (error) {
    console.error('Test quality score error:', error);
    return res.status(500).json({
      error: 'Quality score test failed',
      message: error.message
    });
  }
}

/**
 * Test notification system
 */
async function testNotification(userId, res) {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'test',
        title: 'Test Notification',
        message: 'This is a test notification from the webhook system',
        data: {
          test: true,
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return res.status(200).json({
      success: true,
      test_type: 'notification',
      notification_id: notification.id,
      message: 'Test notification created successfully'
    });

  } catch (error) {
    console.error('Test notification error:', error);
    return res.status(500).json({
      error: 'Notification test failed',
      message: error.message
    });
  }
}

/**
 * Calculate quality score
 */
function calculateQualityScore(leadData) {
  let score = 0;

  // Email validation (30 points)
  if (leadData.email && isValidEmail(leadData.email)) {
    score += 30;
  }

  // Phone validation (25 points)
  if (leadData.phone && isValidPhone(leadData.phone)) {
    score += 25;
  }

  // Name completeness (20 points)
  if (leadData.first_name && leadData.last_name) {
    score += 20;
  } else if (leadData.first_name || leadData.last_name) {
    score += 10;
  }

  // Address completeness (15 points)
  if (leadData.city && leadData.state) {
    score += 15;
  }

  // Additional demographics (10 points)
  if (leadData.demographics && Object.keys(leadData.demographics).length > 0) {
    score += 10;
  }

  return Math.min(score, 100);
}

/**
 * Get quality breakdown for debugging
 */
function getQualityBreakdown(leadData) {
  return {
    email: {
      present: !!leadData.email,
      valid: leadData.email ? isValidEmail(leadData.email) : false,
      points: (leadData.email && isValidEmail(leadData.email)) ? 30 : 0
    },
    phone: {
      present: !!leadData.phone,
      valid: leadData.phone ? isValidPhone(leadData.phone) : false,
      points: (leadData.phone && isValidPhone(leadData.phone)) ? 25 : 0
    },
    name: {
      first_name: !!leadData.first_name,
      last_name: !!leadData.last_name,
      points: (leadData.first_name && leadData.last_name) ? 20 : 
              (leadData.first_name || leadData.last_name) ? 10 : 0
    },
    address: {
      city: !!leadData.city,
      state: !!leadData.state,
      points: (leadData.city && leadData.state) ? 15 : 0
    },
    demographics: {
      present: !!(leadData.demographics && Object.keys(leadData.demographics).length > 0),
      points: (leadData.demographics && Object.keys(leadData.demographics).length > 0) ? 10 : 0
    }
  };
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}
