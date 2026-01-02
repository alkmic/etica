// lib/constants/enums.ts
// Enums et constantes pour les flux et l'arbitrage

// === INTENTIONS DE FLUX ===

export const FLOW_INTENTS = {
  COMMAND: { label: 'Commande', description: 'Ordre d\'action à exécuter' },
  FEEDBACK: { label: 'Feedback', description: 'Retour ou évaluation' },
  SURVEILLANCE: { label: 'Surveillance', description: 'Monitoring ou contrôle' },
  INFORMATION: { label: 'Information', description: 'Notification ou affichage' },
  EVALUATION: { label: 'Évaluation', description: 'Scoring ou classement' },
  TRAINING: { label: 'Entraînement', description: 'Données pour apprentissage' },
  QUERY: { label: 'Requête', description: 'Interrogation ou recherche' },
} as const;

// === CANAUX ===

export const FLOW_CHANNELS = {
  API: { label: 'API', description: 'Appel API REST/GraphQL' },
  USER_INTERFACE: { label: 'Interface utilisateur', description: 'Web, mobile, desktop' },
  SENSOR: { label: 'Capteur', description: 'IoT, caméra, micro' },
  NOTIFICATION: { label: 'Notification', description: 'Push, email, SMS' },
  BATCH_PROCESS: { label: 'Batch', description: 'Traitement différé' },
  WEBHOOK: { label: 'Webhook', description: 'Callback HTTP' },
  FILE_TRANSFER: { label: 'Fichier', description: 'Import/export fichier' },
} as const;

// === MATURITÉ D'ARBITRAGE ===

export const ARBITRATION_MATURITY = {
  NOT_TREATED: {
    level: 0,
    label: 'Non traité',
    description: 'Le dilemme n\'est pas encore reconnu',
    color: '#EF4444' // Rouge
  },
  RECOGNIZED: {
    level: 1,
    label: 'Reconnu',
    description: 'Le dilemme est identifié mais pas encore analysé',
    color: '#F97316' // Orange
  },
  DECIDED: {
    level: 2,
    label: 'Décidé',
    description: 'Un trade-off explicite a été fait, mais sans preuves',
    color: '#EAB308' // Jaune
  },
  TESTED: {
    level: 3,
    label: 'Testé',
    description: 'Des preuves existent (tests, audits, red-team)',
    color: '#22C55E' // Vert clair
  },
  MONITORED: {
    level: 4,
    label: 'Monitoré',
    description: 'KPIs, alerting, recours et revues en place',
    color: '#10B981' // Vert
  },
} as const;

// === TRIGGERS DE RÉVISION ===

export const REVISION_TRIGGERS = {
  DATA_SOURCE_CHANGE: { label: 'Changement de source de données', icon: 'Database' },
  MODEL_CHANGE: { label: 'Changement de modèle', icon: 'Cpu' },
  PROVIDER_CHANGE: { label: 'Changement de fournisseur', icon: 'Building' },
  NEW_USER_GROUP: { label: 'Nouveau groupe d\'utilisateurs', icon: 'Users' },
  NEW_GEOGRAPHIC_SCOPE: { label: 'Nouveau périmètre géographique', icon: 'Globe' },
  INCIDENT: { label: 'Incident survenu', icon: 'AlertTriangle' },
  REGULATORY_CHANGE: { label: 'Changement réglementaire', icon: 'Scale' },
  SCHEDULED_REVIEW: { label: 'Revue programmée', icon: 'Calendar' },
  DRIFT_DETECTED: { label: 'Dérive détectée', icon: 'TrendingDown' },
} as const;

// === CATÉGORIES DE JUSTIFICATION ===

