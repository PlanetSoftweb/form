import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
  BarChart2,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Form } from '../../store/formStore';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FormActions } from './FormActions';

interface FormCardProps {
  form: Form;
  onCopyLink: (id: string) => void;
  onCopyEmbed: (id: string) => void;
  onDelete: (id: string) => void;
  onPublishToggle: (id: string, isPublished: boolean) => void;
  onShowAnalytics: (id: string) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  onCopyLink,
  onCopyEmbed,
  onDelete,
  onPublishToggle,
  onShowAnalytics,
}) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {form.title}
            </h3>
            <p className="text-sm text-gray-500">
              {form.description || 'No description'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDelete(form.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete form"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate(`/builder/${form.id}`)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit form"
            >
              <Settings className="h-5 w-5" />
            </button>
            {form.published && (
              <button
                onClick={() => onShowAnalytics(form.id)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="View analytics"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-1" />
              {form.submissions?.length || 0} responses
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {format(new Date(form.updatedAt), 'MMM d, yyyy')}
            </div>
          </div>
          {form.published ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <Clock className="h-3 w-3 mr-1" />
              Draft
            </span>
          )}
        </div>

        {!form.published ? (
          <button
            onClick={() => onPublishToggle(form.id, false)}
            className="w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Publish Form
          </button>
        ) : (
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <FormActions
                  formId={form.id}
                  onCopyLink={() => onCopyLink(form.id)}
                  onCopyEmbed={() => onCopyEmbed(form.id)}
                  onViewSubmissions={() => navigate(`/builder/${form.id}?tab=submissions`)}
                />
                <button
                  onClick={() => onPublishToggle(form.id, true)}
                  className="w-full flex items-center justify-center px-4 py-2 mt-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Unpublish Form
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {form.published && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full px-6 py-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors border-t"
        >
          {showDetails ? (
            <>
              Hide details
              <ChevronUp className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              Show details
              <ChevronDown className="h-4 w-4 ml-1" />
            </>
          )}
        </button>
      )}
    </motion.div>
  );
};