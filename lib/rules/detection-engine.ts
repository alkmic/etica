// Moteur de détection automatique des tensions ETICA
// Analyse la cartographie (nœuds, flux, attributs) et détecte les tensions éthiques

import { DomainId } from '@/lib/constants/domains'
import { FLOW_NATURES, FlowNatureId, getTriggeredDomains, isHighRiskDomain, SiaDomainId, AUTOMATION_LEVELS, SCALE_LEVELS, ScaleId } from '@/lib/constants/data-types'
import { TensionPatternId, TENSION_PATTERNS, TensionPattern, calculateFinalSeverity, TensionLevel } from '@/lib/constants/tension-patterns'
import { AIAttributes, HumanAttributes, InfraAttributes, NodeTypeId, nodeHasCharacteristic } from '@/lib/constants/node-types'

// ============================================
// TYPES D'ENTRÉE
// ============================================

export interface SiaContext {
  id: string
  name: string
  domain: SiaDomainId
  decisionType: string
  hasVulnerable: boolean
  scale: ScaleId
  dataTypes: string[]
  populations: string[]
}

export interface NodeContext {
  id: string
  type: NodeTypeId
  label: string
  attributes: Record<string, unknown>
}

export interface EdgeContext {
  id: string
  sourceId: string
  targetId: string
  nature: FlowNatureId
  sensitivity: 'STANDARD' | 'SENSITIVE' | 'HIGHLY_SENSITIVE'
  automation: string
  direction: string
  dataCategories: string[]
  frequency: string
  opacity: number | null
  agentivity: number | null
  asymmetry: number | null
  irreversibility: number | null
  scalability: number | null
}

// ============================================
// RÉSULTAT DE DÉTECTION
// ============================================

export interface DetectedTension {
  patternId: TensionPatternId
  pattern: TensionPattern
  baseSeverity: number
  calculatedSeverity: number
  level: TensionLevel
  impactedDomains: DomainId[]
  activeAmplifiers: string[]
  activeMitigators: string[]
  relatedEdgeIds: string[]
  relatedNodeIds: string[]
  detectionReason: string
  triggerConditions: TriggerCondition[]
  suggestedActions: string[]
}

interface TriggerCondition {
  type: 'node' | 'edge' | 'sia' | 'combination'
  description: string
  elementIds: string[]
}

// ============================================
// RÈGLES DE DÉTECTION
// ============================================

interface DetectionRule {
  patternId: TensionPatternId
  check: (ctx: DetectionContext) => DetectionResult | null
}

interface DetectionContext {
  sia: SiaContext
  nodes: NodeContext[]
  edges: EdgeContext[]
  nodeMap: Map<string, NodeContext>
}

interface DetectionResult {
  relatedEdgeIds: string[]
  relatedNodeIds: string[]
  triggerConditions: TriggerCondition[]
  detectionReason: string
  activeAmplifiers: string[]
  activeMitigators: string[]
}

// ============================================
// HELPERS
// ============================================

function getNodesByType(nodes: NodeContext[], type: NodeTypeId): NodeContext[] {
  return nodes.filter(n => n.type === type)
}

function getEdgesByNature(edges: EdgeContext[], nature: FlowNatureId): EdgeContext[] {
  return edges.filter(e => e.nature === nature)
}

function getEdgesWithDecision(edges: EdgeContext[]): EdgeContext[] {
  return edges.filter(e => ['DECISION', 'SCORING', 'RISK_SCORING'].includes(e.nature))
}

function hasHighSensitivity(edges: EdgeContext[]): boolean {
  return edges.some(e => e.sensitivity === 'HIGHLY_SENSITIVE')
}

