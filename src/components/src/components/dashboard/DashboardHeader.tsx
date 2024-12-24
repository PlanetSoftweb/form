import React from 'react';
import { PlusCircle } from 'lucide-react';

interface DashboardHeaderProps {
  formCount: number;
  onCreateClick: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  formCount,
  onCreateClick
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
        <p className="text-gray-600 mt-1">
          {formCount} {formCount === 1 ? 'form' : 'forms'} created
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        Create Form
      </button>
    </div>
  );
};