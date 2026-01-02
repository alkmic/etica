// lib/constants/ethical-domains.ts
// Les 12 domaines de vigilance organisés en 3 cercles

import {
  Lock, Scale, Eye, Target, Shield, Zap,
  Sliders, Handshake, Landmark,
  Leaf, Gem, Globe,
  LucideIcon
} from 'lucide-react';

export type EthicalDomain =
  | 'PRIVACY' | 'EQUITY' | 'TRANSPARENCY' | 'AUTONOMY' | 'SECURITY' | 'RECOURSE'
  | 'MASTERY' | 'RESPONSIBILITY' | 'SOVEREIGNTY'
  | 'SUSTAINABILITY' | 'LOYALTY' | 'SOCIETAL_BALANCE';

export type Circle = 'PERSONS' | 'ORGANIZATION' | 'SOCIETY';

export interface DomainDefinition {
  id: EthicalDomain;
  name: string;
  nameFr: string;
  circle: Circle;
  icon: LucideIcon;
  color: string;
  keyQuestion: string;
  description: string;
  subDimensions: {
    id: string;
    label: string;
    weight: number;
  }[];
}

export interface CircleDefinition {
  id: Circle;
  name: string;
  nameFr: string;
  color: string;
  domains: EthicalDomain[];
}

export const CIRCLES: Record<Circle, CircleDefinition> = {
  PERSONS: {
    id: 'PERSONS',
    name: 'Persons',
    nameFr: 'Les Personnes',
    color: '#3B82F6', // Bleu
    domains: ['PRIVACY', 'EQUITY', 'TRANSPARENCY', 'AUTONOMY', 'SECURITY', 'RECOURSE'],
  },
  ORGANIZATION: {
    id: 'ORGANIZATION',
    name: 'Organization',
    nameFr: 'L\'Organisation',
    color: '#8B5CF6', // Violet
    domains: ['MASTERY', 'RESPONSIBILITY', 'SOVEREIGNTY'],
  },
  SOCIETY: {
    id: 'SOCIETY',
    name: 'Society',
    nameFr: 'La Société',
    color: '#10B981', // Vert
    domains: ['SUSTAINABILITY', 'LOYALTY', 'SOCIETAL_BALANCE'],
  },
};

