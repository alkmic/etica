// lib/rules/index.ts
// Module de détection des dilemmes éthiques ETICA

// Types partagés
export * from './types';

// Règles par famille
export { STRUCTURAL_RULES } from './structural-rules';
export { DATA_RULES } from './data-rules';
export { DEPENDENCY_RULES } from './dependency-rules';
export { CONTEXTUAL_RULES } from './contextual-rules';
export { GOVERNANCE_RULES } from './governance-rules';

// Moteur de détection des dilemmes (nouveau système 12 domaines)
export {
  ALL_RULES,
  getRulesByFamily,
  getRuleById,
  detectDilemmas,
  getDilemmaStats,
  getDilemmaSummary,
  type DilemmaDetectionOptions,
  type DilemmaStats,
} from './dilemma-engine';

// Vérification de couverture
export {
  ETHICAL_LENSES,
  getAvailableLenses,
  getLensById,
  checkCoverage,
  getCoverageRecommendations,
  formatCoverageReport,
  findRelevantRulesForRequirement,
  suggestManualChecks,
  type CoverageCheckOptions,
} from './coverage-checker';

// Ancien moteur de détection (compatibilité)
export {
  detectTensions,
  getNoTensionMessage,
  getTensionsByDomain,
  getDetectionStats,
  type SiaContext,
  type NodeContext,
  type EdgeContext,
  type DetectedTension,
} from './detection-engine';
