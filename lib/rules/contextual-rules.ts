// lib/rules/contextual-rules.ts
// Famille C : Règles contextuelles (sectorielles)
// Ces règles s'activent selon le secteur d'activité du SIA

import { DetectionRule } from './types';

export const CONTEXTUAL_RULES: DetectionRule[] = [
  // === SECTEUR SANTÉ ===
  {
    id: 'C-01',
    name: 'AI diagnosis without human validation',
    nameFr: 'Diagnostic IA sans validation humaine',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['HEALTH'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
      edgeConditions: [
        { nature: ['DECISION', 'INFERENCE'] },
        { intent: ['EVALUATION'] },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Un diagnostic médical est généré par IA sans validation médicale obligatoire.',
      mechanismTemplate: '{nodeName} produit des diagnostics transmis via {edgeLabel} sans validation par un professionnel de santé.',
    },
    severityBase: 5,
    aggravatingFactors: [
      { condition: 'isUrgentCare === true', label: 'Contexte d\'urgence', severityModifier: +1 },
      { condition: 'noRecourse === true', label: 'Pas de recours', severityModifier: +1 },
      { condition: 'affectsVulnerable === true', label: 'Patients vulnérables', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'humanValidation === true', label: 'Validation médicale systématique', severityModifier: -2 },
      { condition: 'isAidNotDecision === true', label: 'Aide à la décision seulement', severityModifier: -1 },
      { condition: 'hasSecondOpinion === true', label: 'Second avis possible', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Validation obligatoire par un médecin',
      'Présentation comme aide à la décision',
      'Affichage du niveau de confiance',
      'Possibilité de second avis',
    ],
    requiredEvidences: [
      'Certification dispositif médical (si applicable)',
      'Procédure de validation médicale',
      'Information patient sur l\'utilisation IA',
    ],
    questionsToConsider: [
      'Un médecin valide-t-il systématiquement les diagnostics ?',
      'Le patient sait-il qu\'une IA est impliquée ?',
      'Que se passe-t-il en cas de diagnostic erroné ?',
    ],
    stakeholdersToConsult: ['Médecin DIM', 'Comité d\'éthique hospitalier', 'DPO'],
  },

  {
    id: 'C-02',
    name: 'Health data profiling for insurance',
    nameFr: 'Profilage de données de santé pour assurance',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['HEALTH', 'INSURANCE'] },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['HEALTH'] } },
        { intent: ['EVALUATION'] },
      ],
      nodeConditions: [
        { type: 'ORG', attribute: 'orgSubtype', value: ['partner', 'subcontractor'] },
      ],
    },
    produces: {
      domainA: 'PRIVACY',
      domainB: 'EQUITY',
      formulationTemplate: 'Des données de santé sont utilisées pour une évaluation assurantielle.',
      mechanismTemplate: 'Les données de santé transitent de {sourceNode} vers {targetNode} pour une évaluation de risque.',
    },
    severityBase: 5,
    aggravatingFactors: [
      { condition: 'affectsPricing === true', label: 'Impact sur la tarification', severityModifier: +1 },
      { condition: 'noExplicitConsent === true', label: 'Consentement non explicite', severityModifier: +1 },
      { condition: 'dataSharedWithThirdParties === true', label: 'Partage avec des tiers', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasExplicitConsent === true', label: 'Consentement explicite', severityModifier: -1 },
      { condition: 'isAnonymized === true', label: 'Données anonymisées', severityModifier: -2 },
      { condition: 'isForBenefitOfPatient === true', label: 'Bénéficie au patient', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Consentement explicite et séparé',
      'Anonymisation des données de santé',
      'Limitation stricte des finalités',
      'Droit d\'opposition effectif',
    ],
    requiredEvidences: [
      'Consentement explicite documenté',
      'AIPD spécifique au traitement',
      'Base légale claire',
    ],
    questionsToConsider: [
      'Le patient a-t-il explicitement consenti à cet usage ?',
      'Peut-il refuser sans perte de service ?',
      'Les données sont-elles strictement nécessaires ?',
    ],
    stakeholdersToConsult: ['DPO', 'Médecin conseil', 'CNIL'],
  },

  // === SECTEUR RH ===
  {
    id: 'C-03',
    name: 'Automated CV screening',
    nameFr: 'Tri automatisé de CV',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['HR'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['PROFESSIONAL'] } },
        { nature: ['DECISION', 'INFERENCE'] },
        { intent: ['EVALUATION'] },
      ],
    },
    produces: {
      domainA: 'EQUITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Un système de tri automatisé évalue les candidatures sans transparence.',
      mechanismTemplate: '{nodeName} filtre les candidatures avec des critères automatiques transmis via {edgeLabel}.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'isEliminatory === true', label: 'Décision éliminatoire', severityModifier: +1 },
      { condition: 'noCriteriaTransparency === true', label: 'Critères opaques', severityModifier: +1 },
      { condition: 'usesProxyVariables === true', label: 'Utilise des proxys problématiques', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'humanReviewsPossible === true', label: 'Revue humaine possible', severityModifier: -1 },
      { condition: 'criteriaAreTransparent === true', label: 'Critères transparents', severityModifier: -1 },
      { condition: 'hasBiasAudit === true', label: 'Audit des biais réalisé', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Revue humaine de tous les dossiers rejetés',
      'Critères explicables et documentés',
      'Audit régulier des biais',
      'Information des candidats sur le processus',
    ],
    requiredEvidences: [
      'Documentation des critères de scoring',
      'Rapport d\'audit des biais',
      'Procédure de recours',
    ],
    questionsToConsider: [
      'Les candidats savent-ils qu\'un algorithme les évalue ?',
      'Les critères reproduisent-ils des biais historiques ?',
      'Un candidat peut-il demander une revue humaine ?',
    ],
    stakeholdersToConsult: ['DRH', 'DPO', 'Défenseur des droits (si applicable)'],
  },

  {
    id: 'C-04',
    name: 'Employee performance monitoring',
    nameFr: 'Surveillance des performances employés',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['HR'] },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['BEHAVIORAL', 'PROFESSIONAL'] } },
        { intent: ['SURVEILLANCE', 'EVALUATION'] },
      ],
      nodeConditions: [
        { type: 'HUMAN', attribute: 'humanSubtype', value: ['operator', 'user'] },
      ],
    },
    produces: {
      domainA: 'AUTONOMY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Les employés sont surveillés de manière continue pour évaluer leurs performances.',
      mechanismTemplate: 'Les données {dataCategories} des employés sont collectées via {edgeLabel} pour {intent}.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'isRealTime === true', label: 'Surveillance en temps réel', severityModifier: +1 },
      { condition: 'affectsSalary === true', label: 'Impact sur le salaire', severityModifier: +1 },
      { condition: 'noEmployeeConsent === true', label: 'Sans information préalable', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasCSEConsultation === true', label: 'CSE consulté', severityModifier: -1 },
      { condition: 'employeesInformed === true', label: 'Employés informés', severityModifier: -1 },
      { condition: 'isProportionate === true', label: 'Proportionné au but', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Consultation du CSE',
      'Information claire des employés',
      'Proportionnalité démontrée',
      'Droit d\'accès aux données collectées',
    ],
    requiredEvidences: [
      'PV de consultation du CSE',
      'Note d\'information aux employés',
      'Analyse de proportionnalité',
    ],
    questionsToConsider: [
      'La surveillance est-elle proportionnée au but ?',
      'Les employés ont-ils été consultés via le CSE ?',
      'Quelles sont les conséquences d\'une mauvaise évaluation ?',
    ],
    stakeholdersToConsult: ['DRH', 'CSE', 'DPO', 'Inspection du travail'],
  },

  // === SECTEUR FINANCE ===
  {
    id: 'C-05',
    name: 'Automated credit scoring',
    nameFr: 'Scoring de crédit automatisé',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['FINANCE'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['FINANCIAL', 'IDENTIFIER'] } },
        { nature: ['DECISION'] },
        { automation: ['AUTO_WITH_RECOURSE', 'AUTO_NO_RECOURSE'] },
      ],
    },
    produces: {
      domainA: 'EQUITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Un scoring de crédit automatisé impacte l\'accès au financement.',
      mechanismTemplate: '{nodeName} calcule un score de crédit via {edgeLabel} avec une décision {automation}.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'noRecourse === true', label: 'Pas de recours', severityModifier: +1 },
      { condition: 'usesNonFinancialData === true', label: 'Utilise des données non financières', severityModifier: +1 },
      { condition: 'blackBoxModel === true', label: 'Modèle boîte noire', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasExplainability === true', label: 'Score explicable', severityModifier: -1 },
      { condition: 'hasRecourse === true', label: 'Recours possible', severityModifier: -1 },
      { condition: 'humanReviewAvailable === true', label: 'Revue humaine sur demande', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Explication des facteurs du score',
      'Recours humain disponible',
      'Critères conformes au Code de la consommation',
      'Audit régulier des biais',
    ],
    requiredEvidences: [
      'Documentation du modèle de scoring',
      'Procédure de recours',
      'Rapport d\'audit des biais',
    ],
    questionsToConsider: [
      'Le client peut-il comprendre pourquoi son crédit est refusé ?',
      'Un humain peut-il réexaminer la décision ?',
      'Le modèle utilise-t-il des proxys de discrimination ?',
    ],
    stakeholdersToConsult: ['Risk manager', 'Compliance', 'DPO'],
  },

  {
    id: 'C-06',
    name: 'Real-time fraud detection',
    nameFr: 'Détection de fraude en temps réel',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['FINANCE', 'INSURANCE'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
      edgeConditions: [
        { nature: ['DECISION'] },
        { intent: ['SURVEILLANCE'] },
        { frequency: 'REALTIME' },
      ],
    },
    produces: {
      domainA: 'SECURITY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Un système de détection de fraude peut bloquer des transactions légitimes.',
      mechanismTemplate: '{nodeName} analyse en temps réel via {edgeLabel} et peut bloquer automatiquement.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'highFalsePositiveRate === true', label: 'Taux élevé de faux positifs', severityModifier: +1 },
      { condition: 'noImmediateRecourse === true', label: 'Pas de recours immédiat', severityModifier: +1 },
      { condition: 'affectsEssentialServices === true', label: 'Bloque des services essentiels', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasImmediateUnblock === true', label: 'Déblocage immédiat possible', severityModifier: -1 },
      { condition: 'hasLowFalsePositives === true', label: 'Faible taux de faux positifs', severityModifier: -1 },
      { condition: 'has24x7Support === true', label: 'Support 24/7', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Processus de déblocage rapide',
      'Support client accessible 24/7',
      'Monitoring du taux de faux positifs',
      'Calibrage régulier des seuils',
    ],
    requiredEvidences: [
      'Métriques de faux positifs',
      'Procédure de déblocage',
      'SLA du support client',
    ],
    questionsToConsider: [
      'Combien de clients légitimes sont bloqués par erreur ?',
      'Quel est le délai pour débloquer un compte ?',
      'Les seuils sont-ils régulièrement calibrés ?',
    ],
    stakeholdersToConsult: ['Fraud team', 'Service client', 'Compliance'],
  },

  // === SECTEUR ASSURANCE ===
  {
    id: 'C-07',
    name: 'Predictive risk assessment',
    nameFr: 'Évaluation prédictive des risques',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['INSURANCE'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['BEHAVIORAL', 'HEALTH', 'DEMOGRAPHIC'] } },
        { nature: ['INFERENCE'] },
      ],
    },
    produces: {
      domainA: 'EQUITY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Un modèle prédictif évalue les risques individuels avec des données personnelles.',
      mechanismTemplate: '{nodeName} prédit le risque à partir de données {dataCategories} via {edgeLabel}.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'affectsPricing === true', label: 'Impact sur le prix', severityModifier: +1 },
      { condition: 'usesHealthData === true', label: 'Utilise des données de santé', severityModifier: +1 },
      { condition: 'granularProfiling === true', label: 'Profilage granulaire', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'usesPooledRisk === true', label: 'Mutualisation des risques', severityModifier: -1 },
      { condition: 'hasFairPricingPolicy === true', label: 'Politique de tarification équitable', severityModifier: -1 },
      { condition: 'isOptional === true', label: 'Profilage optionnel', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Limites à la personnalisation tarifaire',
      'Interdiction d\'utiliser certains critères',
      'Option de tarification standard',
      'Transparence sur les critères utilisés',
    ],
    requiredEvidences: [
      'Documentation des critères de tarification',
      'Analyse d\'impact sur l\'équité',
      'Conformité réglementaire assurance',
    ],
    questionsToConsider: [
      'La personnalisation crée-t-elle une exclusion ?',
      'Les critères respectent-ils l\'interdiction de discrimination ?',
      'L\'assuré peut-il choisir une tarification standard ?',
    ],
    stakeholdersToConsult: ['Actuariat', 'Compliance', 'DPO'],
  },

  {
    id: 'C-08',
    name: 'Connected device monitoring for insurance',
    nameFr: 'Surveillance par objets connectés pour assurance',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['INSURANCE'] },
      ],
      edgeConditions: [
        { channel: ['SENSOR'] },
        { dataCategories: { includes: ['BEHAVIORAL', 'HEALTH', 'LOCATION'] } },
      ],
    },
    produces: {
      domainA: 'PRIVACY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Des objets connectés collectent des données comportementales pour l\'assurance.',
      mechanismTemplate: 'Les données de capteurs ({dataCategories}) sont transmises via {edgeLabel} pour évaluation.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'isContinuousMonitoring === true', label: 'Surveillance continue', severityModifier: +1 },
      { condition: 'affectsCoverage === true', label: 'Impact sur la couverture', severityModifier: +1 },
      { condition: 'noOptOut === true', label: 'Pas d\'opt-out', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'isOptIn === true', label: 'Opt-in explicite', severityModifier: -1 },
      { condition: 'onlyBenefitsInsured === true', label: 'Bénéfices uniquement pour l\'assuré', severityModifier: -1 },
      { condition: 'dataMinimized === true', label: 'Données minimisées', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Opt-in explicite et révocable',
      'Réduction de prime uniquement (pas de pénalité)',
      'Données agrégées uniquement',
      'Transparence totale sur l\'usage',
    ],
    requiredEvidences: [
      'Consentement opt-in documenté',
      'Politique d\'utilisation des données',
      'Impact sur la tarification documenté',
    ],
    questionsToConsider: [
      'L\'assuré peut-il refuser sans pénalité ?',
      'Les données sont-elles utilisées contre l\'assuré ?',
      'La surveillance est-elle proportionnée ?',
    ],
    stakeholdersToConsult: ['DPO', 'Product manager', 'CNIL'],
  },

  // === SECTEUR JUSTICE ===
  {
    id: 'C-09',
    name: 'Algorithmic decision in judicial context',
    nameFr: 'Décision algorithmique en contexte judiciaire',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['JUSTICE'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
      edgeConditions: [
        { nature: ['DECISION', 'INFERENCE'] },
        { dataCategories: { includes: ['JUDICIAL', 'IDENTIFIER'] } },
      ],
    },
    produces: {
      domainA: 'EQUITY',
      domainB: 'SECURITY',
      formulationTemplate: 'Un algorithme influence des décisions judiciaires affectant les libertés.',
      mechanismTemplate: '{nodeName} produit des recommandations judiciaires via {edgeLabel}.',
    },
    severityBase: 5,
    aggravatingFactors: [
      { condition: 'affectsLiberty === true', label: 'Impact sur la liberté', severityModifier: +1 },
      { condition: 'noHumanOverride === true', label: 'Pas de surcharge humaine', severityModifier: +1 },
      { condition: 'usesHistoricalBias === true', label: 'Biais historiques potentiels', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'isAdvisoryOnly === true', label: 'Consultatif uniquement', severityModifier: -1 },
      { condition: 'judgeHasFinalWord === true', label: 'Juge décide in fine', severityModifier: -1 },
      { condition: 'hasBiasAudit === true', label: 'Audit des biais réalisé', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Rôle strictement consultatif',
      'Juge conserve toute liberté de décision',
      'Transparence sur les facteurs utilisés',
      'Audit indépendant des biais',
    ],
    requiredEvidences: [
      'Documentation du rôle de l\'algorithme',
      'Audit des biais indépendant',
      'Formation des magistrats',
    ],
    questionsToConsider: [
      'Le juge peut-il s\'écarter de la recommandation ?',
      'Les critères reproduisent-ils des biais ?',
      'Le justiciable peut-il contester l\'algorithme ?',
    ],
    stakeholdersToConsult: ['Magistrats', 'Ministère de la Justice', 'Conseil d\'État'],
  },

  // === SECTEUR ADMINISTRATION ===
  {
    id: 'C-10',
    name: 'Automated administrative decision',
    nameFr: 'Décision administrative automatisée',
    family: 'CONTEXTUAL',
    conditions: {
      siaConditions: [
        { sector: ['ADMINISTRATION'] },
      ],
      nodeConditions: [
        { type: 'AI' },
      ],
      edgeConditions: [
        { nature: ['DECISION'] },
        { automation: ['AUTO_WITH_RECOURSE', 'AUTO_NO_RECOURSE'] },
      ],
    },
    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'RECOURSE',
      formulationTemplate: 'Une décision administrative est prise automatiquement par un algorithme.',
      mechanismTemplate: '{nodeName} produit des décisions administratives automatiques via {edgeLabel}.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'affectsRights === true', label: 'Affecte des droits fondamentaux', severityModifier: +1 },
      { condition: 'noExplanation === true', label: 'Pas d\'explication fournie', severityModifier: +1 },
      { condition: 'noRecourse === true', label: 'Pas de recours prévu', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasExplanation === true', label: 'Explication fournie', severityModifier: -1 },
      { condition: 'hasRecourseGratuit === true', label: 'Recours gratuit', severityModifier: -1 },
      { condition: 'humanReviewAvailable === true', label: 'Revue humaine disponible', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Explication systématique des décisions',
      'Recours gracieux et contentieux accessibles',
      'Mention de l\'utilisation d\'un algorithme',
      'Publication des règles de l\'algorithme',
    ],
    requiredEvidences: [
      'Mention légale sur l\'utilisation d\'algorithmes',
      'Procédure de recours documentée',
      'Publication des règles (Code des relations public-administration)',
    ],
    questionsToConsider: [
      'L\'usager sait-il qu\'un algorithme a décidé ?',
      'Peut-il obtenir une explication individualisée ?',
      'Le recours est-il effectif ?',
    ],
    stakeholdersToConsult: ['Direction juridique', 'Médiateur', 'CADA'],
  },
];
