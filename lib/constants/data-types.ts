// Types de données et classifications ETICA - Version enrichie
// Inclut les catégories de données, natures de flux avec déclencheurs de domaines

import { DomainId } from './domains'

// ============================================
// CATÉGORIES DE DONNÉES PERSONNELLES
// ============================================

export const DATA_CATEGORIES = {
  identity: {
    id: 'identity',
    label: 'Identité',
    description: 'Nom, prénom, date de naissance, numéro d\'identification',
    icon: 'User',
    sensitivity: 'standard',
    sensitivityLevel: 1,
    examples: ['Nom', 'Prénom', 'Date de naissance', 'Numéro de sécurité sociale'],
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    description: 'Email, téléphone, adresse postale',
    icon: 'Mail',
    sensitivity: 'standard',
    sensitivityLevel: 1,
    examples: ['Email', 'Téléphone', 'Adresse postale'],
  },
  location: {
    id: 'location',
    label: 'Localisation',
    description: 'GPS, adresse IP, historique de déplacements',
    icon: 'MapPin',
    sensitivity: 'sensitive',
    sensitivityLevel: 2,
    examples: ['Géolocalisation', 'Adresse IP', 'Historique des déplacements'],
  },
  behavior: {
    id: 'behavior',
    label: 'Comportement',
    description: 'Historique de navigation, préférences, interactions',
    icon: 'Activity',
    sensitivity: 'sensitive',
    sensitivityLevel: 2,
    examples: ['Pages visitées', 'Clics', 'Temps passé', 'Achats'],
  },
  health: {
    id: 'health',
    label: 'Santé',
    description: 'Données médicales, handicap, traitements',
    icon: 'Heart',
    sensitivity: 'highly_sensitive',
    sensitivityLevel: 3,
    examples: ['Dossier médical', 'Handicap', 'Traitements', 'Allergies'],
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    description: 'Revenus, comptes bancaires, transactions',
    icon: 'CreditCard',
    sensitivity: 'sensitive',
    sensitivityLevel: 2,
    examples: ['Revenus', 'Numéro de compte', 'Historique des transactions'],
  },
  biometric: {
    id: 'biometric',
    label: 'Biométrie',
    description: 'Empreintes digitales, reconnaissance faciale, voix',
    icon: 'Fingerprint',
    sensitivity: 'highly_sensitive',
    sensitivityLevel: 3,
    examples: ['Empreinte digitale', 'Photo du visage', 'Empreinte vocale'],
  },
  opinions: {
    id: 'opinions',
    label: 'Opinions',
    description: 'Opinions politiques, religieuses, syndicales',
    icon: 'MessageCircle',
    sensitivity: 'highly_sensitive',
    sensitivityLevel: 3,
    examples: ['Affiliation politique', 'Croyances religieuses', 'Adhésion syndicale'],
  },
  professional: {
    id: 'professional',
    label: 'Professionnel',
    description: 'CV, expérience, formation, compétences',
    icon: 'Briefcase',
    sensitivity: 'standard',
    sensitivityLevel: 1,
    examples: ['CV', 'Diplômes', 'Expérience professionnelle'],
  },
  inferred: {
    id: 'inferred',
    label: 'Données inférées',
    description: 'Scores, prédictions, catégorisations automatiques',
    icon: 'Sparkles',
    sensitivity: 'sensitive',
    sensitivityLevel: 2,
    examples: ['Score de crédit', 'Score de risque', 'Catégorie marketing'],
  },
  social: {
    id: 'social',
    label: 'Social',
    description: 'Relations, contacts, interactions sociales',
    icon: 'Users',
    sensitivity: 'standard',
    sensitivityLevel: 1,
    examples: ['Liste de contacts', 'Abonnements', 'Interactions'],
  },
  content: {
    id: 'content',
    label: 'Contenu',
    description: 'Messages, publications, fichiers uploadés',
    icon: 'FileText',
    sensitivity: 'sensitive',
    sensitivityLevel: 2,
    examples: ['Messages privés', 'Publications', 'Photos partagées'],
  },
  genetic: {
    id: 'genetic',
    label: 'Génétique',
    description: 'Données génétiques, ADN, prédispositions',
    icon: 'Dna',
    sensitivity: 'highly_sensitive',
    sensitivityLevel: 3,
    examples: ['Résultats de tests ADN', 'Prédispositions génétiques'],
  },
  judicial: {
    id: 'judicial',
    label: 'Judiciaire',
    description: 'Casier judiciaire, condamnations, infractions',
    icon: 'Gavel',
    sensitivity: 'highly_sensitive',
    sensitivityLevel: 3,
    examples: ['Casier judiciaire', 'Condamnations', 'Infractions'],
  },
} as const

