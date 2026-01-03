'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: number; // 1-5
  showLabel?: boolean;
  className?: string;
}

export function SeverityBadge({ severity, showLabel = true, className }: SeverityBadgeProps) {
  const normalizedSeverity = Math.min(5, Math.max(1, Math.round(severity))) as 1 | 2 | 3 | 4 | 5;

  const config = {
    1: { label: 'Faible', color: 'text-gray-600 bg-gray-100', icon: Info },
    2: { label: 'Moderee', color: 'text-blue-600 bg-blue-100', icon: Info },
    3: { label: 'Importante', color: 'text-yellow-600 bg-yellow-100', icon: AlertCircle },
    4: { label: 'Elevee', color: 'text-orange-600 bg-orange-100', icon: AlertTriangle },
    5: { label: 'Critique', color: 'text-red-600 bg-red-100', icon: AlertTriangle },
  }[normalizedSeverity];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm font-medium',
        config.color,
        className
      )}
    >
      <Icon size={14} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
