import { Link } from 'react-router-dom';
import { FormInput, Sparkles } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <FormInput className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                AI FormBuilder
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">
              Create professional forms in seconds with AI. No coding required.
            </p>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              AI-Powered
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
              </li>
              <li>
                <Link to="/templates" className="text-gray-600 hover:text-blue-600 transition-colors">Templates</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
              </li>
              <li>
                <a href="https://planetsoftweb.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                  PlanetSoftweb
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-blue-600 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-600 hover:text-blue-600 transition-colors">Documentation</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>
              © {currentYear} AI FormBuilder. All rights reserved.
            </p>
            <p>
              Created by <a href="https://planetsoftweb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">PlanetSoftweb</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
