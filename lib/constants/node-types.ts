// Types de nœuds ETICA - Version enrichie avec sous-types et attributs
// Chaque type de nœud a des sous-types spécifiques et des attributs qui alimentent les règles de détection

import { DomainId } from './domains'

// ============================================
// HUMAN (Personne)
// ============================================

export const HUMAN_SUBTYPES = {
  END_USER: {
    id: 'END_USER',
    label: 'Utilisateur final',
    description: 'Personne qui utilise directement le système',
    icon: 'User',
  },
  OPERATOR: {
    id: 'OPERATOR',
    label: 'Opérateur',
    description: 'Personne qui opère ou configure le système',
    icon: 'Settings',
  },
  SUPERVISOR_HITL: {
    id: 'SUPERVISOR_HITL',
    label: 'Superviseur HITL',
    description: 'Humain dans la boucle (Human In The Loop) pour validation',
    icon: 'UserCheck',
  },
  DATA_SUBJECT: {
    id: 'DATA_SUBJECT',
    label: 'Personne concernée',
    description: 'Personne dont les données sont traitées',
    icon: 'UserCircle',
  },
  DECISION_SUBJECT: {
    id: 'DECISION_SUBJECT',
    label: 'Sujet de décision',
    description: 'Personne affectée par une décision du système',
    icon: 'Target',
  },
  RECOURSE_MANAGER: {
    id: 'RECOURSE_MANAGER',
    label: 'Gestionnaire de recours',
    description: 'Personne chargée de traiter les contestations',
    icon: 'MessageSquare',
  },
} as const

export type HumanSubtypeId = keyof typeof HUMAN_SUBTYPES

export interface HumanAttributes {
  subtype: HumanSubtypeId
  isVulnerable: boolean // Population vulnérable ?
  hasConsent: boolean // Consentement obtenu ?
  canContest: boolean // Peut contester ?
  isMinor: boolean // Mineur ?
  vulnerabilityReasons?: string[] // Types de vulnérabilité
}

// ============================================
// AI (IA / Algorithme)
// ============================================

export const AI_SUBTYPES = {
  ML_CLASSIC: {
    id: 'ML_CLASSIC',
    label: 'ML classique',
    description: 'Régression, arbres de décision, SVM, etc.',
    icon: 'TrendingUp',
    opacity: 2, // Relativement explicable
  },
  DEEP_LEARNING: {
    id: 'DEEP_LEARNING',
    label: 'Deep Learning',
    description: 'Réseaux de neurones profonds',
    icon: 'Brain',
    opacity: 4, // Difficilement explicable
  },
  LLM_GENAI: {
    id: 'LLM_GENAI',
    label: 'LLM / IA Générative',
    description: 'Modèles de langage, génération de contenu',
    icon: 'Sparkles',
    opacity: 5, // Très opaque
  },
  RULE_ENGINE: {
    id: 'RULE_ENGINE',
    label: 'Moteur de règles',
    description: 'Règles métier explicites',
    icon: 'List',
    opacity: 1, // Très explicable
  },
  SCORING: {
    id: 'SCORING',
    label: 'Scoring',
    description: 'Calcul de score numérique',
    icon: 'Hash',
    opacity: 2,
  },
  RECOMMENDATION: {
    id: 'RECOMMENDATION',
    label: 'Recommandation',
    description: 'Système de recommandation',
    icon: 'ThumbsUp',
    opacity: 3,
  },
  CLASSIFICATION: {
    id: 'CLASSIFICATION',
    label: 'Classification',
    description: 'Catégorisation automatique',
    icon: 'Layers',
    opacity: 3,
  },
  DETECTION: {
    id: 'DETECTION',
    label: 'Détection',
    description: 'Détection de patterns, anomalies, fraude',
    icon: 'Search',
    opacity: 3,
  },
  PREDICTION: {
    id: 'PREDICTION',
    label: 'Prédiction',
    description: 'Prédiction de comportements ou événements',
    icon: 'Clock',
    opacity: 3,
  },
  MATCHING: {
    id: 'MATCHING',
    label: 'Matching',
    description: 'Appariement, mise en relation',
    icon: 'Link',
    opacity: 2,
  },
} as const

