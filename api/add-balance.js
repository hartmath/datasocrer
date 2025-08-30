const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, amount_cents, payment_intent_id } = req.body;

    if (!user_id || !amount_cents || !payment_intent_id) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, amount_cents, payment_intent_id' 
      });
    }

    // Validate amount
    if (amount_cents <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    console.log('Adding balance:', { user_id, amount_cents, payment_intent_id });

    // Use the RPC function to add balance atomically
    const { data, error: rpcError } = await supabase.rpc('add_balance', {
      p_user_id: user_id,
      p_amount_cents: amount_cents
    });

    if (rpcError) {
      console.error('RPC add_balance error:', rpcError);
      throw new Error(`Failed to add balance: ${rpcError.message}`);
    }

    // Record the transaction
    const { error: transactionError } = await supabase
      .from('balance_transactions')
      .insert({
        user_id: user_id,
        type: 'payment_recharge',
        amount_cents: amount_cents,
        description: `Balance recharge via Stripe`,
        reference_id: payment_intent_id,
        created_at: new Date().toISOString()
      });

    if (transactionError) {
      console.error('Transaction record error:', transactionError);
      // Don't fail the whole operation for this
    }

    // Add notification
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: user_id,
        type: 'balance_recharge',
        title: 'Balance Recharged',
        message: `Your account has been recharged with $${(amount_cents / 100).toFixed(2)}`,
        data: {
          amount_cents: amount_cents,
          payment_intent_id: payment_intent_id
        },
        read: false,
        created_at: new Date().toISOString()
      });

    if (notificationError) {
      console.error('Notification error:', notificationError);
      // Don't fail the whole operation for this
    }

    console.log('Balance added successfully:', { user_id, amount_cents });

    return res.status(200).json({
      success: true,
      message: 'Balance added successfully',
      amount_added: amount_cents
    });

  } catch (error) {
    console.error('Add balance error:', error);
    return res.status(500).json({
      error: 'Failed to add balance',
      message: error.message
    });
  }
};
