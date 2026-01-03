// lib/constants/enums.ts
// Synchronise avec prisma/schema.prisma - NE PAS DESYNCHRONISER

// ========================================
// SECTEURS (enum Sector dans Prisma)
// ========================================
export const SECTORS = {
  HEALTH: { id: 'HEALTH', label: 'Sante', icon: 'Heart' },
  FINANCE: { id: 'FINANCE', label: 'Finance', icon: 'DollarSign' },
  HR: { id: 'HR', label: 'Ressources Humaines', icon: 'Users' },
  COMMERCE: { id: 'COMMERCE', label: 'Commerce', icon: 'ShoppingCart' },
  JUSTICE: { id: 'JUSTICE', label: 'Justice', icon: 'Scale' },
  ADMINISTRATION: { id: 'ADMINISTRATION', label: 'Administration', icon: 'Building' },
  EDUCATION: { id: 'EDUCATION', label: 'Education', icon: 'GraduationCap' },
  TRANSPORT: { id: 'TRANSPORT', label: 'Transport', icon: 'Car' },
  INSURANCE: { id: 'INSURANCE', label: 'Assurance', icon: 'Shield' },
  SECURITY: { id: 'SECURITY', label: 'Securite', icon: 'Lock' },
  MARKETING: { id: 'MARKETING', label: 'Marketing', icon: 'TrendingUp' },
  OTHER: { id: 'OTHER', label: 'Autre', icon: 'Box' },
} as const;

export type SectorId = keyof typeof SECTORS;

// ========================================
// ECHELLES (enum Scale dans Prisma)
// ========================================
export const SCALES = {
  TINY: { id: 'TINY', label: 'Moins de 100', description: '< 100 personnes' },
  SMALL: { id: 'SMALL', label: '100 - 10K', description: '100 a 10 000 personnes' },
  MEDIUM: { id: 'MEDIUM', label: '10K - 100K', description: '10 000 a 100 000 personnes' },
  LARGE: { id: 'LARGE', label: '100K - 1M', description: '100 000 a 1 million' },
  VERY_LARGE: { id: 'VERY_LARGE', label: 'Plus d\'1M', description: '> 1 million de personnes' },
} as const;

export type ScaleId = keyof typeof SCALES;

// ========================================
// STATUTS DE TENSION (enum TensionStatus dans Prisma)
// ========================================
export const TENSION_STATUSES = {
  DETECTED: { id: 'DETECTED', label: 'Detectee', color: 'gray', description: 'Identifiee automatiquement' },
  QUALIFIED: { id: 'QUALIFIED', label: 'Qualifiee', color: 'blue', description: 'Criteres renseignes' },
  VALIDATED: { id: 'VALIDATED', label: 'Validee', color: 'green', description: 'Confirmee par un humain' },
  CONTESTED: { id: 'CONTESTED', label: 'Contestee', color: 'orange', description: 'Pertinence remise en question' },
  ARBITRATED: { id: 'ARBITRATED', label: 'Arbitree', color: 'purple', description: 'Decision prise' },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'En cours', color: 'blue', description: 'Traitement en cours' },
  RESOLVED: { id: 'RESOLVED', label: 'Resolue', color: 'green', description: 'Actions terminees' },
  DISMISSED: { id: 'DISMISSED', label: 'Ecartee', color: 'gray', description: 'Non pertinente' },
} as const;

export type TensionStatusId = keyof typeof TENSION_STATUSES;

// ========================================
// FAMILLES DE REGLES (enum RuleFamily dans Prisma)
// ========================================
export const RULE_FAMILIES = {
  STRUCTURAL: { id: 'STRUCTURAL', label: 'Structurelle', code: 'S', color: 'blue' },
  DATA: { id: 'DATA', label: 'Donnees', code: 'D', color: 'purple' },
  DEPENDENCY: { id: 'DEPENDENCY', label: 'Dependance', code: 'E', color: 'orange' },
  CONTEXTUAL: { id: 'CONTEXTUAL', label: 'Contextuelle', code: 'C', color: 'green' },
  GOVERNANCE: { id: 'GOVERNANCE', label: 'Gouvernance', code: 'G', color: 'red' },
} as const;

export type RuleFamilyId = keyof typeof RULE_FAMILIES;

// ========================================
// MATURITE D'ARBITRAGE (enum ArbitrationMaturity dans Prisma)
// ========================================
export const ARBITRATION_MATURITY = {
  NOT_TREATED: { level: 0, id: 'NOT_TREATED', label: 'Non traite', color: 'gray' },
  RECOGNIZED: { level: 1, id: 'RECOGNIZED', label: 'Reconnu', color: 'yellow' },
  DECIDED: { level: 2, id: 'DECIDED', label: 'Decide', color: 'blue' },
  TESTED: { level: 3, id: 'TESTED', label: 'Teste', color: 'purple' },
  MONITORED: { level: 4, id: 'MONITORED', label: 'Monitore', color: 'green' },
} as const;

export type ArbitrationMaturityId = keyof typeof ARBITRATION_MATURITY;

