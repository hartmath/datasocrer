import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { useCartContext } from '../contexts/CartContext';
import { formatPrice } from '../lib/payments';
import { useAuth } from '../contexts/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCartContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    // This will be handled by the Link component
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Shopping Cart ({cartItems.length})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-green-600 hover:text-green-700 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {item.dataset?.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        by {item.dataset?.provider?.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.dataset?.price_cents || 0)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="space-y-2">
                {user ? (
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-lg shadow-green-500/25"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 text-center">Sign in to proceed with checkout</p>
                    <Link
                      to="/?signin=true"
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center shadow-lg shadow-green-500/25"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Sign In to Checkout
                    </Link>
                  </div>
                  )}
                
                <button
                  onClick={clearCart}
                  className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;