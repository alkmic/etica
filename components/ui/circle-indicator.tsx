'use client';

import { cn } from '@/lib/utils';
import { Circle } from '@/lib/constants/ethical-domains';

interface CircleIndicatorProps {
  circle: Circle;
  className?: string;
}

const CIRCLE_CONFIG: Record<Circle, { label: string; color: string; bgColor: string }> = {
  PERSONS: { label: 'Personnes', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  ORGANIZATION: { label: 'Organisation', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  SOCIETY: { label: 'Societe', color: 'text-green-700', bgColor: 'bg-green-50' },
};

export function CircleIndicator({ circle, className }: CircleIndicatorProps) {
  const config = CIRCLE_CONFIG[circle];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
