import React from 'react';
import { User, Building2 } from 'lucide-react';
import { AuthInput } from '../styles/AuthInput';
import type { StepProps } from './types';

export const Step2: React.FC<StepProps> = ({ formData, setFormData }) => (
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