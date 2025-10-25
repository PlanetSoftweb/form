import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, Zap, Shield, BarChart3, Code, Globe, Users, Sparkles, 
  Bell, Lock, Download, Smartphone, Wand2, ArrowRight, CheckCircle 
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: Palette,
    title: 'Drag & Drop Builder',
    description: 'Intuitive visual builder that makes form creation effortless. Add, remove, and rearrange fields with ease.',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    icon: Zap,
    title: 'AI-Powered Generation',
    description: 'Create forms instantly using AI. Just describe what you need and let our AI build it for you.',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive analytics dashboard to track submissions, response rates, and user behavior.',
    color: 'bg-green-100 text-green-600'
  },
  {
    icon: Shield,
    title: 'Spam Protection',
    description: 'Built-in AI spam detection using TensorFlow.js to keep your submissions clean and relevant.',
    color: 'bg-red-100 text-red-600'
  },
  {
    icon: Code,
    title: 'Easy Embedding',
    description: 'Embed forms anywhere with a simple code snippet. Works on any website or platform.',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    icon: Globe,
    title: 'Custom Domains',
    description: 'Use your own domain for professional-looking forms that match your brand.',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    icon: Users,
    title: 'Real-time Collaboration',
    description: 'Work with your team in real-time. Multiple users can edit forms simultaneously.',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    icon: Sparkles,
    title: 'Beautiful Templates',
    description: 'Start with professionally designed templates and customize them to match your brand.',
    color: 'bg-cyan-100 text-cyan-600'
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Get notified immediately when someone submits your form via email or webhooks.',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'Bank-level encryption keeps your data safe. GDPR and CCPA compliant.',
    color: 'bg-teal-100 text-teal-600'
  },
  {
    icon: Download,
    title: 'Export Data',
    description: 'Export your form submissions to CSV, Excel, or integrate with your favorite tools.',
    color: 'bg-violet-100 text-violet-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Forms look perfect on any device. Optimized for desktop, tablet, and mobile.',
    color: 'bg-rose-100 text-rose-600'
  }
];

export const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 py-24">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="h-4 w-4" />
              Powerful Features
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Everything You Need to Succeed
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Built for creators, teams, and businesses. Packed with features to make form building a breeze.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                <feature.icon className="h-8 w-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 bg-white rounded-3xl p-12 shadow-xl border border-gray-100"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AI FormBuilder?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of users who trust us with their form needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50,000+</h3>
              <p className="text-gray-600">Forms Created</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">99.9%</h3>
              <p className="text-gray-600">Uptime</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <Wand2 className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users creating beautiful, professional forms with AI
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </motion.a>
              <p className="text-sm text-blue-100 mt-4">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
