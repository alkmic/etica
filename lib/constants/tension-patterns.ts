// Patterns de tensions (dilemmes éthiques) ETICA
// Un dilemme survient lorsqu'un système active simultanément des droits ou valeurs légitimes en tension

import { DomainId } from './domains'

export interface TensionPattern {
  id: string
  title: string
  shortTitle: string
  description: string
  domains: DomainId[]
  examples: string[]
  defaultActions: string[]
  arbitrationQuestions: string[]
}

export const TENSION_PATTERNS: Record<string, TensionPattern> = {
  SECURITY_VS_PRIVACY: {
    id: 'SECURITY_VS_PRIVACY',
    title: 'Sécurité vs Vie privée',
    shortTitle: 'Sécurité / Vie privée',
    description: 'La protection des personnes contre les risques nécessite une collecte ou surveillance qui porte atteinte à leur vie privée.',
    domains: ['SECURITY', 'PRIVACY'],
    examples: [
      'Détection de fraude bancaire nécessitant l\'analyse des transactions',
      'Surveillance pour prévenir le terrorisme',
      'Monitoring des employés pour la sécurité informatique',
      'Vérification d\'identité biométrique',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'DATA_MINIMIZATION', 'ACCESS_RIGHTS'],
    arbitrationQuestions: [
      'La surveillance est-elle proportionnée au risque ?',
      'Des alternatives moins intrusives existent-elles ?',
      'Les données collectées sont-elles strictement nécessaires ?',
      'Une durée de conservation limitée est-elle respectée ?',
    ],
  },
  PERSONALIZATION_VS_AUTONOMY: {
    id: 'PERSONALIZATION_VS_AUTONOMY',
    title: 'Personnalisation vs Autonomie',
    shortTitle: 'Personnalisation / Autonomie',
    description: 'L\'adaptation du service aux préférences de l\'utilisateur peut créer des bulles de filtre et limiter sa liberté de découverte.',
    domains: ['AUTONOMY', 'PRIVACY'],
    examples: [
      'Recommandations de contenu (Netflix, YouTube)',
      'Fil d\'actualité personnalisé (réseaux sociaux)',
      'Suggestions produits (e-commerce)',
      'Personnalisation de l\'apprentissage (EdTech)',
    ],
    defaultActions: ['TRANSPARENCY_FACTORS', 'USER_CONTROLS', 'DIVERSE_OPTIONS'],
    arbitrationQuestions: [
      'La personnalisation enferme-t-elle dans une bulle ?',
      'Des contenus diversifiés sont-ils proposés ?',
      'L\'utilisateur peut-il contrôler le niveau de personnalisation ?',
      'Les critères de personnalisation sont-ils transparents ?',
    ],
  },
  EFFICIENCY_VS_TRANSPARENCY: {
    id: 'EFFICIENCY_VS_TRANSPARENCY',
    title: 'Efficacité vs Transparence',
    shortTitle: 'Efficacité / Transparence',
    description: 'Les modèles les plus performants (deep learning, ensemble methods) sont souvent les moins explicables.',
    domains: ['TRANSPARENCY', 'RECOURSE'],
    examples: [
      'Scoring de crédit par gradient boosting',
      'Diagnostic médical par réseau de neurones',
      'Détection de fraude par algorithmes complexes',
      'Recommandation par filtrage collaboratif',
    ],
    defaultActions: ['EXPLAINABILITY_LAYER', 'TRANSPARENCY_FACTORS', 'HUMAN_REVIEW_THRESHOLD'],
    arbitrationQuestions: [
      'Le gain de performance justifie-t-il l\'opacité ?',
      'Une couche d\'explicabilité peut-elle être ajoutée ?',
      'Les cas à fort impact peuvent-ils être traités différemment ?',
      'Un modèle plus simple serait-il acceptable ?',
    ],
  },
  PERFORMANCE_VS_EQUITY: {
    id: 'PERFORMANCE_VS_EQUITY',
    title: 'Performance vs Équité',
    shortTitle: 'Performance / Équité',
    description: 'L\'optimisation de la performance peut créer ou amplifier des biais discriminatoires.',
    domains: ['EQUITY', 'ACCOUNTABILITY'],
    examples: [
      'Modèle de recrutement reproduisant les biais historiques',
      'Scoring de risque défavorisant certains quartiers',
      'Reconnaissance faciale moins précise pour certaines ethnies',
      'Prédiction de récidive reproduisant les inégalités judiciaires',
    ],
    defaultActions: ['BIAS_TESTING', 'FAIRNESS_METRICS', 'REGULAR_AUDIT'],
    arbitrationQuestions: [
      'Des tests de biais ont-ils été effectués ?',
      'Quelle métrique de fairness est privilégiée ?',
      'Un compromis performance/équité est-il acceptable ?',
      'Les données d\'entraînement ont-elles été corrigées ?',
    ],
  },
  AUTOMATION_VS_RECOURSE: {
    id: 'AUTOMATION_VS_RECOURSE',
    title: 'Automatisation vs Recours',
    shortTitle: 'Automatisation / Recours',
    description: 'Les décisions automatiques rapides et à grande échelle peuvent ne pas laisser de place à la contestation individuelle.',
    domains: ['RECOURSE', 'AUTONOMY'],
    examples: [
      'Modération automatique de contenu',
      'Tri automatique de candidatures',
      'Décision de crédit instantanée',
      'Tarification dynamique en temps réel',
    ],
    defaultActions: ['HUMAN_REVIEW_THRESHOLD', 'APPEAL_PROCESS', 'CONTACT_HUMAN'],
    arbitrationQuestions: [
      'Chaque décision peut-elle être contestée ?',
      'Un humain peut-il intervenir sur demande ?',
      'Le délai de recours est-il raisonnable ?',
      'La contestation a-t-elle une chance d\'aboutir ?',
    ],
  },
  PRECISION_VS_MINIMIZATION: {
    id: 'PRECISION_VS_MINIMIZATION',
    title: 'Précision vs Minimisation',
    shortTitle: 'Précision / Minimisation',
    description: 'La qualité du modèle peut nécessiter plus de données que le principe de minimisation ne le permet.',
    domains: ['PRIVACY', 'ACCOUNTABILITY'],
    examples: [
      'Enrichissement de profil pour meilleures recommandations',
      'Historique long pour prédiction précise',
      'Données contextuelles pour personnalisation',
      'Features multiples pour classification',
    ],
    defaultActions: ['DATA_MINIMIZATION', 'PURPOSE_LIMITATION', 'RETENTION_POLICY'],
    arbitrationQuestions: [
      'Chaque donnée est-elle vraiment utile au modèle ?',
      'L\'amélioration marginale justifie-t-elle plus de données ?',
      'Des techniques de privacy-preserving sont-elles applicables ?',
      'L\'utilisateur est-il informé et consentant ?',
    ],
  },
  INNOVATION_VS_PRECAUTION: {
    id: 'INNOVATION_VS_PRECAUTION',
    title: 'Innovation vs Précaution',
    shortTitle: 'Innovation / Précaution',
    description: 'Le déploiement de nouvelles technologies peut présenter des risques non encore identifiés.',
    domains: ['SECURITY', 'ACCOUNTABILITY'],
    examples: [
      'IA générative avec risques de désinformation',
      'Véhicules autonomes en environnement réel',
      'Agents IA avec capacités d\'action',
      'Systèmes d\'IA dans des contextes critiques',
    ],
    defaultActions: ['STAGED_ROLLOUT', 'MONITORING', 'INCIDENT_PROCESS'],
    arbitrationQuestions: [
      'Les risques ont-ils été évalués de façon approfondie ?',
      'Un déploiement progressif est-il prévu ?',
      'Des mécanismes d\'arrêt d\'urgence existent-ils ?',
      'La surveillance post-déploiement est-elle suffisante ?',
    ],
  },
  STANDARDIZATION_VS_SINGULARITY: {
    id: 'STANDARDIZATION_VS_SINGULARITY',
    title: 'Standardisation vs Singularité',
    shortTitle: 'Standardisation / Singularité',
    description: 'Un traitement uniforme peut ignorer les besoins spécifiques de certaines populations ou situations.',
    domains: ['EQUITY', 'AUTONOMY'],
    examples: [
      'Règles de scoring uniformes',
      'Processus automatisé identique pour tous',
      'Seuils fixes sans exception',
      'Interface unique sans adaptation',
    ],
    defaultActions: ['EXCEPTION_PROCESS', 'ACCOMMODATION', 'CASE_BY_CASE'],
    arbitrationQuestions: [
      'Le traitement uniforme crée-t-il des inégalités de fait ?',
      'Des exceptions sont-elles possibles ?',
      'Les situations particulières sont-elles prises en compte ?',
      'L\'adaptation au contexte est-elle envisageable ?',
    ],
  },
  SPEED_VS_REFLECTION: {
    id: 'SPEED_VS_REFLECTION',
    title: 'Rapidité vs Réflexion',
    shortTitle: 'Rapidité / Réflexion',
    description: 'L\'exigence de décisions en temps réel peut empêcher une analyse approfondie des cas particuliers.',
    domains: ['RECOURSE', 'ACCOUNTABILITY'],
    examples: [
      'Modération en temps réel',
      'Trading algorithmique',
      'Décisions médicales urgentes',
      'Réponses automatiques de chatbot',
    ],
    defaultActions: ['HUMAN_REVIEW_THRESHOLD', 'OVERRIDE_CAPABILITY'],
    arbitrationQuestions: [
      'La rapidité est-elle vraiment nécessaire ?',
      'Les cas complexes peuvent-ils être mis en attente ?',
      'Une revue a posteriori est-elle possible ?',
      'L\'urgence est-elle réelle ou artificielle ?',
    ],
  },
  EXHAUSTIVITY_VS_OBLIVION: {
    id: 'EXHAUSTIVITY_VS_OBLIVION',
    title: 'Exhaustivité vs Oubli',
    shortTitle: 'Exhaustivité / Oubli',
    description: 'La conservation des données historiques peut entrer en conflit avec le droit à l\'oubli et au nouveau départ.',
    domains: ['PRIVACY', 'EQUITY'],
    examples: [
      'Historique de crédit long',
      'Archives de posts sur les réseaux sociaux',
      'Dossiers scolaires ou médicaux',
      'Traces de recherche et navigation',
    ],
    defaultActions: ['RETENTION_POLICY', 'DATA_MINIMIZATION'],
    arbitrationQuestions: [
      'Quelle durée de conservation est justifiée ?',
      'L\'effacement est-il effectivement possible ?',
      'Les erreurs passées peuvent-elles être pardonnées ?',
      'Un "droit au nouveau départ" est-il reconnu ?',
    ],
  },
  ACCESSIBILITY_VS_CONTROL: {
    id: 'ACCESSIBILITY_VS_CONTROL',
    title: 'Accessibilité vs Contrôle',
    shortTitle: 'Accessibilité / Contrôle',
    description: 'L\'ouverture et la transparence des données ou algorithmes peuvent créer des risques de sécurité ou d\'abus.',
    domains: ['TRANSPARENCY', 'SECURITY'],
    examples: [
      'Publication des critères de scoring (gaming possible)',
      'Open source des modèles (détournement possible)',
      'Accès aux données personnelles (risque d\'usurpation)',
      'Transparence des processus (exploitation des failles)',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'MONITORING'],
    arbitrationQuestions: [
      'Quelles informations peuvent être publiées sans risque ?',
      'Comment éviter le gaming des critères ?',
      'L\'accès peut-il être gradué selon les publics ?',
      'La sécurité par l\'obscurité est-elle vraiment efficace ?',
    ],
  },
  PREDICTION_VS_FREEWILL: {
    id: 'PREDICTION_VS_FREEWILL',
    title: 'Prédiction vs Libre arbitre',
    shortTitle: 'Prédiction / Libre arbitre',
    description: 'Les systèmes prédictifs peuvent créer des prophéties auto-réalisatrices qui enferment les personnes dans leur passé.',
    domains: ['AUTONOMY', 'EQUITY'],
    examples: [
      'Score de risque de récidive',
      'Prédiction d\'échec scolaire',
      'Anticipation de démission',
      'Risque de défaut de paiement',
    ],
    defaultActions: ['TRANSPARENCY_FACTORS', 'APPEAL_PROCESS'],
    arbitrationQuestions: [
      'La prédiction influence-t-elle le résultat ?',
      'La personne peut-elle "déjouer" la prédiction ?',
      'Le passé condamne-t-il définitivement ?',
      'Des mécanismes de "deuxième chance" existent-ils ?',
    ],
  },
  PERSONALIZATION_VS_EQUALITY: {
    id: 'PERSONALIZATION_VS_EQUALITY',
    title: 'Personnalisation vs Égalité',
    shortTitle: 'Personnalisation / Égalité',
    description: 'Un traitement adapté à chaque individu peut créer des inégalités entre personnes dans des situations similaires.',
    domains: ['EQUITY', 'TRANSPARENCY'],
    examples: [
      'Prix dynamiques selon le profil',
      'Offres différenciées selon le scoring',
      'Niveau de service adapté au "potentiel"',
      'Accès variable selon l\'historique',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'FAIRNESS_METRICS'],
    arbitrationQuestions: [
      'La différenciation est-elle justifiée objectivement ?',
      'Des personnes similaires sont-elles traitées différemment ?',
      'Les critères de différenciation sont-ils légitimes ?',
      'Un socle commun de service est-il garanti ?',
    ],
  },
  CONFIDENTIALITY_VS_TRACEABILITY: {
    id: 'CONFIDENTIALITY_VS_TRACEABILITY',
    title: 'Confidentialité vs Traçabilité',
    shortTitle: 'Confidentialité / Traçabilité',
    description: 'L\'anonymisation protège la vie privée mais peut empêcher la contestation et la correction des erreurs.',
    domains: ['PRIVACY', 'RECOURSE'],
    examples: [
      'Données anonymisées pour la recherche',
      'Décisions sans trace individuelle',
      'Agrégation empêchant l\'identification',
      'Pseudonymisation irréversible',
    ],
    defaultActions: ['APPEAL_PROCESS'],
    arbitrationQuestions: [
      'L\'anonymisation est-elle réversible si nécessaire ?',
      'Une personne peut-elle retrouver sa décision ?',
      'La contestation reste-t-elle possible ?',
      'Un équilibre pseudonymisation/traçabilité existe-t-il ?',
    ],
  },
  WELLBEING_VS_AUTONOMY: {
    id: 'WELLBEING_VS_AUTONOMY',
    title: 'Bien-être vs Autonomie',
    shortTitle: 'Bien-être / Autonomie',
    description: 'La protection des personnes contre elles-mêmes peut devenir du paternalisme qui nie leur capacité de décision.',
    domains: ['AUTONOMY', 'SECURITY'],
    examples: [
      'Blocage de contenu "pour votre bien"',
      'Limitations d\'usage "pour votre santé"',
      'Recommandations "santé" imposées',
      'Restrictions "de protection"',
    ],
    defaultActions: ['USER_CONTROLS', 'TRANSPARENCY_NOTICE'],
    arbitrationQuestions: [
      'L\'intervention est-elle sollicitée ou imposée ?',
      'La personne est-elle en capacité de décider ?',
      'Le paternalisme est-il proportionné au risque ?',
      'Des options de "sortie" existent-elles ?',
    ],
  },
  COLLECTIVE_VS_INDIVIDUAL: {
    id: 'COLLECTIVE_VS_INDIVIDUAL',
    title: 'Intérêt collectif vs Droits individuels',
    shortTitle: 'Collectif / Individuel',
    description: 'L\'optimisation pour le bien commun peut se faire au détriment de certains individus.',
    domains: ['EQUITY', 'AUTONOMY'],
    examples: [
      'Surveillance de masse pour la sécurité nationale',
      'Sacrifice d\'individus pour l\'efficacité globale',
      'Mutualisation des risques pénalisant les "bons profils"',
      'Optimisation du trafic défavorisant certains quartiers',
    ],
    defaultActions: ['TRANSPARENCY_NOTICE', 'APPEAL_PROCESS'],
    arbitrationQuestions: [
      'Le bénéfice collectif est-il avéré et significatif ?',
      'Le préjudice individuel est-il proportionné ?',
      'Les personnes "sacrifiées" sont-elles compensées ?',
      'Des garde-fous contre les abus existent-ils ?',
    ],
  },
  EFFICIENCY_VS_PROTECTION: {
    id: 'EFFICIENCY_VS_PROTECTION',
    title: 'Efficience économique vs Protection sociale',
    shortTitle: 'Efficience / Protection',
    description: 'L\'optimisation des coûts peut réduire l\'accès aux services pour les populations moins rentables.',
    domains: ['EQUITY', 'RECOURSE'],
    examples: [
      'Exclusion des clients "non rentables"',
      'Réduction de service dans les zones peu denses',
      'Priorisation des "bons payeurs"',
      'Optimisation excluant les cas complexes',
    ],
    defaultActions: ['APPEAL_PROCESS', 'CONTACT_HUMAN'],
    arbitrationQuestions: [
      'L\'exclusion est-elle justifiée ?',
      'Des alternatives sont-elles proposées aux exclus ?',
      'Un service universel minimum est-il garanti ?',
      'La rentabilité seule peut-elle décider de l\'accès ?',
    ],
  },
  OTHER: {
    id: 'OTHER',
    title: 'Autre tension',
    shortTitle: 'Autre',
    description: 'Tension spécifique non couverte par les patterns standards.',
    domains: [],
    examples: [],
    defaultActions: [],
    arbitrationQuestions: [],
  },
} as const

export type TensionPatternId = keyof typeof TENSION_PATTERNS

export const TENSION_PATTERN_IDS = Object.keys(TENSION_PATTERNS) as TensionPatternId[]

export const TENSION_PATTERN_LIST = Object.values(TENSION_PATTERNS)

export function getTensionPattern(id: TensionPatternId): TensionPattern {
  return TENSION_PATTERNS[id]
}

export function getTensionPatternTitle(id: TensionPatternId): string {
  return TENSION_PATTERNS[id]?.title || id
}
