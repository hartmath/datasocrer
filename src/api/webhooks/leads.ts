import { processIncomingLead } from '../../lib/leadImport';
import { supabase } from '../../lib/supabase';

/**
 * Webhook endpoint for Facebook Lead Ads
 * This would be deployed as a serverless function or API endpoint
 */
export const handleFacebookWebhook = async (req: any, res: any) => {
  const { method, body, query } = req;

  // Webhook verification for Facebook
  if (method === 'GET') {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
      console.log('Facebook webhook verified');
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send('Forbidden');
    }
  }

  // Handle POST webhook data
  if (method === 'POST') {
    try {
      const { entry } = body;
      
      if (!entry || !entry.length) {
        return res.status(400).json({ error: 'Invalid webhook data' });
      }

      for (const entryItem of entry) {
        const { changes } = entryItem;
        
        if (!changes || !changes.length) continue;

        for (const change of changes) {
          if (change.field !== 'leadgen') continue;

          const { value } = change;
          const { form_id, leadgen_id, page_id } = value;

          // Find the import configuration for this form
          const { data: config, error } = await supabase
            .from('lead_import_configs')
            .select('*')
            .eq('campaign_id', form_id)
            .eq('campaign_source', 'facebook')
            .eq('active', true)
            .single();

          if (error || !config) {
            console.error('No active config found for form:', form_id);
            continue;
          }

          // Fetch lead data from Facebook
          const leadData = await fetchFacebookLead(leadgen_id, config.api_credentials.access_token);
          
          if (!leadData) {
            console.error('Failed to fetch lead data for:', leadgen_id);
            continue;
          }

          // Process the lead
          const result = await processIncomingLead(config.id, leadData, leadgen_id);
          
          if (!result.success) {
            console.error('Failed to process lead:', result.error);
          } else {
            console.log('Lead processed successfully:', result.leadId);
          }
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

/**
 * Fetch lead data from Facebook Graph API
 */
const fetchFacebookLead = async (leadgenId: string, accessToken: string): Promise<any | null> => {
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
    const transformedData: any = {};
    
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
};

/**
 * Webhook endpoint for Google Ads (future implementation)
 */
export const handleGoogleWebhook = async (req: any, res: any) => {
  // Implementation for Google Ads webhook
  return res.status(501).json({ error: 'Google Ads integration coming soon' });
};

/**
 * Webhook endpoint for LinkedIn Ads (future implementation)
 */
export const handleLinkedInWebhook = async (req: any, res: any) => {
  // Implementation for LinkedIn Ads webhook
  return res.status(501).json({ error: 'LinkedIn Ads integration coming soon' });
};

/**
 * Generic webhook endpoint for custom integrations
 */
export const handleCustomWebhook = async (req: any, res: any) => {
  const { method, body, params } = req;
  const { userId, configId } = params;

  if (method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify webhook authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the webhook token (you'd implement this based on your security requirements)
    const isValidToken = await verifyWebhookToken(token, userId);
    if (!isValidToken) {
      return res.status(401).json({ error: 'Invalid webhook token' });
    }

    // Get the import configuration
    const { data: config, error } = await supabase
      .from('lead_import_configs')
      .select('*')
      .eq('id', configId)
      .eq('user_id', userId)
      .eq('active', true)
      .single();

    if (error || !config) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    // Extract lead data from the webhook payload
    const leadData = extractLeadFromPayload(body, config.lead_mapping);
    
    // Generate a unique source lead ID
    const sourceLeadId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Process the lead
    const result = await processIncomingLead(configId, leadData, sourceLeadId);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ 
      success: true, 
      leadId: result.leadId,
      message: 'Lead processed successfully'
    });

  } catch (error) {
    console.error('Custom webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Extract lead data from custom webhook payload
 */
const extractLeadFromPayload = (payload: any, mapping: any): any => {
  const leadData: any = {};
  
  for (const [targetField, sourcePath] of Object.entries(mapping)) {
    const value = getNestedValue(payload, sourcePath as string);
    if (value !== undefined) {
      leadData[targetField] = value;
    }
  }
  
  return leadData;
};

/**
 * Verify webhook token for custom integrations
 */
const verifyWebhookToken = async (token: string, userId: string): Promise<boolean> => {
  try {
    // In a real implementation, you'd verify the JWT token or API key
    // For this example, we'll do a simple database lookup
    const { data, error } = await supabase
      .from('webhook_tokens')
      .select('*')
      .eq('token', token)
      .eq('user_id', userId)
      .eq('active', true)
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

/**
 * Get nested value from object using dot notation
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current && current[key], obj);
};

/**
 * Rate limiting middleware for webhooks
 */
export const rateLimitWebhook = (maxRequests: number = 100, windowMs: number = 60000) => {
  const requests = new Map();
  
  return (req: any, res: any, next: any) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    const clientRequests = requests.get(clientIp) || [];
    const recentRequests = clientRequests.filter((time: number) => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    recentRequests.push(now);
    requests.set(clientIp, recentRequests);
    
    next();
  };
};

/**
 * Webhook logging middleware
 */
export const logWebhookRequest = async (req: any, res: any, next: any) => {
  const startTime = Date.now();
  
  // Log incoming request
  console.log(`Webhook ${req.method} ${req.path}`, {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type')
  });

  // Override res.send to log response
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    console.log(`Webhook response ${res.statusCode}`, {
      duration: `${duration}ms`,
      size: JSON.stringify(data).length
    });
    
    // Log to database for analytics
    if (supabase) {
      supabase
        .from('webhook_logs')
        .insert({
          method: req.method,
          path: req.path,
          status_code: res.statusCode,
          duration_ms: duration,
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
          created_at: new Date().toISOString()
        })
        .then(() => {})
        .catch(console.error);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

