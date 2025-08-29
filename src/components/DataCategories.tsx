import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  Car, 
  Home, 
  Building, 
  BarChart3, 
  TrendingUp,
  Database,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useDatasets } from '../hooks/useDatasets';

const DataCategories = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const { datasets, loading: datasetsLoading } = useDatasets();

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Heart, Shield, Users, Car, Home, Building, BarChart3, TrendingUp, Database
    };
    return icons[iconName] || Database;
  };

  const getCategoryCount = (categoryId: string) => {
    return datasets.filter(d => d.category?.id === categoryId).reduce((sum, d) => sum + (d.record_count || 0), 0);
  };

  const getCategoryColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      '#ef4444': 'text-red-600 bg-red-50',
      '#3b82f6': 'text-blue-600 bg-blue-50',
      '#8b5cf6': 'text-purple-600 bg-purple-50',
      '#f59e0b': 'text-yellow-600 bg-yellow-50',
      '#10b981': 'text-green-600 bg-green-50',
      '#6366f1': 'text-indigo-600 bg-indigo-50'
    };
    return colorMap[color] || 'text-gray-600 bg-gray-50';
  };

  if (categoriesLoading || datasetsLoading) {
    return (
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Browse Data Categories
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
              Loading categories...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Browse Data Categories
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Explore our comprehensive collection of insurance leads and data across all major insurance lines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const IconComponent = getIconComponent(category.icon);
            const categoryCount = getCategoryCount(category.id);
            const colorClass = getCategoryColor(category.color);
            
            return (
              <Link
                to={`/marketplace?category=${category.slug}`}
                key={index}
                className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group block"
              >
                <div className={`inline-flex p-2 sm:p-3 rounded-lg ${colorClass} mb-3 sm:mb-4 group-hover:scale-105 transition-transform`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    {categoryCount.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500">
                    records
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs sm:text-xs text-gray-500 flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {datasets.filter(d => d.category?.id === category.id).length} datasets available
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Link to="/marketplace" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DataCategories;