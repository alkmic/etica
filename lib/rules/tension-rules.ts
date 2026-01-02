// Règles de détection automatique des tensions ETICA
// Ce module analyse le SIA et ses flux pour identifier les tensions potentielles
// Basé sur le FRIA (Fundamental Rights Impact Assessment) et les principes ETICA

import { TensionPatternId } from '@/lib/constants/tension-patterns'
import { DomainId } from '@/lib/constants/domains'

// Types pour les données d'entrée
export interface SiaContext {
  id: string
  name: string
  domain: string
  decisionType: string
  hasVulnerable: boolean
  scale: string
  dataTypes: string[]
}

export interface NodeContext {
  id: string
  type: string
  label: string
  attributes: Record<string, unknown>
}

export interface EdgeContext {
  id: string
  sourceId: string
  targetId: string
  nature: string
  sensitivity: string
  automation: string
  direction: string
  dataCategories: string[]
  opacity: number | null
  agentivity: number | null
  asymmetry: number | null
  irreversibility: number | null
  scalability: number | null
}

// Résultat de détection
export interface DetectedTension {
  pattern: TensionPatternId
  ruleId: string
  ruleName: string
  description: string
  confidence: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  impactedDomains: DomainId[]
  relatedEdgeIds: string[]
  suggestedActions: string[]
}

