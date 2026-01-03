'use client';

import { useState, useMemo } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import { TensionCard } from './tension-card';
import { EthicalDomainId } from '@/lib/constants/ethical-domains';
import { RuleFamilyId, RULE_FAMILIES, TENSION_STATUSES, TensionStatusId } from '@/lib/constants/enums';

interface Tension {
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
  status: TensionStatusId;
  questionsToConsider?: string[];
  acceptablePatterns?: string[];
}

interface TensionsListProps {
  tensions: Tension[];
  onArbitrate?: (id: string) => void;
}

export function TensionsList({ tensions, onArbitrate }: TensionsListProps) {
  const [search, setSearch] = useState('');
  const [familyFilter, setFamilyFilter] = useState<RuleFamilyId | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<TensionStatusId | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'severity' | 'maturity'>('severity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredTensions = useMemo(() => {
    let result = [...tensions];

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(t =>
        t.formulation.toLowerCase().includes(searchLower) ||
        t.ruleName.toLowerCase().includes(searchLower)
      );
    }

    // Filter by family
    if (familyFilter !== 'ALL') {
      result = result.filter(t => t.ruleFamily === familyFilter);
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'severity') {
        return (a.severity - b.severity) * multiplier;
      }
      return (a.maturity - b.maturity) * multiplier;
    });

    return result;
  }, [tensions, search, familyFilter, statusFilter, sortBy, sortOrder]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Family filter */}
        <select
          value={familyFilter}
          onChange={(e) => setFamilyFilter(e.target.value as RuleFamilyId | 'ALL')}
          className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">Toutes les familles</option>
          {Object.entries(RULE_FAMILIES).map(([key, value]) => (
            <option key={key} value={key}>{value.label}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TensionStatusId | 'ALL')}
          className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="ALL">Tous les statuts</option>
          {Object.entries(TENSION_STATUSES).map(([key, value]) => (
            <option key={key} value={key}>{value.label}</option>
          ))}
        </select>

        {/* Sort */}
        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'severity' | 'maturity')}
            className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="severity">Severite</option>
            <option value="maturity">Maturite</option>
          </select>
          <button
            onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </button>
        </div>
      </div>

      {/* Counter */}
      <p className="text-sm text-gray-500">
        {filteredTensions.length} dilemme{filteredTensions.length > 1 ? 's' : ''} trouve{filteredTensions.length > 1 ? 's' : ''}
      </p>

      {/* List */}
      <div className="grid gap-4">
        {filteredTensions.map(tension => (
          <TensionCard
            key={tension.id}
            tension={tension}
            onArbitrate={onArbitrate}
          />
        ))}

        {filteredTensions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun dilemme ne correspond aux criteres
          </div>
        )}
      </div>
    </div>
  );
}
