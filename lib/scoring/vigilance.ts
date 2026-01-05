// Calcul des scores de vigilance ETICA
// Ce module calcule les scores de vigilance par domaine et le score global

import { DomainId, DOMAIN_IDS } from '@/lib/constants/domains'

// Types pour les données d'entrée
export interface SiaData {
  id?: string
  decisionType: string
  hasVulnerable: boolean
  userScale: string
  sector?: string
}

export interface EdgeData {
  id: string
  nature: string
  sensitivity: string
  automation: string
  direction: string
  dataCategories: string[]
  agentivity: number | null
  asymmetry: number | null
  irreversibility: number | null
  scalability: number | null
  opacity: number | null
}

export interface TensionData {
  id: string
  status: string
  impactedDomains: string[]
  severity: number | null
  probability: number | null
  scale: number | null
  vulnerability: number | null
  irreversibility: number | null
  detectability: number | null
  exposureScore: number | null
}

export interface ActionData {
  id: string
  status: string
  tensionId: string | null
  estimatedImpact: Record<string, number> | null
}

// Résultat du calcul
export interface VigilanceScores {
  global: number
  globalLevel: 1 | 2 | 3 | 4 | 5
  byDomain: Record<DomainId, DomainScore>
  coverage: number
  tensionCount: number
  activeActionCount: number
}

export interface DomainScore {
  score: number
  level: 1 | 2 | 3 | 4 | 5
  exposure: number
  coverage: number
  tensionCount: number
}

// Poids pour le calcul de l'exposition intrinsèque
const DECISION_TYPE_WEIGHTS: Record<string, number> = {
  INFORMATIVE: 0.1,
  RECOMMENDATION: 0.3,
  ASSISTED_DECISION: 0.6,
  AUTO_DECISION: 1.0,
}

const SCALE_WEIGHTS: Record<string, number> = {
  TINY: 0.1,
  SMALL: 0.2,
  MEDIUM: 0.4,
  LARGE: 0.7,
  VERY_LARGE: 1.0,
}

const SENSITIVITY_WEIGHTS: Record<string, number> = {
  STANDARD: 0.2,
  SENSITIVE: 0.6,
  HIGHLY_SENSITIVE: 1.0,
}

// Correspondance nature de flux → domaines impactés
const FLOW_NATURE_DOMAIN_MAPPING: Record<string, DomainId[]> = {
  COLLECT: ['PRIVACY', 'SECURITY'],
  INFERENCE: ['PRIVACY', 'EQUITY', 'TRANSPARENCY'],
  ENRICHMENT: ['PRIVACY'],
  DECISION: ['TRANSPARENCY', 'RECOURSE', 'EQUITY', 'AUTONOMY'],
  RECOMMENDATION: ['AUTONOMY', 'TRANSPARENCY'],
  NOTIFICATION: ['TRANSPARENCY'],
  LEARNING: ['SUSTAINABILITY', 'RESPONSIBILITY'],
  CONTROL: ['RESPONSIBILITY'],
  TRANSFER: ['PRIVACY', 'SECURITY'],
  STORAGE: ['PRIVACY', 'SECURITY'],
}

// Poids des dimensions du profil éthique par domaine
const PROFILE_WEIGHTS: Record<DomainId, Record<string, number>> = {
  // Cercle 1: Personnes
  PRIVACY: { asymmetry: 0.4, opacity: 0.3, scalability: 0.3 },
  EQUITY: { scalability: 0.4, opacity: 0.3, agentivity: 0.3 },
  TRANSPARENCY: { opacity: 0.6, asymmetry: 0.4 },
  AUTONOMY: { agentivity: 0.6, asymmetry: 0.2, irreversibility: 0.2 },
  SECURITY: { irreversibility: 0.5, scalability: 0.5 },
  RECOURSE: { irreversibility: 0.4, agentivity: 0.3, opacity: 0.3 },
  // Cercle 2: Organisation
  MASTERY: { opacity: 0.5, asymmetry: 0.3, agentivity: 0.2 },
  RESPONSIBILITY: { opacity: 0.5, irreversibility: 0.3, scalability: 0.2 },
  SOVEREIGNTY: { asymmetry: 0.5, scalability: 0.3, opacity: 0.2 },
  // Cercle 3: Société
  SUSTAINABILITY: { scalability: 0.8, irreversibility: 0.2 },
  LOYALTY: { asymmetry: 0.5, agentivity: 0.3, opacity: 0.2 },
  SOCIETAL_BALANCE: { scalability: 0.6, agentivity: 0.2, irreversibility: 0.2 },
}

