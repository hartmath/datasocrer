import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Star, Zap, Shield, Users, BarChart3 } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "per month",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 100 datasets per month",
        "Basic data filtering",
        "Email support",
        "Standard data fields",
        "CSV/Excel downloads",
        "Data quality guarantee"
      ],
      popular: false,
      color: "gray"
    },
    {
      name: "Professional",
      price: "$299",
      period: "per month",
      description: "Ideal for established businesses and growing teams",
      features: [
        "Up to 500 datasets per month",
        "Advanced filtering options",
        "Priority email support",
        "Enhanced data fields",
        "API access included",
        "Real-time data delivery",
        "Data quality scoring",
        "Custom data types"
      ],
      popular: true,
      color: "green"
    },
    {
      name: "Enterprise",
      price: "$799",
      period: "per month",
      description: "For large enterprises and high-volume operations",
      features: [
        "Unlimited datasets",
        "Custom data generation",
        "24/7 phone support",
        "Premium data enrichment",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "Compliance consulting",
        "Volume discounts"
      ],
      popular: false,
      color: "green"
    }
  ];

  const addOns = [
    {
      name: "Data Verification Plus",
      price: "$5.00",
      unit: "per dataset",
      description: "Enhanced data validation and quality verification with real-time checks",
      icon: Shield
    },
    {
      name: "Data Enhancement",
      price: "$10.00",
      unit: "per dataset",
      description: "Additional data enrichment including analytics, insights, and metadata",
      icon: BarChart3
    },
    {
      name: "Real-Time Data Delivery",
      price: "$49",
      unit: "per month",
      description: "Instant data delivery via API, webhook, or real-time dashboard",
      icon: Zap
    },
    {
      name: "Team Management",
      price: "$19",
      unit: "per user/month",
      description: "Multi-user access with role-based permissions and data distribution",
      icon: Users
    }
  ];

  const faqs = [
    {
      question: "How are datasets priced?",
      answer: "Datasets are priced based on quality, data completeness, and exclusivity. Premium datasets typically range from $10-50 per dataset, while specialized datasets can range from $25-100 per dataset."
    },
    {
      question: "What's included in the data quality guarantee?",
      answer: "If a dataset doesn't meet our quality standards (incomplete data, outdated information, etc.), we'll replace it at no charge within 30 days of purchase."
    },
    {
      question: "Can I customize my data criteria?",
      answer: "Yes! Professional and Enterprise plans include advanced filtering by industry, demographics, geography, data type, and more. Enterprise customers can request custom data generation."
    },
    {
      question: "Are the datasets exclusive?",
      answer: "We offer both shared and exclusive datasets. Exclusive datasets cost more but are only sold to one customer. Shared datasets may be sold to 2-3 customers maximum."
    },
    {
      question: "What compliance measures do you have?",
      answer: "All datasets are GDPR compliant, privacy-scrubbed, and consent-verified. We maintain detailed records for compliance audits and provide certificates of compliance."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Transparent Pricing</h1>
            <p className="text-lg text-green-100 mb-6 max-w-3xl mx-auto">
              Choose the perfect plan for your data intelligence business. No hidden fees, no surprises.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace" className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors text-center">
                Start Free Trial
              </Link>
              <Link to="/contact" className="border-2 border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options designed to scale with your data intelligence business
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${plan.popular ? 'ring-2 ring-green-600' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25' 
                      : 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                  }`} onClick={() => window.location.href = '/marketplace'}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enhance Your Plan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Add powerful features to supercharge your data intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => {
              const IconComponent = addon.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{addon.name}</h3>
                  
                  <div className="mb-3">
                    <span className="text-lg font-bold text-gray-900">{addon.price}</span>
                    <span className="text-gray-600 text-sm ml-1">{addon.unit}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Data Intelligence?</h2>
          <p className="text-lg text-green-100 mb-6 max-w-2xl mx-auto">
            Join thousands of successful businesses who trust DataCSV for their data intelligence needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors text-center">
              Start Free Trial
            </Link>
            <Link to="/contact" className="border-2 border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;