export const ETHICAL_DOMAINS: Record<EthicalDomain, DomainDefinition> = {
  // ============================================
  // CERCLE 1 : LES PERSONNES
  // ============================================

  PRIVACY: {
    id: 'PRIVACY',
    name: 'Privacy',
    nameFr: 'Vie privée',
    circle: 'PERSONS',
    icon: Lock,
    color: '#3B82F6',
    keyQuestion: 'Les données personnelles sont-elles protégées ?',
    description: 'Protection des données personnelles, minimisation, consentement',
    subDimensions: [
      { id: 'data_minimization', label: 'Minimisation des données', weight: 0.2 },
      { id: 'consent', label: 'Consentement éclairé', weight: 0.2 },
      { id: 'access_rights', label: 'Droits d\'accès/rectification/effacement', weight: 0.2 },
      { id: 'profiling_protection', label: 'Protection contre le profilage', weight: 0.2 },
      { id: 'transfer_security', label: 'Sécurité des transferts', weight: 0.2 },
    ],
  },

  EQUITY: {
    id: 'EQUITY',
    name: 'Equity',
    nameFr: 'Équité',
    circle: 'PERSONS',
    icon: Scale,
    color: '#3B82F6',
    keyQuestion: 'Le traitement est-il juste pour tous ?',
    description: 'Non-discrimination, absence de biais, égalité d\'accès',
    subDimensions: [
      { id: 'direct_discrimination', label: 'Absence de discrimination directe', weight: 0.25 },
      { id: 'indirect_discrimination', label: 'Absence de discrimination indirecte', weight: 0.25 },
      { id: 'group_fairness', label: 'Équité entre groupes', weight: 0.25 },
      { id: 'atypical_cases', label: 'Traitement des cas atypiques', weight: 0.25 },
    ],
  },

  TRANSPARENCY: {
    id: 'TRANSPARENCY',
    name: 'Transparency',
    nameFr: 'Transparence',
    circle: 'PERSONS',
    icon: Eye,
    color: '#3B82F6',
    keyQuestion: 'Les personnes comprennent-elles ce qui se passe ?',
    description: 'Information sur l\'IA, explication des décisions, communication des limites',
    subDimensions: [
      { id: 'ai_disclosure', label: 'Information sur l\'utilisation d\'IA', weight: 0.25 },
      { id: 'criteria_explanation', label: 'Explication des critères', weight: 0.25 },
      { id: 'data_access', label: 'Accès aux données utilisées', weight: 0.25 },
      { id: 'limitations_communication', label: 'Communication des limites', weight: 0.25 },
    ],
  },

  AUTONOMY: {
    id: 'AUTONOMY',
    name: 'Autonomy',
    nameFr: 'Autonomie',
    circle: 'PERSONS',
    icon: Target,
    color: '#3B82F6',
    keyQuestion: 'Les personnes gardent-elles leur liberté de choix ?',
    description: 'Liberté de choix, possibilité de refus, alternatives disponibles',
    subDimensions: [
      { id: 'refusal_option', label: 'Possibilité de refuser', weight: 0.25 },
      { id: 'alternatives', label: 'Alternatives non-algorithmiques', weight: 0.25 },
      { id: 'no_manipulation', label: 'Absence de manipulation', weight: 0.25 },
      { id: 'preference_respect', label: 'Respect des préférences', weight: 0.25 },
    ],
  },

  SECURITY: {
    id: 'SECURITY',
    name: 'Security',
    nameFr: 'Sécurité',
    circle: 'PERSONS',
    icon: Shield,
    color: '#3B82F6',
    keyQuestion: 'Le système protège-t-il contre les préjudices ?',
    description: 'Protection contre les erreurs, robustesse, fiabilité',
    subDimensions: [
      { id: 'error_protection', label: 'Protection contre les erreurs', weight: 0.25 },
      { id: 'attack_robustness', label: 'Robustesse face aux attaques', weight: 0.25 },
      { id: 'result_reliability', label: 'Fiabilité des résultats', weight: 0.25 },
      { id: 'misuse_prevention', label: 'Prévention des mésusages', weight: 0.25 },
    ],
  },

  RECOURSE: {
    id: 'RECOURSE',
    name: 'Recourse',
    nameFr: 'Recours',
    circle: 'PERSONS',
    icon: Zap,
    color: '#3B82F6',
    keyQuestion: 'Les personnes peuvent-elles contester et obtenir réparation ?',
    description: 'Procédure de contestation, intervention humaine, réparation',
    subDimensions: [
      { id: 'contestation_procedure', label: 'Procédure de contestation', weight: 0.25 },
      { id: 'human_intervention', label: 'Intervention humaine possible', weight: 0.25 },
      { id: 'response_time', label: 'Délai de réponse raisonnable', weight: 0.25 },
      { id: 'effective_remedy', label: 'Réparation effective', weight: 0.25 },
    ],
  },

  // ============================================
  // CERCLE 2 : L'ORGANISATION
  // ============================================

  MASTERY: {
    id: 'MASTERY',
    name: 'Mastery',
    nameFr: 'Maîtrise',
    circle: 'ORGANIZATION',
    icon: Sliders,
    color: '#8B5CF6',
    keyQuestion: 'Comprenez-vous et contrôlez-vous votre système ?',
    description: 'Compréhension technique, capacité de modification, traçabilité',
    subDimensions: [
      { id: 'technical_understanding', label: 'Compréhension technique', weight: 0.25 },
      { id: 'modification_capability', label: 'Capacité de modification', weight: 0.25 },
      { id: 'decision_traceability', label: 'Traçabilité des décisions', weight: 0.25 },
      { id: 'internal_skills', label: 'Compétences internes', weight: 0.25 },
    ],
  },

  RESPONSIBILITY: {
    id: 'RESPONSIBILITY',
    name: 'Responsibility',
    nameFr: 'Responsabilité',
    circle: 'ORGANIZATION',
    icon: Handshake,
    color: '#8B5CF6',
    keyQuestion: 'Les responsabilités sont-elles claires ?',
    description: 'Identification du responsable, chaîne de responsabilité, escalade',
    subDimensions: [
      { id: 'owner_identification', label: 'Responsable identifié', weight: 0.25 },
      { id: 'liability_chain', label: 'Chaîne de responsabilité', weight: 0.25 },
      { id: 'escalation_process', label: 'Processus d\'escalade', weight: 0.25 },
      { id: 'management_commitment', label: 'Engagement direction', weight: 0.25 },
    ],
  },

  SOVEREIGNTY: {
    id: 'SOVEREIGNTY',
    name: 'Sovereignty',
    nameFr: 'Souveraineté',
    circle: 'ORGANIZATION',
    icon: Landmark,
    color: '#8B5CF6',
    keyQuestion: 'Êtes-vous indépendant de vos fournisseurs ?',
    description: 'Dépendance aux APIs externes, localisation des données, réversibilité',
    subDimensions: [
      { id: 'provider_dependency', label: 'Dépendance fournisseurs', weight: 0.25 },
      { id: 'data_location', label: 'Localisation des données', weight: 0.25 },
      { id: 'switch_capability', label: 'Capacité à changer', weight: 0.25 },
      { id: 'evolution_control', label: 'Maîtrise des évolutions', weight: 0.25 },
    ],
  },

  // ============================================
  // CERCLE 3 : LA SOCIÉTÉ
  // ============================================

  SUSTAINABILITY: {
    id: 'SUSTAINABILITY',
    name: 'Sustainability',
    nameFr: 'Durabilité',
    circle: 'SOCIETY',
    icon: Leaf,
    color: '#10B981',
    keyQuestion: 'L\'impact environnemental et social est-il maîtrisé ?',
    description: 'Empreinte carbone, impact emploi, sobriété numérique',
    subDimensions: [
      { id: 'energy_consumption', label: 'Consommation énergétique', weight: 0.25 },
      { id: 'carbon_footprint', label: 'Empreinte carbone', weight: 0.25 },
      { id: 'employment_impact', label: 'Impact sur l\'emploi', weight: 0.25 },
      { id: 'digital_sobriety', label: 'Sobriété numérique', weight: 0.25 },
    ],
  },

  LOYALTY: {
    id: 'LOYALTY',
    name: 'Loyalty',
    nameFr: 'Loyauté',
    circle: 'SOCIETY',
    icon: Gem,
    color: '#10B981',
    keyQuestion: 'Les relations avec les parties prenantes sont-elles équilibrées ?',
    description: 'Transparence partenaires, partage de la valeur, respect des engagements',
    subDimensions: [
      { id: 'partner_transparency', label: 'Transparence partenaires', weight: 0.25 },
      { id: 'value_sharing', label: 'Partage de la valeur', weight: 0.25 },
      { id: 'commitment_respect', label: 'Respect des engagements', weight: 0.25 },
      { id: 'risk_communication', label: 'Communication des risques', weight: 0.25 },
    ],
  },

  SOCIETAL_BALANCE: {
    id: 'SOCIETAL_BALANCE',
    name: 'Societal Balance',
    nameFr: 'Équilibre sociétal',
    circle: 'SOCIETY',
    icon: Globe,
    color: '#10B981',
    keyQuestion: 'Le système contribue-t-il positivement à la société ?',
    description: 'Concentration du pouvoir, effets sur les inégalités, bien commun',
    subDimensions: [
      { id: 'power_concentration', label: 'Concentration du pouvoir', weight: 0.25 },
      { id: 'competition_effects', label: 'Effets sur la concurrence', weight: 0.25 },
      { id: 'inequality_impact', label: 'Impact sur les inégalités', weight: 0.25 },
      { id: 'common_good', label: 'Contribution au bien commun', weight: 0.25 },
    ],
  },
};

// Helper functions
export function getDomainsByCircle(circle: Circle): DomainDefinition[] {
  return Object.values(ETHICAL_DOMAINS).filter(d => d.circle === circle);
}

export function getDomainColor(domain: EthicalDomain): string {
  return CIRCLES[ETHICAL_DOMAINS[domain].circle].color;
}

export function getAllDomains(): DomainDefinition[] {
  return Object.values(ETHICAL_DOMAINS);
}

export function formatDilemma(domainA: EthicalDomain, domainB: EthicalDomain): string {
  return `${ETHICAL_DOMAINS[domainA].nameFr} ↔ ${ETHICAL_DOMAINS[domainB].nameFr}`;
}

export function getDomainsForRadarChart(): { id: EthicalDomain; label: string; color: string }[] {
  return Object.values(ETHICAL_DOMAINS).map(d => ({
    id: d.id,
    label: d.nameFr,
    color: getDomainColor(d.id),
  }));
}
