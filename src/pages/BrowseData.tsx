import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Download, Eye, ShoppingCart, MapPin, Clock } from 'lucide-react';

const BrowseData = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const datasets = [
    {
      id: 1,
      title: "Health Insurance Leads - ACA Qualified",
      provider: "HealthLeads Pro",
      category: "Health Insurance",
      price: "$2.50",
      rating: 4.9,
      reviews: 342,
      downloads: 15420,
      description: "Pre-qualified health insurance prospects actively seeking ACA marketplace coverage.",
      tags: ["Pre-Qualified", "Phone Verified", "Real-Time", "TCPA Compliant"],
      lastUpdated: "2024-01-15",
      size: "50,000 leads",
      location: "Nationwide"
    },
    {
      id: 2,
      title: "Life Insurance Prospects Database",
      provider: "LifeLeads Direct",
      category: "Life Insurance",
      price: "$3.25",
      rating: 4.7,
      reviews: 289,
      downloads: 8930,
      description: "High-quality life insurance prospects seeking term life and whole life coverage.",
      tags: ["Demographic Data", "Income Qualified", "Age Targeted", "Verified"],
      lastUpdated: "2024-01-14",
      size: "25,000 leads",
      location: "US & Canada"
    },
    {
      id: 3,
      title: "Medicare Supplement Leads",
      provider: "Medicare Masters",
      category: "Medicare",
      price: "$4.00",
      rating: 4.8,
      reviews: 456,
      downloads: 12340,
      description: "Medicare-eligible prospects seeking Medigap and Medicare Advantage coverage.",
      tags: ["Medicare Eligible", "Turning 65", "Supplement", "Verified"],
      lastUpdated: "2024-01-15",
      size: "35,000 leads",
      location: "All 50 States"
    },
    {
      id: 4,
      title: "Auto Insurance Rate Shoppers",
      provider: "AutoLeads Direct",
      category: "Auto Insurance",
      price: "$1.75",
      rating: 4.8,
      reviews: 523,
      downloads: 9560,
      description: "Auto insurance prospects actively seeking better rates and coverage options.",
      tags: ["Rate Shopping", "Vehicle Data", "Current Insurance", "Savings Focused"],
      lastUpdated: "2024-01-14",
      size: "75,000 leads",
      location: "Nationwide"
    },
    {
      id: 5,
      title: "Small Business Insurance Prospects",
      provider: "BusinessLeads Pro",
      category: "Business Insurance",
      price: "$8.00",
      rating: 4.9,
      reviews: 167,
      downloads: 4320,
      description: "Small business owners seeking group health and liability insurance coverage.",
      tags: ["Small Business", "Group Health", "Workers Comp", "Liability"],
      lastUpdated: "2024-01-13",
      size: "10,000 leads",
      location: "Major Markets"
    },
    {
      id: 6,
      title: "Property Insurance Leads",
      provider: "PropertyLeads Direct",
      category: "Property Insurance",
      price: "$3.25",
      rating: 4.7,
      reviews: 234,
      downloads: 7890,
      description: "Property owners seeking homeowners and renters insurance coverage.",
      tags: ["Homeowners", "Renters", "Property Value", "Claims History"],
      lastUpdated: "2024-01-15",
      size: "40,000 leads",
      location: "Nationwide"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: datasets.length },
    { id: 'Health Insurance', name: 'Health Insurance', count: 1 },
    { id: 'Life Insurance', name: 'Life Insurance', count: 1 },
    { id: 'Medicare', name: 'Medicare', count: 1 },
    { id: 'Auto Insurance', name: 'Auto Insurance', count: 1 },
    { id: 'Property Insurance', name: 'Property Insurance', count: 1 },
    { id: 'Business Insurance', name: 'Business Insurance', count: 1 }
  ];

  const filteredDatasets = selectedCategory === 'all' 
    ? datasets 
    : datasets.filter(dataset => dataset.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Insurance Data</h1>
          <p className="text-lg text-gray-600">Discover premium insurance leads from verified providers</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search leads, insurance types..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">Showing {filteredDatasets.length} results</p>
        </div>

        {/* Dataset Grid/List */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredDatasets.map((dataset) => (
            <div key={dataset.id} className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
              {viewMode === 'grid' ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
                        {dataset.title}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium mb-2">by {dataset.provider}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      {dataset.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{dataset.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {dataset.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{dataset.rating}</span>
                      <span className="ml-1">({dataset.reviews})</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-4 h-4 mr-1" />
                      <span>{dataset.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{dataset.location}</span>
                    </div>
                    <span>{dataset.size}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{dataset.price}<span className="text-sm font-normal text-gray-500">/lead</span></span>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link to="/marketplace" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full p-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {dataset.title}
                      </h3>
                      <span className="text-xl font-bold text-gray-900 ml-4">{dataset.price}<span className="text-sm font-normal text-gray-500">/lead</span></span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium mb-2">by {dataset.provider}</p>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">{dataset.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{dataset.rating}</span>
                        <span className="ml-1">({dataset.reviews})</span>
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        <span>{dataset.downloads.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{dataset.location}</span>
                      </div>
                      <span>{dataset.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {dataset.tags.slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg hover:border-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <Link to="/marketplace" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm">
              Previous
            </button>
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className={`px-3 py-2 rounded-lg text-sm ${page === 1 ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseData;