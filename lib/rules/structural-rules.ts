// lib/rules/structural-rules.ts
// Famille S : Règles structurelles (5 règles)

import { DetectionRule, EvaluationContext } from './types'

export const STRUCTURAL_RULES: DetectionRule[] = [
  // S-01: Boucle fermée sans intervention humaine
  {
    id: 'S-01',
    name: 'Closed loop without human oversight',
    nameFr: 'Boucle fermée sans supervision humaine',
    family: 'STRUCTURAL',

    graphConditions: [{ hasClosedLoop: true }],
    edgeConditions: [{ automation: ['AUTO_NO_RECOURSE', 'AUTO_WITH_RECOURSE'] }],

    produces: {
      domainA: 'RECOURSE',
      domainB: 'MASTERY',
      formulationTemplate: 'Le système fonctionne en boucle fermée sans point d\'intervention humaine, créant une tension entre recours et maîtrise.',
      mechanismTemplate: 'Une décision automatique alimente directement une autre décision automatique, sans possibilité d\'intervention ou de correction humaine dans la chaîne.',
    },

    severityBase: 4,
    aggravatingFactors: [
      'Décisions ayant un impact significatif sur les personnes',
      'Absence de mécanisme d\'arrêt d\'urgence',
      'Traitement de données sensibles',
    ],
    mitigatingFactors: [
      'Monitoring en temps réel avec alertes',
      'Revue humaine périodique des décisions',
      'Mécanisme de rollback automatique',
    ],

    questionsToConsider: [
      'Quel est l\'impact d\'une erreur non détectée dans cette boucle ?',
      'Combien de temps une erreur peut-elle persister avant d\'être détectée ?',
      'Existe-t-il un mécanisme d\'arrêt d\'urgence ?',
    ],
    stakeholdersToConsult: ['DPO', 'Responsable opérationnel', 'Utilisateurs finaux'],
    acceptablePatterns: [
      'Monitoring avec seuils d\'alerte et intervention automatique',
      'Revue humaine quotidienne des décisions prises',
      'Circuit-breaker avec escalade automatique',
    ],
    requiredEvidences: [
      'Procédure de monitoring documentée',
      'Logs des interventions humaines',
      'Tests de robustesse de la boucle',
    ],
  },

  // S-02: Concentration décisionnelle
  {
    id: 'S-02',
    name: 'Decision concentration',
    nameFr: 'Concentration décisionnelle',
    family: 'STRUCTURAL',

    graphConditions: [{ hasConcentration: true }],

    produces: {
      domainA: 'MASTERY',
      domainB: 'SECURITY',
      formulationTemplate: 'Un composant concentre trop de décisions, créant un point de défaillance unique.',
      mechanismTemplate: 'Un seul nœud centralise plusieurs flux décisionnels, rendant le système vulnérable en cas de dysfonctionnement de ce composant.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Plus de 5 flux entrants/sortants',
      'Composant externe ou tiers',
      'Absence de redondance',
    ],
    mitigatingFactors: [
      'Architecture de fallback',
      'Composant interne maîtrisé',
      'Tests de charge réguliers',
    ],

    questionsToConsider: [
      'Que se passe-t-il si ce composant tombe en panne ?',
      'Existe-t-il une redondance ou un fallback ?',
    ],
    stakeholdersToConsult: ['Architecte technique', 'SRE/Ops'],
    acceptablePatterns: [
      'Architecture distribuée avec load balancing',
      'Fallback vers un processus manuel',
    ],
    requiredEvidences: [
      'Schéma d\'architecture avec redondances',
      'PRA/PCA documenté',
    ],
  },

  // S-03: Cascade décisionnelle
  {
    id: 'S-03',
    name: 'Decision cascade',
    nameFr: 'Cascade décisionnelle',
    family: 'STRUCTURAL',

    graphConditions: [{ hasCascade: true, maxDepth: 3 }],

    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'RECOURSE',
      formulationTemplate: 'Les décisions s\'enchaînent en cascade, rendant difficile la traçabilité et la contestation.',
      mechanismTemplate: 'Une décision automatique déclenche une autre, qui en déclenche une troisième, créant une chaîne de causalité difficile à retracer.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Plus de 3 niveaux de cascade',
      'Décisions irréversibles dans la chaîne',
    ],
    mitigatingFactors: [
      'Traçabilité complète de la chaîne',
      'Points de contrôle intermédiaires',
    ],

    questionsToConsider: [
      'Peut-on retracer l\'origine d\'une décision finale ?',
      'L\'utilisateur peut-il contester à chaque étape ?',
    ],
    stakeholdersToConsult: ['Juriste', 'Product Owner'],
    acceptablePatterns: [
      'Journalisation de chaque étape avec justification',
      'Interface de traçabilité pour l\'utilisateur',
    ],
    requiredEvidences: [
      'Logs de traçabilité end-to-end',
      'Procédure de contestation documentée',
    ],
  },

  // S-04: Point de non-retour
  {
    id: 'S-04',
    name: 'Point of no return',
    nameFr: 'Point de non-retour',
    family: 'STRUCTURAL',

    edgeConditions: [{ isReversible: false }],
    siaConditions: [{ decisionTypes: ['AUTO_DECISION', 'ASSISTED_DECISION'] }],

    produces: {
      domainA: 'AUTONOMY',
      domainB: 'RECOURSE',
      formulationTemplate: 'Des actions irréversibles sont déclenchées sans confirmation, limitant l\'autonomie et le recours.',
      mechanismTemplate: 'Une fois la décision prise par le système, les conséquences ne peuvent être annulées.',
    },

    severityBase: 4,
    aggravatingFactors: [
      'Impact financier significatif',
      'Impact sur des données personnelles',
      'Absence de période de rétractation',
    ],
    mitigatingFactors: [
      'Délai de grâce avant exécution',
      'Possibilité de compensation',
    ],

    questionsToConsider: [
      'L\'utilisateur est-il averti du caractère irréversible ?',
      'Existe-t-il un délai de rétractation ?',
    ],
    stakeholdersToConsult: ['Juriste', 'DPO', 'Service client'],
    acceptablePatterns: [
      'Confirmation explicite avec avertissement',
      'Délai de 24h avant exécution irréversible',
      'Compensation financière prévue',
    ],
    requiredEvidences: [
      'Procédure de confirmation documentée',
      'Politique de compensation',
    ],
  },

  // S-05: Absence de superviseur
  {
    id: 'S-05',
    name: 'Missing supervisor',
    nameFr: 'Absence de superviseur',
    family: 'STRUCTURAL',

    customCheck: (ctx: EvaluationContext): boolean => {
      // Vérifie qu'il n'y a aucun nœud HUMAN avec un flux CONTROL vers les nœuds AI
      const aiNodes = ctx.nodes.filter(n => n.type === 'AI')
      const hasHumanControl = ctx.edges.some(e => {
        const source = ctx.nodes.find(n => n.id === e.sourceId)
        return source?.type === 'HUMAN' && e.nature === 'CONTROL' && aiNodes.some(ai => ai.id === e.targetId)
      })
      return aiNodes.length > 0 && !hasHumanControl
    },

    produces: {
      domainA: 'MASTERY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'Aucun superviseur humain n\'est identifié pour contrôler le système IA.',
      mechanismTemplate: 'Le système IA fonctionne sans supervision humaine désignée, rendant floue la chaîne de responsabilité.',
    },

    severityBase: 3,
    aggravatingFactors: [
      'Décisions à fort impact',
      'Système en production depuis longtemps sans revue',
    ],
    mitigatingFactors: [
      'Monitoring automatisé avec alertes',
      'Revues périodiques documentées',
    ],

    questionsToConsider: [
      'Qui est responsable du bon fonctionnement du système ?',
      'Comment les anomalies sont-elles détectées et traitées ?',
    ],
    stakeholdersToConsult: ['RSSI', 'Responsable métier', 'DRH'],
    acceptablePatterns: [
      'Désignation d\'un responsable IA',
      'Comité de surveillance périodique',
    ],
    requiredEvidences: [
      'Fiche de poste du responsable IA',
      'Comptes-rendus de comité de surveillance',
    ],
  },
]