export type DataCategoryId = keyof typeof DATA_CATEGORIES
export type DataCategory = typeof DATA_CATEGORIES[DataCategoryId]

export const DATA_CATEGORY_IDS = Object.keys(DATA_CATEGORIES) as DataCategoryId[]
export const DATA_CATEGORY_LIST = Object.values(DATA_CATEGORIES)

// ============================================
// NIVEAUX DE SENSIBILITÉ
// ============================================

export const SENSITIVITY_LEVELS = {
  standard: {
    id: 'standard',
    label: 'Standard',
    description: 'Données personnelles courantes',
    color: 'green',
    level: 1,
  },
  sensitive: {
    id: 'sensitive',
    label: 'Sensible',
    description: 'Données nécessitant une attention particulière',
    color: 'yellow',
    level: 2,
  },
  highly_sensitive: {
    id: 'highly_sensitive',
    label: 'Hautement sensible',
    description: 'Données relevant de l\'article 9 du RGPD',
    color: 'red',
    level: 3,
  },
} as const

// ============================================
// NATURES DE FLUX AVEC DÉCLENCHEURS DE DOMAINES
// ============================================

export interface FlowNatureConfig {
  id: string
  label: string
  description: string
  icon: string
  // Domaines de vigilance automatiquement concernés par ce type de flux
  triggersDomains: DomainId[]
  // Poids de sévérité de base (1-3)
  baseSeverityWeight: number
}

