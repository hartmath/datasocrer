import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Target, Award, Shield, Globe, TrendingUp, Heart, Zap } from 'lucide-react';

const About = () => {
  const stats = [
    { number: "2M+", label: "Insurance Leads Generated", icon: Target },
    { number: "50K+", label: "Agents Served", icon: Users },
    { number: "95%+", label: "Data Accuracy Rate", icon: Award },
    { number: "15+", label: "Years of Experience", icon: TrendingUp }
  ];

  const values = [
    {
      icon: Shield,
      title: "Compliance First",
      description: "Every lead is TCPA compliant, DNC scrubbed, and opt-in verified. We maintain the highest standards of regulatory compliance."
    },
    {
      icon: Heart,
      title: "Agent Success",
      description: "Your success is our mission. We're committed to providing leads that convert and support that exceeds expectations."
    },
    {
      icon: Globe,
      title: "Nationwide Coverage",
      description: "From coast to coast, we provide comprehensive coverage across all 50 states with local market expertise."
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description: "We leverage cutting-edge technology and data science to continuously improve lead quality and delivery."
    }
  ];

  const team = [
    {
      name: "Michael Chen",
      role: "CEO & Founder",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "Former insurance agent with 20+ years in the industry. Founded Data Sorcerer to solve the lead quality problem he experienced firsthand."
    },
    {
      name: "Sarah Rodriguez",
      role: "VP of Data Operations",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "Data scientist with expertise in lead generation and predictive analytics. Ensures our leads meet the highest quality standards."
    },
    {
      name: "David Thompson",
      role: "Head of Compliance",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "Former regulatory attorney specializing in insurance and telemarketing compliance. Keeps us ahead of regulatory changes."
    },
    {
      name: "Jennifer Walsh",
      role: "VP of Customer Success",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
      bio: "Insurance industry veteran focused on agent success. Leads our customer support and success initiatives."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">About Data Sorcerer</h1>
            <p className="text-lg text-blue-100 mb-6 max-w-4xl mx-auto">
              For over 15 years, we've been the trusted partner for insurance agents nationwide, 
              providing premium leads and data solutions that drive real results.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                To empower insurance agents with the highest quality leads and data solutions, 
                enabling them to build successful, sustainable businesses while maintaining the 
                highest standards of compliance and ethical practices.
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                We believe that success in insurance sales starts with quality leads. That's why 
                we've dedicated ourselves to perfecting the art and science of lead generation, 
                combining advanced technology with deep industry expertise.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Insurance professionals working"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Industry veterans dedicated to your success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join Our Success Story?</h2>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Discover why thousands of insurance agents trust Data Sorcerer for their lead generation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
              Start Free Trial
            </button>
            <button className="border-2 border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;