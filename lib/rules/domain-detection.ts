// Détection automatique des domaines éthiques à partir de la cartographie
// Ce module analyse la structure du graphe et les métadonnées du SIA
// pour déterminer quels domaines de vigilance (PRIVACY, EQUITY, etc.) sont pertinents

import { DomainId, DOMAINS } from '@/lib/constants/domains'

// Context types
export interface DomainDetectionContext {
  sia: {
    sector: string
    decisionType: string
    userScale: string
    hasVulnerable: boolean
    dataTypes: string[]
  }
  nodes: Array<{
    id: string
    type: string // function type: SOURCE, TREATMENT, DECISION, ACTION, STAKEHOLDER, STORAGE
    label: string
    dataTypes?: string[]
  }>
  edges: Array<{
    id: string
    sourceId: string
    targetId: string
    dataCategories?: string[]
  }>
}

export interface DetectedDomain {
  id: DomainId
  label: string
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
  reasons: string[]
  color: string
  icon: string
}

// Data types that trigger specific domains
const PRIVACY_DATA_TYPES = [
  'identity', 'biometric', 'health', 'genetic', 'location', 'financial',
  'behavioral', 'preferences', 'communications', 'social', 'photo', 'video',
  'audio', 'face', 'fingerprint', 'political', 'religious', 'sexual', 'ethnic',
  'NAME', 'SSN', 'DOB', 'INCOME', 'EMPLOYMENT', 'TRANSACTIONS', 'CREDIT_SCORE',
  'BANK_ACCOUNT', 'IP', 'EMAIL', 'PHONE', 'ADDRESS', 'CV', 'EDUCATION',
  'WORK_HISTORY', 'MEDICAL', 'PRESCRIPTION', 'DIAGNOSIS', 'VITALS'
]

const SENSITIVE_DATA_TYPES = [
  'biometric', 'health', 'genetic', 'political', 'religious', 'sexual', 'ethnic',
  'criminal', 'MEDICAL', 'PRESCRIPTION', 'DIAGNOSIS', 'VITALS', 'SSN'
]

const BEHAVIORAL_DATA_TYPES = [
  'behavioral', 'preferences', 'usage', 'navigation', 'clicks', 'engagement',
  'BROWSING', 'PURCHASE_HISTORY', 'SEARCH_HISTORY', 'SOCIAL_INTERACTIONS'
]

// High-risk business domains
const HIGH_EQUITY_DOMAINS = ['HR', 'EMPLOYMENT', 'FINANCE', 'INSURANCE', 'JUSTICE', 'EDUCATION', 'ADMINISTRATION']
const HIGH_RECOURSE_DOMAINS = ['FINANCE', 'INSURANCE', 'JUSTICE', 'ADMINISTRATION', 'EMPLOYMENT']
const HIGH_SECURITY_DOMAINS = ['HEALTH', 'FINANCE', 'SECURITY', 'JUSTICE']

/**
 * Détecte les domaines éthiques pertinents à partir de la cartographie
 */
