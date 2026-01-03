'use client';

import { cn } from '@/lib/utils';
import { ARBITRATION_MATURITY } from '@/lib/constants/enums';

interface MaturityIndicatorProps {
  level: 0 | 1 | 2 | 3 | 4;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MaturityIndicator({
  level,
  showLabel = true,
  size = 'md',
  className
}: MaturityIndicatorProps) {
  const maturityData = Object.values(ARBITRATION_MATURITY).find(m => m.level === level);

  if (!maturityData) {
    return null;
  }

  const colorClasses: Record<number, string> = {
    0: 'bg-gray-200 text-gray-700',
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-purple-100 text-purple-800',
    4: 'bg-green-100 text-green-800',
  };

  const barColorClasses: Record<number, string> = {
    0: 'bg-gray-400',
    1: 'bg-yellow-500',
    2: 'bg-blue-500',
    3: 'bg-purple-500',
    4: 'bg-green-500',
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const barSizeClasses = {
    sm: 'w-1.5 h-3',
    md: 'w-2 h-4',
    lg: 'w-2.5 h-5',
  };

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      {/* Visual indicator */}
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-sm',
              barSizeClasses[size],
              i <= level ? barColorClasses[level] : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      {/* Label */}
      {showLabel && (
        <span className={cn('font-medium rounded', sizeClasses[size], colorClasses[level])}>
          {maturityData.label}
        </span>
      )}
    </div>
  );
}
