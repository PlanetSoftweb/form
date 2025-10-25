import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Shield className="h-4 w-4" />
            Privacy Policy
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last Updated: October 2025</p>
          <p className="text-sm text-gray-500 mt-2">Created by PlanetSoftweb</p>
        </motion.div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              AI FormBuilder ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our form building platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Personal Information</h3>
            <p className="text-gray-600 mb-4">We collect information that you provide directly to us when you:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Create an account (email address, name)</li>
              <li>Build and publish forms</li>
              <li>Submit responses to forms</li>
              <li>Contact our support team</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-600 mb-4">When you use our platform, we automatically collect:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Device information (browser type, operating system)</li>
              <li>Usage data (pages visited, features used)</li>
              <li>IP address and general location</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and manage your account</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect and prevent security threats</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication via Firebase</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure cloud storage through Firebase/Google Cloud</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>With service providers (Firebase/Google for infrastructure)</li>
              <li>When required by law</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your personal information</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise these rights, contact us at support@formbuilder.com
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <p className="text-gray-700"><strong>Email:</strong> support@formbuilder.com</p>
              <p className="text-gray-700 mt-2"><strong>Company:</strong> PlanetSoftweb</p>
              <p className="text-gray-700 mt-2">
                <strong>Website:</strong>{' '}
                <a href="https://planetsoftweb.com" className="text-blue-600 hover:text-blue-700">
                  planetsoftweb.com
                </a>
              </p>
            </div>
          </section>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} AI FormBuilder by PlanetSoftweb
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
