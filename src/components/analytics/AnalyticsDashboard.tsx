import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Clock,
  ArrowUp,
  ArrowDown,
  Loader2,
  X,
  RefreshCw
} from 'lucide-react';
import { FormSubmission, FormElement } from '../../store/formStore';
import { format, subDays, isWithinInterval } from 'date-fns';
import { useFormStore } from '../../store/formStore';
import toast from 'react-hot-toast';

interface AnalyticsDashboardProps {
  formId: string;
  submissions: FormSubmission[];
  elements: FormElement[];
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  formId,
  submissions,
  elements,
  onClose
}) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(false);
  const { fetchSubmissions } = useFormStore();

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchSubmissions(formId);
      toast.success('Analytics refreshed');
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      toast.error('Failed to refresh analytics');
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const today = new Date();
    switch (timeRange) {
      case 'week': return subDays(today, 7);
      case 'month': return subDays(today, 30);
      case 'year': return subDays(today, 365);
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    isWithinInterval(new Date(submission.submittedAt), {
      start: getStartDate(),
      end: new Date()
    })
  );

  const submissionsToday = submissions.filter(submission =>
    new Date(submission.submittedAt).toDateString() === new Date().toDateString()
  ).length;

  const submissionsYesterday = submissions.filter(submission =>
    new Date(submission.submittedAt).toDateString() === subDays(new Date(), 1).toDateString()
  ).length;

  const submissionsTrend = ((submissionsToday - submissionsYesterday) / (submissionsYesterday || 1)) * 100;

  const getSubmissionsByDay = () => {
    const data: Record<string, number> = {};
    filteredSubmissions.forEach(submission => {
      const date = format(new Date(submission.submittedAt), 'yyyy-MM-dd');
      data[date] = (data[date] || 0) + 1;
    });
    return data;
  };

  const getResponseDistribution = () => {
    const distribution: Record<string, Record<string, number>> = {};
    elements.forEach(element => {
      if (['select', 'radio', 'checkbox'].includes(element.type)) {
        distribution[element.id] = {};
        filteredSubmissions.forEach(submission => {
          const response = submission.responses[element.id];
          if (Array.isArray(response)) {
            response.forEach(value => {
              distribution[element.id][value] = (distribution[element.id][value] || 0) + 1;
            });
          } else if (response) {
            distribution[element.id][response] = (distribution[element.id][response] || 0) + 1;
          }
        });
      }
    });
    return distribution;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Form Analytics</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors"
              title="Refresh analytics"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-end space-x-2 mb-6">
            {(['week', 'month', 'year'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  timeRange === range
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Last {range}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Total Submissions</p>
                  <p className="text-2xl font-semibold mt-1">{filteredSubmissions.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              {submissionsTrend !== 0 && (
                <div className="mt-4 flex items-center text-sm">
                  <span className={`flex items-center ${
                    submissionsTrend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {submissionsTrend > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                    {Math.abs(submissionsTrend).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 ml-2">vs yesterday</span>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Submissions Today</p>
                  <p className="text-2xl font-semibold mt-1">{submissionsToday}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Average per Day</p>
                  <p className="text-2xl font-semibold mt-1">
                    {(filteredSubmissions.length / 7).toFixed(1)}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Submissions Over Time</h3>
              <div className="h-64">
                {/* Add a chart component here */}
                <div className="h-full flex items-center justify-center text-gray-500">
                  Chart component would go here
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-medium mb-4">Response Distribution</h3>
              <div className="space-y-4">
                {Object.entries(getResponseDistribution()).map(([elementId, responses]) => {
                  const element = elements.find(e => e.id === elementId);
                  if (!element) return null;

                  const total = Object.values(responses).reduce((a, b) => a + b, 0);

                  return (
                    <div key={elementId} className="space-y-2">
                      <h4 className="font-medium">{element.label}</h4>
                      {Object.entries(responses).map(([option, count]) => {
                        const percentage = (count / total) * 100;
                        return (
                          <div key={option} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{option}</span>
                              <span className="text-gray-500">
                                {count} ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};