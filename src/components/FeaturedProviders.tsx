import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Shield, CheckCircle } from 'lucide-react';
import { useProviders } from '../hooks/useProviders';
import { useDatasets } from '../hooks/useDatasets';

const FeaturedProviders = () => {
  const { providers, loading: providersLoading } = useProviders();
  const { datasets, loading: datasetsLoading } = useDatasets();

  const getProviderDatasets = (providerId: string) => {
    return datasets.filter(d => d.provider?.id === providerId);
  };

  const getProviderLeadCount = (providerId: string) => {
    return getProviderDatasets(providerId).reduce((sum, d) => sum + (d.record_count || 0), 0);
  };

  const getProviderSpecialties = (providerId: string) => {
    const providerDatasets = getProviderDatasets(providerId);
    const categories = [...new Set(providerDatasets.map(d => d.category?.name).filter(Boolean))];
    return categories.slice(0, 3);
  };

  if (providersLoading || datasetsLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Data Providers
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Loading providers...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Featured Data Providers
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Partner with verified, premium lead providers who deliver high-quality, 
            pre-qualified insurance prospects trusted by top-performing agents nationwide
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {providers.map((provider, index) => (
            <Link 
              key={index} 
              to={`/marketplace?provider=${provider.slug}`}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden block"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {provider.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm">{provider.name}</h3>
                      {provider.verified && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 sm:w-3 sm:h-3 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-xs font-medium text-gray-700">{provider.rating}</span>
                      </div>
                      <Award className="w-3 h-3 sm:w-3 sm:h-3 text-blue-500" />
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                  {provider.description}
                </p>

                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span className="text-xs sm:text-xs text-gray-500 uppercase tracking-wide">Leads Available</span>
                    <span className="text-sm sm:text-base font-bold text-gray-900">{getProviderLeadCount(provider.id).toLocaleString()}</span>
                  </div>
                  
                  <div className="mb-2 sm:mb-3">
                    <span className="text-xs sm:text-xs text-gray-500 uppercase tracking-wide mb-1 block">Specialties</span>
                    <div className="flex flex-wrap gap-1">
                      {getProviderSpecialties(provider.id).map((specialty, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 sm:px-4 rounded-md font-medium transition-colors text-xs sm:text-sm text-center">
                  View Leads
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Become a Data Provider
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
              Join our marketplace and monetize your insurance leads. Reach thousands of insurance agents 
              and grow your lead generation business with our trusted platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base text-center">
                Start Selling Leads
              </Link>
              <Link to="/about" className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base text-center">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;