export const FLOW_NATURES: Record<string, FlowNatureConfig> = {
  COLLECTION: {
    id: 'COLLECTION',
    label: 'Collecte',
    description: 'Récupération de données depuis une source',
    icon: 'Download',
    triggersDomains: ['PRIVACY', 'TRANSPARENCY'],
    baseSeverityWeight: 1,
  },
  STORAGE: {
    id: 'STORAGE',
    label: 'Stockage',
    description: 'Conservation des données',
    icon: 'Database',
    triggersDomains: ['PRIVACY', 'SECURITY'],
    baseSeverityWeight: 1,
  },
  PROCESSING: {
    id: 'PROCESSING',
    label: 'Traitement',
    description: 'Traitement ou transformation des données',
    icon: 'Cog',
    triggersDomains: ['TRANSPARENCY'],
    baseSeverityWeight: 1,
  },
  INFERENCE: {
    id: 'INFERENCE',
    label: 'Inférence',
    description: 'Prédiction ou déduction de nouvelles données',
    icon: 'Sparkles',
    triggersDomains: ['TRANSPARENCY', 'EQUITY', 'PRIVACY'],
    baseSeverityWeight: 2,
  },
  DECISION: {
    id: 'DECISION',
    label: 'Décision',
    description: 'Production d\'une décision automatique',
    icon: 'CheckCircle',
    triggersDomains: ['EQUITY', 'TRANSPARENCY', 'RECOURSE', 'ACCOUNTABILITY'],
    baseSeverityWeight: 3,
  },
  SCORING: {
    id: 'SCORING',
    label: 'Scoring',
    description: 'Attribution d\'un score numérique',
    icon: 'Hash',
    triggersDomains: ['EQUITY', 'TRANSPARENCY', 'AUTONOMY'],
    baseSeverityWeight: 2,
  },
  RECOMMENDATION: {
    id: 'RECOMMENDATION',
    label: 'Recommandation',
    description: 'Suggestion d\'options à l\'utilisateur',
    icon: 'Lightbulb',
    triggersDomains: ['AUTONOMY', 'TRANSPARENCY'],
    baseSeverityWeight: 2,
  },
  PERSONALIZATION: {
    id: 'PERSONALIZATION',
    label: 'Personnalisation',
    description: 'Adaptation du contenu ou service à la personne',
    icon: 'User',
    triggersDomains: ['AUTONOMY', 'PRIVACY'],
    baseSeverityWeight: 2,
  },
  NOTIFICATION: {
    id: 'NOTIFICATION',
    label: 'Notification',
    description: 'Information envoyée à une personne',
    icon: 'Bell',
    triggersDomains: ['TRANSPARENCY'],
    baseSeverityWeight: 1,
  },
  TRANSFER: {
    id: 'TRANSFER',
    label: 'Transfert',
    description: 'Transmission de données à un tiers',
    icon: 'Send',
    triggersDomains: ['PRIVACY', 'SECURITY'],
    baseSeverityWeight: 2,
  },
  MONITORING: {
    id: 'MONITORING',
    label: 'Surveillance',
    description: 'Suivi continu du comportement ou des activités',
    icon: 'Eye',
    triggersDomains: ['PRIVACY', 'AUTONOMY', 'SECURITY'],
    baseSeverityWeight: 2,
  },
  MODERATION: {
    id: 'MODERATION',
    label: 'Modération',
    description: 'Filtrage ou suppression de contenu',
    icon: 'Shield',
    triggersDomains: ['AUTONOMY', 'TRANSPARENCY', 'RECOURSE'],
    baseSeverityWeight: 2,
  },
  PREDICTION: {
    id: 'PREDICTION',
    label: 'Prédiction',
    description: 'Anticipation d\'un comportement ou événement futur',
    icon: 'TrendingUp',
    triggersDomains: ['AUTONOMY', 'EQUITY', 'TRANSPARENCY'],
    baseSeverityWeight: 2,
  },
  RISK_SCORING: {
    id: 'RISK_SCORING',
    label: 'Évaluation de risque',
    description: 'Calcul d\'un niveau de risque individuel',
    icon: 'AlertTriangle',
    triggersDomains: ['EQUITY', 'AUTONOMY', 'RECOURSE'],
    baseSeverityWeight: 3,
  },
  PROFILING: {
    id: 'PROFILING',
    label: 'Profilage',
    description: 'Création d\'un profil à partir de données comportementales',
    icon: 'UserCircle',
    triggersDomains: ['PRIVACY', 'AUTONOMY', 'EQUITY'],
    baseSeverityWeight: 2,
  },
  LEARNING: {
    id: 'LEARNING',
    label: 'Apprentissage',
    description: 'Entraînement ou mise à jour du modèle',
    icon: 'Brain',
    triggersDomains: ['PRIVACY', 'ACCOUNTABILITY'],
    baseSeverityWeight: 1,
  },
  CONTROL: {
    id: 'CONTROL',
    label: 'Contrôle',
    description: 'Supervision humaine ou automatique',
    icon: 'Shield',
    triggersDomains: ['ACCOUNTABILITY'],
    baseSeverityWeight: 1,
  },
  ENRICHMENT: {
    id: 'ENRICHMENT',
    label: 'Enrichissement',
    description: 'Ajout de données provenant d\'autres sources',
    icon: 'Plus',
    triggersDomains: ['PRIVACY', 'TRANSPARENCY'],
    baseSeverityWeight: 2,
  },
} as const

export type FlowNatureId = keyof typeof FLOW_NATURES
export type FlowNature = typeof FLOW_NATURES[FlowNatureId]

// Fonction pour obtenir les domaines déclenchés par une nature de flux
export function getTriggeredDomains(nature: FlowNatureId): DomainId[] {
  return FLOW_NATURES[nature]?.triggersDomains || []
}

// ============================================
// NIVEAUX D'AUTOMATISATION
// ============================================

export const AUTOMATION_LEVELS = {
  INFORMATIVE: {
    id: 'INFORMATIVE',
    label: 'Informatif',
    description: 'Le flux informe seulement, aucune décision',
    level: 1,
    riskMultiplier: 0.5,
  },
  ASSISTED: {
    id: 'ASSISTED',
    label: 'Assisté',
    description: 'L\'IA aide mais l\'humain décide',
    level: 2,
    riskMultiplier: 0.7,
  },
  SEMI_AUTO: {
    id: 'SEMI_AUTO',
    label: 'Semi-automatique',
    description: 'L\'IA décide, un humain valide',
    level: 3,
    riskMultiplier: 0.9,
  },
  AUTO_WITH_RECOURSE: {
    id: 'AUTO_WITH_RECOURSE',
    label: 'Automatique avec recours',
    description: 'L\'IA décide, contestation possible',
    level: 4,
    riskMultiplier: 1.2,
  },
  AUTO_NO_RECOURSE: {
    id: 'AUTO_NO_RECOURSE',
    label: 'Automatique sans recours',
    description: 'L\'IA décide, pas de contestation prévue',
    level: 5,
    riskMultiplier: 1.5,
  },
} as const

