// Définitions centralisées des métriques pour l'UX ETICA
// Ces définitions permettent des tooltips cohérents et informatifs

import { DOMAINS, DOMAIN_IDS, type DomainId } from './domains'

// =============================================================================
// DÉFINITIONS DES MÉTRIQUES GÉNÉRALES
// =============================================================================

export const METRIC_DEFINITIONS = {
  // Métriques globales
  vigilanceScore: {
    id: 'vigilanceScore',
    label: 'Score de vigilance',
    description: 'Mesure globale du niveau d\'attention éthique requis pour ce système',
    calculation: 'Moyenne pondérée des scores par domaine, ajustée selon la sévérité des tensions non résolues',
    interpretation: {
      low: '0-30: Risques éthiques faibles, surveillance standard',
      medium: '31-60: Attention requise sur certains domaines',
      high: '61-100: Vigilance élevée nécessaire, actions prioritaires recommandées',
    },
    unit: '/100',
  },
  maturityScore: {
    id: 'maturityScore',
    label: 'Score de maturité',
    description: 'Évaluation de la maturité éthique du système d\'IA',
    calculation: 'Basé sur l\'avancement des actions et la résolution des tensions',
    interpretation: {
      low: '0-30: Phase initiale, nombreuses actions à entreprendre',
      medium: '31-60: En progression, certaines mesures en place',
      high: '61-100: Maturité élevée, gouvernance éthique établie',
    },
    unit: '/100',
  },
  tensionCount: {
    id: 'tensionCount',
    label: 'Tensions détectées',
    description: 'Nombre total de tensions éthiques identifiées dans le système',
    calculation: 'Comptage des tensions actives (non rejetées)',
    interpretation: {
      low: '0-5: Faible complexité éthique',
      medium: '6-15: Complexité modérée',
      high: '16+: Haute complexité, analyse approfondie recommandée',
    },
    unit: 'tensions',
  },
  actionCount: {
    id: 'actionCount',
    label: 'Actions planifiées',
    description: 'Nombre total d\'actions correctives et préventives',
    calculation: 'Comptage de toutes les actions associées aux tensions',
    interpretation: {
      low: '0-5: Peu d\'actions, vérifier la couverture des risques',
      medium: '6-20: Couverture correcte',
      high: '20+: Plan d\'action complet',
    },
    unit: 'actions',
  },
  progressRate: {
    id: 'progressRate',
    label: 'Taux d\'avancement',
    description: 'Pourcentage d\'actions complétées par rapport au total',
    calculation: '(Actions terminées / Actions totales) × 100',
    interpretation: {
      low: '0-30%: Démarrage, actions à prioriser',
      medium: '31-70%: Progression en cours',
      high: '71-100%: Proche de la finalisation',
    },
    unit: '%',
  },
  arbitrationRate: {
    id: 'arbitrationRate',
    label: 'Taux d\'arbitrage',
    description: 'Pourcentage de tensions ayant fait l\'objet d\'un arbitrage',
    calculation: '(Tensions arbitrées / Tensions totales) × 100',
    interpretation: {
      low: '0-30%: Nombreuses tensions en attente de décision',
      medium: '31-70%: Arbitrages en cours',
      high: '71-100%: Majorité des tensions traitées',
    },
    unit: '%',
  },
  criticalTensionCount: {
    id: 'criticalTensionCount',
    label: 'Tensions critiques',
    description: 'Tensions de sévérité élevée (4-5) nécessitant une attention immédiate',
    calculation: 'Comptage des tensions avec severity >= 4',
    interpretation: {
      zero: '0: Aucune urgence détectée',
      low: '1-3: Actions prioritaires à planifier',
      high: '4+: Situation critique, intervention urgente',
    },
    unit: 'tensions',
  },
  overdueTasks: {
    id: 'overdueTasks',
    label: 'Actions en retard',
    description: 'Actions dont la date d\'échéance est dépassée',
    calculation: 'Actions avec dueDate < aujourd\'hui et status != DONE',
    interpretation: {
      zero: '0: Respect des délais',
      low: '1-3: Retards mineurs',
      high: '4+: Retards significatifs, revoir la planification',
    },
    unit: 'actions',
  },
} as const

