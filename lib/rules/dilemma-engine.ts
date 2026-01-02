// lib/rules/dilemma-engine.ts
// Moteur de détection des dilemmes éthiques basé sur les 5 familles de règles
// Ce moteur utilise la nouvelle architecture avec les domaines à 12 dimensions

import { DetectionRule, DetectedDilemma, DetectionInput, RuleFamily, Factor } from './types';
import { STRUCTURAL_RULES } from './structural-rules';
import { DATA_RULES } from './data-rules';
import { DEPENDENCY_RULES } from './dependency-rules';
import { CONTEXTUAL_RULES } from './contextual-rules';
import { GOVERNANCE_RULES } from './governance-rules';
import { EthicalDomain } from '@/lib/constants/ethical-domains';

// ============================================
// AGRÉGATION DES RÈGLES
// ============================================

export const ALL_RULES: DetectionRule[] = [
  ...STRUCTURAL_RULES,
  ...DATA_RULES,
  ...DEPENDENCY_RULES,
  ...CONTEXTUAL_RULES,
  ...GOVERNANCE_RULES,
];

export function getRulesByFamily(family: RuleFamily): DetectionRule[] {
  return ALL_RULES.filter(r => r.family === family);
}

export function getRuleById(id: string): DetectionRule | undefined {
  return ALL_RULES.find(r => r.id === id);
}

// ============================================
// CONTEXTE D'ÉVALUATION
// ============================================

interface EvaluationContext {
  sia: DetectionInput['sia'];
  nodes: DetectionInput['nodes'];
  edges: DetectionInput['edges'];
  nodeMap: Map<string, DetectionInput['nodes'][0]>;
  edgeMap: Map<string, DetectionInput['edges'][0]>;
}

function createContext(input: DetectionInput): EvaluationContext {
  return {
    sia: input.sia,
    nodes: input.nodes,
    edges: input.edges,
    nodeMap: new Map(input.nodes.map(n => [n.id, n])),
    edgeMap: new Map(input.edges.map(e => [e.id, e])),
  };
}

// ============================================
// HELPERS D'ÉVALUATION
// ============================================

function getNodesByType(ctx: EvaluationContext, type: string): DetectionInput['nodes'] {
  return ctx.nodes.filter(n => n.type === type);
}

function checkNodeAttribute(node: DetectionInput['nodes'][0], attr: string, value: unknown): boolean {
  const attrValue = node.attributes?.[attr];
  if (Array.isArray(value)) {
    return value.includes(attrValue);
  }
  return attrValue === value;
}

function checkEdgeDataCategories(edge: DetectionInput['edges'][0], includes: string[]): boolean {
  if (!edge.dataCategories) return false;
  return includes.some(cat => edge.dataCategories.includes(cat));
}

// ============================================
// ÉVALUATION DES CONDITIONS
// ============================================

function evaluateSiaConditions(
  ctx: EvaluationContext,
  conditions: NonNullable<DetectionRule['conditions']['siaConditions']>
): boolean {
  for (const condition of conditions) {
    if (condition.sector && !condition.sector.includes(ctx.sia.sector)) {
      return false;
    }
    if (condition.attribute && condition.value !== undefined) {
      const siaValue = (ctx.sia as unknown as Record<string, unknown>)[condition.attribute];
      if (Array.isArray(condition.value)) {
        if (!condition.value.includes(siaValue)) return false;
      } else if (siaValue !== condition.value) {
        return false;
      }
    }
  }
  return true;
}

function evaluateNodeConditions(
  ctx: EvaluationContext,
  conditions: NonNullable<DetectionRule['conditions']['nodeConditions']>
): { matches: boolean; matchedNodes: DetectionInput['nodes'] } {
  const matchedNodes: DetectionInput['nodes'] = [];

  for (const condition of conditions) {
    let candidateNodes = ctx.nodes;

    // Filter by type
    if (condition.type) {
      const types = Array.isArray(condition.type) ? condition.type : [condition.type];
      candidateNodes = candidateNodes.filter(n => types.includes(n.type));
    }

    // Filter by attribute
    if (condition.attribute && condition.value !== undefined) {
      candidateNodes = candidateNodes.filter(n =>
        checkNodeAttribute(n, condition.attribute!, condition.value)
      );
    }

    if (candidateNodes.length === 0) {
      return { matches: false, matchedNodes: [] };
    }

    matchedNodes.push(...candidateNodes);
  }

  return { matches: true, matchedNodes: Array.from(new Set(matchedNodes)) };
}