// Interface d'une règle de détection
interface DetectionRule {
  id: string
  pattern: TensionPatternId
  name: string
  description: string
  condition: (sia: SiaContext, nodes: NodeContext[], edges: EdgeContext[]) => boolean
  getRelatedEdges: (sia: SiaContext, nodes: NodeContext[], edges: EdgeContext[]) => string[]
  confidence: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
  impactedDomains: DomainId[]
  suggestedActions: string[]
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Get function type from node (handling both direct type and attributes.functionType)
function getNodeFunctionType(node: NodeContext): string {
  const attrs = node.attributes as Record<string, unknown>
  if (attrs?.functionType && typeof attrs.functionType === 'string') {
    return attrs.functionType
  }
  // Map entity types to function types
  const entityToFunction: Record<string, string> = {
    'HUMAN': 'STAKEHOLDER',
    'AI': 'TREATMENT',
    'INFRA': 'SOURCE',
    'ORG': 'STAKEHOLDER',
  }
  return entityToFunction[node.type] || node.type
}

// Check if cartography has nodes of specific function types
function hasNodeOfType(nodes: NodeContext[], ...types: string[]): boolean {
  return nodes.some(n => types.includes(getNodeFunctionType(n)))
}

// Count nodes of specific function types
function countNodesOfType(nodes: NodeContext[], ...types: string[]): number {
  return nodes.filter(n => types.includes(getNodeFunctionType(n))).length
}

// Get all edges connected to nodes of specific types
function getEdgesForNodeTypes(nodes: NodeContext[], edges: EdgeContext[], ...types: string[]): string[] {
  const nodeIds = nodes
    .filter(n => types.includes(getNodeFunctionType(n)))
    .map(n => n.id)
  return edges
    .filter(e => nodeIds.includes(e.sourceId) || nodeIds.includes(e.targetId))
    .map(e => e.id)
}

// Check if there's a path from one node type to another
function hasConnection(nodes: NodeContext[], edges: EdgeContext[], fromType: string, toType: string): boolean {
  const fromIds = nodes.filter(n => getNodeFunctionType(n) === fromType).map(n => n.id)
  const toIds = nodes.filter(n => getNodeFunctionType(n) === toType).map(n => n.id)
  return edges.some(e =>
    (fromIds.includes(e.sourceId) && toIds.includes(e.targetId)) ||
    (fromIds.includes(e.targetId) && toIds.includes(e.sourceId))
  )
}

// Check data types
function hasDataType(sia: SiaContext, ...types: string[]): boolean {
  return sia.dataTypes.some(dt => types.includes(dt))
}

// Check if SIA involves sensitive data categories
function hasSensitiveData(sia: SiaContext): boolean {
  const sensitiveTypes = [
    'biometric', 'health', 'genetic', 'political', 'religious', 'sexual',
    'ethnic', 'criminal', 'financial', 'location', 'behavioral'
  ]
  return sia.dataTypes.some(dt => sensitiveTypes.some(st => dt.toLowerCase().includes(st)))
}

// Check if SIA involves personal identification
function hasIdentificationData(sia: SiaContext): boolean {
  const idTypes = ['identity', 'biometric', 'face', 'fingerprint', 'voice', 'photo', 'video']
  return sia.dataTypes.some(dt => idTypes.some(it => dt.toLowerCase().includes(it)))
}

// =============================================================================
// DETECTION RULES - Organized by FRIA Categories
// =============================================================================

const DETECTION_RULES: DetectionRule[] = [

  // ===========================================================================
  // CATEGORY 1: PRIVACY & DATA PROTECTION (FRIA: Droits personnels)
  // ===========================================================================

  // R001: Any data collection system
  {
    id: 'R001',
    pattern: 'SECURITY_VS_PRIVACY',
    name: 'Système de collecte de données',
    description: 'Le système collecte des données personnelles, créant une tension entre les objectifs du système et la vie privée des personnes.',
    condition: (sia, nodes, edges) => {
      return hasNodeOfType(nodes, 'SOURCE') && edges.length > 0
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'SOURCE'),
    confidence: 'LOW',
    impactedDomains: ['PRIVACY'],
    suggestedActions: ['DATA_MINIMIZATION', 'TRANSPARENCY_NOTICE', 'RETENTION_POLICY'],
  },

  // R002: Data storage with personal data
  {
    id: 'R002',
    pattern: 'EXHAUSTIVITY_VS_OBLIVION',
    name: 'Stockage de données personnelles',
    description: 'Le système stocke des données personnelles, posant la question de la durée de conservation et du droit à l\'oubli.',
    condition: (sia, nodes, edges) => {
      return hasNodeOfType(nodes, 'STORAGE') && edges.length > 0
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'STORAGE'),
    confidence: 'LOW',
    impactedDomains: ['PRIVACY'],
    suggestedActions: ['RETENTION_POLICY', 'DATA_MINIMIZATION', 'ACCESS_RIGHTS'],
  },

  // R003: Sensitive personal data processing
  {
    id: 'R003',
    pattern: 'SECURITY_VS_PRIVACY',
    name: 'Traitement de données sensibles',
    description: 'Le système traite des données personnelles sensibles (santé, biométrie, opinions, etc.).',
    condition: (sia, nodes, edges) => {
      return hasSensitiveData(sia) && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['PRIVACY', 'SECURITY'],
    suggestedActions: ['DATA_MINIMIZATION', 'ENCRYPTION', 'ACCESS_CONTROLS', 'TRANSPARENCY_NOTICE'],
  },

  // R004: Biometric or identification data
  {
    id: 'R004',
    pattern: 'SECURITY_VS_PRIVACY',
    name: 'Données d\'identification',
    description: 'Le système traite des données d\'identification (biométrie, reconnaissance faciale, etc.).',
    condition: (sia, nodes, edges) => {
      return hasIdentificationData(sia) && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['PRIVACY', 'AUTONOMY'],
    suggestedActions: ['CONSENT_MECHANISM', 'TRANSPARENCY_NOTICE', 'DATA_MINIMIZATION'],
  },

  // R005: Multiple data types collected
  {
    id: 'R005',
    pattern: 'PRECISION_VS_MINIMIZATION',
    name: 'Collecte étendue de données',
    description: 'Le système collecte plusieurs types de données, posant la question de la minimisation.',
    condition: (sia, _nodes, edges) => {
      return sia.dataTypes.length >= 2 && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['PRIVACY'],
    suggestedActions: ['DATA_MINIMIZATION', 'PURPOSE_LIMITATION'],
  },

  // R006: Behavioral or location data
  {
    id: 'R006',
    pattern: 'PERSONALIZATION_VS_AUTONOMY',
    name: 'Données comportementales ou de localisation',
    description: 'Le système utilise des données de comportement ou de localisation, permettant le profilage.',
    condition: (sia, _nodes, edges) => {
      return hasDataType(sia, 'behavioral', 'location', 'preferences', 'usage') && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['PRIVACY', 'AUTONOMY'],
    suggestedActions: ['USER_CONTROLS', 'TRANSPARENCY_FACTORS', 'DIVERSE_OPTIONS'],
  },

  // ===========================================================================
  // CATEGORY 2: DECISION & TREATMENT (FRIA: Intégrité physique et morale)
  // ===========================================================================

  // R007: Any decision-making node
  {
    id: 'R007',
    pattern: 'AUTOMATION_VS_RECOURSE',
    name: 'Présence de décision automatisée',
    description: 'Le système inclut un composant de décision, nécessitant des mécanismes de recours.',
    condition: (sia, nodes, edges) => {
      return hasNodeOfType(nodes, 'DECISION') && edges.length > 0
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION'),
    confidence: 'MEDIUM',
    impactedDomains: ['RECOURSE', 'AUTONOMY'],
    suggestedActions: ['APPEAL_PROCESS', 'CONTACT_HUMAN', 'HUMAN_REVIEW_THRESHOLD'],
  },

  // R008: Treatment connected to stakeholder
  {
    id: 'R008',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    name: 'Traitement impactant des personnes',
    description: 'Un traitement algorithmique impacte directement des parties prenantes.',
    condition: (sia, nodes, edges) => {
      return hasConnection(nodes, edges, 'TREATMENT', 'STAKEHOLDER')
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'TREATMENT', 'STAKEHOLDER'),
    confidence: 'MEDIUM',
    impactedDomains: ['TRANSPARENCY', 'RESPONSIBILITY'],
    suggestedActions: ['EXPLAINABILITY_LAYER', 'TRANSPARENCY_FACTORS'],
  },

  // R009: Decision connected to stakeholder
  {
    id: 'R009',
    pattern: 'AUTOMATION_VS_RECOURSE',
    name: 'Décision impactant des personnes',
    description: 'Une décision algorithmique impacte directement des parties prenantes.',
    condition: (sia, nodes, edges) => {
      return hasConnection(nodes, edges, 'DECISION', 'STAKEHOLDER')
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION', 'STAKEHOLDER'),
    confidence: 'HIGH',
    impactedDomains: ['RECOURSE', 'AUTONOMY', 'TRANSPARENCY'],
    suggestedActions: ['APPEAL_PROCESS', 'EXPLAINABILITY_LAYER', 'HUMAN_REVIEW_THRESHOLD'],
  },

  // R010: Action node present
  {
    id: 'R010',
    pattern: 'INNOVATION_VS_PRECAUTION',
    name: 'Actions automatisées',
    description: 'Le système exécute des actions automatisées qui peuvent avoir des conséquences réelles.',
    condition: (sia, nodes, edges) => {
      return hasNodeOfType(nodes, 'ACTION') && edges.length > 0
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'ACTION'),
    confidence: 'MEDIUM',
    impactedDomains: ['SECURITY', 'RESPONSIBILITY'],
    suggestedActions: ['MONITORING', 'INCIDENT_PROCESS', 'OVERRIDE_CAPABILITY'],
  },

  // ===========================================================================
  // CATEGORY 3: EQUITY & NON-DISCRIMINATION (FRIA: Égalité)
  // ===========================================================================

  // R011: Vulnerable populations
  {
    id: 'R011',
    pattern: 'PERFORMANCE_VS_EQUITY',
    name: 'Impact sur populations vulnérables',
    description: 'Le système impacte des populations vulnérables nécessitant une attention particulière à l\'équité.',
    condition: (sia, _nodes, edges) => {
      return sia.hasVulnerable && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['EQUITY', 'RESPONSIBILITY'],
    suggestedActions: ['BIAS_TESTING', 'FAIRNESS_METRICS', 'CASE_BY_CASE', 'ACCOMMODATION'],
  },

  // R012: Large scale system
  {
    id: 'R012',
    pattern: 'STANDARDIZATION_VS_SINGULARITY',
    name: 'Système à grande échelle',
    description: 'Le système opère à grande échelle, risquant d\'appliquer un traitement uniforme inadapté.',
    condition: (sia, _nodes, edges) => {
      return (sia.scale === 'LARGE' || sia.scale === 'VERY_LARGE') && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['EQUITY', 'AUTONOMY'],
    suggestedActions: ['EXCEPTION_PROCESS', 'ACCOMMODATION', 'CASE_BY_CASE'],
  },

  // R013: Automated decisions at scale
  {
    id: 'R013',
    pattern: 'STANDARDIZATION_VS_SINGULARITY',
    name: 'Décision automatique à grande échelle',
    description: 'Des décisions automatiques sont appliquées uniformément à une large population.',
    condition: (sia, nodes, edges) => {
      const isLargeScale = sia.scale === 'LARGE' || sia.scale === 'VERY_LARGE'
      const hasDecision = hasNodeOfType(nodes, 'DECISION')
      return isLargeScale && hasDecision
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION'),
    confidence: 'HIGH',
    impactedDomains: ['EQUITY', 'AUTONOMY', 'RECOURSE'],
    suggestedActions: ['EXCEPTION_PROCESS', 'APPEAL_PROCESS', 'CASE_BY_CASE'],
  },

  // R014: Treatment with potential for discrimination
  {
    id: 'R014',
    pattern: 'PERFORMANCE_VS_EQUITY',
    name: 'Risque de discrimination algorithmique',
    description: 'Le traitement algorithmique peut reproduire ou amplifier des biais discriminatoires.',
    condition: (sia, nodes, edges) => {
      return hasNodeOfType(nodes, 'TREATMENT', 'DECISION') &&
             hasNodeOfType(nodes, 'STAKEHOLDER') &&
             edges.length > 0
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'TREATMENT', 'DECISION'),
    confidence: 'MEDIUM',
    impactedDomains: ['EQUITY'],
    suggestedActions: ['BIAS_TESTING', 'FAIRNESS_METRICS', 'REGULAR_AUDIT'],
  },

  // R015: Personalized treatment
  {
    id: 'R015',
    pattern: 'PERSONALIZATION_VS_EQUALITY',
    name: 'Traitement personnalisé',
    description: 'Le traitement différencié des personnes peut créer des inégalités.',
    condition: (sia, nodes, edges) => {
      const hasPersonalData = sia.dataTypes.length > 0
      const hasTreatment = hasNodeOfType(nodes, 'TREATMENT', 'DECISION')
      const hasStakeholder = hasNodeOfType(nodes, 'STAKEHOLDER')
      return hasPersonalData && hasTreatment && hasStakeholder
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'LOW',
    impactedDomains: ['EQUITY', 'TRANSPARENCY'],
    suggestedActions: ['TRANSPARENCY_NOTICE', 'FAIRNESS_METRICS'],
  },

  // ===========================================================================
  // CATEGORY 4: TRANSPARENCY & EXPLAINABILITY (FRIA: Droit à l'information)
  // ===========================================================================

  // R016: Complex processing chain
  {
    id: 'R016',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    name: 'Chaîne de traitement complexe',
    description: 'La complexité du système rend difficile l\'explication des décisions.',
    condition: (sia, nodes, edges) => {
      return nodes.length >= 3 && edges.length >= 2
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'LOW',
    impactedDomains: ['TRANSPARENCY'],
    suggestedActions: ['EXPLAINABILITY_LAYER', 'TRANSPARENCY_FACTORS', 'DOCUMENTATION'],
  },

  // R017: Multiple treatments
  {
    id: 'R017',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    name: 'Traitements multiples',
    description: 'Plusieurs traitements algorithmiques rendent le système opaque.',
    condition: (sia, nodes, edges) => {
      return countNodesOfType(nodes, 'TREATMENT') >= 2
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'TREATMENT'),
    confidence: 'MEDIUM',
    impactedDomains: ['TRANSPARENCY', 'RESPONSIBILITY'],
    suggestedActions: ['EXPLAINABILITY_LAYER', 'DOCUMENTATION'],
  },

  // R018: Asymmetric information flow
  {
    id: 'R018',
    pattern: 'ACCESSIBILITY_VS_CONTROL',
    name: 'Asymétrie d\'information',
    description: 'L\'organisation détient plus d\'information que les personnes concernées.',
    condition: (sia, nodes, edges) => {
      const hasSource = hasNodeOfType(nodes, 'SOURCE')
      const hasStakeholder = hasNodeOfType(nodes, 'STAKEHOLDER')
      const hasTreatment = hasNodeOfType(nodes, 'TREATMENT', 'DECISION')
      return hasSource && hasStakeholder && hasTreatment
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['TRANSPARENCY', 'AUTONOMY'],
    suggestedActions: ['TRANSPARENCY_NOTICE', 'ACCESS_RIGHTS'],
  },

  // ===========================================================================
  // CATEGORY 5: RECOURSE & REMEDIES (FRIA: Droits procéduraux)
  // ===========================================================================

  // R019: Automatic decision type
  {
    id: 'R019',
    pattern: 'AUTOMATION_VS_RECOURSE',
    name: 'Type de décision automatique',
    description: 'Le SIA est configuré comme un système de décision automatique.',
    condition: (sia, _nodes, edges) => {
      return (sia.decisionType === 'AUTO_DECISION' || sia.decisionType === 'ASSISTED_DECISION') &&
             edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['RECOURSE', 'AUTONOMY'],
    suggestedActions: ['APPEAL_PROCESS', 'CONTACT_HUMAN', 'OVERRIDE_CAPABILITY'],
  },

  // R020: Decision to action without human review
  {
    id: 'R020',
    pattern: 'SPEED_VS_REFLECTION',
    name: 'Décision vers action directe',
    description: 'Une décision algorithmique déclenche directement une action sans revue humaine.',
    condition: (sia, nodes, edges) => {
      return hasConnection(nodes, edges, 'DECISION', 'ACTION')
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION', 'ACTION'),
    confidence: 'HIGH',
    impactedDomains: ['RECOURSE', 'RESPONSIBILITY'],
    suggestedActions: ['HUMAN_REVIEW_THRESHOLD', 'OVERRIDE_CAPABILITY', 'MONITORING'],
  },

  // R021: No stakeholder in loop
  {
    id: 'R021',
    pattern: 'AUTOMATION_VS_RECOURSE',
    name: 'Absence de partie prenante dans la boucle',
    description: 'Le système ne semble pas inclure de point de contact humain.',
    condition: (sia, nodes, edges) => {
      const hasProcessing = hasNodeOfType(nodes, 'TREATMENT', 'DECISION', 'ACTION')
      const hasStakeholder = hasNodeOfType(nodes, 'STAKEHOLDER')
      return hasProcessing && !hasStakeholder && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['RECOURSE', 'RESPONSIBILITY'],
    suggestedActions: ['CONTACT_HUMAN', 'APPEAL_PROCESS'],
  },

  // ===========================================================================
  // CATEGORY 6: AUTONOMY & FREE WILL (FRIA: Liberté)
  // ===========================================================================

  // R022: Recommendation or inference system
  {
    id: 'R022',
    pattern: 'PERSONALIZATION_VS_AUTONOMY',
    name: 'Système de recommandation ou d\'inférence',
    description: 'Le système fait des recommandations ou des inférences qui peuvent influencer les choix.',
    condition: (sia, nodes, edges) => {
      // Check if there's a treatment feeding into stakeholder (recommendation pattern)
      return hasConnection(nodes, edges, 'TREATMENT', 'STAKEHOLDER') ||
             hasConnection(nodes, edges, 'DECISION', 'STAKEHOLDER')
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'TREATMENT', 'STAKEHOLDER'),
    confidence: 'LOW',
    impactedDomains: ['AUTONOMY'],
    suggestedActions: ['USER_CONTROLS', 'DIVERSE_OPTIONS', 'TRANSPARENCY_FACTORS'],
  },

  // R023: Predictive system
  {
    id: 'R023',
    pattern: 'PREDICTION_VS_FREEWILL',
    name: 'Système prédictif',
    description: 'Le système établit des prédictions sur les personnes qui peuvent devenir auto-réalisatrices.',
    condition: (sia, nodes, edges) => {
      const hasTreatment = hasNodeOfType(nodes, 'TREATMENT')
      const hasDecision = hasNodeOfType(nodes, 'DECISION')
      const hasStakeholder = hasNodeOfType(nodes, 'STAKEHOLDER')
      return hasTreatment && hasDecision && hasStakeholder
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'TREATMENT', 'DECISION'),
    confidence: 'MEDIUM',
    impactedDomains: ['AUTONOMY', 'EQUITY'],
    suggestedActions: ['TRANSPARENCY_FACTORS', 'APPEAL_PROCESS', 'OVERRIDE_CAPABILITY'],
  },

  // R024: Paternalistic protection
  {
    id: 'R024',
    pattern: 'WELLBEING_VS_AUTONOMY',
    name: 'Protection paternaliste potentielle',
    description: 'Le système peut imposer des restrictions "pour le bien" des personnes.',
    condition: (sia, nodes, edges) => {
      const hasAction = hasNodeOfType(nodes, 'ACTION')
      const hasStakeholder = hasNodeOfType(nodes, 'STAKEHOLDER')
      const isHealthOrSafety = ['HEALTH', 'SECURITY', 'INSURANCE'].includes(sia.domain)
      return hasAction && hasStakeholder && isHealthOrSafety
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'ACTION'),
    confidence: 'LOW',
    impactedDomains: ['AUTONOMY'],
    suggestedActions: ['USER_CONTROLS', 'TRANSPARENCY_NOTICE'],
  },

  // ===========================================================================
  // CATEGORY 7: RESPONSIBILITY & GOVERNANCE
  // ===========================================================================

  // R025: Multi-actor system
  {
    id: 'R025',
    pattern: 'COLLECTIVE_VS_INDIVIDUAL',
    name: 'Système multi-acteurs',
    description: 'Plusieurs parties prenantes sont impliquées, complexifiant les responsabilités.',
    condition: (sia, nodes, edges) => {
      return countNodesOfType(nodes, 'STAKEHOLDER') >= 2
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'STAKEHOLDER'),
    confidence: 'LOW',
    impactedDomains: ['RESPONSIBILITY'],
    suggestedActions: ['DOCUMENTATION', 'MONITORING'],
  },

  // R026: Source to storage to decision chain
  {
    id: 'R026',
    pattern: 'CONFIDENTIALITY_VS_TRACEABILITY',
    name: 'Chaîne collecte-stockage-décision',
    description: 'Les données collectées sont stockées et utilisées pour des décisions, posant des questions de traçabilité.',
    condition: (sia, nodes, edges) => {
      const hasSource = hasNodeOfType(nodes, 'SOURCE')
      const hasStorage = hasNodeOfType(nodes, 'STORAGE')
      const hasDecision = hasNodeOfType(nodes, 'DECISION', 'TREATMENT')
      return hasSource && hasStorage && hasDecision
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['PRIVACY', 'RECOURSE'],
    suggestedActions: ['APPEAL_PROCESS', 'ACCESS_RIGHTS', 'RETENTION_POLICY'],
  },

  // ===========================================================================
  // CATEGORY 8: DOMAIN-SPECIFIC RULES
  // ===========================================================================

  // R027: Finance domain
  {
    id: 'R027',
    pattern: 'EFFICIENCY_VS_PROTECTION',
    name: 'Système financier',
    description: 'Les décisions financières peuvent exclure certaines populations de services essentiels.',
    condition: (sia, nodes, edges) => {
      const isFinance = sia.domain === 'FINANCE' || sia.domain === 'INSURANCE'
      const hasDecision = hasNodeOfType(nodes, 'DECISION', 'TREATMENT')
      return isFinance && hasDecision
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION', 'TREATMENT'),
    confidence: 'HIGH',
    impactedDomains: ['EQUITY', 'RECOURSE'],
    suggestedActions: ['BIAS_TESTING', 'APPEAL_PROCESS', 'CONTACT_HUMAN', 'EXCEPTION_PROCESS'],
  },

  // R028: HR/Employment domain
  {
    id: 'R028',
    pattern: 'PERFORMANCE_VS_EQUITY',
    name: 'Système RH/Emploi',
    description: 'Les décisions RH peuvent reproduire des biais historiques de discrimination.',
    condition: (sia, nodes, edges) => {
      const isHR = sia.domain === 'HR' || sia.domain === 'EMPLOYMENT'
      const hasDecision = hasNodeOfType(nodes, 'DECISION', 'TREATMENT')
      return isHR && hasDecision
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION', 'TREATMENT'),
    confidence: 'HIGH',
    impactedDomains: ['EQUITY', 'PRIVACY'],
    suggestedActions: ['BIAS_TESTING', 'FAIRNESS_METRICS', 'REGULAR_AUDIT', 'HUMAN_REVIEW_THRESHOLD'],
  },

  // R029: Justice/Legal domain
  {
    id: 'R029',
    pattern: 'PREDICTION_VS_FREEWILL',
    name: 'Système judiciaire',
    description: 'Les prédictions judiciaires risquent de condamner sur le passé et non sur les faits.',
    condition: (sia, nodes, edges) => {
      const isJustice = sia.domain === 'JUSTICE' || sia.domain === 'LEGAL'
      return isJustice && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'VERY_HIGH',
    impactedDomains: ['EQUITY', 'AUTONOMY', 'RECOURSE'],
    suggestedActions: ['HUMAN_REVIEW_THRESHOLD', 'BIAS_TESTING', 'APPEAL_PROCESS', 'TRANSPARENCY_FACTORS'],
  },

  // R030: Education domain
  {
    id: 'R030',
    pattern: 'STANDARDIZATION_VS_SINGULARITY',
    name: 'Système éducatif',
    description: 'Les systèmes éducatifs doivent s\'adapter à la diversité des apprenants.',
    condition: (sia, nodes, edges) => {
      const isEducation = sia.domain === 'EDUCATION'
      return isEducation && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['EQUITY', 'AUTONOMY'],
    suggestedActions: ['ACCOMMODATION', 'CASE_BY_CASE', 'USER_CONTROLS'],
  },

  // R031: Commerce/Marketing domain
  {
    id: 'R031',
    pattern: 'PERSONALIZATION_VS_AUTONOMY',
    name: 'Système commercial/marketing',
    description: 'Les techniques de personnalisation commerciale peuvent manipuler les choix.',
    condition: (sia, nodes, edges) => {
      const isCommerce = sia.domain === 'COMMERCE' || sia.domain === 'MARKETING'
      return isCommerce && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['AUTONOMY', 'PRIVACY'],
    suggestedActions: ['TRANSPARENCY_FACTORS', 'USER_CONTROLS', 'DIVERSE_OPTIONS'],
  },

  // R032: Health domain
  {
    id: 'R032',
    pattern: 'INNOVATION_VS_PRECAUTION',
    name: 'Système de santé',
    description: 'Les systèmes de santé nécessitent une prudence particulière et des garanties fortes.',
    condition: (sia, nodes, edges) => {
      const isHealth = sia.domain === 'HEALTH'
      return isHealth && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['SECURITY', 'PRIVACY', 'RESPONSIBILITY'],
    suggestedActions: ['HUMAN_REVIEW_THRESHOLD', 'MONITORING', 'INCIDENT_PROCESS', 'STAGED_ROLLOUT'],
  },

  // R033: Public administration domain
  {
    id: 'R033',
    pattern: 'COLLECTIVE_VS_INDIVIDUAL',
    name: 'Système administratif public',
    description: 'Les décisions administratives impactent l\'accès aux droits et services publics.',
    condition: (sia, nodes, edges) => {
      const isAdmin = sia.domain === 'ADMINISTRATION' || sia.domain === 'PUBLIC_SERVICE'
      return isAdmin && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['EQUITY', 'RECOURSE', 'TRANSPARENCY'],
    suggestedActions: ['APPEAL_PROCESS', 'TRANSPARENCY_NOTICE', 'CONTACT_HUMAN', 'EXCEPTION_PROCESS'],
  },

  // ===========================================================================
  // CATEGORY 9: STRUCTURAL PATTERNS (based on graph topology)
  // ===========================================================================

  // R034: Linear processing chain
  {
    id: 'R034',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    name: 'Chaîne de traitement linéaire',
    description: 'Les données traversent plusieurs étapes de traitement de manière séquentielle.',
    condition: (sia, nodes, edges) => {
      // Linear chain: more edges than nodes - 1 means cycles or parallel paths
      return nodes.length >= 3 && edges.length >= nodes.length - 1
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'LOW',
    impactedDomains: ['TRANSPARENCY'],
    suggestedActions: ['DOCUMENTATION', 'EXPLAINABILITY_LAYER'],
  },

  // R035: Hub pattern (one node with many connections)
  {
    id: 'R035',
    pattern: 'SECURITY_VS_PRIVACY',
    name: 'Point de centralisation des données',
    description: 'Un composant centralise de nombreuses connexions, créant un point de vulnérabilité.',
    condition: (sia, nodes, edges) => {
      // Check if any node has more than 3 connections
      const connectionCount = new Map<string, number>()
      edges.forEach(e => {
        connectionCount.set(e.sourceId, (connectionCount.get(e.sourceId) || 0) + 1)
        connectionCount.set(e.targetId, (connectionCount.get(e.targetId) || 0) + 1)
      })
      return Array.from(connectionCount.values()).some(count => count >= 3)
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['SECURITY', 'PRIVACY'],
    suggestedActions: ['ACCESS_CONTROLS', 'MONITORING', 'ENCRYPTION'],
  },

  // R036: Storage with multiple inputs
  {
    id: 'R036',
    pattern: 'PRECISION_VS_MINIMIZATION',
    name: 'Agrégation de données multiples',
    description: 'Le stockage reçoit des données de sources multiples, permettant le croisement.',
    condition: (sia, nodes, edges) => {
      const storageIds = nodes.filter(n => getNodeFunctionType(n) === 'STORAGE').map(n => n.id)
      const inputsToStorage = edges.filter(e => storageIds.includes(e.targetId))
      return inputsToStorage.length >= 2
    },
    getRelatedEdges: (sia, nodes, edges) => {
      const storageIds = nodes.filter(n => getNodeFunctionType(n) === 'STORAGE').map(n => n.id)
      return edges.filter(e => storageIds.includes(e.targetId)).map(e => e.id)
    },
    confidence: 'MEDIUM',
    impactedDomains: ['PRIVACY'],
    suggestedActions: ['DATA_MINIMIZATION', 'PURPOSE_LIMITATION', 'ACCESS_CONTROLS'],
  },

  // ===========================================================================
  // CATEGORY 10: EDGE PROPERTY RULES (when properties are set)
  // ===========================================================================

  // R037: High opacity edges
  {
    id: 'R037',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    name: 'Flux opaque identifié',
    description: 'Un flux de données a été marqué comme opaque.',
    condition: (sia, nodes, edges) => {
      return edges.some(e => (e.opacity ?? 0) >= 3)
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter(e => (e.opacity ?? 0) >= 3).map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['TRANSPARENCY', 'RECOURSE'],
    suggestedActions: ['EXPLAINABILITY_LAYER', 'TRANSPARENCY_FACTORS'],
  },

  // R038: High asymmetry edges
  {
    id: 'R038',
    pattern: 'ACCESSIBILITY_VS_CONTROL',
    name: 'Asymétrie d\'information forte',
    description: 'Un flux présente une forte asymétrie d\'information entre les parties.',
    condition: (sia, nodes, edges) => {
      return edges.some(e => (e.asymmetry ?? 0) >= 3)
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter(e => (e.asymmetry ?? 0) >= 3).map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['TRANSPARENCY', 'AUTONOMY'],
    suggestedActions: ['TRANSPARENCY_NOTICE', 'ACCESS_RIGHTS'],
  },

  // R039: High irreversibility edges
  {
    id: 'R039',
    pattern: 'SPEED_VS_REFLECTION',
    name: 'Décision à forte irréversibilité',
    description: 'Des décisions ont des conséquences difficilement réversibles.',
    condition: (sia, nodes, edges) => {
      return edges.some(e => (e.irreversibility ?? 0) >= 3)
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter(e => (e.irreversibility ?? 0) >= 3).map(e => e.id),
    confidence: 'HIGH',
    impactedDomains: ['RECOURSE', 'RESPONSIBILITY'],
    suggestedActions: ['HUMAN_REVIEW_THRESHOLD', 'APPEAL_PROCESS', 'OVERRIDE_CAPABILITY'],
  },

  // R040: High scalability edges
  {
    id: 'R040',
    pattern: 'STANDARDIZATION_VS_SINGULARITY',
    name: 'Forte scalabilité identifiée',
    description: 'Un flux a une forte scalabilité, multipliant l\'impact potentiel.',
    condition: (sia, nodes, edges) => {
      return edges.some(e => (e.scalability ?? 0) >= 3)
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter(e => (e.scalability ?? 0) >= 3).map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['EQUITY'],
    suggestedActions: ['EXCEPTION_PROCESS', 'MONITORING', 'STAGED_ROLLOUT'],
  },

  // ===========================================================================
  // CATEGORY 11: BASE RULES (ensure detection for any non-trivial system)
  // ===========================================================================

  // R041: Base rule - Any system with stakeholders
  {
    id: 'R041',
    pattern: 'OTHER',
    name: 'Système impactant des personnes',
    description: 'Ce système algorithmique impacte des personnes et doit être analysé éthiquement.',
    condition: (sia, nodes, edges) => {
      const hasStakeholder = hasNodeOfType(nodes, 'STAKEHOLDER')
      const hasAnyProcessing = hasNodeOfType(nodes, 'TREATMENT', 'DECISION', 'ACTION')
      return hasStakeholder && hasAnyProcessing && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'LOW',
    impactedDomains: ['RESPONSIBILITY'],
    suggestedActions: ['DOCUMENTATION', 'TRANSPARENCY_NOTICE'],
  },

  // R042: Base rule - Any data processing system
  {
    id: 'R042',
    pattern: 'OTHER',
    name: 'Système de traitement de données',
    description: 'Ce système traite des données et nécessite une gouvernance appropriée.',
    condition: (sia, nodes, edges) => {
      const hasSource = hasNodeOfType(nodes, 'SOURCE')
      const hasTreatment = hasNodeOfType(nodes, 'TREATMENT')
      return hasSource && hasTreatment && edges.length > 0
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'LOW',
    impactedDomains: ['RESPONSIBILITY'],
    suggestedActions: ['DOCUMENTATION', 'MONITORING'],
  },

  // R043: Fallback - Any connected graph with 2+ nodes
  {
    id: 'R043',
    pattern: 'OTHER',
    name: 'Système algorithmique connecté',
    description: 'Un système algorithmique connecté doit faire l\'objet d\'une réflexion éthique.',
    condition: (sia, nodes, edges) => {
      return nodes.length >= 2 && edges.length >= 1
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'LOW',
    impactedDomains: [],
    suggestedActions: ['DOCUMENTATION'],
  },

  // ===========================================================================
  // CATEGORY 12: CIRCLE 2 - ORGANISATION (Maîtrise, Responsabilité, Souveraineté)
  // ===========================================================================

  // R044: External AI provider (sovereignty concern)
  {
    id: 'R044',
    pattern: 'SOVEREIGNTY_VS_PERFORMANCE',
    name: 'Fournisseur IA externe',
    description: 'Le système utilise des services IA externes, créant une dépendance et des questions de souveraineté des données.',
    condition: (sia, nodes, edges) => {
      // Check for AI nodes with external provider attributes
      return nodes.some(n => {
        const attrs = n.attributes as Record<string, unknown>
        const isAI = getNodeFunctionType(n) === 'DECISION' || getNodeFunctionType(n) === 'TREATMENT'
        const isExternal = attrs?.isExternal === true || attrs?.externalProvider
        return isAI && isExternal
      })
    },
    getRelatedEdges: (sia, nodes, edges) => {
      const externalIds = nodes
        .filter(n => {
          const attrs = n.attributes as Record<string, unknown>
          return attrs?.isExternal === true || attrs?.externalProvider
        })
        .map(n => n.id)
      return edges
        .filter(e => externalIds.includes(e.sourceId) || externalIds.includes(e.targetId))
        .map(e => e.id)
    },
    confidence: 'MEDIUM',
    impactedDomains: ['SOVEREIGNTY', 'CONTROL'],
    suggestedActions: ['VENDOR_ASSESSMENT', 'DATA_LOCALIZATION'],
  },

  // R045: Complex AI system (control concern)
  {
    id: 'R045',
    pattern: 'CONTROL_VS_INNOVATION',
    name: 'Système IA complexe',
    description: 'Le système utilise des composants IA avancés qui peuvent être difficiles à maîtriser.',
    condition: (sia, nodes, edges) => {
      const aiNodes = nodes.filter(n => {
        const attrs = n.attributes as Record<string, unknown>
        return getNodeFunctionType(n) === 'DECISION' &&
               (attrs?.opacity === 'opaque' || n.type === 'AI')
      })
      return aiNodes.length > 0
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION'),
    confidence: 'MEDIUM',
    impactedDomains: ['CONTROL', 'TRANSPARENCY'],
    suggestedActions: ['TECHNICAL_DOCUMENTATION', 'COMPETENCY_PLAN', 'TRAINING'],
  },

  // R046: Rapid deployment without governance
  {
    id: 'R046',
    pattern: 'RESPONSIBILITY_VS_AGILITY',
    name: 'Déploiement rapide sans gouvernance',
    description: 'Le système semble manquer de points de validation humaine clairs pour assurer la gouvernance.',
    condition: (sia, nodes, edges) => {
      const hasDecision = hasNodeOfType(nodes, 'DECISION')
      const hasAction = hasNodeOfType(nodes, 'ACTION')
      const humanStakeholders = nodes.filter(n => {
        const attrs = n.attributes as Record<string, unknown>
        return getNodeFunctionType(n) === 'STAKEHOLDER' && attrs?.entityType === 'HUMAN'
      })
      // Concern if decisions lead to actions but few human checkpoints
      return hasDecision && hasAction && humanStakeholders.length < 2
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'DECISION', 'ACTION'),
    confidence: 'LOW',
    impactedDomains: ['RESPONSIBILITY', 'CONTROL'],
    suggestedActions: ['GOVERNANCE_RACI', 'ESCALATION_CHAIN', 'EXECUTIVE_COMMITMENT'],
  },

  // ===========================================================================
  // CATEGORY 13: CIRCLE 3 - SOCIÉTÉ (Durabilité, Loyauté, Équilibre sociétal)
  // ===========================================================================

  // R047: Large scale AI with societal impact
  {
    id: 'R047',
    pattern: 'BALANCE_VS_EFFICIENCY',
    name: 'Impact sociétal à grande échelle',
    description: 'Le système opère à grande échelle avec de l\'IA, pouvant créer des effets systémiques sur la société.',
    condition: (sia, nodes, edges) => {
      const isLargeScale = sia.scale === 'LARGE' || sia.scale === 'VERY_LARGE' ||
                          sia.scale === 'NATIONAL' || sia.scale === 'INTERNATIONAL'
      const hasAI = hasNodeOfType(nodes, 'DECISION')
      return isLargeScale && hasAI
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['BALANCE', 'EQUITY'],
    suggestedActions: ['SYSTEMIC_IMPACT_ASSESSMENT', 'EMPLOYMENT_TRANSITION', 'SECTOR_COORDINATION'],
  },

  // R048: Multiple treatments (sustainability concern)
  {
    id: 'R048',
    pattern: 'PERFORMANCE_VS_SUSTAINABILITY',
    name: 'Chaîne de traitement intensive',
    description: 'Le système comporte plusieurs traitements algorithmiques, posant la question de l\'empreinte environnementale.',
    condition: (sia, nodes, edges) => {
      const treatmentCount = countNodesOfType(nodes, 'TREATMENT', 'DECISION')
      return treatmentCount >= 3
    },
    getRelatedEdges: (sia, nodes, edges) => getEdgesForNodeTypes(nodes, edges, 'TREATMENT', 'DECISION'),
    confidence: 'LOW',
    impactedDomains: ['SUSTAINABILITY'],
    suggestedActions: ['CARBON_FOOTPRINT', 'GREEN_AI'],
  },

  // R049: Commercial system with personalization
  {
    id: 'R049',
    pattern: 'LOYALTY_VS_PROFIT',
    name: 'Système commercial avec personnalisation',
    description: 'Le système commercial personnalisé peut créer des tensions entre profit et loyauté envers les utilisateurs.',
    condition: (sia, nodes, edges) => {
      const isCommercial = sia.domain === 'COMMERCE' || sia.domain === 'MARKETING' || sia.domain === 'MEDIA'
      const hasPersonalization = hasNodeOfType(nodes, 'TREATMENT', 'DECISION') &&
                                 hasNodeOfType(nodes, 'STAKEHOLDER')
      return isCommercial && hasPersonalization
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['LOYALTY', 'TRANSPARENCY'],
    suggestedActions: ['STAKEHOLDER_COMMUNICATION', 'FAIR_VALUE_SHARING', 'TRANSPARENCY_NOTICE'],
  },

  // R050: Resource-intensive with equity concerns
  {
    id: 'R050',
    pattern: 'SUSTAINABILITY_VS_ACCESSIBILITY',
    name: 'Système intensif avec enjeu d\'accessibilité',
    description: 'Les mesures de sobriété numérique pourraient limiter l\'accès pour certaines populations.',
    condition: (sia, nodes, edges) => {
      const hasVulnerable = sia.hasVulnerable
      const isLargeScale = sia.scale === 'LARGE' || sia.scale === 'VERY_LARGE' ||
                          sia.scale === 'NATIONAL' || sia.scale === 'INTERNATIONAL'
      const hasTreatment = hasNodeOfType(nodes, 'TREATMENT', 'DECISION')
      return hasVulnerable && isLargeScale && hasTreatment
    },
    getRelatedEdges: (_sia, _nodes, edges) => edges.map(e => e.id),
    confidence: 'LOW',
    impactedDomains: ['SUSTAINABILITY', 'EQUITY'],
    suggestedActions: ['GREEN_AI', 'EXCEPTION_PROCESS', 'ACCOMMODATION'],
  },
]

/**
 * Exécute toutes les règles de détection et retourne les tensions détectées
 */
export function detectTensions(
  sia: SiaContext,
  nodes: NodeContext[],
  edges: EdgeContext[]
): DetectedTension[] {
  const detectedTensions: DetectedTension[] = []

  // Debug logging
  console.log('[TensionDetection] Starting detection with:', {
    siaId: sia.id,
    domain: sia.domain,
    decisionType: sia.decisionType,
    hasVulnerable: sia.hasVulnerable,
    scale: sia.scale,
    dataTypes: sia.dataTypes,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodeTypes: nodes.map(n => ({ id: n.id, type: n.type, functionType: getNodeFunctionType(n) })),
  })

  for (const rule of DETECTION_RULES) {
    try {
      const matches = rule.condition(sia, nodes, edges)
      if (matches) {
        console.log(`[TensionDetection] Rule ${rule.id} (${rule.name}) triggered`)
        detectedTensions.push({
          pattern: rule.pattern,
          ruleId: rule.id,
          ruleName: rule.name,
          description: rule.description,
          confidence: rule.confidence,
          impactedDomains: rule.impactedDomains,
          relatedEdgeIds: rule.getRelatedEdges(sia, nodes, edges),
          suggestedActions: rule.suggestedActions,
        })
      }
    } catch (error) {
      console.error(`[TensionDetection] Error executing rule ${rule.id}:`, error)
    }
  }

  console.log(`[TensionDetection] Total tensions detected before dedup: ${detectedTensions.length}`)

  // Dédupliquer par pattern (garder la confiance la plus élevée)
  const byPattern = new Map<TensionPatternId, DetectedTension>()
  const confidenceOrder = ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW']

  for (const tension of detectedTensions) {
    const existing = byPattern.get(tension.pattern)
    if (!existing) {
      byPattern.set(tension.pattern, tension)
    } else {
      const existingIndex = confidenceOrder.indexOf(existing.confidence)
      const newIndex = confidenceOrder.indexOf(tension.confidence)
      if (newIndex < existingIndex) {
        // Fusionner les edges et actions
        const merged: DetectedTension = {
          ...tension,
          relatedEdgeIds: Array.from(new Set([...existing.relatedEdgeIds, ...tension.relatedEdgeIds])),
          suggestedActions: Array.from(new Set([...existing.suggestedActions, ...tension.suggestedActions])),
        }
        byPattern.set(tension.pattern, merged)
      } else {
        // Keep existing but merge edges and actions
        const merged: DetectedTension = {
          ...existing,
          relatedEdgeIds: Array.from(new Set([...existing.relatedEdgeIds, ...tension.relatedEdgeIds])),
          suggestedActions: Array.from(new Set([...existing.suggestedActions, ...tension.suggestedActions])),
        }
        byPattern.set(tension.pattern, merged)
      }
    }
  }

  const result = Array.from(byPattern.values())
  console.log(`[TensionDetection] Final tensions after dedup: ${result.length}`, result.map(t => t.pattern))

  return result
}

/**
 * Retourne toutes les règles de détection disponibles
 */
export function getDetectionRules(): Omit<DetectionRule, 'condition' | 'getRelatedEdges'>[] {
  return DETECTION_RULES.map((rule) => ({
    id: rule.id,
    pattern: rule.pattern,
    name: rule.name,
    description: rule.description,
    confidence: rule.confidence,
    impactedDomains: rule.impactedDomains,
    suggestedActions: rule.suggestedActions,
  }))
}
