import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';

const DatasetDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock dataset data - in real app, fetch based on ID
  const dataset = {
    id: 1,
    title: "Pre-Qualified Health Insurance Leads",
    provider: "HealthLeads Pro",
    category: "Health Insurance",
    price: "$2.50",
    priceUnit: "per lead",
    rating: 4.9,
    reviews: 342,
    downloads: 15420,
    description: "Premium pre-qualified health insurance prospects actively seeking coverage. Includes ACA marketplace, short-term medical, and HSA leads with verified contact information and demographic data.",
    longDescription: "Our health insurance leads are generated through a multi-channel approach including online forms, telemarketing campaigns, and partner referrals. Each lead is verified for accuracy and compliance with state and federal regulations. Perfect for agents looking to expand their health insurance book of business.",
    tags: ["Pre-Qualified", "Phone Verified", "Real-Time", "TCPA Compliant", "State Licensed"],
    lastUpdated: "2024-01-15",
    updateFrequency: "Real-time",
    formats: ["CSV", "Excel", "JSON", "API"],
    size: "50,000+ leads",
    coverage: "All 50 States",
    dataPoints: 25,
    sampleData: [
      { field: "First Name", example: "John", type: "String" },
      { field: "Last Name", example: "Smith", type: "String" },
      { field: "Phone", example: "(555) 123-4567", type: "String" },
      { field: "Email", example: "john.smith@email.com", type: "String" },
      { field: "Age", example: "35", type: "Integer" },
      { field: "Income Range", example: "$50,000-$75,000", type: "String" },
      { field: "State", example: "CA", type: "String" },
      { field: "Insurance Type Interest", example: "ACA Marketplace", type: "String" }
    ],
    features: [
      "TCPA Compliant leads",
      "Real-time lead delivery",
      "Duplicate lead protection",
      "Lead replacement guarantee",
      "24/7 customer support",
      "Custom filtering options"
    ],
    compliance: [
      "TCPA Compliant",
      "State Licensed",
      "DNC Scrubbed",
      "Opt-in Verified",
      "HIPAA Compliant"
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'sample', label: 'Sample Data', icon: FileText },
    { id: 'pricing', label: 'Pricing', icon: BarChart3 },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link to="/browse-data" className="hover:text-purple-600">Browse Data</Link>
          <span>/</span>
          <span className="text-gray-900">{dataset.title}</span>
        </div>

        {/* Back Button */}
        <Link 
          to="/browse-data"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Browse Data
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{dataset.title}</h1>
                  <p className="text-lg text-purple-600 font-medium">by {dataset.provider}</p>
                </div>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium">
                  {dataset.category}
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
                  <span className="text-gray-500 ml-1">({dataset.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Download className="w-4 h-4 mr-1" />
                  <span>{dataset.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Updated {dataset.lastUpdated}</span>
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
                            ? 'border-green-500 text-green-600'
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
                      {dataset.longDescription}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {dataset.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Compliance</h4>
                        <ul className="space-y-2">
                          {dataset.compliance.map((item, idx) => (
                            <li key={idx} className="flex items-center text-gray-600">
                              <Shield className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sample' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Sample Data Fields</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Field Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Example</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Data Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dataset.sampleData.map((field, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{field.field}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{field.example}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{field.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'pricing' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing Options</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Starter Pack</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-2">$2.50 <span className="text-sm font-normal text-gray-500">per lead</span></div>
                      <p className="text-gray-600 text-sm mb-4">Minimum 100 leads</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Basic lead information</li>
                        <li>• Phone verified</li>
                        <li>• Email support</li>
                      </ul>
                    </div>
                    
                    <div className="border-2 border-purple-500 rounded-lg p-6 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">Popular</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Professional</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-2">$2.25 <span className="text-sm font-normal text-gray-500">per lead</span></div>
                      <p className="text-gray-600 text-sm mb-4">Minimum 500 leads</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Enhanced lead data</li>
                        <li>• Real-time delivery</li>
                        <li>• Priority support</li>
                        <li>• Lead replacement</li>
                      </ul>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Enterprise</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-2">$2.00 <span className="text-sm font-normal text-gray-500">per lead</span></div>
                      <p className="text-gray-600 text-sm mb-4">Minimum 1,000 leads</p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Premium lead data</li>
                        <li>• Custom filtering</li>
                        <li>• Dedicated support</li>
                        <li>• API access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Mike Rodriguez",
                        rating: 5,
                        date: "2024-01-10",
                        review: "Excellent quality leads with high conversion rates. Customer service is outstanding and they always deliver on time."
                      },
                      {
                        name: "Sarah Johnson",
                        rating: 5,
                        date: "2024-01-08",
                        review: "These health insurance leads have transformed my business. The data quality is exceptional and the leads are truly pre-qualified."
                      },
                      {
                        name: "David Chen",
                        rating: 4,
                        date: "2024-01-05",
                        review: "Good quality leads overall. The verification process is thorough and the leads convert well. Would recommend to other agents."
                      }
                    ].map((review, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-purple-600 font-semibold">{review.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{review.name}</h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-600">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {dataset.price}
                  <span className="text-lg font-normal text-gray-500 ml-1">{dataset.priceUnit}</span>
                </div>
                <p className="text-gray-600">Starting price</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Dataset Size:</span>
                  <span className="font-medium">{dataset.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Coverage:</span>
                  <span className="font-medium">{dataset.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Points:</span>
                  <span className="font-medium">{dataset.dataPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Update Frequency:</span>
                  <span className="font-medium">{dataset.updateFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Formats:</span>
                  <span className="font-medium">{dataset.formats.join(', ')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button className="w-full border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Request Sample
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our insurance data specialists for custom solutions.
                </p>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                  Contact Specialist →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetDetails;