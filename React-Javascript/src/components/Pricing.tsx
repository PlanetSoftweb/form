import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingPlan {
  name: string;
  price: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: '$0',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Perfect for getting started',
    icon: Zap,
    color: 'from-gray-500 to-gray-600',
    features: [
      'Up to 3 forms',
      '100 submissions per month',
      'Basic analytics',
      'Email notifications',
      'Community support',
      'FormBuilder branding'
    ]
  },
  {
    name: 'Pro',
    price: '$19',
    priceMonthly: 19,
    priceYearly: 190,
    description: 'For professionals and small teams',
    icon: Star,
    color: 'from-blue-500 to-purple-600',
    popular: true,
    features: [
      'Unlimited forms',
      '10,000 submissions per month',
      'Advanced analytics',
      'Priority email support',
      'Custom branding',
      'Spam protection',
      'Export to CSV/Excel',
      'Custom domains',
      'Form templates',
      'File uploads up to 10MB'
    ]
  },
  {
    name: 'Enterprise',
    price: '$99',
    priceMonthly: 99,
    priceYearly: 990,
    description: 'For large organizations',
    icon: Crown,
    color: 'from-purple-600 to-pink-600',
    features: [
      'Everything in Pro',
      'Unlimited submissions',
      'Advanced team collaboration',
      'Dedicated account manager',
      '99.9% uptime SLA',
      'Custom integrations',
      'API access',
      'White-label solution',
      'SSO authentication',
      'Priority phone support',
      'Custom contracts',
      'File uploads up to 100MB'
    ]
  }
];

export const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Free') {
      navigate('/register');
    } else {
      navigate('/subscription');
    }
  };

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
              Simple & Transparent
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
              Start for free, upgrade when you need more. No hidden fees, cancel anytime.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1.5 shadow-2xl border border-white/20"
            >
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-10 py-3.5 rounded-full font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white hover:text-blue-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-10 py-3.5 rounded-full font-semibold transition-all relative ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white hover:text-blue-100'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-400 text-green-900 px-2.5 py-1 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all ${
                plan.popular ? 'ring-4 ring-purple-500 md:scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              )}

              {plan.popular && (
                <div className="absolute top-6 right-6 z-10">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <TrendingUp className="h-3 w-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <plan.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-8">{plan.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${billingPeriod === 'yearly' && plan.priceYearly > 0
                        ? Math.floor(plan.priceYearly / 12)
                        : plan.priceMonthly}
                    </span>
                    <span className="text-gray-600 text-lg font-medium">/month</span>
                  </div>
                  {billingPeriod === 'yearly' && plan.priceYearly > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Billed ${plan.priceYearly} annually
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPlan(plan.name)}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all mb-8 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-2xl shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
                  <ArrowRight className="h-5 w-5" />
                </motion.button>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    What's Included:
                  </p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="h-3 w-3 text-green-600 stroke-[3]" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ/Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Plan?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Have specific requirements or need a tailored solution for your organization? 
              Our team is here to help you find the perfect fit.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/contact"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-lg group"
            >
              Contact Sales Team
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            <span>24/7 support</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
