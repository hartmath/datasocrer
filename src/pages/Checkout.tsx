import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCartContext } from '../contexts/CartContext';
import { getStripe, createPaymentIntent, formatPrice } from '../lib/payments';
import CheckoutForm from '../components/CheckoutForm';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, getCartTotal } = useCartContext();
  const navigate = useNavigate();
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      // Redirect to sign in if not authenticated
      navigate('/');
      return;
    }

    if (cartItems.length === 0) {
      // Redirect to marketplace if cart is empty
      navigate('/marketplace');
      return;
    }

    // Create payment intent
    initializePayment();
  }, [user, authLoading, cartItems, navigate]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      setError(null);

      const totalCents = getCartTotal();
      const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const paymentIntent = await createPaymentIntent({
        amount: totalCents,
        currency: 'usd',
        orderId: 'temp', // This will be replaced when order is created
        orderNumber,
        customerEmail: user?.email,
        metadata: {
          user_id: user?.id || '',
          items_count: cartItems.length.toString()
        }
      });

      setClientSecret(paymentIntent.client_secret);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (orderId: string) => {
    navigate(`/order-success?order_id=${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  // Show loading while checking auth or initializing payment
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return <Navigate to="/marketplace" replace />;
  }

  const stripePromise = getStripe();
  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-1">
                Complete your purchase of {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-semibold mb-2">Payment Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={initializePayment}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.dataset.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Digital Download</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.dataset.price_cents)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Includes all applicable taxes and fees
                </p>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    SSL Secured
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    PCI Compliant
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {clientSecret && stripePromise ? (
                <Elements 
                  stripe={stripePromise} 
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#16a34a',
                        colorBackground: '#ffffff',
                        colorText: '#1f2937',
                        colorDanger: '#dc2626',
                        fontFamily: 'system-ui, sans-serif',
                        spacingUnit: '6px',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                  <span className="ml-3 text-gray-600">Initializing secure payment...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>🔒 256-bit SSL encryption</span>
            <span>🛡️ PCI DSS compliant</span>
            <span>💳 Powered by Stripe</span>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Your payment information is processed securely. We do not store credit card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