export type AISubtypeId = keyof typeof AI_SUBTYPES

export const AI_AUTONOMY_LEVELS = {
  INFORMATIVE: {
    id: 'INFORMATIVE',
    label: 'Informatif',
    description: 'Fournit uniquement des informations',
    level: 1,
  },
  SUGGESTIVE: {
    id: 'SUGGESTIVE',
    label: 'Suggestif',
    description: 'Propose des suggestions, humain décide',
    level: 2,
  },
  DECISIVE: {
    id: 'DECISIVE',
    label: 'Décisif',
    description: 'Prend des décisions avec validation humaine',
    level: 3,
  },
  AUTONOMOUS: {
    id: 'AUTONOMOUS',
    label: 'Autonome',
    description: 'Prend des décisions sans intervention humaine',
    level: 4,
  },
} as const

export type AIAutonomyLevelId = keyof typeof AI_AUTONOMY_LEVELS

export const AI_COMPLEXITY_LEVELS = {
  SIMPLE: {
    id: 'SIMPLE',
    label: 'Simple',
    description: 'Règles simples, facilement vérifiables',
    level: 1,
  },
  MODERATE: {
    id: 'MODERATE',
    label: 'Modéré',
    description: 'Logique compréhensible avec effort',
    level: 2,
  },
  COMPLEX: {
    id: 'COMPLEX',
    label: 'Complexe',
    description: 'Difficile à comprendre sans expertise',
    level: 3,
  },
  OPAQUE: {
    id: 'OPAQUE',
    label: 'Opaque',
    description: 'Fonctionnement essentiellement inexplicable',
    level: 4,
  },
} as const

export type AIComplexityLevelId = keyof typeof AI_COMPLEXITY_LEVELS

export interface AIAttributes {
  subtype: AISubtypeId
  hasExplainability: boolean // Explicabilité disponible ?
  hasBiasTests: boolean // Tests de biais effectués ?
  hasHumanReview: boolean // Revue humaine systématique ?
  autonomyLevel: AIAutonomyLevelId
  complexityLevel: AIComplexityLevelId
  modelDescription?: string // Description du modèle
  trainingDataDescription?: string // Description des données d'entraînement
}

// ============================================
// INFRA (Infrastructure)
// ============================================

export const INFRA_SUBTYPES = {
  DATABASE: {
    id: 'DATABASE',
    label: 'Base de données',
    description: 'Stockage structuré de données',
    icon: 'Database',
  },
  API_EXTERNAL: {
    id: 'API_EXTERNAL',
    label: 'API externe',
    description: 'Service tiers accessible via API',
    icon: 'Globe',
  },
  STORAGE: {
    id: 'STORAGE',
    label: 'Stockage',
    description: 'Stockage de fichiers ou objets',
    icon: 'HardDrive',
  },
  INTERFACE: {
    id: 'INTERFACE',
    label: 'Interface',
    description: 'Application ou interface utilisateur',
    icon: 'Monitor',
  },
  DATA_LAKE: {
    id: 'DATA_LAKE',
    label: 'Data Lake',
    description: 'Lac de données non structurées',
    icon: 'Waves',
  },
  CLOUD: {
    id: 'CLOUD',
    label: 'Cloud',
    description: 'Service cloud (AWS, GCP, Azure, etc.)',
    icon: 'Cloud',
  },
} as const

export type InfraSubtypeId = keyof typeof INFRA_SUBTYPES

export const RETENTION_POLICIES = {
  MINIMAL: {
    id: 'MINIMAL',
    label: 'Minimale',
    description: 'Suppression immédiate après usage',
    months: 0,
    level: 1,
  },
  LESS_THAN_YEAR: {
    id: 'LESS_THAN_YEAR',
    label: '< 1 an',
    description: 'Conservation courte',
    months: 12,
    level: 2,
  },
  STANDARD: {
    id: 'STANDARD',
    label: 'Standard',
    description: '1 à 3 ans',
    months: 36,
    level: 3,
  },
  LONG: {
    id: 'LONG',
    label: 'Longue',
    description: '3 à 5 ans',
    months: 60,
    level: 4,
  },
  MORE_THAN_5_YEARS: {
    id: 'MORE_THAN_5_YEARS',
    label: '> 5 ans',
    description: 'Conservation très longue',
    months: 120,
    level: 5,
  },
  INDEFINITE: {
    id: 'INDEFINITE',
    label: 'Indéfinie',
    description: 'Pas de limite de conservation',
    months: -1,
    level: 6,
  },
} as const

