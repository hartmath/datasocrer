import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCartContext } from '../contexts/CartContext';
import { formatPrice } from '../lib/stripe';
import { SkeletonCard } from '../components/SkeletonLoader';
import { useToast } from '../components/Toast';

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCartContext();
  const { success, error } = useToast();

  const handleAddToCart = async (dataset: any) => {
    try {
      await addToCart(dataset.id, dataset.price);
      success('Added to cart', `${dataset.title} has been added to your cart`);
    } catch (err) {
      error('Failed to add to cart', 'Please try again');
    }
  };

  const handleRemoveFromWishlist = async (datasetId: string, title: string) => {
    try {
      await removeFromWishlist(datasetId);
      success('Removed from wishlist', `${title} has been removed from your wishlist`);
    } catch (err) {
      error('Failed to remove', 'Please try again');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">Your saved insurance leads and datasets</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">Your saved insurance leads and datasets ({wishlistItems.length} items)</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save datasets you're interested in to easily find them later.</p>
            <Link to="/marketplace" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((dataset) => (
              <div key={dataset.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center relative">
                  <button
                    onClick={() => handleRemoveFromWishlist(dataset.id, dataset.title)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="text-white text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <div className="font-semibold">{dataset.category?.name}</div>
                  </div>
                </div>

                <div className="p-6">
                  <Link to={`/dataset/${dataset.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
                      {dataset.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-green-600 font-medium mb-2">
                    by {dataset.provider?.name}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {dataset.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {dataset.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(dataset.price)}</span>
                      <span className="text-sm text-gray-500 ml-1">/lead</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link 
                      to={`/dataset/${dataset.slug}`}
                      className="flex-1 flex items-center justify-center p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(dataset)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;