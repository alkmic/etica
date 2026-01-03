// lib/rules/data-rules.ts
// Famille D : Règles liées aux données (6 règles)

import { DetectionRule, EvaluationContext } from './types'

export const DATA_RULES: DetectionRule[] = [
  // D-01: Données sensibles + décision automatique
  {
    id: 'D-01',
    name: 'Sensitive data with auto-decision',
    nameFr: 'Données sensibles avec décision automatique',
    family: 'DATA',

    edgeConditions: [
      { sensitivityMin: 'SENSITIVE' },
      { automation: ['AUTO_NO_RECOURSE', 'AUTO_WITH_RECOURSE'] },
    ],

    produces: {
      domainA: 'PRIVACY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Des données sensibles alimentent une décision automatique sans intervention humaine.',
      mechanismTemplate: 'Le traitement automatisé de données sensibles peut conduire à des décisions impactantes sans que l\'individu puisse s\'y opposer.',
    },

    severityBase: 4,
    aggravatingFactors: [
      'Données de santé ou biométriques',
      'Décision avec impact légal ou financier',
      'Absence de consentement explicite',
    ],
    mitigatingFactors: [
      'Consentement explicite et éclairé',
      'Droit d\'opposition effectif',
      'Revue humaine possible sur demande',
    ],

    questionsToConsider: [
      'Le consentement couvre-t-il ce traitement spécifique ?',
      'L\'utilisateur peut-il s\'opposer à la décision automatique ?',
    ],
    stakeholdersToConsult: ['DPO', 'Juriste', 'Utilisateurs'],
    acceptablePatterns: [
      'Article 22 RGPD respecté (intervention humaine possible)',
      'Consentement granulaire avec opt-out',
    ],
    requiredEvidences: [
      'Formulaire de consentement',
      'Procédure d\'opposition',
      'AIPD réalisée',
    ],
  },

  // D-02: Données inférées
  {
    id: 'D-02',
    name: 'Inferred data usage',
    nameFr: 'Utilisation de données inférées',
    family: 'DATA',

    edgeConditions: [
      { nature: 'INFERENCE' },
      { dataCategories: ['INFERRED'] },
    ],

    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Le système infère des données non fournies par l\'utilisateur.',
      mechanismTemplate: 'Des caractéristiques personnelles sont déduites algorithmiquement sans que l\'utilisateur en soit informé ou puisse les contester.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Inférence de catégories sensibles (origine, orientation, santé)',
      'Utilisation pour des décisions impactantes',
    ],
    mitigatingFactors: [
      'Information claire sur les inférences réalisées',
      'Droit de rectification effectif',
    ],

    questionsToConsider: [
      'L\'utilisateur sait-il quelles données sont inférées ?',
      'Peut-il contester ou corriger ces inférences ?',
    ],
    stakeholdersToConsult: ['DPO', 'Data Scientist', 'UX Designer'],
    acceptablePatterns: [
      'Tableau de bord montrant les données inférées',
      'Processus de contestation simple',
    ],
    requiredEvidences: [
      'Documentation des inférences réalisées',
      'Interface de transparence utilisateur',
    ],
  },

  // D-03: Profilage comportemental
  {
    id: 'D-03',
    name: 'Behavioral profiling',
    nameFr: 'Profilage comportemental',
    family: 'DATA',

    edgeConditions: [
      { dataCategories: ['BEHAVIORAL'] },
      { nature: ['COLLECT', 'INFERENCE', 'LEARNING'] },
    ],

    produces: {
      domainA: 'AUTONOMY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Le système collecte et analyse les comportements pour créer un profil utilisateur.',
      mechanismTemplate: 'L\'analyse comportementale peut conduire à une personnalisation qui enferme l\'utilisateur dans une bulle ou le manipule.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Profiling pour de la personnalisation addictive',
      'Absence d\'opt-out',
      'Partage du profil avec des tiers',
    ],
    mitigatingFactors: [
      'Profiling pour améliorer l\'expérience utilisateur uniquement',
      'Opt-out facile',
      'Pas de partage externe',
    ],

    questionsToConsider: [
      'Le profiling sert-il vraiment l\'utilisateur ?',
      'Y a-t-il un risque de manipulation ?',
    ],
    stakeholdersToConsult: ['Éthicien', 'UX Designer', 'DPO'],
    acceptablePatterns: [
      'Profiling opt-in avec bénéfice clair pour l\'utilisateur',
      'Possibilité de réinitialiser son profil',
    ],
    requiredEvidences: [
      'Documentation de la finalité du profiling',
      'Interface de gestion du profil',
    ],
  },

  // D-04: Conservation longue durée
  {
    id: 'D-04',
    name: 'Long retention period',
    nameFr: 'Conservation longue durée',
    family: 'DATA',

    edgeConditions: [
      { nature: 'STORAGE' },
      { sensitivityMin: 'STANDARD' },
    ],
    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie si des flux de stockage existent avec des données sensibles
      return ctx.edges.some(e => e.nature === 'STORAGE' && e.sensitivity !== 'STANDARD')
    },

    produces: {
      domainA: 'PRIVACY',
      domainB: 'SUSTAINABILITY',
      formulationTemplate: 'Les données sont conservées au-delà de ce qui est nécessaire.',
      mechanismTemplate: 'Une conservation prolongée augmente les risques de fuite et l\'empreinte environnementale.',
    },

    severityBase: 2,
    aggravatingFactors: [
      'Données sensibles',
      'Pas de justification légale',
      'Stockage non chiffré',
    ],
    mitigatingFactors: [
      'Obligation légale de conservation',
      'Anonymisation après la période active',
    ],

    questionsToConsider: [
      'La durée de conservation est-elle justifiée ?',
      'Les données sont-elles anonymisées après usage ?',
    ],
    stakeholdersToConsult: ['DPO', 'Juriste', 'DSI'],
    acceptablePatterns: [
      'Politique de rétention documentée et justifiée',
      'Anonymisation automatique après X mois',
    ],
    requiredEvidences: [
      'Politique de rétention',
      'Logs de purge/anonymisation',
    ],
  },

  // D-05: Fusion de sources
  {
    id: 'D-05',
    name: 'Data source fusion',
    nameFr: 'Fusion de sources de données',
    family: 'DATA',

    edgeConditions: [
      { nature: 'ENRICHMENT' },
    ],
    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie si un nœud reçoit des données de plusieurs sources
      const nodesWithMultipleSources = ctx.nodes.filter(n => {
        const incomingEdges = ctx.edges.filter(e => e.targetId === n.id)
        return incomingEdges.length >= 2
      })
      return nodesWithMultipleSources.length > 0
    },

    produces: {
      domainA: 'PRIVACY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Des données de sources multiples sont fusionnées pour enrichir les profils.',
      mechanismTemplate: 'La combinaison de données de sources différentes peut révéler des informations que l\'utilisateur n\'a pas explicitement fournies.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Sources externes non maîtrisées',
      'Pas d\'information de l\'utilisateur',
    ],
    mitigatingFactors: [
      'Sources internes uniquement',
      'Information claire dans la politique de confidentialité',
    ],

    questionsToConsider: [
      'L\'utilisateur est-il informé des sources utilisées ?',
      'Les sources sont-elles fiables et légitimes ?',
    ],
    stakeholdersToConsult: ['DPO', 'Data Engineer'],
    acceptablePatterns: [
      'Liste des sources dans la politique de confidentialité',
      'Droit d\'accès effectif à toutes les données',
    ],
    requiredEvidences: [
      'Inventaire des sources de données',
      'Contrats avec les fournisseurs de données',
    ],
  },

  // D-06: Traçabilité exhaustive
  {
    id: 'D-06',
    name: 'Exhaustive traceability',
    nameFr: 'Traçabilité exhaustive',
    family: 'DATA',

    edgeConditions: [
      { nature: ['COLLECT', 'STORAGE'] },
      { intent: 'SURVEILLANCE' },
    ],

    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Une traçabilité exhaustive des actions utilisateur est mise en place.',
      mechanismTemplate: 'La collecte systématique de toutes les actions peut créer un sentiment de surveillance et porter atteinte à la vie privée.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Traçabilité non annoncée',
      'Utilisation pour évaluer la performance individuelle',
    ],
    mitigatingFactors: [
      'Finalité de sécurité uniquement',
      'Anonymisation des logs',
    ],

    questionsToConsider: [
      'La traçabilité est-elle proportionnée à la finalité ?',
      'Les utilisateurs en sont-ils informés ?',
    ],
    stakeholdersToConsult: ['DPO', 'DRH', 'CSE'],
    acceptablePatterns: [
      'Traçabilité anonymisée ou pseudonymisée',
      'Information claire des utilisateurs',
    ],
    requiredEvidences: [
      'Charte de traçabilité',
      'Avis du CSE si applicable',
    ],
  },
]
