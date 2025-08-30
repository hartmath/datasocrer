import React, { useState, useEffect } from 'react';
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCartContext } from '../contexts/CartContext';
import { createOrder, formatPrice } from '../lib/payments';

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  isRecharge?: boolean;
  rechargeAmount?: string | null;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret, onSuccess, onError, isRecharge, rechargeAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCartContext();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: user?.email || '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US'
    }
  });

  const handleBillingChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setBillingDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      let order: any;
      
      if (isRecharge) {
        // For recharge, we don't create an order, just process the payment
        // The order ID will be generated from the payment intent
        order = { id: `recharge-${Date.now()}` };
      } else {
        // First create the order in our database for regular purchases
        const orderResult = await createOrder({
          user_id: user.id,
          items: cartItems,
          billing_details: billingDetails
        });
        order = orderResult.order;
      }

      // Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-success?order_id=${order.id}`,
          payment_method_data: {
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              address: billingDetails.address
            }
          }
        },
        redirect: 'if_required'
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        
        // Only clear cart for regular purchases, not recharge
        if (!isRecharge) {
          clearCart();
        }
        
        // Handle balance recharge by adding funds to user account
        if (isRecharge && rechargeAmount) {
          try {
            // Call API to add balance
            await fetch('/api/add-balance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                user_id: user.id,
                amount_cents: parseInt(rechargeAmount) * 100,
                payment_intent_id: paymentIntent.id
              })
            });
          } catch (balanceError) {
            console.error('Error adding balance:', balanceError);
            // Don't fail the whole payment for this
          }
        }
        
        onSuccess(order.id);
      }

    } catch (error: any) {
      setPaymentError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  const total = isRecharge ? (parseInt(rechargeAmount || '0') * 100) : getCartTotal();

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">
          {isRecharge 
            ? `$${rechargeAmount} has been added to your account balance.`
            : 'Your order has been processed successfully.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            {isRecharge ? 'Recharge Summary' : 'Order Summary'}
          </h3>
          <div className="space-y-2">
            {isRecharge ? (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Account Balance Recharge</span>
                <span className="font-medium">${rechargeAmount}</span>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.dataset.title}</span>
                  <span className="font-medium">{formatPrice(item.dataset.price_cents)}</span>
                </div>
              ))
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Billing Information
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={billingDetails.name}
                onChange={(e) => handleBillingChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={billingDetails.email}
                onChange={(e) => handleBillingChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={billingDetails.address.line1}
                onChange={(e) => handleBillingChange('address.line1', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="123 Main Street"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={billingDetails.address.line2}
                onChange={(e) => handleBillingChange('address.line2', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Apt, suite, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={billingDetails.address.city}
                onChange={(e) => handleBillingChange('address.city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="New York"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={billingDetails.address.state}
                onChange={(e) => handleBillingChange('address.state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="NY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                value={billingDetails.address.postal_code}
                onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="10001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={billingDetails.address.country}
                onChange={(e) => handleBillingChange('address.country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Payment Information
          </h3>
          
          <div className="p-4 border border-gray-300 rounded-lg">
            <PaymentElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-800 font-medium">Payment Error</h4>
              <p className="text-red-700 text-sm mt-1">{paymentError}</p>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Lock className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 text-sm font-medium">
              Your payment information is secure and encrypted
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg shadow-green-500/25"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pay {formatPrice(total)}
            </>
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By completing your purchase, you agree to our{' '}
          <a href="/terms" className="text-green-600 hover:text-green-700">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-green-600 hover:text-green-700">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
};

export default CheckoutForm;

