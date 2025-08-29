import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize clients
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Auto-Recharge Handler
 * Vercel Serverless Function for processing automatic balance recharges
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, amount_cents, payment_method_id } = req.body;

    if (!user_id || !amount_cents || !payment_method_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, amount_cents, payment_method_id' 
      });
    }

    console.log('Processing auto-recharge:', { user_id, amount_cents, payment_method_id });

    // Get user details
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get or create Stripe customer
    let stripeCustomerId = profile.stripe_customer_id;
    
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: `${profile.first_name} ${profile.last_name}`,
        metadata: {
          user_id: user_id
        }
      });
      
      stripeCustomerId = customer.id;
      
      // Update profile with Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user_id);
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount_cents,
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method: payment_method_id,
      confirmation_method: 'automatic',
      confirm: true,
      return_url: `${process.env.VITE_APP_URL || 'https://your-domain.com'}/lead-import`,
      metadata: {
        user_id: user_id,
        type: 'auto_recharge'
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Add balance to user account
      await addUserBalance(user_id, amount_cents, 'auto_recharge', paymentIntent.id);

      // Update last recharge timestamp
      await supabase
        .from('user_balances')
        .update({ 
          last_recharge_at: new Date().toISOString() 
        })
        .eq('user_id', user_id);

      // Send notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user_id,
          type: 'auto_recharge_success',
          title: 'Auto-Recharge Successful',
          message: `Your account has been recharged with $${(amount_cents / 100).toFixed(2)}`,
          data: {
            amount_cents: amount_cents,
            payment_intent_id: paymentIntent.id
          }
        });

      console.log('Auto-recharge successful:', { user_id, amount_cents, payment_intent_id: paymentIntent.id });

      return res.status(200).json({
        success: true,
        payment_intent_id: paymentIntent.id,
        amount_charged: amount_cents
      });
    } else {
      console.error('Payment intent failed:', paymentIntent.status, paymentIntent.last_payment_error);
      
      return res.status(400).json({
        success: false,
        error: 'Payment failed',
        payment_intent_status: paymentIntent.status,
        payment_error: paymentIntent.last_payment_error?.message
      });
    }

  } catch (error) {
    console.error('Auto-recharge error:', error);
    
    // Send failure notification if we have user_id
    if (req.body.user_id) {
      try {
        await supabase
          .from('notifications')
          .insert({
            user_id: req.body.user_id,
            type: 'auto_recharge_failed',
            title: 'Auto-Recharge Failed',
            message: `Auto-recharge failed: ${error.message}`,
            data: {
              error: error.message,
              amount_cents: req.body.amount_cents
            }
          });
      } catch (notifError) {
        console.error('Error sending failure notification:', notifError);
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

/**
 * Add balance to user account
 */
async function addUserBalance(userId, amountCents, type, referenceId) {
  try {
    // Update balance atomically
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
}
