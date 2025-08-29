import { supabase } from './supabase';

export interface LeadImportConfig {
  id: string;
  user_id: string;
  campaign_source: 'facebook' | 'google' | 'linkedin' | 'twitter' | 'custom';
  campaign_id: string;
  campaign_name: string;
  webhook_url: string;
  api_credentials: {
    access_token?: string;
    app_id?: string;
    app_secret?: string;
    pixel_id?: string;
  };
  lead_mapping: {
    [key: string]: string; // Maps platform fields to our standard fields
  };
  pricing: {
    cost_per_lead_cents: number;
    minimum_balance_cents: number;
    auto_recharge: boolean;
    recharge_amount_cents?: number;
  };
  filters: {
    quality_score_min?: number;
    geo_restrictions?: string[];
    demographic_filters?: any;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImportedLead {
  id: string;
  user_id: string;
  campaign_id: string;
  source_platform: string;
  source_lead_id: string;
  lead_data: {
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
    address?: any;
    demographics?: any;
    interests?: string[];
    custom_fields?: any;
  };
  quality_score: number;
  cost_cents: number;
  imported_at: string;
  status: 'pending' | 'delivered' | 'failed' | 'refunded';
}

export interface UserBalance {
  id: string;
  user_id: string;
  balance_cents: number;
  reserved_cents: number; // For pending transactions
  last_recharge_at?: string;
  auto_recharge_enabled: boolean;
  recharge_threshold_cents: number;
  recharge_amount_cents: number;
  created_at: string;
  updated_at: string;
}

/**
 * Set up lead import configuration for a user
 */
export const createLeadImportConfig = async (config: Omit<LeadImportConfig, 'id' | 'created_at' | 'updated_at'>): Promise<LeadImportConfig> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('lead_import_configs')
      .insert({
        ...config,
        webhook_url: generateWebhookUrl(config.user_id, config.campaign_source),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create lead import config: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating lead import config:', error);
    throw error;
  }
};

/**
 * Generate webhook URL for platform integration
 */
export const generateWebhookUrl = (userId: string, platform: string): string => {
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://your-domain.com';
  return `${baseUrl}/api/webhooks/leads/${platform}/${userId}`;
};

/**
 * Process incoming lead from webhook
 */
export const processIncomingLead = async (
  configId: string, 
  leadData: any, 
  sourceLeadId: string
): Promise<{ success: boolean; leadId?: string; error?: string }> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    // Get import configuration
    const { data: config, error: configError } = await supabase
      .from('lead_import_configs')
      .select('*')
      .eq('id', configId)
      .eq('active', true)
      .single();

    if (configError || !config) {
      throw new Error('Invalid or inactive import configuration');
    }

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

    // Apply geo restrictions
    if (config.filters.geo_restrictions && config.filters.geo_restrictions.length > 0) {
      const leadLocation = extractLocation(mappedLeadData);
      if (leadLocation && !config.filters.geo_restrictions.includes(leadLocation)) {
        return { success: false, error: 'Lead location not in allowed regions' };
      }
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

    // Send real-time notification to user
    await sendLeadNotification(config.user_id, importedLead);

    return { success: true, leadId: importedLead.id };

  } catch (error: any) {
    console.error('Error processing incoming lead:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Map platform-specific lead data to standardized format
 */
export const mapLeadData = (sourceData: any, mapping: { [key: string]: string }): any => {
  const mappedData: any = {};
  
  for (const [targetField, sourceField] of Object.entries(mapping)) {
    const value = getNestedValue(sourceData, sourceField);
    if (value !== undefined) {
      mappedData[targetField] = value;
    }
  }

  return mappedData;
};

/**
 * Calculate lead quality score based on completeness and validity
 */
export const calculateQualityScore = (leadData: any): number => {
  let score = 0;
  const maxScore = 100;

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

  return Math.min(score, maxScore);
};

/**
 * Get user balance information
 */
export const getUserBalance = async (userId: string): Promise<UserBalance> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('user_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // Create initial balance if doesn't exist
      if (error.code === 'PGRST116') {
        return await createUserBalance(userId);
      }
      throw new Error(`Failed to get user balance: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error getting user balance:', error);
    throw error;
  }
};

/**
 * Create initial user balance
 */
export const createUserBalance = async (userId: string): Promise<UserBalance> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('user_balances')
      .insert({
        user_id: userId,
        balance_cents: 0,
        reserved_cents: 0,
        auto_recharge_enabled: false,
        recharge_threshold_cents: 10000, // $100
        recharge_amount_cents: 50000, // $500
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user balance: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating user balance:', error);
    throw error;
  }
};

/**
 * Deduct balance for lead import
 */
export const deductUserBalance = async (userId: string, amountCents: number, leadId: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    // Update balance atomically
    const { error } = await supabase.rpc('deduct_balance', {
      p_user_id: userId,
      p_amount_cents: amountCents,
      p_lead_id: leadId
    });

    if (error) {
      throw new Error(`Failed to deduct balance: ${error.message}`);
    }

    // Record transaction
    await supabase
      .from('balance_transactions')
      .insert({
        user_id: userId,
        type: 'deduction',
        amount_cents: -amountCents,
        description: `Lead import charge`,
        reference_id: leadId,
        created_at: new Date().toISOString()
      });

  } catch (error) {
    console.error('Error deducting user balance:', error);
    throw error;
  }
};

/**
 * Attempt auto-recharge via Stripe
 */
export const attemptAutoRecharge = async (userId: string, amountCents: number): Promise<boolean> => {
  try {
    // Get user's saved payment method
    const { data: paymentMethods, error } = await supabase
      .from('saved_payment_methods')
      .select('*')
      .eq('user_id', userId)
      .eq('default', true)
      .single();

    if (error || !paymentMethods) {
      return false;
    }

    // Create payment intent for auto-recharge
    const response = await fetch('/api/auto-recharge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        amount_cents: amountCents,
        payment_method_id: paymentMethods.stripe_payment_method_id
      })
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    
    if (result.success) {
      // Add to balance
      await addUserBalance(userId, amountCents, 'auto_recharge', result.payment_intent_id);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Auto-recharge failed:', error);
    return false;
  }
};

/**
 * Add balance to user account
 */
export const addUserBalance = async (userId: string, amountCents: number, type: string, referenceId?: string): Promise<void> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    // Update balance
    const { error } = await supabase.rpc('add_balance', {
      p_user_id: userId,
      p_amount_cents: amountCents
    });

    if (error) {
      throw new Error(`Failed to add balance: ${error.message}`);
    }

    // Record transaction
    await supabase
      .from('balance_transactions')
      .insert({
        user_id: userId,
        type: type,
        amount_cents: amountCents,
        description: `Balance ${type}`,
        reference_id: referenceId,
        created_at: new Date().toISOString()
      });

  } catch (error) {
    console.error('Error adding user balance:', error);
    throw error;
  }
};

/**
 * Send real-time notification for new lead
 */
export const sendLeadNotification = async (userId: string, lead: ImportedLead): Promise<void> => {
  if (!supabase) return;

  try {
    // Insert notification
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'new_lead',
        title: 'New Lead Imported',
        message: `New ${lead.source_platform} lead imported: ${lead.lead_data.first_name} ${lead.lead_data.last_name}`,
        data: {
          lead_id: lead.id,
          source: lead.source_platform,
          cost: lead.cost_cents
        },
        created_at: new Date().toISOString()
      });

    // Send real-time update via Supabase realtime
    await supabase
      .channel('user-notifications')
      .send({
        type: 'broadcast',
        event: 'new_lead',
        payload: {
          user_id: userId,
          lead: lead
        }
      });

  } catch (error) {
    console.error('Error sending lead notification:', error);
  }
};

/**
 * Facebook Lead Ads integration
 */
export const setupFacebookLeadAds = async (userId: string, config: {
  page_id: string;
  form_id: string;
  access_token: string;
  cost_per_lead_cents: number;
}): Promise<LeadImportConfig> => {
  try {
    // Verify Facebook credentials
    const verifyResponse = await fetch(`https://graph.facebook.com/v18.0/${config.page_id}?access_token=${config.access_token}`);
    if (!verifyResponse.ok) {
      throw new Error('Invalid Facebook credentials');
    }

    // Create import configuration
    const importConfig = await createLeadImportConfig({
      user_id: userId,
      campaign_source: 'facebook',
      campaign_id: config.form_id,
      campaign_name: `Facebook Lead Form ${config.form_id}`,
      webhook_url: '',
      api_credentials: {
        access_token: config.access_token,
        app_id: import.meta.env.VITE_FACEBOOK_APP_ID
      },
      lead_mapping: {
        'first_name': 'first_name',
        'last_name': 'last_name',
        'email': 'email',
        'phone': 'phone_number',
        'city': 'city',
        'state': 'state',
        'zip_code': 'zip_code'
      },
      pricing: {
        cost_per_lead_cents: config.cost_per_lead_cents,
        minimum_balance_cents: config.cost_per_lead_cents * 10,
        auto_recharge: false
      },
      filters: {
        quality_score_min: 50
      },
      active: true
    });

    // Subscribe to Facebook webhooks
    await subscribeFacebookWebhook(config.page_id, importConfig.webhook_url, config.access_token);

    return importConfig;
  } catch (error) {
    console.error('Error setting up Facebook Lead Ads:', error);
    throw error;
  }
};

/**
 * Subscribe to Facebook webhook
 */
export const subscribeFacebookWebhook = async (pageId: string, webhookUrl: string, accessToken: string): Promise<void> => {
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/subscribed_apps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscribed_fields: ['leadgen'],
        access_token: accessToken
      })
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to Facebook webhook');
    }
  } catch (error) {
    console.error('Error subscribing to Facebook webhook:', error);
    throw error;
  }
};

// Utility functions
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current && current[key], obj);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

const extractLocation = (leadData: any): string | null => {
  return leadData.address?.state || leadData.state || null;
};

