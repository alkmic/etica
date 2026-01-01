// Patterns de tensions (dilemmes éthiques) ETICA - Version enrichie
// Chaque pattern contient des règles de détection avec amplificateurs et mitigateurs

import { DomainId } from './domains'

// ============================================
// TYPES
// ============================================

export type TensionLevel = 'INDIVIDUAL' | 'RELATIONAL' | 'SYSTEMIC'

export interface Amplifier {
  id: string
  label: string
  description: string
  severityBonus: number // +1 to +3
  condition: string // Description de la condition
}

export interface Mitigator {
  id: string
  label: string
  description: string
  severityReduction: number // -1 to -2
  condition: string // Description de la condition
}

export interface TensionPattern {
  id: string
  title: string
  shortTitle: string
  description: string
  // Les deux pôles de la tension
  poles: [DomainId, DomainId]
  // Domaines impactés (peut être plus large que les pôles)
  impactedDomains: DomainId[]
  // Niveau de la tension
  level: TensionLevel
  // Sévérité de base (1-5)
  baseSeverity: number
  // Exemples concrets
  examples: string[]
  // Questions à se poser pour l'arbitrage
  arbitrationQuestions: string[]
  // Actions suggérées par défaut
  defaultActions: string[]
  // Amplificateurs qui augmentent la sévérité
  amplifiers: Amplifier[]
  // Mitigateurs qui diminuent la sévérité
  mitigators: Mitigator[]
}

// ============================================
// AMPLIFICATEURS COMMUNS
// ============================================

const COMMON_AMPLIFIERS = {
  vulnerablePopulation: {
    id: 'vulnerable_population',
    label: 'Population vulnérable',
    description: 'Les personnes concernées sont vulnérables',
    severityBonus: 2,
    condition: 'hasVulnerable = true',
  },
  minors: {
    id: 'minors',
    label: 'Présence de mineurs',
    description: 'Des mineurs sont concernés',
    severityBonus: 2,
    condition: 'Node HUMAN avec isMinor = true',
  },
  largeScale: {
    id: 'large_scale',
    label: 'Grande échelle',
    description: 'Plus de 100 000 personnes concernées',
    severityBonus: 1,
    condition: 'scale = LARGE ou VERY_LARGE',
  },
  highSensitivity: {
    id: 'high_sensitivity',
    label: 'Données hautement sensibles',
    description: 'Données de santé, biométrie, opinions, etc.',
    severityBonus: 2,
    condition: 'sensitivity = HIGHLY_SENSITIVE',
  },
  noRecourse: {
    id: 'no_recourse',
    label: 'Absence de recours',
    description: 'Pas de possibilité de contestation',
    severityBonus: 2,
    condition: 'automation = AUTO_NO_RECOURSE',
  },
  highIrreversibility: {
    id: 'high_irreversibility',
    label: 'Décision irréversible',
    description: 'Les conséquences sont difficiles à réparer',
    severityBonus: 1,
    condition: 'irreversibility >= 4',
  },
  highOpacity: {
    id: 'high_opacity',
    label: 'Forte opacité',
    description: 'Le système est difficilement explicable',
    severityBonus: 1,
    condition: 'opacity >= 4',
  },
  highRiskDomain: {
    id: 'high_risk_domain',
    label: 'Domaine à haut risque',
    description: 'Santé, justice, RH, finance, etc.',
    severityBonus: 1,
    condition: 'domain in [HEALTH, JUSTICE, HR, FINANCE, EDUCATION, ADMINISTRATION]',
  },
}

// ============================================
// MITIGATEURS COMMUNS
// ============================================

const COMMON_MITIGATORS = {
  biasTests: {
    id: 'bias_tests',
    label: 'Tests de biais effectués',
    description: 'Des tests de biais ont été réalisés et documentés',
    severityReduction: 1,
    condition: 'Node AI avec hasBiasTests = true',
  },
  humanReview: {
    id: 'human_review',
    label: 'Revue humaine',
    description: 'Une revue humaine systématique est en place',
    severityReduction: 1,
    condition: 'Node AI avec hasHumanReview = true',
  },
  explainability: {
    id: 'explainability',
    label: 'Explicabilité disponible',
    description: 'Le système peut expliquer ses décisions',
    severityReduction: 1,
    condition: 'Node AI avec hasExplainability = true',
  },
  consent: {
    id: 'consent',
    label: 'Consentement obtenu',
    description: 'Un consentement éclairé a été recueilli',
    severityReduction: 1,
    condition: 'Node HUMAN avec hasConsent = true',
  },
  canContest: {
    id: 'can_contest',
    label: 'Contestation possible',
    description: 'Les personnes peuvent contester les décisions',
    severityReduction: 1,
    condition: 'Node HUMAN avec canContest = true',
  },
  encrypted: {
    id: 'encrypted',
    label: 'Données chiffrées',
    description: 'Les données sont chiffrées au repos et en transit',
    severityReduction: 1,
    condition: 'Node INFRA avec isEncrypted = true',
  },
  dataMinimization: {
    id: 'data_minimization',
    label: 'Minimisation des données',
    description: 'Seules les données strictement nécessaires sont collectées',
    severityReduction: 1,
    condition: 'dataCategories.length <= 3',
  },
}

// ============================================
// PATTERNS DE TENSIONS INDIVIDUELLES
// ============================================

