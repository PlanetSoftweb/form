import { Link } from 'react-router-dom';
import { Home, Search, HelpCircle, ArrowLeft, FormInput } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6">
            <span className="text-6xl font-bold text-gray-300">404</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Here's what you can do:
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <FormInput className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/help"
              className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Help Center
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Search className="h-5 w-5 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>

        <div className="text-gray-600">
          <p className="mb-2">
            If you believe this is an error, please <Link to="/contact" className="text-blue-600 hover:underline">contact support</Link>.
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Go back to previous page
          </button>
        </div>
      </div>
    </div>
  );
};
