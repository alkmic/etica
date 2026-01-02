// Règles de détection préliminaire des tensions basées sur les métadonnées du SIA
// Ce module analyse la configuration du SIA AVANT la cartographie pour identifier les tensions potentielles

import { TensionPatternId, TENSION_PATTERNS } from '@/lib/constants/tension-patterns'
import { DomainId } from '@/lib/constants/domains'

// Types pour l'analyse des métadonnées
export interface SiaMetadata {
  id: string
  name: string
  description: string
  domain: string
  decisionType: string
  hasVulnerable: boolean
  scale: string
  dataTypes: string[]
  populations: string[]
}

export interface SuggestedTension {
  pattern: TensionPatternId
  title: string
  reason: string
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
  impactedDomains: DomainId[]
  suggestedQuestions: string[]
}

// Mapping des types de données sensibles
const SENSITIVE_DATA_TYPES = [
  'health', 'medical', 'biometric', 'genetic', 'sexual_orientation',
  'political_opinion', 'religious_belief', 'ethnic_origin', 'criminal'
]

const BEHAVIORAL_DATA_TYPES = [
  'behavior', 'preferences', 'navigation', 'location', 'social_graph'
]

const FINANCIAL_DATA_TYPES = [
  'financial', 'income', 'credit', 'transactions', 'debt'
]

const IDENTITY_DATA_TYPES = [
  'identity', 'contact', 'professional', 'family', 'photo'
]

// Règles de détection basées sur les métadonnées
interface MetadataRule {
  id: string
  pattern: TensionPatternId
  title: string
  condition: (sia: SiaMetadata) => boolean
  getReason: (sia: SiaMetadata) => string
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
  impactedDomains: DomainId[]
  suggestedQuestions: string[]
}

