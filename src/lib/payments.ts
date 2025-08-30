import { loadStripe, Stripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
} else {
  console.warn('Stripe publishable key not found. Payment processing will not work.');
  stripePromise = Promise.resolve(null);
}

export const getStripe = () => stripePromise;

export interface CartItem {
  id: string;
  dataset: {
    id: string;
    title: string;
    price_cents: number;
    slug: string;
  };
  price: number;
  quantity: number;
}

export interface CreateOrderData {
  user_id: string;
  items: CartItem[];
  billing_details?: {
    name?: string;
    email?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

export interface PaymentIntent {
  id: string;
  client_secret: string;
  status: string;
  amount: number;
  currency: string;
}

/**
 * Create a new order and payment intent
 */
export const createOrder = async (orderData: CreateOrderData): Promise<{ order: any; paymentIntent: PaymentIntent }> => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    // Calculate total amount
    const totalAmountCents = orderData.items.reduce((total, item) => {
      return total + (item.dataset.price_cents * item.quantity);
    }, 0);

    // Generate order number
    const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        order_number: orderNumber,
        total_amount_cents: totalAmountCents,
        status: 'pending',
        payment_status: 'pending',
        billing_details: orderData.billing_details || {},
        metadata: {
          items_count: orderData.items.length
        }
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      dataset_id: item.dataset.id,
      price_cents: item.dataset.price_cents,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Create Stripe payment intent
    const paymentIntent = await createPaymentIntent({
      amount: totalAmountCents,
      currency: 'usd',
      orderId: order.id,
      orderNumber: orderNumber,
      customerEmail: orderData.billing_details?.email,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
        user_id: orderData.user_id
      }
    });

    // Update order with payment intent ID
    await supabase
      .from('orders')
      .update({ payment_intent_id: paymentIntent.id })
      .eq('id', order.id);

    return { order, paymentIntent };

  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Create a Stripe payment intent
 */
export const createPaymentIntent = async (params: {
  amount: number;
  currency: string;
  orderId: string;
  orderNumber: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}): Promise<PaymentIntent> => {
  try {
    console.log('Creating payment intent for amount:', params.amount, 'cents');
    
    // Try different API endpoint approaches for better compatibility
    const apiUrls = [
      '/api/create-payment-intent',
      `${window.location.origin}/api/create-payment-intent`,
      'https://datacsv.vercel.app/api/create-payment-intent' // Fallback to production
    ];

    let lastError: Error | null = null;

    for (const apiUrl of apiUrls) {
      try {
        console.log('Trying API endpoint:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: params.amount,
            currency: params.currency,
            customer_email: params.customerEmail,
            metadata: {
              order_id: params.orderId,
              order_number: params.orderNumber,
              ...params.metadata
            }
          }),
        });

        if (response.ok) {
          const paymentIntent = await response.json();
          console.log('Payment intent created successfully:', paymentIntent.id);
          return paymentIntent;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.warn(`API endpoint ${apiUrl} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    // If all endpoints fail, throw the last error
    throw lastError || new Error('All payment API endpoints failed');

  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Show user-friendly error message
    throw new Error('Payment processing is currently unavailable. Please ensure your Stripe secret key is configured in your deployment environment.');
  }
};

/**
 * Confirm payment and update order status
 */
export const confirmPayment = async (paymentIntentId: string, paymentMethodId: string) => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe not available');
  }

  try {
    // Get payment intent details
    const { paymentIntent, error } = await stripe.confirmPayment({
      clientSecret: paymentIntentId,
      confirmParams: {
        payment_method: paymentMethodId,
        return_url: `${window.location.origin}/order-success`,
      },
    });

    if (error) {
      throw new Error(`Payment confirmation failed: ${error.message}`);
    }

    // Update order status based on payment result
    if (paymentIntent.status === 'succeeded') {
      await updateOrderStatus(paymentIntent.metadata?.order_id, 'completed', 'succeeded');
      
      // Create download records for successful payments
      await createDownloadRecords(paymentIntent.metadata?.order_id);
    }

    return paymentIntent;

  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

/**
 * Update order status in database
 */
export const updateOrderStatus = async (orderId: string, status: string, paymentStatus: string) => {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        payment_status: paymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }

  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Create download records for completed orders
 */
export const createDownloadRecords = async (orderId: string) => {
  if (!supabase) return;

  try {
    // Get order details with items
    const { data: orderWithItems, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        order_items (
          id,
          dataset_id,
          datasets (
            id,
            title,
            file_url,
            file_size,
            file_format
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error || !orderWithItems) {
      throw new Error('Failed to fetch order details');
    }

    // Create download records for each dataset
    const downloadRecords = orderWithItems.order_items.map((item: any) => ({
      user_id: orderWithItems.user_id,
      dataset_id: item.dataset_id,
      order_item_id: item.id,
      file_format: item.datasets.file_format || 'csv',
      file_size: item.datasets.file_size,
      download_url: item.datasets.file_url,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }));

    const { error: downloadError } = await supabase
      .from('downloads')
      .insert(downloadRecords);

    if (downloadError) {
      throw new Error(`Failed to create download records: ${downloadError.message}`);
    }

  } catch (error) {
    console.error('Error creating download records:', error);
    throw error;
  }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (userId: string) => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        payment_status,
        total_amount_cents,
        created_at,
        order_items (
          id,
          price_cents,
          quantity,
          datasets (
            id,
            title,
            slug
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user orders: ${error.message}`);
    }

    return data || [];

  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Get user's downloads
 */
export const getUserDownloads = async (userId: string) => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    const { data, error } = await supabase
      .from('downloads')
      .select(`
        id,
        file_format,
        file_size,
        download_url,
        expires_at,
        downloaded_at,
        created_at,
        datasets (
          id,
          title,
          slug,
          description
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch user downloads: ${error.message}`);
    }

    return data || [];

  } catch (error) {
    console.error('Error fetching user downloads:', error);
    throw error;
  }
};

/**
 * Format price for display
 */
export const formatPrice = (cents: number, currency = 'USD'): string => {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(dollars);
};

/**
 * Create subscription
 */
export const createSubscription = async (params: {
  userId: string;
  planName: string;
  priceCents: number;
  customerEmail?: string;
}) => {
  try {
    // In a real application, this would call your backend API
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Subscription creation failed: ${response.statusText}`);
    }

    const subscription = await response.json();
    
    // Save subscription to database
    if (supabase) {
      await supabase
        .from('subscriptions')
        .insert({
          user_id: params.userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer,
          status: subscription.status,
          plan_name: params.planName,
          plan_price_cents: params.priceCents,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
    }

    return subscription;

  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = async (subscriptionId: string) => {
  if (!supabase) {
    throw new Error('Database connection not available');
  }

  try {
    // Call backend API to cancel subscription in Stripe
    const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Subscription cancellation failed: ${response.statusText}`);
    }

    // Update subscription status in database
    await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