function evaluateEdgeConditions(
  ctx: EvaluationContext,
  conditions: NonNullable<DetectionRule['conditions']['edgeConditions']>
): { matches: boolean; matchedEdges: DetectionInput['edges'] } {
  let candidateEdges = [...ctx.edges];

  for (const condition of conditions) {
    // Filter by nature
    if (condition.nature) {
      const natures = Array.isArray(condition.nature) ? condition.nature : [condition.nature];
      candidateEdges = candidateEdges.filter(e => natures.includes(e.nature));
    }

    // Filter by automation
    if (condition.automation) {
      const automations = Array.isArray(condition.automation) ? condition.automation : [condition.automation];
      candidateEdges = candidateEdges.filter(e => automations.includes(e.automation));
    }

    // Filter by data categories
    if (condition.dataCategories?.includes) {
      candidateEdges = candidateEdges.filter(e =>
        checkEdgeDataCategories(e, condition.dataCategories!.includes!)
      );
    }

    // Filter by intent
    if (condition.intent) {
      const intents = Array.isArray(condition.intent) ? condition.intent : [condition.intent];
      candidateEdges = candidateEdges.filter(e => intents.includes(e.intent));
    }

    // Filter by channel
    if (condition.channel) {
      const channels = Array.isArray(condition.channel) ? condition.channel : [condition.channel];
      candidateEdges = candidateEdges.filter(e => channels.includes(e.channel));
    }

    // Filter by criticality
    if (condition.criticality) {
      const criticalities = Array.isArray(condition.criticality) ? condition.criticality : [condition.criticality];
      candidateEdges = candidateEdges.filter(e => criticalities.includes(e.criticality));
    }

    // Filter by frequency
    if (condition.frequency) {
      candidateEdges = candidateEdges.filter(e => e.frequency === condition.frequency);
    }
  }

  return {
    matches: candidateEdges.length > 0,
    matchedEdges: candidateEdges
  };
}

