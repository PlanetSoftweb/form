import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Check, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AuthLayout } from './styles/AuthLayout';
import { Step1, Step2, Step3, Step4 } from './RegisterSteps';
import { GoogleSignInButton } from './GoogleSignInButton';

export const Register = () => {
  const { signUp, loading, error } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    industry: '',
    interests: [] as string[],
    additionalInfo: ''
  });
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      try {
        await signUp(formData.email, formData.password, formData);
        setRegistered(true);
      } catch (error) {
        // Error is handled by the auth store
      }
    }
  };

  if (registered) {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle="Please check your inbox to complete registration"
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-gray-600 mb-8">
            We've sent a verification email to <strong>{formData.email}</strong>. 
            Please click the link in the email to verify your account.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={`Step ${step} of 4`}
      subtitle={[
        'Create your account',
        'Tell us about yourself',
        'Select your industry',
        'Choose your interests'
      ][step - 1]}
    >
      {step === 1 && (
        <div className="w-full space-y-6 mb-8">
          <GoogleSignInButton text="Sign up with Google" />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-lg">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="relative">
          <div className="overflow-hidden h-2 flex rounded-full bg-gray-200">
            <motion.div
              className="bg-blue-600"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 rounded-xl text-red-600"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {step === 1 && <Step1 currentStep={step} formData={formData} setFormData={setFormData} />}
            {step === 2 && <Step2 currentStep={step} formData={formData} setFormData={setFormData} />}
            {step === 3 && <Step3 currentStep={step} formData={formData} setFormData={setFormData} />}
            {step === 4 && <Step4 currentStep={step} formData={formData} setFormData={setFormData} />}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <motion.button
              type="button"
              onClick={() => setStep(step - 1)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center px-6 py-3 text-lg font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </motion.button>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-lg text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Sign in instead
            </Link>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center px-8 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                {step === 4 ? (
                  <>
                    Complete
                    <Check className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </AuthLayout>
  );
};