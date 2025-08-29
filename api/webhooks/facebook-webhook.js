import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Facebook Lead Ads Webhook Handler
 * Vercel Serverless Function
 */
export default async function handler(req, res) {
  const { method, body, query } = req;
  const userId = req.url.split('/').pop();

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Webhook verification for Facebook
  if (method === 'GET') {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
      console.log('Facebook webhook verified for user:', userId);
      return res.status(200).send(challenge);
    } else {
      console.error('Facebook webhook verification failed:', { mode, token, userId });
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  // Handle POST webhook data
  if (method === 'POST') {
    try {
      console.log('Facebook webhook received:', { userId, body });

      const { entry } = body;
      
      if (!entry || !entry.length) {
        return res.status(400).json({ error: 'Invalid webhook data' });
      }

      const results = [];

      for (const entryItem of entry) {
        const { changes } = entryItem;
        
        if (!changes || !changes.length) continue;

        for (const change of changes) {
          if (change.field !== 'leadgen') continue;

          const { value } = change;
          const { form_id, leadgen_id, page_id } = value;

          console.log('Processing lead:', { form_id, leadgen_id, page_id, userId });

          try {
            // Find the import configuration for this form
            const { data: config, error } = await supabase
              .from('lead_import_configs')
              .select('*')
              .eq('campaign_id', form_id)
              .eq('campaign_source', 'facebook')
              .eq('user_id', userId)
              .eq('active', true)
              .single();

            if (error || !config) {
              console.error('No active config found:', { form_id, userId, error });
              results.push({ leadgen_id, success: false, error: 'No active configuration' });
              continue;
            }

            // Fetch lead data from Facebook
            const leadData = await fetchFacebookLead(leadgen_id, config.api_credentials.access_token);
            
            if (!leadData) {
              console.error('Failed to fetch lead data:', leadgen_id);
              results.push({ leadgen_id, success: false, error: 'Failed to fetch lead data' });
              continue;
            }

            // Process the lead
            const result = await processIncomingLead(config, leadData, leadgen_id);
            results.push({ leadgen_id, ...result });
            
            if (!result.success) {
              console.error('Failed to process lead:', result.error);
            } else {
              console.log('Lead processed successfully:', result.leadId);
            }
          } catch (error) {
            console.error('Error processing individual lead:', error);
            results.push({ leadgen_id, success: false, error: error.message });
          }
        }
      }

      return res.status(200).json({ success: true, results });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

/**
 * Fetch lead data from Facebook Graph API
 */
async function fetchFacebookLead(leadgenId, accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${accessToken}`
    );

    if (!response.ok) {
      console.error('Facebook API error:', response.statusText);
      return null;
    }

    const leadData = await response.json();
    
    // Transform Facebook lead format to our standard format
    const transformedData = {};
    
    if (leadData.field_data) {
      for (const field of leadData.field_data) {
        const { name, values } = field;
        if (values && values.length > 0) {
          transformedData[name] = values[0];
        }
      }
    }

    return transformedData;
  } catch (error) {
    console.error('Error fetching Facebook lead:', error);
    return null;
  }
}

/**
 * Process incoming lead
 */
async function processIncomingLead(config, leadData, sourceLeadId) {
  try {
    // Check user balance
    const balance = await getUserBalance(config.user_id);
    if (balance.balance_cents < config.pricing.cost_per_lead_cents) {
      // Try auto-recharge if enabled
      if (config.pricing.auto_recharge && config.pricing.recharge_amount_cents) {
        const rechargeSuccess = await attemptAutoRecharge(config.user_id, config.pricing.recharge_amount_cents);
        if (!rechargeSuccess) {
          return { success: false, error: 'Insufficient balance and auto-recharge failed' };
        }
      } else {
        return { success: false, error: 'Insufficient balance' };
      }
    }

    // Map lead data using configuration
    const mappedLeadData = mapLeadData(leadData, config.lead_mapping);
    
    // Calculate quality score
    const qualityScore = calculateQualityScore(mappedLeadData);
    
    // Check quality threshold
    if (config.filters.quality_score_min && qualityScore < config.filters.quality_score_min) {
      return { success: false, error: 'Lead quality below threshold' };
    }

    // Create imported lead record
    const { data: importedLead, error: leadError } = await supabase
      .from('imported_leads')
      .insert({
        user_id: config.user_id,
        campaign_id: config.campaign_id,
        source_platform: config.campaign_source,
        source_lead_id: sourceLeadId,
        lead_data: mappedLeadData,
        quality_score: qualityScore,
        cost_cents: config.pricing.cost_per_lead_cents,
        imported_at: new Date().toISOString(),
        status: 'pending'
      })
      .select()
      .single();

    if (leadError) {
      throw new Error(`Failed to create lead record: ${leadError.message}`);
    }

    // Deduct balance
    await deductUserBalance(config.user_id, config.pricing.cost_per_lead_cents, importedLead.id);

    // Update lead status to delivered
    await supabase
      .from('imported_leads')
      .update({ status: 'delivered' })
      .eq('id', importedLead.id);

    // Send notification
    await sendLeadNotification(config.user_id, importedLead);

    return { success: true, leadId: importedLead.id };

  } catch (error) {
    console.error('Error processing incoming lead:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user balance
 */
async function getUserBalance(userId) {
  const { data, error } = await supabase
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
    return newBalance;
  }

  return data;
}

/**
 * Deduct user balance
 */
async function deductUserBalance(userId, amountCents, leadId) {
  const { error } = await supabase.rpc('deduct_balance', {
    p_user_id: userId,
    p_amount_cents: amountCents,
    p_lead_id: leadId
  });

  if (error) {
    throw new Error(`Failed to deduct balance: ${error.message}`);
  }
}

/**
 * Send lead notification
 */
async function sendLeadNotification(userId, lead) {
  try {
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'new_lead',
        title: 'New Lead Imported',
        message: `New Facebook lead imported: ${lead.lead_data.first_name} ${lead.lead_data.last_name}`,
        data: {
          lead_id: lead.id,
          source: lead.source_platform,
          cost: lead.cost_cents
        }
      });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

/**
 * Attempt auto-recharge
 */
async function attemptAutoRecharge(userId, amountCents) {
  // This would integrate with your Stripe auto-recharge logic
  // For now, return false to indicate auto-recharge is not available
  return false;
}

/**
 * Map lead data
 */
function mapLeadData(sourceData, mapping) {
  const mappedData = {};
  
  for (const [targetField, sourceField] of Object.entries(mapping)) {
    const value = getNestedValue(sourceData, sourceField);
    if (value !== undefined) {
      mappedData[targetField] = value;
    }
  }

  return mappedData;
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
  if (leadData.address && leadData.address.city && leadData.address.state) {
    score += 15;
  }

  // Additional demographics (10 points)
  if (leadData.demographics && Object.keys(leadData.demographics).length > 2) {
    score += 10;
  }

  return Math.min(score, 100);
}

// Utility functions
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}