export const JUSTIFICATION_CATEGORIES = {
  REGULATORY_CONSTRAINT: {
    label: 'Contrainte réglementaire',
    description: 'Une réglementation impose ce choix'
  },
  USER_EXPECTATIONS: {
    label: 'Attentes utilisateurs',
    description: 'Les utilisateurs ont exprimé ce besoin'
  },
  ECONOMIC_CONSTRAINT: {
    label: 'Contrainte économique',
    description: 'Raisons budgétaires ou de rentabilité'
  },
  TECHNICAL_CONSTRAINT: {
    label: 'Contrainte technique',
    description: 'Limitations techniques actuelles'
  },
  STRATEGIC_CHOICE: {
    label: 'Choix stratégique',
    description: 'Décision alignée avec la stratégie'
  },
  OTHER: {
    label: 'Autre',
    description: 'Autre raison à préciser'
  },
} as const;

// === FOURNISSEURS SUGGÉRÉS ===

export const AI_PROVIDERS = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Microsoft',
  'Meta',
  'Mistral',
  'Cohere',
  'Hugging Face',
  'Autre',
] as const;

export const INFRA_PROVIDERS = [
  'AWS',
  'Azure',
  'Google Cloud',
  'OVH',
  'Scaleway',
  'DigitalOcean',
  'Autre',
] as const;

// === CRITICITÉ DES FLUX ===

export const FLOW_CRITICALITY = {
  ACCESSORY: {
    label: 'Accessoire',
    description: 'Le système peut fonctionner sans',
    color: '#6B7280'
  },
  IMPORTANT: {
    label: 'Important',
    description: 'Dégrade le service si absent',
    color: '#F59E0B'
  },
  CRITICAL: {
    label: 'Critique',
    description: 'Le système ne peut pas fonctionner sans',
    color: '#EF4444'
  },
} as const;

// === FAMILLES DE RÈGLES ===

export const RULE_FAMILIES = {
  STRUCTURAL: {
    id: 'S',
    label: 'Structurelle',
    description: 'Analyse de la forme du graphe (boucles, concentrations)',
    color: '#3B82F6'
  },
  DATA: {
    id: 'D',
    label: 'Données',
    description: 'Analyse des types de données et leur sensibilité',
    color: '#8B5CF6'
  },
  DEPENDENCY: {
    id: 'E',
    label: 'Dépendance',
    description: 'Analyse des composants externes (APIs, cloud)',
    color: '#F59E0B'
  },
  CONTEXTUAL: {
    id: 'C',
    label: 'Contextuelle',
    description: 'Règles selon le secteur (santé, RH, finance, assurance)',
    color: '#10B981'
  },
  GOVERNANCE: {
    id: 'G',
    label: 'Gouvernance',
    description: 'Organisation autour du système',
    color: '#EC4899'
  },
} as const;

// === SECTEURS D'ACTIVITÉ ===

export const SECTORS = {
  HEALTH: { label: 'Santé', description: 'Établissements de santé, pharma' },
  FINANCE: { label: 'Finance', description: 'Banques, fintech, investissement' },
  HR: { label: 'Ressources humaines', description: 'Recrutement, gestion RH' },
  COMMERCE: { label: 'Commerce', description: 'Retail, e-commerce' },
  JUSTICE: { label: 'Justice', description: 'Tribunaux, avocats, notaires' },
  ADMINISTRATION: { label: 'Administration', description: 'Services publics' },
  EDUCATION: { label: 'Éducation', description: 'Écoles, universités, formation' },
  TRANSPORT: { label: 'Transport', description: 'Logistique, mobilité' },
  INSURANCE: { label: 'Assurance', description: 'Assureurs, mutuelles' },
  OTHER: { label: 'Autre', description: 'Autre secteur' },
} as const;

// === TYPES DE DONNÉES (alignés Prisma enum DataCategory) ===

