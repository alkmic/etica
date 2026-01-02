// Templates d'actions recommandées ETICA
// Ces templates permettent de proposer des actions concrètes pour mitiger les tensions

import { DomainId } from './domains'

export interface ActionTemplate {
  id: string
  title: string
  description: string
  category: ActionCategory
  effort: Effort
  impactDomains: DomainId[]
  checklist: string[]
}

export type ActionCategory =
  | 'MINIMIZATION'
  | 'TRANSPARENCY'
  | 'HUMAN_CONTROL'
  | 'RECOURSE'
  | 'TECHNICAL'
  | 'ORGANIZATIONAL'
  | 'DESIGN'
  | 'AUDIT'

export type Effort = 'TRIVIAL' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'HUGE'

export const ACTION_CATEGORIES: Record<ActionCategory, { label: string; description: string }> = {
  MINIMIZATION: { label: 'Minimisation', description: 'Réduction des données collectées' },
  TRANSPARENCY: { label: 'Transparence', description: 'Information et explicabilité' },
  HUMAN_CONTROL: { label: 'Contrôle humain', description: 'Supervision et intervention humaine' },
  RECOURSE: { label: 'Recours', description: 'Contestation et réparation' },
  TECHNICAL: { label: 'Technique', description: 'Mesures techniques' },
  ORGANIZATIONAL: { label: 'Organisationnel', description: 'Processus et gouvernance' },
  DESIGN: { label: 'Design', description: 'Conception responsable' },
  AUDIT: { label: 'Audit', description: 'Vérification et contrôle' },
}

export const EFFORT_LEVELS: Record<Effort, { label: string; duration: string }> = {
  TRIVIAL: { label: 'Trivial', duration: '< 1 jour' },
  SMALL: { label: 'Petit', duration: '1-3 jours' },
  MEDIUM: { label: 'Moyen', duration: '1-2 semaines' },
  LARGE: { label: 'Important', duration: '2-4 semaines' },
  HUGE: { label: 'Majeur', duration: '> 1 mois' },
}

