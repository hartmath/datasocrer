import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Users, 
  Car, 
  Home, 
  Building, 
  Star,
  CheckCircle,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';

const LeadTypes = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const leadTypes = [
    {
      id: 'health-insurance',
      title: 'Health Insurance Leads',
      icon: Heart,
      description: 'Pre-qualified prospects seeking individual and family health insurance coverage',
      priceRange: '$2.50 - $4.00',
      avgPrice: '$3.25',
      category: 'health',
      features: [
        'ACA Marketplace qualified',
        'Short-term medical interest',
        'Health Savings Account eligible',
        'TCPA compliant opt-ins',
        'Real-time phone verification',
        'Income and demographic data'
      ],
      leadCount: '50,000+',
      conversionRate: '12-18%',
      color: 'from-red-500 to-pink-500',
      popular: true
    },
    {
      id: 'life-insurance',
      title: 'Life Insurance Prospects',
      icon: Shield,
      description: 'Quality prospects interested in term life, whole life, and universal life insurance',
      priceRange: '$3.00 - $6.00',
      avgPrice: '$4.50',
      category: 'life',
      features: [
        'Term life insurance interest',
        'Whole life prospects',
        'Universal life qualified',
        'Age and income verified',
        'Family status included',
        'Coverage amount preferences'
      ],
      leadCount: '35,000+',
      conversionRate: '15-22%',
      color: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      id: 'medicare',
      title: 'Medicare Supplement Leads',
      icon: Users,
      description: 'Medicare-eligible prospects seeking Medigap, Medicare Advantage, and Part D coverage',
      priceRange: '$4.00 - $7.00',
      avgPrice: '$5.50',
      category: 'medicare',
      features: [
        'Medicare Advantage interest',
        'Medigap supplement needs',
        'Part D prescription coverage',
        'Turning 65 prospects',
        'Annual enrollment period',
        'Current coverage details'
      ],
      leadCount: '25,000+',
      conversionRate: '18-25%',
      color: 'from-purple-500 to-indigo-500',
      popular: true
    },
    {
      id: 'auto-insurance',
      title: 'Auto Insurance Leads',
      icon: Car,
      description: 'Drivers seeking better auto insurance rates and coverage options',
      priceRange: '$1.50 - $3.00',
      avgPrice: '$2.25',
      category: 'auto',
      features: [
        'Rate comparison shoppers',
        'Vehicle information included',
        'Current insurance details',
        'Driving record status',
        'Coverage preferences',
        'Savings motivation'
      ],
      leadCount: '75,000+',
      conversionRate: '10-15%',
      color: 'from-yellow-500 to-orange-500',
      popular: false
    },
    {
      id: 'home-insurance',
      title: 'Homeowners Insurance',
      icon: Home,
      description: 'Property owners seeking homeowners and renters insurance coverage',
      priceRange: '$2.00 - $4.50',
      avgPrice: '$3.25',
      category: 'property',
      features: [
        'Homeowners coverage needs',
        'Renters insurance interest',
        'Property value information',
        'Current coverage details',
        'Claims history status',
        'Bundle opportunities'
      ],
      leadCount: '40,000+',
      conversionRate: '12-18%',
      color: 'from-green-500 to-emerald-500',
      popular: false
    },
    {
      id: 'business-insurance',
      title: 'Business Insurance Leads',
      icon: Building,
      description: 'Small business owners seeking commercial insurance coverage',
      priceRange: '$8.00 - $15.00',
      avgPrice: '$11.50',
      category: 'business',
      features: [
        'General liability needs',
        'Workers compensation',
        'Professional liability',
        'Business size and industry',
        'Employee count',
        'Current coverage gaps'
      ],
      leadCount: '15,000+',
      conversionRate: '20-30%',
      color: 'from-indigo-500 to-purple-500',
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Lead Types', count: leadTypes.length },
    { id: 'health', name: 'Health Insurance', count: 1 },
    { id: 'life', name: 'Life Insurance', count: 1 },
    { id: 'medicare', name: 'Medicare', count: 1 },
    { id: 'auto', name: 'Auto Insurance', count: 1 },
    { id: 'property', name: 'Property Insurance', count: 1 },
    { id: 'business', name: 'Business Insurance', count: 1 }
  ];

  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: 'low', name: 'Under $3.00' },
    { id: 'medium', name: '$3.00 - $6.00' },
    { id: 'high', name: 'Over $6.00' }
  ];

  const filteredLeads = leadTypes.filter(lead => {
    const categoryMatch = selectedCategory === 'all' || lead.category === selectedCategory;
    
    let priceMatch = true;
    if (priceRange === 'low') {
      priceMatch = parseFloat(lead.avgPrice.replace('$', '')) < 3.00;
    } else if (priceRange === 'medium') {
      const price = parseFloat(lead.avgPrice.replace('$', ''));
      priceMatch = price >= 3.00 && price <= 6.00;
    } else if (priceRange === 'high') {
      priceMatch = parseFloat(lead.avgPrice.replace('$', '')) > 6.00;
    }
    
    return categoryMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(0,255,65,0.3)]">
            Insurance Lead Types
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of pre-qualified insurance leads across all major insurance lines
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search lead types..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {priceRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredLeads.length} of {leadTypes.length} lead types
          </p>
        </div>

        {/* Lead Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLeads.map((leadType) => {
            const IconComponent = leadType.icon;
            return (
              <div key={leadType.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                {leadType.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${leadType.color} mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {leadType.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {leadType.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{leadType.leadCount}</div>
                      <div className="text-sm text-gray-600">Available Leads</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{leadType.conversionRate}</div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {leadType.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-gray-500">Starting at</div>
                      <div className="text-2xl font-bold text-gray-900">{leadType.avgPrice}</div>
                      <div className="text-sm text-gray-500">per lead</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Price Range</div>
                      <div className="font-semibold text-gray-700">{leadType.priceRange}</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link 
                      to={`/dataset/${leadType.id}`}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-center shadow-lg shadow-green-500/25"
                    >
                      View Details
                    </Link>
                    <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300">
                      Sample
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-green-600/10 via-emerald-600/10 to-green-600/10 rounded-2xl p-8 border border-green-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Need Custom Lead Solutions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our insurance data specialists can create custom lead generation campaigns tailored to your specific needs and target market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center shadow-lg shadow-green-500/25">
              Request Custom Leads
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Contact Specialist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadTypes;