import React, { useState, useEffect } from 'react';
import { useFormStore } from '../../store/formStore';
import type { FormElement, FormSubmission } from '../../store/types/form';
import { SpamDetector } from '../../utils/spamDetector';
import type { SpamAnalysis } from '../../utils/spamDetector';
import { SubmissionRow } from './SubmissionRow';
import { SubmissionTag } from './SubmissionTag';
import { EditSubmissionModal } from './EditSubmissionModal';
import { SubmissionsHeader } from './SubmissionsHeader';
import { SubmissionsTable } from './SubmissionsTable';
import { SubmissionsPagination } from './SubmissionsPagination';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface SubmissionsViewProps {
  formId: string;
  elements: FormElement[];
}

export const SubmissionsView: React.FC<SubmissionsViewProps> = ({ formId, elements }) => {
  const { submissions, subscribeToFormSubmissions, loading } = useFormStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<FormSubmission | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [spamAnalyses, setSpamAnalyses] = useState<Record<string, SpamAnalysis>>({});
  const [spamFilter, setSpamFilter] = useState<'all' | 'spam' | 'valid'>('all');

  useEffect(() => {
    const unsubscribe = subscribeToFormSubmissions(formId);
    return () => unsubscribe();
  }, [formId, subscribeToFormSubmissions]);

  useEffect(() => {
    const analyzeSubmissions = async () => {
      const spamDetector = SpamDetector.getInstance();
      const analyses: Record<string, SpamAnalysis> = {};
      
      for (const submission of submissions) {
        analyses[submission.id] = await spamDetector.analyzeSubmission(submission.responses);
      }
      
      setSpamAnalyses(analyses);
    };

    if (submissions.length > 0) {
      analyzeSubmissions();
    }
  }, [submissions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <SubmissionsHeader
        submissions={submissions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        spamFilter={spamFilter}
        setSpamFilter={setSpamFilter}
      />

      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No submissions yet</p>
        </div>
      ) : (
        <>
          <SubmissionsTable
            submissions={submissions}
            elements={elements}
            spamAnalyses={spamAnalyses}
            sortField={sortField}
            sortDirection={sortDirection}
            setSortField={setSortField}
            setSortDirection={setSortDirection}
            searchTerm={searchTerm}
            filters={filters}
            spamFilter={spamFilter}
            currentPage={currentPage}
            pageSize={pageSize}
            onSelectSubmission={setSelectedSubmission}
            onEditSubmission={setEditingSubmission}
          />

          <SubmissionsPagination
            totalSubmissions={submissions.length}
            currentPage={currentPage}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
          />
        </>
      )}

      <AnimatePresence>
        {selectedSubmission && (
          <SubmissionDetails
            submission={selectedSubmission}
            elements={elements}
            spamAnalysis={spamAnalyses[selectedSubmission.id]}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </AnimatePresence>

      {editingSubmission && (
        <EditSubmissionModal
          elements={elements}
          submission={editingSubmission}
          onClose={() => setEditingSubmission(null)}
        />
      )}
    </div>
  );
};