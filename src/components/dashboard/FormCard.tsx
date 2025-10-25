import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Form } from '../../store/formStore';
import { 
  Calendar, 
  BarChart2,
  Globe,
  Lock,
  Pencil,
  Trash2,
  Eye,
  ExternalLink,
  Copy,
  Code,
  Share2,
  Settings,
  MoreVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { FormPreview } from '../FormPreview';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useState } from 'react';

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
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(form.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative bg-white rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          transform: 'perspective(1000px)'
        }}
      >
        {/* 3D Shadow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
        
        {/* Form Preview Thumbnail */}
        <div 
          className="relative h-40 overflow-hidden"
          style={{
            background: form.style?.backgroundGradient?.enabled
              ? `linear-gradient(${form.style.backgroundGradient.direction}, ${form.style.backgroundGradient.startColor}, ${form.style.backgroundGradient.endColor})`
              : form.style?.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          {/* Real Form Preview */}
          <div className="absolute inset-0 scale-[0.35] origin-top-left transform pointer-events-none">
            <div className="w-[285%] h-[285%] p-8">
              <div 
                className="p-6 rounded-xl shadow-2xl"
                style={{ 
                  backgroundColor: '#ffffff',
                }}
              >
                <h2 
                  className="text-2xl font-bold mb-2"
                  style={{ color: form.style?.textColor || '#1f2937' }}
                >
                  {form.title}
                </h2>
                {form.description && (
                  <p 
                    className="text-sm mb-4"
                    style={{ color: form.style?.textColor || '#6b7280', opacity: 0.8 }}
                  >
                    {form.description}
                  </p>
                )}
                {form.elements?.slice(0, 2).map((field) => (
                  <div key={field.id} className="mb-3">
                    <label 
                      className="block text-sm font-medium mb-1"
                      style={{ color: form.style?.textColor || '#374151' }}
                    >
                      {field.label}
                    </label>
                    <div 
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{ 
                        borderColor: form.style?.borderColor || '#e5e7eb',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>
                ))}
                <button
                  className="px-4 py-2 rounded-lg text-white font-medium text-sm shadow-lg"
                  style={{
                    backgroundColor: form.style?.buttonColor || '#3B82F6'
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          
          {/* Hover Overlay with Actions */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
            <motion.button
              initial={{ scale: 0 }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={() => setShowPreview(true)}
              className="p-3 bg-white text-gray-700 rounded-xl hover:bg-blue-500 hover:text-white transition-colors shadow-xl hover:shadow-2xl"
              title="Preview"
            >
              <Eye className="h-5 w-5" />
            </motion.button>
            
            <Link to={`/builder/${form.id}`}>
              <motion.button
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.05 }}
                className="p-3 bg-white text-gray-700 rounded-xl hover:bg-blue-500 hover:text-white transition-colors shadow-xl hover:shadow-2xl"
                title="Edit"
              >
                <Pencil className="h-5 w-5" />
              </motion.button>
            </Link>

            {form.published && (
              <motion.button
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => window.open(`/form/${form.id}`, '_blank')}
                className="p-3 bg-white text-gray-700 rounded-xl hover:bg-blue-500 hover:text-white transition-colors shadow-xl hover:shadow-2xl"
                title="Open Form"
              >
                <ExternalLink className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-lg ${
              form.published
                ? 'bg-green-500/90 text-white'
                : 'bg-gray-800/80 text-white'
            }`}>
              {form.published ? (
                <>
                  <Globe className="h-3 w-3" />
                  Live
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  Draft
                </>
              )}
            </span>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4 relative">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {form.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <BarChart2 className="h-3.5 w-3.5" />
              <span>{form.elements?.length || 0} fields</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(form.createdAt), 'MMM d')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {!form.published ? (
            <div className="flex gap-2">
              <button
                onClick={() => onPublishToggle(form.id, false)}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-xl"
              >
                Publish Form
              </button>
              
              {/* Settings Menu for Unpublished */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  title="More Options"
                >
                  <Settings className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {showMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={handleDeleteClick}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Form
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Main Action Buttons */}
              <div className="flex gap-2 relative group/actions">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/submissions/${form.id}`)}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-semibold rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Submissions
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/analytics/${form.id}`)}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 text-xs font-semibold rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <BarChart2 className="h-3.5 w-3.5" />
                  Analytics
                </motion.button>

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </motion.button>

                  <AnimatePresence>
                    {showMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              onCopyLink(form.id);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </button>
                          
                          <button
                            onClick={() => {
                              onCopyEmbed(form.id);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                          >
                            <Code className="h-4 w-4" />
                            Copy Embed
                          </button>
                          
                          <div className="border-t border-gray-200 my-1" />
                          
                          <button
                            onClick={handleDeleteClick}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Copy Link Button - Shows on Hover */}
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onCopyLink(form.id)}
                  className="absolute -top-10 left-0 opacity-0 group-hover/actions:opacity-100 group-hover/actions:top-0 transition-all duration-200 py-2 px-3 bg-gradient-to-r from-green-50 to-green-100 text-green-700 text-xs font-semibold rounded-lg hover:from-green-100 hover:to-green-200 flex items-center justify-center gap-1.5 shadow-lg z-10"
                  title="Copy Form Link"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </motion.button>
              </div>

              {/* Unpublish Button - Always Visible */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPublishToggle(form.id, true)}
                className="w-full py-2 px-3 bg-gradient-to-r from-red-50 to-red-100 text-red-700 text-xs font-semibold rounded-lg hover:from-red-100 hover:to-red-200 transition-all flex items-center justify-center gap-1.5"
              >
                <Lock className="h-3.5 w-3.5" />
                Unpublish
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Preview Modal */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Form Preview</h3>
                <p className="text-sm text-gray-500">This is how your form will look to users</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="p-6">
              <FormPreview 
                title={form.title}
                description={form.description}
                elements={form.elements || []}
                style={{
                  backgroundColor: form.style?.backgroundColor || '#ffffff',
                  textColor: form.style?.textColor || '#000000',
                  buttonColor: form.style?.buttonColor || '#3B82F6',
                  borderRadius: form.style?.borderRadius || '8px',
                  borderWidth: form.style?.borderWidth || '1px',
                  borderColor: form.style?.borderColor || '#e5e7eb',
                  borderStyle: form.style?.borderStyle || 'solid',
                  boxShadow: form.style?.boxShadow || 'none',
                  fontFamily: form.style?.fontFamily || 'Inter',
                  backgroundGradient: form.style?.backgroundGradient
                }}
                onSubmit={() => {}} 
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        formTitle={form.title}
      />
    </>
  );
};
