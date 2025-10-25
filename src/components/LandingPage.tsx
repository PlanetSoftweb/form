import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FormInput, ArrowRight, Layout, Star, BarChart2, Zap, Shield, Globe, Menu, X, Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from './SEO';

export const LandingPage = () => {
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: 'AI-Powered Generation',
      description: 'Simply describe what you need, and our AI creates a complete, professional form in seconds. No manual work required.'
    },
    {
      icon: <Layout className="h-8 w-8 text-blue-500" />,
      title: 'Drag-and-Drop Builder',
      description: 'Customize every detail with our visual editor. Add fields, adjust styling, and preview changes instantly.'
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-green-500" />,
      title: 'Real-Time Analytics',
      description: 'Track submissions, visualize data trends, and export results. Make informed decisions with powerful insights.'
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption, GDPR compliance, and secure data storage. Your data is protected 24/7.'
    },
    {
      icon: <Globe className="h-8 w-8 text-indigo-500" />,
      title: 'Publish Anywhere',
      description: 'Share forms via link, embed on your website, or integrate with your tools. Works on all devices.'
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: 'No Coding Required',
      description: 'Build professional forms without technical skills. Perfect for teams, marketers, and businesses.'
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content: "AI FormBuilder saved me hours! I created a customer feedback form in literally 10 seconds. The AI knew exactly what fields I needed."
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateLabs",
      content: "Game-changer for our team. We went from spending hours designing forms to generating them instantly with AI. The analytics are incredible too!"
    },
    {
      name: "Emma Davis",
      role: "HR Manager",
      company: "GlobalTech",
      content: "Perfect for employee surveys and onboarding forms. The AI generates professional forms every time, and our data collection is now seamless."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO />
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
                AI FormBuilder
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </Link>
              <Link to="/templates" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Templates
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </Link>
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
            
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center p-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg text-blue-600 hover:bg-white/90 transition-all"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="px-4 py-6 space-y-4">
                  <Link
                    to="/features"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    to="/templates"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-colors"
                  >
                    Templates
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-colors"
                  >
                    Pricing
                  </Link>
                  {user ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-blue-600 text-white text-center rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-blue-600 text-white text-center rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20 mb-16 px-4 relative"
          >
            {/* Animated background elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 -z-10"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 -z-10"
            />

            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI-Powered Form Builder
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-8 leading-tight">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
              >
                Create Forms
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
              >
                in Seconds
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-medium mb-4 max-w-4xl mx-auto leading-relaxed"
            >
              Just{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="text-blue-600 font-bold"
              >
                describe
              </motion.span>
              {' '}what you need. Our AI{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                className="text-purple-600 font-bold"
              >
                instantly generates
              </motion.span>
              {' '}professional forms.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto"
            >
              No design skills. No coding. No templates needed. Just pure AI magic. ✨
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              {!user && (
                <>
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-xl font-bold text-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center">
                      Start Building Free
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center px-10 py-5 bg-white rounded-2xl text-xl font-bold text-gray-800 shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-blue-400 transition-all"
                  >
                    See How It Works
                  </Link>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm"
            >
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-semibold text-gray-700">Free to Start</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-gray-700">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className="font-semibold text-gray-700">10,000+ Users</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* How It Works Section - Enhanced */}
      <div className="px-4 sm:px-6 lg:px-8 mb-24 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                Simple 3-Step Process
              </span>
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From idea to published form in less than 60 seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-32 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 -z-10" />

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Describe Your Form</h3>
                <p className="text-gray-700 leading-relaxed">
                  Simply type "Create a contact form" or "Employee satisfaction survey" - our AI understands natural language perfectly.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-3xl p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-xl relative">
                  2
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Generates Instantly</h3>
                <p className="text-gray-700 leading-relaxed">
                  Watch the magic happen! AI creates a complete form with all fields, validations, styling, and even smart logic—all in seconds.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-3xl p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Publish & Share</h3>
                <p className="text-gray-700 leading-relaxed">
                  Customize if you want, then click publish. Get a shareable link, embed code, or integrate with your favorite tools instantly.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section - Clean & Advanced */}
      <div className="px-4 sm:px-6 lg:px-8 py-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Everything you need.<br />Nothing you don't.
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Professional form building tools that work together seamlessly
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-gray-200 rounded-3xl overflow-hidden">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white p-10 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="inline-flex p-3 rounded-2xl bg-gray-50 group-hover:bg-white group-hover:shadow-lg transition-all duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center"
          >
            <div className="group">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3 group-hover:scale-110 transition-transform">
                10,000+
              </div>
              <p className="text-gray-600 text-lg">Active Users</p>
            </div>
            <div className="group">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-3 group-hover:scale-110 transition-transform">
                50,000+
              </div>
              <p className="text-gray-600 text-lg">Forms Created</p>
            </div>
            <div className="group">
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-blue-600 mb-3 group-hover:scale-110 transition-transform">
                99.9%
              </div>
              <p className="text-gray-600 text-lg">Uptime Guarantee</p>
            </div>
          </motion.div>
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

      {/* CTA Section - Clean & Modern */}
      <div className="px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Ready to create forms<br />in seconds?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join 10,000+ users who trust AI FormBuilder to generate professional forms instantly.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group inline-flex items-center px-10 py-5 bg-blue-600 rounded-2xl text-xl font-semibold text-white hover:bg-blue-700 shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started Free
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center px-10 py-5 bg-white border-2 border-gray-200 rounded-2xl text-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                View Features
              </Link>
            </div>
          )}
          <p className="mt-8 text-sm text-gray-500">
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </div>
    </div>
  );
};