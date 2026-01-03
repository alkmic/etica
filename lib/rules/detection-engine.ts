// lib/rules/detection-engine.ts
// Moteur principal de détection des dilemmes

import {
  DetectionRule,
  DetectedDilemma,
  EvaluationContext,
  SiaContext,
  NodeContext,
  EdgeContext,
  RuleFamily,
  Sensitivity,
  AutomationLevel,
  FlowNature,
  FlowIntent,
  DataCategory,
} from './types'
import { STRUCTURAL_RULES } from './structural-rules'
import { DATA_RULES } from './data-rules'
import { DEPENDENCY_RULES } from './dependency-rules'
import { CONTEXTUAL_RULES } from './contextual-rules'
import { GOVERNANCE_RULES } from './governance-rules'

// Toutes les règles
export const ALL_RULES: DetectionRule[] = [
  ...STRUCTURAL_RULES,
  ...DATA_RULES,
  ...DEPENDENCY_RULES,
  ...CONTEXTUAL_RULES,
  ...GOVERNANCE_RULES,
]

/**
 * Ordre des niveaux de sensibilité
 */
const SENSITIVITY_LEVELS: Sensitivity[] = ['STANDARD', 'SENSITIVE', 'HIGHLY_SENSITIVE']

/**
 * Vérifie si une règle s'applique au contexte donné
 */
function evaluateRule(rule: DetectionRule, ctx: EvaluationContext): boolean {
  // Vérifier les conditions SIA
  if (rule.siaConditions) {
    for (const cond of rule.siaConditions) {
      if (cond.sectors && !cond.sectors.includes(ctx.sia.sector)) {
        return false
      }
      if (cond.decisionTypes && !cond.decisionTypes.includes(ctx.sia.decisionType)) {
        return false
      }
      if (cond.hasVulnerable !== undefined && ctx.sia.hasVulnerable !== cond.hasVulnerable) {
        return false
      }
      if (cond.hasExternalAI !== undefined && ctx.sia.hasExternalAI !== cond.hasExternalAI) {
        return false
      }
      if (cond.hasExternalInfra !== undefined && ctx.sia.hasExternalInfra !== cond.hasExternalInfra) {
        return false
      }
    }
  }

  // Vérifier les conditions sur les nœuds
  if (rule.nodeConditions) {
    for (const cond of rule.nodeConditions) {
      const matchingNodes = ctx.nodes.filter(n => {
        if (cond.type) {
          const types = Array.isArray(cond.type) ? cond.type : [cond.type]
          if (!types.includes(n.type)) return false
        }
        if (cond.isExternal !== undefined && n.isExternal !== cond.isExternal) {
          return false
        }
        if (cond.isOpaque !== undefined && n.isOpaque !== cond.isOpaque) {
          return false
        }
        if (cond.hasFallback !== undefined && n.hasFallback !== cond.hasFallback) {
          return false
        }
        return true
      })
      if (matchingNodes.length === 0) return false
    }
  }

  // Vérifier les conditions sur les flux
  if (rule.edgeConditions) {
    for (const cond of rule.edgeConditions) {
      const matchingEdges = ctx.edges.filter(e => {
        if (cond.nature) {
          const natures = Array.isArray(cond.nature) ? cond.nature : [cond.nature]
          if (!natures.includes(e.nature)) return false
        }
        if (cond.intent) {
          const intents = Array.isArray(cond.intent) ? cond.intent : [cond.intent]
          if (!intents.includes(e.intent)) return false
        }
        if (cond.automation) {
          const autos = Array.isArray(cond.automation) ? cond.automation : [cond.automation]
          if (!autos.includes(e.automation)) return false
        }
        if (cond.sensitivityMin) {
          const minIndex = SENSITIVITY_LEVELS.indexOf(cond.sensitivityMin)
          const edgeIndex = SENSITIVITY_LEVELS.indexOf(e.sensitivity)
          if (edgeIndex < minIndex) return false
        }
        if (cond.isReversible !== undefined && e.isReversible !== cond.isReversible) {
          return false
        }
        if (cond.dataCategories) {
          const hasMatchingCategory = cond.dataCategories.some(cat =>
            e.dataCategories.includes(cat)
          )
          if (!hasMatchingCategory) return false
        }
        return true
      })
      if (matchingEdges.length === 0) return false
    }
  }

  // Vérifier les conditions sur le graphe
  if (rule.graphConditions) {
    for (const cond of rule.graphConditions) {
      if (cond.hasClosedLoop !== undefined) {
        const hasLoop = detectClosedLoop(ctx)
        if (cond.hasClosedLoop !== hasLoop) return false
      }
      if (cond.hasConcentration !== undefined) {
        const hasConcentration = detectConcentration(ctx)
        if (cond.hasConcentration !== hasConcentration) return false
      }
      if (cond.hasCascade !== undefined) {
        const hasCascade = detectCascade(ctx, cond.maxDepth || 3)
        if (cond.hasCascade !== hasCascade) return false
      }
    }
  }

  // Vérifier la logique personnalisée
  if (rule.customCheck) {
    if (!rule.customCheck(ctx)) return false
  }

  return true
}

