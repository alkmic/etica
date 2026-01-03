'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { MaturityRadar } from '@/components/charts/maturity-radar';
import { DomainScoresGrid } from '@/components/charts/domain-scores-grid';
import { TensionCard } from '@/components/tensions/tension-card';
import { SECTORS, SCALES } from '@/lib/constants/enums';
import { EthicalDomainId } from '@/lib/constants/ethical-domains';
import { RuleFamilyId } from '@/lib/constants/enums';

interface SiaOverviewProps {
  sia: {
    id: string;
    name: string;
    description?: string | null;
    sector: string;           // Using sector (not domain)
    userScale: string;        // Using userScale (not scale)
    status: string;
    tensions: Array<{
      id: string;
      domainA: string;
      domainB: string;
      ruleId: string;
      ruleName?: string | null;
      ruleFamily?: string | null;
      formulation: string;
      mechanism?: string | null;
      severity: number;
      maturity: number;
      status: string;
      questionsToConsider: string[];
      acceptablePatterns: string[];
    }>;
    actions: Array<{
      id: string;
      status: string;
    }>;
  };
}

export function SiaOverview({ sia }: SiaOverviewProps) {
  // Calculate maturity scores per domain
  const maturityScores = useMemo(() => {
    const scores: Partial<Record<EthicalDomainId, number>> = {};
    const counts: Partial<Record<EthicalDomainId, number>> = {};

    for (const tension of sia.tensions) {
      const domainA = tension.domainA as EthicalDomainId;
      const domainB = tension.domainB as EthicalDomainId;

      // Average maturity of tensions per domain
      scores[domainA] = (scores[domainA] || 0) + tension.maturity;
      counts[domainA] = (counts[domainA] || 0) + 1;

      scores[domainB] = (scores[domainB] || 0) + tension.maturity;
      counts[domainB] = (counts[domainB] || 0) + 1;
    }

    // Calculate averages
    for (const domain of Object.keys(scores) as EthicalDomainId[]) {
      const count = counts[domain];
      if (count && count > 0) {
        scores[domain] = scores[domain]! / count;
      }
    }

    return scores;
  }, [sia.tensions]);

  // Statistics
  const stats = useMemo(() => {
    const totalTensions = sia.tensions.length;
    const arbitratedTensions = sia.tensions.filter(t =>
      t.status === 'ARBITRATED' || t.status === 'RESOLVED'
    ).length;
    const criticalTensions = sia.tensions.filter(t => t.severity >= 4).length;
    const pendingActions = sia.actions.filter(a =>
      a.status === 'TODO' || a.status === 'IN_PROGRESS'
    ).length;

    return {
      totalTensions,
      arbitratedTensions,
      criticalTensions,
      pendingActions,
      completionRate: totalTensions > 0
        ? Math.round((arbitratedTensions / totalTensions) * 100)
        : 0,
    };
  }, [sia.tensions, sia.actions]);

  // Top 3 critical tensions
  const criticalTensions = useMemo(() => {
    return sia.tensions
      .filter(t => t.status !== 'RESOLVED' && t.status !== 'DISMISSED')
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 3);
  }, [sia.tensions]);

  const sectorInfo = SECTORS[sia.sector as keyof typeof SECTORS];
  const scaleInfo = SCALES[sia.userScale as keyof typeof SCALES];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
            {sectorInfo?.label || sia.sector}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
            {scaleInfo?.label || sia.userScale}
          </span>
        </div>
        <h1 className="text-2xl font-bold">{sia.name}</h1>
        {sia.description && (
          <p className="text-gray-600 mt-1">{sia.description}</p>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<AlertTriangle className="text-orange-500" />}
          label="Dilemmes detectes"
          value={stats.totalTensions}
        />
        <StatCard
          icon={<CheckCircle className="text-green-500" />}
          label="Arbitres"
          value={`${stats.arbitratedTensions} (${stats.completionRate}%)`}
        />
        <StatCard
          icon={<AlertTriangle className="text-red-500" />}
          label="Critiques"
          value={stats.criticalTensions}
        />
        <StatCard
          icon={<Clock className="text-blue-500" />}
          label="Actions en cours"
          value={stats.pendingActions}
        />
      </div>

      {/* Maturity radar */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Maturite par domaine</h2>
          <MaturityRadar scores={maturityScores} />
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Scores detailles</h2>
          <DomainScoresGrid scores={maturityScores} />
        </div>
      </div>

      {/* Critical dilemmas */}
      {criticalTensions.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Dilemmes prioritaires</h2>
            <Link
              href={`/${sia.id}/tensions`}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Voir tous les dilemmes
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4">
            {criticalTensions.map(tension => (
              <TensionCard
                key={tension.id}
                tension={{
                  id: tension.id,
                  ruleId: tension.ruleId,
                  ruleName: tension.ruleName || 'Regle inconnue',
                  ruleFamily: (tension.ruleFamily || 'STRUCTURAL') as RuleFamilyId,
                  domainA: tension.domainA as EthicalDomainId,
                  domainB: tension.domainB as EthicalDomainId,
                  formulation: tension.formulation,
                  mechanism: tension.mechanism || undefined,
                  severity: tension.severity,
                  maturity: tension.maturity,
                  status: tension.status,
                  questionsToConsider: tension.questionsToConsider,
                  acceptablePatterns: tension.acceptablePatterns,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for stats
function StatCard({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}
