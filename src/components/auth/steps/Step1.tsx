import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { AuthInput } from '../styles/AuthInput';
import { PasswordInput } from '../PasswordInput';
import type { StepProps } from './types';

export const Step1: React.FC<StepProps> = ({ formData, setFormData }) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePasswords = (password: string, confirm: string) => {
    if (password !== confirm) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    if (confirmPassword) {
      validatePasswords(newPassword, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePasswords(formData.password, newConfirmPassword);
  };

  return (
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

      <PasswordInput
        icon={Lock}
        label="Password"
        required
        value={formData.password}
        onChange={handlePasswordChange}
        placeholder="Create a password"
        minLength={8}
        showStrength
      />

      <PasswordInput
        icon={Lock}
        label="Confirm Password"
        required
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="Confirm your password"
        error={passwordError}
      />
    </div>
  );
};