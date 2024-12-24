import React from 'react';
import type { FormElement, FormSubmission } from '../../store/types/form';
import type { SpamAnalysis } from '../../utils/spamDetector';
import { SubmissionRow } from './SubmissionRow';

interface SubmissionsTableProps {
  submissions: FormSubmission[];
  elements: FormElement[];
  spamAnalyses: Record<string, SpamAnalysis>;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  setSortField: (field: string) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  searchTerm: string;
  filters: Record<string, string>;
  spamFilter: 'all' | 'spam' | 'valid';
  currentPage: number;
  pageSize: number;
  onSelectSubmission: (submission: FormSubmission) => void;
  onEditSubmission: (submission: FormSubmission) => void;
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  elements,
  spamAnalyses,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
  searchTerm,
  filters,
  spamFilter,
  currentPage,
  pageSize,
  onSelectSubmission,
  onEditSubmission
}) => {
  const filteredSubmissions = submissions
    .filter(submission => {
      const searchMatch = Object.values(submission.responses).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

      const filterMatch = Object.entries(filters).every(([field, value]) => {
        if (!value) return true;
        const response = String(submission.responses[field]).toLowerCase();
        return response.includes(value.toLowerCase());
      });

      const spamMatch = spamFilter === 'all' 
        ? true 
        : spamFilter === 'spam' 
          ? spamAnalyses[submission.id]?.isSpam 
          : !spamAnalyses[submission.id]?.isSpam;

      return searchMatch && filterMatch && spamMatch;
    })
    .sort((a, b) => {
      let aValue = sortField === 'submittedAt' ? a.submittedAt : a.responses[sortField];
      let bValue = sortField === 'submittedAt' ? b.submittedAt : b.responses[sortField];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {elements.map((element) => (
              <th
                key={element.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {element.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedSubmissions.map((submission) => (
            <SubmissionRow
              key={submission.id}
              submission={submission}
              elements={elements}
              spamAnalysis={spamAnalyses[submission.id] || { isSpam: false, confidence: 0, reasons: [] }}
              onView={() => onSelectSubmission(submission)}
              onEdit={() => onEditSubmission(submission)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};