export type AutomationLevelId = keyof typeof AUTOMATION_LEVELS

// ============================================
// TYPES DE DÉCISION DU SIA
// ============================================

export const DECISION_TYPES = {
  INFORMATIVE: {
    id: 'INFORMATIVE',
    label: 'Information',
    description: 'Affiche des informations sans influencer de décision',
    icon: 'Info',
    level: 1,
  },
  RECOMMENDATION: {
    id: 'RECOMMENDATION',
    label: 'Recommandation',
    description: 'Suggère des options, l\'utilisateur choisit',
    icon: 'Lightbulb',
    level: 2,
  },
  ASSISTED_DECISION: {
    id: 'ASSISTED_DECISION',
    label: 'Décision assistée',
    description: 'Propose une décision, un humain valide',
    icon: 'UserCheck',
    level: 3,
  },
  AUTO_DECISION: {
    id: 'AUTO_DECISION',
    label: 'Décision automatique',
    description: 'Prend des décisions sans validation humaine',
    icon: 'Zap',
    level: 4,
  },
} as const

export type DecisionTypeId = keyof typeof DECISION_TYPES

// ============================================
// ÉCHELLES D'IMPACT
// ============================================

export const SCALE_LEVELS = {
  TINY: {
    id: 'TINY',
    label: 'Très petit',
    description: 'Moins de 100 personnes',
    range: '< 100',
    level: 1,
    multiplier: 0.5,
  },
  SMALL: {
    id: 'SMALL',
    label: 'Petit',
    description: '100 à 10 000 personnes',
    range: '100 - 10K',
    level: 2,
    multiplier: 0.8,
  },
  MEDIUM: {
    id: 'MEDIUM',
    label: 'Moyen',
    description: '10 000 à 100 000 personnes',
    range: '10K - 100K',
    level: 3,
    multiplier: 1.0,
  },
  LARGE: {
    id: 'LARGE',
    label: 'Grand',
    description: '100 000 à 1 million de personnes',
    range: '100K - 1M',
    level: 4,
    multiplier: 1.3,
  },
  VERY_LARGE: {
    id: 'VERY_LARGE',
    label: 'Très grand',
    description: 'Plus d\'1 million de personnes',
    range: '> 1M',
    level: 5,
    multiplier: 1.5,
  },
} as const

export type ScaleId = keyof typeof SCALE_LEVELS

// ============================================
// DOMAINES D'APPLICATION
// ============================================

export const SIA_DOMAINS = {
  HEALTH: { id: 'HEALTH', label: 'Santé', icon: 'Heart', highRisk: true },
  FINANCE: { id: 'FINANCE', label: 'Finance & Banque', icon: 'Building', highRisk: true },
  HR: { id: 'HR', label: 'Ressources humaines', icon: 'Users', highRisk: true },
  COMMERCE: { id: 'COMMERCE', label: 'Commerce & E-commerce', icon: 'ShoppingCart', highRisk: false },
  JUSTICE: { id: 'JUSTICE', label: 'Justice & Police', icon: 'Scale', highRisk: true },
  ADMINISTRATION: { id: 'ADMINISTRATION', label: 'Administration publique', icon: 'Landmark', highRisk: true },
  EDUCATION: { id: 'EDUCATION', label: 'Éducation', icon: 'GraduationCap', highRisk: true },
  TRANSPORT: { id: 'TRANSPORT', label: 'Transport', icon: 'Car', highRisk: false },
  SECURITY: { id: 'SECURITY', label: 'Sécurité', icon: 'Shield', highRisk: true },
  MARKETING: { id: 'MARKETING', label: 'Marketing & Publicité', icon: 'Megaphone', highRisk: false },
  OTHER: { id: 'OTHER', label: 'Autre', icon: 'MoreHorizontal', highRisk: false },
} as const

export type SiaDomainId = keyof typeof SIA_DOMAINS

