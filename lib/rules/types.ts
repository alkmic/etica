// lib/rules/types.ts
// Types pour le moteur de détection de dilemmes
// Ces types sont définis localement pour éviter les dépendances sur Prisma generate

// ========================================
// TYPES D'ENUM (miroir du schéma Prisma)
// ========================================

export type EthicalDomain =
  | 'PRIVACY'
  | 'EQUITY'
  | 'TRANSPARENCY'
  | 'AUTONOMY'
  | 'SECURITY'
  | 'RECOURSE'
  | 'MASTERY'
  | 'RESPONSIBILITY'
  | 'SOVEREIGNTY'
  | 'SUSTAINABILITY'
  | 'LOYALTY'
  | 'SOCIETAL_BALANCE'

export type Sector =
  | 'HEALTH'
  | 'FINANCE'
  | 'HR'
  | 'COMMERCE'
  | 'JUSTICE'
  | 'ADMINISTRATION'
  | 'EDUCATION'
  | 'TRANSPORT'
  | 'INSURANCE'
  | 'SECURITY'
  | 'MARKETING'
  | 'OTHER'

export type Scale =
  | 'TINY'
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE'
  | 'VERY_LARGE'

export type RuleFamily =
  | 'STRUCTURAL'
  | 'DATA'
  | 'DEPENDENCY'
  | 'CONTEXTUAL'
  | 'GOVERNANCE'

export type NodeType =
  | 'HUMAN'
  | 'AI'
  | 'INFRA'
  | 'ORG'

export type FlowNature =
  | 'COLLECT'
  | 'INFERENCE'
  | 'ENRICHMENT'
  | 'DECISION'
  | 'RECOMMENDATION'
  | 'NOTIFICATION'
  | 'LEARNING'
  | 'CONTROL'
  | 'TRANSFER'
  | 'STORAGE'

export type FlowIntent =
  | 'COMMAND'
  | 'FEEDBACK'
  | 'SURVEILLANCE'
  | 'INFORMATION'
  | 'EVALUATION'
  | 'TRAINING'
  | 'QUERY'

export type DataCategory =
  | 'IDENTIFIER'
  | 'DEMOGRAPHIC'
  | 'LOCATION'
  | 'FINANCIAL'
  | 'HEALTH'
  | 'BIOMETRIC'
  | 'BEHAVIORAL'
  | 'PROFESSIONAL'
  | 'OPINION'
  | 'JUDICIAL'
  | 'INFERRED'
  | 'CONTENT'
  | 'TECHNICAL'
  | 'OTHER'

export type Sensitivity =
  | 'STANDARD'
  | 'SENSITIVE'
  | 'HIGHLY_SENSITIVE'

export type AutomationLevel =
  | 'INFORMATIVE'
  | 'ASSISTED'
  | 'SEMI_AUTO'
  | 'AUTO_WITH_RECOURSE'
  | 'AUTO_NO_RECOURSE'

// ========================================
// CONTEXTE D'ÉVALUATION
// ========================================

/**
 * Contexte du SIA pour l'évaluation
 * ⚠️ Utilise les noms de champs du schéma Prisma actuel
 */
export interface SiaContext {
  id: string
  name: string
  sector: Sector           // ⚠️ PAS "domain"
  decisionType: string
  hasVulnerable: boolean
  userScale: Scale         // ⚠️ PAS "scale"
  dataTypes: string[]
  populations: string[]
  hasExternalAI?: boolean
  hasExternalInfra?: boolean
  externalProviders?: string[]
  misuseScenarios?: string[]
  nextReviewDate?: Date | null
}

/**
 * Contexte d'un nœud pour l'évaluation
 */
export interface NodeContext {
  id: string
  type: NodeType
  subtype: string | null
  label: string
  attributes: Record<string, unknown>
  reinforcesDomains: EthicalDomain[]
  affectsDomains: EthicalDomain[]
  // Attributs de dépendance
  isExternal?: boolean
  provider?: string
  hasFallback?: boolean
  isOpaque?: boolean
}

/**
 * Contexte d'un flux pour l'évaluation
 */
