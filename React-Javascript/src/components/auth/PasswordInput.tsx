import React, { useState } from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
  error?: string;
  showStrength?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ icon: Icon, label, error, showStrength = false, value = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = (password: string) => {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    };

    const getStrengthLabel = (strength: number) => {
      if (strength === 0) return { label: 'Very Weak', color: 'bg-red-500' };
      if (strength === 1) return { label: 'Weak', color: 'bg-orange-500' };
      if (strength === 2) return { label: 'Fair', color: 'bg-yellow-500' };
      if (strength === 3) return { label: 'Good', color: 'bg-blue-500' };
      if (strength === 4) return { label: 'Strong', color: 'bg-green-500' };
      return { label: 'Very Strong', color: 'bg-green-600' };
    };

    const strength = typeof value === 'string' ? getPasswordStrength(value) : 0;
    const strengthInfo = getStrengthLabel(strength);

    return (
      <div className="mb-6">
        <label className="block text-xl font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            {...props}
            className="block w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-6 w-6 text-gray-400" />
            ) : (
              <Eye className="h-6 w-6 text-gray-400" />
            )}
          </button>
        </div>
        {showStrength && typeof value === 'string' && value.length > 0 && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      i < strength ? strengthInfo.color : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{strengthInfo.label}</span>
            </div>
            <ul className="text-xs text-gray-500 mt-2 space-y-1">
              <li className={value.length >= 8 ? 'text-green-600' : ''}>
                • At least 8 characters
              </li>
              <li className={/[A-Z]/.test(value) ? 'text-green-600' : ''}>
                • At least one uppercase letter
              </li>
              <li className={/[a-z]/.test(value) ? 'text-green-600' : ''}>
                • At least one lowercase letter
              </li>
              <li className={/[0-9]/.test(value) ? 'text-green-600' : ''}>
                • At least one number
              </li>
              <li className={/[^A-Za-z0-9]/.test(value) ? 'text-green-600' : ''}>
                • At least one special character
              </li>
            </ul>
          </div>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);