// lib/rules/structural-rules.ts
// Famille S : Règles structurelles (analyse du graphe)

import { DetectionRule } from './types';

export const STRUCTURAL_RULES: DetectionRule[] = [
  {
    id: 'S-01',
    name: 'Closed decision loop without HITL',
    nameFr: 'Boucle décisionnelle fermée sans intervention humaine',
    family: 'STRUCTURAL',
    conditions: {
      graphConditions: [
        { hasLoop: true },
      ],
      edgeConditions: [
        { nature: ['DECISION', 'INFERENCE'] },
        { automation: ['AUTO_WITH_RECOURSE', 'AUTO_NO_RECOURSE'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'RECOURSE',
      formulationTemplate: 'Une boucle de décision automatique existe sans point d\'intervention humaine.',
      mechanismTemplate: 'Le graphe contient un cycle impliquant {nodeNames} où des décisions automatiques s\'enchaînent sans possibilité d\'interruption humaine.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'edge.automation === "AUTO_NO_RECOURSE"', label: 'Aucun recours possible', severityModifier: +1 },
      { condition: 'sia.hasVulnerable === true', label: 'Population vulnérable concernée', severityModifier: +1 },
      { condition: 'edge.isReversible === false', label: 'Décision irréversible', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasHumanSupervisor === true', label: 'Superviseur humain présent', severityModifier: -1 },
      { condition: 'hasAlertSystem === true', label: 'Système d\'alerte en place', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Ajout d\'un HITL (Human-in-the-loop) à un point de la boucle',
      'Système de pause automatique après N itérations',
      'Alertes + intervention humaine asynchrone',
    ],
    requiredEvidences: [
      'Documentation du point d\'intervention humaine',
      'Logs des interventions effectives',
      'Procédure d\'escalade documentée',
    ],
    questionsToConsider: [
      'Une personne peut-elle interrompre le processus si elle détecte un problème ?',
      'Existe-t-il un mécanisme de contestation après la décision ?',
      'Combien de décisions peuvent s\'enchaîner avant alerte ?',
    ],
    stakeholdersToConsult: ['DPO', 'Responsable qualité', 'Représentants des utilisateurs'],
  },

  {
    id: 'S-02',
    name: 'Decision concentration',
    nameFr: 'Concentration décisionnelle',
    family: 'STRUCTURAL',
    conditions: {
      graphConditions: [
        { centralityThreshold: { nodeCondition: { type: 'AI' }, threshold: 0.5 } },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'MASTERY',
      formulationTemplate: 'Un seul composant ({nodeName}) centralise plus de 50% des décisions.',
      mechanismTemplate: 'Le nœud {nodeName} a une centralité de {centrality}%, créant un point unique de défaillance.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'node.isExternal === true', label: 'Composant externe', severityModifier: +1 },
      { condition: 'node.hasFallback === false', label: 'Pas de fallback', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'node.hasFallback === true', label: 'Fallback documenté', severityModifier: -1 },
      { condition: 'hasRedundancy === true', label: 'Redondance en place', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Documentation d\'un fallback manuel',
      'Architecture distribuée avec load-balancing',
      'Plan de continuité d\'activité',
    ],
    requiredEvidences: [
      'Documentation du fallback',
      'Test de bascule effectué',
      'SLA du composant central',
    ],
    questionsToConsider: [
      'Que se passe-t-il si ce composant est indisponible 24h ?',
      'Peut-on distribuer les décisions sur plusieurs composants ?',
    ],
    stakeholdersToConsult: ['Architecte technique', 'Responsable continuité'],
  },

  {
    id: 'S-03',
    name: 'Decision cascade',
    nameFr: 'Cascade décisionnelle',
    family: 'STRUCTURAL',
    conditions: {
      nodeConditions: [
        { type: 'AI', attribute: 'autonomyLevel', value: ['decisive', 'autonomous'] },
      ],
      graphConditions: [
        { hasPathBetween: { from: { type: 'AI' }, to: { type: 'AI' } } },
      ],
      edgeConditions: [
        { nature: 'DECISION' },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Des décisions automatiques s\'enchaînent en cascade.',
      mechanismTemplate: 'Une décision de {sourceNode} déclenche automatiquement une décision de {targetNode}, multipliant les impacts.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'cascadeDepth > 2', label: 'Cascade profonde (>2 niveaux)', severityModifier: +1 },
      { condition: 'noIntermediateHuman === true', label: 'Aucun humain entre les décisions', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasStopCondition === true', label: 'Condition d\'arrêt définie', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Insertion de points de validation humaine',
      'Conditions d\'arrêt automatiques',
      'Limite du nombre de décisions en cascade',
    ],
    requiredEvidences: [
      'Documentation des chaînes de décision',
      'Tests de scénarios extrêmes',
    ],
    questionsToConsider: [
      'Peut-on arrêter la cascade si une décision intermédiaire est erronée ?',
      'Les effets cumulés sont-ils compris ?',
    ],
    stakeholdersToConsult: ['Architecte système', 'Risk manager'],
  },

  {
    id: 'S-04',
    name: 'Point of no return',
    nameFr: 'Point de non-retour',
    family: 'STRUCTURAL',
    conditions: {
      edgeConditions: [
        { nature: ['DECISION', 'NOTIFICATION'] },
        { isReversible: false },
      ],
      nodeConditions: [
        { type: 'HUMAN', attribute: 'canAppeal', value: false },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Une décision irréversible est communiquée sans possibilité de recours.',
      mechanismTemplate: 'Le flux {edgeLabel} transmet une décision irréversible à {targetNode} qui ne peut pas faire appel.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'edge.automation === "AUTO_NO_RECOURSE"', label: 'Automatique sans recours', severityModifier: +1 },
      { condition: 'impactIsSignificant === true', label: 'Impact significatif sur la personne', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasGracePeriod === true', label: 'Période de grâce avant application', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Période de grâce avant application définitive',
      'Procédure d\'appel même a posteriori',
      'Notification anticipée avant décision finale',
    ],
    requiredEvidences: [
      'Procédure d\'appel documentée',
      'Statistiques sur les recours',
    ],
    questionsToConsider: [
      'La personne a-t-elle le temps de réagir avant que la décision soit définitive ?',
      'Existe-t-il un moyen de revenir en arrière même après ?',
    ],
    stakeholdersToConsult: ['Juridique', 'Service client'],
  },

  {
    id: 'S-05',
    name: 'No human supervisor in critical path',
    nameFr: 'Absence de superviseur humain sur chemin critique',
    family: 'STRUCTURAL',
    conditions: {
      graphConditions: [
        { noPathToNode: { type: 'HUMAN', attribute: 'decisionPower', value: ['blocking', 'final'] } },
      ],
      edgeConditions: [
        { criticality: 'CRITICAL' },
        { automation: ['SEMI_AUTO', 'AUTO_WITH_RECOURSE', 'AUTO_NO_RECOURSE'] },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'Aucun superviseur humain n\'a de pouvoir de blocage sur le chemin critique.',
      mechanismTemplate: 'Les flux critiques ({edgeCount}) n\'ont aucun chemin vers un humain avec pouvoir de blocage.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'sia.decisionType === "AUTO_DECISION"', label: 'Décision entièrement automatique', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasAsyncReview === true', label: 'Revue asynchrone systématique', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Ajout d\'un rôle superviseur avec pouvoir de blocage',
      'Revue asynchrone avec possibilité d\'annulation',
      'Validation humaine pour les cas à haut risque',
    ],
    requiredEvidences: [
      'Organigramme avec rôles de supervision',
      'Logs des interventions de superviseurs',
    ],
    questionsToConsider: [
      'Qui peut arrêter le système en cas de problème ?',
      'Le superviseur a-t-il vraiment le pouvoir d\'intervenir ?',
    ],
    stakeholdersToConsult: ['Direction', 'Responsable opérations'],
  },

  {
    id: 'S-06',
    name: 'Multiple data sources without aggregation control',
    nameFr: 'Sources multiples sans contrôle d\'agrégation',
    family: 'STRUCTURAL',
    conditions: {
      graphConditions: [
        { multipleSourcesTo: { type: 'AI' } },
      ],
      nodeConditions: [
        { type: 'INFRA', attribute: 'infraType', value: ['database', 'data_lake'] },
      ],
    },
    produces: {
      domainA: 'PRIVACY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Plusieurs sources de données convergent vers un même composant IA sans traçabilité.',
      mechanismTemplate: 'Le nœud {targetNode} reçoit des données de {sourceCount} sources différentes, risquant une agrégation non documentée.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'sourceCount > 5', label: 'Plus de 5 sources', severityModifier: +1 },
      { condition: 'containsSensitive === true', label: 'Contient des données sensibles', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasDataLineage === true', label: 'Lignage des données documenté', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Documentation du lignage de données',
      'Contrôle des agrégations autorisées',
      'Audit trail des transformations',
    ],
    requiredEvidences: [
      'Schéma de lignage des données',
      'Politique d\'agrégation',
    ],
    questionsToConsider: [
      'Peut-on retracer l\'origine de chaque donnée ?',
      'Les utilisateurs savent-ils quelles sources sont combinées ?',
    ],
    stakeholdersToConsult: ['Data engineer', 'DPO'],
  },
];