/**
 * Détecte une boucle fermée (sans intervention humaine)
 */
function detectClosedLoop(ctx: EvaluationContext): boolean {
  // Une boucle fermée existe si on peut aller d'un nœud à lui-même
  // sans passer par un nœud HUMAN avec un flux CONTROL
  const visited = new Set<string>()

  function dfs(nodeId: string, startId: string, depth: number): boolean {
    if (depth > 0 && nodeId === startId) return true
    if (visited.has(nodeId) || depth > 10) return false

    const node = ctx.nodes.find(n => n.id === nodeId)
    if (node?.type === 'HUMAN') {
      // Vérifie si c'est un flux de contrôle
      const incomingControlEdge = ctx.edges.find(e =>
        e.targetId === nodeId && e.nature === 'CONTROL'
      )
      if (incomingControlEdge) return false
    }

    visited.add(nodeId)
    const outgoingEdges = ctx.edges.filter(e => e.sourceId === nodeId)

    for (const edge of outgoingEdges) {
      if (dfs(edge.targetId, startId, depth + 1)) {
        visited.delete(nodeId)
        return true
      }
    }

    visited.delete(nodeId)
    return false
  }

  // Vérifier à partir de chaque nœud AI
  for (const node of ctx.nodes.filter(n => n.type === 'AI')) {
    if (dfs(node.id, node.id, 0)) return true
  }

  return false
}

/**
 * Détecte une concentration (nœud avec beaucoup de connexions)
 */
function detectConcentration(ctx: EvaluationContext): boolean {
  const connectionCounts = new Map<string, number>()

  for (const edge of ctx.edges) {
    connectionCounts.set(edge.sourceId, (connectionCounts.get(edge.sourceId) || 0) + 1)
    connectionCounts.set(edge.targetId, (connectionCounts.get(edge.targetId) || 0) + 1)
  }

  // Un nœud avec plus de 5 connexions est considéré comme une concentration
  const values = Array.from(connectionCounts.values())
  for (const count of values) {
    if (count >= 5) return true
  }

  return false
}

/**
 * Détecte une cascade décisionnelle
 */
function detectCascade(ctx: EvaluationContext, maxDepth: number): boolean {
  // Trouve les nœuds de décision
  const decisionEdges = ctx.edges.filter(e =>
    e.nature === 'DECISION' || e.nature === 'RECOMMENDATION'
  )

  if (decisionEdges.length < 2) return false

  // Vérifie si les décisions s'enchaînent
  function countCascadeDepth(startNodeId: string, depth: number): number {
    if (depth > 10) return depth

    const outgoingDecisions = decisionEdges.filter(e => e.sourceId === startNodeId)
    if (outgoingDecisions.length === 0) return depth

    let maxCascade = depth
    for (const edge of outgoingDecisions) {
      const cascadeDepth = countCascadeDepth(edge.targetId, depth + 1)
      maxCascade = Math.max(maxCascade, cascadeDepth)
    }

    return maxCascade
  }

  // Vérifier à partir de chaque source de décision
  for (const edge of decisionEdges) {
    if (countCascadeDepth(edge.targetId, 1) >= maxDepth) return true
  }

  return false
}