// ========================================
// DECLENCHEURS DE REVISION (enum RevisionTrigger dans Prisma)
// ========================================
export const REVISION_TRIGGERS = {
  DATA_SOURCE_CHANGE: { id: 'DATA_SOURCE_CHANGE', label: 'Changement de source de donnees' },
  MODEL_CHANGE: { id: 'MODEL_CHANGE', label: 'Changement de modele' },
  PROVIDER_CHANGE: { id: 'PROVIDER_CHANGE', label: 'Changement de fournisseur' },
  NEW_USER_GROUP: { id: 'NEW_USER_GROUP', label: 'Nouveau groupe d\'utilisateurs' },
  NEW_GEOGRAPHIC_SCOPE: { id: 'NEW_GEOGRAPHIC_SCOPE', label: 'Nouvelle zone geographique' },
  INCIDENT: { id: 'INCIDENT', label: 'Incident' },
  REGULATORY_CHANGE: { id: 'REGULATORY_CHANGE', label: 'Evolution reglementaire' },
  SCHEDULED_REVIEW: { id: 'SCHEDULED_REVIEW', label: 'Revue programmee' },
  DRIFT_DETECTED: { id: 'DRIFT_DETECTED', label: 'Derive detectee' },
} as const;

export type RevisionTriggerId = keyof typeof REVISION_TRIGGERS;

// ========================================
// INTENT DE FLUX (enum FlowIntent dans Prisma)
// ========================================
export const FLOW_INTENTS = {
  COMMAND: { id: 'COMMAND', label: 'Commande', description: 'Instruction directe' },
  FEEDBACK: { id: 'FEEDBACK', label: 'Retour', description: 'Feedback utilisateur' },
  SURVEILLANCE: { id: 'SURVEILLANCE', label: 'Surveillance', description: 'Monitoring' },
  INFORMATION: { id: 'INFORMATION', label: 'Information', description: 'Transmission d\'info' },
  EVALUATION: { id: 'EVALUATION', label: 'Evaluation', description: 'Scoring/evaluation' },
  TRAINING: { id: 'TRAINING', label: 'Entrainement', description: 'Apprentissage' },
  QUERY: { id: 'QUERY', label: 'Requete', description: 'Interrogation' },
} as const;

export type FlowIntentId = keyof typeof FLOW_INTENTS;

// ========================================
// CANAUX DE FLUX (enum FlowChannel dans Prisma)
// ========================================
export const FLOW_CHANNELS = {
  API: { id: 'API', label: 'API' },
  USER_INTERFACE: { id: 'USER_INTERFACE', label: 'Interface utilisateur' },
  SENSOR: { id: 'SENSOR', label: 'Capteur' },
  NOTIFICATION: { id: 'NOTIFICATION', label: 'Notification' },
  BATCH_PROCESS: { id: 'BATCH_PROCESS', label: 'Traitement batch' },
  WEBHOOK: { id: 'WEBHOOK', label: 'Webhook' },
  FILE_TRANSFER: { id: 'FILE_TRANSFER', label: 'Transfert fichier' },
} as const;

export type FlowChannelId = keyof typeof FLOW_CHANNELS;

// ========================================
// STATUTS D'ACTION (enum ActionStatus dans Prisma)
// ========================================
export const ACTION_STATUSES = {
  TODO: { id: 'TODO', label: 'A faire', color: 'gray' },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'En cours', color: 'blue' },
  BLOCKED: { id: 'BLOCKED', label: 'Bloquee', color: 'red' },
  DONE: { id: 'DONE', label: 'Terminee', color: 'green' },
  CANCELLED: { id: 'CANCELLED', label: 'Annulee', color: 'gray' },
} as const;

export type ActionStatusId = keyof typeof ACTION_STATUSES;

// ========================================
// PRIORITES (enum Priority dans Prisma)
// ========================================
export const PRIORITIES = {
  CRITICAL: { id: 'CRITICAL', label: 'Critique', color: 'red', level: 4 },
  HIGH: { id: 'HIGH', label: 'Haute', color: 'orange', level: 3 },
  MEDIUM: { id: 'MEDIUM', label: 'Moyenne', color: 'yellow', level: 2 },
  LOW: { id: 'LOW', label: 'Basse', color: 'green', level: 1 },
} as const;

export type PriorityId = keyof typeof PRIORITIES;

// ========================================
// CATEGORIES D'ACTION (enum ActionCategory dans Prisma)
// ========================================
export const ACTION_CATEGORIES = {
  MINIMIZATION: { id: 'MINIMIZATION', label: 'Minimisation' },
  TRANSPARENCY: { id: 'TRANSPARENCY', label: 'Transparence' },
  HUMAN_CONTROL: { id: 'HUMAN_CONTROL', label: 'Controle humain' },
  RECOURSE: { id: 'RECOURSE', label: 'Recours' },
  TECHNICAL: { id: 'TECHNICAL', label: 'Technique' },
  ORGANIZATIONAL: { id: 'ORGANIZATIONAL', label: 'Organisationnel' },
  DESIGN: { id: 'DESIGN', label: 'Conception' },
  CONTRACTUAL: { id: 'CONTRACTUAL', label: 'Contractuel' },
  DOCUMENTATION: { id: 'DOCUMENTATION', label: 'Documentation' },
  AUDIT: { id: 'AUDIT', label: 'Audit' },
} as const;

export type ActionCategoryId = keyof typeof ACTION_CATEGORIES;
