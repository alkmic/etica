// lib/constants/ethical-domains.ts
// Synchronisé avec enum EthicalDomain dans Prisma

import {
  Lock, Scale, Eye, Target, Shield, Zap,
  Sliders, Handshake, Landmark,
  Leaf, Gem, Globe,
  LucideIcon
} from 'lucide-react';

export type EthicalDomainId =
  | 'PRIVACY' | 'EQUITY' | 'TRANSPARENCY' | 'AUTONOMY' | 'SECURITY' | 'RECOURSE'
  | 'MASTERY' | 'RESPONSIBILITY' | 'SOVEREIGNTY'
  | 'SUSTAINABILITY' | 'LOYALTY' | 'SOCIETAL_BALANCE';

export type Circle = 'PERSONS' | 'ORGANIZATION' | 'SOCIETY';

export interface DomainDefinition {
  id: EthicalDomainId;
  name: string;
  nameFr: string;
  circle: Circle;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  keyQuestion: string;
  description: string;
  subDimensions: {
    id: string;
    label: string;
    weight: number;
  }[];
}

export const ETHICAL_DOMAINS: Record<EthicalDomainId, DomainDefinition> = {
  // ========== CERCLE 1 : LES PERSONNES ==========
  PRIVACY: {
    id: 'PRIVACY',
    name: 'Privacy',
    nameFr: 'Vie Privee',
    circle: 'PERSONS',
    icon: Lock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    keyQuestion: 'Les donnees personnelles sont-elles protegees ?',
    description: 'Protection des donnees personnelles et respect de l\'intimite',
    subDimensions: [
      { id: 'data_minimization', label: 'Minimisation des donnees', weight: 0.25 },
      { id: 'purpose_limitation', label: 'Limitation des finalites', weight: 0.25 },
      { id: 'consent_quality', label: 'Qualite du consentement', weight: 0.25 },
      { id: 'data_security', label: 'Securite des donnees', weight: 0.25 },
    ],
  },
  EQUITY: {
    id: 'EQUITY',
    name: 'Equity',
    nameFr: 'Equite',
    circle: 'PERSONS',
    icon: Scale,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    keyQuestion: 'Le systeme traite-t-il tous les utilisateurs equitablement ?',
    description: 'Non-discrimination et traitement equitable',
    subDimensions: [
      { id: 'bias_detection', label: 'Detection des biais', weight: 0.30 },
      { id: 'fair_outcomes', label: 'Resultats equitables', weight: 0.30 },
      { id: 'accessibility', label: 'Accessibilite', weight: 0.20 },
      { id: 'representation', label: 'Representativite', weight: 0.20 },
    ],
  },
  TRANSPARENCY: {
    id: 'TRANSPARENCY',
    name: 'Transparency',
    nameFr: 'Transparence',
    circle: 'PERSONS',
    icon: Eye,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    keyQuestion: 'Les utilisateurs comprennent-ils comment le systeme fonctionne ?',
    description: 'Explicabilite et information des utilisateurs',
    subDimensions: [
      { id: 'explainability', label: 'Explicabilite des decisions', weight: 0.30 },
      { id: 'disclosure', label: 'Divulgation de l\'usage IA', weight: 0.25 },
      { id: 'documentation', label: 'Documentation accessible', weight: 0.25 },
      { id: 'traceability', label: 'Tracabilite', weight: 0.20 },
    ],
  },
  AUTONOMY: {
    id: 'AUTONOMY',
    name: 'Autonomy',
    nameFr: 'Autonomie',
    circle: 'PERSONS',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    keyQuestion: 'Les utilisateurs gardent-ils leur liberte de choix ?',
    description: 'Preservation de la liberte de choix et d\'action',
    subDimensions: [
      { id: 'opt_out', label: 'Possibilite de refus', weight: 0.30 },
      { id: 'human_override', label: 'Controle humain', weight: 0.30 },
      { id: 'manipulation_free', label: 'Absence de manipulation', weight: 0.25 },
      { id: 'informed_choice', label: 'Choix eclaire', weight: 0.15 },
    ],
  },
  SECURITY: {
    id: 'SECURITY',
    name: 'Security',
    nameFr: 'Securite',
    circle: 'PERSONS',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    keyQuestion: 'Les utilisateurs sont-ils proteges contre les erreurs et abus ?',
    description: 'Protection contre les erreurs, abus et attaques',
    subDimensions: [
      { id: 'error_handling', label: 'Gestion des erreurs', weight: 0.25 },
      { id: 'robustness', label: 'Robustesse', weight: 0.25 },
      { id: 'adversarial_protection', label: 'Protection adversariale', weight: 0.25 },
      { id: 'fallback_mechanisms', label: 'Mecanismes de repli', weight: 0.25 },
    ],
  },
  RECOURSE: {
    id: 'RECOURSE',
    name: 'Recourse',
    nameFr: 'Recours',
    circle: 'PERSONS',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    keyQuestion: 'Les utilisateurs peuvent-ils contester les decisions ?',
    description: 'Possibilite de contestation et de recours',
    subDimensions: [
      { id: 'appeal_mechanism', label: 'Mecanisme d\'appel', weight: 0.35 },
      { id: 'human_review', label: 'Revue humaine', weight: 0.35 },
      { id: 'response_time', label: 'Delai de reponse', weight: 0.15 },
      { id: 'remedy_effectiveness', label: 'Efficacite des recours', weight: 0.15 },
    ],
  },

  // ========== CERCLE 2 : L'ORGANISATION ==========
  MASTERY: {
    id: 'MASTERY',
    name: 'Mastery',
    nameFr: 'Maitrise',
    circle: 'ORGANIZATION',
    icon: Sliders,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    keyQuestion: 'L\'organisation comprend-elle et controle-t-elle le systeme ?',
    description: 'Comprehension et controle du systeme par l\'organisation',
    subDimensions: [
      { id: 'technical_understanding', label: 'Comprehension technique', weight: 0.30 },
      { id: 'monitoring', label: 'Monitoring', weight: 0.25 },
      { id: 'update_control', label: 'Controle des mises a jour', weight: 0.25 },
      { id: 'kill_switch', label: 'Capacite d\'arret', weight: 0.20 },
    ],
  },
  RESPONSIBILITY: {
    id: 'RESPONSIBILITY',
    name: 'Responsibility',
    nameFr: 'Responsabilite',
    circle: 'ORGANIZATION',
    icon: Handshake,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    keyQuestion: 'La chaine de responsabilite est-elle claire ?',
    description: 'Clarte de la chaine de responsabilite',
    subDimensions: [
      { id: 'accountability_chain', label: 'Chaine de responsabilite', weight: 0.35 },
      { id: 'governance', label: 'Gouvernance', weight: 0.25 },
      { id: 'liability_clarity', label: 'Clarte des responsabilites', weight: 0.25 },
      { id: 'incident_response', label: 'Reponse aux incidents', weight: 0.15 },
    ],
  },
  SOVEREIGNTY: {
    id: 'SOVEREIGNTY',
    name: 'Sovereignty',
    nameFr: 'Souverainete',
    circle: 'ORGANIZATION',
    icon: Landmark,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    keyQuestion: 'L\'organisation est-elle independante de ses fournisseurs ?',
    description: 'Independance vis-a-vis des fournisseurs et technologies',
    subDimensions: [
      { id: 'vendor_independence', label: 'Independance fournisseur', weight: 0.30 },
      { id: 'data_portability', label: 'Portabilite des donnees', weight: 0.25 },
      { id: 'technology_lock_in', label: 'Evitement du lock-in', weight: 0.25 },
      { id: 'strategic_autonomy', label: 'Autonomie strategique', weight: 0.20 },
    ],
  },

  // ========== CERCLE 3 : LA SOCIETE ==========
  SUSTAINABILITY: {
    id: 'SUSTAINABILITY',
    name: 'Sustainability',
    nameFr: 'Durabilite',
    circle: 'SOCIETY',
    icon: Leaf,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    keyQuestion: 'L\'impact environnemental et social est-il maitrise ?',
    description: 'Impact environnemental et social a long terme',
    subDimensions: [
      { id: 'carbon_footprint', label: 'Empreinte carbone', weight: 0.30 },
      { id: 'resource_efficiency', label: 'Efficience des ressources', weight: 0.25 },
      { id: 'social_impact', label: 'Impact social', weight: 0.25 },
      { id: 'long_term_viability', label: 'Viabilite long terme', weight: 0.20 },
    ],
  },
  LOYALTY: {
    id: 'LOYALTY',
    name: 'Loyalty',
    nameFr: 'Loyaute',
    circle: 'SOCIETY',
    icon: Gem,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    keyQuestion: 'Les relations avec les parties prenantes sont-elles equilibrees ?',
    description: 'Relations equilibrees avec toutes les parties prenantes',
    subDimensions: [
      { id: 'stakeholder_balance', label: 'Equilibre parties prenantes', weight: 0.30 },
      { id: 'fair_value_distribution', label: 'Distribution equitable valeur', weight: 0.25 },
      { id: 'trust_preservation', label: 'Preservation confiance', weight: 0.25 },
      { id: 'commitment_honoring', label: 'Respect engagements', weight: 0.20 },
    ],
  },
  SOCIETAL_BALANCE: {
    id: 'SOCIETAL_BALANCE',
    name: 'Societal Balance',
    nameFr: 'Equilibre Societal',
    circle: 'SOCIETY',
    icon: Globe,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    keyQuestion: 'Le systeme contribue-t-il au bien commun ?',
    description: 'Contribution positive a la societe',
    subDimensions: [
      { id: 'public_interest', label: 'Interet public', weight: 0.30 },
      { id: 'democratic_values', label: 'Valeurs democratiques', weight: 0.25 },
      { id: 'power_balance', label: 'Equilibre des pouvoirs', weight: 0.25 },
      { id: 'common_good', label: 'Bien commun', weight: 0.20 },
    ],
  },
};