function evaluateGraphConditions(
  ctx: EvaluationContext,
  conditions: NonNullable<DetectionRule['conditions']['graphConditions']>
): { matches: boolean; matchedNodeIds: string[]; matchedEdgeIds: string[] } {
  const matchedNodeIds: string[] = [];
  const matchedEdgeIds: string[] = [];

  for (const condition of conditions) {
    // Check for cycles
    if (condition.hasCycle) {
      const cycles = findCycles(ctx);
      if (cycles.length === 0) {
        return { matches: false, matchedNodeIds: [], matchedEdgeIds: [] };
      }
      cycles.forEach(cycle => {
        matchedNodeIds.push(...cycle.nodeIds);
        matchedEdgeIds.push(...cycle.edgeIds);
      });
    }

    // Check for multiple sources to a node type
    if (condition.multipleSourcesTo) {
      const targetNodes = getNodesByType(ctx, condition.multipleSourcesTo.type);
      for (const targetNode of targetNodes) {
        const incomingEdges = ctx.edges.filter(e => e.targetId === targetNode.id);
        const sourceCount = new Set(incomingEdges.map(e => e.sourceId)).size;
        if (sourceCount >= 3) { // Consider "multiple" as 3+
          matchedNodeIds.push(targetNode.id);
          matchedEdgeIds.push(...incomingEdges.map(e => e.id));
        }
      }
    }

    // Check for paths
    if (condition.pathExists) {
      const paths = findPaths(ctx, condition.pathExists);
      if (paths.length === 0) {
        return { matches: false, matchedNodeIds: [], matchedEdgeIds: [] };
      }
      paths.forEach(path => {
        matchedNodeIds.push(...path.nodeIds);
        matchedEdgeIds.push(...path.edgeIds);
      });
    }

    // Check for high centrality
    if (condition.highCentrality) {
      const centralNodes = findHighCentralityNodes(ctx, condition.highCentrality.threshold);
      if (centralNodes.length === 0) {
        return { matches: false, matchedNodeIds: [], matchedEdgeIds: [] };
      }
      matchedNodeIds.push(...centralNodes.map(n => n.id));
    }

    // Check for node type existence
    if (condition.hasNodeType) {
      const nodes = getNodesByType(ctx, condition.hasNodeType);
      if (condition.attribute && condition.value !== undefined) {
        const filtered = nodes.filter(n => checkNodeAttribute(n, condition.attribute!, condition.value));
        if (filtered.length === 0) {
          return { matches: false, matchedNodeIds: [], matchedEdgeIds: [] };
        }
        matchedNodeIds.push(...filtered.map(n => n.id));
      } else if (nodes.length === 0) {
        return { matches: false, matchedNodeIds: [], matchedEdgeIds: [] };
      } else {
        matchedNodeIds.push(...nodes.map(n => n.id));
      }
    }

    // Check for subcontracting chain
    if (condition.chainExists) {
      const chains = findSubcontractingChains(ctx, condition.chainExists);
      if (chains.length === 0) {
        return { matches: false, matchedNodeIds: [], matchedEdgeIds: [] };
      }
      chains.forEach(chain => {
        matchedNodeIds.push(...chain.nodeIds);
        matchedEdgeIds.push(...chain.edgeIds);
      });
    }
  }

  return {
    matches: matchedNodeIds.length > 0 || matchedEdgeIds.length > 0,
    matchedNodeIds: Array.from(new Set(matchedNodeIds)),
    matchedEdgeIds: Array.from(new Set(matchedEdgeIds))
  };
}

// ============================================
// ALGORITHMES DE GRAPHE
// ============================================

interface GraphResult {
  nodeIds: string[];
  edgeIds: string[];
}

function findCycles(ctx: EvaluationContext): GraphResult[] {
  const cycles: GraphResult[] = [];
  const visited = new Set<string>();
  const recStack = new Set<string>();
  const path: string[] = [];
  const edgePath: string[] = [];

  function dfs(nodeId: string): void {
    visited.add(nodeId);
    recStack.add(nodeId);
    path.push(nodeId);

    const outEdges = ctx.edges.filter(e => e.sourceId === nodeId);
    for (const edge of outEdges) {
      edgePath.push(edge.id);

      if (!visited.has(edge.targetId)) {
        dfs(edge.targetId);
      } else if (recStack.has(edge.targetId)) {
        // Found cycle
        const cycleStart = path.indexOf(edge.targetId);
        if (cycleStart !== -1) {
          cycles.push({
            nodeIds: path.slice(cycleStart),
            edgeIds: edgePath.slice(cycleStart),
          });
        }
      }

      edgePath.pop();
    }

    path.pop();
    recStack.delete(nodeId);
  }

  for (const node of ctx.nodes) {
    if (!visited.has(node.id)) {
      dfs(node.id);
    }
  }

  return cycles;
}

interface PathCondition {
  from: { type: string; isExternal?: boolean };
  to: { type: string };
  through?: string;
}

function findPaths(ctx: EvaluationContext, condition: PathCondition): GraphResult[] {
  const paths: GraphResult[] = [];

  const sourceNodes = ctx.nodes.filter(n => {
    if (n.type !== condition.from.type) return false;
    if (condition.from.isExternal !== undefined) {
      return n.attributes?.isExternal === condition.from.isExternal;
    }
    return true;
  });

  const targetNodes = ctx.nodes.filter(n => n.type === condition.to.type);

  for (const source of sourceNodes) {
    for (const target of targetNodes) {
      const path = findPathBFS(ctx, source.id, target.id, condition.through);
      if (path) {
        paths.push(path);
      }
    }
  }

  return paths;
}

