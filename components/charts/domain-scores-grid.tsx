'use client';

import { ETHICAL_DOMAINS, EthicalDomainId, DOMAINS_BY_CIRCLE, Circle } from '@/lib/constants/ethical-domains';
import { DomainBadge } from '@/components/ui/domain-badge';
import { MaturityIndicator } from '@/components/ui/maturity-indicator';
import { CircleIndicator } from '@/components/ui/circle-indicator';

interface DomainScoresGridProps {
  scores: Partial<Record<EthicalDomainId, number>>;
  onDomainClick?: (domain: EthicalDomainId) => void;
}

export function DomainScoresGrid({ scores, onDomainClick }: DomainScoresGridProps) {
  const circles: Circle[] = ['PERSONS', 'ORGANIZATION', 'SOCIETY'];

  return (
    <div className="space-y-6">
      {circles.map(circle => (
        <div key={circle} className="space-y-3">
          <CircleIndicator circle={circle} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOMAINS_BY_CIRCLE[circle].map(domainId => {
              const domain = ETHICAL_DOMAINS[domainId];
              const score = scores[domainId] ?? 0;

              return (
                <button
                  key={domainId}
                  onClick={() => onDomainClick?.(domainId)}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <DomainBadge domain={domainId} size="sm" showLabel={false} />
                    <span className="font-medium text-sm">{domain.nameFr}</span>
                  </div>
                  <MaturityIndicator
                    level={Math.round(score) as 0 | 1 | 2 | 3 | 4}
                    showLabel={false}
                    size="sm"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