// Helpers
export const DOMAINS_BY_CIRCLE: Record<Circle, EthicalDomainId[]> = {
  PERSONS: ['PRIVACY', 'EQUITY', 'TRANSPARENCY', 'AUTONOMY', 'SECURITY', 'RECOURSE'],
  ORGANIZATION: ['MASTERY', 'RESPONSIBILITY', 'SOVEREIGNTY'],
  SOCIETY: ['SUSTAINABILITY', 'LOYALTY', 'SOCIETAL_BALANCE'],
};

export const ALL_DOMAIN_IDS = Object.keys(ETHICAL_DOMAINS) as EthicalDomainId[];

export function getDomainsByCircle(circle: Circle): DomainDefinition[] {
  return DOMAINS_BY_CIRCLE[circle].map(id => ETHICAL_DOMAINS[id]);
}

export function getDomainColor(domainId: EthicalDomainId): string {
  return ETHICAL_DOMAINS[domainId]?.color ?? 'text-gray-600';
}

export function getDomainBgColor(domainId: EthicalDomainId): string {
  return ETHICAL_DOMAINS[domainId]?.bgColor ?? 'bg-gray-100';
}

export function getCircleLabel(circle: Circle): string {
  const labels: Record<Circle, string> = {
    PERSONS: 'Les Personnes',
    ORGANIZATION: 'L\'Organisation',
    SOCIETY: 'La Societe',
  };
  return labels[circle];
}
