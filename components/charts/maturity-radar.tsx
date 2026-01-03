'use client';

import { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ETHICAL_DOMAINS, EthicalDomainId, DOMAINS_BY_CIRCLE } from '@/lib/constants/ethical-domains';

interface MaturityRadarProps {
  scores: Partial<Record<EthicalDomainId, number>>; // 0-4 for each domain
  className?: string;
}

export function MaturityRadar({ scores, className }: MaturityRadarProps) {
  const data = useMemo(() => {
    // Order by circle for coherent display
    const orderedDomains: EthicalDomainId[] = [
      ...DOMAINS_BY_CIRCLE.PERSONS,
      ...DOMAINS_BY_CIRCLE.ORGANIZATION,
      ...DOMAINS_BY_CIRCLE.SOCIETY,
    ];

    return orderedDomains.map(domainId => ({
      domain: ETHICAL_DOMAINS[domainId].nameFr,
      domainId,
      score: scores[domainId] ?? 0,
      fullMark: 4,
    }));
  }, [scores]);

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="domain"
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 4]}
            tickCount={5}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <Radar
            name="Maturite"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)}/4`, 'Maturite']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
