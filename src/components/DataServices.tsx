import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Settings,
  Cloud,
  Lock
} from 'lucide-react';

const DataServices = () => {
  const services = [
    {
      title: "Premium Datasets",
      description: "Access curated, high-quality datasets from verified providers worldwide",
      icon: Database,
      features: ["50,000+ datasets", "Real-time updates", "Multiple formats", "API access"],
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Real-time Data APIs",
      description: "Stream live data directly into your applications with our robust APIs",
      icon: Zap,
      features: ["99.9% uptime", "Global CDN", "Rate limiting", "Webhook support"],
      color: "text-yellow-600 bg-yellow-50"
    },
    {
      title: "Data Security & Compliance",
      description: "Enterprise-grade security with full compliance and data governance",
      icon: Shield,
      features: ["SOC 2 certified", "GDPR compliant", "Data encryption", "Audit trails"],
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Global Data Coverage",
      description: "Comprehensive data coverage across 195+ countries and regions",
      icon: Globe,
      features: ["Multi-language", "Local regulations", "Regional insights", "Cultural context"],
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Advanced Analytics",
      description: "Built-in analytics tools and visualization capabilities",
      icon: BarChart3,
      features: ["Data visualization", "Trend analysis", "Custom reports", "ML insights"],
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      title: "Custom Data Solutions",
      description: "Tailored data collection and processing for specific business needs",
      icon: Settings,
      features: ["Custom collection", "Data processing", "Quality assurance", "Dedicated support"],
      color: "text-gray-600 bg-gray-50"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Comprehensive Data Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to discover, access, and integrate data into your business processes. 
            From datasets to APIs, we've got you covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className={`inline-flex p-3 rounded-lg ${service.color} mb-4 group-hover:scale-105 transition-transform`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-blue-600 rounded-lg p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of companies already using our platform to power their data-driven decisions. 
            Start with a free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors text-center">
              Start Free Trial
            </Link>
            <Link to="/contact" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors text-center">
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataServices;