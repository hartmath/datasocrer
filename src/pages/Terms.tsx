import React from 'react';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Scale className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            These terms govern your use of DataCSV platform and services.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 15, 2024</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Acceptance */}
          <section>
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>
                By accessing or using DataCSV ("the Platform", "our Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access or use the Service, including the Lead Import functionality.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Service Description</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>DataCSV is a premium data marketplace that provides:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access to verified data providers and datasets</li>
                <li>Automated lead import from advertising platforms</li>
                <li>Data quality scoring and filtering tools</li>
                <li>Real-time balance management and billing</li>
                <li>Analytics and reporting capabilities</li>
                <li>API access and integration tools</li>
              </ul>
            </div>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
            <div className="text-gray-700 space-y-4">
              <h3 className="text-lg font-semibold">Account Registration</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One person or entity may not maintain multiple accounts</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">Account Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Keep your login credentials confidential</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>You are responsible for all activities under your account</li>
                <li>Maintain accurate billing and contact information</li>
              </ul>
            </div>
          </section>

          {/* Lead Import Terms */}
          <section>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Lead Import Service Terms</h3>
              <div className="text-blue-800 space-y-3">
                <p><strong>Platform Integration:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You must have valid credentials for connected platforms (Facebook, Google, etc.)</li>
                  <li>You are responsible for compliance with platform-specific terms</li>
                  <li>We are not liable for platform policy changes or access restrictions</li>
                </ul>

                <p><strong>Billing and Charges:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Charges are based on successfully imported leads</li>
                  <li>Auto-recharge settings are your responsibility to manage</li>
                  <li>No refunds for leads that meet your configured quality criteria</li>
                  <li>Dispute any charges within 30 days of transaction</li>
                </ul>

                <p><strong>Data Quality:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Quality scores are calculated using our proprietary algorithms</li>
                  <li>You can configure minimum quality thresholds</li>
                  <li>We do not guarantee lead conversion rates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Terms</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <h3 className="text-lg font-semibold">Billing</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices are in US Dollars unless otherwise specified</li>
                <li>Payments are processed securely through Stripe</li>
                <li>You authorize us to charge your payment method for all fees</li>
                <li>Failed payments may result in service suspension</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">Refunds</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account credits are non-refundable unless required by law</li>
                <li>Refunds for technical errors processed within 5 business days</li>
                <li>Contact support within 30 days for refund requests</li>
                <li>Partial refunds may be issued for unused account credits</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptable Use Policy</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <p>You agree NOT to use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit spam, malware, or harmful content</li>
                <li>Attempt to gain unauthorized access to systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use data for illegal or unethical purposes</li>
                <li>Violate TCPA, CAN-SPAM, or GDPR regulations</li>
                <li>Resell or redistribute data without permission</li>
              </ul>
            </div>
          </section>

          {/* Data Use and Compliance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Use and Compliance</h2>
            <div className="text-gray-700 space-y-4">
              <h3 className="text-lg font-semibold">TCPA Compliance</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You must comply with Telephone Consumer Protection Act requirements</li>
                <li>Obtain proper consent before contacting leads</li>
                <li>Maintain opt-out mechanisms and honor requests</li>
                <li>Keep records of consent and contact attempts</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">Data Protection</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with GDPR, CCPA, and applicable privacy laws</li>
                <li>Implement appropriate data security measures</li>
                <li>Respect individual privacy rights and preferences</li>
                <li>Report any data breaches within 24 hours</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Disclaimers and Limitations</h2>
            </div>
            <div className="text-gray-700 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-amber-900 mb-2">Service Availability</p>
                <p className="text-amber-800">
                  The Service is provided "as is" without warranties. We do not guarantee uninterrupted access, 
                  specific lead quality, or conversion rates. Platform integrations may be affected by third-party changes.
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold text-red-900 mb-2">Limitation of Liability</p>
                <p className="text-red-800">
                  Our liability is limited to the amount paid for the specific service that caused the issue. 
                  We are not liable for indirect, consequential, or punitive damages.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <div className="text-gray-700 space-y-4">
              <p>We may terminate or suspend your account for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Extended inactivity</li>
              </ul>
              <p>You may terminate your account at any time by contacting support.</p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <div className="text-gray-700">
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be notified via email 
                or platform notification 30 days in advance. Continued use after changes constitutes acceptance.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="text-gray-700">
              <p>For questions about these Terms, contact us:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> legal@datacsv.com</p>
                <p><strong>Address:</strong> DataCSV Legal Team, 123 Data Street, Tech City, TC 12345</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
