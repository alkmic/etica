// Règles de détection automatique des tensions ETICA
// Ce module analyse le SIA et ses flux pour identifier les tensions potentielles

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

// Règles de détection
const DETECTION_RULES: DetectionRule[] = [
  // R001: Efficacité vs Transparence - Décision opaque à fort impact
  {
    id: 'R001',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    name: 'Décision opaque à fort impact',
    description: 'Un flux de décision utilise un modèle opaque qui impacte des personnes.',
    condition: (sia, _nodes, edges) => {
      return edges.some(
        (e) =>
          e.nature === 'DECISION' &&
          (e.opacity ?? 0) >= 3 &&
          (e.direction === 'M2H' || e.direction === 'M2M')
      )
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges
        .filter(
          (e) =>
            e.nature === 'DECISION' &&
            (e.opacity ?? 0) >= 3
        )
        .map((e) => e.id),
    confidence: 'HIGH',
    impactedDomains: ['TRANSPARENCY', 'RECOURSE'],
    suggestedActions: ['EXPLAINABILITY_LAYER', 'TRANSPARENCY_FACTORS', 'HUMAN_REVIEW_THRESHOLD'],
  },

  // R002: Automatisation vs Recours - Décision automatique sans recours
  {
    id: 'R002',
    pattern: 'AUTOMATION_VS_RECOURSE',
    name: 'Décision automatique sans recours',
    description: 'Une décision automatique est prise sans mécanisme de contestation.',
    condition: (sia, _nodes, edges) => {
      const hasAutoDecision = edges.some(
        (e) => e.nature === 'DECISION' && e.automation === 'AUTO_NO_RECOURSE'
      )
      return hasAutoDecision || (sia.decisionType === 'AUTO_DECISION' && edges.some((e) => e.nature === 'DECISION'))
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges
        .filter(
          (e) => e.nature === 'DECISION' && (e.automation === 'AUTO_NO_RECOURSE' || e.automation === 'AUTO_WITH_RECOURSE')
        )
        .map((e) => e.id),
    confidence: 'VERY_HIGH',
    impactedDomains: ['RECOURSE', 'AUTONOMY'],
    suggestedActions: ['APPEAL_PROCESS', 'CONTACT_HUMAN', 'HUMAN_REVIEW_THRESHOLD'],
  },

  // R003: Performance vs Équité - Décision sur population vulnérable
  {
    id: 'R003',
    pattern: 'PERFORMANCE_VS_EQUITY',
    name: 'Décision sur population vulnérable',
    description: 'Un système de décision impacte des personnes vulnérables.',
    condition: (sia, _nodes, edges) => {
      return (
        sia.hasVulnerable &&
        edges.some((e) => e.nature === 'DECISION' || e.nature === 'RECOMMENDATION')
      )
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter((e) => e.nature === 'DECISION' || e.nature === 'RECOMMENDATION').map((e) => e.id),
    confidence: 'HIGH',
    impactedDomains: ['EQUITY', 'ACCOUNTABILITY'],
    suggestedActions: ['BIAS_TESTING', 'FAIRNESS_METRICS', 'CASE_BY_CASE'],
  },

  // R004: Sécurité vs Vie privée - Surveillance avec données sensibles
  {
    id: 'R004',
    pattern: 'SECURITY_VS_PRIVACY',
    name: 'Surveillance avec données sensibles',
    description: 'Collecte de données sensibles à des fins de sécurité ou détection.',
    condition: (sia, _nodes, edges) => {
      const hasSensitiveCollect = edges.some(
        (e) => e.nature === 'COLLECT' && (e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE')
      )
      const isSecurityDomain = ['FINANCE', 'JUSTICE', 'SECURITY', 'ADMINISTRATION'].includes(sia.domain)
      return hasSensitiveCollect && isSecurityDomain
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges
        .filter((e) => e.nature === 'COLLECT' && (e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE'))
        .map((e) => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['PRIVACY', 'SECURITY'],
    suggestedActions: ['DATA_MINIMIZATION', 'TRANSPARENCY_NOTICE', 'RETENTION_POLICY'],
  },

  // R005: Personnalisation vs Autonomie - Profilage pour recommandation
  {
    id: 'R005',
    pattern: 'PERSONALIZATION_VS_AUTONOMY',
    name: 'Profilage pour recommandation',
    description: 'Utilisation de données comportementales pour personnaliser.',
    condition: (_sia, _nodes, edges) => {
      const hasProfileData = edges.some(
        (e) =>
          e.dataCategories.includes('behavior') ||
          e.dataCategories.includes('preferences') ||
          e.dataCategories.includes('inferred')
      )
      const hasRecommendation = edges.some((e) => e.nature === 'RECOMMENDATION' || e.nature === 'INFERENCE')
      return hasProfileData && hasRecommendation
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter((e) => e.nature === 'RECOMMENDATION' || e.nature === 'INFERENCE').map((e) => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['AUTONOMY', 'PRIVACY'],
    suggestedActions: ['USER_CONTROLS', 'DIVERSE_OPTIONS', 'TRANSPARENCY_FACTORS'],
  },

  // R006: Précision vs Minimisation - Collecte étendue de données
  {
    id: 'R006',
    pattern: 'PRECISION_VS_MINIMIZATION',
    name: 'Collecte étendue de données',
    description: 'Collecte de nombreuses catégories de données.',
    condition: (_sia, _nodes, edges) => {
      const allCategories = new Set<string>()
      edges.forEach((e) => {
        if (e.nature === 'COLLECT') {
          e.dataCategories.forEach((c) => allCategories.add(c))
        }
      })
      return allCategories.size >= 5
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter((e) => e.nature === 'COLLECT').map((e) => e.id),
    confidence: 'LOW',
    impactedDomains: ['PRIVACY'],
    suggestedActions: ['DATA_MINIMIZATION', 'PURPOSE_LIMITATION', 'RETENTION_POLICY'],
  },

  // R007: Standardisation vs Singularité - Décision uniforme à grande échelle
  {
    id: 'R007',
    pattern: 'STANDARDIZATION_VS_SINGULARITY',
    name: 'Décision uniforme à grande échelle',
    description: 'Décision automatique appliquée uniformément à une large population.',
    condition: (sia, _nodes, edges) => {
      const isLargeScale = sia.scale === 'LARGE' || sia.scale === 'VERY_LARGE'
      const hasAutoDecision = sia.decisionType === 'AUTO_DECISION'
      return isLargeScale && hasAutoDecision
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter((e) => e.nature === 'DECISION').map((e) => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['EQUITY', 'AUTONOMY'],
    suggestedActions: ['EXCEPTION_PROCESS', 'ACCOMMODATION', 'CASE_BY_CASE'],
  },

  // R008: Innovation vs Précaution - IA générative ou agent
  {
    id: 'R008',
    pattern: 'INNOVATION_VS_PRECAUTION',
    name: 'Système autonome ou génératif',
    description: 'Utilisation de technologies émergentes (IA générative, agents).',
    condition: (_sia, nodes, _edges) => {
      return nodes.some((n) => {
        if (n.type !== 'AI') return false
        const attrs = n.attributes as Record<string, unknown>
        return attrs.modelType === 'llm' || attrs.modelType === 'agent'
      })
    },
    getRelatedEdges: (_sia, nodes, edges) => {
      const aiNodeIds = nodes
        .filter((n) => {
          if (n.type !== 'AI') return false
          const attrs = n.attributes as Record<string, unknown>
          return attrs.modelType === 'llm' || attrs.modelType === 'agent'
        })
        .map((n) => n.id)
      return edges.filter((e) => aiNodeIds.includes(e.sourceId)).map((e) => e.id)
    },
    confidence: 'MEDIUM',
    impactedDomains: ['SECURITY', 'ACCOUNTABILITY'],
    suggestedActions: ['STAGED_ROLLOUT', 'MONITORING', 'INCIDENT_PROCESS'],
  },

  // R009: Prédiction vs Libre arbitre - Score prédictif
  {
    id: 'R009',
    pattern: 'PREDICTION_VS_FREEWILL',
    name: 'Score prédictif déterminant',
    description: 'Un score de prédiction influence significativement les décisions.',
    condition: (_sia, _nodes, edges) => {
      const hasInference = edges.some((e) => e.nature === 'INFERENCE')
      const hasDecision = edges.some((e) => e.nature === 'DECISION')
      const highIrreversibility = edges.some((e) => (e.irreversibility ?? 0) >= 3)
      return hasInference && hasDecision && highIrreversibility
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter((e) => e.nature === 'INFERENCE' || e.nature === 'DECISION').map((e) => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['AUTONOMY', 'EQUITY'],
    suggestedActions: ['TRANSPARENCY_FACTORS', 'APPEAL_PROCESS', 'OVERRIDE_CAPABILITY'],
  },

  // R010: Rapidité vs Réflexion - Décision temps réel
  {
    id: 'R010',
    pattern: 'SPEED_VS_REFLECTION',
    name: 'Décision en temps réel',
    description: 'Des décisions sont prises en temps réel sans possibilité de revue.',
    condition: (_sia, _nodes, edges) => {
      return edges.some(
        (e) =>
          e.nature === 'DECISION' &&
          (e.automation === 'AUTO_NO_RECOURSE' || e.automation === 'AUTO_WITH_RECOURSE')
      )
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges
        .filter(
          (e) =>
            e.nature === 'DECISION' &&
            (e.automation === 'AUTO_NO_RECOURSE' || e.automation === 'AUTO_WITH_RECOURSE')
        )
        .map((e) => e.id),
    confidence: 'MEDIUM',
    impactedDomains: ['RECOURSE', 'ACCOUNTABILITY'],
    suggestedActions: ['HUMAN_REVIEW_THRESHOLD', 'OVERRIDE_CAPABILITY'],
  },

  // R011: Asymétrie informationnelle forte
  {
    id: 'R011',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    name: 'Asymétrie informationnelle forte',
    description: "Un flux présente une forte asymétrie d'information.",
    condition: (_sia, _nodes, edges) => {
      return edges.some((e) => (e.asymmetry ?? 0) >= 4)
    },
    getRelatedEdges: (_sia, _nodes, edges) =>
      edges.filter((e) => (e.asymmetry ?? 0) >= 4).map((e) => e.id),
    confidence: 'HIGH',
    impactedDomains: ['TRANSPARENCY', 'AUTONOMY'],
    suggestedActions: ['TRANSPARENCY_NOTICE', 'ACCESS_RIGHTS'],
  },

  // R012: Transfert vers tiers de données sensibles
  {
    id: 'R012',
    pattern: 'SECURITY_VS_PRIVACY',
    name: 'Transfert de données sensibles',
    description: 'Des données sensibles sont transférées à un tiers.',
    condition: (_sia, nodes, edges) => {
      const orgNodeIds = nodes.filter((n) => n.type === 'ORG').map((n) => n.id)
      return edges.some(
        (e) =>
          e.nature === 'TRANSFER' &&
          (e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE') &&
          orgNodeIds.includes(e.targetId)
      )
    },
    getRelatedEdges: (_sia, nodes, edges) => {
      const orgNodeIds = nodes.filter((n) => n.type === 'ORG').map((n) => n.id)
      return edges
        .filter(
          (e) =>
            e.nature === 'TRANSFER' &&
            (e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE') &&
            orgNodeIds.includes(e.targetId)
        )
        .map((e) => e.id)
    },
    confidence: 'HIGH',
    impactedDomains: ['PRIVACY', 'SECURITY'],
    suggestedActions: ['DATA_MINIMIZATION', 'TRANSPARENCY_NOTICE'],
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

  for (const rule of DETECTION_RULES) {
    try {
      if (rule.condition(sia, nodes, edges)) {
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
      console.error(`Error executing rule ${rule.id}:`, error)
    }
  }

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
          relatedEdgeIds: [...new Set([...existing.relatedEdgeIds, ...tension.relatedEdgeIds])],
          suggestedActions: [...new Set([...existing.suggestedActions, ...tension.suggestedActions])],
        }
        byPattern.set(tension.pattern, merged)
      }
    }
  }

  return Array.from(byPattern.values())
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
