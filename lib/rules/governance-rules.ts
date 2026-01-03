// lib/rules/governance-rules.ts
// Famille G : Règles de gouvernance (7 règles)

import { DetectionRule, EvaluationContext } from './types'

export const GOVERNANCE_RULES: DetectionRule[] = [
  // G-01: Pas de responsable identifié
  {
    id: 'G-01',
    name: 'No identified responsible party',
    nameFr: 'Pas de responsable identifié',
    family: 'GOVERNANCE',

    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie qu'il n'y a pas de nœud ORG avec un rôle de supervision
      return !ctx.nodes.some(n =>
        n.type === 'ORG' &&
        n.subtype?.toLowerCase().includes('governance')
      )
    },

    produces: {
      domainA: 'RESPONSIBILITY',
      domainB: 'MASTERY',
      formulationTemplate: 'Aucun responsable n\'est clairement identifié pour le système.',
      mechanismTemplate: 'En cas de dysfonctionnement, on ne sait pas qui est accountable.',
    },

    severityBase: 3,
    aggravatingFactors: ['Système critique', 'Multiples équipes impliquées'],
    mitigatingFactors: ['Gouvernance projet claire', 'RACI documenté'],

    questionsToConsider: ['Qui est responsable en cas de problème ?', 'Le RACI est-il à jour ?'],
    stakeholdersToConsult: ['Direction', 'PMO', 'Juriste'],
    acceptablePatterns: ['RACI documenté et à jour', 'Responsable IA désigné'],
    requiredEvidences: ['Matrice RACI', 'Fiche de poste responsable'],
  },

  // G-02: Pas de procédure de contestation
  {
    id: 'G-02',
    name: 'No contestation procedure',
    nameFr: 'Pas de procédure de contestation',
    family: 'GOVERNANCE',

    siaConditions: [{ decisionTypes: ['AUTO_DECISION', 'ASSISTED_DECISION'] }],

    produces: {
      domainA: 'RECOURSE',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Il n\'existe pas de procédure formelle pour contester les décisions.',
      mechanismTemplate: 'Les personnes impactées ne savent pas comment faire valoir leurs droits.',
    },

    severityBase: 4,
    aggravatingFactors: ['Décisions à fort impact', 'Obligation légale non respectée'],
    mitigatingFactors: ['Canal informel existant'],

    questionsToConsider: ['Comment un utilisateur peut-il contester ?', 'Le délai est-il raisonnable ?'],
    stakeholdersToConsult: ['Juriste', 'Service client', 'DPO'],
    acceptablePatterns: ['Procédure documentée et accessible', 'SLA de traitement'],
    requiredEvidences: ['Procédure de contestation', 'Statistiques de traitement'],
  },

  // G-03: Documentation insuffisante
  {
    id: 'G-03',
    name: 'Insufficient documentation',
    nameFr: 'Documentation insuffisante',
    family: 'GOVERNANCE',

    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie si le système a des nœuds AI sans documentation explicite
      return ctx.nodes.some(n => n.type === 'AI')
    },

    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'MASTERY',
      formulationTemplate: 'Le système n\'est pas suffisamment documenté.',
      mechanismTemplate: 'L\'absence de documentation rend le système difficile à auditer et maintenir.',
    },

    severityBase: 2,
    aggravatingFactors: ['Système critique', 'Turnover élevé'],
    mitigatingFactors: ['Documentation partielle', 'Experts internes disponibles'],

    questionsToConsider: ['Un nouvel arrivant peut-il comprendre le système ?', 'La documentation est-elle à jour ?'],
    stakeholdersToConsult: ['Tech Lead', 'QA', 'Nouveaux arrivants'],
    acceptablePatterns: ['Documentation technique à jour', 'README et ADR'],
    requiredEvidences: ['Documentation technique', 'Historique des décisions'],
  },

  // G-04: Pas de test de biais
  {
    id: 'G-04',
    name: 'No bias testing',
    nameFr: 'Pas de test de biais',
    family: 'GOVERNANCE',

    customCheck: (ctx: EvaluationContext): boolean => {
      return ctx.nodes.some(n => n.type === 'AI')
    },

    produces: {
      domainA: 'EQUITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Aucun test de biais n\'a été réalisé sur le système.',
      mechanismTemplate: 'Des biais peuvent exister sans être détectés ni corrigés.',
    },

    severityBase: 4,
    aggravatingFactors: ['Décisions RH ou crédit', 'Données historiques biaisées'],
    mitigatingFactors: ['Tests en cours', 'Données de test diversifiées'],

    questionsToConsider: ['Les biais ont-ils été recherchés ?', 'Sur quels critères protégés ?'],
    stakeholdersToConsult: ['Data Scientist', 'Éthicien', 'DRH'],
    acceptablePatterns: ['Tests de biais réguliers', 'Métriques de fairness suivies'],
    requiredEvidences: ['Rapport de test de biais', 'Métriques de fairness'],
  },

  // G-05: Pas de revue programmée
  {
    id: 'G-05',
    name: 'No scheduled review',
    nameFr: 'Pas de revue programmée',
    family: 'GOVERNANCE',

    customCheck: (ctx: EvaluationContext): boolean => {
      return !ctx.sia.nextReviewDate
    },

    produces: {
      domainA: 'MASTERY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'Aucune revue périodique n\'est planifiée pour le système.',
      mechanismTemplate: 'Le système peut dériver sans que personne ne s\'en aperçoive.',
    },

    severityBase: 2,
    aggravatingFactors: ['Système en production depuis longtemps', 'Environnement changeant'],
    mitigatingFactors: ['Monitoring continu', 'Alertes sur dérive'],

    questionsToConsider: ['Quand le système a-t-il été revu pour la dernière fois ?'],
    stakeholdersToConsult: ['Product Owner', 'Compliance'],
    acceptablePatterns: ['Revue annuelle minimum', 'Revue sur trigger'],
    requiredEvidences: ['Calendrier de revue', 'Comptes-rendus de revue'],
  },

  // G-06: Innovation rapide sans validation
  {
    id: 'G-06',
    name: 'Rapid innovation without validation',
    nameFr: 'Innovation rapide sans validation',
    family: 'GOVERNANCE',

    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie si le système utilise des modèles récents sans période de test
      return ctx.nodes.some(n =>
        n.type === 'AI' &&
        n.isExternal === true
      )
    },

    produces: {
      domainA: 'SECURITY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'De nouvelles technologies sont déployées sans validation suffisante.',
      mechanismTemplate: 'La pression au time-to-market peut conduire à déployer des systèmes non matures.',
    },

    severityBase: 3,
    aggravatingFactors: ['Pas de phase pilote', 'Système critique'],
    mitigatingFactors: ['Feature flags', 'Déploiement progressif'],

    questionsToConsider: ['Le système a-t-il été testé en conditions réelles ?'],
    stakeholdersToConsult: ['QA', 'Product Owner', 'Compliance'],
    acceptablePatterns: ['Phase pilote obligatoire', 'Rollback automatique'],
    requiredEvidences: ['Plan de test', 'Résultats de pilote'],
  },

  // G-07: Open source sans contrôle mésusage
  {
    id: 'G-07',
    name: 'Open source without misuse control',
    nameFr: 'Open source sans contrôle mésusage',
    family: 'GOVERNANCE',

    customCheck: (ctx: EvaluationContext): boolean => {
      // Si le système est destiné à être partagé/ouvert
      return ctx.sia.misuseScenarios !== undefined && ctx.sia.misuseScenarios.length === 0
    },

    produces: {
      domainA: 'RESPONSIBILITY',
      domainB: 'SOCIETAL_BALANCE',
      formulationTemplate: 'Le système pourrait être réutilisé de manière malveillante.',
      mechanismTemplate: 'L\'absence de contrôle sur l\'usage peut permettre des détournements préjudiciables.',
    },

    severityBase: 2,
    aggravatingFactors: ['Capacités dangereuses', 'Pas de licence restrictive'],
    mitigatingFactors: ['Licence éthique', 'Monitoring des usages'],

    questionsToConsider: ['Quels mésusages sont possibles ?', 'Comment les prévenir ?'],
    stakeholdersToConsult: ['Juriste', 'Éthicien', 'Direction'],
    acceptablePatterns: ['Licence avec clause éthique', 'Registry d\'usages'],
    requiredEvidences: ['Analyse de mésusage', 'Licence appropriée'],
  },
]
