import React from 'react';
import { Building, Users, Shield, Zap, BarChart3, Globe, Award, CheckCircle } from 'lucide-react';

const ForBusiness = () => {
  const enterpriseFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 Type II certified with advanced encryption and compliance controls"
    },
    {
      icon: Zap,
      title: "High-Performance APIs",
      description: "99.9% uptime with global CDN and unlimited API calls"
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "24/7 priority support with dedicated customer success manager"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Custom dashboards, reporting, and business intelligence tools"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Data from 195+ countries with local compliance and regulations"
    },
    {
      icon: Award,
      title: "Premium Data Quality",
      description: "Verified, cleaned, and enriched datasets with quality guarantees"
    }
  ];

  const pricingPlans = [
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      description: "Perfect for growing businesses and data teams",
      features: [
        "Up to 10 team members",
        "50 dataset downloads/month",
        "Standard API access",
        "Email support",
        "Basic analytics dashboard",
        "Data export in multiple formats"
      ],
      popular: false
    },
    {
      name: "Enterprise",
      price: "$999",
      period: "per month",
      description: "Advanced features for large organizations",
      features: [
        "Unlimited team members",
        "Unlimited dataset downloads",
        "Premium API with SLA",
        "24/7 priority support",
        "Advanced analytics & reporting",
        "Custom data solutions",
        "Dedicated account manager",
        "White-label options"
      ],
      popular: true
    },
    {
      name: "Custom",
      price: "Contact us",
      period: "tailored pricing",
      description: "Bespoke solutions for unique requirements",
      features: [
        "Custom data collection",
        "Private data marketplace",
        "On-premise deployment",
        "Custom integrations",
        "Regulatory compliance",
        "Data governance tools",
        "Training & consulting",
        "SLA guarantees"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Enterprise Data Solutions
            </h1>
            <p className="text-xl lg:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Empower your organization with premium data, advanced analytics, and enterprise-grade security
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Schedule Demo
              </button>
              <button className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-4">
              Built for Enterprise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your organization needs to harness the power of data at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enterpriseFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="bg-gradient-to-br from-purple-600 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your business needs
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-purple-600 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white' 
                      : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                  }`}>
                    {plan.name === 'Custom' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using Data Sorcerer to drive data-driven decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              Start Free Trial
            </button>
            <button className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForBusiness;
