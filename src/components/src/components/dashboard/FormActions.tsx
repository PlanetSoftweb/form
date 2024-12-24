import React from 'react';
import { ExternalLink, Link as LinkIcon, Code, FileText } from 'lucide-react';

interface FormActionsProps {
  formId: string;
  onCopyLink: () => void;
  onCopyEmbed: () => void;
  onViewSubmissions: () => void;
  onUnpublish: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  formId,
  onCopyLink,
  onCopyEmbed,
  onViewSubmissions,
  onUnpublish
}) => {
  return (
    <div className="space-y-2">
      <button
        onClick={() => window.open(`/form/${formId}`, '_blank')}
        className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        View Public Form
      </button>
      <button
        onClick={onCopyLink}
        className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LinkIcon className="h-4 w-4 mr-2" />
        Copy Public Link
      </button>
      <button
        onClick={onCopyEmbed}
        className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Code className="h-4 w-4 mr-2" />
        Get Embed Code
      </button>
      <button
        onClick={onViewSubmissions}
        className="w-full flex items-center justify-center px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
      >
        <FileText className="h-4 w-4 mr-2" />
        View Submissions
      </button>
      <button
        onClick={onUnpublish}
        className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
      >
        Unpublish Form
      </button>
    </div>
  );
};