/**
 * Calcule l'exposition brute pour un domaine
 */
function calculateDomainExposure(
  sia: SiaData,
  edges: EdgeData[],
  tensions: TensionData[],
  domainId: DomainId
): number {
  let exposure = 0

  // 1. Exposition intrinsèque basée sur les caractéristiques du SIA
  const decisionImpact = (DECISION_TYPE_WEIGHTS[sia.decisionType] || 0.3) * getDomainDecisionWeight(domainId)
  const vulnerabilityFactor = sia.hasVulnerable ? 0.3 : 0
  const scaleFactor = (SCALE_WEIGHTS[sia.userScale] || 0.3) * 0.1

  exposure += decisionImpact * 0.35 + vulnerabilityFactor + scaleFactor

  // 2. Exposition basée sur les flux pertinents
  const relevantEdges = getRelevantEdgesForDomain(edges, domainId)

  for (const edge of relevantEdges) {
    // Sensibilité des données
    const sensitivityWeight = SENSITIVITY_WEIGHTS[edge.sensitivity] || 0.2
    exposure += sensitivityWeight * 0.05

    // Profil éthique
    const profileScore = calculateEdgeProfileScore(edge, domainId)
    exposure += profileScore * 0.05
  }

  // 3. Exposition basée sur les tensions identifiées
  const domainTensions = tensions.filter(
    (t) => t.impactedDomains.includes(domainId) && t.status !== 'DISMISSED'
  )

  for (const tension of domainTensions) {
    if (tension.exposureScore !== null) {
      exposure += (tension.exposureScore / 100) * 0.15
    }
  }

  return Math.min(100, Math.max(0, exposure * 100))
}

/**
 * Poids du type de décision selon le domaine
 */
function getDomainDecisionWeight(domainId: DomainId): number {
  switch (domainId) {
    case 'RECOURSE':
    case 'AUTONOMY':
      return 1.0
    case 'TRANSPARENCY':
      return 0.9
    case 'EQUITY':
      return 0.8
    default:
      return 0.5
  }
}

/**
 * Récupère les flux pertinents pour un domaine
 */
function getRelevantEdgesForDomain(edges: EdgeData[], domainId: DomainId): EdgeData[] {
  return edges.filter((edge) => {
    const relevantDomains = FLOW_NATURE_DOMAIN_MAPPING[edge.nature] || []
    return relevantDomains.includes(domainId)
  })
}

/**
 * Calcule le score de profil éthique d'un flux pour un domaine
 */
function calculateEdgeProfileScore(edge: EdgeData, domainId: DomainId): number {
  const weights = PROFILE_WEIGHTS[domainId] || {}
  let score = 0
  let totalWeight = 0

  for (const [dimension, weight] of Object.entries(weights)) {
    const value = edge[dimension as keyof EdgeData] as number | null
    if (value !== null) {
      score += (value / 5) * weight
      totalWeight += weight
    }
  }

  return totalWeight > 0 ? score / totalWeight : 0
}

/**
 * Calcule la couverture des actions pour un domaine
 */
function calculateDomainCoverage(
  actions: ActionData[],
  tensions: TensionData[],
  domainId: DomainId
): number {
  // Tensions affectant ce domaine
  const domainTensions = tensions.filter(
    (t) => t.impactedDomains.includes(domainId) && t.status !== 'DISMISSED'
  )

  if (domainTensions.length === 0) {
    return 1.0 // Pas de tension = 100% couverture
  }

  // Actions liées aux tensions du domaine
  const relevantActions = actions.filter((a) => {
    if (a.tensionId) {
      return domainTensions.some((t) => t.id === a.tensionId)
    }
    // Actions avec impact direct sur le domaine
    if (a.estimatedImpact) {
      return domainId.toLowerCase() in a.estimatedImpact
    }
    return false
  })

  if (relevantActions.length === 0) {
    return 0
  }

  const completedActions = relevantActions.filter((a) => a.status === 'DONE')
  const inProgressActions = relevantActions.filter((a) => a.status === 'IN_PROGRESS')

  // Actions terminées comptent 100%, en cours 50%
  const coveredWeight = completedActions.length + inProgressActions.length * 0.5

  return Math.min(1, coveredWeight / domainTensions.length)
}

/**
 * Convertit un score en niveau de vigilance (1-5)
 */
function scoreToLevel(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score < 20) return 1
  if (score < 40) return 2
  if (score < 60) return 3
  if (score < 80) return 4
  return 5
}

