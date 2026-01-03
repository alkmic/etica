// lib/rules/contextual-rules.ts
// Famille C : Règles contextuelles par secteur (12 règles)

import { DetectionRule, EvaluationContext } from './types'

export const CONTEXTUAL_RULES: DetectionRule[] = [
  // ========== SANTÉ (C-SA) ==========
  {
    id: 'C-SA-01',
    name: 'Diagnostic without physician validation',
    nameFr: 'Diagnostic sans validation médecin',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['HEALTH'] }],
    edgeConditions: [{ nature: 'DECISION', automation: ['AUTO_NO_RECOURSE', 'AUTO_WITH_RECOURSE'] }],

    produces: {
      domainA: 'SECURITY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Un diagnostic médical est produit sans validation par un professionnel de santé.',
      mechanismTemplate: 'L\'IA produit un diagnostic qui peut influencer le traitement sans intervention d\'un médecin.',
    },

    severityBase: 5,
    aggravatingFactors: ['Pathologie grave', 'Patient vulnérable', 'Pas de second avis possible'],
    mitigatingFactors: ['Présenté comme aide au diagnostic', 'Validation obligatoire'],

    questionsToConsider: ['Le diagnostic est-il présenté comme définitif ?', 'Un médecin valide-t-il systématiquement ?'],
    stakeholdersToConsult: ['Médecin', 'Ordre des médecins', 'Patient'],
    acceptablePatterns: ['Aide au diagnostic avec validation obligatoire', 'Présentation comme suggestion uniquement'],
    requiredEvidences: ['Workflow de validation médicale', 'Interface utilisateur claire'],
  },

  {
    id: 'C-SA-02',
    name: 'Triage without human escalation',
    nameFr: 'Triage sans escalade humaine',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['HEALTH'] }],
    customCheck: (ctx: EvaluationContext): boolean => ctx.nodes.some(n => n.subtype?.includes('triage')),

    produces: {
      domainA: 'RECOURSE',
      domainB: 'EQUITY',
      formulationTemplate: 'Le triage des patients est automatisé sans possibilité d\'escalade.',
      mechanismTemplate: 'Un patient peut être mal priorisé sans recours possible.',
    },

    severityBase: 4,
    aggravatingFactors: ['Urgences vitales', 'Pas de second niveau'],
    mitigatingFactors: ['Escalade automatique sur incertitude'],

    questionsToConsider: ['Que se passe-t-il si le triage est erroné ?'],
    stakeholdersToConsult: ['Urgentiste', 'Direction médicale'],
    acceptablePatterns: ['Escalade humaine systématique pour cas critiques'],
    requiredEvidences: ['Procédure d\'escalade', 'Logs de cas escaladés'],
  },

  {
    id: 'C-SA-03',
    name: 'Predictive health without consent',
    nameFr: 'Prédiction santé sans consentement',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['HEALTH'] }],
    edgeConditions: [{ nature: 'INFERENCE', dataCategories: ['HEALTH'] }],

    produces: {
      domainA: 'PRIVACY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'Des prédictions de santé sont faites sans consentement explicite.',
      mechanismTemplate: 'Le système infère des risques de santé que le patient n\'a pas demandé à connaître.',
    },

    severityBase: 4,
    aggravatingFactors: ['Maladies génétiques', 'Partage avec assureurs'],
    mitigatingFactors: ['Consentement éclairé', 'Droit à ne pas savoir respecté'],

    questionsToConsider: ['Le patient a-t-il consenti à ces prédictions ?', 'Peut-il refuser de les connaître ?'],
    stakeholdersToConsult: ['DPO', 'Éthicien médical', 'Patient'],
    acceptablePatterns: ['Opt-in explicite pour les prédictions'],
    requiredEvidences: ['Formulaire de consentement spécifique'],
  },

  // ========== RH (C-RH) ==========
  {
    id: 'C-RH-01',
    name: 'CV screening without explanation',
    nameFr: 'Tri CV sans explication',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['HR'] }],
    edgeConditions: [{ nature: 'DECISION' }],

    produces: {
      domainA: 'EQUITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Les CV sont triés automatiquement sans explication au candidat.',
      mechanismTemplate: 'Un candidat peut être rejeté sans connaître les critères utilisés.',
    },

    severityBase: 4,
    aggravatingFactors: ['Pas de recours', 'Critères potentiellement discriminatoires'],
    mitigatingFactors: ['Explication fournie', 'Revue humaine des rejets'],

    questionsToConsider: ['Le candidat peut-il connaître les raisons du rejet ?'],
    stakeholdersToConsult: ['DRH', 'Juriste travail', 'Candidats'],
    acceptablePatterns: ['Explication des critères généraux', 'Droit de contestation'],
    requiredEvidences: ['Tests de biais', 'Procédure de contestation'],
  },

  {
    id: 'C-RH-02',
    name: 'Video interview analysis',
    nameFr: 'Analyse vidéo entretien',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['HR'] }],
    edgeConditions: [{ dataCategories: ['BIOMETRIC'] }],

    produces: {
      domainA: 'PRIVACY',
      domainB: 'EQUITY',
      formulationTemplate: 'Les entretiens vidéo sont analysés par IA (expressions, ton).',
      mechanismTemplate: 'L\'analyse comportementale peut introduire des biais liés au handicap, à la culture, etc.',
    },

    severityBase: 4,
    aggravatingFactors: ['Analyse des micro-expressions', 'Pas de consentement'],
    mitigatingFactors: ['Information claire', 'Pas de décision automatique'],

    questionsToConsider: ['Le candidat est-il informé de l\'analyse ?', 'Les biais culturels sont-ils maîtrisés ?'],
    stakeholdersToConsult: ['DRH', 'Psychologue du travail', 'DPO'],
    acceptablePatterns: ['Information préalable', 'Validation humaine obligatoire'],
    requiredEvidences: ['Consentement', 'Audit de biais'],
  },

  {
    id: 'C-RH-03',
    name: 'Turnover prediction',
    nameFr: 'Prédiction turnover',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['HR'] }],
    edgeConditions: [{ nature: 'INFERENCE' }],

    produces: {
      domainA: 'AUTONOMY',
      domainB: 'LOYALTY',
      formulationTemplate: 'Le système prédit les risques de départ des employés.',
      mechanismTemplate: 'La prédiction peut conduire à des prophéties auto-réalisatrices ou à de la discrimination.',
    },

    severityBase: 3,
    aggravatingFactors: ['Utilisation pour licenciement préventif', 'Pas d\'information'],
    mitigatingFactors: ['Utilisation pour fidélisation', 'Agrégation anonyme'],

    questionsToConsider: ['Comment est utilisée cette prédiction ?', 'Les employés sont-ils informés ?'],
    stakeholdersToConsult: ['DRH', 'CSE', 'Juriste'],
    acceptablePatterns: ['Usage agrégé pour politique RH', 'Pas de décision individuelle automatique'],
    requiredEvidences: ['Charte d\'utilisation', 'Avis CSE'],
  },

  // ========== FINANCE (C-FI) ==========
  {
    id: 'C-FI-01',
    name: 'Credit scoring without explanation',
    nameFr: 'Scoring crédit sans explication',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['FINANCE'] }],
    edgeConditions: [{ nature: 'DECISION', automation: ['AUTO_NO_RECOURSE', 'AUTO_WITH_RECOURSE', 'SEMI_AUTO'] }],

    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'RECOURSE',
      formulationTemplate: 'Le score de crédit est calculé sans explication des facteurs.',
      mechanismTemplate: 'Le demandeur ne peut pas comprendre ni contester le refus.',
    },

    severityBase: 4,
    aggravatingFactors: ['Décision automatique', 'Pas de recours'],
    mitigatingFactors: ['Explication des critères', 'Médiation possible'],

    questionsToConsider: ['Le client peut-il connaître les raisons du score ?'],
    stakeholdersToConsult: ['Compliance', 'Service client', 'Régulateur'],
    acceptablePatterns: ['Explication individuelle sur demande', 'Médiation bancaire'],
    requiredEvidences: ['Modèle explicable', 'Procédure de médiation'],
  },

  {
    id: 'C-FI-02',
    name: 'Fraud detection with high false positives',
    nameFr: 'Détection fraude avec faux positifs',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['FINANCE'] }],
    customCheck: (ctx: EvaluationContext): boolean => ctx.nodes.some(n => n.subtype?.includes('fraud')),

    produces: {
      domainA: 'SECURITY',
      domainB: 'AUTONOMY',
      formulationTemplate: 'La détection de fraude bloque des transactions légitimes.',
      mechanismTemplate: 'Des clients honnêtes peuvent voir leurs transactions refusées sans recours immédiat.',
    },

    severityBase: 3,
    aggravatingFactors: ['Blocage de compte', 'Pas de notification'],
    mitigatingFactors: ['Déblocage rapide', 'Notification immédiate'],

    questionsToConsider: ['Quel est le taux de faux positifs ?', 'Comment les clients sont-ils traités ?'],
    stakeholdersToConsult: ['Compliance', 'Service client'],
    acceptablePatterns: ['Déblocage en moins de 24h', 'Canal d\'urgence'],
    requiredEvidences: ['Métriques de faux positifs', 'SLA de déblocage'],
  },

  {
    id: 'C-FI-03',
    name: 'Dynamic pricing',
    nameFr: 'Tarification dynamique',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['FINANCE', 'INSURANCE', 'COMMERCE'] }],
    edgeConditions: [{ nature: 'DECISION', dataCategories: ['BEHAVIORAL'] }],

    produces: {
      domainA: 'EQUITY',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Les prix sont personnalisés en fonction du profil utilisateur.',
      mechanismTemplate: 'Deux clients peuvent payer des prix différents pour le même service.',
    },

    severityBase: 3,
    aggravatingFactors: ['Basé sur données sensibles', 'Écarts importants'],
    mitigatingFactors: ['Transparence sur la méthode', 'Plafonnement des écarts'],

    questionsToConsider: ['Les critères de pricing sont-ils équitables ?'],
    stakeholdersToConsult: ['Juriste', 'Marketing', 'Régulateur'],
    acceptablePatterns: ['Information sur la personnalisation', 'Prix de base accessible'],
    requiredEvidences: ['Politique de pricing', 'Audit d\'équité'],
  },

  // ========== ASSURANCE (C-AS) ==========
  {
    id: 'C-AS-01',
    name: 'Risk-based pricing discrimination',
    nameFr: 'Tarification risque discriminatoire',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['INSURANCE'] }],
    edgeConditions: [{ nature: 'DECISION', dataCategories: ['HEALTH', 'BEHAVIORAL', 'LOCATION'] }],

    produces: {
      domainA: 'EQUITY',
      domainB: 'PRIVACY',
      formulationTemplate: 'La tarification utilise des données pouvant mener à de la discrimination.',
      mechanismTemplate: 'Des caractéristiques personnelles sont utilisées pour déterminer le prix de l\'assurance.',
    },

    severityBase: 4,
    aggravatingFactors: ['Données de santé', 'Géolocalisation fine', 'Scoring social'],
    mitigatingFactors: ['Conformité réglementaire', 'Audit anti-discrimination'],

    questionsToConsider: ['Les critères sont-ils légaux ?', 'Y a-t-il un risque de proxy discrimination ?'],
    stakeholdersToConsult: ['Actuaire', 'Juriste', 'Régulateur'],
    acceptablePatterns: ['Critères conformes au code des assurances', 'Audit régulier'],
    requiredEvidences: ['Liste des critères utilisés', 'Avis juridique'],
  },

  {
    id: 'C-AS-02',
    name: 'Behavioral monitoring for insurance',
    nameFr: 'Surveillance comportementale assurance',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['INSURANCE'] }],
    edgeConditions: [{ intent: 'SURVEILLANCE', dataCategories: ['BEHAVIORAL'] }],

    produces: {
      domainA: 'AUTONOMY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Le comportement des assurés est surveillé en continu.',
      mechanismTemplate: 'La surveillance modifie les comportements et porte atteinte à la vie privée.',
    },

    severityBase: 3,
    aggravatingFactors: ['Surveillance permanente', 'Impact sur la prime'],
    mitigatingFactors: ['Opt-in volontaire', 'Bénéfice clair pour l\'assuré'],

    questionsToConsider: ['L\'assuré a-t-il vraiment le choix ?', 'Le bénéfice est-il équitable ?'],
    stakeholdersToConsult: ['DPO', 'Actuaire', 'Représentants assurés'],
    acceptablePatterns: ['Programme opt-in avec réduction garantie', 'Droit de sortie sans pénalité'],
    requiredEvidences: ['Consentement éclairé', 'Grille de bénéfices'],
  },

  {
    id: 'C-AS-03',
    name: 'Claims automation without appeal',
    nameFr: 'Automatisation sinistres sans appel',
    family: 'CONTEXTUAL',

    siaConditions: [{ sectors: ['INSURANCE'] }],
    edgeConditions: [{ nature: 'DECISION', automation: ['AUTO_NO_RECOURSE'] }],

    produces: {
      domainA: 'RECOURSE',
      domainB: 'TRANSPARENCY',
      formulationTemplate: 'Les décisions de sinistres sont automatisées sans recours.',
      mechanismTemplate: 'Un assuré peut voir son sinistre refusé sans comprendre pourquoi ni pouvoir contester.',
    },

    severityBase: 4,
    aggravatingFactors: ['Sinistres importants', 'Pas de motivation'],
    mitigatingFactors: ['Revue humaine sur demande', 'Médiation disponible'],

    questionsToConsider: ['L\'assuré peut-il contester ?', 'Les raisons sont-elles expliquées ?'],
    stakeholdersToConsult: ['Service sinistres', 'Médiateur', 'Juriste'],
    acceptablePatterns: ['Explication systématique', 'Recours en moins de 48h'],
    requiredEvidences: ['Procédure de recours', 'SLA de traitement'],
  },
]
