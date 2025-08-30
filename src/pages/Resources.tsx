import React, { useState } from 'react';
import { BookOpen, Video, FileText, Code, Users, Lightbulb, Download, ExternalLink } from 'lucide-react';

const Resources = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing! We'll send updates to ${email}`);
      setEmail('');
    }
  };

  const resourceCategories = [
    {
      title: "Documentation",
      icon: BookOpen,
      description: "Comprehensive guides and API documentation",
      color: "from-blue-500 to-cyan-500",
      resources: [
        { title: "Getting Started Guide", type: "Guide", readTime: "10 min" },
        { title: "API Reference", type: "Documentation", readTime: "30 min" },
        { title: "Data Integration Best Practices", type: "Guide", readTime: "15 min" },
        { title: "Authentication & Security", type: "Documentation", readTime: "20 min" }
      ]
    },
    {
      title: "Video Tutorials",
      icon: Video,
      description: "Step-by-step video guides and webinars",
      color: "from-purple-500 to-pink-500",
      resources: [
        { title: "Data Sorcerer Platform Overview", type: "Video", readTime: "25 min" },
        { title: "Building Your First Data Pipeline", type: "Tutorial", readTime: "45 min" },
        { title: "Advanced Analytics Techniques", type: "Webinar", readTime: "60 min" },
        { title: "Enterprise Data Governance", type: "Webinar", readTime: "40 min" }
      ]
    },
    {
      title: "White Papers",
      icon: FileText,
      description: "In-depth research and industry insights",
      color: "from-green-500 to-emerald-500",
      resources: [
        { title: "The Future of Data Marketplaces", type: "White Paper", readTime: "25 min" },
        { title: "Data Quality in Enterprise Analytics", type: "Research", readTime: "35 min" },
        { title: "Privacy-First Data Strategies", type: "White Paper", readTime: "20 min" },
        { title: "ROI of Premium Data Sources", type: "Case Study", readTime: "15 min" }
      ]
    },
    {
      title: "Code Examples",
      icon: Code,
      description: "Sample code and integration examples",
      color: "from-orange-500 to-red-500",
      resources: [
        { title: "Python SDK Examples", type: "Code", readTime: "5 min" },
        { title: "JavaScript Integration", type: "Code", readTime: "8 min" },
        { title: "R Data Analysis Scripts", type: "Code", readTime: "12 min" },
        { title: "SQL Query Templates", type: "Code", readTime: "6 min" }
      ]
    },
    {
      title: "Community",
      icon: Users,
      description: "Connect with other data professionals",
      color: "from-indigo-500 to-blue-500",
      resources: [
        { title: "Developer Forum", type: "Community", readTime: "Ongoing" },
        { title: "Data Science Slack Channel", type: "Community", readTime: "Ongoing" },
        { title: "Monthly User Meetups", type: "Event", readTime: "2 hours" },
        { title: "Annual Data Conference", type: "Event", readTime: "3 days" }
      ]
    },
    {
      title: "Use Cases",
      icon: Lightbulb,
      description: "Real-world applications and success stories",
      color: "from-yellow-500 to-orange-500",
      resources: [
        { title: "Financial Risk Modeling", type: "Use Case", readTime: "20 min" },
        { title: "E-commerce Personalization", type: "Use Case", readTime: "18 min" },
        { title: "Supply Chain Optimization", type: "Use Case", readTime: "25 min" },
        { title: "Healthcare Analytics", type: "Use Case", readTime: "22 min" }
      ]
    }
  ];

  const featuredResources = [
    {
      title: "Complete Guide to Data Integration",
      description: "Learn how to seamlessly integrate external data sources into your existing workflows and systems.",
      type: "Guide",
      readTime: "45 min",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      featured: true
    },
    {
      title: "Building Scalable Data Pipelines",
      description: "Best practices for creating robust, scalable data processing pipelines that grow with your business.",
      type: "Tutorial",
      readTime: "60 min",
      image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      featured: true
    },
    {
      title: "Data Privacy and Compliance Framework",
      description: "Navigate the complex landscape of data privacy regulations and build compliant data strategies.",
      type: "White Paper",
      readTime: "30 min",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop",
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Knowledge Grimoire
            </h1>
            <p className="text-xl lg:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Master the arcane arts of data with our comprehensive collection of guides, tutorials, and mystical knowledge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Browse All Resources
              </button>
              <button className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-4">
              Featured Scrolls
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential knowledge for data sorcerers at every level
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {featuredResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <img 
                  src={resource.image} 
                  alt={resource.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      {resource.type}
                    </span>
                    <span className="text-sm text-gray-500">{resource.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-700 cursor-pointer">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {resource.description}
                  </p>
                  <button className="flex items-center text-green-600 hover:text-green-700 font-semibold">
                    Read More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-800 via-indigo-700 to-blue-800 bg-clip-text text-transparent mb-4">
              Arcane Knowledge Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our vast library of resources organized by discipline
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${category.color} mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {category.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="space-y-3">
                    {category.resources.map((resource, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                          <p className="text-xs text-gray-500">{resource.type}</p>
                        </div>
                        <span className="text-xs text-gray-500">{resource.readTime}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/25">
                    Explore {category.title}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-green-900/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent mb-4 drop-shadow-[0_0_20px_rgba(0,255,65,0.3)]">
            Stay Updated with the Latest Spells
          </h2>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive the latest data insights, tutorials, and industry updates
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button type="submit" className="bg-white text-green-900 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Resources;