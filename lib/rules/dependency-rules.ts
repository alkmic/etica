// lib/rules/dependency-rules.ts
// Famille E : Règles de dépendance (composants externes)
// CRITIQUE - Ces règles analysent les dépendances externes

import { DetectionRule } from './types';

export const DEPENDENCY_RULES: DetectionRule[] = [
  {
    id: 'E-01',
    name: 'External API for critical function without fallback',
    nameFr: 'API externe pour fonction critique sans fallback',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: 'AI', attribute: 'isExternal', value: true },
        { attribute: 'hasFallback', value: false },
      ],
      edgeConditions: [
        { nature: ['DECISION', 'INFERENCE'] },
        { criticality: 'CRITICAL' },
      ],
    },
    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'SECURITY',
      formulationTemplate: 'Une fonction critique ({nodeName}) dépend d\'une API externe sans plan de continuité.',
      mechanismTemplate: '{nodeName} (fournisseur: {provider}) traite des décisions critiques sans fallback défini.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'edge.criticality === "CRITICAL"', label: 'Flux critique', severityModifier: +1 },
      { condition: 'noSLA === true', label: 'Pas de SLA documenté', severityModifier: +1 },
      { condition: 'providerOutsideEU === true', label: 'Fournisseur hors UE', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasFallback === true', label: 'Fallback disponible', severityModifier: -2 },
      { condition: 'hasGracefulDegradation === true', label: 'Dégradation gracieuse', severityModifier: -1 },
      { condition: 'hasSLA === true', label: 'SLA contractuel', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Fallback local ou alternatif documenté',
      'Mode dégradé avec fonctionnalités réduites',
      'SLA avec garanties de disponibilité',
      'Tests réguliers du fallback',
    ],
    requiredEvidences: [
      'Documentation du plan de continuité',
      'Tests de basculement réalisés',
      'SLA signé avec le fournisseur',
    ],
    questionsToConsider: [
      'Que se passe-t-il si l\'API est indisponible ?',
      'Le fallback a-t-il été testé en conditions réelles ?',
      'Les utilisateurs sont-ils informés en cas de dégradation ?',
    ],
    stakeholdersToConsult: ['Architecte', 'SRE/DevOps', 'Product Owner'],
  },

  {
    id: 'E-02',
    name: 'Opaque external AI model',
    nameFr: 'Modèle IA externe opaque',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: 'AI', attribute: 'isExternal', value: true },
        { attribute: 'aiSubtype', value: ['llm', 'ml_model'] },
      ],
      graphConditions: [
        { pathExists: { from: { type: 'AI', isExternal: true }, to: { type: 'HUMAN' }, through: 'DECISION' } },
      ],
    },
    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'MASTERY',
      formulationTemplate: 'Un modèle IA externe ({nodeName}) prend des décisions sans que sa logique soit explicable.',
      mechanismTemplate: '{nodeName} de {provider} génère des sorties utilisées pour {edgeIntent} sans documentation du modèle.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'affectsVulnerable === true', label: 'Affecte des populations vulnérables', severityModifier: +1 },
      { condition: 'noModelCard === true', label: 'Pas de model card', severityModifier: +1 },
      { condition: 'cannotAudit === true', label: 'Impossible à auditer', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasModelCard === true', label: 'Model card disponible', severityModifier: -1 },
      { condition: 'hasExplainability === true', label: 'Explications locales disponibles', severityModifier: -1 },
      { condition: 'humanValidates === true', label: 'Validation humaine systématique', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Model card documentée par le fournisseur',
      'Explainability layer ajouté (LIME, SHAP)',
      'Validation humaine avant décision finale',
      'Audit régulier des sorties',
    ],
    requiredEvidences: [
      'Model card ou documentation équivalente',
      'Analyse des biais documentée',
      'Procédure de validation humaine',
    ],
    questionsToConsider: [
      'Peut-on expliquer pourquoi le modèle a produit cette sortie ?',
      'Le fournisseur publie-t-il des informations sur les biais ?',
      'Peut-on contester une décision basée sur ce modèle ?',
    ],
    stakeholdersToConsult: ['Data scientist', 'Éthicien', 'DPO'],
  },

  {
    id: 'E-03',
    name: 'Sensitive data through third-party infrastructure',
    nameFr: 'Données sensibles via infrastructure tierce',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: 'INFRA', attribute: 'isExternal', value: true },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['HEALTH', 'BIOMETRIC', 'JUDICIAL', 'FINANCIAL'] } },
      ],
    },
    produces: {
      domainA: 'PRIVACY',
      domainB: 'SOVEREIGNTY',
      formulationTemplate: 'Des données sensibles transitent par une infrastructure tierce ({nodeName}).',
      mechanismTemplate: 'Les données {dataCategories} passent par {nodeName} (fournisseur: {provider}).',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'noEncryption === true', label: 'Pas de chiffrement', severityModifier: +1 },
      { condition: 'providerOutsideEU === true', label: 'Infrastructure hors UE', severityModifier: +1 },
      { condition: 'noContractualProtection === true', label: 'Pas de DPA', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasE2EEncryption === true', label: 'Chiffrement de bout en bout', severityModifier: -1 },
      { condition: 'hasDPA === true', label: 'DPA signé', severityModifier: -1 },
      { condition: 'isSOC2Certified === true', label: 'Fournisseur certifié SOC2', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Chiffrement de bout en bout avec clés maîtrisées',
      'DPA (Data Processing Agreement) signé',
      'Certifications de sécurité (SOC2, ISO27001)',
      'Audit régulier du sous-traitant',
    ],
    requiredEvidences: [
      'Contrat de sous-traitance (DPA)',
      'Attestation de conformité du fournisseur',
      'Documentation du chiffrement',
    ],
    questionsToConsider: [
      'Le fournisseur a-t-il accès aux données en clair ?',
      'Où sont stockées les clés de chiffrement ?',
      'Le fournisseur peut-il être audité ?',
    ],
    stakeholdersToConsult: ['RSSI', 'DPO', 'Juridique'],
  },

  {
    id: 'E-04',
    name: 'Provider can train on your data',
    nameFr: 'Le fournisseur peut entraîner sur vos données',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: 'AI', attribute: 'isExternal', value: true },
        { attribute: 'providerCanTrain', value: true },
      ],
    },
    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Les données envoyées à {nodeName} peuvent être utilisées pour l\'entraînement du modèle.',
      mechanismTemplate: '{provider} peut utiliser les données transitant par {nodeName} pour améliorer ses modèles.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'containsPersonalData === true', label: 'Contient des données personnelles', severityModifier: +1 },
      { condition: 'containsBusinessSecrets === true', label: 'Contient des secrets d\'affaires', severityModifier: +1 },
      { condition: 'noOptOut === true', label: 'Pas d\'opt-out possible', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'optOutActivated === true', label: 'Opt-out activé', severityModifier: -2 },
      { condition: 'dataIsAnonymized === true', label: 'Données anonymisées avant envoi', severityModifier: -1 },
      { condition: 'hasContractualProtection === true', label: 'Protection contractuelle', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Opt-out contractuel de l\'entraînement',
      'Anonymisation avant envoi',
      'API dédiée sans entraînement',
      'Hébergement on-premise du modèle',
    ],
    requiredEvidences: [
      'Clause contractuelle sur l\'utilisation des données',
      'Confirmation d\'opt-out',
      'Documentation de l\'anonymisation',
    ],
    questionsToConsider: [
      'Le contrat interdit-il explicitement l\'entraînement ?',
      'Avez-vous activé l\'opt-out si disponible ?',
      'Peut-on utiliser une version on-premise ?',
    ],
    stakeholdersToConsult: ['Juridique', 'DPO', 'Achats'],
  },

  {
    id: 'E-05',
    name: 'Single provider without alternative',
    nameFr: 'Fournisseur unique sans alternative',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: 'AI', attribute: 'isExternal', value: true },
        { attribute: 'hasAlternativeProvider', value: false },
      ],
      edgeConditions: [
        { criticality: ['CRITICAL', 'IMPORTANT'] },
      ],
    },
    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'MASTERY',
      formulationTemplate: 'Une dépendance critique à un fournisseur unique ({provider}) crée un risque de lock-in.',
      mechanismTemplate: '{nodeName} dépend exclusivement de {provider} sans alternative identifiée.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'isCoreFunction === true', label: 'Fonction cœur de métier', severityModifier: +1 },
      { condition: 'switchingCostHigh === true', label: 'Coût de migration élevé', severityModifier: +1 },
      { condition: 'proprietaryFormat === true', label: 'Format propriétaire', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasAlternativeIdentified === true', label: 'Alternative identifiée', severityModifier: -1 },
      { condition: 'usesStandardFormats === true', label: 'Formats standards', severityModifier: -1 },
      { condition: 'hasMigrationPlan === true', label: 'Plan de migration documenté', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Alternative identifiée et testée',
      'Utilisation de formats et API standards',
      'Plan de migration documenté',
      'Contrat avec clause de réversibilité',
    ],
    requiredEvidences: [
      'Étude des alternatives',
      'Plan de réversibilité',
      'Clause contractuelle de portabilité',
    ],
    questionsToConsider: [
      'Que se passe-t-il si le fournisseur cesse son activité ?',
      'Peut-on migrer vers un autre fournisseur rapidement ?',
      'Les données sont-elles exportables ?',
    ],
    stakeholdersToConsult: ['Architecte', 'Achats', 'Direction technique'],
  },

  {
    id: 'E-06',
    name: 'Uncontrolled updates from provider',
    nameFr: 'Mises à jour non contrôlées du fournisseur',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: 'AI', attribute: 'isExternal', value: true },
        { attribute: 'hasVersionControl', value: false },
      ],
    },
    produces: {
      domainA: 'MASTERY',
      domainB: 'SECURITY',
      formulationTemplate: 'Le fournisseur peut modifier le comportement de {nodeName} sans préavis.',
      mechanismTemplate: '{provider} peut mettre à jour {nodeName} de manière unilatérale, affectant les résultats.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'isUsedForDecision === true', label: 'Utilisé pour des décisions', severityModifier: +1 },
      { condition: 'noChangeNotification === true', label: 'Pas de notification des changements', severityModifier: +1 },
      { condition: 'noRollbackPossible === true', label: 'Pas de rollback possible', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasVersionPinning === true', label: 'Version épinglée', severityModifier: -1 },
      { condition: 'hasChangelogMonitoring === true', label: 'Monitoring des changelogs', severityModifier: -1 },
      { condition: 'hasTestBeforeUpdate === true', label: 'Tests avant mise à jour', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Épinglage de version quand possible',
      'Monitoring des changelogs du fournisseur',
      'Tests de régression après chaque mise à jour',
      'Environnement de staging pour valider les mises à jour',
    ],
    requiredEvidences: [
      'Politique de gestion des versions',
      'Procédure de test post-mise à jour',
      'Historique des versions utilisées',
    ],
    questionsToConsider: [
      'Êtes-vous informé des mises à jour du modèle ?',
      'Pouvez-vous contrôler la version utilisée ?',
      'Avez-vous des tests pour détecter les dérives ?',
    ],
    stakeholdersToConsult: ['DevOps', 'QA', 'Product Owner'],
  },

  {
    id: 'E-07',
    name: 'Subcontracting chain',
    nameFr: 'Chaîne de sous-traitance',
    family: 'DEPENDENCY',
    conditions: {
      graphConditions: [
        { chainExists: { nodeType: 'ORG', attribute: 'isExternal', value: true, minLength: 2 } },
      ],
    },
    produces: {
      domainA: 'TRANSPARENCY',
      domainB: 'RESPONSIBILITY',
      formulationTemplate: 'Une chaîne de sous-traitance complexe dilue la responsabilité.',
      mechanismTemplate: 'Les données transitent par {chainLength} sous-traitants successifs.',
    },
    severityBase: 3,
    aggravatingFactors: [
      { condition: 'chainLength > 3', label: 'Plus de 3 niveaux', severityModifier: +1 },
      { condition: 'hasUnknownSubcontractor === true', label: 'Sous-traitant non identifié', severityModifier: +1 },
      { condition: 'containsSensitiveData === true', label: 'Données sensibles dans la chaîne', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'allSubcontractorsDocumented === true', label: 'Tous documentés', severityModifier: -1 },
      { condition: 'allHaveDPA === true', label: 'DPA avec tous', severityModifier: -1 },
      { condition: 'auditRightOnAll === true', label: 'Droit d\'audit sur tous', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Cartographie complète de la chaîne',
      'DPA en cascade',
      'Droit d\'audit sur toute la chaîne',
      'Limitation contractuelle de la sous-traitance',
    ],
    requiredEvidences: [
      'Liste des sous-traitants',
      'Contrats en cascade',
      'Audit de la chaîne',
    ],
    questionsToConsider: [
      'Connaissez-vous tous les sous-traitants impliqués ?',
      'Chaque maillon a-t-il des obligations contractuelles ?',
      'Pouvez-vous auditer toute la chaîne ?',
    ],
    stakeholdersToConsult: ['DPO', 'Achats', 'Juridique'],
  },

  {
    id: 'E-08',
    name: 'Data processing outside EU',
    nameFr: 'Traitement de données hors UE',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: ['AI', 'INFRA'], attribute: 'isExternal', value: true },
        { attribute: 'location', value: 'outside_eu' },
      ],
      edgeConditions: [
        { dataCategories: { includes: ['IDENTIFIER', 'HEALTH', 'BIOMETRIC', 'JUDICIAL', 'FINANCIAL'] } },
      ],
    },
    produces: {
      domainA: 'SOVEREIGNTY',
      domainB: 'PRIVACY',
      formulationTemplate: 'Des données personnelles sont traitées en dehors de l\'UE.',
      mechanismTemplate: '{nodeName} traite des données {dataCategories} depuis {location}.',
    },
    severityBase: 4,
    aggravatingFactors: [
      { condition: 'noAdequacyDecision === true', label: 'Pas de décision d\'adéquation', severityModifier: +1 },
      { condition: 'noSCC === true', label: 'Pas de clauses contractuelles types', severityModifier: +1 },
      { condition: 'subjectToForeignLaw === true', label: 'Soumis à loi étrangère (CLOUD Act)', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'hasAdequacyDecision === true', label: 'Décision d\'adéquation', severityModifier: -1 },
      { condition: 'hasSCC === true', label: 'SCC signées', severityModifier: -1 },
      { condition: 'hasE2EEncryption === true', label: 'Chiffrement E2E', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Clauses contractuelles types (SCC)',
      'Chiffrement avec clés locales',
      'Analyse d\'impact du transfert (TIA)',
      'Mesures supplémentaires documentées',
    ],
    requiredEvidences: [
      'SCC signées',
      'Transfer Impact Assessment',
      'Mesures de protection documentées',
    ],
    questionsToConsider: [
      'Les autorités étrangères peuvent-elles accéder aux données ?',
      'Le chiffrement protège-t-il contre l\'accès du fournisseur ?',
      'Une alternative européenne existe-t-elle ?',
    ],
    stakeholdersToConsult: ['DPO', 'Juridique', 'RSSI'],
  },

  {
    id: 'E-09',
    name: 'Compute efficiency vs environmental impact',
    nameFr: 'Efficacité de calcul vs impact environnemental',
    family: 'DEPENDENCY',
    conditions: {
      nodeConditions: [
        { type: 'AI', attribute: 'aiSubtype', value: ['llm', 'ml_model'] },
        { attribute: 'isComputeIntensive', value: true },
      ],
    },
    produces: {
      domainA: 'SUSTAINABILITY',
      domainB: 'MASTERY',
      formulationTemplate: 'L\'utilisation de modèles intensifs en calcul a un impact environnemental significatif.',
      mechanismTemplate: '{nodeName} consomme d\'importantes ressources de calcul pour {edgeIntent}.',
    },
    severityBase: 2,
    aggravatingFactors: [
      { condition: 'isUsedAtScale === true', label: 'Utilisé à grande échelle', severityModifier: +1 },
      { condition: 'noOptimization === true', label: 'Pas d\'optimisation', severityModifier: +1 },
      { condition: 'datacenterNotGreen === true', label: 'Datacenter non vert', severityModifier: +1 },
    ],
    mitigatingFactors: [
      { condition: 'usesGreenEnergy === true', label: 'Énergie renouvelable', severityModifier: -1 },
      { condition: 'hasModelOptimization === true', label: 'Modèle optimisé', severityModifier: -1 },
      { condition: 'usesCaching === true', label: 'Mise en cache des résultats', severityModifier: -1 },
    ],
    acceptablePatterns: [
      'Utilisation de datacenters verts',
      'Optimisation du modèle (distillation, quantization)',
      'Mise en cache intelligente des résultats',
      'Mesure et compensation carbone',
    ],
    requiredEvidences: [
      'Bilan carbone du service',
      'Documentation des optimisations',
      'Engagement environnemental du fournisseur',
    ],
    questionsToConsider: [
      'Avez-vous mesuré l\'empreinte carbone ?',
      'Un modèle plus léger pourrait-il suffire ?',
      'La mise en cache est-elle optimale ?',
    ],
    stakeholdersToConsult: ['RSE', 'Architecte', 'Direction'],
  },
];
