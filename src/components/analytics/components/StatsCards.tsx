import React from 'react';
import { BarChart2, TrendingUp, Users, Clock } from 'lucide-react';
import { AnalyticsSummary } from '../hooks/useAnalytics';
import { StatsCard } from './StatsCard';

interface StatsCardsProps {
  analytics: AnalyticsSummary;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ analytics }) => {
  const cards = [
    {
      title: 'Total Submissions',
      value: analytics.totalSubmissions,
      icon: BarChart2,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: {
        value: ((analytics.submissionsToday - analytics.submissionsThisWeek / 7) / (analytics.submissionsThisWeek / 7)) * 100,
        label: 'vs last week avg',
        isPositive: analytics.submissionsToday > analytics.submissionsThisWeek / 7
      }
    },
    {
      title: 'Today\'s Submissions',
      value: analytics.submissionsToday,
      icon: TrendingUp,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Weekly Submissions',
      value: analytics.submissionsThisWeek,
      icon: Users,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Average Time to Complete',
      value: `${Math.round(analytics.averageTimeToComplete)}s`,
      icon: Clock,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};