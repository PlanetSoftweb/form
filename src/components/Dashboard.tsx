import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useFormStore } from '../store/formStore';
import { CreateFormModal } from './modals/CreateFormModal';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';
import { FormCard } from './dashboard/FormCard';
import { PlusCircle, FileSpreadsheet, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const {
    forms,
    fetchForms,
    publishForm,
    unpublishForm,
    deleteForm,
    loading: formsLoading,
  } = useFormStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchForms(user.uid);
    }
  }, [user, fetchForms]);

  const handleCopyLink = (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(url);
    toast.success('Form link copied to clipboard');
  };

  const handleCopyEmbed = (formId: string) => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${formId}" width="100%" height="600" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard');
  };

  const handleDelete = async (formId: string) => {
    if (!window.confirm('Are you sure you want to delete this form?')) return;
    try {
      await deleteForm(formId);
      toast.success('Form deleted successfully');
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Failed to delete form');
    }
  };

  const handlePublishToggle = async (formId: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await unpublishForm(formId);
        toast.success('Form unpublished');
      } else {
        await publishForm(formId);
        toast.success('Form published');
      }
    } catch (error) {
      console.error('Error toggling form publish state:', error);
      toast.error('Failed to update form status');
    }
  };

  if (formsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Forms</h1>
            <p className="text-gray-600 mt-1">
              {forms.length} {forms.length === 1 ? 'form' : 'forms'} created
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Form
          </button>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="flex justify-center mb-4">
              <FileSpreadsheet className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first form</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Form
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onCopyLink={handleCopyLink}
                onCopyEmbed={handleCopyEmbed}
                onDelete={handleDelete}
                onPublishToggle={handlePublishToggle}
                onShowAnalytics={(id) => setShowAnalytics(id)}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showAnalytics && (
        <AnalyticsDashboard
          formId={showAnalytics}
          submissions={forms.find(f => f.id === showAnalytics)?.submissions || []}
          elements={forms.find(f => f.id === showAnalytics)?.elements || []}
          onClose={() => setShowAnalytics(null)}
        />
      )}
    </div>
  );
};