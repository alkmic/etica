// Export all constants
export * from './domains'
export * from './tension-patterns'
export * from './action-templates'
export * from './data-types'

// Statuses for tensions
export const TENSION_STATUSES = {
  DETECTED: { id: 'DETECTED', label: 'Détectée', color: 'slate', description: 'Non qualifiée' },
  QUALIFIED: { id: 'QUALIFIED', label: 'Qualifiée', color: 'blue', description: 'Critères renseignés' },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'En cours', color: 'yellow', description: 'Actions en cours' },
  ARBITRATED: { id: 'ARBITRATED', label: 'Arbitrée', color: 'purple', description: 'Arbitrage documenté' },
  RESOLVED: { id: 'RESOLVED', label: 'Résolue', color: 'green', description: 'Tension résolue' },
  DISMISSED: { id: 'DISMISSED', label: 'Écartée', color: 'gray', description: 'Non pertinente' },
} as const

// Statuses for actions
export const ACTION_STATUSES = {
  TODO: { id: 'TODO', label: 'À faire', color: 'slate' },
  IN_PROGRESS: { id: 'IN_PROGRESS', label: 'En cours', color: 'blue' },
  BLOCKED: { id: 'BLOCKED', label: 'Bloquée', color: 'red' },
  DONE: { id: 'DONE', label: 'Terminée', color: 'green' },
  CANCELLED: { id: 'CANCELLED', label: 'Annulée', color: 'gray' },
} as const

// Priority levels
export const PRIORITIES = {
  CRITICAL: { id: 'CRITICAL', label: 'Critique', color: 'red', level: 4 },
  HIGH: { id: 'HIGH', label: 'Haute', color: 'orange', level: 3 },
  MEDIUM: { id: 'MEDIUM', label: 'Moyenne', color: 'yellow', level: 2 },
  LOW: { id: 'LOW', label: 'Basse', color: 'blue', level: 1 },
} as const

// SIA statuses
export const SIA_STATUSES = {
  DRAFT: { id: 'DRAFT', label: 'Brouillon', color: 'gray' },
  ACTIVE: { id: 'ACTIVE', label: 'Actif', color: 'green' },
  REVIEW: { id: 'REVIEW', label: 'En revue', color: 'yellow' },
  ARCHIVED: { id: 'ARCHIVED', label: 'Archivé', color: 'slate' },
} as const

// Vigilance level labels
export const VIGILANCE_LEVELS = {
  1: { level: 1, label: 'Faible', color: '#22C55E', bgClass: 'bg-green-500' },
  2: { level: 2, label: 'Modérée', color: '#84CC16', bgClass: 'bg-lime-500' },
  3: { level: 3, label: 'Significative', color: '#EAB308', bgClass: 'bg-yellow-500' },
  4: { level: 4, label: 'Élevée', color: '#F97316', bgClass: 'bg-orange-500' },
  5: { level: 5, label: 'Critique', color: '#EF4444', bgClass: 'bg-red-500' },
} as const

// Node types for canvas
export const NODE_TYPES = {
  HUMAN: {
    id: 'HUMAN',
    label: 'Humain',
    icon: 'User',
    color: '#3B82F6',
    description: 'Personne physique',
    subtypes: [
      { id: 'user', label: 'Utilisateur final' },
      { id: 'operator', label: 'Opérateur' },
      { id: 'supervisor', label: 'Superviseur HITL' },
      { id: 'subject', label: 'Sujet de données' },
      { id: 'population', label: 'Population impactée' },
    ],
  },
  AI: {
    id: 'AI',
    label: 'IA/ML',
    icon: 'Brain',
    color: '#8B5CF6',
    description: 'Composant IA/Machine Learning',
    subtypes: [
      { id: 'ml_model', label: 'Modèle ML classique' },
      { id: 'llm', label: 'LLM / IA générative' },
      { id: 'rules', label: 'Système de règles' },
      { id: 'agent', label: 'Agent autonome' },
    ],
  },
  INFRA: {
    id: 'INFRA',
    label: 'Infrastructure',
    icon: 'Server',
    color: '#6B7280',
    description: 'Infrastructure technique',
    subtypes: [
      { id: 'database', label: 'Base de données' },
      { id: 'api', label: 'API' },
      { id: 'storage', label: 'Stockage' },
      { id: 'ui', label: 'Interface utilisateur' },
    ],
  },
  ORG: {
    id: 'ORG',
    label: 'Organisation',
    icon: 'Building',
    color: '#10B981',
    description: 'Entité juridique',
    subtypes: [
      { id: 'internal', label: 'Organisation interne' },
      { id: 'subcontractor', label: 'Sous-traitant' },
      { id: 'partner', label: 'Partenaire' },
      { id: 'authority', label: 'Autorité' },
    ],
  },
} as const

export type NodeTypeId = keyof typeof NODE_TYPES

// Flow directions
export const FLOW_DIRECTIONS = {
  H2M: { id: 'H2M', label: 'Humain → Machine', from: 'HUMAN', to: ['AI', 'INFRA'] },
  M2M: { id: 'M2M', label: 'Machine → Machine', from: ['AI', 'INFRA'], to: ['AI', 'INFRA'] },
  M2H: { id: 'M2H', label: 'Machine → Humain', from: ['AI', 'INFRA'], to: 'HUMAN' },
  H2H: { id: 'H2H', label: 'Humain → Humain', from: 'HUMAN', to: 'HUMAN' },
} as const

// Uncertainty levels for qualification
export const UNCERTAINTY_LEVELS = {
  low: { id: 'low', label: 'Faible', description: 'Confiance élevée dans l\'évaluation' },
  medium: { id: 'medium', label: 'Moyenne', description: 'Certaines incertitudes' },
  high: { id: 'high', label: 'Élevée', description: 'Forte incertitude, à confirmer' },
} as const
