import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, TrendingUp, Users, Shield } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { getContent } = useContent();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <section className="relative bg-white">
      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            {getContent('home.hero.title', 'Premium Data Marketplace')}
            <span className="block bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
              {getContent('home.hero.subtitle', 'for Business Intelligence')}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-4">
            {getContent('home.hero.description', 'Access premium datasets, leads, and business intelligence from verified providers. Trusted by thousands of professionals across finance, healthcare, real estate, and more.')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={getContent('home.hero.search.placeholder', 'Search leads, insurance data...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                                  className="w-full pl-12 pr-20 sm:pr-24 py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 sm:px-4 py-2 rounded-md font-medium transition-all duration-300 text-xs sm:text-sm shadow-lg shadow-green-500/25"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Link to="/marketplace" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center text-sm sm:text-base shadow-lg shadow-green-500/25">
              {getContent('home.hero.cta.primary', 'Browse Data Marketplace')}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link to="/contact" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
              {getContent('home.hero.cta.secondary', 'Request Custom Data')}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-900">{getContent('home.stats.users.count', '10,000+')}</div>
              <div className="text-sm sm:text-base text-gray-600">{getContent('home.stats.users.label', 'Active Users')}</div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-900">{getContent('home.stats.datasets.count', '500+')}</div>
              <div className="text-sm sm:text-base text-gray-600">{getContent('home.stats.datasets.label', 'Premium Datasets')}</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-900">50K+</div>
              <div className="text-sm sm:text-base text-gray-600">Agents Served</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;