export const TENSION_PATTERNS: Record<string, TensionPattern> = {
  // 1. Sécurité vs Vie privée
  SECURITY_VS_PRIVACY: {
    id: 'SECURITY_VS_PRIVACY',
    title: 'Sécurité vs Vie privée',
    shortTitle: 'Sécurité / Vie privée',
    description: 'La protection des personnes contre les risques nécessite une collecte ou surveillance qui porte atteinte à leur vie privée.',
    poles: ['SECURITY', 'PRIVACY'],
    impactedDomains: ['SECURITY', 'PRIVACY', 'AUTONOMY'],
    level: 'INDIVIDUAL',
    baseSeverity: 3,
    examples: [
      'Détection de fraude bancaire nécessitant l\'analyse des transactions',
      'Surveillance pour prévenir le terrorisme',
      'Monitoring des employés pour la sécurité informatique',
      'Vérification d\'identité biométrique',
    ],
    arbitrationQuestions: [
      'La surveillance est-elle proportionnée au risque ?',
      'Des alternatives moins intrusives existent-elles ?',
      'Les données collectées sont-elles strictement nécessaires ?',
      'Une durée de conservation limitée est-elle respectée ?',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'DATA_MINIMIZATION', 'ACCESS_RIGHTS', 'RETENTION_POLICY'],
    amplifiers: [
      COMMON_AMPLIFIERS.highSensitivity,
      COMMON_AMPLIFIERS.largeScale,
      COMMON_AMPLIFIERS.vulnerablePopulation,
    ],
    mitigators: [
      COMMON_MITIGATORS.consent,
      COMMON_MITIGATORS.encrypted,
      COMMON_MITIGATORS.dataMinimization,
    ],
  },

  // 2. Performance vs Équité
  PERFORMANCE_VS_EQUITY: {
    id: 'PERFORMANCE_VS_EQUITY',
    title: 'Performance vs Équité',
    shortTitle: 'Performance / Équité',
    description: 'L\'optimisation de la performance peut créer ou amplifier des biais discriminatoires.',
    poles: ['ACCOUNTABILITY', 'EQUITY'],
    impactedDomains: ['EQUITY', 'ACCOUNTABILITY', 'TRANSPARENCY'],
    level: 'INDIVIDUAL',
    baseSeverity: 3,
    examples: [
      'Modèle de recrutement reproduisant les biais historiques',
      'Scoring de risque défavorisant certains quartiers',
      'Reconnaissance faciale moins précise pour certaines ethnies',
      'Prédiction de récidive reproduisant les inégalités judiciaires',
    ],
    arbitrationQuestions: [
      'Des tests de biais ont-ils été effectués ?',
      'Quelle métrique de fairness est privilégiée ?',
      'Un compromis performance/équité est-il acceptable ?',
      'Les données d\'entraînement ont-elles été corrigées ?',
    ],
    defaultActions: ['BIAS_TESTING', 'FAIRNESS_METRICS', 'REGULAR_AUDIT', 'TRAINING'],
    amplifiers: [
      COMMON_AMPLIFIERS.vulnerablePopulation,
      COMMON_AMPLIFIERS.highRiskDomain,
      COMMON_AMPLIFIERS.noRecourse,
      COMMON_AMPLIFIERS.largeScale,
    ],
    mitigators: [
      COMMON_MITIGATORS.biasTests,
      COMMON_MITIGATORS.humanReview,
      COMMON_MITIGATORS.canContest,
    ],
  },

  // 3. Efficacité vs Transparence
  EFFICIENCY_VS_TRANSPARENCY: {
    id: 'EFFICIENCY_VS_TRANSPARENCY',
    title: 'Efficacité vs Transparence',
    shortTitle: 'Efficacité / Transparence',
    description: 'Les modèles les plus performants (deep learning, ensemble methods) sont souvent les moins explicables.',
    poles: ['ACCOUNTABILITY', 'TRANSPARENCY'],
    impactedDomains: ['TRANSPARENCY', 'RECOURSE', 'ACCOUNTABILITY'],
    level: 'INDIVIDUAL',
    baseSeverity: 3,
    examples: [
      'Scoring de crédit par gradient boosting',
      'Diagnostic médical par réseau de neurones',
      'Détection de fraude par algorithmes complexes',
      'Recommandation par filtrage collaboratif',
    ],
    arbitrationQuestions: [
      'Le gain de performance justifie-t-il l\'opacité ?',
      'Une couche d\'explicabilité peut-elle être ajoutée ?',
      'Les cas à fort impact peuvent-ils être traités différemment ?',
      'Un modèle plus simple serait-il acceptable ?',
    ],
    defaultActions: ['EXPLAINABILITY_LAYER', 'TRANSPARENCY_FACTORS', 'HUMAN_REVIEW_THRESHOLD'],
    amplifiers: [
      COMMON_AMPLIFIERS.highOpacity,
      COMMON_AMPLIFIERS.highIrreversibility,
      COMMON_AMPLIFIERS.highRiskDomain,
    ],
    mitigators: [
      COMMON_MITIGATORS.explainability,
      COMMON_MITIGATORS.humanReview,
    ],
  },

  // 4. Automatisation vs Recours
  AUTOMATION_VS_RECOURSE: {
    id: 'AUTOMATION_VS_RECOURSE',
    title: 'Automatisation vs Recours',
    shortTitle: 'Automatisation / Recours',
    description: 'Les décisions automatiques rapides et à grande échelle peuvent ne pas laisser de place à la contestation individuelle.',
    poles: ['ACCOUNTABILITY', 'RECOURSE'],
    impactedDomains: ['RECOURSE', 'AUTONOMY', 'ACCOUNTABILITY'],
    level: 'INDIVIDUAL',
    baseSeverity: 4,
    examples: [
      'Modération automatique de contenu',
      'Tri automatique de candidatures',
      'Décision de crédit instantanée',
      'Tarification dynamique en temps réel',
    ],
    arbitrationQuestions: [
      'Chaque décision peut-elle être contestée ?',
      'Un humain peut-il intervenir sur demande ?',
      'Le délai de recours est-il raisonnable ?',
      'La contestation a-t-elle une chance d\'aboutir ?',
    ],
    defaultActions: ['HUMAN_REVIEW_THRESHOLD', 'APPEAL_PROCESS', 'CONTACT_HUMAN'],
    amplifiers: [
      COMMON_AMPLIFIERS.noRecourse,
      COMMON_AMPLIFIERS.largeScale,
      COMMON_AMPLIFIERS.highIrreversibility,
    ],
    mitigators: [
      COMMON_MITIGATORS.canContest,
      COMMON_MITIGATORS.humanReview,
    ],
  },

  // 5. Personnalisation vs Autonomie
  PERSONALIZATION_VS_AUTONOMY: {
    id: 'PERSONALIZATION_VS_AUTONOMY',
    title: 'Personnalisation vs Autonomie',
    shortTitle: 'Personnalisation / Autonomie',
    description: 'L\'adaptation du service aux préférences de l\'utilisateur peut créer des bulles de filtre et limiter sa liberté de découverte.',
    poles: ['PRIVACY', 'AUTONOMY'],
    impactedDomains: ['AUTONOMY', 'PRIVACY', 'TRANSPARENCY'],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [
      'Recommandations de contenu (Netflix, YouTube)',
      'Fil d\'actualité personnalisé (réseaux sociaux)',
      'Suggestions produits (e-commerce)',
      'Personnalisation de l\'apprentissage (EdTech)',
    ],
    arbitrationQuestions: [
      'La personnalisation enferme-t-elle dans une bulle ?',
      'Des contenus diversifiés sont-ils proposés ?',
      'L\'utilisateur peut-il contrôler le niveau de personnalisation ?',
      'Les critères de personnalisation sont-ils transparents ?',
    ],
    defaultActions: ['TRANSPARENCY_FACTORS', 'USER_CONTROLS', 'DIVERSE_OPTIONS'],
    amplifiers: [
      COMMON_AMPLIFIERS.minors,
      COMMON_AMPLIFIERS.vulnerablePopulation,
      { id: 'high_engagement', label: 'Optimisation de l\'engagement', description: 'Le système optimise le temps passé', severityBonus: 1, condition: 'objectif = engagement ou temps passé' },
    ],
    mitigators: [
      COMMON_MITIGATORS.consent,
      { id: 'user_controls', label: 'Contrôles utilisateur', description: 'L\'utilisateur peut ajuster les paramètres', severityReduction: 1, condition: 'contrôles de personnalisation disponibles' },
    ],
  },

  // 6. Précision vs Minimisation
  PRECISION_VS_MINIMIZATION: {
    id: 'PRECISION_VS_MINIMIZATION',
    title: 'Précision vs Minimisation',
    shortTitle: 'Précision / Minimisation',
    description: 'La qualité du modèle peut nécessiter plus de données que le principe de minimisation ne le permet.',
    poles: ['ACCOUNTABILITY', 'PRIVACY'],
    impactedDomains: ['PRIVACY', 'ACCOUNTABILITY'],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [
      'Enrichissement de profil pour meilleures recommandations',
      'Historique long pour prédiction précise',
      'Données contextuelles pour personnalisation',
      'Features multiples pour classification',
    ],
    arbitrationQuestions: [
      'Chaque donnée est-elle vraiment utile au modèle ?',
      'L\'amélioration marginale justifie-t-elle plus de données ?',
      'Des techniques de privacy-preserving sont-elles applicables ?',
      'L\'utilisateur est-il informé et consentant ?',
    ],
    defaultActions: ['DATA_MINIMIZATION', 'PURPOSE_LIMITATION', 'RETENTION_POLICY'],
    amplifiers: [
      COMMON_AMPLIFIERS.highSensitivity,
      { id: 'many_categories', label: 'Nombreuses catégories', description: 'Plus de 5 catégories de données', severityBonus: 1, condition: 'dataCategories.length > 5' },
    ],
    mitigators: [
      COMMON_MITIGATORS.consent,
      COMMON_MITIGATORS.dataMinimization,
    ],
  },

  // 7. Mémoire vs Oubli
  EXHAUSTIVITY_VS_OBLIVION: {
    id: 'EXHAUSTIVITY_VS_OBLIVION',
    title: 'Mémoire vs Oubli',
    shortTitle: 'Mémoire / Oubli',
    description: 'La conservation des données historiques peut entrer en conflit avec le droit à l\'oubli et au nouveau départ.',
    poles: ['ACCOUNTABILITY', 'PRIVACY'],
    impactedDomains: ['PRIVACY', 'EQUITY', 'AUTONOMY'],
    level: 'INDIVIDUAL',
    baseSeverity: 3,
    examples: [
      'Historique de crédit long',
      'Archives de posts sur les réseaux sociaux',
      'Dossiers scolaires ou médicaux',
      'Traces de recherche et navigation',
    ],
    arbitrationQuestions: [
      'Quelle durée de conservation est justifiée ?',
      'L\'effacement est-il effectivement possible ?',
      'Les erreurs passées peuvent-elles être pardonnées ?',
      'Un "droit au nouveau départ" est-il reconnu ?',
    ],
    defaultActions: ['RETENTION_POLICY', 'DATA_MINIMIZATION', 'ACCESS_RIGHTS'],
    amplifiers: [
      { id: 'long_retention', label: 'Conservation longue', description: 'Données conservées > 5 ans', severityBonus: 1, condition: 'retentionPolicy = MORE_THAN_5_YEARS ou INDEFINITE' },
      COMMON_AMPLIFIERS.highSensitivity,
    ],
    mitigators: [
      { id: 'erasure_process', label: 'Processus d\'effacement', description: 'Un processus d\'effacement existe', severityReduction: 1, condition: 'Node INFRA avec hasErasureProcess = true' },
    ],
  },

  // 8. Prédiction vs Libre arbitre
  PREDICTION_VS_FREEWILL: {
    id: 'PREDICTION_VS_FREEWILL',
    title: 'Prédiction vs Libre arbitre',
    shortTitle: 'Prédiction / Libre arbitre',
    description: 'Les systèmes prédictifs peuvent créer des prophéties auto-réalisatrices qui enferment les personnes dans leur passé.',
    poles: ['ACCOUNTABILITY', 'AUTONOMY'],
    impactedDomains: ['AUTONOMY', 'EQUITY', 'TRANSPARENCY'],
    level: 'INDIVIDUAL',
    baseSeverity: 3,
    examples: [
      'Score de risque de récidive',
      'Prédiction d\'échec scolaire',
      'Anticipation de démission',
      'Risque de défaut de paiement',
    ],
    arbitrationQuestions: [
      'La prédiction influence-t-elle le résultat ?',
      'La personne peut-elle "déjouer" la prédiction ?',
      'Le passé condamne-t-il définitivement ?',
      'Des mécanismes de "deuxième chance" existent-ils ?',
    ],
    defaultActions: ['TRANSPARENCY_FACTORS', 'APPEAL_PROCESS', 'OVERRIDE_CAPABILITY'],
    amplifiers: [
      COMMON_AMPLIFIERS.highIrreversibility,
      COMMON_AMPLIFIERS.highRiskDomain,
      COMMON_AMPLIFIERS.vulnerablePopulation,
    ],
    mitigators: [
      COMMON_MITIGATORS.canContest,
      COMMON_MITIGATORS.humanReview,
      COMMON_MITIGATORS.explainability,
    ],
  },

  // 9. Rapidité vs Réflexion
  SPEED_VS_REFLECTION: {
    id: 'SPEED_VS_REFLECTION',
    title: 'Rapidité vs Réflexion',
    shortTitle: 'Rapidité / Réflexion',
    description: 'L\'exigence de décisions en temps réel peut empêcher une analyse approfondie des cas particuliers.',
    poles: ['ACCOUNTABILITY', 'RECOURSE'],
    impactedDomains: ['RECOURSE', 'ACCOUNTABILITY', 'EQUITY'],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [
      'Modération en temps réel',
      'Trading algorithmique',
      'Décisions médicales urgentes',
      'Réponses automatiques de chatbot',
    ],
    arbitrationQuestions: [
      'La rapidité est-elle vraiment nécessaire ?',
      'Les cas complexes peuvent-ils être mis en attente ?',
      'Une revue a posteriori est-elle possible ?',
      'L\'urgence est-elle réelle ou artificielle ?',
    ],
    defaultActions: ['HUMAN_REVIEW_THRESHOLD', 'OVERRIDE_CAPABILITY'],
    amplifiers: [
      { id: 'realtime', label: 'Temps réel', description: 'Décision en moins d\'une seconde', severityBonus: 1, condition: 'frequency = REALTIME' },
      COMMON_AMPLIFIERS.highIrreversibility,
    ],
    mitigators: [
      COMMON_MITIGATORS.humanReview,
      { id: 'async_review', label: 'Revue asynchrone', description: 'Une revue peut être demandée après coup', severityReduction: 1, condition: 'revue a posteriori possible' },
    ],
  },

  // 10. Protection vs Paternalisme
  WELLBEING_VS_AUTONOMY: {
    id: 'WELLBEING_VS_AUTONOMY',
    title: 'Protection vs Paternalisme',
    shortTitle: 'Protection / Paternalisme',
    description: 'La protection des personnes contre elles-mêmes peut devenir du paternalisme qui nie leur capacité de décision.',
    poles: ['SECURITY', 'AUTONOMY'],
    impactedDomains: ['AUTONOMY', 'SECURITY', 'RECOURSE'],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [
      'Blocage de contenu "pour votre bien"',
      'Limitations d\'usage "pour votre santé"',
      'Recommandations "santé" imposées',
      'Restrictions "de protection"',
    ],
    arbitrationQuestions: [
      'L\'intervention est-elle sollicitée ou imposée ?',
      'La personne est-elle en capacité de décider ?',
      'Le paternalisme est-il proportionné au risque ?',
      'Des options de "sortie" existent-elles ?',
    ],
    defaultActions: ['USER_CONTROLS', 'TRANSPARENCY_NOTICE', 'DIVERSE_OPTIONS'],
    amplifiers: [
      { id: 'no_opt_out', label: 'Pas de désactivation', description: 'L\'utilisateur ne peut pas désactiver la protection', severityBonus: 1, condition: 'pas d\'option de désactivation' },
    ],
    mitigators: [
      COMMON_MITIGATORS.consent,
      { id: 'opt_out', label: 'Désactivation possible', description: 'L\'utilisateur peut désactiver', severityReduction: 1, condition: 'option de désactivation disponible' },
    ],
  },

  // 11. Aide vs Dépendance
  ASSISTANCE_VS_DEPENDENCY: {
    id: 'ASSISTANCE_VS_DEPENDENCY',
    title: 'Aide vs Dépendance',
    shortTitle: 'Aide / Dépendance',
    description: 'L\'assistance automatisée peut créer une dépendance qui diminue les capacités autonomes des utilisateurs.',
    poles: ['ACCOUNTABILITY', 'AUTONOMY'],
    impactedDomains: ['AUTONOMY', 'SUSTAINABILITY', 'ACCOUNTABILITY'],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [
      'GPS qui fait oublier comment s\'orienter',
      'Correcteur orthographique qui fait régresser l\'orthographe',
      'IA de codage qui diminue les compétences',
      'Assistant vocal qui remplace la réflexion',
    ],
    arbitrationQuestions: [
      'L\'assistance maintient-elle les compétences de l\'utilisateur ?',
      'L\'utilisateur peut-il fonctionner sans le système ?',
      'Une utilisation progressive est-elle possible ?',
      'Les compétences fondamentales sont-elles préservées ?',
    ],
    defaultActions: ['USER_CONTROLS', 'TRAINING', 'TRANSPARENCY_NOTICE'],
    amplifiers: [
      COMMON_AMPLIFIERS.minors,
      { id: 'critical_skill', label: 'Compétence critique', description: 'Compétence essentielle pour l\'autonomie', severityBonus: 1, condition: 'compétence fondamentale concernée' },
    ],
    mitigators: [
      { id: 'skill_preservation', label: 'Préservation des compétences', description: 'Le système encourage le maintien des compétences', severityReduction: 1, condition: 'mode d\'apprentissage disponible' },
    ],
  },

  // 12. Efficacité vs Intervention humaine
  EFFICIENCY_VS_HUMAN_CONTROL: {
    id: 'EFFICIENCY_VS_HUMAN_CONTROL',
    title: 'Efficacité vs Intervention humaine',
    shortTitle: 'Efficacité / Intervention humaine',
    description: 'L\'automatisation complète peut éliminer le contrôle humain nécessaire pour les cas exceptionnels.',
    poles: ['ACCOUNTABILITY', 'ACCOUNTABILITY'],
    impactedDomains: ['ACCOUNTABILITY', 'RECOURSE', 'SECURITY'],
    level: 'INDIVIDUAL',
    baseSeverity: 3,
    examples: [
      'Chaîne de production entièrement automatisée',
      'Décisions médicales sans supervision',
      'Trading haute fréquence sans circuit breaker',
      'Véhicule autonome sans possibilité de reprise',
    ],
    arbitrationQuestions: [
      'Un humain peut-il intervenir à tout moment ?',
      'Les cas exceptionnels sont-ils détectés ?',
      'Un arrêt d\'urgence est-il possible ?',
      'La supervision est-elle effective ou symbolique ?',
    ],
    defaultActions: ['HUMAN_REVIEW_THRESHOLD', 'OVERRIDE_CAPABILITY', 'MONITORING', 'INCIDENT_PROCESS'],
    amplifiers: [
      { id: 'no_override', label: 'Pas de reprise manuelle', description: 'L\'humain ne peut pas reprendre le contrôle', severityBonus: 2, condition: 'pas de possibilité de reprise manuelle' },
      COMMON_AMPLIFIERS.highIrreversibility,
    ],
    mitigators: [
      COMMON_MITIGATORS.humanReview,
      { id: 'emergency_stop', label: 'Arrêt d\'urgence', description: 'Un bouton d\'arrêt d\'urgence existe', severityReduction: 1, condition: 'arrêt d\'urgence possible' },
    ],
  },

  // ============================================
  // TENSIONS SYSTÉMIQUES
  // ============================================

  // 13. Efficacité vs Emploi
  EFFICIENCY_VS_EMPLOYMENT: {
    id: 'EFFICIENCY_VS_EMPLOYMENT',
    title: 'Efficacité vs Emploi',
    shortTitle: 'Efficacité / Emploi',
    description: 'L\'automatisation peut supprimer des emplois sans proposer d\'alternatives aux personnes concernées.',
    poles: ['ACCOUNTABILITY', 'SUSTAINABILITY'],
    impactedDomains: ['SUSTAINABILITY', 'EQUITY', 'ACCOUNTABILITY'],
    level: 'SYSTEMIC',
    baseSeverity: 3,
    examples: [
      'Remplacement de caissiers par des caisses automatiques',
      'Automatisation du service client par chatbots',
      'Robotisation d\'usines',
      'IA remplaçant des analystes',
    ],
    arbitrationQuestions: [
      'L\'impact sur l\'emploi a-t-il été évalué ?',
      'Des mesures d\'accompagnement sont-elles prévues ?',
      'Les employés peuvent-ils être reconvertis ?',
      'Le bénéfice collectif justifie-t-il les pertes individuelles ?',
    ],
    defaultActions: ['TRAINING', 'TRANSPARENCY_NOTICE', 'STAGED_ROLLOUT'],
    amplifiers: [
      COMMON_AMPLIFIERS.largeScale,
      { id: 'no_transition', label: 'Pas de transition', description: 'Pas de plan de reconversion', severityBonus: 1, condition: 'pas de plan de transition' },
    ],
    mitigators: [
      { id: 'transition_plan', label: 'Plan de transition', description: 'Un plan de reconversion existe', severityReduction: 1, condition: 'plan de reconversion documenté' },
    ],
  },

  // 14. Performance vs Environnement
  PERFORMANCE_VS_ENVIRONMENT: {
    id: 'PERFORMANCE_VS_ENVIRONMENT',
    title: 'Performance vs Environnement',
    shortTitle: 'Performance / Environnement',
    description: 'Les modèles les plus performants sont souvent les plus gourmands en ressources et énergie.',
    poles: ['ACCOUNTABILITY', 'SUSTAINABILITY'],
    impactedDomains: ['SUSTAINABILITY', 'ACCOUNTABILITY'],
    level: 'SYSTEMIC',
    baseSeverity: 2,
    examples: [
      'Entraînement de grands modèles de langage',
      'Datacenters énergivores',
      'Calcul intensif pour la personnalisation',
      'Mise à jour continue des modèles',
    ],
    arbitrationQuestions: [
      'L\'empreinte carbone a-t-elle été mesurée ?',
      'Des alternatives moins gourmandes existent-elles ?',
      'L\'amélioration marginale justifie-t-elle le coût environnemental ?',
      'Des mesures de compensation sont-elles prévues ?',
    ],
    defaultActions: ['MONITORING', 'REGULAR_AUDIT'],
    amplifiers: [
      { id: 'llm_model', label: 'Modèle LLM', description: 'Utilisation d\'un grand modèle de langage', severityBonus: 1, condition: 'Node AI avec subtype = LLM_GENAI' },
      COMMON_AMPLIFIERS.largeScale,
    ],
    mitigators: [
      { id: 'green_hosting', label: 'Hébergement vert', description: 'Énergie renouvelable', severityReduction: 1, condition: 'hébergement alimenté en renouvelable' },
    ],
  },

  // 15. Centralisation vs Contrôle démocratique
  CENTRALIZATION_VS_DEMOCRACY: {
    id: 'CENTRALIZATION_VS_DEMOCRACY',
    title: 'Centralisation vs Contrôle démocratique',
    shortTitle: 'Centralisation / Démocratie',
    description: 'La concentration des systèmes d\'IA chez quelques acteurs peut menacer l\'équilibre démocratique.',
    poles: ['ACCOUNTABILITY', 'SUSTAINABILITY'],
    impactedDomains: ['SUSTAINABILITY', 'ACCOUNTABILITY', 'AUTONOMY'],
    level: 'SYSTEMIC',
    baseSeverity: 3,
    examples: [
      'Monopole sur les données de santé',
      'Concentration des services cloud',
      'Contrôle de l\'information par les algorithmes',
      'Dépendance à un fournisseur unique',
    ],
    arbitrationQuestions: [
      'Existe-t-il des alternatives au fournisseur ?',
      'Les données sont-elles portables ?',
      'Un contrôle externe est-il possible ?',
      'La dépendance est-elle réversible ?',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'REGULAR_AUDIT', 'RACI_GOVERNANCE'],
    amplifiers: [
      { id: 'single_provider', label: 'Fournisseur unique', description: 'Dépendance à un seul fournisseur', severityBonus: 1, condition: 'un seul fournisseur externe' },
      COMMON_AMPLIFIERS.largeScale,
    ],
    mitigators: [
      { id: 'data_portability', label: 'Portabilité des données', description: 'Les données peuvent être exportées', severityReduction: 1, condition: 'export des données possible' },
    ],
  },

  // 16. Standardisation vs Diversité
  STANDARDIZATION_VS_DIVERSITY: {
    id: 'STANDARDIZATION_VS_DIVERSITY',
    title: 'Standardisation vs Diversité',
    shortTitle: 'Standardisation / Diversité',
    description: 'Un traitement uniforme peut ignorer les besoins spécifiques de certaines populations ou situations.',
    poles: ['ACCOUNTABILITY', 'EQUITY'],
    impactedDomains: ['EQUITY', 'AUTONOMY', 'ACCOUNTABILITY'],
    level: 'SYSTEMIC',
    baseSeverity: 2,
    examples: [
      'Règles de scoring uniformes',
      'Processus automatisé identique pour tous',
      'Seuils fixes sans exception',
      'Interface unique sans adaptation',
    ],
    arbitrationQuestions: [
      'Le traitement uniforme crée-t-il des inégalités de fait ?',
      'Des exceptions sont-elles possibles ?',
      'Les situations particulières sont-elles prises en compte ?',
      'L\'adaptation au contexte est-elle envisageable ?',
    ],
    defaultActions: ['EXCEPTION_PROCESS', 'ACCOMMODATION', 'CASE_BY_CASE'],
    amplifiers: [
      COMMON_AMPLIFIERS.vulnerablePopulation,
      COMMON_AMPLIFIERS.largeScale,
    ],
    mitigators: [
      { id: 'exception_process', label: 'Processus d\'exception', description: 'Des exceptions peuvent être demandées', severityReduction: 1, condition: 'processus d\'exception documenté' },
      COMMON_MITIGATORS.humanReview,
    ],
  },

  // 17. Innovation vs Précaution
  INNOVATION_VS_PRECAUTION: {
    id: 'INNOVATION_VS_PRECAUTION',
    title: 'Innovation vs Précaution',
    shortTitle: 'Innovation / Précaution',
    description: 'Le déploiement de nouvelles technologies peut présenter des risques non encore identifiés.',
    poles: ['ACCOUNTABILITY', 'SECURITY'],
    impactedDomains: ['SECURITY', 'ACCOUNTABILITY', 'SUSTAINABILITY'],
    level: 'SYSTEMIC',
    baseSeverity: 3,
    examples: [
      'IA générative avec risques de désinformation',
      'Véhicules autonomes en environnement réel',
      'Agents IA avec capacités d\'action',
      'Systèmes d\'IA dans des contextes critiques',
    ],
    arbitrationQuestions: [
      'Les risques ont-ils été évalués de façon approfondie ?',
      'Un déploiement progressif est-il prévu ?',
      'Des mécanismes d\'arrêt d\'urgence existent-ils ?',
      'La surveillance post-déploiement est-elle suffisante ?',
    ],
    defaultActions: ['STAGED_ROLLOUT', 'MONITORING', 'INCIDENT_PROCESS'],
    amplifiers: [
      { id: 'genai', label: 'IA générative', description: 'Utilisation d\'IA générative', severityBonus: 1, condition: 'Node AI avec subtype = LLM_GENAI' },
      { id: 'critical_context', label: 'Contexte critique', description: 'Utilisé dans un contexte à fort enjeu', severityBonus: 1, condition: 'domain = HEALTH, JUSTICE, SECURITY' },
    ],
    mitigators: [
      { id: 'staged_rollout', label: 'Déploiement progressif', description: 'Déploiement par phases', severityReduction: 1, condition: 'déploiement progressif documenté' },
      { id: 'monitoring', label: 'Monitoring actif', description: 'Surveillance continue', severityReduction: 1, condition: 'système de monitoring en place' },
    ],
  },

  // ============================================
  // NOUVELLES TENSIONS
  // ============================================

  // 18. Personnalisation vs Égalité
  PERSONALIZATION_VS_EQUALITY: {
    id: 'PERSONALIZATION_VS_EQUALITY',
    title: 'Personnalisation vs Égalité',
    shortTitle: 'Personnalisation / Égalité',
    description: 'Un traitement adapté à chaque individu peut créer des inégalités entre personnes dans des situations similaires.',
    poles: ['ACCOUNTABILITY', 'EQUITY'],
    impactedDomains: ['EQUITY', 'TRANSPARENCY', 'ACCOUNTABILITY'],
    level: 'RELATIONAL',
    baseSeverity: 3,
    examples: [
      'Prix dynamiques selon le profil',
      'Offres différenciées selon le scoring',
      'Niveau de service adapté au "potentiel"',
      'Accès variable selon l\'historique',
    ],
    arbitrationQuestions: [
      'La différenciation est-elle justifiée objectivement ?',
      'Des personnes similaires sont-elles traitées différemment ?',
      'Les critères de différenciation sont-ils légitimes ?',
      'Un socle commun de service est-il garanti ?',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'FAIRNESS_METRICS', 'REGULAR_AUDIT'],
    amplifiers: [
      { id: 'price_discrimination', label: 'Discrimination tarifaire', description: 'Prix différents selon le profil', severityBonus: 1, condition: 'tarification dynamique basée sur le profil' },
      COMMON_AMPLIFIERS.vulnerablePopulation,
    ],
    mitigators: [
      { id: 'price_transparency', label: 'Transparence des prix', description: 'Les critères de prix sont expliqués', severityReduction: 1, condition: 'critères de tarification publics' },
    ],
  },

  // 19. Confidentialité vs Traçabilité
  CONFIDENTIALITY_VS_TRACEABILITY: {
    id: 'CONFIDENTIALITY_VS_TRACEABILITY',
    title: 'Confidentialité vs Traçabilité',
    shortTitle: 'Confidentialité / Traçabilité',
    description: 'L\'anonymisation protège la vie privée mais peut empêcher la contestation et la correction des erreurs.',
    poles: ['PRIVACY', 'RECOURSE'],
    impactedDomains: ['PRIVACY', 'RECOURSE', 'ACCOUNTABILITY'],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [
      'Données anonymisées pour la recherche',
      'Décisions sans trace individuelle',
      'Agrégation empêchant l\'identification',
      'Pseudonymisation irréversible',
    ],
    arbitrationQuestions: [
      'L\'anonymisation est-elle réversible si nécessaire ?',
      'Une personne peut-elle retrouver sa décision ?',
      'La contestation reste-t-elle possible ?',
      'Un équilibre pseudonymisation/traçabilité existe-t-il ?',
    ],
    defaultActions: ['APPEAL_PROCESS', 'TRANSPARENCY_NOTICE'],
    amplifiers: [
      COMMON_AMPLIFIERS.highIrreversibility,
    ],
    mitigators: [
      { id: 'reversible_anon', label: 'Anonymisation réversible', description: 'Possibilité de ré-identification contrôlée', severityReduction: 1, condition: 'pseudonymisation réversible' },
    ],
  },

  // 20. Collectif vs Individuel
  COLLECTIVE_VS_INDIVIDUAL: {
    id: 'COLLECTIVE_VS_INDIVIDUAL',
    title: 'Intérêt collectif vs Droits individuels',
    shortTitle: 'Collectif / Individuel',
    description: 'L\'optimisation pour le bien commun peut se faire au détriment de certains individus.',
    poles: ['SUSTAINABILITY', 'AUTONOMY'],
    impactedDomains: ['EQUITY', 'AUTONOMY', 'ACCOUNTABILITY'],
    level: 'SYSTEMIC',
    baseSeverity: 3,
    examples: [
      'Surveillance de masse pour la sécurité nationale',
      'Sacrifice d\'individus pour l\'efficacité globale',
      'Mutualisation des risques pénalisant les "bons profils"',
      'Optimisation du trafic défavorisant certains quartiers',
    ],
    arbitrationQuestions: [
      'Le bénéfice collectif est-il avéré et significatif ?',
      'Le préjudice individuel est-il proportionné ?',
      'Les personnes "sacrifiées" sont-elles compensées ?',
      'Des garde-fous contre les abus existent-ils ?',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'APPEAL_PROCESS', 'REGULAR_AUDIT'],
    amplifiers: [
      COMMON_AMPLIFIERS.largeScale,
      COMMON_AMPLIFIERS.vulnerablePopulation,
    ],
    mitigators: [
      COMMON_MITIGATORS.canContest,
      { id: 'compensation', label: 'Compensation prévue', description: 'Les personnes lésées sont compensées', severityReduction: 1, condition: 'mécanisme de compensation' },
    ],
  },

  // 21. Efficience économique vs Protection sociale
  EFFICIENCY_VS_PROTECTION: {
    id: 'EFFICIENCY_VS_PROTECTION',
    title: 'Efficience économique vs Protection sociale',
    shortTitle: 'Efficience / Protection',
    description: 'L\'optimisation des coûts peut réduire l\'accès aux services pour les populations moins rentables.',
    poles: ['ACCOUNTABILITY', 'EQUITY'],
    impactedDomains: ['EQUITY', 'RECOURSE', 'SUSTAINABILITY'],
    level: 'SYSTEMIC',
    baseSeverity: 3,
    examples: [
      'Exclusion des clients "non rentables"',
      'Réduction de service dans les zones peu denses',
      'Priorisation des "bons payeurs"',
      'Optimisation excluant les cas complexes',
    ],
    arbitrationQuestions: [
      'L\'exclusion est-elle justifiée ?',
      'Des alternatives sont-elles proposées aux exclus ?',
      'Un service universel minimum est-il garanti ?',
      'La rentabilité seule peut-elle décider de l\'accès ?',
    ],
    defaultActions: ['APPEAL_PROCESS', 'CONTACT_HUMAN', 'ACCOMMODATION'],
    amplifiers: [
      COMMON_AMPLIFIERS.vulnerablePopulation,
      { id: 'essential_service', label: 'Service essentiel', description: 'Service de base pour la vie quotidienne', severityBonus: 1, condition: 'service essentiel (banque, énergie, etc.)' },
    ],
    mitigators: [
      { id: 'universal_service', label: 'Service universel', description: 'Un service minimum est garanti pour tous', severityReduction: 1, condition: 'service universel défini' },
    ],
  },

  // 22. Accessibilité vs Contrôle
  ACCESSIBILITY_VS_CONTROL: {
    id: 'ACCESSIBILITY_VS_CONTROL',
    title: 'Accessibilité vs Contrôle',
    shortTitle: 'Accessibilité / Contrôle',
    description: 'L\'ouverture et la transparence des données ou algorithmes peuvent créer des risques de sécurité ou d\'abus.',
    poles: ['TRANSPARENCY', 'SECURITY'],
    impactedDomains: ['TRANSPARENCY', 'SECURITY', 'ACCOUNTABILITY'],
    level: 'RELATIONAL',
    baseSeverity: 2,
    examples: [
      'Publication des critères de scoring (gaming possible)',
      'Open source des modèles (détournement possible)',
      'Accès aux données personnelles (risque d\'usurpation)',
      'Transparence des processus (exploitation des failles)',
    ],
    arbitrationQuestions: [
      'Quelles informations peuvent être publiées sans risque ?',
      'Comment éviter le gaming des critères ?',
      'L\'accès peut-il être gradué selon les publics ?',
      'La sécurité par l\'obscurité est-elle vraiment efficace ?',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'MONITORING', 'ACCESS_RIGHTS'],
    amplifiers: [
      { id: 'gaming_risk', label: 'Risque de gaming', description: 'Les critères peuvent être exploités', severityBonus: 1, condition: 'critères facilement gamables' },
    ],
    mitigators: [
      { id: 'graduated_access', label: 'Accès gradué', description: 'Niveaux d\'accès différenciés', severityReduction: 1, condition: 'accès gradué selon le profil' },
    ],
  },

  // 23. Échelle vs Individualisation
  SCALE_VS_INDIVIDUALIZATION: {
    id: 'SCALE_VS_INDIVIDUALIZATION',
    title: 'Échelle vs Individualisation',
    shortTitle: 'Échelle / Individualisation',
    description: 'Le traitement de masse rend difficile la prise en compte des situations individuelles.',
    poles: ['ACCOUNTABILITY', 'RECOURSE'],
    impactedDomains: ['RECOURSE', 'EQUITY', 'ACCOUNTABILITY'],
    level: 'RELATIONAL',
    baseSeverity: 2,
    examples: [
      'Modération à grande échelle',
      'Décisions de crédit en volume',
      'Tri de candidatures en masse',
      'Service client automatisé',
    ],
    arbitrationQuestions: [
      'Les cas individuels peuvent-ils être examinés ?',
      'Le volume justifie-t-il l\'automatisation ?',
      'Des exceptions sont-elles prévues ?',
      'La qualité est-elle sacrifiée à la quantité ?',
    ],
    defaultActions: ['CASE_BY_CASE', 'HUMAN_REVIEW_THRESHOLD', 'EXCEPTION_PROCESS'],
    amplifiers: [
      COMMON_AMPLIFIERS.largeScale,
      COMMON_AMPLIFIERS.noRecourse,
    ],
    mitigators: [
      COMMON_MITIGATORS.humanReview,
      { id: 'sampling_review', label: 'Revue par échantillonnage', description: 'Vérification aléatoire des décisions', severityReduction: 1, condition: 'processus d\'échantillonnage' },
    ],
  },

  // 24. Exploitation des données vs Contrôle utilisateur
  DATA_EXPLOITATION_VS_USER_CONTROL: {
    id: 'DATA_EXPLOITATION_VS_USER_CONTROL',
    title: 'Exploitation des données vs Contrôle utilisateur',
    shortTitle: 'Exploitation / Contrôle',
    description: 'L\'utilisation extensive des données pour le service entre en tension avec le droit de contrôle des utilisateurs.',
    poles: ['ACCOUNTABILITY', 'AUTONOMY'],
    impactedDomains: ['AUTONOMY', 'PRIVACY', 'TRANSPARENCY'],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [
      'Amélioration du service vs consentement granulaire',
      'Analyse comportementale vs contrôle des données',
      'Personnalisation vs vie privée',
      'Enrichissement de profil vs minimisation',
    ],
    arbitrationQuestions: [
      'L\'utilisateur a-t-il vraiment le contrôle ?',
      'Le refus est-il réellement possible sans pénalité ?',
      'Les options sont-elles claires et accessibles ?',
      'Le consentement est-il éclairé et spécifique ?',
    ],
    defaultActions: ['USER_CONTROLS', 'TRANSPARENCY_NOTICE', 'ACCESS_RIGHTS'],
    amplifiers: [
      { id: 'take_it_or_leave', label: 'Tout ou rien', description: 'Pas de choix granulaire', severityBonus: 1, condition: 'consentement global uniquement' },
    ],
    mitigators: [
      { id: 'granular_consent', label: 'Consentement granulaire', description: 'Choix détaillé possible', severityReduction: 1, condition: 'options de consentement granulaires' },
      COMMON_MITIGATORS.consent,
    ],
  },

  // 25. Enrichissement vs Inférence invasive
  ENRICHMENT_VS_INVASIVE_INFERENCE: {
    id: 'ENRICHMENT_VS_INVASIVE_INFERENCE',
    title: 'Enrichissement vs Inférence invasive',
    shortTitle: 'Enrichissement / Inférence',
    description: 'L\'enrichissement des données permet d\'inférer des informations sensibles à partir de données ordinaires.',
    poles: ['ACCOUNTABILITY', 'PRIVACY'],
    impactedDomains: ['PRIVACY', 'AUTONOMY', 'TRANSPARENCY'],
    level: 'INDIVIDUAL',
    baseSeverity: 3,
    examples: [
      'Déduction de la santé à partir des achats',
      'Inférence politique à partir des centres d\'intérêt',
      'Prédiction de grossesse à partir du comportement',
      'Estimation de revenus à partir de la géolocalisation',
    ],
    arbitrationQuestions: [
      'Quelles inférences sont réalisées ?',
      'L\'utilisateur est-il informé des déductions ?',
      'Les inférences sont-elles proportionnées ?',
      'Peut-on contester une inférence erronée ?',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'ACCESS_RIGHTS', 'APPEAL_PROCESS'],
    amplifiers: [
      COMMON_AMPLIFIERS.highSensitivity,
      { id: 'hidden_inference', label: 'Inférence cachée', description: 'L\'utilisateur ignore les déductions', severityBonus: 1, condition: 'inférences non divulguées' },
    ],
    mitigators: [
      { id: 'inference_disclosure', label: 'Divulgation des inférences', description: 'Les inférences sont communiquées', severityReduction: 1, condition: 'accès aux données inférées' },
    ],
  },

  // Tension générique pour cas non couverts
  OTHER: {
    id: 'OTHER',
    title: 'Autre tension',
    shortTitle: 'Autre',
    description: 'Tension spécifique non couverte par les patterns standards.',
    poles: ['ACCOUNTABILITY', 'ACCOUNTABILITY'],
    impactedDomains: [],
    level: 'INDIVIDUAL',
    baseSeverity: 2,
    examples: [],
    arbitrationQuestions: [],
    defaultActions: [],
    amplifiers: [],
    mitigators: [],
  },
} as const

