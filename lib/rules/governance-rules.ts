// lib/rules/governance-rules.ts
// Famille G : Règles de gouvernance
// Ces règles analysent l'organisation autour du système IA

import { DetectionRule } from './types';

export const GOVERNANCE_RULES: DetectionRule[] = [
  {
    id: 'G-01',
    name: 'No designated responsible party',
    nameFr: 'Pas de responsable désigné',
    family: 'GOVERNANCE',
    conditions: {
      siaConditions: [
        { attribute: 'hasResponsible', value: false },
      ],
      edgeConditions: [
        { nature: ['DECISION'] },
      ],
    },
    produces: {
      domainA: 'RESPONSIBILITY',
      domainB: 'RECOURSE',
      formulationTemplate: 'Aucun responsable n\'est clairement désigné pour le système.',
      mechanismTemplate: 'Le système prend des décisions via {edgeLabel} sans responsable identifié.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'isHighRiskDecision === true', label: 'Décisions à haut risque', severityModifier: +1 },
      { condition: 'multipleStakeholders === true', label: 'Multiples parties prenantes', severityModifier: +1 },
      { condition: 'noEscalationPath === true', label: 'Pas de chemin d\'escalade', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasRACIMatrix === true', label: 'Matrice RACI définie', severityModifier: -1 },
      { condition: 'hasEscalationProcedure === true', label: 'Procédure d\'escalade', severityModifier: -1 },
      { condition: 'hasOperationalOwner === true', label: 'Responsable opérationnel', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Responsable clairement désigné et communiqué',
      'Matrice RACI documentée',
      'Chaîne d\'escalade définie',
      'Responsabilités contractualisées',
    ],
    requiredEvidences: [
      'Organigramme avec responsabilités',
      'Matrice RACI',
      'Procédure d\'escalade',
    ],
    questionsToConsider: [
      'Qui est responsable si le système cause un préjudice ?',
      'À qui s\'adresse un utilisateur lésé ?',
      'La chaîne de responsabilité est-elle claire ?',
    ],
    stakeholdersToConsult: ['Direction', 'Juridique', 'Product Owner'],
  },

  {
    id: 'G-02',
    name: 'No incident procedure',
    nameFr: 'Pas de procédure d\'incident',
    family: 'GOVERNANCE',
    conditions: {
      siaConditions: [
        { attribute: 'hasIncidentProcedure', value: false },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'Aucune procédure n\'est définie pour gérer les incidents du système IA.',
      mechanismTemplate: 'Le système {siaName} n\'a pas de procédure d\'incident documentée.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'handlesPersonalData === true', label: 'Traite des données personnelles', severityModifier: +1 },
      { condition: 'isHighRisk === true', label: 'Système à haut risque', severityModifier: +1 },
      { condition: 'affectsPublic === true', label: 'Affecte le public', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasGeneralIncidentProcess === true', label: 'Processus incident général', severityModifier: -1 },
      { condition: 'hasSecurityTeam === true', label: 'Équipe sécurité dédiée', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Procédure d\'incident spécifique IA',
      'Playbooks pour les scénarios types',
      'Équipe d\'astreinte identifiée',
      'Communication de crise préparée',
    ],
    requiredEvidences: [
      'Procédure d\'incident documentée',
      'Playbooks de réponse',
      'Liste de contacts d\'astreinte',
    ],
    questionsToConsider: [
      'Que se passe-t-il si le système dysfonctionne la nuit ?',
      'Qui est prévenu en cas de décision aberrante massive ?',
      'Comment notifie-t-on les personnes affectées ?',
    ],
    stakeholdersToConsult: ['RSSI', 'DPO', 'Support'],
  },

  {
    id: 'G-03',
    name: 'No regular review scheduled',
    nameFr: 'Pas de revue régulière prévue',
    family: 'GOVERNANCE',
    conditions: {
      siaConditions: [
        { attribute: 'hasReviewSchedule', value: false },
      ],
    },
    produces: {
      domainA: 'MASTERY',
      domainB: 'SUSTAINABILITY',
      formulationTemplate: 'Aucune revue périodique n\'est planifiée pour le système.',
      mechanismTemplate: 'Le système {siaName} n\'a pas de calendrier de revue établi.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'systemIsOld === true', label: 'Système ancien (>2 ans)', severityModifier: +1 },
      { condition: 'contextChanges === true', label: 'Contexte en évolution', severityModifier: +1 },
      { condition: 'noMonitoring === true', label: 'Pas de monitoring', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasInformalReview === true', label: 'Revue informelle existe', severityModifier: -1 },
      { condition: 'hasContinuousMonitoring === true', label: 'Monitoring continu', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Revue annuelle minimum planifiée',
      'Revue déclenchée par événements (triggers)',
      'Revue post-incident systématique',
      'Comité de suivi régulier',
    ],
    requiredEvidences: [
      'Calendrier de revue',
      'Comptes-rendus de revues passées',
      'Liste des triggers de revue',
    ],
    questionsToConsider: [
      'Quand a eu lieu la dernière revue du système ?',
      'Qu\'est-ce qui déclenche une revue extraordinaire ?',
      'Le système a-t-il dérivé depuis sa mise en production ?',
    ],
    stakeholdersToConsult: ['Product Owner', 'Data scientist', 'Comité éthique'],
  },

  {
    id: 'G-04',
    name: 'No training for operators',
    nameFr: 'Pas de formation des opérateurs',
    family: 'GOVERNANCE',
    conditions: {
      graphConditions: [
        { hasNodeType: 'HUMAN', attribute: 'humanSubtype', value: ['operator', 'supervisor'] },
      ],
      siaConditions: [
        { attribute: 'hasOperatorTraining', value: false },
      ],
    },
    produces: {
      domainA: 'MASTERY',
      domainB: 'SECURITY',
      formulationTemplate: 'Les opérateurs humains ne sont pas formés au fonctionnement du système.',
      mechanismTemplate: 'Les {humanSubtype} du système {siaName} n\'ont pas reçu de formation spécifique.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'isComplexSystem === true', label: 'Système complexe', severityModifier: +1 },
      { condition: 'highStakesDecisions === true', label: 'Décisions à forts enjeux', severityModifier: +1 },
      { condition: 'frequentOverrides === true', label: 'Surcharge fréquente requise', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasDocumentation === true', label: 'Documentation disponible', severityModifier: -1 },
      { condition: 'hasOnboarding === true', label: 'Onboarding prévu', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Formation initiale obligatoire',
      'Recyclage périodique',
      'Documentation utilisateur complète',
      'Tests de compétence',
    ],
    requiredEvidences: [
      'Programme de formation',
      'Registre des formations',
      'Évaluations des compétences',
    ],
    questionsToConsider: [
      'Les opérateurs comprennent-ils les limites du système ?',
      'Savent-ils quand et comment surcharger les décisions ?',
      'Connaissent-ils les biais potentiels ?',
    ],
    stakeholdersToConsult: ['RH Formation', 'Opérateurs', 'Product Owner'],
  },

  {
    id: 'G-05',
    name: 'No documentation of ethical choices',
    nameFr: 'Pas de documentation des choix éthiques',
    family: 'GOVERNANCE',
    conditions: {
      siaConditions: [
        { attribute: 'hasEthicalDocumentation', value: false },
      ],
    },
    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'Les choix éthiques du système ne sont pas documentés.',
      mechanismTemplate: 'Le système {siaName} n\'a pas de documentation de ses arbitrages éthiques.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'hasEthicalDilemmas === true', label: 'Dilemmes éthiques identifiés', severityModifier: +1 },
      { condition: 'isPublicService === true', label: 'Service public', severityModifier: +1 },
      { condition: 'affectsRights === true', label: 'Affecte des droits', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasGeneralEthicsCharter === true', label: 'Charte éthique générale', severityModifier: -1 },
      { condition: 'hasEthicsCommittee === true', label: 'Comité éthique consulté', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Documentation des arbitrages éthiques',
      'Justification des choix de conception',
      'Historique des décisions éthiques',
      'Publication des principes directeurs',
    ],
    requiredEvidences: [
      'Document d\'arbitrage éthique',
      'PV du comité éthique',
      'Historique des versions et évolutions',
    ],
    questionsToConsider: [
      'Quels arbitrages éthiques ont été faits ?',
      'Ces choix sont-ils explicables à un tiers ?',
      'Un régulateur pourrait-il comprendre les décisions ?',
    ],
    stakeholdersToConsult: ['Comité éthique', 'Direction', 'Juridique'],
  },

  {
    id: 'G-06',
    name: 'No recourse mechanism',
    nameFr: 'Pas de mécanisme de recours',
    family: 'GOVERNANCE',
    conditions: {
      edgeConditions: [
        { nature: ['DECISION'] },
      ],
      siaConditions: [
        { attribute: 'hasRecourseMechanism', value: false },
      ],
    },
    produces: {
      domainA: 'RECOURSE',
      domainB: 'EQUITY',
      formulationTemplate: 'Les personnes affectées n\'ont pas de moyen de contester les décisions.',
      mechanismTemplate: 'Les décisions produites via {edgeLabel} ne peuvent pas être contestées.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'isAutomatedDecision === true', label: 'Décision automatisée', severityModifier: +1 },
      { condition: 'affectsRights === true', label: 'Affecte des droits', severityModifier: +1 },
      { condition: 'isIrreversible === true', label: 'Conséquences irréversibles', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasGeneralComplaint === true', label: 'Processus de plainte général', severityModifier: -1 },
      { condition: 'hasOmbudsman === true', label: 'Médiateur disponible', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Procédure de recours claire et accessible',
      'Délai de réponse garanti',
      'Possibilité de revue humaine',
      'Médiateur ou ombudsman',
    ],
    requiredEvidences: [
      'Procédure de recours publiée',
      'Statistiques de recours',
      'Délais de traitement',
    ],
    questionsToConsider: [
      'Une personne affectée sait-elle comment contester ?',
      'Le recours est-il effectivement accessible ?',
      'Les recours sont-ils traités équitablement ?',
    ],
    stakeholdersToConsult: ['Juridique', 'Service client', 'Médiateur'],
  },

  {
    id: 'G-07',
    name: 'No impact monitoring',
    nameFr: 'Pas de suivi des impacts',
    family: 'GOVERNANCE',
    conditions: {
      edgeConditions: [
        { nature: ['DECISION'] },
      ],
      siaConditions: [
        { attribute: 'hasImpactMonitoring', value: false },
      ],
    },
    produces: {
      domainA: 'RESPONSIBILITY',
      domainB: 'EQUITY',
      formulationTemplate: 'Les impacts réels du système ne sont pas suivis.',
      mechanismTemplate: 'Le système {siaName} n\'a pas de monitoring de ses impacts via {edgeLabel}.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'affectsVulnerable === true', label: 'Affecte des populations vulnérables', severityModifier: +1 },
      { condition: 'isLargeScale === true', label: 'Déploiement à grande échelle', severityModifier: +1 },
      { condition: 'hasBiasRisk === true', label: 'Risque de biais identifié', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasPerformanceMetrics === true', label: 'Métriques de performance', severityModifier: -1 },
      { condition: 'hasUserFeedback === true', label: 'Retours utilisateurs collectés', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'KPIs d\'impact définis et suivis',
      'Métriques d\'équité par groupe',
      'Analyse périodique des impacts',
      'Feedback utilisateurs structuré',
    ],
    requiredEvidences: [
      'Dashboard d\'impact',
      'Rapports périodiques',
      'Analyse d\'équité',
    ],
    questionsToConsider: [
      'Connaît-on l\'impact réel sur les personnes ?',
      'Certains groupes sont-ils plus affectés ?',
      'Le système atteint-il ses objectifs ?',
    ],
    stakeholdersToConsult: ['Data analyst', 'Product Owner', 'Éthicien'],
  },

  {
    id: 'G-08',
    name: 'No ethics committee consultation',
    nameFr: 'Pas de consultation du comité éthique',
    family: 'GOVERNANCE',
    conditions: {
      siaConditions: [
        { attribute: 'riskLevel', value: ['high', 'critical'] },
        { attribute: 'hasEthicsConsultation', value: false },
      ],
    },
    produces: {
      domainA: 'RESPONSIBILITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Un système à haut risque n\'a pas été soumis à un comité éthique.',
      mechanismTemplate: 'Le système {siaName} (risque: {riskLevel}) n\'a pas été revu par un comité éthique.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'isAIActHighRisk === true', label: 'Système haut risque (AI Act)', severityModifier: +1 },
      { condition: 'affectsRights === true', label: 'Affecte des droits fondamentaux', severityModifier: +1 },
      { condition: 'noExternalReview === true', label: 'Aucune revue externe', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasInternalReview === true', label: 'Revue interne réalisée', severityModifier: -1 },
      { condition: 'hasDPOReview === true', label: 'DPO consulté', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Consultation du comité éthique',
      'Avis documenté et suivi',
      'Revue externe pour les cas sensibles',
      'Mise à jour post-déploiement',
    ],
    requiredEvidences: [
      'Saisine du comité éthique',
      'Avis rendu et réponse',
      'Suivi des recommandations',
    ],
    questionsToConsider: [
      'Le comité éthique a-t-il été informé ?',
      'Ses recommandations ont-elles été suivies ?',
      'Une revue post-déploiement est-elle prévue ?',
    ],
    stakeholdersToConsult: ['Comité éthique', 'Direction', 'DPO'],
  },

  {
    id: 'G-09',
    name: 'No stakeholder consultation',
    nameFr: 'Pas de consultation des parties prenantes',
    family: 'GOVERNANCE',
    conditions: {
      siaConditions: [
        { attribute: 'hasStakeholderConsultation', value: false },
      ],
      graphConditions: [
        { hasNodeType: 'HUMAN', attribute: 'humanSubtype', value: ['subject', 'population', 'user'] },
      ],
    },
    produces: {
      domainA: 'AUTONOMY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Les personnes affectées n\'ont pas été consultées lors de la conception.',
      mechanismTemplate: 'Le système {siaName} affecte des {humanSubtype} qui n\'ont pas été consultés.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'affectsVulnerable === true', label: 'Affecte des populations vulnérables', severityModifier: +1 },
      { condition: 'isPublicService === true', label: 'Service public', severityModifier: +1 },
      { condition: 'significantImpact === true', label: 'Impact significatif', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasUserResearch === true', label: 'Recherche utilisateur réalisée', severityModifier: -1 },
      { condition: 'hasPublicConsultation === true', label: 'Consultation publique', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Consultation des utilisateurs cibles',
      'Implication de représentants',
      'Tests utilisateurs avec feedback',
      'Consultation publique pour les services publics',
    ],
    requiredEvidences: [
      'Compte-rendu de consultation',
      'Panel d\'utilisateurs',
      'Feedback intégré au design',
    ],
    questionsToConsider: [
      'Les personnes affectées ont-elles eu leur mot à dire ?',
      'Leurs préoccupations ont-elles été prises en compte ?',
      'Existe-t-il un canal de feedback ?',
    ],
    stakeholdersToConsult: ['UX Research', 'Associations', 'Représentants utilisateurs'],
  },

  {
    id: 'G-10',
    name: 'No kill switch or deactivation procedure',
    nameFr: 'Pas de procédure de désactivation',
    family: 'GOVERNANCE',
    conditions: {
      nodeConditions: [
        { type: 'AI' },
      ],
      siaConditions: [
        { attribute: 'hasKillSwitch', value: false },
      ],
    },
    produces: {
      domainA: 'MASTERY',
      domainB: 'SECURITY',
      formulationTemplate: 'Aucune procédure de désactivation d\'urgence n\'est prévue.',
      mechanismTemplate: 'Le composant IA {nodeName} ne peut pas être désactivé rapidement en cas de problème.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'isAutonomous === true', label: 'Système autonome', severityModifier: +1 },
      { condition: 'hasIrreversibleActions === true', label: 'Actions irréversibles possibles', severityModifier: +1 },
      { condition: 'isRealTime === true', label: 'Temps réel', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'canBeDisabled === true', label: 'Désactivation possible', severityModifier: -1 },
      { condition: 'hasGracefulDegradation === true', label: 'Dégradation gracieuse', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Kill switch accessible',
      'Procédure de désactivation documentée',
      'Mode dégradé sans IA',
      'Rollback possible rapidement',
    ],
    requiredEvidences: [
      'Procédure de désactivation',
      'Tests de kill switch',
      'RTO documenté',
    ],
    questionsToConsider: [
      'Peut-on arrêter le système en urgence ?',
      'Qui a l\'autorité pour le faire ?',
      'Combien de temps faut-il ?',
    ],
    stakeholdersToConsult: ['SRE/DevOps', 'Direction', 'RSSI'],
  },
];
