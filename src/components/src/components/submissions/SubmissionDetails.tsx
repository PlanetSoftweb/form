import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import type { FormElement, FormSubmission } from '../../store/types/form';
import type { SpamAnalysis } from '../../utils/spamDetector';
import { SubmissionTag } from './SubmissionTag';

interface SubmissionDetailsProps {
  submission: FormSubmission;
  elements: FormElement[];
  spamAnalysis: SpamAnalysis;
  onClose: () => void;
}

export const SubmissionDetails: React.FC<SubmissionDetailsProps> = ({
  submission,
  elements,
  spamAnalysis,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Submission Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Submitted At</p>
            <p className="font-medium">
              {format(new Date(submission.submittedAt), 'PPpp')}
            </p>
          </div>

          <div className="space-y-4">
            {elements.map(element => (
              <div key={element.id}>
                <p className="text-sm text-gray-500">{element.label}</p>
                <p className="font-medium">
                  {submission.responses[element.id] || '-'}
                </p>
              </div>
            ))}
          </div>

          {spamAnalysis && (
            <div className="mt-4">
              <SubmissionTag
                type={spamAnalysis.isSpam ? 'spam' : 'valid'}
                confidence={spamAnalysis.confidence}
                reasons={spamAnalysis.reasons}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};