const METADATA_RULES: MetadataRule[] = [
  // Décision automatique sans recours potentiel
  {
    id: 'M001',
    pattern: 'AUTOMATION_VS_RECOURSE',
    title: 'Automatisation vs Recours',
    condition: (sia) => sia.decisionType === 'AUTO_DECISION',
    getReason: () => 'Votre système prend des décisions automatiques. Assurez-vous que les personnes affectées peuvent contester ces décisions.',
    confidence: 'HIGH',
    impactedDomains: ['RECOURSE', 'AUTONOMY'],
    suggestedQuestions: [
      'Les personnes peuvent-elles contester une décision ?',
      'Existe-t-il un recours humain ?',
      'Les décisions sont-elles explicables ?'
    ],
  },

  // Décision assistée avec impact
  {
    id: 'M002',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    title: 'Efficacité vs Transparence',
    condition: (sia) => sia.decisionType === 'ASSISTED_DECISION' || sia.decisionType === 'AUTO_DECISION',
    getReason: () => 'Les décisions algorithmiques doivent être transparentes et explicables pour les personnes concernées.',
    confidence: 'MEDIUM',
    impactedDomains: ['TRANSPARENCY', 'RESPONSIBILITY'],
    suggestedQuestions: [
      'Les critères de décision sont-ils documentés ?',
      'Les personnes sont-elles informées du fonctionnement ?',
      'Peut-on expliquer une décision individuelle ?'
    ],
  },

  // Populations vulnérables
  {
    id: 'M003',
    pattern: 'PERFORMANCE_VS_EQUITY',
    title: 'Performance vs Équité',
    condition: (sia) => sia.hasVulnerable,
    getReason: () => 'Votre système impacte des populations vulnérables. Une attention particulière à l\'équité est nécessaire.',
    confidence: 'HIGH',
    impactedDomains: ['EQUITY', 'RESPONSIBILITY'],
    suggestedQuestions: [
      'Le système a-t-il été testé pour les biais ?',
      'Des accommodements sont-ils prévus ?',
      'Comment protégez-vous les personnes vulnérables ?'
    ],
  },

  // Données de santé
  {
    id: 'M004',
    pattern: 'SECURITY_VS_PRIVACY',
    title: 'Sécurité vs Vie privée',
    condition: (sia) => sia.dataTypes.some(dt => ['health', 'medical', 'biometric', 'genetic'].includes(dt)),
    getReason: () => 'Vous traitez des données de santé, nécessitant un équilibre entre protection et utilité.',
    confidence: 'HIGH',
    impactedDomains: ['PRIVACY', 'SECURITY'],
    suggestedQuestions: [
      'Les données sont-elles pseudonymisées ?',
      'Qui a accès aux données de santé ?',
      'Le consentement est-il explicite ?'
    ],
  },

  // Données comportementales pour personnalisation
  {
    id: 'M005',
    pattern: 'PERSONALIZATION_VS_AUTONOMY',
    title: 'Personnalisation vs Autonomie',
    condition: (sia) => sia.dataTypes.some(dt => BEHAVIORAL_DATA_TYPES.includes(dt)) &&
                        (sia.decisionType === 'RECOMMENDATION' || sia.domain === 'COMMERCE' || sia.domain === 'MEDIA'),
    getReason: () => 'La personnalisation basée sur le comportement peut influencer les choix des utilisateurs.',
    confidence: 'MEDIUM',
    impactedDomains: ['AUTONOMY', 'TRANSPARENCY'],
    suggestedQuestions: [
      'Les utilisateurs peuvent-ils désactiver la personnalisation ?',
      'Proposez-vous des options non personnalisées ?',
      'Les critères de personnalisation sont-ils transparents ?'
    ],
  },

  // Grande échelle
  {
    id: 'M006',
    pattern: 'STANDARDIZATION_VS_SINGULARITY',
    title: 'Standardisation vs Singularité',
    condition: (sia) => (sia.scale === 'NATIONAL' || sia.scale === 'INTERNATIONAL') &&
                        (sia.decisionType === 'AUTO_DECISION' || sia.decisionType === 'ASSISTED_DECISION'),
    getReason: () => 'Les décisions à grande échelle doivent permettre des exceptions pour les cas particuliers.',
    confidence: 'MEDIUM',
    impactedDomains: ['EQUITY', 'AUTONOMY'],
    suggestedQuestions: [
      'Des exceptions individuelles sont-elles possibles ?',
      'Comment gérez-vous les cas atypiques ?',
      'Le système prend-il en compte les contextes locaux ?'
    ],
  },

  // Données financières avec décision
  {
    id: 'M007',
    pattern: 'PRECISION_VS_MINIMIZATION',
    title: 'Précision vs Minimisation',
    condition: (sia) => sia.dataTypes.some(dt => FINANCIAL_DATA_TYPES.includes(dt)) &&
                        sia.domain === 'FINANCE',
    getReason: () => 'Le traitement de données financières doit respecter le principe de minimisation.',
    confidence: 'MEDIUM',
    impactedDomains: ['PRIVACY'],
    suggestedQuestions: [
      'Collectez-vous uniquement les données nécessaires ?',
      'Quelle est la durée de conservation ?',
      'Les données sont-elles agrégées quand possible ?'
    ],
  },

  // Domaine Justice ou Administration avec décision
  {
    id: 'M008',
    pattern: 'AUTOMATION_VS_RECOURSE',
    title: 'Risque d\'automatisation excessive',
    condition: (sia) => (sia.domain === 'JUSTICE' || sia.domain === 'ADMINISTRATION') &&
                        sia.decisionType !== 'INFORMATIVE',
    getReason: () => 'Dans le domaine public, les décisions algorithmiques requièrent des garanties de recours renforcées.',
    confidence: 'HIGH',
    impactedDomains: ['RECOURSE', 'RESPONSIBILITY', 'EQUITY'],
    suggestedQuestions: [
      'Un agent humain valide-t-il les décisions ?',
      'Le droit au recours est-il garanti ?',
      'Les décisions sont-elles motivées ?'
    ],
  },

  // Profilage avec données multiples
  {
    id: 'M009',
    pattern: 'PREDICTION_VS_FREEWILL',
    title: 'Prédiction vs Libre arbitre',
    condition: (sia) => sia.dataTypes.length >= 4 &&
                        sia.dataTypes.some(dt => BEHAVIORAL_DATA_TYPES.includes(dt)) &&
                        sia.decisionType !== 'INFORMATIVE',
    getReason: () => 'La combinaison de multiples données pour la prédiction peut limiter le libre arbitre.',
    confidence: 'MEDIUM',
    impactedDomains: ['AUTONOMY', 'PRIVACY'],
    suggestedQuestions: [
      'Les personnes savent-elles qu\'elles sont profilées ?',
      'Peuvent-elles s\'opposer au profilage ?',
      'Les prédictions influencent-elles des décisions importantes ?'
    ],
  },

  // Mineurs
  {
    id: 'M010',
    pattern: 'PERFORMANCE_VS_EQUITY',
    title: 'Protection des mineurs',
    condition: (sia) => sia.populations.some(p => p.toLowerCase().includes('mineur') ||
                                                  p.toLowerCase().includes('enfant') ||
                                                  p.toLowerCase().includes('élève') ||
                                                  p.toLowerCase().includes('étudiant')),
    getReason: () => 'Le traitement de données de mineurs nécessite des protections renforcées.',
    confidence: 'HIGH',
    impactedDomains: ['PRIVACY', 'EQUITY', 'AUTONOMY'],
    suggestedQuestions: [
      'Le consentement parental est-il requis ?',
      'Les données des mineurs sont-elles mieux protégées ?',
      'Les mineurs peuvent-ils exercer leurs droits ?'
    ],
  },

  // Employés/RH
  {
    id: 'M011',
    pattern: 'EFFICIENCY_VS_TRANSPARENCY',
    title: 'Surveillance au travail',
    condition: (sia) => sia.populations.some(p => p.toLowerCase().includes('employé') ||
                                                  p.toLowerCase().includes('salarié') ||
                                                  p.toLowerCase().includes('candidat')) &&
                        (sia.domain === 'RH' || sia.domain === 'TRAVAIL'),
    getReason: () => 'La surveillance des employés doit être proportionnée et transparente.',
    confidence: 'MEDIUM',
    impactedDomains: ['TRANSPARENCY', 'AUTONOMY', 'PRIVACY'],
    suggestedQuestions: [
      'Les employés sont-ils informés de la surveillance ?',
      'La surveillance est-elle proportionnée ?',
      'Les données RH sont-elles compartimentées ?'
    ],
  },

  // Données biométriques
  {
    id: 'M012',
    pattern: 'SECURITY_VS_PRIVACY',
    title: 'Données biométriques',
    condition: (sia) => sia.dataTypes.some(dt => dt === 'biometric' || dt === 'photo' || dt === 'voice'),
    getReason: () => 'Les données biométriques sont particulièrement sensibles car irremplaçables.',
    confidence: 'HIGH',
    impactedDomains: ['PRIVACY', 'SECURITY'],
    suggestedQuestions: [
      'L\'utilisation de la biométrie est-elle strictement nécessaire ?',
      'Une alternative moins intrusive existe-t-elle ?',
      'Comment sécurisez-vous ces données ?'
    ],
  },
]

