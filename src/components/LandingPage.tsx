import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FormInput, ArrowRight, CheckCircle, Layout, Star, Users, BarChart2, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  const { user } = useAuthStore();

  const features = [
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: 'Easy Form Building',
      description: 'Create beautiful forms with our intuitive drag-and-drop builder. No coding required.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team on form projects in real-time.'
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-green-500" />,
      title: 'Advanced Analytics',
      description: 'Get detailed insights and visualizations from your form submissions.'
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: 'AI-Powered Forms',
      description: 'Generate forms automatically using our advanced AI technology.'
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with data encryption and GDPR compliance.'
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-500" />,
      title: 'Global Accessibility',
      description: 'Forms that work everywhere, in multiple languages and time zones.'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content: "FormBuilder has transformed how we collect customer feedback. The AI-powered form generation is a game-changer!"
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateLabs",
      content: "The analytics dashboard provides invaluable insights. It's helped us make data-driven decisions faster than ever."
    },
    {
      name: "Emma Davis",
      role: "HR Manager",
      company: "GlobalTech",
      content: "Setting up employee surveys has never been easier. The templates save us hours of work every week."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-50 blur-3xl" />
        </div>

        <div className="relative pt-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                <FormInput className="h-8 w-8 text-blue-600" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                FormBuilder
              </span>
            </div>
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg text-blue-600 hover:bg-white/90 transition-all"
              >
                <Layout className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg text-blue-600 hover:bg-white/90 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20 mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Build Forms That Convert
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create beautiful, intelligent forms in minutes. Powered by AI, designed for results.
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-blue-600 rounded-xl text-lg font-medium text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="bg-white/80 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-md">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-lg"
              >
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.name[0]}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg max-w-4xl mx-auto p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Forms?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of businesses using FormBuilder to create better forms and collect better data.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white rounded-xl text-lg font-medium text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};