function findPathBFS(
  ctx: EvaluationContext,
  startId: string,
  endId: string,
  throughNature?: string
): GraphResult | null {
  const queue: { nodeId: string; path: string[]; edges: string[] }[] = [
    { nodeId: startId, path: [startId], edges: [] }
  ];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const { nodeId, path, edges } = queue.shift()!;

    if (nodeId === endId) {
      // If throughNature is specified, check if any edge has that nature
      if (throughNature) {
        const hasNature = edges.some(edgeId => {
          const edge = ctx.edgeMap.get(edgeId);
          return edge?.nature === throughNature;
        });
        if (!hasNature) continue;
      }
      return { nodeIds: path, edgeIds: edges };
    }

    const outEdges = ctx.edges.filter(e => e.sourceId === nodeId);
    for (const edge of outEdges) {
      if (!visited.has(edge.targetId)) {
        visited.add(edge.targetId);
        queue.push({
          nodeId: edge.targetId,
          path: [...path, edge.targetId],
          edges: [...edges, edge.id],
        });
      }
    }
  }

  return null;
}

function findHighCentralityNodes(ctx: EvaluationContext, threshold: number): DetectionInput['nodes'] {
  const centrality = new Map<string, number>();

  for (const node of ctx.nodes) {
    const inDegree = ctx.edges.filter(e => e.targetId === node.id).length;
    const outDegree = ctx.edges.filter(e => e.sourceId === node.id).length;
    centrality.set(node.id, inDegree + outDegree);
  }

  const maxCentrality = Math.max(...Array.from(centrality.values()));
  if (maxCentrality === 0) return [];

  return ctx.nodes.filter(n => {
    const nodeCentrality = centrality.get(n.id) || 0;
    return (nodeCentrality / maxCentrality) >= threshold;
  });
}

interface ChainCondition {
  nodeType: string;
  attribute: string;
  value: unknown;
  minLength: number;
}

function findSubcontractingChains(ctx: EvaluationContext, condition: ChainCondition): GraphResult[] {
  const chains: GraphResult[] = [];

  const eligibleNodes = ctx.nodes.filter(n =>
    n.type === condition.nodeType &&
    checkNodeAttribute(n, condition.attribute, condition.value)
  );

  // Find chains of eligible nodes
  for (const startNode of eligibleNodes) {
    const chain = buildChain(ctx, startNode.id, eligibleNodes.map(n => n.id), condition.minLength);
    if (chain) {
      chains.push(chain);
    }
  }

  return chains;
}

function buildChain(
  ctx: EvaluationContext,
  startId: string,
  eligibleIds: string[],
  minLength: number
): GraphResult | null {
  const nodeIds: string[] = [startId];
  const edgeIds: string[] = [];
  let currentId = startId;
  const visited = new Set<string>([startId]);

  while (true) {
    const outEdge = ctx.edges.find(e =>
      e.sourceId === currentId &&
      eligibleIds.includes(e.targetId) &&
      !visited.has(e.targetId)
    );

    if (!outEdge) break;

    visited.add(outEdge.targetId);
    nodeIds.push(outEdge.targetId);
    edgeIds.push(outEdge.id);
    currentId = outEdge.targetId;
  }

  if (nodeIds.length >= minLength) {
    return { nodeIds, edgeIds };
  }

  return null;
}

// ============================================
// ÉVALUATION DES FACTEURS
// ============================================

