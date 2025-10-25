import { useState } from 'react';
import { Check, Zap, Crown, Building2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

export const Subscription = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [currentPlan] = useState('free');

  const plans: Plan[] = [
    {
      name: 'Free',
      price: billingPeriod === 'monthly' ? '$0' : '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: <Zap className="h-8 w-8" />,
      color: 'gray',
      features: [
        '5 active forms',
        '100 submissions/month',
        'Basic form elements',
        'Email notifications',
        'Standard support',
        '7-day data retention',
      ]
    },
    {
      name: 'Pro',
      price: billingPeriod === 'monthly' ? '$29' : '$290',
      period: billingPeriod === 'monthly' ? 'per month' : 'per year',
      description: 'For professionals and small teams',
      icon: <Crown className="h-8 w-8" />,
      color: 'blue',
      popular: true,
      features: [
        'Unlimited forms',
        '10,000 submissions/month',
        'All form elements',
        'Advanced analytics',
        'Custom branding',
        'Priority support',
        'AI form generation',
        'File uploads (100MB)',
        'Custom domains',
        '90-day data retention',
        'Export to CSV/Excel',
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      icon: <Building2 className="h-8 w-8" />,
      color: 'purple',
      features: [
        'Everything in Pro',
        'Unlimited submissions',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantees',
        '24/7 phone support',
        'Advanced security',
        'SSO authentication',
        'Custom data retention',
        'White-label options',
        'API access',
        'Training & onboarding',
      ]
    }
  ];

  const handleUpgrade = (planName: string) => {
    if (planName === 'Free') {
      toast.success('You are already on the Free plan');
      return;
    }
    
    if (planName === 'Enterprise') {
      toast.success('Redirecting to contact form...');
      window.location.href = '/contact';
      return;
    }

    toast.success(`Upgrade to ${planName} - Payment integration coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select the perfect plan for your needs. Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Current Plan Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</p>
              <p className="text-sm text-gray-600">
                {currentPlan === 'free' 
                  ? 'Upgrade to unlock more features and higher limits'
                  : 'Thank you for being a valued customer!'}
              </p>
            </div>
            {currentPlan === 'free' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.popular ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <div className={`inline-flex p-3 rounded-lg bg-${plan.color}-100 text-${plan.color}-600 mb-4`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== 'Custom' && plan.price !== '$0' && (
                      <span className="text-gray-500 ml-2">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.period}</p>
                </div>

                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={currentPlan === plan.name.toLowerCase()}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6 flex items-center justify-center ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {currentPlan === plan.name.toLowerCase() ? 'Current Plan' : `Get ${plan.name}`}
                  {currentPlan !== plan.name.toLowerCase() && (
                    <ArrowRight className="ml-2 h-5 w-5" />
                  )}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600 text-sm">
                Yes! All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my limits?</h3>
              <p className="text-gray-600 text-sm">
                We'll notify you before you reach your limit. You can upgrade anytime or wait until next month.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing the right plan? Our team is here to help!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Sales
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