/**
 * Calcule la sévérité finale d'un dilemme
 */
function calculateSeverity(
  rule: DetectionRule,
  ctx: EvaluationContext
): { severity: number; aggravating: string[]; mitigating: string[] } {
  let severity = rule.severityBase
  const aggravating: string[] = []
  const mitigating: string[] = []

  // Facteurs aggravants liés au contexte
  if (ctx.sia.hasVulnerable) {
    aggravating.push('Populations vulnérables concernées')
    severity += 0.5
  }
  if (ctx.sia.userScale === 'LARGE' || ctx.sia.userScale === 'VERY_LARGE') {
    aggravating.push('Grande échelle de déploiement')
    severity += 0.5
  }
  if (ctx.sia.decisionType === 'AUTO_DECISION') {
    aggravating.push('Décision entièrement automatique')
    severity += 0.5
  }

  // Plafonner à 5
  severity = Math.min(5, Math.round(severity * 10) / 10)

  return { severity, aggravating, mitigating }
}

/**
 * Trouve les nœuds affectés par une règle
 */
function findAffectedNodeIds(rule: DetectionRule, ctx: EvaluationContext): string[] {
  if (!rule.nodeConditions) return []

  const nodeIds: string[] = []
  for (const cond of rule.nodeConditions) {
    const matchingNodes = ctx.nodes.filter(n => {
      if (cond.type) {
        const types = Array.isArray(cond.type) ? cond.type : [cond.type]
        return types.includes(n.type)
      }
      return true
    })
    nodeIds.push(...matchingNodes.map(n => n.id))
  }

  return Array.from(new Set(nodeIds))
}

/**
 * Trouve les flux affectés par une règle
 */
function findAffectedEdgeIds(rule: DetectionRule, ctx: EvaluationContext): string[] {
  if (!rule.edgeConditions) return []

  const edgeIds: string[] = []
  for (const cond of rule.edgeConditions) {
    const matchingEdges = ctx.edges.filter(e => {
      if (cond.nature) {
        const natures = Array.isArray(cond.nature) ? cond.nature : [cond.nature]
        return natures.includes(e.nature)
      }
      return true
    })
    edgeIds.push(...matchingEdges.map(e => e.id))
  }

  return Array.from(new Set(edgeIds))
}

/**
 * Détecte tous les dilemmes dans le contexte donné
 */
export function detectDilemmas(
  sia: SiaContext,
  nodes: NodeContext[],
  edges: EdgeContext[],
  maxResults: number = 50
): DetectedDilemma[] {
  const ctx: EvaluationContext = { sia, nodes, edges }
  const dilemmas: DetectedDilemma[] = []

  for (const rule of ALL_RULES) {
    if (evaluateRule(rule, ctx)) {
      const affectedNodeIds = findAffectedNodeIds(rule, ctx)
      const affectedEdgeIds = findAffectedEdgeIds(rule, ctx)

      const { severity, aggravating, mitigating } = calculateSeverity(rule, ctx)

      dilemmas.push({
        ruleId: rule.id,
        ruleName: rule.nameFr,
        ruleFamily: rule.family,
        domainA: rule.produces.domainA,
        domainB: rule.produces.domainB,
        formulation: rule.produces.formulationTemplate,
        mechanism: rule.produces.mechanismTemplate,
        affectedNodeIds,
        affectedEdgeIds,
        severity,
        aggravatingFactors: [...rule.aggravatingFactors, ...aggravating],
        mitigatingFactors: [...rule.mitigatingFactors, ...mitigating],
        questionsToConsider: rule.questionsToConsider,
        stakeholdersToConsult: rule.stakeholdersToConsult,
        acceptablePatterns: rule.acceptablePatterns,
        requiredEvidences: rule.requiredEvidences,
        detectionReason: `Règle ${rule.id} déclenchée`,
      })

      if (dilemmas.length >= maxResults) break
    }
  }

  return dilemmas
}

