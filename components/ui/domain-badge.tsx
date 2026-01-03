'use client';

import { cn } from '@/lib/utils';
import { ETHICAL_DOMAINS, EthicalDomainId } from '@/lib/constants/ethical-domains';

interface DomainBadgeProps {
  domain: EthicalDomainId;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function DomainBadge({
  domain,
  size = 'md',
  showLabel = true,
  className
}: DomainBadgeProps) {
  const domainDef = ETHICAL_DOMAINS[domain];

  if (!domainDef) {
    console.warn(`Unknown domain: ${domain}`);
    return null;
  }

  const Icon = domainDef.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        domainDef.bgColor,
        domainDef.color,
        sizeClasses[size],
        className
      )}
    >
      <Icon size={iconSizes[size]} />
      {showLabel && <span>{domainDef.nameFr}</span>}
    </span>
  );
}