// Fonction pour vérifier si un domaine est à haut risque
export function isHighRiskDomain(domain: SiaDomainId): boolean {
  return SIA_DOMAINS[domain]?.highRisk || false
}

// ============================================
// BASES LÉGALES RGPD
// ============================================

export const LEGAL_BASES = {
  CONSENT: { id: 'CONSENT', label: 'Consentement', article: 'Art. 6.1.a' },
  CONTRACT: { id: 'CONTRACT', label: 'Exécution d\'un contrat', article: 'Art. 6.1.b' },
  LEGAL_OBLIGATION: { id: 'LEGAL_OBLIGATION', label: 'Obligation légale', article: 'Art. 6.1.c' },
  VITAL_INTEREST: { id: 'VITAL_INTEREST', label: 'Intérêts vitaux', article: 'Art. 6.1.d' },
  PUBLIC_INTEREST: { id: 'PUBLIC_INTEREST', label: 'Mission d\'intérêt public', article: 'Art. 6.1.e' },
  LEGITIMATE_INTEREST: { id: 'LEGITIMATE_INTEREST', label: 'Intérêt légitime', article: 'Art. 6.1.f' },
} as const

// ============================================
// FRÉQUENCES
// ============================================

export const FREQUENCIES = {
  REALTIME: { id: 'REALTIME', label: 'Temps réel', urgency: 5 },
  HOURLY: { id: 'HOURLY', label: 'Horaire', urgency: 4 },
  DAILY: { id: 'DAILY', label: 'Quotidien', urgency: 3 },
  WEEKLY: { id: 'WEEKLY', label: 'Hebdomadaire', urgency: 2 },
  MONTHLY: { id: 'MONTHLY', label: 'Mensuel', urgency: 1 },
  ON_DEMAND: { id: 'ON_DEMAND', label: 'À la demande', urgency: 2 },
  ONE_TIME: { id: 'ONE_TIME', label: 'Ponctuel', urgency: 1 },
} as const

export type FrequencyId = keyof typeof FREQUENCIES

// ============================================
// POPULATIONS TYPES
// ============================================

export const POPULATIONS = [
  { id: 'employees', label: 'Employés' },
  { id: 'candidates', label: 'Candidats à l\'emploi' },
  { id: 'customers', label: 'Clients' },
  { id: 'prospects', label: 'Prospects' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'patients', label: 'Patients' },
  { id: 'students', label: 'Étudiants' },
  { id: 'citizens', label: 'Citoyens' },
  { id: 'public', label: 'Grand public' },
  { id: 'minors', label: 'Mineurs' },
  { id: 'other', label: 'Autre' },
] as const

// ============================================
// TYPES DE VULNÉRABILITÉ
// ============================================

export const VULNERABILITY_TYPES = [
  { id: 'minor', label: 'Mineur (< 18 ans)', severityBonus: 2 },
  { id: 'elderly', label: 'Personne âgée', severityBonus: 1 },
  { id: 'disabled', label: 'Personne en situation de handicap', severityBonus: 1 },
  { id: 'economic', label: 'Précarité économique', severityBonus: 1 },
  { id: 'health', label: 'Problème de santé', severityBonus: 1 },
  { id: 'digital', label: 'Fracture numérique', severityBonus: 1 },
  { id: 'linguistic', label: 'Barrière linguistique', severityBonus: 1 },
  { id: 'dependency', label: 'Situation de dépendance', severityBonus: 1 },
] as const

export type VulnerabilityTypeId = typeof VULNERABILITY_TYPES[number]['id']

// Fonction pour calculer le bonus de sévérité basé sur les vulnérabilités
export function getVulnerabilitySeverityBonus(vulnerabilityIds: VulnerabilityTypeId[]): number {
  return vulnerabilityIds.reduce((total, vulnId) => {
    const vuln = VULNERABILITY_TYPES.find(v => v.id === vulnId)
    return total + (vuln?.severityBonus || 0)
  }, 0)
}

// ============================================
// CALCUL DU NIVEAU DE SENSIBILITÉ MAXIMUM
// ============================================

export function getMaxSensitivityLevel(categories: DataCategoryId[]): number {
  if (categories.length === 0) return 0
  return Math.max(...categories.map(c => DATA_CATEGORIES[c]?.sensitivityLevel || 0))
}
