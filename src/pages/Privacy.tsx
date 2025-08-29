import React from 'react';
import { Shield, Lock, Eye, Database, Users, AlertTriangle } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Your privacy is important to us. This policy explains how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 15, 2024</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Information We Collect */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Billing and payment information</li>
                <li>Account credentials and authentication data</li>
                <li>Professional information and company details</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">Usage Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Log data including IP addresses and browser information</li>
                <li>Usage patterns and feature interactions</li>
                <li>API calls and data access patterns</li>
                <li>Performance metrics and error logs</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6">Lead Import Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Lead information imported from connected platforms</li>
                <li>Campaign configuration and mapping settings</li>
                <li>Quality scores and filtering preferences</li>
                <li>Balance and transaction history</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our data marketplace services</li>
                <li>Process payments and manage your account</li>
                <li>Import and process leads from connected platforms</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate about your account and service updates</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations and industry standards</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>We do not sell your personal information. We may share information in these limited circumstances:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform</li>
                <li><strong>Data Providers:</strong> When you purchase data, with the relevant data provider</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption in transit and at rest using AES-256</li>
                <li>Multi-factor authentication and access controls</li>
                <li>Regular security audits and penetration testing</li>
                <li>SOC 2 Type II compliance certification</li>
                <li>GDPR and CCPA compliance frameworks</li>
                <li>24/7 security monitoring and incident response</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we use your data</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@datacsv.com" className="text-green-600 hover:underline">
                  privacy@datacsv.com
                </a>
              </p>
            </div>
          </section>

          {/* Lead Import Specific */}
          <section>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Lead Import Privacy Notice</h3>
              <div className="text-green-800 space-y-2">
                <p>When you use our Lead Import feature:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>We process leads according to your configured filters and preferences</li>
                  <li>Lead data is encrypted and stored securely in your account</li>
                  <li>We maintain audit logs of all lead processing activities</li>
                  <li>You remain the data controller for all imported lead information</li>
                  <li>We comply with platform-specific privacy requirements (Facebook, Google, etc.)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="text-gray-700">
              <p>If you have questions about this Privacy Policy, contact us:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> privacy@datacsv.com</p>
                <p><strong>Address:</strong> DataCSV Privacy Team, 123 Data Street, Tech City, TC 12345</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
