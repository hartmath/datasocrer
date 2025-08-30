import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, Clock, Search, HelpCircle, Book, Users } from 'lucide-react';

const Support = () => {
  const [supportForm, setSupportForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSupportFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setSupportForm({
      ...supportForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Support form submitted:', supportForm);
      alert('Thank you for contacting support! We will get back to you within 4 hours during business hours.');
      
      // Reset form
      setSupportForm({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting support form:', error);
      alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
    }
  };

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7 for Enterprise customers",
      action: "Start Chat",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      availability: "Response within 4 hours",
      action: "Send Email",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      availability: "Mon-Fri, 9AM-6PM PST",
      action: "Call Now",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Book,
      title: "Documentation",
      description: "Browse our comprehensive knowledge base",
      availability: "Available 24/7",
      action: "Browse Docs",
      color: "from-orange-500 to-red-500"
    }
  ];

  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "You can create an account by clicking the 'Sign Up' button in the top right corner of our homepage. Fill in your details and verify your email address to get started."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers. All payments are processed securely through our encrypted payment system."
        },
        {
          question: "How do I download datasets?",
          answer: "After purchasing a dataset, you can download it from your dashboard. We support multiple formats including CSV, JSON, XML, and API access for real-time data."
        }
      ]
    },
    {
      title: "Data & APIs",
      questions: [
        {
          question: "How often is data updated?",
          answer: "Update frequency varies by dataset. Real-time datasets are updated continuously, while others may be updated daily, weekly, or monthly. Check each dataset's details for specific update schedules."
        },
        {
          question: "What API rate limits apply?",
          answer: "Rate limits depend on your subscription plan. Professional plans include 1,000 requests per hour, while Enterprise plans offer unlimited requests with guaranteed SLA."
        },
        {
          question: "Can I get historical data?",
          answer: "Yes, many of our datasets include historical data going back several years. The availability of historical data varies by provider and is clearly indicated in each dataset's description."
        }
      ]
    },
    {
      title: "Billing & Pricing",
      questions: [
        {
          question: "Can I cancel my subscription anytime?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
        },
        {
          question: "Do you offer refunds?",
          answer: "We offer a 30-day money-back guarantee for all new subscriptions. For specific datasets, refund policies may vary depending on the data provider's terms."
        },
        {
          question: "Are there volume discounts available?",
          answer: "Yes, we offer significant discounts for high-volume usage and enterprise customers. Contact our sales team to discuss custom pricing based on your needs."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-green-900/20 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Support Sanctuary
            </h1>
            <p className="text-xl lg:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Need assistance with your data sorcery? Our support wizards are here to help you master the arcane arts
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for help articles, guides, or common issues..."
                  className="w-full pl-14 pr-6 py-4 text-lg bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-white placeholder-gray-300"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/25">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(0,255,65,0.3)]">
              How Can We Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the support option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 text-center">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${option.color} mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {option.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {option.description}
                  </p>
                  
                  <div className="flex items-center justify-center mb-6 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {option.availability}
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/25">
                    {option.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(0,255,65,0.3)]">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our platform
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {faqCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <HelpCircle className="w-6 h-6 mr-3 text-green-600" />
                  {category.title}
                </h3>
                
                <div className="space-y-6">
                  {category.questions.map((faq, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-6 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(0,255,65,0.3)]">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600">
              Send us a message and we'll get back to you as soon as possible
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSupportSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={supportForm.firstName}
                    onChange={handleSupportFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={supportForm.lastName}
                    onChange={handleSupportFormChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={supportForm.email}
                  onChange={handleSupportFormChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select 
                  name="subject"
                  value={supportForm.subject}
                  onChange={handleSupportFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Billing Question</option>
                  <option>Data Request</option>
                  <option>Partnership Opportunity</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={supportForm.message}
                  onChange={handleSupportFormChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your question or issue in detail..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-green-500/25"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-green-900/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Connect with other data sorcerers, share knowledge, and learn from the community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              Join Discord
            </button>
            <button className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center hover:bg-white/10">
              <MessageCircle className="w-5 h-5 mr-2" />
              Community Forum
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Support;