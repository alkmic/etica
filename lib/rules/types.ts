// lib/rules/types.ts
// Types pour le moteur de détection des dilemmes

import { EthicalDomain } from '../constants/ethical-domains';

// Famille de règles
export type RuleFamily = 'STRUCTURAL' | 'DATA' | 'DEPENDENCY' | 'CONTEXTUAL' | 'GOVERNANCE';

// Structure d'une règle de détection
export interface DetectionRule {
  id: string;                    // Ex: "E-01", "S-03"
  name: string;                  // Nom en anglais
  nameFr: string;                // Nom en français
  family: RuleFamily;

  // Conditions de déclenchement
  conditions: RuleConditions;

  // Dilemme produit si les conditions sont remplies
  produces: {
    domainA: EthicalDomain;
    domainB: EthicalDomain;
    formulationTemplate: string;  // Template avec {variables}
    mechanismTemplate: string;    // Explication du mécanisme
  };

  // Qualification de gravité
  severityBase: number;          // 1-5
  aggravatingFactors: Factor[];
  mitigatingFactors: Factor[];

  // Guidance d'arbitrage (SANS JUGER MORALEMENT)
  acceptablePatterns: string[];   // Patrons d'arbitrage acceptables
  requiredEvidences: string[];    // Preuves requises pour maturité 3+
  questionsToConsider: string[];  // Questions à se poser
  stakeholdersToConsult: string[];// Parties prenantes à consulter
}

export interface RuleConditions {
  // Conditions sur les nœuds
  nodeConditions?: NodeCondition[];

  // Conditions sur les flux
  edgeConditions?: EdgeCondition[];

  // Conditions sur la structure du graphe
  graphConditions?: GraphCondition[];

  // Conditions sur le SIA lui-même
  siaConditions?: SiaCondition[];
}

export interface NodeCondition {
  type?: string | string[];           // HUMAN, AI, INFRA, ORG
  subtype?: string | string[];        // Ex: llm, api, user
  attribute?: string;                 // Chemin dans attributes JSON
  value?: unknown;                    // Valeur attendue
  operator?: 'equals' | 'notEquals' | 'includes' | 'exists' | 'greaterThan' | 'lessThan';
}

export interface EdgeCondition {
  nature?: string | string[];
  intent?: string | string[];
  dataCategories?: { includes?: string[]; excludes?: string[] };
  criticality?: string | string[];
  sensitivity?: string | string[];
  automation?: string | string[];
  channel?: string | string[];
  frequency?: string;
  isReversible?: boolean;
}

export interface GraphCondition {
  // Détection de boucles/cycles
  hasLoop?: boolean;
  hasCycle?: boolean;

  // Chemins entre nœuds
  hasPathBetween?: { from: NodeCondition; to: NodeCondition };
  noPathToNode?: NodeCondition;
  pathExists?: {
    from: { type: string; isExternal?: boolean };
    to: { type: string };
    through?: string;
  };

  // Propriétés du graphe
  nodeCount?: { lessThan?: number; greaterThan?: number };
  centralityThreshold?: { nodeCondition: NodeCondition; threshold: number };
  highCentrality?: { threshold: number };
  multipleSourcesTo?: { type: string };

  // Recherche de type de nœud
  hasNodeType?: string;
  attribute?: string;
  value?: unknown;

  // Chaînes de sous-traitance
  chainExists?: {
    nodeType: string;
    attribute: string;
    value: unknown;
    minLength: number;
  };
}

export interface SiaCondition {
  attribute?: string;
  value?: unknown;
  sector?: string[];
  operator?: 'equals' | 'notEquals' | 'includes' | 'isNull' | 'isNotNull';
}

export interface Factor {
  condition: string;              // Expression à évaluer (pseudo-code)
  label: string;                  // Label lisible
  severityModifier: number;       // +1, +2, -1, -2...
}

// Dilemme détecté
export interface DetectedDilemma {
  id: string;
  ruleId: string;
  ruleName: string;
  ruleFamily: RuleFamily;

  domainA: EthicalDomain;
  domainB: EthicalDomain;

  formulation: string;            // Texte généré
  mechanism: string;              // Mécanisme qui rend le dilemme inévitable

  affectedNodeIds: string[];
  affectedEdgeIds: string[];

  severity: number;               // 1-5 (calculé avec facteurs)
  severityBase?: number;          // Sévérité de base
  activeAggravatingFactors: string[];   // Labels des facteurs aggravants activés
  activeMitigatingFactors: string[];    // Labels des facteurs atténuants activés

  acceptablePatterns: string[];
  requiredEvidences: string[];
  questionsToConsider: string[];
  stakeholdersToConsult: string[];

  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';  // Niveau de confiance
}

// ============================================
// TYPES DE COUVERTURE
// ============================================

// Rapport de couverture
export interface CoverageReport {
  lenses: LensCoverage[];
  overallScore: number;           // 0-1
  gaps: string[];                 // Dimensions non couvertes
}

export interface LensCoverage {
  lensId: string;                 // Ex: "EU_TRUSTWORTHY_AI"
  lensName: string;
  score: number;                  // 0-1
  requirementScores: Record<string, number>;
  gaps: string[];
}

export interface DimensionCoverage {
  id: string;
  name: string;
  coveredByRules: string[];       // IDs des règles qui couvrent
  isCovered: boolean;
}

// Lentille éthique (référentiel)
export interface EthicalLens {
  id: string;
  name: string;
  nameFr: string;
  source: string;
  version: string;
  requirements: LensRequirement[];
}

export interface LensRequirement {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  mappedDomains: string[];
  checklist: string[];
}

// ============================================
// TYPES D'ENTRÉE
// ============================================

export interface SiaData {
  id: string;
  name: string;
  sector: string;
  decisionType: string;
  hasVulnerable: boolean;
  scale?: string;
  riskLevel?: string;
  finalPurpose?: string;
  usageFrequency?: string;
  userScale?: string;
  externalProviders?: string[];
  populations?: string[];
  geographicScope?: string[];
  hasExternalAI?: boolean;
  hasExternalInfra?: boolean;
  hasResponsible?: boolean;
  hasIncidentProcedure?: boolean;
  hasReviewSchedule?: boolean;
  hasOperatorTraining?: boolean;
  hasEthicalDocumentation?: boolean;
  hasRecourseMechanism?: boolean;
  hasImpactMonitoring?: boolean;
  hasEthicsConsultation?: boolean;
  hasStakeholderConsultation?: boolean;
  hasKillSwitch?: boolean;
}

export interface NodeData {
  id: string;
  type: string;
  subtype?: string;
  label: string;
  attributes: Record<string, unknown>;
  reinforcesDomains?: EthicalDomain[];
  affectsDomains?: EthicalDomain[];
}

export interface EdgeData {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  nature: string;
  intent: string;
  channel: string;
  dataCategories: string[];
  sensitivity: string;
  automation: string;
  criticality: string;
  isReversible: boolean;
  frequency?: string;
}

export interface DetectionInput {
  sia: SiaData;
  nodes: NodeData[];
  edges: EdgeData[];
}

// Résultat d'évaluation d'une règle
export interface MatchResult {
  matches: boolean;
  matchedNodes: string[];
  matchedEdges: string[];
  variables: Record<string, unknown>;
  aggravatingActive: string[];
  mitigatingActive: string[];
}