export function detectEthicalDomains(context: DomainDetectionContext): DetectedDomain[] {
  const detectedDomains: DetectedDomain[] = []
  const { sia, nodes, edges } = context

  // Helper functions
  const hasNodeType = (...types: string[]) => nodes.some(n => types.includes(n.type))
  const countNodeType = (...types: string[]) => nodes.filter(n => types.includes(n.type)).length
  const hasConnection = (fromType: string, toType: string) => {
    const fromIds = nodes.filter(n => n.type === fromType).map(n => n.id)
    const toIds = nodes.filter(n => n.type === toType).map(n => n.id)
    return edges.some(e =>
      (fromIds.includes(e.sourceId) && toIds.includes(e.targetId)) ||
      (fromIds.includes(e.targetId) && toIds.includes(e.sourceId))
    )
  }
  const hasDataType = (...types: string[]) => {
    const allDataTypes = [
      ...sia.dataTypes,
      ...nodes.flatMap(n => n.dataTypes || []),
      ...edges.flatMap(e => e.dataCategories || [])
    ].map(d => d.toLowerCase())
    return types.some(t => allDataTypes.some(d => d.includes(t.toLowerCase())))
  }

  // =========================================================================
  // PRIVACY Domain Detection
  // =========================================================================
  const privacyReasons: string[] = []
  let privacyConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Check for data collection
  if (hasNodeType('SOURCE')) {
    privacyReasons.push('Collecte de données (présence de SOURCE)')
    privacyConfidence = 'LOW'
  }

  // Check for data storage
  if (hasNodeType('STORAGE')) {
    privacyReasons.push('Stockage de données (présence de STORAGE)')
    privacyConfidence = 'MEDIUM'
  }

  // Check for personal data types
  if (PRIVACY_DATA_TYPES.some(t => hasDataType(t))) {
    privacyReasons.push('Données personnelles traitées')
    privacyConfidence = 'MEDIUM'
  }

  // Check for sensitive data types
  if (SENSITIVE_DATA_TYPES.some(t => hasDataType(t))) {
    privacyReasons.push('Données sensibles (santé, biométrie, opinions...)')
    privacyConfidence = 'HIGH'
  }

  // Check for behavioral profiling
  if (BEHAVIORAL_DATA_TYPES.some(t => hasDataType(t))) {
    privacyReasons.push('Données comportementales (profilage possible)')
    privacyConfidence = 'HIGH'
  }

  if (privacyReasons.length > 0) {
    detectedDomains.push({
      id: 'PRIVACY',
      label: DOMAINS.PRIVACY.label,
      confidence: privacyConfidence,
      reasons: privacyReasons,
      color: DOMAINS.PRIVACY.color,
      icon: DOMAINS.PRIVACY.icon,
    })
  }

  // =========================================================================
  // EQUITY Domain Detection
  // =========================================================================
  const equityReasons: string[] = []
  let equityConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Check for decision/treatment nodes affecting stakeholders
  if (hasNodeType('DECISION') && hasNodeType('STAKEHOLDER')) {
    equityReasons.push('Décisions algorithmiques impactant des personnes')
    equityConfidence = 'MEDIUM'
  }

  if (hasConnection('DECISION', 'STAKEHOLDER')) {
    equityReasons.push('Décisions directement liées aux parties prenantes')
    equityConfidence = 'HIGH'
  }

  // Check for vulnerable populations
  if (sia.hasVulnerable) {
    equityReasons.push('Populations vulnérables concernées')
    equityConfidence = 'HIGH'
  }

  // Check for high-risk domains
  if (HIGH_EQUITY_DOMAINS.includes(sia.sector)) {
    equityReasons.push(`Domaine à haut risque de discrimination (${sia.sector})`)
    equityConfidence = 'HIGH'
  }

  // Large scale increases equity concerns
  if (sia.userScale === 'LARGE' || sia.userScale === 'VERY_LARGE') {
    equityReasons.push('Grande échelle (risque de discrimination systémique)')
    equityConfidence = equityConfidence === 'HIGH' ? 'HIGH' : 'MEDIUM'
  }

  if (equityReasons.length > 0) {
    detectedDomains.push({
      id: 'EQUITY',
      label: DOMAINS.EQUITY.label,
      confidence: equityConfidence,
      reasons: equityReasons,
      color: DOMAINS.EQUITY.color,
      icon: DOMAINS.EQUITY.icon,
    })
  }

  // =========================================================================
  // TRANSPARENCY Domain Detection
  // =========================================================================
  const transparencyReasons: string[] = []
  let transparencyConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Check for treatment nodes (algorithmic processing)
  if (hasNodeType('TREATMENT')) {
    transparencyReasons.push('Traitement algorithmique')
    transparencyConfidence = 'LOW'
  }

  // Multiple treatments = complex chain
  if (countNodeType('TREATMENT') >= 2) {
    transparencyReasons.push('Chaîne de traitements multiples (complexité)')
    transparencyConfidence = 'MEDIUM'
  }

  // Decision nodes always need transparency
  if (hasNodeType('DECISION')) {
    transparencyReasons.push('Décisions automatisées à expliquer')
    transparencyConfidence = 'MEDIUM'
  }

  // Complex graph structure
  if (nodes.length >= 4 && edges.length >= 3) {
    transparencyReasons.push('Architecture complexe (difficile à expliquer)')
    transparencyConfidence = 'HIGH'
  }

  // Treatment to stakeholder connection
  if (hasConnection('TREATMENT', 'STAKEHOLDER') || hasConnection('DECISION', 'STAKEHOLDER')) {
    transparencyReasons.push('Impact direct sur les personnes')
    transparencyConfidence = 'HIGH'
  }

  if (transparencyReasons.length > 0) {
    detectedDomains.push({
      id: 'TRANSPARENCY',
      label: DOMAINS.TRANSPARENCY.label,
      confidence: transparencyConfidence,
      reasons: transparencyReasons,
      color: DOMAINS.TRANSPARENCY.color,
      icon: DOMAINS.TRANSPARENCY.icon,
    })
  }

  // =========================================================================
  // AUTONOMY Domain Detection
  // =========================================================================
  const autonomyReasons: string[] = []
  let autonomyConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Check for behavioral data (profiling/recommendation)
  if (BEHAVIORAL_DATA_TYPES.some(t => hasDataType(t))) {
    autonomyReasons.push('Données comportementales (personnalisation)')
    autonomyConfidence = 'MEDIUM'
  }

  // Recommendations/actions affecting users
  if (hasNodeType('ACTION') && hasNodeType('STAKEHOLDER')) {
    autonomyReasons.push('Actions automatisées impactant les utilisateurs')
    autonomyConfidence = 'MEDIUM'
  }

  // Automatic decisions
  if (sia.decisionType === 'AUTO_DECISION') {
    autonomyReasons.push('Décisions entièrement automatiques')
    autonomyConfidence = 'HIGH'
  } else if (sia.decisionType === 'ASSISTED_DECISION') {
    autonomyReasons.push('Décisions assistées par algorithme')
    autonomyConfidence = 'MEDIUM'
  }

  // Decision to action without human
  if (hasConnection('DECISION', 'ACTION')) {
    autonomyReasons.push('Décision vers action directe')
    autonomyConfidence = 'HIGH'
  }

  if (autonomyReasons.length > 0) {
    detectedDomains.push({
      id: 'AUTONOMY',
      label: DOMAINS.AUTONOMY.label,
      confidence: autonomyConfidence,
      reasons: autonomyReasons,
      color: DOMAINS.AUTONOMY.color,
      icon: DOMAINS.AUTONOMY.icon,
    })
  }

  // =========================================================================
  // SECURITY Domain Detection
  // =========================================================================
  const securityReasons: string[] = []
  let securityConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Any data storage
  if (hasNodeType('STORAGE')) {
    securityReasons.push('Stockage de données à protéger')
    securityConfidence = 'LOW'
  }

  // Sensitive data requires high security
  if (SENSITIVE_DATA_TYPES.some(t => hasDataType(t))) {
    securityReasons.push('Données sensibles nécessitant protection renforcée')
    securityConfidence = 'HIGH'
  }

  // High-risk domains
  if (HIGH_SECURITY_DOMAINS.includes(sia.sector)) {
    securityReasons.push(`Domaine critique (${sia.sector})`)
    securityConfidence = 'HIGH'
  }

  // Actions in the system
  if (hasNodeType('ACTION')) {
    securityReasons.push('Actions automatisées (risques opérationnels)')
    securityConfidence = 'MEDIUM'
  }

  // Large scale
  if (sia.userScale === 'LARGE' || sia.userScale === 'VERY_LARGE') {
    securityReasons.push('Grande échelle (surface d\'attaque étendue)')
    securityConfidence = securityConfidence === 'HIGH' ? 'HIGH' : 'MEDIUM'
  }

  if (securityReasons.length > 0) {
    detectedDomains.push({
      id: 'SECURITY',
      label: DOMAINS.SECURITY.label,
      confidence: securityConfidence,
      reasons: securityReasons,
      color: DOMAINS.SECURITY.color,
      icon: DOMAINS.SECURITY.icon,
    })
  }

  // =========================================================================
  // RECOURSE Domain Detection
  // =========================================================================
  const recourseReasons: string[] = []
  let recourseConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Automatic decisions need recourse
  if (hasNodeType('DECISION')) {
    recourseReasons.push('Décisions algorithmiques (droit de contestation)')
    recourseConfidence = 'MEDIUM'
  }

  // Automatic without human oversight
  if (sia.decisionType === 'AUTO_DECISION') {
    recourseReasons.push('Décisions entièrement automatiques')
    recourseConfidence = 'HIGH'
  }

  // High-risk domains
  if (HIGH_RECOURSE_DOMAINS.includes(sia.sector)) {
    recourseReasons.push(`Domaine à fort enjeu (${sia.sector})`)
    recourseConfidence = 'HIGH'
  }

  // No stakeholder in decision chain might mean no human oversight
  if (hasNodeType('DECISION') && !hasNodeType('STAKEHOLDER')) {
    recourseReasons.push('Absence de partie prenante humaine visible')
    recourseConfidence = 'HIGH'
  }

  if (recourseReasons.length > 0) {
    detectedDomains.push({
      id: 'RECOURSE',
      label: DOMAINS.RECOURSE.label,
      confidence: recourseConfidence,
      reasons: recourseReasons,
      color: DOMAINS.RECOURSE.color,
      icon: DOMAINS.RECOURSE.icon,
    })
  }

  // =========================================================================
  // SUSTAINABILITY Domain Detection
  // =========================================================================
  const sustainabilityReasons: string[] = []
  let sustainabilityConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Multiple AI/treatments = more compute
  if (countNodeType('TREATMENT', 'DECISION') >= 2) {
    sustainabilityReasons.push('Plusieurs traitements IA (impact énergétique)')
    sustainabilityConfidence = 'LOW'
  }

  // Large scale = more impact
  if (sia.userScale === 'LARGE' || sia.userScale === 'VERY_LARGE') {
    sustainabilityReasons.push('Grande échelle d\'utilisation')
    sustainabilityConfidence = 'MEDIUM'
  }

  if (sustainabilityReasons.length > 0) {
    detectedDomains.push({
      id: 'SUSTAINABILITY',
      label: DOMAINS.SUSTAINABILITY.label,
      confidence: sustainabilityConfidence,
      reasons: sustainabilityReasons,
      color: DOMAINS.SUSTAINABILITY.color,
      icon: DOMAINS.SUSTAINABILITY.icon,
    })
  }

  // =========================================================================
  // RESPONSIBILITY Domain Detection
  // =========================================================================
  const accountabilityReasons: string[] = []
  let accountabilityConfidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'

  // Complex systems need accountability
  if (nodes.length >= 3) {
    accountabilityReasons.push('Système multi-composants')
    accountabilityConfidence = 'LOW'
  }

  // Decisions need accountability
  if (hasNodeType('DECISION')) {
    accountabilityReasons.push('Décisions à documenter et tracer')
    accountabilityConfidence = 'MEDIUM'
  }

  // Multiple stakeholders = complex responsibility
  if (countNodeType('STAKEHOLDER') >= 2) {
    accountabilityReasons.push('Multiples parties prenantes (responsabilités partagées)')
    accountabilityConfidence = 'MEDIUM'
  }

  // Auto decisions need clear accountability
  if (sia.decisionType === 'AUTO_DECISION') {
    accountabilityReasons.push('Décisions automatiques (responsabilité à clarifier)')
    accountabilityConfidence = 'HIGH'
  }

  if (accountabilityReasons.length > 0) {
    detectedDomains.push({
      id: 'RESPONSIBILITY',
      label: DOMAINS.RESPONSIBILITY.label,
      confidence: accountabilityConfidence,
      reasons: accountabilityReasons,
      color: DOMAINS.RESPONSIBILITY.color,
      icon: DOMAINS.RESPONSIBILITY.icon,
    })
  }

  // Sort by confidence (HIGH first) then by number of reasons
  const confidenceOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 }
  detectedDomains.sort((a, b) => {
    const confDiff = confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
    if (confDiff !== 0) return confDiff
    return b.reasons.length - a.reasons.length
  })

  return detectedDomains
}

/**
 * Get a quick summary of detected domains for display
 */
export function getDomainsSummary(domains: DetectedDomain[]): {
  high: DetectedDomain[]
  medium: DetectedDomain[]
  low: DetectedDomain[]
  total: number
} {
  return {
    high: domains.filter(d => d.confidence === 'HIGH'),
    medium: domains.filter(d => d.confidence === 'MEDIUM'),
    low: domains.filter(d => d.confidence === 'LOW'),
    total: domains.length,
  }
}

/**
 * Get domain icon component name
 */
export function getDomainIconName(domainId: DomainId): string {
  return DOMAINS[domainId]?.icon || 'HelpCircle'
}