export type MetricId = keyof typeof METRIC_DEFINITIONS
export type MetricDefinition = typeof METRIC_DEFINITIONS[MetricId]

// =============================================================================
// NIVEAUX DE MATURITÉ
// =============================================================================

export const MATURITY_LEVELS = {
  1: {
    level: 1,
    label: 'Initial',
    shortLabel: 'Init.',
    color: '#EF4444', // red
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-400',
    description: 'Conscience des enjeux éthiques, mais pas encore d\'actions structurées',
    criteria: [
      'Identification initiale des enjeux',
      'Pas de processus formalisé',
      'Actions ponctuelles et réactives',
    ],
    scoreRange: { min: 0, max: 20 },
  },
  2: {
    level: 2,
    label: 'Défini',
    shortLabel: 'Déf.',
    color: '#F97316', // orange
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-400',
    description: 'Processus définis pour la gestion éthique du système',
    criteria: [
      'Cartographie des parties prenantes',
      'Identification des tensions principales',
      'Premières actions documentées',
    ],
    scoreRange: { min: 21, max: 40 },
  },
  3: {
    level: 3,
    label: 'Géré',
    shortLabel: 'Géré',
    color: '#EAB308', // yellow
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-400',
    description: 'Processus documentés et suivis régulièrement',
    criteria: [
      'Plan d\'action formalisé',
      'Arbitrages documentés',
      'Suivi régulier des indicateurs',
    ],
    scoreRange: { min: 41, max: 60 },
  },
  4: {
    level: 4,
    label: 'Maîtrisé',
    shortLabel: 'Maît.',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-400',
    description: 'Gouvernance éthique établie et performante',
    criteria: [
      'Mesures de performance définies',
      'Amélioration continue',
      'Revues périodiques planifiées',
    ],
    scoreRange: { min: 61, max: 80 },
  },
  5: {
    level: 5,
    label: 'Optimisé',
    shortLabel: 'Opt.',
    color: '#3B82F6', // blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
    description: 'Excellence éthique, système exemplaire et innovant',
    criteria: [
      'Anticipation proactive des risques',
      'Partage des bonnes pratiques',
      'Innovation dans la gouvernance éthique',
    ],
    scoreRange: { min: 81, max: 100 },
  },
} as const

export type MaturityLevel = keyof typeof MATURITY_LEVELS
export type MaturityLevelDefinition = typeof MATURITY_LEVELS[MaturityLevel]

// Fonction pour déterminer le niveau de maturité à partir d'un score
export function getMaturityLevel(score: number): MaturityLevelDefinition {
  if (score <= 20) return MATURITY_LEVELS[1]
  if (score <= 40) return MATURITY_LEVELS[2]
  if (score <= 60) return MATURITY_LEVELS[3]
  if (score <= 80) return MATURITY_LEVELS[4]
  return MATURITY_LEVELS[5]
}

// =============================================================================
// DOMAINES ÉTHIQUES ENRICHIS (pour compatibilité)
// =============================================================================

// Type pour les définitions de métriques de domaine
export interface DomainMetricDefinition {
  id: string
  label: string
  description: string
  calculation: string
  interpretation: {
    low: string
    medium: string
    high: string
  }
  unit: string
}

// Réexport des domaines avec métadonnées supplémentaires pour les métriques
export const ETHICAL_DOMAINS = DOMAIN_IDS.reduce((acc, domainId) => {
  const domain = DOMAINS[domainId]
  acc[domainId] = {
    ...domain,
    metricDefinition: {
      id: `domain_${domainId}`,
      label: `Score ${domain.label}`,
      description: domain.description,
      calculation: `Évaluation basée sur les tensions et actions liées au domaine "${domain.label}"`,
      interpretation: {
        low: `0-30: ${domain.label} bien maîtrisé, risques faibles`,
        medium: `31-60: Attention requise sur ${domain.label.toLowerCase()}`,
        high: `61-100: Vigilance élevée, tensions significatives sur ${domain.label.toLowerCase()}`,
      },
      unit: '/100',
    },
  }
  return acc
}, {} as Record<DomainId, typeof DOMAINS[DomainId] & { metricDefinition: DomainMetricDefinition }>)

