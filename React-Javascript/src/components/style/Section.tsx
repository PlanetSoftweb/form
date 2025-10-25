import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  isCollapsible?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  icon,
  title,
  children,
  isCollapsible = true,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0 pb-4">
      <div
        onClick={() => isCollapsible && setIsCollapsed(!isCollapsed)}
        className={`flex items-center gap-2 text-sm font-medium text-gray-700 w-full mb-4 ${
          isCollapsible ? 'cursor-pointer hover:text-gray-900' : 'cursor-default'
        }`}
      >
        {icon}
        {title}
        {isCollapsible && (
          <div className="ml-auto">
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            )}
          </div>
        )}
      </div>
      <div className={`space-y-4 ${isCollapsed ? 'hidden' : 'block'}`}>
        {children}
      </div>
    </div>
  );
};