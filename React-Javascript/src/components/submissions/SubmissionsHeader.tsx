import React from 'react';
import { Download, Search, Filter } from 'lucide-react';
import type { FormSubmission } from '../../store/types/form';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface SubmissionsHeaderProps {
  submissions: FormSubmission[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  spamFilter: 'all' | 'spam' | 'valid';
  setSpamFilter: (filter: 'all' | 'spam' | 'valid') => void;
}

export const SubmissionsHeader: React.FC<SubmissionsHeaderProps> = ({
  submissions,
  searchTerm,
  setSearchTerm,
  showFilters,
  setShowFilters,
  spamFilter,
  setSpamFilter
}) => {
  const downloadCSV = () => {
    if (submissions.length === 0) {
      toast.error('No submissions to export');
      return;
    }

    try {
      const headers = ['Submission ID', 'Submitted At', ...Object.keys(submissions[0].responses)];
      const csvContent = [
        headers.join(','),
        ...submissions.map(sub => [
          sub.id,
          format(new Date(sub.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
          ...Object.values(sub.responses).map(value => `"${String(value).replace(/"/g, '""')}"`)
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-submissions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Submissions exported successfully');
    } catch (error) {
      console.error('Error exporting submissions:', error);
      toast.error('Failed to export submissions');
    }
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Form Submissions</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-gray-500">
              {submissions.length} {submissions.length === 1 ? 'response' : 'responses'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSpamFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  spamFilter === 'all'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSpamFilter('valid')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  spamFilter === 'valid'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-green-100 text-green-600 hover:bg-green-200'
                }`}
              >
                Valid
              </button>
              <button
                onClick={() => setSpamFilter('spam')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  spamFilter === 'spam'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                Spam
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium ${
              showFilters
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={downloadCSV}
            disabled={submissions.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};