/**
 * Obtient les règles par famille
 */
export function getRulesByFamily(family: RuleFamily): DetectionRule[] {
  return ALL_RULES.filter(r => r.family === family)
}

/**
 * Obtient une règle par son ID
 */
export function getRuleById(id: string): DetectionRule | undefined {
  return ALL_RULES.find(r => r.id === id)
}

/**
 * Statistiques sur les règles
 */
export function getRulesStats(): Record<RuleFamily, number> {
  const stats: Record<string, number> = {
    STRUCTURAL: 0,
    DATA: 0,
    DEPENDENCY: 0,
    CONTEXTUAL: 0,
    GOVERNANCE: 0,
  }
  for (const rule of ALL_RULES) {
    stats[rule.family] = (stats[rule.family] || 0) + 1
  }
  return stats as Record<RuleFamily, number>
}

/**
 * Construit un contexte d'évaluation à partir des données brutes
 */
export function buildEvaluationContext(
  sia: {
    id: string
    name: string
    sector: string
    decisionType: string
    hasVulnerable: boolean
    userScale: string
    dataTypes: string[]
    populations: string[]
    hasExternalAI?: boolean
    hasExternalInfra?: boolean
    externalProviders?: string[]
    misuseScenarios?: string[]
    nextReviewDate?: Date | null
  },
  nodes: Array<{
    id: string
    type: string
    subtype?: string | null
    label: string
    attributes?: Record<string, unknown>
    reinforcesDomains?: string[]
    affectsDomains?: string[]
  }>,
  edges: Array<{
    id: string
    sourceId: string
    targetId: string
    nature: string
    intent?: string
    dataCategories?: string[]
    sensitivity?: string
    automation?: string
    isReversible?: boolean
  }>
): EvaluationContext {
  // Créer une map des types de nœuds pour les flux
  const nodeTypeMap = new Map<string, string>()
  for (const node of nodes) {
    nodeTypeMap.set(node.id, node.type)
  }

  return {
    sia: {
      id: sia.id,
      name: sia.name,
      sector: sia.sector as SiaContext['sector'],
      decisionType: sia.decisionType,
      hasVulnerable: sia.hasVulnerable,
      userScale: sia.userScale as SiaContext['userScale'],
      dataTypes: sia.dataTypes,
      populations: sia.populations,
      hasExternalAI: sia.hasExternalAI,
      hasExternalInfra: sia.hasExternalInfra,
      externalProviders: sia.externalProviders,
      misuseScenarios: sia.misuseScenarios,
      nextReviewDate: sia.nextReviewDate,
    },
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.type as NodeContext['type'],
      subtype: n.subtype || null,
      label: n.label,
      attributes: n.attributes || {},
      reinforcesDomains: (n.reinforcesDomains || []) as NodeContext['reinforcesDomains'],
      affectsDomains: (n.affectsDomains || []) as NodeContext['affectsDomains'],
      isExternal: (n.attributes as Record<string, unknown>)?.isExternal as boolean | undefined,
      provider: (n.attributes as Record<string, unknown>)?.provider as string | undefined,
      hasFallback: (n.attributes as Record<string, unknown>)?.hasFallback as boolean | undefined,
      isOpaque: (n.attributes as Record<string, unknown>)?.isOpaque as boolean | undefined,
    })),
    edges: edges.map(e => ({
      id: e.id,
      sourceId: e.sourceId,
      targetId: e.targetId,
      nature: (e.nature || 'TRANSFER') as FlowNature,
      intent: (e.intent || 'INFORMATION') as FlowIntent,
      dataCategories: (e.dataCategories || []) as DataCategory[],
      sensitivity: (e.sensitivity || 'STANDARD') as Sensitivity,
      automation: (e.automation || 'INFORMATIVE') as AutomationLevel,
      isReversible: e.isReversible !== false,
      sourceType: (nodeTypeMap.get(e.sourceId) || 'INFRA') as NodeContext['type'],
      targetType: (nodeTypeMap.get(e.targetId) || 'INFRA') as NodeContext['type'],
    })),
  }
}
