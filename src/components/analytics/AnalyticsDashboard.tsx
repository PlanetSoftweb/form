import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw } from 'lucide-react';
import { FormElement } from '../../store/formStore';
import { useFormStore } from '../../store/formStore';
import { TimeRangeSelector } from './components/TimeRangeSelector';
import { StatsCards } from './components/StatsCards';
import { SubmissionsChart } from './components/SubmissionsChart';
import { ResponseDistribution } from './components/ResponseDistribution';
import { useAnalytics } from './hooks/useAnalytics';
import toast from 'react-hot-toast';

interface AnalyticsDashboardProps {
  formId: string;
  elements: FormElement[];
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  formId,
  elements,
  onClose
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const { submissions, subscribeToFormSubmissions } = useFormStore();
  const { analytics, loading } = useAnalytics(submissions, elements, timeRange);

  useEffect(() => {
    const unsubscribe = subscribeToFormSubmissions(formId);
    return () => unsubscribe();
  }, [formId]);

  const handleRefresh = () => {
    subscribeToFormSubmissions(formId);
    toast.success('Analytics refreshed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Form Analytics</h2>
                <p className="text-gray-600 mt-1">
                  {submissions.length} total submissions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  title="Refresh Analytics"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <TimeRangeSelector
                selectedRange={timeRange}
                onChange={setTimeRange}
              />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
              <p className="text-gray-600 mt-2">Loading analytics...</p>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {analytics && (
                <>
                  <StatsCards analytics={analytics} />
                  <SubmissionsChart data={analytics.submissionsByDay} />
                  <ResponseDistribution
                    elements={elements}
                    distribution={analytics.responseDistribution}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};