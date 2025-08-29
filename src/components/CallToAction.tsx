import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';

const CallToAction = () => {
  return (
    <section className="py-12 lg:py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of insurance professionals who trust our platform for their data needs.
          Start browsing premium datasets today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/marketplace" className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
            Browse Data Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link to="/contact" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
            <Phone className="mr-2 w-4 h-4" />
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;