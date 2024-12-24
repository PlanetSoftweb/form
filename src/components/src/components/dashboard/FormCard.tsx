import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Form } from '../../store/formStore';
import { FormActions } from './FormActions';
import { SubmissionsModal } from '../modals/SubmissionsModal';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { 
  Calendar, 
  FileText, 
  BarChart2,
  Globe,
  Lock,
  Pencil,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';

interface FormCardProps {
  form: Form;
  onCopyLink: (formId: string) => void;
  onCopyEmbed: (formId: string) => void;
  onDelete: (formId: string) => void;
  onPublishToggle: (formId: string, isPublished: boolean) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  onCopyLink,
  onCopyEmbed,
  onDelete,
  onPublishToggle
}) => {
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      onDelete(form.id);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {form.title}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {form.description || 'Collect detailed feedback about your product or service'}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <FileText className="h-4 w-4 mr-1" />
                {form.submissions?.length || 0} responses
                <span className="mx-2">•</span>
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(form.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {form.published && (
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="View Analytics"
                >
                  <BarChart2 className="h-5 w-5" />
                </button>
              )}
              <Link
                to={`/builder/${form.id}`}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Edit Form"
              >
                <Pencil className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete Form"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => onPublishToggle(form.id, form.published || false)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                form.published
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {form.published ? (
                <>
                  <Globe className="h-4 w-4 mr-1" />
                  Published
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-1" />
                  Draft
                </>
              )}
            </button>
          </div>

          {!form.published ? (
            <button
              onClick={() => onPublishToggle(form.id, false)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Publish Form
            </button>
          ) : (
            <FormActions
              formId={form.id}
              onCopyLink={() => onCopyLink(form.id)}
              onCopyEmbed={() => onCopyEmbed(form.id)}
              onViewSubmissions={() => setShowSubmissions(true)}
              onUnpublish={() => onPublishToggle(form.id, true)}
            />
          )}
        </div>
      </motion.div>

      {showSubmissions && (
        <SubmissionsModal
          isOpen={showSubmissions}
          onClose={() => setShowSubmissions(false)}
          formId={form.id}
          elements={form.elements}
        />
      )}

      {showAnalytics && (
        <AnalyticsDashboard
          formId={form.id}
          elements={form.elements}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </>
  );
};