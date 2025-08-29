import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

interface SearchFilters {
  query: string;
  category: string;
  priceMin: string;
  priceMax: string;
  rating: string;
  dataFormat: string[];
  updateFrequency: string;
  recordCount: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    priceMin: '',
    priceMax: '',
    rating: '',
    dataFormat: [],
    updateFrequency: '',
    recordCount: '',
    ...initialFilters
  });

  const { categories } = useCategories();

  const dataFormats = ['CSV', 'JSON', 'Excel', 'XML', 'API'];
  const updateFrequencies = ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly'];
  const recordCounts = ['< 1K', '1K - 10K', '10K - 50K', '50K - 100K', '100K+'];
  const ratings = ['4+ Stars', '3+ Stars', '2+ Stars', '1+ Stars'];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleFormatToggle = (format: string) => {
    const newFormats = filters.dataFormat.includes(format)
      ? filters.dataFormat.filter(f => f !== format)
      : [...filters.dataFormat, format];
    handleFilterChange('dataFormat', newFormats);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: 'all',
      priceMin: '',
      priceMax: '',
      rating: '',
      dataFormat: [],
      updateFrequency: '',
      recordCount: ''
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'query' || key === 'category') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== '';
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Basic Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search insurance leads, demographics, market data..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <select 
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Price Range (per lead)</label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Data Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Data Format</label>
            <div className="flex flex-wrap gap-2">
              {dataFormats.map(format => (
                <button
                  key={format}
                  onClick={() => handleFormatToggle(format)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    filters.dataFormat.includes(format)
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Other Filters */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                {ratings.map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Update Frequency</label>
              <select
                value={filters.updateFrequency}
                onChange={(e) => handleFilterChange('updateFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Any Frequency</option>
                {updateFrequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dataset Size</label>
              <select
                value={filters.recordCount}
                onChange={(e) => handleFilterChange('recordCount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Any Size</option>
                {recordCounts.map(count => (
                  <option key={count} value={count}>{count}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;