export type RetentionPolicyId = keyof typeof RETENTION_POLICIES

export const DATA_LOCATIONS = {
  FRANCE: {
    id: 'FRANCE',
    label: 'France',
    description: 'Hébergement en France',
    isEU: true,
    riskLevel: 1,
  },
  EU: {
    id: 'EU',
    label: 'Union Européenne',
    description: 'Hébergement dans l\'UE (hors France)',
    isEU: true,
    riskLevel: 1,
  },
  US: {
    id: 'US',
    label: 'États-Unis',
    description: 'Hébergement aux USA',
    isEU: false,
    riskLevel: 3,
  },
  OTHER: {
    id: 'OTHER',
    label: 'Autre',
    description: 'Autre localisation',
    isEU: false,
    riskLevel: 4,
  },
} as const

export type DataLocationId = keyof typeof DATA_LOCATIONS

export interface InfraAttributes {
  subtype: InfraSubtypeId
  isEncrypted: boolean // Chiffrement ?
  retentionPolicy: RetentionPolicyId
  hasErasureProcess: boolean // Processus d'effacement ?
  location: DataLocationId
  provider?: string // Nom du fournisseur
}

// ============================================
// ORG (Organisation)
// ============================================

export const ORG_SUBTYPES = {
  INTERNAL_SERVICE: {
    id: 'INTERNAL_SERVICE',
    label: 'Service interne',
    description: 'Département ou équipe interne',
    icon: 'Building',
  },
  SUBCONTRACTOR: {
    id: 'SUBCONTRACTOR',
    label: 'Sous-traitant',
    description: 'Prestataire sous contrat',
    icon: 'Briefcase',
  },
  PARTNER: {
    id: 'PARTNER',
    label: 'Partenaire',
    description: 'Organisation partenaire',
    icon: 'Handshake',
  },
  REGULATOR: {
    id: 'REGULATOR',
    label: 'Régulateur',
    description: 'Autorité de régulation',
    icon: 'Scale',
  },
  DATA_PROVIDER: {
    id: 'DATA_PROVIDER',
    label: 'Fournisseur de données',
    description: 'Tiers fournissant des données',
    icon: 'Download',
  },
} as const

export type OrgSubtypeId = keyof typeof ORG_SUBTYPES

export interface OrgAttributes {
  subtype: OrgSubtypeId
  hasDataContract: boolean // Contrat de données ?
  isOutsideEU: boolean // Hors UE ?
  isDataController: boolean // Responsable de traitement ?
  isDataProcessor: boolean // Sous-traitant RGPD ?
  jurisdiction?: string // Juridiction applicable
}

// ============================================
// Configuration des nœuds par type
// ============================================