// =============================================================================
// STATUS DES TENSIONS
// =============================================================================

export const TENSION_STATUS = {
  DETECTED: {
    id: 'DETECTED',
    label: 'Détectée',
    description: 'Tension identifiée mais pas encore analysée',
    color: '#6B7280', // gray
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: 'AlertCircle',
  },
  ANALYZING: {
    id: 'ANALYZING',
    label: 'En analyse',
    description: 'Tension en cours d\'évaluation',
    color: '#3B82F6', // blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: 'Search',
  },
  ARBITRATED: {
    id: 'ARBITRATED',
    label: 'Arbitrée',
    description: 'Décision prise, actions définies',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: 'CheckCircle',
  },
  MONITORING: {
    id: 'MONITORING',
    label: 'En surveillance',
    description: 'Tension traitée, en phase de suivi',
    color: '#8B5CF6', // violet
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    icon: 'Eye',
  },
  DISMISSED: {
    id: 'DISMISSED',
    label: 'Écartée',
    description: 'Tension jugée non pertinente ou hors périmètre',
    color: '#9CA3AF', // gray-400
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-500',
    icon: 'XCircle',
  },
} as const

export type TensionStatusId = keyof typeof TENSION_STATUS
export type TensionStatusDefinition = typeof TENSION_STATUS[TensionStatusId]

// =============================================================================
// STATUS DES ACTIONS
// =============================================================================

export const ACTION_STATUS = {
  TODO: {
    id: 'TODO',
    label: 'À faire',
    description: 'Action planifiée mais non démarrée',
    color: '#6B7280', // gray
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: 'Circle',
  },
  IN_PROGRESS: {
    id: 'IN_PROGRESS',
    label: 'En cours',
    description: 'Action en cours de réalisation',
    color: '#3B82F6', // blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: 'Clock',
  },
  BLOCKED: {
    id: 'BLOCKED',
    label: 'Bloquée',
    description: 'Action bloquée par un obstacle',
    color: '#EF4444', // red
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: 'AlertTriangle',
  },
  DONE: {
    id: 'DONE',
    label: 'Terminée',
    description: 'Action complétée avec succès',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: 'CheckCircle2',
  },
  CANCELLED: {
    id: 'CANCELLED',
    label: 'Annulée',
    description: 'Action annulée (non pertinente ou obsolète)',
    color: '#9CA3AF', // gray-400
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-500',
    icon: 'X',
  },
} as const

export type ActionStatusId = keyof typeof ACTION_STATUS
export type ActionStatusDefinition = typeof ACTION_STATUS[ActionStatusId]

// =============================================================================
// SÉVÉRITÉ DES TENSIONS
// =============================================================================

