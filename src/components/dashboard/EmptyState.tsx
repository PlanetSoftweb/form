import React from 'react';
import { FileSpreadsheet, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
      <div className="flex justify-center mb-4">
        <FileSpreadsheet className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
      <p className="text-gray-500 mb-6">Get started by creating your first form</p>
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