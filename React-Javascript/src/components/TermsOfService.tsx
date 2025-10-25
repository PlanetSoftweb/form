import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <FileText className="h-4 w-4" />
            Terms of Service
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last Updated: October 2025</p>
          <p className="text-sm text-gray-500 mt-2">Created by PlanetSoftweb</p>
        </motion.div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to AI FormBuilder, a product of PlanetSoftweb. By accessing or using our platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-600 mb-4">
              We grant you a limited, non-exclusive, non-transferable license to use AI FormBuilder for your personal or business purposes.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">You May:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Create, edit, and publish forms</li>
              <li>Use AI to generate forms</li>
              <li>Collect and manage form submissions</li>
              <li>Embed forms on your websites</li>
              <li>Export your data at any time</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">You May Not:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Reverse engineer or extract source code</li>
              <li>Use the service for illegal purposes</li>
              <li>Transmit viruses or harmful code</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Remove proprietary notices</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
            <p className="text-gray-600 mb-4">To use AI FormBuilder, you must create an account. You agree to:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Notify us of unauthorized account use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Ownership</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Your Content</h3>
            <p className="text-gray-600 mb-4">
              You retain all rights to the forms you create and data you collect. By using our service, you grant us a limited license to host and display your content solely for providing the service.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Our Content</h3>
            <p className="text-gray-600">
              The AI FormBuilder platform, including its design and technology, is owned by PlanetSoftweb and protected by intellectual property laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data and Privacy</h2>
            <p className="text-gray-600 mb-4">Your use of AI FormBuilder is governed by our Privacy Policy. Key points:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>You're responsible for obtaining necessary consents from form respondents</li>
              <li>We use Firebase for secure data storage</li>
              <li>You must comply with applicable data protection laws</li>
              <li>You can export and delete your data at any time</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
              <p className="text-gray-700 leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not guarantee uninterrupted or error-free operation.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
              <p className="text-gray-700 leading-relaxed">
                PlanetSoftweb shall not be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid us in the twelve (12) months before the event, or $100, whichever is greater.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account for violations of these Terms. You may terminate your account at any time by contacting us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these Terms at any time. We will notify users of material changes. Your continued use after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
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
