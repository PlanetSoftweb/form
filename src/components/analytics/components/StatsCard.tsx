import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  subtitle,
  trend
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`${iconBgColor} p-2 rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      {(trend || subtitle) && (
        <div className="mt-4 text-sm">
          {trend ? (
            <div className="flex items-center">
              <span className={`flex items-center ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.value}
              </span>
              <span className="text-gray-500 ml-2">{trend.label}</span>
            </div>
          ) : (
            <span className="text-gray-500">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
};