function evaluateFactor(factor: Factor, ctx: EvaluationContext, matchedData: {
  nodeIds: string[];
  edgeIds: string[];
}): boolean {
  // Simple condition evaluation - in production this would be more sophisticated
  const condition = factor.condition;

  // Check edge conditions
  if (condition.includes('edge.')) {
    for (const edgeId of matchedData.edgeIds) {
      const edge = ctx.edgeMap.get(edgeId);
      if (!edge) continue;

      if (condition.includes('edge.criticality === "CRITICAL"') && edge.criticality === 'CRITICAL') return true;
      if (condition.includes('edge.automation === "AUTO_NO_RECOURSE"') && edge.automation === 'AUTO_NO_RECOURSE') return true;
      if (condition.includes('edge.sensitivity === "HIGHLY_SENSITIVE"') && edge.sensitivity === 'HIGHLY_SENSITIVE') return true;
      if (condition.includes('edge.frequency === "REALTIME"') && edge.frequency === 'REALTIME') return true;
    }
  }

  // Check node conditions
  if (condition.includes('node.')) {
    for (const nodeId of matchedData.nodeIds) {
      const node = ctx.nodeMap.get(nodeId);
      if (!node) continue;

      if (condition.includes('node.retentionPolicy === "indefinite"') &&
          node.attributes?.retentionPolicy === 'indefinite') return true;
    }
  }

  // Check SIA conditions
  if (condition.includes('hasVulnerablePopulation')) {
    return ctx.sia.hasVulnerable === true;
  }

  if (condition.includes('isLargeScale')) {
    return ctx.sia.scale === 'LARGE' || ctx.sia.scale === 'VERY_LARGE';
  }

  // Check contextual boolean conditions
  // These would typically come from additional context or node/edge attributes
  const booleanConditions = [
    'noHITL', 'affectsRights', 'highDegree', 'multipleDecisions', 'personNotInformed',
    'usedForPricing', 'noSLA', 'providerOutsideEU', 'hasFallback', 'hasModelCard',
    'hasExplainability', 'humanValidates', 'hasVersionPinning', 'optOutActivated'
  ];

  for (const bc of booleanConditions) {
    if (condition.includes(bc)) {
      // Check in SIA attributes
      const siaRecord = ctx.sia as unknown as Record<string, unknown>;
      if (siaRecord[bc] !== undefined) {
        return siaRecord[bc] === (condition.includes('=== true') || !condition.includes('=== false'));
      }
    }
  }

  return false;
}

function calculateSeverity(
  rule: DetectionRule,
  ctx: EvaluationContext,
  matchedData: { nodeIds: string[]; edgeIds: string[] }
): { severity: number; activeAggravating: string[]; activeMitigating: string[] } {
  let severity = rule.severityBase;
  const activeAggravating: string[] = [];
  const activeMitigating: string[] = [];

  // Evaluate aggravating factors
  for (const factor of rule.aggravatingFactors) {
    if (evaluateFactor(factor, ctx, matchedData)) {
      severity += factor.severityModifier;
      activeAggravating.push(factor.label);
    }
  }

  // Evaluate mitigating factors
  for (const factor of rule.mitigatingFactors) {
    if (evaluateFactor(factor, ctx, matchedData)) {
      severity += factor.severityModifier; // modifier is negative
      activeMitigating.push(factor.label);
    }
  }

  // Clamp severity between 1 and 5
  severity = Math.max(1, Math.min(5, severity));

  return { severity, activeAggravating, activeMitigating };
}

// ============================================
// ÉVALUATION D'UNE RÈGLE
// ============================================

function evaluateRule(rule: DetectionRule, ctx: EvaluationContext): DetectedDilemma | null {
  const conditions = rule.conditions;
  const matchedNodeIds: string[] = [];
  const matchedEdgeIds: string[] = [];

  // Check SIA conditions
  if (conditions.siaConditions) {
    if (!evaluateSiaConditions(ctx, conditions.siaConditions)) {
      return null;
    }
  }

  // Check node conditions
  if (conditions.nodeConditions) {
    const result = evaluateNodeConditions(ctx, conditions.nodeConditions);
    if (!result.matches) {
      return null;
    }
    matchedNodeIds.push(...result.matchedNodes.map(n => n.id));
  }

  // Check edge conditions
  if (conditions.edgeConditions) {
    const result = evaluateEdgeConditions(ctx, conditions.edgeConditions);
    if (!result.matches) {
      return null;
    }
    matchedEdgeIds.push(...result.matchedEdges.map(e => e.id));
  }

  // Check graph conditions
  if (conditions.graphConditions) {
    const result = evaluateGraphConditions(ctx, conditions.graphConditions);
    if (!result.matches) {
      return null;
    }
    matchedNodeIds.push(...result.matchedNodeIds);
    matchedEdgeIds.push(...result.matchedEdgeIds);
  }

  // If we reach here, all conditions are met
  const matchedData = {
    nodeIds: Array.from(new Set(matchedNodeIds)),
    edgeIds: Array.from(new Set(matchedEdgeIds)),
  };

  // Calculate severity with factors
  const { severity, activeAggravating, activeMitigating } = calculateSeverity(rule, ctx, matchedData);

  // Build formulation from template
  const formulation = buildFormulation(rule.produces.formulationTemplate, ctx, matchedData);
  const mechanism = buildFormulation(rule.produces.mechanismTemplate, ctx, matchedData);

  return {
    id: `dilemma-${rule.id}-${Date.now()}`,
    ruleId: rule.id,
    ruleName: rule.nameFr,
    ruleFamily: rule.family,
    domainA: rule.produces.domainA,
    domainB: rule.produces.domainB,
    formulation,
    mechanism,
    affectedNodeIds: matchedData.nodeIds,
    affectedEdgeIds: matchedData.edgeIds,
    severity,
    severityBase: rule.severityBase,
    activeAggravatingFactors: activeAggravating,
    activeMitigatingFactors: activeMitigating,
    acceptablePatterns: rule.acceptablePatterns,
    requiredEvidences: rule.requiredEvidences,
    questionsToConsider: rule.questionsToConsider,
    stakeholdersToConsult: rule.stakeholdersToConsult,
  };
}

