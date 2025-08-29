import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  Settings, 
  BarChart3, 
  Users, 
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Shield,
  Clock,
  Award,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const LeadGeneration = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const services = [
    {
      icon: Target,
      title: "Campaign Strategy & Setup",
      description: "We design targeted advertising campaigns across Google Ads, Facebook, and other platforms to generate high-quality insurance leads.",
      features: [
        "Keyword research and selection",
        "Ad copy creation and testing",
        "Landing page optimization",
        "Audience targeting setup"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Settings,
      title: "Campaign Management",
      description: "Our experts continuously monitor, optimize, and manage your campaigns to maximize ROI and lead quality.",
      features: [
        "Daily campaign monitoring",
        "Bid optimization",
        "A/B testing of ads",
        "Performance reporting"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Comprehensive tracking and reporting to measure campaign performance and lead quality metrics.",
      features: [
        "Real-time dashboard access",
        "Lead quality scoring",
        "ROI tracking and analysis",
        "Monthly performance reports"
      ],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Users,
      title: "Lead Qualification",
      description: "Advanced lead scoring and qualification processes to ensure you receive only the highest quality prospects.",
      features: [
        "TCPA compliance verification",
        "Phone number validation",
        "Intent verification calls",
        "Duplicate lead removal"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter Setup",
      price: "$2,500",
      period: "one-time setup",
      description: "Perfect for agents new to digital lead generation",
      features: [
        "1 platform setup (Google or Facebook)",
        "Basic campaign structure",
        "Landing page creation",
        "Initial keyword research",
        "2 weeks of optimization",
        "Training session included"
      ],
      popular: false,
      setupTime: "1-2 weeks"
    },
    {
      name: "Professional Package",
      price: "$4,500",
      period: "setup + 3 months management",
      description: "Comprehensive solution for established agents",
      features: [
        "Multi-platform setup (Google + Facebook)",
        "Advanced campaign optimization",
        "Custom landing pages",
        "Lead qualification system",
        "Monthly performance reports",
        "Dedicated account manager",
        "3 months of management included"
      ],
      popular: true,
      setupTime: "2-3 weeks"
    },
    {
      name: "Enterprise Solution",
      price: "Custom",
      period: "tailored pricing",
      description: "Full-service solution for agencies and high-volume agents",
      features: [
        "All platforms + custom integrations",
        "White-label lead generation",
        "CRM integration",
        "Advanced analytics dashboard",
        "Ongoing optimization",
        "Priority support",
        "Custom reporting"
      ],
      popular: false,
      setupTime: "3-4 weeks"
    }
  ];

  const results = [
    {
      metric: "Average Cost Per Lead",
      value: "$15-45",
      description: "Depending on insurance type and market",
      icon: Target
    },
    {
      metric: "Lead Quality Score",
      value: "85%+",
      description: "Qualified prospects ready to purchase",
      icon: Award
    },
    {
      metric: "Campaign ROI",
      value: "300-500%",
      description: "Return on advertising investment",
      icon: TrendingUp
    },
    {
      metric: "Setup Time",
      value: "1-3 weeks",
      description: "From consultation to live campaigns",
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Professional Lead Generation Services
            </h1>
            <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
              Let our experts set up and manage high-converting advertising campaigns that generate 
              qualified insurance leads directly for your business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Link>
              <Link to="/about" className="border-2 border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center hover:bg-white/10">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Lead Generation Solution</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From strategy to execution, we handle every aspect of your lead generation campaigns
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${service.color} mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Typical Results</h2>
            <p className="text-lg text-gray-600">Performance metrics from our lead generation campaigns</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((result, idx) => {
              const IconComponent = result.icon;
              return (
                <div key={idx} className="text-center bg-white border border-gray-200 rounded-lg p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{result.value}</div>
                  <div className="font-medium text-gray-900 mb-2">{result.metric}</div>
                  <div className="text-sm text-gray-600">{result.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Packages</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose the package that fits your business needs and budget
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${plan.popular ? 'ring-2 ring-blue-600' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center text-sm text-blue-600 mb-4">
                      <Clock className="w-4 h-4 mr-2" />
                      Setup Time: {plan.setupTime}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`} onClick={() => window.location.href = plan.name === 'Enterprise Solution' ? '/contact' : '/marketplace'}>
                    {plan.name === 'Enterprise Solution' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Generate More Qualified Leads?</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Let our experts build and manage high-converting campaigns that deliver qualified insurance prospects directly to your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Free Consultation
            </Link>
            <a href="tel:+15551234567" className="border-2 border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-lg font-medium transition-colors hover:bg-white/10 flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              Call (555) 123-DATA
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadGeneration;