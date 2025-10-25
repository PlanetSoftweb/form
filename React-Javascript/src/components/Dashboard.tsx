import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useFormStore } from '../store/formStore';
import { CreateFormModal } from './modals/CreateFormModal';
import { AIFormDeveloper } from './modals/AIFormDeveloper';
import { FormCard } from './dashboard/FormCard';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { EmptyState } from './dashboard/EmptyState';
import { Loader2 } from 'lucide-react';
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
  const [showAIModal, setShowAIModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    if (user) {
      fetchForms(user.uid);
    }
    
    // Cleanup subscriptions on unmount
    return () => {
      useFormStore.getState().cleanup();
    };
  }, [user, fetchForms]);

  const handleCopyLink = async (formId: string) => {
    const url = `${window.location.origin}/form/${formId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Form link copied to clipboard');
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  const handleCopyEmbed = async (formId: string) => {
    const embedCode = `<iframe src="${window.location.origin}/embed/${formId}" width="100%" height="600" frameborder="0"></iframe>`;
    try {
      await navigator.clipboard.writeText(embedCode);
      toast.success('Embed code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy embed code:', error);
      toast.error('Failed to copy embed code. Please try again.');
    }
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

  // Sort forms by created date (most recent first)
  const sortedForms = [...forms].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Descending order
  });

  // Filter forms based on search query
  const filteredForms = sortedForms.filter((form) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const titleMatch = form.title?.toLowerCase().includes(query);
    const descriptionMatch = form.description?.toLowerCase().includes(query);
    
    return titleMatch || descriptionMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <DashboardHeader
          formCount={forms.length}
          onCreateClick={() => setShowCreateModal(true)}
          onAICreateClick={() => setShowAIModal(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {forms.length === 0 ? (
          <EmptyState 
            onCreateClick={() => setShowCreateModal(true)} 
            onAICreateClick={() => setShowAIModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onCopyLink={handleCopyLink}
                onCopyEmbed={handleCopyEmbed}
                onDelete={handleDelete}
                onPublishToggle={handlePublishToggle}
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

      <AIFormDeveloper 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)} 
      />
    </div>
  );
};