function buildFormulation(
  template: string,
  ctx: EvaluationContext,
  matchedData: { nodeIds: string[]; edgeIds: string[] }
): string {
  let result = template;

  // Replace node placeholders
  if (matchedData.nodeIds.length > 0) {
    const firstNode = ctx.nodeMap.get(matchedData.nodeIds[0]);
    if (firstNode) {
      result = result.replace(/{nodeName}/g, firstNode.label);
      result = result.replace(/{nodeType}/g, firstNode.type);
      result = result.replace(/{provider}/g, String(firstNode.attributes?.provider || 'inconnu'));
    }
  }

  // Replace edge placeholders
  if (matchedData.edgeIds.length > 0) {
    const firstEdge = ctx.edgeMap.get(matchedData.edgeIds[0]);
    if (firstEdge) {
      result = result.replace(/{edgeLabel}/g, firstEdge.label || 'flux');
      result = result.replace(/{edgeIntent}/g, firstEdge.intent || 'traitement');
      result = result.replace(/{automation}/g, firstEdge.automation || 'automatique');
      result = result.replace(/{dataCategories}/g, firstEdge.dataCategories?.join(', ') || 'données');
    }
  }

  // Replace SIA placeholders
  result = result.replace(/{siaName}/g, ctx.sia.name);
  result = result.replace(/{sector}/g, ctx.sia.sector);
  result = result.replace(/{riskLevel}/g, ctx.sia.riskLevel || 'non défini');

  // Clean up remaining placeholders
  result = result.replace(/{[^}]+}/g, '');

  return result;
}

// ============================================
// MOTEUR PRINCIPAL
// ============================================

export interface DilemmaDetectionOptions {
  families?: RuleFamily[];
  maxDilemmas?: number;
  minSeverity?: number;
}

/**
 * Détecte les dilemmes éthiques à partir d'une cartographie
 */
export function detectDilemmas(
  input: DetectionInput,
  options: DilemmaDetectionOptions = {}
): DetectedDilemma[] {
  const {
    families = ['STRUCTURAL', 'DATA', 'DEPENDENCY', 'CONTEXTUAL', 'GOVERNANCE'],
    maxDilemmas = 20,
    minSeverity = 1,
  } = options;

  const ctx = createContext(input);
  const detectedDilemmas: DetectedDilemma[] = [];
  const seenRules = new Set<string>();

  // Get applicable rules
  const applicableRules = ALL_RULES.filter(r => families.includes(r.family));

  // Filter contextual rules by sector
  const filteredRules = applicableRules.filter(r => {
    if (r.family !== 'CONTEXTUAL') return true;
    // Check if rule applies to this sector
    const siaConditions = r.conditions.siaConditions;
    if (!siaConditions) return true;
    const sectorCondition = siaConditions.find(c => c.sector);
    if (!sectorCondition) return true;
    return sectorCondition.sector?.includes(input.sia.sector);
  });

  // Evaluate each rule
  for (const rule of filteredRules) {
    if (seenRules.has(rule.id)) continue;

    try {
      const dilemma = evaluateRule(rule, ctx);
      if (dilemma && dilemma.severity >= minSeverity) {
        detectedDilemmas.push(dilemma);
        seenRules.add(rule.id);
      }
    } catch (error) {
      console.error(`Error evaluating rule ${rule.id}:`, error);
    }
  }

  // Sort by severity descending
  detectedDilemmas.sort((a, b) => b.severity - a.severity);

  // Limit results
  return detectedDilemmas.slice(0, maxDilemmas);
}

