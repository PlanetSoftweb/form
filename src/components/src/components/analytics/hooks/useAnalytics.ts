import { useState, useEffect } from 'react';
import { FormSubmission, FormElement } from '../../../store/formStore';
import { format, subDays, isWithinInterval } from 'date-fns';

export interface AnalyticsSummary {
  totalSubmissions: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  averageTimeToComplete: number;
  completionRate: number;
  submissionsByDay: Record<string, number>;
  responseDistribution: Record<string, Record<string, number>>;
}

export const useAnalytics = (
  submissions: FormSubmission[],
  elements: FormElement[],
  timeRange: 'week' | 'month' | 'year'
) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    calculateAnalytics();
  }, [submissions, timeRange]);

  const getStartDate = (range: 'week' | 'month' | 'year'): Date => {
    const today = new Date();
    switch (range) {
      case 'week': return subDays(today, 7);
      case 'month': return subDays(today, 30);
      case 'year': return subDays(today, 365);
      default: return subDays(today, 7);
    }
  };

  const calculateAnalytics = () => {
    setLoading(true);
    
    const today = new Date();
    const startDate = getStartDate(timeRange);

    const filteredSubmissions = submissions.filter(submission => 
      isWithinInterval(new Date(submission.submittedAt), {
        start: startDate,
        end: today
      })
    );

    const submissionsToday = submissions.filter(submission => 
      new Date(submission.submittedAt).toDateString() === today.toDateString()
    ).length;

    const submissionsThisWeek = submissions.filter(submission => 
      new Date(submission.submittedAt) >= subDays(today, 7)
    ).length;

    // Calculate submissions by day
    const submissionsByDay: Record<string, number> = {};
    filteredSubmissions.forEach(submission => {
      const date = format(new Date(submission.submittedAt), 'yyyy-MM-dd');
      submissionsByDay[date] = (submissionsByDay[date] || 0) + 1;
    });

    // Calculate response distribution
    const responseDistribution: Record<string, Record<string, number>> = {};
    elements.forEach(element => {
      if (['select', 'radio', 'checkbox'].includes(element.type)) {
        responseDistribution[element.id] = {};
        filteredSubmissions.forEach(submission => {
          const response = submission.responses[element.id];
          if (Array.isArray(response)) {
            response.forEach(value => {
              responseDistribution[element.id][value] = 
                (responseDistribution[element.id][value] || 0) + 1;
            });
          } else if (response) {
            responseDistribution[element.id][response] = 
              (responseDistribution[element.id][response] || 0) + 1;
          }
        });
      }
    });

    setAnalytics({
      totalSubmissions: filteredSubmissions.length,
      submissionsToday,
      submissionsThisWeek,
      averageTimeToComplete: 0,
      completionRate: 0,
      submissionsByDay,
      responseDistribution
    });

    setLoading(false);
  };

  return { analytics, loading };
};