import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useFormStore } from '../store/formStore';
import { CreateFormModal } from './modals/CreateFormModal';
import { AnalyticsDashboard } from './analytics/AnalyticsDashboard';
import { FormCard } from './dashboard/FormCard';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { EmptyState } from './dashboard/EmptyState';
import { PlusCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const {
    forms,
    fetchForms,
    publishForm,
    unpublishForm,
    deleteForm,
    loading: formsLoading,
  } = useFormStore();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showAnalytics, setShowAnalytics] = React.useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchForms(user.uid);
    }
    
    // Cleanup subscriptions on unmount
    return () => {
      useFormStore.getState().cleanup();
    };
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
        <DashboardHeader
          formCount={forms.length}
          onCreateClick={() => setShowCreateModal(true)}
        />

        {forms.length === 0 ? (
          <EmptyState onCreateClick={() => setShowCreateModal(true)} />
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
          elements={forms.find(f => f.id === showAnalytics)?.elements || []}
          onClose={() => setShowAnalytics(null)}
        />
      )}
    </div>
  );
};