export const ACTION_TEMPLATES: Record<string, ActionTemplate> = {
  // Minimisation
  DATA_MINIMIZATION: {
    id: 'DATA_MINIMIZATION',
    title: 'Minimiser les données collectées',
    description: 'Limiter la collecte aux données strictement nécessaires à la finalité.',
    category: 'MINIMIZATION',
    effort: 'MEDIUM',
    impactDomains: ['PRIVACY'],
    checklist: [
      'Lister toutes les données collectées',
      'Justifier la nécessité de chaque donnée',
      'Supprimer les données non essentielles',
      'Documenter les choix',
    ],
  },
  PURPOSE_LIMITATION: {
    id: 'PURPOSE_LIMITATION',
    title: 'Limiter les finalités',
    description: 'S\'assurer que les données ne sont pas utilisées au-delà de la finalité initiale.',
    category: 'MINIMIZATION',
    effort: 'SMALL',
    impactDomains: ['PRIVACY'],
    checklist: [
      'Documenter la finalité de chaque traitement',
      'Vérifier la cohérence avec la finalité',
      'Mettre en place des contrôles d\'accès',
    ],
  },
  RETENTION_POLICY: {
    id: 'RETENTION_POLICY',
    title: 'Définir une politique de conservation',
    description: 'Établir et appliquer des durées de conservation appropriées.',
    category: 'MINIMIZATION',
    effort: 'MEDIUM',
    impactDomains: ['PRIVACY'],
    checklist: [
      'Définir les durées par type de données',
      'Mettre en place la suppression automatique',
      'Documenter les exceptions',
      'Tester le processus',
    ],
  },

  // Transparence
  TRANSPARENCY_NOTICE: {
    id: 'TRANSPARENCY_NOTICE',
    title: 'Rédiger une notice d\'information',
    description: 'Créer une notice claire expliquant le fonctionnement du système.',
    category: 'TRANSPARENCY',
    effort: 'MEDIUM',
    impactDomains: ['TRANSPARENCY', 'AUTONOMY'],
    checklist: [
      'Expliquer ce que fait le système',
      'Lister les données utilisées',
      'Décrire les décisions produites',
      'Indiquer les droits des personnes',
      'Faire relire par un non-expert',
    ],
  },
  TRANSPARENCY_FACTORS: {
    id: 'TRANSPARENCY_FACTORS',
    title: 'Afficher les facteurs de décision',
    description: 'Montrer les principaux éléments qui ont influencé une décision.',
    category: 'TRANSPARENCY',
    effort: 'LARGE',
    impactDomains: ['TRANSPARENCY', 'RECOURSE'],
    checklist: [
      'Identifier les facteurs explicables',
      'Développer l\'interface d\'affichage',
      'Tester la compréhension utilisateur',
      'Documenter les limites',
    ],
  },
  EXPLAINABILITY_LAYER: {
    id: 'EXPLAINABILITY_LAYER',
    title: 'Ajouter une couche d\'explicabilité',
    description: 'Implémenter SHAP, LIME ou équivalent pour expliquer les prédictions.',
    category: 'TRANSPARENCY',
    effort: 'LARGE',
    impactDomains: ['TRANSPARENCY'],
    checklist: [
      'Choisir la méthode (SHAP, LIME, etc.)',
      'Implémenter sur le modèle',
      'Valider la pertinence des explications',
      'Intégrer dans l\'interface',
    ],
  },

  // Contrôle humain
  HUMAN_REVIEW_THRESHOLD: {
    id: 'HUMAN_REVIEW_THRESHOLD',
    title: 'Mettre en place un seuil de revue humaine',
    description: 'Définir des critères qui déclenchent une validation humaine.',
    category: 'HUMAN_CONTROL',
    effort: 'MEDIUM',
    impactDomains: ['RECOURSE', 'RESPONSIBILITY'],
    checklist: [
      'Définir les critères de seuil',
      'Implémenter la logique de routage',
      'Former les validateurs',
      'Mettre en place le suivi',
    ],
  },
  OVERRIDE_CAPABILITY: {
    id: 'OVERRIDE_CAPABILITY',
    title: 'Permettre le débrayage manuel',
    description: 'Donner la possibilité de désactiver ou contourner la décision automatique.',
    category: 'HUMAN_CONTROL',
    effort: 'MEDIUM',
    impactDomains: ['AUTONOMY', 'RECOURSE'],
    checklist: [
      'Définir qui peut débrayer',
      'Implémenter la fonction',
      'Logger les débrayages',
      'Analyser les patterns',
    ],
  },

  // Recours
  APPEAL_PROCESS: {
    id: 'APPEAL_PROCESS',
    title: 'Créer une procédure de contestation',
    description: 'Définir et documenter comment une personne peut contester une décision.',
    category: 'RECOURSE',
    effort: 'MEDIUM',
    impactDomains: ['RECOURSE'],
    checklist: [
      'Définir le processus étape par étape',
      'Créer le formulaire/canal de contestation',
      'Définir les délais de réponse',
      'Former l\'équipe de traitement',
      'Publier la procédure',
    ],
  },
  CONTACT_HUMAN: {
    id: 'CONTACT_HUMAN',
    title: 'Offrir un contact humain',
    description: 'Permettre de parler à une personne réelle pour les cas complexes.',
    category: 'RECOURSE',
    effort: 'SMALL',
    impactDomains: ['RECOURSE', 'AUTONOMY'],
    checklist: [
      'Identifier le canal (email, téléphone, chat)',
      'Former l\'équipe de support',
      'Définir les heures de disponibilité',
      'Communiquer l\'option aux utilisateurs',
    ],
  },

  // Technique
  BIAS_TESTING: {
    id: 'BIAS_TESTING',
    title: 'Tester les biais du modèle',
    description: 'Évaluer systématiquement les disparités de performance entre groupes.',
    category: 'TECHNICAL',
    effort: 'LARGE',
    impactDomains: ['EQUITY'],
    checklist: [
      'Identifier les groupes à tester',
      'Définir les métriques (DI, SPD, EOD, etc.)',
      'Exécuter les tests',
      'Documenter les résultats',
      'Définir les seuils acceptables',
    ],
  },
  FAIRNESS_METRICS: {
    id: 'FAIRNESS_METRICS',
    title: 'Implémenter des métriques d\'équité',
    description: 'Intégrer le suivi de métriques de fairness dans le monitoring.',
    category: 'TECHNICAL',
    effort: 'LARGE',
    impactDomains: ['EQUITY', 'RESPONSIBILITY'],
    checklist: [
      'Choisir les métriques appropriées',
      'Implémenter le calcul',
      'Définir les alertes',
      'Intégrer au dashboard',
    ],
  },
  REGULAR_AUDIT: {
    id: 'REGULAR_AUDIT',
    title: 'Planifier des audits réguliers',
    description: 'Mettre en place un calendrier d\'audit du système.',
    category: 'AUDIT',
    effort: 'MEDIUM',
    impactDomains: ['RESPONSIBILITY'],
    checklist: [
      'Définir la fréquence',
      'Établir le périmètre de l\'audit',
      'Identifier les auditeurs',
      'Créer le template de rapport',
    ],
  },
  MONITORING: {
    id: 'MONITORING',
    title: 'Mettre en place le monitoring',
    description: 'Surveiller le comportement du système en production.',
    category: 'TECHNICAL',
    effort: 'MEDIUM',
    impactDomains: ['SECURITY', 'RESPONSIBILITY'],
    checklist: [
      'Définir les KPIs à suivre',
      'Implémenter les sondes',
      'Configurer les alertes',
      'Créer les dashboards',
    ],
  },

  // Organisationnel
  GOVERNANCE_RACI: {
    id: 'GOVERNANCE_RACI',
    title: 'Définir la gouvernance (RACI)',
    description: 'Clarifier les responsabilités pour chaque aspect du système.',
    category: 'ORGANIZATIONAL',
    effort: 'SMALL',
    impactDomains: ['RESPONSIBILITY'],
    checklist: [
      'Lister les activités clés',
      'Identifier les parties prenantes',
      'Attribuer R/A/C/I pour chaque activité',
      'Valider et communiquer',
    ],
  },
  TRAINING: {
    id: 'TRAINING',
    title: 'Former les opérateurs',
    description: 'S\'assurer que les personnes utilisant le système comprennent ses limites.',
    category: 'ORGANIZATIONAL',
    effort: 'MEDIUM',
    impactDomains: ['RESPONSIBILITY', 'EQUITY'],
    checklist: [
      'Identifier le public cible',
      'Créer le contenu de formation',
      'Planifier les sessions',
      'Évaluer la compréhension',
    ],
  },
  INCIDENT_PROCESS: {
    id: 'INCIDENT_PROCESS',
    title: 'Définir un processus incident',
    description: 'Établir la procédure en cas de problème éthique.',
    category: 'ORGANIZATIONAL',
    effort: 'MEDIUM',
    impactDomains: ['RESPONSIBILITY', 'SECURITY'],
    checklist: [
      'Définir ce qui constitue un incident',
      'Établir la chaîne d\'escalade',
      'Créer les templates de rapport',
      'Tester avec un exercice',
    ],
  },

  // Design
  USER_CONTROLS: {
    id: 'USER_CONTROLS',
    title: 'Offrir des contrôles utilisateur',
    description: 'Permettre à l\'utilisateur de paramétrer son expérience.',
    category: 'DESIGN',
    effort: 'MEDIUM',
    impactDomains: ['AUTONOMY', 'PRIVACY'],
    checklist: [
      'Identifier les paramètres pertinents',
      'Concevoir l\'interface de réglage',
      'Implémenter la fonctionnalité',
      'Communiquer son existence',
    ],
  },
  DIVERSE_OPTIONS: {
    id: 'DIVERSE_OPTIONS',
    title: 'Proposer des options diversifiées',
    description: 'Éviter les bulles de filtre en incluant de la diversité.',
    category: 'DESIGN',
    effort: 'LARGE',
    impactDomains: ['AUTONOMY', 'EQUITY'],
    checklist: [
      'Définir la stratégie de diversification',
      'Implémenter l\'algorithme',
      'Mesurer l\'impact sur l\'engagement',
      'Ajuster l\'équilibre',
    ],
  },
  STAGED_ROLLOUT: {
    id: 'STAGED_ROLLOUT',
    title: 'Déployer progressivement',
    description: 'Lancer par phases pour détecter les problèmes tôt.',
    category: 'DESIGN',
    effort: 'MEDIUM',
    impactDomains: ['SECURITY', 'RESPONSIBILITY'],
    checklist: [
      'Définir les phases (%, critères)',
      'Établir les critères de passage',
      'Préparer le rollback',
      'Monitorer chaque phase',
    ],
  },

  // Actions supplémentaires
  EXCEPTION_PROCESS: {
    id: 'EXCEPTION_PROCESS',
    title: 'Créer un processus d\'exception',
    description: 'Permettre de traiter les cas particuliers hors du flux standard.',
    category: 'ORGANIZATIONAL',
    effort: 'MEDIUM',
    impactDomains: ['EQUITY', 'RECOURSE'],
    checklist: [
      'Définir les critères d\'exception',
      'Créer le workflow de traitement',
      'Former les équipes',
      'Documenter les décisions',
    ],
  },
  ACCOMMODATION: {
    id: 'ACCOMMODATION',
    title: 'Prévoir des aménagements raisonnables',
    description: 'Adapter le système pour les personnes ayant des besoins spécifiques.',
    category: 'DESIGN',
    effort: 'LARGE',
    impactDomains: ['EQUITY', 'AUTONOMY'],
    checklist: [
      'Identifier les populations concernées',
      'Définir les adaptations possibles',
      'Implémenter les aménagements',
      'Tester avec les utilisateurs concernés',
    ],
  },
  CASE_BY_CASE: {
    id: 'CASE_BY_CASE',
    title: 'Permettre l\'examen au cas par cas',
    description: 'Prévoir la possibilité d\'un examen individuel des situations.',
    category: 'HUMAN_CONTROL',
    effort: 'MEDIUM',
    impactDomains: ['EQUITY', 'RECOURSE'],
    checklist: [
      'Définir les critères de déclenchement',
      'Former les examinateurs',
      'Créer les outils de décision',
      'Documenter les décisions',
    ],
  },
  ACCESS_RIGHTS: {
    id: 'ACCESS_RIGHTS',
    title: 'Implémenter les droits d\'accès',
    description: 'Permettre aux personnes d\'accéder à leurs données.',
    category: 'TRANSPARENCY',
    effort: 'MEDIUM',
    impactDomains: ['PRIVACY', 'TRANSPARENCY'],
    checklist: [
      'Créer l\'interface d\'accès',
      'Définir le processus de demande',
      'Automatiser l\'export des données',
      'Respecter les délais légaux',
    ],
  },
} as const

export type ActionTemplateId = keyof typeof ACTION_TEMPLATES

export const ACTION_TEMPLATE_IDS = Object.keys(ACTION_TEMPLATES) as ActionTemplateId[]

export const ACTION_TEMPLATE_LIST = Object.values(ACTION_TEMPLATES)

export function getActionTemplate(id: ActionTemplateId): ActionTemplate {
  return ACTION_TEMPLATES[id]
}

export function getActionsByCategory(category: ActionCategory): ActionTemplate[] {
  return ACTION_TEMPLATE_LIST.filter((a) => a.category === category)
}
