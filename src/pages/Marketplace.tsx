import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Download, Eye, ShoppingCart, TrendingUp, Users, Building, Globe, BarChart3, Heart, Car, Home, Shield, Zap, Database } from 'lucide-react';
import { useDatasets } from '../hooks/useDatasets';
import { useCategories } from '../hooks/useCategories';
import { useCartContext } from '../contexts/CartContext';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../components/Toast';
import { formatPrice } from '../lib/stripe';
import { SkeletonCard } from '../components/SkeletonLoader';
import AdvancedSearch from '../components/AdvancedSearch';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [searchParams] = useSearchParams();

  // Handle URL search parameters
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(decodeURIComponent(searchFromUrl));
    }
  }, [searchParams]);
  
  const { datasets, loading: datasetsLoading } = useDatasets();
  const { categories, loading: categoriesLoading } = useCategories();
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, error } = useToast();

  const loading = datasetsLoading || categoriesLoading;

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Heart, Shield, Users, Car, Home, Building, BarChart3, TrendingUp, Database
    };
    return icons[iconName] || Database;
  };

  const categoryOptions = [
    { id: 'all', name: 'All Categories', icon: Database, count: datasets.length, color: 'from-gray-600 to-gray-800' },
    ...categories.map(cat => {
      const IconComponent = getIconComponent(cat.icon);
      return {
        id: cat.slug,
        name: cat.name,
        icon: IconComponent,
        count: datasets.filter(d => d.category?.slug === cat.slug).length,
        color: 'from-blue-500 to-cyan-500'
      };
    })
  ];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesCategory = selectedCategory === 'all' || dataset.category?.slug === selectedCategory;
    const matchesSearch = dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price_cents - b.price_cents;
      case 'price-high':
        return b.price_cents - a.price_cents;
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.total_downloads - a.total_downloads;
      default:
        return b.featured ? 1 : -1;
    }
  });

  const handleAddToCart = async (dataset: Dataset) => {
    try {
      await addToCart(dataset.id, dataset.price_cents);
      success('Added to cart', `${dataset.title} has been added to your cart`);
    } catch (error) {
      error('Failed to add to cart', 'Please try again');
    }
  };

  const handleWishlistToggle = async (dataset: Dataset) => {
    try {
      if (isInWishlist(dataset.id)) {
        await removeFromWishlist(dataset.id);
        success('Removed from wishlist', `${dataset.title} has been removed from your wishlist`);
      } else {
        await addToWishlist(dataset.id);
        success('Added to wishlist', `${dataset.title} has been saved to your wishlist`);
      }
    } catch (err) {
      error('Failed to update wishlist', 'Please try again');
    }
  };

  const handleAdvancedSearch = (filters: any) => {
    setSearchTerm(filters.query);
    setSelectedCategory(filters.category);
    // Additional filter logic would go here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent mb-4">
            Data Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover premium datasets, leads, and business intelligence from verified providers
          </p>
        </div>

        {/* Search and Filters */}
        <AdvancedSearch 
          onSearch={handleAdvancedSearch}
          initialFilters={{ query: searchTerm, category: selectedCategory }}
        />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
                      <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-green-600" />
                Browse Categories
              </h3>
              <div className="space-y-2">
                {categoryOptions.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${
                          selectedCategory === category.id 
                            ? 'bg-white/20' 
                            : `bg-gradient-to-br ${category.color}`
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            selectedCategory === category.id ? 'text-white' : 'text-white'
                          }`} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className={`text-xs ${
                            selectedCategory === category.id ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {category.count.toLocaleString()} datasets
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Marketplace Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Total Datasets:</span>
                    <span className="font-semibold text-green-600">{datasets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Active Providers:</span>
                    <span className="font-semibold text-green-600">{new Set(datasets.map(d => d.provider_id)).size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Total Downloads:</span>
                    <span className="font-semibold text-green-600">{datasets.reduce((sum, d) => sum + d.total_downloads, 0).toLocaleString()}+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Insurance Data' : categoryOptions.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600">
                  Showing {sortedDatasets.length} of {datasets.length} datasets
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
            </div>

            {/* Featured Banner */}
            {selectedCategory === 'all' && !searchTerm && (
              <div className="bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-green-600/10 rounded-2xl p-8 mb-8 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      🔥 Featured This Week
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Premium health insurance leads with exclusive 17% discount - Limited time offer!
                    </p>
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/25">
                      View Featured Deals
                    </button>
                  </div>
                  <div className="hidden md:block">
                    <div className="bg-green-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                      Save 17%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dataset Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
              {sortedDatasets.map((dataset) => (
                <div key={dataset.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
                  {dataset.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    </div>
                  )}
                  
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <div className="font-semibold">{dataset.category?.name}</div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link to={`/dataset/${dataset.slug}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
                            {dataset.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-green-600 font-medium mb-2">
                          by {dataset.provider?.name}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {dataset.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {dataset.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {dataset.tags.length > 3 && (
                        <span className="text-xs text-green-600 font-medium">
                          +{dataset.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{dataset.rating}</span>
                        <span className="ml-1">({dataset.total_reviews})</span>
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        <span>{dataset.total_downloads.toLocaleString()}</span>
                      </div>
                      <div>Size: {dataset.size_description}</div>
                      <div>Updates: {dataset.update_frequency}</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(dataset.price_cents)}</span>
                        {dataset.original_price_cents && (
                          <span className="text-lg text-gray-500 line-through ml-2">{formatPrice(dataset.original_price_cents)}</span>
                        )}
                        <span className="text-sm text-gray-500 ml-1">/dataset</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleWishlistToggle(dataset)}
                          className={`p-2 border rounded-lg transition-colors ${
                            isInWishlist(dataset.id)
                              ? 'text-red-600 border-red-600 bg-red-50'
                              : 'text-gray-600 border-gray-300 hover:text-red-600 hover:border-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(dataset.id) ? 'fill-current' : ''}`} />
                        </button>
                        <Link 
                          to={`/dataset/${dataset.slug}`}
                          className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(dataset)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/25">
                Load More Datasets
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-green-600/10 rounded-2xl p-8 border border-green-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our insurance data specialists can help you find the perfect leads or create custom data solutions 
            tailored to your specific business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/25 text-center">
              Request Custom Data
            </Link>
            <Link to="/contact" className="inline-block border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-center">
              Contact Specialist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;