// ============================================
// STATISTIQUES ET RÉSUMÉS
// ============================================

export interface DilemmaStats {
  total: number;
  byFamily: Record<RuleFamily, number>;
  bySeverity: {
    critical: number; // 5
    high: number;     // 4
    medium: number;   // 3
    low: number;      // 1-2
  };
  byDomain: Partial<Record<EthicalDomain, number>>;
  topDomainPairs: Array<{ domainA: EthicalDomain; domainB: EthicalDomain; count: number }>;
}

export function getDilemmaStats(dilemmas: DetectedDilemma[]): DilemmaStats {
  const byFamily: Record<RuleFamily, number> = {
    STRUCTURAL: 0,
    DATA: 0,
    DEPENDENCY: 0,
    CONTEXTUAL: 0,
    GOVERNANCE: 0,
  };

  const byDomain: Partial<Record<EthicalDomain, number>> = {};
  const domainPairs = new Map<string, { domainA: EthicalDomain; domainB: EthicalDomain; count: number }>();

  for (const dilemma of dilemmas) {
    // Count by family
    byFamily[dilemma.ruleFamily]++;

    // Count by domain
    byDomain[dilemma.domainA] = (byDomain[dilemma.domainA] || 0) + 1;
    byDomain[dilemma.domainB] = (byDomain[dilemma.domainB] || 0) + 1;

    // Count domain pairs
    const pairKey = `${dilemma.domainA}-${dilemma.domainB}`;
    const existing = domainPairs.get(pairKey);
    if (existing) {
      existing.count++;
    } else {
      domainPairs.set(pairKey, {
        domainA: dilemma.domainA,
        domainB: dilemma.domainB,
        count: 1,
      });
    }
  }

  return {
    total: dilemmas.length,
    byFamily,
    bySeverity: {
      critical: dilemmas.filter(d => d.severity >= 5).length,
      high: dilemmas.filter(d => d.severity === 4).length,
      medium: dilemmas.filter(d => d.severity === 3).length,
      low: dilemmas.filter(d => d.severity <= 2).length,
    },
    byDomain,
    topDomainPairs: Array.from(domainPairs.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}

/**
 * Génère un résumé textuel des dilemmes détectés
 */
export function getDilemmaSummary(dilemmas: DetectedDilemma[]): string {
  if (dilemmas.length === 0) {
    return "Aucun dilemme éthique majeur détecté sur la base de la cartographie fournie. " +
      "Cela ne signifie pas absence de risque. Vous pouvez créer manuellement des dilemmes " +
      "si vous identifiez des points d'attention spécifiques.";
  }

  const stats = getDilemmaStats(dilemmas);
  const criticalCount = stats.bySeverity.critical + stats.bySeverity.high;

  let summary = `${dilemmas.length} dilemme(s) éthique(s) détecté(s)`;

  if (criticalCount > 0) {
    summary += `, dont ${criticalCount} à traiter en priorité`;
  }

  summary += ". ";

  // Top affected domains
  const topDomains = Object.entries(stats.byDomain)
    .sort(([, a], [, b]) => (b || 0) - (a || 0))
    .slice(0, 3)
    .map(([domain]) => domain);

  if (topDomains.length > 0) {
    summary += `Domaines les plus concernés : ${topDomains.join(', ')}.`;
  }

  return summary;
}
