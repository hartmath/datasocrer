import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Mike Rodriguez",
      role: "Senior Insurance Agent",
      company: "Rodriguez Insurance Group",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "Data Sorcerer's health insurance leads have transformed my business. I've increased my monthly sales by 300% with their pre-qualified prospects.",
      rating: 5
    },
    {
      name: "Jennifer Walsh",
      role: "Life Insurance Specialist",
      company: "Walsh Financial Services",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "The Medicare supplement leads are incredible. High-quality prospects that actually convert. My closing rate has never been higher!",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Insurance Broker",
      company: "Thompson & Associates",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      content: "I've tried multiple lead providers, but Data Sorcerer stands out with their verified leads and outstanding customer support.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Trusted by Insurance Professionals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of insurance agents that rely on our premium leads to drive their sales success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-gray-300 mb-4" />
              
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <p className="text-blue-600 text-sm font-medium">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Insurance Sales?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join the elite circle of top-performing agents. Start with our premium insurance leads today.
            </p>
            <Link to="/pricing" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;