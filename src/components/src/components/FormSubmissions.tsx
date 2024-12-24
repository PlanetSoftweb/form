import React, { useEffect, useState } from 'react';
import { useFormStore, FormSubmission } from '../store/formStore';
import { Download, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';

interface FormSubmissionsProps {
  formId: string;
}

export const FormSubmissions = ({ formId }: FormSubmissionsProps) => {
  const { submissions, fetchSubmissions, loading } = useFormStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof FormSubmission>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchSubmissions(formId);
  }, [formId]);

  const handleSort = (field: keyof FormSubmission) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSubmissions = submissions
    .filter(submission =>
      Object.values(submission.responses).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const downloadCSV = () => {
    if (submissions.length === 0) return;

    const headers = ['Submission ID', 'Submitted At', ...Object.keys(submissions[0].responses)];
    const csvContent = [
      headers.join(','),
      ...filteredSubmissions.map(sub => [
        sub.id,
        format(new Date(sub.submittedAt), 'yyyy-MM-dd HH:mm:ss'),
        ...Object.values(sub.responses).map(value => `"${value}"`)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-submissions-${formId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Form Submissions</h2>
          {submissions.length > 0 && (
            <button
              onClick={downloadCSV}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No submissions yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(submissions[0].responses).map((header) => (
                  <th
                    key={header}
                    onClick={() => handleSort(header as keyof FormSubmission)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      {sortField === header && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
                <th
                  onClick={() => handleSort('submittedAt')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-1">
                    <span>Submitted At</span>
                    {sortField === 'submittedAt' && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  {Object.values(submission.responses).map((value, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {value}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};