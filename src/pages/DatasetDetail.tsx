import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Download, 
  Eye, 
  ShoppingCart, 
  Calendar, 
  FileText, 
  Globe, 
  Shield,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  ArrowLeft,
  Heart
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Dataset, Review } from '../types';
import { useCartContext } from '../contexts/CartContext';
import { formatPrice } from '../lib/stripe';

const DatasetDetail = () => {
  const { slug } = useParams();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { addToCart } = useCartContext();

  useEffect(() => {
    const fetchDataset = async () => {
      if (!supabase || !slug) return;

      try {
        const { data, error } = await supabase
          .from('datasets')
          .select(`
            *,
            category:categories(*),
            provider:providers(*)
          `)
          .eq('slug', slug)
          .eq('active', true)
          .single();

        if (error) throw error;
        setDataset(data);

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('dataset_id', data.id)
          .order('created_at', { ascending: false });

        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Error fetching dataset:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataset();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!dataset) return;
    
    try {
      await addToCart(dataset.id, dataset.price_cents);
      console.log('Added to cart:', dataset.title);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'sample', label: 'Sample Data', icon: FileText },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dataset Not Found</h1>
          <p className="text-gray-600 mb-4">The dataset you're looking for doesn't exist.</p>
          <Link to="/marketplace" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link>
          <span>/</span>
          <span className="text-gray-900">{dataset.title}</span>
        </div>

        {/* Back Button */}
        <Link 
          to="/marketplace"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{dataset.title}</h1>
                  <p className="text-lg text-blue-600 font-medium">by {dataset.provider?.name}</p>
                </div>
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
                  {dataset.category?.name}
                </span>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <div className="flex items-center space-x-1 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(dataset.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-semibold">{dataset.rating}</span>
                  <span className="text-gray-500 ml-1">({dataset.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Download className="w-4 h-4 mr-1" />
                  <span>{dataset.total_downloads.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Updated {new Date(dataset.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {dataset.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {dataset.tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Dataset Details</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {dataset.long_description || dataset.description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'sample' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Data</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-600 mb-4">
                      Sample data preview will be available here. Contact the provider for detailed samples.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      Request Sample
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-gray-600">No reviews yet. Be the first to review this dataset!</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="ml-2 font-medium">{review.title}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(dataset.price)}
                  <span className="text-lg font-normal text-gray-500 ml-1">per lead</span>
                </div>
                {dataset.original_price && (
                  <p className="text-gray-500 line-through">{formatPrice(dataset.original_price)}</p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dataset Size:</span>
                  <span className="font-medium">{dataset.size_description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Records:</span>
                  <span className="font-medium">{dataset.record_count?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Update Frequency:</span>
                  <span className="font-medium">{dataset.update_frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Formats:</span>
                  <span className="font-medium">{dataset.data_format.join(', ')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Request Sample
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our insurance data specialists for custom solutions.
                </p>
                <Link to="/contact" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Contact Specialist →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetail;