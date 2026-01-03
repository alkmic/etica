'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { DomainBadge } from '@/components/ui/domain-badge';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { MaturityIndicator } from '@/components/ui/maturity-indicator';
import { EthicalDomainId } from '@/lib/constants/ethical-domains';
import { RULE_FAMILIES, RuleFamilyId } from '@/lib/constants/enums';
import { cn } from '@/lib/utils';

interface TensionCardProps {
  tension: {
    id: string;
    ruleId: string;
    ruleName: string;
    ruleFamily: RuleFamilyId;
    domainA: EthicalDomainId;
    domainB: EthicalDomainId;
    formulation: string;
    mechanism?: string;
    severity: number;
    maturity: number;
    status: string;
    questionsToConsider?: string[];
    acceptablePatterns?: string[];
  };
  onArbitrate?: (id: string) => void;
  className?: string;
}

export function TensionCard({ tension, onArbitrate, className }: TensionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const familyInfo = RULE_FAMILIES[tension.ruleFamily];

  // Extract rule code from ruleId (e.g., "S-01" -> "01")
  const ruleCode = tension.ruleId.split('-')[1] || tension.ruleId;

  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Domains in tension */}
            <div className="flex items-center gap-2 mb-2">
              <DomainBadge domain={tension.domainA} size="sm" />
              <span className="text-gray-400">&#8596;</span>
              <DomainBadge domain={tension.domainB} size="sm" />
            </div>

            {/* Formulation */}
            <p className="text-sm text-gray-700 line-clamp-2">
              {tension.formulation}
            </p>
          </div>

          {/* Indicators */}
          <div className="flex flex-col items-end gap-2">
            <SeverityBadge severity={tension.severity} showLabel={false} />
            <MaturityIndicator
              level={tension.maturity as 0 | 1 | 2 | 3 | 4}
              showLabel={false}
              size="sm"
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="px-1.5 py-0.5 rounded bg-gray-100">
            {familyInfo?.code}-{ruleCode}
          </span>
          <span>{familyInfo?.label}</span>
        </div>
      </div>

      {/* Expandable section */}
      <div className="border-t border-gray-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-50"
        >
          <span>Details et aide a l&apos;arbitrage</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 space-y-4">
            {/* Mechanism */}
            {tension.mechanism && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Mecanisme
                </h4>
                <p className="text-sm text-gray-700">{tension.mechanism}</p>
              </div>
            )}

            {/* Questions */}
            {tension.questionsToConsider && tension.questionsToConsider.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Questions a considerer
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {tension.questionsToConsider.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Acceptable patterns */}
            {tension.acceptablePatterns && tension.acceptablePatterns.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Patterns acceptables
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {tension.acceptablePatterns.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action */}
            {onArbitrate && (
              <button
                onClick={() => onArbitrate(tension.id)}
                className="w-full mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                Arbitrer ce dilemme
                <ExternalLink size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