export const NODE_TYPE_CONFIG = {
  HUMAN: {
    id: 'HUMAN',
    label: 'Personne',
    description: 'Personne physique interagissant avec le système',
    icon: 'User',
    color: '#10B981', // emerald
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-400',
    subtypes: HUMAN_SUBTYPES,
    defaultAttributes: {
      subtype: 'END_USER',
      isVulnerable: false,
      hasConsent: true,
      canContest: true,
      isMinor: false,
    } as HumanAttributes,
    // Domaines particulièrement concernés par ce type de nœud
    relevantDomains: ['AUTONOMY', 'PRIVACY', 'RECOURSE'] as DomainId[],
  },
  AI: {
    id: 'AI',
    label: 'IA / Algorithme',
    description: 'Composant d\'intelligence artificielle ou algorithmique',
    icon: 'Brain',
    color: '#8B5CF6', // violet
    bgColor: 'bg-violet-100',
    borderColor: 'border-violet-400',
    subtypes: AI_SUBTYPES,
    defaultAttributes: {
      subtype: 'ML_CLASSIC',
      hasExplainability: false,
      hasBiasTests: false,
      hasHumanReview: false,
      autonomyLevel: 'INFORMATIVE',
      complexityLevel: 'MODERATE',
    } as AIAttributes,
    relevantDomains: ['TRANSPARENCY', 'EQUITY', 'ACCOUNTABILITY'] as DomainId[],
  },
  INFRA: {
    id: 'INFRA',
    label: 'Infrastructure',
    description: 'Composant technique ou stockage de données',
    icon: 'Server',
    color: '#3B82F6', // blue
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400',
    subtypes: INFRA_SUBTYPES,
    defaultAttributes: {
      subtype: 'DATABASE',
      isEncrypted: true,
      retentionPolicy: 'STANDARD',
      hasErasureProcess: false,
      location: 'EU',
    } as InfraAttributes,
    relevantDomains: ['PRIVACY', 'SECURITY'] as DomainId[],
  },
  ORG: {
    id: 'ORG',
    label: 'Organisation',
    description: 'Entité juridique ou service organisationnel',
    icon: 'Building',
    color: '#F59E0B', // amber
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-400',
    subtypes: ORG_SUBTYPES,
    defaultAttributes: {
      subtype: 'INTERNAL_SERVICE',
      hasDataContract: true,
      isOutsideEU: false,
      isDataController: false,
      isDataProcessor: false,
    } as OrgAttributes,
    relevantDomains: ['ACCOUNTABILITY', 'PRIVACY'] as DomainId[],
  },
} as const

export type NodeTypeId = keyof typeof NODE_TYPE_CONFIG

// Union type pour les attributs
export type NodeAttributes = HumanAttributes | AIAttributes | InfraAttributes | OrgAttributes

// Fonction pour obtenir les attributs par défaut d'un type de nœud
export function getDefaultNodeAttributes(nodeType: NodeTypeId): NodeAttributes {
  return NODE_TYPE_CONFIG[nodeType].defaultAttributes
}

// Fonction pour vérifier si un nœud a une certaine caractéristique
export function nodeHasCharacteristic(
  nodeType: NodeTypeId,
  attributes: NodeAttributes,
  characteristic: string
): boolean {
  switch (nodeType) {
    case 'HUMAN': {
      const humanAttrs = attributes as HumanAttributes
      switch (characteristic) {
        case 'vulnerable': return humanAttrs.isVulnerable
        case 'minor': return humanAttrs.isMinor
        case 'consent': return humanAttrs.hasConsent
        case 'canContest': return humanAttrs.canContest
        default: return false
      }
    }
    case 'AI': {
      const aiAttrs = attributes as AIAttributes
      switch (characteristic) {
        case 'explainable': return aiAttrs.hasExplainability
        case 'biasTested': return aiAttrs.hasBiasTests
        case 'humanReview': return aiAttrs.hasHumanReview
        case 'autonomous': return aiAttrs.autonomyLevel === 'AUTONOMOUS'
        case 'opaque': return aiAttrs.complexityLevel === 'OPAQUE'
        case 'llm': return aiAttrs.subtype === 'LLM_GENAI'
        case 'scoring': return aiAttrs.subtype === 'SCORING'
        case 'prediction': return aiAttrs.subtype === 'PREDICTION'
        default: return false
      }
    }
    case 'INFRA': {
      const infraAttrs = attributes as InfraAttributes
      switch (characteristic) {
        case 'encrypted': return infraAttrs.isEncrypted
        case 'erasable': return infraAttrs.hasErasureProcess
        case 'outsideEU': return infraAttrs.location !== 'FRANCE' && infraAttrs.location !== 'EU'
        case 'longRetention': return ['MORE_THAN_5_YEARS', 'INDEFINITE'].includes(infraAttrs.retentionPolicy)
        default: return false
      }
    }
    case 'ORG': {
      const orgAttrs = attributes as OrgAttributes
      switch (characteristic) {
        case 'hasContract': return orgAttrs.hasDataContract
        case 'outsideEU': return orgAttrs.isOutsideEU
        case 'isController': return orgAttrs.isDataController
        case 'isProcessor': return orgAttrs.isDataProcessor
        default: return false
      }
    }
    default:
      return false
  }
}