export interface EdgeContext {
  id: string
  sourceId: string
  targetId: string
  nature: FlowNature
  intent: FlowIntent
  dataCategories: DataCategory[]
  sensitivity: Sensitivity
  automation: AutomationLevel
  isReversible: boolean
  // Métadonnées
  sourceType: NodeType
  targetType: NodeType
}

/**
 * Contexte complet pour l'évaluation des règles
 */
export interface EvaluationContext {
  sia: SiaContext
  nodes: NodeContext[]
  edges: EdgeContext[]
}

// ========================================
// STRUCTURE D'UNE RÈGLE
// ========================================

/**
 * Condition sur les nœuds
 */
export interface NodeCondition {
  type?: NodeType | NodeType[]
  subtype?: string | string[]
  hasAttribute?: string
  attributeEquals?: { key: string; value: unknown }
  isExternal?: boolean
  isOpaque?: boolean
  hasFallback?: boolean
}

/**
 * Condition sur les flux
 */
export interface EdgeCondition {
  nature?: FlowNature | FlowNature[]
  intent?: FlowIntent | FlowIntent[]
  dataCategories?: DataCategory[]
  sensitivityMin?: Sensitivity
  automation?: AutomationLevel | AutomationLevel[]
  isReversible?: boolean
  direction?: 'H2M' | 'M2M' | 'M2H' | 'H2H'
}

/**
 * Condition sur le graphe (structure)
 */
export interface GraphCondition {
  hasCycle?: boolean
  hasClosedLoop?: boolean  // Boucle sans intervention humaine
  hasConcentration?: boolean  // Nœud avec beaucoup de connexions
  hasCascade?: boolean  // Chaîne de décisions
  maxDepth?: number
}

/**
 * Condition sur le SIA
 */
export interface SiaCondition {
  sectors?: Sector[]  // ⚠️ Utiliser les valeurs exactes de l'enum Sector
  decisionTypes?: string[]
  hasVulnerable?: boolean
  minScale?: Scale
  hasExternalAI?: boolean
  hasExternalInfra?: boolean
}

/**
 * Définition complète d'une règle de détection
 */
export interface DetectionRule {
  // Identité
  id: string
  name: string
  nameFr: string
  family: RuleFamily

  // Conditions de déclenchement
  nodeConditions?: NodeCondition[]
  edgeConditions?: EdgeCondition[]
  graphConditions?: GraphCondition[]
  siaConditions?: SiaCondition[]

  // Logique personnalisée (optionnelle)
  customCheck?: (ctx: EvaluationContext) => boolean

  // Dilemme produit
  produces: {
    domainA: EthicalDomain
    domainB: EthicalDomain
    formulationTemplate: string
    mechanismTemplate: string
  }

  // Qualification
  severityBase: number  // 1-5
  aggravatingFactors: string[]
  mitigatingFactors: string[]

  // Aide à l'arbitrage
  questionsToConsider: string[]
  stakeholdersToConsult: string[]
  acceptablePatterns: string[]
  requiredEvidences: string[]
}

// ========================================
// RÉSULTATS DE DÉTECTION
// ========================================

/**
 * Dilemme détecté par le moteur
 */
export interface DetectedDilemma {
  ruleId: string
  ruleName: string
  ruleFamily: RuleFamily

  domainA: EthicalDomain
  domainB: EthicalDomain

  formulation: string
  mechanism: string

  affectedNodeIds: string[]
  affectedEdgeIds: string[]

  severity: number
  aggravatingFactors: string[]
  mitigatingFactors: string[]

  questionsToConsider: string[]
  stakeholdersToConsult: string[]
  acceptablePatterns: string[]
  requiredEvidences: string[]

  detectionReason: string
}

/**
 * Rapport de couverture
 */
export interface CoverageReport {
  framework: 'EU_TRUSTWORTHY_AI' | 'NIST_AI_RMF'
  dimensions: {
    id: string
    name: string
    coveredBy: string[]  // IDs des règles
    coverage: 'FULL' | 'PARTIAL' | 'NONE'
  }[]
  overallCoverage: number  // 0-100%
  gaps: string[]  // Dimensions non couvertes
}