export type TensionPatternId = keyof typeof TENSION_PATTERNS

export const TENSION_PATTERN_IDS = Object.keys(TENSION_PATTERNS) as TensionPatternId[]

export const TENSION_PATTERN_LIST = Object.values(TENSION_PATTERNS)

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

export function getTensionPattern(id: TensionPatternId): TensionPattern {
  return TENSION_PATTERNS[id]
}

export function getTensionPatternTitle(id: TensionPatternId): string {
  return TENSION_PATTERNS[id]?.title || id
}

/**
 * Calcule la sévérité finale d'une tension
 * Formule: Sévérité finale = Sévérité de base + Σ(amplificateurs) - Σ(mitigateurs)
 * Bornée entre 1 et 5
 */
export function calculateFinalSeverity(
  patternId: TensionPatternId,
  activeAmplifierIds: string[],
  activeMitigatorIds: string[]
): number {
  const pattern = TENSION_PATTERNS[patternId]
  if (!pattern) return 3 // Valeur par défaut

  let severity = pattern.baseSeverity

  // Ajouter les bonus des amplificateurs
  for (const amplifier of pattern.amplifiers) {
    if (activeAmplifierIds.includes(amplifier.id)) {
      severity += amplifier.severityBonus
    }
  }

  // Soustraire les réductions des mitigateurs
  for (const mitigator of pattern.mitigators) {
    if (activeMitigatorIds.includes(mitigator.id)) {
      severity -= mitigator.severityReduction
    }
  }

  // Borner entre 1 et 5
  return Math.max(1, Math.min(5, severity))
}

/**
 * Retourne les patterns filtrés par niveau
 */
export function getPatternsByLevel(level: TensionLevel): TensionPattern[] {
  return TENSION_PATTERN_LIST.filter(p => p.level === level)
}

/**
 * Retourne les patterns impliquant un domaine donné
 */
export function getPatternsForDomain(domainId: DomainId): TensionPattern[] {
  return TENSION_PATTERN_LIST.filter(p =>
    p.poles.includes(domainId) || p.impactedDomains.includes(domainId)
  )
}