/**
 * Calcule tous les scores de vigilance
 */
export function calculateVigilanceScores(
  sia: SiaData,
  edges: EdgeData[],
  tensions: TensionData[],
  actions: ActionData[]
): VigilanceScores {
  const byDomain: Record<string, DomainScore> = {}
  let totalExposure = 0
  let totalCoverage = 0
  let totalTensions = 0

  // Calculer pour chaque domaine
  for (const domainId of DOMAIN_IDS) {
    const exposure = calculateDomainExposure(sia, edges, tensions, domainId)
    const coverage = calculateDomainCoverage(actions, tensions, domainId)
    const tensionCount = tensions.filter(
      (t) => t.impactedDomains.includes(domainId) && t.status !== 'DISMISSED'
    ).length

    // Score résiduel = exposition * (1 - couverture * 0.7)
    // La couverture réduit jusqu'à 70% de l'exposition
    const score = exposure * (1 - coverage * 0.7)
    const level = scoreToLevel(score)

    byDomain[domainId] = {
      score,
      level,
      exposure,
      coverage,
      tensionCount,
    }

    totalExposure += exposure
    totalCoverage += coverage
    totalTensions += tensionCount
  }

  // Score global
  const avgExposure = totalExposure / DOMAIN_IDS.length
  const avgCoverage = totalCoverage / DOMAIN_IDS.length
  const globalScore = avgExposure * (1 - avgCoverage * 0.7)
  const globalLevel = scoreToLevel(globalScore)

  // Couverture globale
  const allRelevantActions = actions.filter(
    (a) => a.tensionId || a.estimatedImpact
  )
  const completedActions = allRelevantActions.filter((a) => a.status === 'DONE')
  const inProgressActions = allRelevantActions.filter((a) => a.status === 'IN_PROGRESS')
  const coverage = allRelevantActions.length > 0
    ? (completedActions.length + inProgressActions.length * 0.5) / allRelevantActions.length
    : 0

  return {
    global: globalScore,
    globalLevel,
    byDomain: byDomain as Record<DomainId, DomainScore>,
    coverage,
    tensionCount: tensions.filter((t) => t.status !== 'DISMISSED').length,
    activeActionCount: actions.filter((a) => a.status === 'IN_PROGRESS').length,
  }
}

/**
 * Calcule le score d'exposition d'une tension
 */
export function calculateTensionExposureScore(
  severity: number,
  probability: number,
  scale: number,
  vulnerability: number,
  irreversibility: number,
  detectability: number
): number {
  // Formule pondérée
  const weights = {
    severity: 0.25,
    probability: 0.2,
    scale: 0.15,
    vulnerability: 0.15,
    irreversibility: 0.15,
    detectability: 0.1,
  }

  const score =
    (severity / 5) * weights.severity +
    (probability / 5) * weights.probability +
    (scale / 5) * weights.scale +
    (vulnerability / 5) * weights.vulnerability +
    (irreversibility / 5) * weights.irreversibility +
    (detectability / 5) * weights.detectability

  return Math.round(score * 100)
}

/**
 * Calcule le score de profil éthique d'un flux
 */
export function calculateEthicalProfileScore(
  agentivity: number | null,
  asymmetry: number | null,
  irreversibility: number | null,
  scalability: number | null,
  opacity: number | null
): number {
  const values = [agentivity, asymmetry, irreversibility, scalability, opacity].filter(
    (v): v is number => v !== null
  )

  if (values.length === 0) return 0

  const sum = values.reduce((acc, v) => acc + v, 0)
  return Math.round((sum / (values.length * 5)) * 100)
}

/**
 * Calcule le niveau de vigilance d'un flux
 */
export function calculateEdgeVigilanceLevel(
  sensitivity: string,
  automation: string,
  ethicalProfileScore: number
): 1 | 2 | 3 | 4 | 5 {
  let score = 0

  // Sensibilité
  const sensitivityScores: Record<string, number> = {
    STANDARD: 10,
    SENSITIVE: 30,
    HIGHLY_SENSITIVE: 50,
  }
  score += sensitivityScores[sensitivity] || 10

  // Automatisation
  const automationScores: Record<string, number> = {
    INFORMATIVE: 5,
    ASSISTED: 10,
    SEMI_AUTO: 20,
    AUTO_WITH_RECOURSE: 35,
    AUTO_NO_RECOURSE: 50,
  }
  score += automationScores[automation] || 10

  // Profil éthique
  score += ethicalProfileScore * 0.5

  return scoreToLevel(score)
}
