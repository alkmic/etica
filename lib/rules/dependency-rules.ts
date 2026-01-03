// lib/rules/dependency-rules.ts
// Famille E : Règles liées aux dépendances externes (9 règles) - CRITIQUE

import { DetectionRule, EvaluationContext } from './types'

export const DEPENDENCY_RULES: DetectionRule[] = [
  // E-01: API externe critique sans fallback
  {
    id: 'E-01',
    name: 'Critical external API without fallback',
    nameFr: 'API externe critique sans fallback',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      return ctx.nodes.some(n =>
        n.isExternal === true &&
        n.hasFallback !== true &&
        ctx.edges.some(e => e.sourceId === n.id || e.targetId === n.id)
      )
    },
    siaConditions: [{ hasExternalAI: true }],

    produces: {
      domainA: 'MASTERY',
      domainB: 'SECURITY',
      formulationTemplate: 'Une API externe critique n\'a pas de mécanisme de fallback.',
      mechanismTemplate: 'En cas d\'indisponibilité de l\'API externe, le service devient inutilisable sans alternative.',
    },

    severityBase: 4,
    aggravatingFactors: [
      'API utilisée pour des décisions critiques',
      'SLA du fournisseur insuffisant',
      'Pas de mode dégradé prévu',
    ],
    mitigatingFactors: [
      'Fallback vers un processus manuel',
      'Cache des résultats récents',
      'SLA garanti à 99.9%',
    ],

    questionsToConsider: [
      'Que se passe-t-il si l\'API est indisponible ?',
      'Quel est l\'impact business d\'une indisponibilité ?',
    ],
    stakeholdersToConsult: ['Architecte', 'SRE', 'Product Owner'],
    acceptablePatterns: [
      'Mode dégradé avec processus manuel',
      'Cache avec TTL approprié',
      'Multi-provider',
    ],
    requiredEvidences: [
      'Documentation du mode dégradé',
      'Tests de résilience',
      'SLA contractuel',
    ],
  },

  // E-02: Modèle IA externe opaque
  {
    id: 'E-02',
    name: 'Opaque external AI model',
    nameFr: 'Modèle IA externe opaque',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      return ctx.nodes.some(n =>
        n.type === 'AI' &&
        n.isExternal === true &&
        n.isOpaque === true
      )
    },

    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'MASTERY',
      formulationTemplate: 'Un modèle IA externe fonctionne comme une boîte noire.',
      mechanismTemplate: 'L\'organisation utilise un modèle dont elle ne comprend pas le fonctionnement interne.',
    },

    severityBase: 4,
    aggravatingFactors: [
      'Décisions à fort impact',
      'Pas de documentation du modèle',
      'Pas d\'audit possible',
    ],
    mitigatingFactors: [
      'Model card fournie',
      'Audit du fournisseur',
      'Explicabilité post-hoc disponible',
    ],

    questionsToConsider: [
      'Peut-on expliquer les décisions du modèle ?',
      'Le fournisseur est-il transparent sur les biais potentiels ?',
    ],
    stakeholdersToConsult: ['Data Scientist', 'Juriste', 'Éthicien'],
    acceptablePatterns: [
      'Model card ou documentation équivalente',
      'Couche d\'explicabilité locale (LIME, SHAP)',
    ],
    requiredEvidences: [
      'Documentation du modèle',
      'Tests de biais',
      'Audit externe',
    ],
  },

  // E-03: Données via infrastructure tierce
  {
    id: 'E-03',
    name: 'Data through third-party infrastructure',
    nameFr: 'Données via infrastructure tierce',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      const hasExternalInfra = ctx.nodes.some(n =>
        n.type === 'INFRA' &&
        n.isExternal === true
      )
      const hasSensitiveData = ctx.edges.some(e =>
        e.sensitivity === 'SENSITIVE' || e.sensitivity === 'HIGHLY_SENSITIVE'
      )
      return hasExternalInfra && hasSensitiveData
    },
    siaConditions: [{ hasExternalInfra: true }],

    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Des données sensibles transitent par une infrastructure tierce.',
      mechanismTemplate: 'L\'hébergement ou le transit des données chez un tiers expose à des risques de souveraineté et de conformité.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Hébergement hors UE',
      'Fournisseur soumis au Cloud Act',
      'Pas de chiffrement bout-en-bout',
    ],
    mitigatingFactors: [
      'Hébergement UE avec garanties',
      'Chiffrement avec clés maîtrisées',
      'Clauses contractuelles types',
    ],

    questionsToConsider: [
      'Où sont hébergées les données ?',
      'Le fournisseur peut-il accéder aux données en clair ?',
    ],
    stakeholdersToConsult: ['DSI', 'DPO', 'Juriste'],
    acceptablePatterns: [
      'Hébergement souverain',
      'Chiffrement client-side',
      'Binding Corporate Rules',
    ],
    requiredEvidences: [
      'Contrat d\'hébergement',
      'Audit de sécurité',
      'Analyse d\'impact transfert',
    ],
  },

  // E-04: Entraînement sur vos données
  {
    id: 'E-04',
    name: 'Training on your data',
    nameFr: 'Entraînement sur vos données',
    family: 'DEPENDENCY',

    edgeConditions: [{ nature: 'LEARNING' }],
    customCheck: (ctx: EvaluationContext): boolean => {
      return ctx.nodes.some(n => n.type === 'AI' && n.isExternal === true) &&
             ctx.edges.some(e => e.nature === 'LEARNING')
    },

    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'LOYALTY',
      formulationTemplate: 'Le fournisseur utilise vos données pour entraîner ses modèles.',
      mechanismTemplate: 'Les données de l\'organisation alimentent l\'amélioration du modèle du fournisseur, potentiellement au bénéfice de concurrents.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Données propriétaires ou stratégiques',
      'Pas d\'opt-out contractuel',
      'Fournisseur servant des concurrents',
    ],
    mitigatingFactors: [
      'Opt-out contractuel effectif',
      'Données anonymisées avant entraînement',
    ],

    questionsToConsider: [
      'Vos données servent-elles à améliorer le service pour d\'autres ?',
      'Avez-vous un droit de veto sur l\'utilisation pour l\'entraînement ?',
    ],
    stakeholdersToConsult: ['Juriste', 'DSI', 'Direction'],
    acceptablePatterns: [
      'Clause d\'opt-out explicite',
      'Instance dédiée sans partage',
    ],
    requiredEvidences: [
      'Contrat avec clause de non-utilisation',
      'Confirmation écrite du fournisseur',
    ],
  },

  // E-05: Fournisseur unique (vendor lock-in)
  {
    id: 'E-05',
    name: 'Single vendor dependency',
    nameFr: 'Dépendance à un fournisseur unique',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      const externalProviders = new Set(
        ctx.nodes
          .filter(n => n.isExternal && n.provider)
          .map(n => n.provider)
      )
      return ctx.nodes.filter(n => n.isExternal).length >= 3 && externalProviders.size === 1
    },

    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'MASTERY',
      formulationTemplate: 'L\'ensemble du système dépend d\'un fournisseur unique.',
      mechanismTemplate: 'La concentration chez un seul fournisseur crée un risque de lock-in et limite la capacité de négociation.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Pas de standard d\'interopérabilité',
      'Coûts de sortie élevés',
      'Fournisseur en position dominante',
    ],
    mitigatingFactors: [
      'APIs standardisées',
      'Plan de sortie documenté',
      'Compétences internes maintenues',
    ],

    questionsToConsider: [
      'Pouvez-vous changer de fournisseur en moins de 6 mois ?',
      'Quels seraient les coûts de migration ?',
    ],
    stakeholdersToConsult: ['DSI', 'Achats', 'Direction'],
    acceptablePatterns: [
      'Architecture multi-cloud',
      'Abstraction des APIs fournisseur',
    ],
    requiredEvidences: [
      'Plan de réversibilité',
      'Évaluation des coûts de sortie',
    ],
  },

  // E-06: Mises à jour non contrôlées
  {
    id: 'E-06',
    name: 'Uncontrolled updates',
    nameFr: 'Mises à jour non contrôlées',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      return ctx.nodes.some(n =>
        n.type === 'AI' &&
        n.isExternal === true
      )
    },

    produces: {
      domainA: 'MASTERY',
      domainB: 'SECURITY',
      formulationTemplate: 'Le fournisseur peut mettre à jour le modèle sans préavis.',
      mechanismTemplate: 'Une mise à jour non contrôlée peut modifier le comportement du système et introduire des régressions.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Pas de notification des mises à jour',
      'Pas d\'environnement de test',
      'Décisions critiques impactées',
    ],
    mitigatingFactors: [
      'Version pinning disponible',
      'Changelog fourni',
      'Environnement de staging',
    ],

    questionsToConsider: [
      'Êtes-vous notifié avant une mise à jour ?',
      'Pouvez-vous tester avant mise en production ?',
    ],
    stakeholdersToConsult: ['DevOps', 'QA', 'Product Owner'],
    acceptablePatterns: [
      'Version pinning avec fenêtre de migration',
      'Environnement de test automatisé',
    ],
    requiredEvidences: [
      'SLA avec préavis de mise à jour',
      'Procédure de test post-update',
    ],
  },

  // E-07: Chaîne de sous-traitance
  {
    id: 'E-07',
    name: 'Subcontracting chain',
    nameFr: 'Chaîne de sous-traitance',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie si des nœuds externes utilisent eux-mêmes des services externes
      return ctx.nodes.filter(n => n.isExternal).length >= 2
    },

    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'Votre fournisseur utilise lui-même des sous-traitants.',
      mechanismTemplate: 'La chaîne de sous-traitance complexifie la traçabilité et dilue les responsabilités.',
    },

    severityBase: 2,
    aggravatingFactors: [
      'Sous-traitants non identifiés',
      'Pas de clause de transparence',
    ],
    mitigatingFactors: [
      'Liste des sous-traitants fournie',
      'Audits en cascade',
    ],

    questionsToConsider: [
      'Connaissez-vous tous les sous-traitants impliqués ?',
      'Les contrats prévoient-ils une transparence sur la chaîne ?',
    ],
    stakeholdersToConsult: ['Achats', 'DPO', 'Juriste'],
    acceptablePatterns: [
      'Clause de transparence sur les sous-traitants',
      'Droit d\'audit sur la chaîne',
    ],
    requiredEvidences: [
      'Liste des sous-traitants',
      'Contrats avec clause de transparence',
    ],
  },

  // E-08: Localisation hors UE
  {
    id: 'E-08',
    name: 'Non-EU data location',
    nameFr: 'Localisation des données hors UE',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      const euLocations = ['EU', 'EEA', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Portugal', 'Ireland']
      return ctx.nodes.some(n =>
        n.isExternal === true &&
        n.attributes?.location &&
        !euLocations.includes(n.attributes.location as string)
      )
    },

    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Des données sont traitées ou stockées hors de l\'UE.',
      mechanismTemplate: 'Le transfert de données hors UE expose à des risques réglementaires (RGPD) et de souveraineté.',
    },

    severityBase: 4,
    aggravatingFactors: [
      'Pays sans décision d\'adéquation',
      'Données sensibles concernées',
      'Fournisseur soumis à des lois extraterritoriales',
    ],
    mitigatingFactors: [
      'Clauses contractuelles types',
      'Chiffrement avec clés en UE',
      'BCR en place',
    ],

    questionsToConsider: [
      'Où sont exactement hébergées et traitées les données ?',
      'Quelles garanties juridiques sont en place ?',
    ],
    stakeholdersToConsult: ['DPO', 'Juriste', 'DSI'],
    acceptablePatterns: [
      'Hébergement UE garanti',
      'Transfert avec CCT et mesures supplémentaires',
    ],
    requiredEvidences: [
      'Attestation de localisation',
      'CCT signées',
      'Analyse d\'impact transfert',
    ],
  },

  // E-09: Impact environnemental compute
  {
    id: 'E-09',
    name: 'Compute environmental impact',
    nameFr: 'Impact environnemental du compute',
    family: 'DEPENDENCY',

    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie si des modèles IA lourds sont utilisés fréquemment
      const hasLLM = ctx.nodes.some(n =>
        n.type === 'AI' &&
        n.subtype?.toLowerCase().includes('llm')
      )
      const isLargeScale = ctx.sia.userScale !== 'TINY' && ctx.sia.userScale !== 'SMALL'
      return hasLLM && isLargeScale
    },

    produces: {
      domainA: 'SUSTAINABILITY',
      domainB: 'MASTERY',
      formulationTemplate: 'L\'utilisation intensive de modèles IA a un impact environnemental significatif.',
      mechanismTemplate: 'Les inférences répétées sur des modèles volumineux consomment de l\'énergie et génèrent des émissions de CO2.',
    },

    severityBase: 2,
    aggravatingFactors: [
      'Modèle très large (>100B paramètres)',
      'Datacenter non vert',
      'Millions de requêtes par jour',
    ],
    mitigatingFactors: [
      'Datacenter alimenté en renouvelable',
      'Optimisation des requêtes (caching)',
      'Modèle distillé ou quantifié',
    ],

    questionsToConsider: [
      'L\'usage du modèle est-il proportionné au besoin ?',
      'Des optimisations sont-elles possibles ?',
    ],
    stakeholdersToConsult: ['RSE', 'Data Science', 'Ops'],
    acceptablePatterns: [
      'Choix de datacenter vert',
      'Cache intelligent des résultats',
      'Modèle adapté à la tâche (pas de sur-dimensionnement)',
    ],
    requiredEvidences: [
      'Bilan carbone estimé',
      'Politique de choix des modèles',
    ],
  },
]