export const SEVERITY_LEVELS = {
  1: {
    level: 1,
    label: 'Mineure',
    description: 'Impact limité, facilement corrigeable',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  2: {
    level: 2,
    label: 'Faible',
    description: 'Impact modéré, correction recommandée',
    color: '#84CC16', // lime
    bgColor: 'bg-lime-100',
    textColor: 'text-lime-700',
  },
  3: {
    level: 3,
    label: 'Moyenne',
    description: 'Impact significatif, action requise',
    color: '#EAB308', // yellow
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  4: {
    level: 4,
    label: 'Élevée',
    description: 'Impact important, action prioritaire',
    color: '#F97316', // orange
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  5: {
    level: 5,
    label: 'Critique',
    description: 'Impact majeur, intervention immédiate',
    color: '#EF4444', // red
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
} as const

export type SeverityLevel = keyof typeof SEVERITY_LEVELS
export type SeverityLevelDefinition = typeof SEVERITY_LEVELS[SeverityLevel]

// =============================================================================
// PRIORITÉS DES ACTIONS
// =============================================================================

export const PRIORITY_LEVELS = {
  LOW: {
    id: 'LOW',
    label: 'Basse',
    description: 'À traiter quand les ressources sont disponibles',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    order: 1,
  },
  MEDIUM: {
    id: 'MEDIUM',
    label: 'Moyenne',
    description: 'À traiter dans les délais normaux',
    color: '#EAB308', // yellow
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    order: 2,
  },
  HIGH: {
    id: 'HIGH',
    label: 'Haute',
    description: 'À traiter rapidement',
    color: '#F97316', // orange
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    order: 3,
  },
  CRITICAL: {
    id: 'CRITICAL',
    label: 'Critique',
    description: 'À traiter immédiatement',
    color: '#EF4444', // red
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    order: 4,
  },
} as const

export type PriorityId = keyof typeof PRIORITY_LEVELS
export type PriorityDefinition = typeof PRIORITY_LEVELS[PriorityId]

// =============================================================================
// CERCLES (pour référence rapide)
// =============================================================================

export const CIRCLES = {
  1: {
    id: 1,
    name: 'Personnes',
    shortName: 'Pers.',
    description: 'Droits et intérêts des individus directement concernés',
    color: '#3B82F6', // blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    domainCount: 6,
  },
  2: {
    id: 2,
    name: 'Organisation',
    shortName: 'Org.',
    description: 'Capacité de l\'organisation à maîtriser et assumer son système',
    color: '#8B5CF6', // violet
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    domainCount: 3,
  },
  3: {
    id: 3,
    name: 'Société',
    shortName: 'Soc.',
    description: 'Impact du système au-delà des utilisateurs directs',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    domainCount: 3,
  },
} as const

export type CircleId = keyof typeof CIRCLES
export type CircleDefinition = typeof CIRCLES[CircleId]

// =============================================================================
// FONCTIONS UTILITAIRES
// =============================================================================

// Obtenir la couleur selon le score (gradient rouge → orange → jaune → vert → bleu)
export function getScoreColor(score: number): string {
  if (score <= 20) return '#EF4444' // red
  if (score <= 40) return '#F97316' // orange
  if (score <= 60) return '#EAB308' // yellow
  if (score <= 80) return '#22C55E' // green
  return '#3B82F6' // blue
}

// Obtenir le niveau de vigilance inversé (score élevé = vigilance élevée = problématique)
export function getVigilanceColor(score: number): string {
  if (score <= 30) return '#22C55E' // green - faible vigilance
  if (score <= 60) return '#EAB308' // yellow - vigilance modérée
  return '#EF4444' // red - vigilance élevée
}

// Formater un pourcentage
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

// Formater un score sur 100
export function formatScore(value: number): string {
  return `${Math.round(value)}/100`
}

// Calculer le taux de complétion des actions
export function calculateActionProgress(
  actions: Array<{ status: string }>
): { completed: number; total: number; percent: number } {
  const total = actions.length
  const completed = actions.filter(a => a.status === 'DONE').length
  const percent = total > 0 ? (completed / total) * 100 : 0
  return { completed, total, percent }
}

// Calculer les statistiques de tensions par status
export function calculateTensionStats(
  tensions: Array<{ status: string; severity: number }>
): {
  total: number
  byStatus: Record<string, number>
  criticalCount: number
  averageSeverity: number
} {
  const total = tensions.length
  const byStatus: Record<string, number> = {}
  let criticalCount = 0
  let severitySum = 0

  for (const tension of tensions) {
    byStatus[tension.status] = (byStatus[tension.status] || 0) + 1
    if (tension.severity >= 4) criticalCount++
    severitySum += tension.severity
  }

  return {
    total,
    byStatus,
    criticalCount,
    averageSeverity: total > 0 ? severitySum / total : 0,
  }
}
