import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building2, Briefcase, Target } from 'lucide-react';
import { AuthInput } from './styles/AuthInput';

interface StepProps {
  currentStep: number;
  formData: any;
  setFormData: (data: any) => void;
}

export const Step1 = ({ formData, setFormData }: StepProps) => (
  <div className="space-y-6">
    <AuthInput
      icon={Mail}
      label="Email address"
      type="email"
      required
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      placeholder="Enter your email"
    />

    <AuthInput
      icon={Lock}
      label="Password"
      type="password"
      required
      value={formData.password}
      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      placeholder="Create a password"
      minLength={6}
    />
  </div>
);

export const Step2 = ({ formData, setFormData }: StepProps) => (
  <div className="space-y-6">
    <AuthInput
      icon={User}
      label="Full name"
      type="text"
      required
      value={formData.fullName}
      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      placeholder="Enter your full name"
    />

    <AuthInput
      icon={Building2}
      label="Company name"
      type="text"
      required
      value={formData.companyName}
      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
      placeholder="Enter your company name"
    />
  </div>
);

export const Step3 = ({ formData, setFormData }: StepProps) => (
  <div className="space-y-6">
    <div>
      <label className="block text-xl font-medium text-gray-700 mb-3">
        Industry
      </label>
      <div className="grid grid-cols-2 gap-4">
        {[
          'Technology',
          'Healthcare',
          'Education',
          'Finance',
          'Manufacturing',
          'Retail',
          'Other'
        ].map((industry) => (
          <motion.button
            key={industry}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFormData({ ...formData, industry })}
            className={`p-4 text-left border rounded-xl transition-colors ${
              formData.industry === industry
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <Briefcase className={`h-6 w-6 mb-2 ${
              formData.industry === industry ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <span className="block font-medium">{industry}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
);

export const Step4 = ({ formData, setFormData }: StepProps) => (
  <div className="space-y-6">
    <div>
      <label className="block text-xl font-medium text-gray-700 mb-3">
        Areas of Interest
      </label>
      <div className="grid grid-cols-2 gap-4">
        {[
          'Customer Feedback',
          'Employee Surveys',
          'Market Research',
          'Event Registration',
          'Lead Generation',
          'Education/Training'
        ].map((interest) => (
          <motion.button
            key={interest}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const interests = formData.interests.includes(interest)
                ? formData.interests.filter((i: string) => i !== interest)
                : [...formData.interests, interest];
              setFormData({ ...formData, interests });
            }}
            className={`p-4 text-left border rounded-xl transition-colors ${
              formData.interests.includes(interest)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <Target className={`h-6 w-6 mb-2 ${
              formData.interests.includes(interest) ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <span className="block font-medium">{interest}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
);