/**
 * Analyse les métadonnées d'un SIA et retourne les tensions potentielles suggérées
 */
export function suggestTensionsFromMetadata(sia: SiaMetadata): SuggestedTension[] {
  const suggestions: SuggestedTension[] = []

  for (const rule of METADATA_RULES) {
    try {
      if (rule.condition(sia)) {
        const pattern = TENSION_PATTERNS[rule.pattern]
        suggestions.push({
          pattern: rule.pattern,
          title: pattern?.title || rule.title,
          reason: rule.getReason(sia),
          confidence: rule.confidence,
          impactedDomains: rule.impactedDomains,
          suggestedQuestions: rule.suggestedQuestions,
        })
      }
    } catch (error) {
      console.error(`Error executing metadata rule ${rule.id}:`, error)
    }
  }

  // Dédupliquer par pattern (garder la confiance la plus élevée)
  const byPattern = new Map<TensionPatternId, SuggestedTension>()
  const confidenceOrder = ['HIGH', 'MEDIUM', 'LOW']

  for (const suggestion of suggestions) {
    const existing = byPattern.get(suggestion.pattern)
    if (!existing) {
      byPattern.set(suggestion.pattern, suggestion)
    } else {
      const existingIndex = confidenceOrder.indexOf(existing.confidence)
      const newIndex = confidenceOrder.indexOf(suggestion.confidence)
      if (newIndex < existingIndex) {
        // Fusionner les questions
        const merged: SuggestedTension = {
          ...suggestion,
          suggestedQuestions: Array.from(new Set([...existing.suggestedQuestions, ...suggestion.suggestedQuestions])),
        }
        byPattern.set(suggestion.pattern, merged)
      }
    }
  }

  // Trier par confiance
  return Array.from(byPattern.values()).sort((a, b) => {
    return confidenceOrder.indexOf(a.confidence) - confidenceOrder.indexOf(b.confidence)
  })
}

/**
 * Retourne un résumé des risques principaux basés sur les métadonnées
 */
export function getMetadataRiskSummary(sia: SiaMetadata): {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  factors: string[]
} {
  const factors: string[] = []

  // Évaluer les facteurs de risque
  if (sia.decisionType === 'AUTO_DECISION') {
    factors.push('Décision entièrement automatisée')
  }

  if (sia.hasVulnerable) {
    factors.push('Populations vulnérables impactées')
  }

  if (sia.scale === 'NATIONAL' || sia.scale === 'INTERNATIONAL') {
    factors.push('Déploiement à grande échelle')
  }

  const hasSensitiveData = sia.dataTypes.some(dt => SENSITIVE_DATA_TYPES.includes(dt))
  if (hasSensitiveData) {
    factors.push('Données sensibles traitées')
  }

  if (sia.domain === 'JUSTICE' || sia.domain === 'ADMINISTRATION') {
    factors.push('Secteur public sensible')
  }

  // Déterminer le niveau de risque
  let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW'

  if (factors.length >= 4) {
    level = 'CRITICAL'
  } else if (factors.length >= 3) {
    level = 'HIGH'
  } else if (factors.length >= 1) {
    level = 'MEDIUM'
  }

  return { level, factors }
}