export const PRISMA_DATA_CATEGORIES = {
  IDENTIFIER: { label: 'Identifiants', description: 'Nom, email, téléphone', sensitivity: 'standard' },
  DEMOGRAPHIC: { label: 'Démographiques', description: 'Âge, genre, nationalité', sensitivity: 'standard' },
  LOCATION: { label: 'Localisation', description: 'Adresse, GPS', sensitivity: 'standard' },
  FINANCIAL: { label: 'Financières', description: 'Revenus, transactions', sensitivity: 'sensitive' },
  HEALTH: { label: 'Santé', description: 'Données de santé', sensitivity: 'highly_sensitive' },
  BIOMETRIC: { label: 'Biométriques', description: 'Empreintes, visage', sensitivity: 'highly_sensitive' },
  BEHAVIORAL: { label: 'Comportementales', description: 'Historique, navigation', sensitivity: 'standard' },
  PROFESSIONAL: { label: 'Professionnelles', description: 'CV, performance', sensitivity: 'standard' },
  OPINION: { label: 'Opinions', description: 'Opinions politiques/religieuses', sensitivity: 'highly_sensitive' },
  JUDICIAL: { label: 'Judiciaires', description: 'Casier, litiges', sensitivity: 'highly_sensitive' },
  INFERRED: { label: 'Inférées', description: 'Données déduites', sensitivity: 'sensitive' },
  CONTENT: { label: 'Contenu', description: 'Contenu utilisateur', sensitivity: 'standard' },
  TECHNICAL: { label: 'Techniques', description: 'Logs, métadonnées', sensitivity: 'standard' },
  OTHER: { label: 'Autre', description: 'Autre type de données', sensitivity: 'standard' },
} as const;

// === TYPES D'ACTIONS (alignés méthodologie) ===

export const METHODOLOGY_ACTION_TYPES = {
  MITIGATION: {
    label: 'Mitigation',
    description: 'Réduire l\'intensité de la tension',
    color: '#3B82F6'
  },
  COMPENSATION: {
    label: 'Compensation',
    description: 'Contrebalancer le pôle minoré',
    color: '#8B5CF6'
  },
  SURVEILLANCE: {
    label: 'Surveillance',
    description: 'Monitorer l\'évolution',
    color: '#F59E0B'
  },
} as const;

// === CATÉGORIES D'ACTIONS (alignées méthodologie) ===

export const METHODOLOGY_ACTION_CATEGORIES = {
  MINIMIZATION: { label: 'Minimisation', description: 'Réduire la collecte/traitement' },
  TRANSPARENCY: { label: 'Transparence', description: 'Améliorer l\'information' },
  HUMAN_CONTROL: { label: 'Contrôle humain', description: 'Renforcer la supervision' },
  RECOURSE: { label: 'Recours', description: 'Faciliter la contestation' },
  TECHNICAL: { label: 'Technique', description: 'Mesures techniques' },
  ORGANIZATIONAL: { label: 'Organisationnelle', description: 'Processus et gouvernance' },
  DESIGN: { label: 'Design', description: 'Conception éthique by design' },
  CONTRACTUAL: { label: 'Contractuelle', description: 'Clauses et engagements' },
  DOCUMENTATION: { label: 'Documentation', description: 'Documentation et traçabilité' },
} as const;

// Type exports for TypeScript
export type FlowIntentKey = keyof typeof FLOW_INTENTS;
export type FlowChannelKey = keyof typeof FLOW_CHANNELS;
export type ArbitrationMaturityKey = keyof typeof ARBITRATION_MATURITY;
export type RevisionTriggerKey = keyof typeof REVISION_TRIGGERS;
export type JustificationCategoryKey = keyof typeof JUSTIFICATION_CATEGORIES;
export type FlowCriticalityKey = keyof typeof FLOW_CRITICALITY;
export type RuleFamilyKey = keyof typeof RULE_FAMILIES;
export type SectorKey = keyof typeof SECTORS;
export type PrismaDataCategoryKey = keyof typeof PRISMA_DATA_CATEGORIES;
export type MethodologyActionTypeKey = keyof typeof METHODOLOGY_ACTION_TYPES;
export type MethodologyActionCategoryKey = keyof typeof METHODOLOGY_ACTION_CATEGORIES;