function hasSensitiveData(edges: EdgeContext[]): boolean {
  return edges.some(e => e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE')
}

function hasVulnerablePopulation(sia: SiaContext, nodes: NodeContext[]): boolean {
  if (sia.hasVulnerable) return true
  return nodes.some(n => {
    if (n.type !== 'HUMAN') return false
    const attrs = n.attributes as HumanAttributes
    return attrs?.isVulnerable || attrs?.isMinor
  })
}

function hasMinors(nodes: NodeContext[]): boolean {
  return nodes.some(n => {
    if (n.type !== 'HUMAN') return false
    const attrs = n.attributes as HumanAttributes
    return attrs?.isMinor
  })
}

function hasNoRecourse(edges: EdgeContext[]): boolean {
  return edges.some(e => e.automation === 'AUTO_NO_RECOURSE')
}

function hasLargeScale(sia: SiaContext): boolean {
  return sia.scale === 'LARGE' || sia.scale === 'VERY_LARGE'
}

function hasHighOpacity(edges: EdgeContext[]): boolean {
  return edges.some(e => (e.opacity ?? 0) >= 4)
}

function hasHighIrreversibility(edges: EdgeContext[]): boolean {
  return edges.some(e => (e.irreversibility ?? 0) >= 4)
}

function hasBiasTests(nodes: NodeContext[]): boolean {
  return nodes.some(n => {
    if (n.type !== 'AI') return false
    const attrs = n.attributes as AIAttributes
    return attrs?.hasBiasTests
  })
}

function hasHumanReview(nodes: NodeContext[]): boolean {
  return nodes.some(n => {
    if (n.type !== 'AI') return false
    const attrs = n.attributes as AIAttributes
    return attrs?.hasHumanReview
  })
}

function hasExplainability(nodes: NodeContext[]): boolean {
  return nodes.some(n => {
    if (n.type !== 'AI') return false
    const attrs = n.attributes as AIAttributes
    return attrs?.hasExplainability
  })
}

function hasConsent(nodes: NodeContext[]): boolean {
  const humanNodes = getNodesByType(nodes, 'HUMAN')
  if (humanNodes.length === 0) return false
  return humanNodes.every(n => {
    const attrs = n.attributes as HumanAttributes
    return attrs?.hasConsent !== false
  })
}

function canContest(nodes: NodeContext[]): boolean {
  const humanNodes = getNodesByType(nodes, 'HUMAN')
  if (humanNodes.length === 0) return false
  return humanNodes.some(n => {
    const attrs = n.attributes as HumanAttributes
    return attrs?.canContest
  })
}

function hasEncryption(nodes: NodeContext[]): boolean {
  return nodes.some(n => {
    if (n.type !== 'INFRA') return false
    const attrs = n.attributes as InfraAttributes
    return attrs?.isEncrypted
  })
}

function hasDataMinimization(edges: EdgeContext[]): boolean {
  const collectEdges = edges.filter(e => e.nature === 'COLLECTION')
  if (collectEdges.length === 0) return true
  const allCategories = new Set<string>()
  collectEdges.forEach(e => e.dataCategories.forEach(c => allCategories.add(c)))
  return allCategories.size <= 3
}

function hasLLMOrGenAI(nodes: NodeContext[]): boolean {
  return nodes.some(n => {
    if (n.type !== 'AI') return false
    const attrs = n.attributes as AIAttributes
    return attrs?.subtype === 'LLM_GENAI'
  })
}

function hasScoringOrPrediction(nodes: NodeContext[]): boolean {
  return nodes.some(n => {
    if (n.type !== 'AI') return false
    const attrs = n.attributes as AIAttributes
    return ['SCORING', 'PREDICTION', 'RISK_SCORING'].includes(attrs?.subtype || '')
  })
}

function collectCommonAmplifiers(ctx: DetectionContext): string[] {
  const amplifiers: string[] = []

  if (hasVulnerablePopulation(ctx.sia, ctx.nodes)) {
    amplifiers.push('vulnerable_population')
  }
  if (hasMinors(ctx.nodes)) {
    amplifiers.push('minors')
  }
  if (hasLargeScale(ctx.sia)) {
    amplifiers.push('large_scale')
  }
  if (hasHighSensitivity(ctx.edges)) {
    amplifiers.push('high_sensitivity')
  }
  if (hasNoRecourse(ctx.edges)) {
    amplifiers.push('no_recourse')
  }
  if (hasHighIrreversibility(ctx.edges)) {
    amplifiers.push('high_irreversibility')
  }
  if (hasHighOpacity(ctx.edges)) {
    amplifiers.push('high_opacity')
  }
  if (isHighRiskDomain(ctx.sia.domain)) {
    amplifiers.push('high_risk_domain')
  }

  return amplifiers
}

function collectCommonMitigators(ctx: DetectionContext): string[] {
  const mitigators: string[] = []

  if (hasBiasTests(ctx.nodes)) {
    mitigators.push('bias_tests')
  }
  if (hasHumanReview(ctx.nodes)) {
    mitigators.push('human_review')
  }
  if (hasExplainability(ctx.nodes)) {
    mitigators.push('explainability')
  }
  if (hasConsent(ctx.nodes)) {
    mitigators.push('consent')
  }
  if (canContest(ctx.nodes)) {
    mitigators.push('can_contest')
  }
  if (hasEncryption(ctx.nodes)) {
    mitigators.push('encrypted')
  }
  if (hasDataMinimization(ctx.edges)) {
    mitigators.push('data_minimization')
  }

  return mitigators
}

// ============================================
// RÈGLES DE DÉTECTION
// ============================================

const DETECTION_RULES: DetectionRule[] = [
  // 1. Sécurité vs Vie privée - Surveillance avec données sensibles
  {
    patternId: 'SECURITY_VS_PRIVACY',
    check: (ctx) => {
      const collectEdges = ctx.edges.filter(e =>
        (e.nature === 'COLLECTION' || e.nature === 'MONITORING') &&
        hasSensitiveData([e])
      )

      const isSecurityDomain = ['FINANCE', 'JUSTICE', 'SECURITY', 'ADMINISTRATION'].includes(ctx.sia.domain)

      if (collectEdges.length === 0 || !isSecurityDomain) return null

      return {
        relatedEdgeIds: collectEdges.map(e => e.id),
        relatedNodeIds: [...new Set(collectEdges.flatMap(e => [e.sourceId, e.targetId]))],
        triggerConditions: [{
          type: 'combination',
          description: 'Collecte de données sensibles dans un contexte de sécurité',
          elementIds: collectEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : Collecte ou surveillance de données ${hasHighSensitivity(collectEdges) ? 'hautement sensibles' : 'sensibles'} dans un domaine de sécurité (${ctx.sia.domain})`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 2. Performance vs Équité - Scoring/décision avec population vulnérable
  {
    patternId: 'PERFORMANCE_VS_EQUITY',
    check: (ctx) => {
      const decisionEdges = getEdgesWithDecision(ctx.edges)
      const hasVulnerable = hasVulnerablePopulation(ctx.sia, ctx.nodes)
      const hasScoring = hasScoringOrPrediction(ctx.nodes)

      if (decisionEdges.length === 0 || (!hasVulnerable && !hasScoring)) return null

      const aiNodes = getNodesByType(ctx.nodes, 'AI')

      return {
        relatedEdgeIds: decisionEdges.map(e => e.id),
        relatedNodeIds: aiNodes.map(n => n.id),
        triggerConditions: [{
          type: 'combination',
          description: hasVulnerable
            ? 'Système de scoring/décision impactant une population vulnérable'
            : 'Système de scoring pouvant créer des biais',
          elementIds: [...decisionEdges.map(e => e.id), ...aiNodes.map(n => n.id)]
        }],
        detectionReason: `Détectée car : ${hasVulnerable ? 'Population vulnérable' : 'Système de scoring/prédiction'} avec flux de décision automatique`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 3. Efficacité vs Transparence - Modèle opaque à fort impact
  {
    patternId: 'EFFICIENCY_VS_TRANSPARENCY',
    check: (ctx) => {
      const opaqueEdges = ctx.edges.filter(e =>
        (e.nature === 'DECISION' || e.nature === 'SCORING' || e.nature === 'INFERENCE') &&
        (e.opacity ?? 0) >= 3
      )

      if (opaqueEdges.length === 0) return null

      const aiNodes = getNodesByType(ctx.nodes, 'AI').filter(n => {
        const attrs = n.attributes as AIAttributes
        return attrs?.complexityLevel === 'COMPLEX' || attrs?.complexityLevel === 'OPAQUE'
      })

      return {
        relatedEdgeIds: opaqueEdges.map(e => e.id),
        relatedNodeIds: aiNodes.map(n => n.id),
        triggerConditions: [{
          type: 'edge',
          description: 'Flux de décision avec forte opacité',
          elementIds: opaqueEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : Flux de ${opaqueEdges[0].nature.toLowerCase()} avec opacité >= 3 (difficilement explicable)`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 4. Automatisation vs Recours - Décision automatique sans recours
  {
    patternId: 'AUTOMATION_VS_RECOURSE',
    check: (ctx) => {
      const autoDecisionEdges = ctx.edges.filter(e =>
        (e.nature === 'DECISION' || e.nature === 'SCORING' || e.nature === 'MODERATION') &&
        (e.automation === 'AUTO_NO_RECOURSE' || e.automation === 'AUTO_WITH_RECOURSE')
      )

      const isAutoDecision = ctx.sia.decisionType === 'AUTO_DECISION'

      if (autoDecisionEdges.length === 0 && !isAutoDecision) return null

      const noRecourseEdges = autoDecisionEdges.filter(e => e.automation === 'AUTO_NO_RECOURSE')

      return {
        relatedEdgeIds: autoDecisionEdges.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'edge',
          description: noRecourseEdges.length > 0
            ? 'Décision automatique sans possibilité de recours'
            : 'Décision automatique avec recours limité',
          elementIds: autoDecisionEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : ${noRecourseEdges.length > 0 ? 'Décision automatique SANS recours' : 'Décision automatique avec recours limité'}`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 5. Personnalisation vs Autonomie - Profilage/recommandation
  {
    patternId: 'PERSONALIZATION_VS_AUTONOMY',
    check: (ctx) => {
      const personalizationEdges = ctx.edges.filter(e =>
        e.nature === 'RECOMMENDATION' ||
        e.nature === 'PERSONALIZATION' ||
        e.nature === 'PROFILING'
      )

      const hasBehaviorData = ctx.edges.some(e =>
        e.dataCategories.includes('behavior') ||
        e.dataCategories.includes('inferred')
      )

      if (personalizationEdges.length === 0 || !hasBehaviorData) return null

      return {
        relatedEdgeIds: personalizationEdges.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'combination',
          description: 'Personnalisation basée sur des données comportementales',
          elementIds: personalizationEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : Flux de ${personalizationEdges[0].nature.toLowerCase()} utilisant des données comportementales ou inférées`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 6. Précision vs Minimisation - Collecte étendue
  {
    patternId: 'PRECISION_VS_MINIMIZATION',
    check: (ctx) => {
      const collectEdges = ctx.edges.filter(e => e.nature === 'COLLECTION' || e.nature === 'ENRICHMENT')
      const allCategories = new Set<string>()
      collectEdges.forEach(e => e.dataCategories.forEach(c => allCategories.add(c)))

      if (allCategories.size < 5) return null

      return {
        relatedEdgeIds: collectEdges.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'edge',
          description: `Collecte de ${allCategories.size} catégories de données différentes`,
          elementIds: collectEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : Collecte de ${allCategories.size} catégories de données (> 5 est considéré comme étendu)`,
        activeAmplifiers: [...collectCommonAmplifiers(ctx), 'many_categories'],
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 7. Prédiction vs Libre arbitre - Score prédictif influençant des décisions
  {
    patternId: 'PREDICTION_VS_FREEWILL',
    check: (ctx) => {
      const hasInference = ctx.edges.some(e => e.nature === 'INFERENCE' || e.nature === 'PREDICTION' || e.nature === 'RISK_SCORING')
      const hasDecision = ctx.edges.some(e => e.nature === 'DECISION')
      const highIrreversibility = hasHighIrreversibility(ctx.edges)

      if (!hasInference || !hasDecision) return null

      const relatedEdges = ctx.edges.filter(e =>
        e.nature === 'INFERENCE' || e.nature === 'PREDICTION' || e.nature === 'RISK_SCORING' || e.nature === 'DECISION'
      )

      return {
        relatedEdgeIds: relatedEdges.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'combination',
          description: 'Prédiction/scoring alimentant une décision',
          elementIds: relatedEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : Flux de prédiction/scoring couplé à un flux de décision${highIrreversibility ? ' avec forte irréversibilité' : ''}`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 8. Rapidité vs Réflexion - Décision temps réel
  {
    patternId: 'SPEED_VS_REFLECTION',
    check: (ctx) => {
      const realtimeDecisions = ctx.edges.filter(e =>
        (e.nature === 'DECISION' || e.nature === 'MODERATION') &&
        e.frequency === 'REALTIME' &&
        (e.automation === 'AUTO_NO_RECOURSE' || e.automation === 'AUTO_WITH_RECOURSE')
      )

      if (realtimeDecisions.length === 0) return null

      return {
        relatedEdgeIds: realtimeDecisions.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'edge',
          description: 'Décision automatique en temps réel',
          elementIds: realtimeDecisions.map(e => e.id)
        }],
        detectionReason: `Détectée car : Décision automatique en temps réel sans délai de réflexion`,
        activeAmplifiers: [...collectCommonAmplifiers(ctx), 'realtime'],
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 9. Innovation vs Précaution - IA générative/agent
  {
    patternId: 'INNOVATION_VS_PRECAUTION',
    check: (ctx) => {
      const llmNodes = ctx.nodes.filter(n => {
        if (n.type !== 'AI') return false
        const attrs = n.attributes as AIAttributes
        return attrs?.subtype === 'LLM_GENAI' || attrs?.autonomyLevel === 'AUTONOMOUS'
      })

      if (llmNodes.length === 0) return null

      const relatedEdges = ctx.edges.filter(e =>
        llmNodes.some(n => e.sourceId === n.id || e.targetId === n.id)
      )

      const isCriticalDomain = ['HEALTH', 'JUSTICE', 'SECURITY'].includes(ctx.sia.domain)

      return {
        relatedEdgeIds: relatedEdges.map(e => e.id),
        relatedNodeIds: llmNodes.map(n => n.id),
        triggerConditions: [{
          type: 'node',
          description: 'Utilisation d\'IA générative ou agent autonome',
          elementIds: llmNodes.map(n => n.id)
        }],
        detectionReason: `Détectée car : Nœud IA de type LLM/GenAI ou agent autonome${isCriticalDomain ? ' dans un domaine critique' : ''}`,
        activeAmplifiers: [...collectCommonAmplifiers(ctx), 'genai', ...(isCriticalDomain ? ['critical_context'] : [])],
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 10. Standardisation vs Diversité - Décision uniforme à grande échelle
  {
    patternId: 'STANDARDIZATION_VS_DIVERSITY',
    check: (ctx) => {
      const isLargeScale = hasLargeScale(ctx.sia)
      const isAutoDecision = ctx.sia.decisionType === 'AUTO_DECISION'
      const hasDecisionFlows = ctx.edges.some(e => e.nature === 'DECISION')

      if (!isLargeScale || !isAutoDecision || !hasDecisionFlows) return null

      const decisionEdges = ctx.edges.filter(e => e.nature === 'DECISION')

      return {
        relatedEdgeIds: decisionEdges.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'sia',
          description: 'Décision automatique uniforme à grande échelle',
          elementIds: []
        }],
        detectionReason: `Détectée car : Décision automatique appliquée uniformément à ${SCALE_LEVELS[ctx.sia.scale].description}`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 11. Efficacité vs Intervention humaine - Pas de contrôle humain
  {
    patternId: 'EFFICIENCY_VS_HUMAN_CONTROL',
    check: (ctx) => {
      const autoDecisionEdges = ctx.edges.filter(e =>
        e.nature === 'DECISION' &&
        e.automation === 'AUTO_NO_RECOURSE'
      )

      const hasHumanSupervisor = ctx.nodes.some(n => {
        if (n.type !== 'HUMAN') return false
        const attrs = n.attributes as HumanAttributes
        return attrs?.subtype === 'SUPERVISOR_HITL'
      })

      const hasHumanReviewAI = hasHumanReview(ctx.nodes)

      if (autoDecisionEdges.length === 0 || hasHumanSupervisor || hasHumanReviewAI) return null

      return {
        relatedEdgeIds: autoDecisionEdges.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'combination',
          description: 'Décision automatique sans superviseur humain identifié',
          elementIds: autoDecisionEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : Décision automatique sans recours ET absence de superviseur humain (HITL) dans le système`,
        activeAmplifiers: [...collectCommonAmplifiers(ctx), 'no_override'],
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 12. Transfert de données sensibles - Privacy
  {
    patternId: 'SECURITY_VS_PRIVACY',
    check: (ctx) => {
      const transferEdges = ctx.edges.filter(e =>
        e.nature === 'TRANSFER' &&
        (e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE')
      )

      // Vérifier si le destinataire est une organisation externe
      const externalTransfers = transferEdges.filter(e => {
        const targetNode = ctx.nodeMap.get(e.targetId)
        return targetNode?.type === 'ORG'
      })

      if (externalTransfers.length === 0) return null

      return {
        relatedEdgeIds: externalTransfers.map(e => e.id),
        relatedNodeIds: externalTransfers.map(e => e.targetId),
        triggerConditions: [{
          type: 'edge',
          description: 'Transfert de données sensibles vers un tiers',
          elementIds: externalTransfers.map(e => e.id)
        }],
        detectionReason: `Détectée car : Transfert de données ${hasHighSensitivity(externalTransfers) ? 'hautement sensibles' : 'sensibles'} vers une organisation tierce`,
        activeAmplifiers: collectCommonAmplifiers(ctx),
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 13. Enrichissement vs Inférence invasive
  {
    patternId: 'ENRICHMENT_VS_INVASIVE_INFERENCE',
    check: (ctx) => {
      const inferenceEdges = ctx.edges.filter(e =>
        e.nature === 'INFERENCE' || e.nature === 'PROFILING' || e.nature === 'ENRICHMENT'
      )

      // Vérifie si des données sensibles sont inférées à partir de données standards
      const hasInferredSensitive = ctx.edges.some(e =>
        e.dataCategories.includes('inferred') &&
        (e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE')
      )

      if (inferenceEdges.length === 0 || !hasInferredSensitive) return null

      return {
        relatedEdgeIds: inferenceEdges.map(e => e.id),
        relatedNodeIds: [],
        triggerConditions: [{
          type: 'edge',
          description: 'Inférence de données sensibles',
          elementIds: inferenceEdges.map(e => e.id)
        }],
        detectionReason: `Détectée car : Inférence ou enrichissement produisant des données sensibles`,
        activeAmplifiers: [...collectCommonAmplifiers(ctx), 'hidden_inference'],
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 14. Performance vs Environnement (LLM)
  {
    patternId: 'PERFORMANCE_VS_ENVIRONMENT',
    check: (ctx) => {
      const llmNodes = ctx.nodes.filter(n => {
        if (n.type !== 'AI') return false
        const attrs = n.attributes as AIAttributes
        return attrs?.subtype === 'LLM_GENAI' || attrs?.subtype === 'DEEP_LEARNING'
      })

      if (llmNodes.length === 0) return null

      const isLargeScale = hasLargeScale(ctx.sia)

      // Seulement si grande échelle (impact environnemental significatif)
      if (!isLargeScale) return null

      return {
        relatedEdgeIds: [],
        relatedNodeIds: llmNodes.map(n => n.id),
        triggerConditions: [{
          type: 'node',
          description: 'Modèle énergivore utilisé à grande échelle',
          elementIds: llmNodes.map(n => n.id)
        }],
        detectionReason: `Détectée car : Modèle de type ${llmNodes[0].attributes?.subtype || 'Deep Learning/LLM'} déployé à grande échelle (${SCALE_LEVELS[ctx.sia.scale].description})`,
        activeAmplifiers: [...collectCommonAmplifiers(ctx), 'llm_model'],
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },

  // 15. Mémoire vs Oubli - Conservation longue
  {
    patternId: 'EXHAUSTIVITY_VS_OBLIVION',
    check: (ctx) => {
      const storageNodes = ctx.nodes.filter(n => {
        if (n.type !== 'INFRA') return false
        const attrs = n.attributes as InfraAttributes
        return attrs?.retentionPolicy === 'MORE_THAN_5_YEARS' || attrs?.retentionPolicy === 'INDEFINITE'
      })

      const storageEdges = ctx.edges.filter(e => e.nature === 'STORAGE')

      if (storageNodes.length === 0 && storageEdges.length === 0) return null

      // Vérifier si données sensibles stockées
      const sensibleStorage = storageEdges.some(e => hasSensitiveData([e]))

      if (!sensibleStorage && storageNodes.length === 0) return null

      return {
        relatedEdgeIds: storageEdges.map(e => e.id),
        relatedNodeIds: storageNodes.map(n => n.id),
        triggerConditions: [{
          type: 'combination',
          description: 'Conservation longue de données sensibles',
          elementIds: [...storageEdges.map(e => e.id), ...storageNodes.map(n => n.id)]
        }],
        detectionReason: `Détectée car : ${storageNodes.length > 0 ? 'Infrastructure avec rétention > 5 ans' : 'Stockage de données sensibles'} sans processus d'effacement clair`,
        activeAmplifiers: [...collectCommonAmplifiers(ctx), 'long_retention'],
        activeMitigators: collectCommonMitigators(ctx),
      }
    }
  },
]

// ============================================
// MOTEUR DE DÉTECTION
// ============================================

/**
 * Exécute la détection automatique des tensions
 * Retourne max 15 tensions les plus pertinentes, triées par sévérité
 */
export function detectTensions(
  sia: SiaContext,
  nodes: NodeContext[],
  edges: EdgeContext[],
  maxTensions: number = 15
): DetectedTension[] {
  // Créer le contexte
  const nodeMap = new Map(nodes.map(n => [n.id, n]))
  const ctx: DetectionContext = { sia, nodes, edges, nodeMap }

  const detectedTensions: DetectedTension[] = []
  const seenPatterns = new Set<TensionPatternId>()

  // Exécuter chaque règle
  for (const rule of DETECTION_RULES) {
    // Éviter les doublons de pattern
    if (seenPatterns.has(rule.patternId)) continue

    try {
      const result = rule.check(ctx)
      if (result) {
        const pattern = TENSION_PATTERNS[rule.patternId]

        // Calculer la sévérité finale
        const calculatedSeverity = calculateFinalSeverity(
          rule.patternId,
          result.activeAmplifiers,
          result.activeMitigators
        )

        detectedTensions.push({
          patternId: rule.patternId,
          pattern,
          baseSeverity: pattern.baseSeverity,
          calculatedSeverity,
          level: pattern.level,
          impactedDomains: pattern.impactedDomains,
          activeAmplifiers: result.activeAmplifiers,
          activeMitigators: result.activeMitigators,
          relatedEdgeIds: result.relatedEdgeIds,
          relatedNodeIds: result.relatedNodeIds,
          detectionReason: result.detectionReason,
          triggerConditions: result.triggerConditions,
          suggestedActions: pattern.defaultActions,
        })

        seenPatterns.add(rule.patternId)
      }
    } catch (error) {
      console.error(`Erreur lors de l'exécution de la règle ${rule.patternId}:`, error)
    }
  }

  // Trier par sévérité décroissante
  detectedTensions.sort((a, b) => b.calculatedSeverity - a.calculatedSeverity)

  // Limiter le nombre de tensions retournées
  return detectedTensions.slice(0, maxTensions)
}

/**
 * Retourne un message explicatif si aucune tension n'est détectée
 */
export function getNoTensionMessage(): string {
  return "Aucune tension majeure détectée basée sur la cartographie fournie. " +
    "Cela ne signifie pas absence de risque. " +
    "Vous pouvez créer manuellement des tensions si vous identifiez des points d'attention spécifiques."
}

/**
 * Résumé des tensions par domaine de vigilance
 */
export function getTensionsByDomain(tensions: DetectedTension[]): Record<DomainId, number> {
  const byDomain: Partial<Record<DomainId, number>> = {}

  for (const tension of tensions) {
    for (const domain of tension.impactedDomains) {
      byDomain[domain] = (byDomain[domain] || 0) + 1
    }
  }

  return byDomain as Record<DomainId, number>
}

/**
 * Statistiques globales de détection
 */
export function getDetectionStats(tensions: DetectedTension[]) {
  return {
    total: tensions.length,
    bySeverity: {
      critical: tensions.filter(t => t.calculatedSeverity >= 5).length,
      high: tensions.filter(t => t.calculatedSeverity === 4).length,
      medium: tensions.filter(t => t.calculatedSeverity === 3).length,
      low: tensions.filter(t => t.calculatedSeverity <= 2).length,
    },
    byLevel: {
      individual: tensions.filter(t => t.level === 'INDIVIDUAL').length,
      relational: tensions.filter(t => t.level === 'RELATIONAL').length,
      systemic: tensions.filter(t => t.level === 'SYSTEMIC').length,
    },
  }
}
