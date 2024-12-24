import React from 'react';
import { format } from 'date-fns';
import { Eye, Pencil, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormElement, FormSubmission } from '../../store/formStore';
import { SpamAnalysis } from '../../utils/spamDetector';

interface SubmissionRowProps {
  submission: FormSubmission;
  elements: FormElement[];
  spamAnalysis: SpamAnalysis;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SubmissionRow: React.FC<SubmissionRowProps> = ({
  submission,
  elements,
  spamAnalysis,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`hover:bg-gray-50 ${spamAnalysis.isSpam ? 'bg-red-50' : ''}`}
    >
      {elements.map((element) => (
        <td key={element.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="flex items-center">
            {submission.responses[element.id] || '-'}
            {element.type === 'email' && spamAnalysis.isSpam && (
              <div className="ml-2 group relative">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 bg-white p-2 rounded-lg shadow-lg border text-xs">
                  <p className="font-medium text-red-600">Potential Spam</p>
                  <ul className="mt-1 list-disc list-inside text-gray-600">
                    {spamAnalysis.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </td>
      ))}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          {format(new Date(submission.submittedAt), 'MMM d, yyyy HH:mm')}
          {!spamAnalysis.isSpam && (
            <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={onView}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            title="Edit Submission"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete Submission"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};