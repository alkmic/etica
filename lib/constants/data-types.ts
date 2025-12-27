// Types de données et classifications ETICA

// Catégories de données personnelles
export const DATA_CATEGORIES = {
  identity: {
    id: 'identity',
    label: 'Identité',
    description: 'Nom, prénom, date de naissance, numéro d\'identification',
    icon: 'User',
    sensitivity: 'standard',
    examples: ['Nom', 'Prénom', 'Date de naissance', 'Numéro de sécurité sociale'],
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    description: 'Email, téléphone, adresse postale',
    icon: 'Mail',
    sensitivity: 'standard',
    examples: ['Email', 'Téléphone', 'Adresse postale'],
  },
  location: {
    id: 'location',
    label: 'Localisation',
    description: 'GPS, adresse IP, historique de déplacements',
    icon: 'MapPin',
    sensitivity: 'sensitive',
    examples: ['Géolocalisation', 'Adresse IP', 'Historique des déplacements'],
  },
  behavior: {
    id: 'behavior',
    label: 'Comportement',
    description: 'Historique de navigation, préférences, interactions',
    icon: 'Activity',
    sensitivity: 'standard',
    examples: ['Pages visitées', 'Clics', 'Temps passé', 'Achats'],
  },
  health: {
    id: 'health',
    label: 'Santé',
    description: 'Données médicales, handicap, traitements',
    icon: 'Heart',
    sensitivity: 'highly_sensitive',
    examples: ['Dossier médical', 'Handicap', 'Traitements', 'Allergies'],
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    description: 'Revenus, comptes bancaires, transactions',
    icon: 'CreditCard',
    sensitivity: 'sensitive',
    examples: ['Revenus', 'Numéro de compte', 'Historique des transactions'],
  },
  biometric: {
    id: 'biometric',
    label: 'Biométrie',
    description: 'Empreintes digitales, reconnaissance faciale, voix',
    icon: 'Fingerprint',
    sensitivity: 'highly_sensitive',
    examples: ['Empreinte digitale', 'Photo du visage', 'Empreinte vocale'],
  },
  opinions: {
    id: 'opinions',
    label: 'Opinions',
    description: 'Opinions politiques, religieuses, syndicales',
    icon: 'MessageCircle',
    sensitivity: 'highly_sensitive',
    examples: ['Affiliation politique', 'Croyances religieuses', 'Adhésion syndicale'],
  },
  professional: {
    id: 'professional',
    label: 'Professionnel',
    description: 'CV, expérience, formation, compétences',
    icon: 'Briefcase',
    sensitivity: 'standard',
    examples: ['CV', 'Diplômes', 'Expérience professionnelle'],
  },
  inferred: {
    id: 'inferred',
    label: 'Données inférées',
    description: 'Scores, prédictions, catégorisations automatiques',
    icon: 'Sparkles',
    sensitivity: 'sensitive',
    examples: ['Score de crédit', 'Score de risque', 'Catégorie marketing'],
  },
  social: {
    id: 'social',
    label: 'Social',
    description: 'Relations, contacts, interactions sociales',
    icon: 'Users',
    sensitivity: 'standard',
    examples: ['Liste de contacts', 'Abonnements', 'Interactions'],
  },
  content: {
    id: 'content',
    label: 'Contenu',
    description: 'Messages, publications, fichiers uploadés',
    icon: 'FileText',
    sensitivity: 'sensitive',
    examples: ['Messages privés', 'Publications', 'Photos partagées'],
  },
} as const

export type DataCategoryId = keyof typeof DATA_CATEGORIES
export type DataCategory = typeof DATA_CATEGORIES[DataCategoryId]

export const DATA_CATEGORY_IDS = Object.keys(DATA_CATEGORIES) as DataCategoryId[]
export const DATA_CATEGORY_LIST = Object.values(DATA_CATEGORIES)

// Niveaux de sensibilité
export const SENSITIVITY_LEVELS = {
  standard: {
    id: 'standard',
    label: 'Standard',
    description: 'Données personnelles courantes',
    color: 'green',
    level: 1,
  },
  sensitive: {
    id: 'sensitive',
    label: 'Sensible',
    description: 'Données nécessitant une attention particulière',
    color: 'yellow',
    level: 2,
  },
  highly_sensitive: {
    id: 'highly_sensitive',
    label: 'Hautement sensible',
    description: 'Données relevant de l\'article 9 du RGPD',
    color: 'red',
    level: 3,
  },
} as const

// Natures de flux
export const FLOW_NATURES = {
  COLLECT: {
    id: 'COLLECT',
    label: 'Collecte',
    description: 'Récupération de données depuis une source',
    icon: 'Download',
  },
  INFERENCE: {
    id: 'INFERENCE',
    label: 'Inférence',
    description: 'Prédiction ou déduction de nouvelles données',
    icon: 'Sparkles',
  },
  ENRICHMENT: {
    id: 'ENRICHMENT',
    label: 'Enrichissement',
    description: 'Ajout de données provenant d\'autres sources',
    icon: 'Plus',
  },
  DECISION: {
    id: 'DECISION',
    label: 'Décision',
    description: 'Production d\'une décision automatique',
    icon: 'CheckCircle',
  },
  RECOMMENDATION: {
    id: 'RECOMMENDATION',
    label: 'Recommandation',
    description: 'Suggestion d\'options à l\'utilisateur',
    icon: 'Lightbulb',
  },
  NOTIFICATION: {
    id: 'NOTIFICATION',
    label: 'Notification',
    description: 'Information envoyée à une personne',
    icon: 'Bell',
  },
  LEARNING: {
    id: 'LEARNING',
    label: 'Apprentissage',
    description: 'Entraînement ou mise à jour du modèle',
    icon: 'Brain',
  },
  CONTROL: {
    id: 'CONTROL',
    label: 'Contrôle',
    description: 'Supervision humaine ou automatique',
    icon: 'Eye',
  },
  TRANSFER: {
    id: 'TRANSFER',
    label: 'Transfert',
    description: 'Transmission de données à un tiers',
    icon: 'Send',
  },
  STORAGE: {
    id: 'STORAGE',
    label: 'Stockage',
    description: 'Conservation des données',
    icon: 'Database',
  },
} as const

export type FlowNatureId = keyof typeof FLOW_NATURES
export type FlowNature = typeof FLOW_NATURES[FlowNatureId]

// Niveaux d'automatisation
export const AUTOMATION_LEVELS = {
  INFORMATIVE: {
    id: 'INFORMATIVE',
    label: 'Informatif',
    description: 'Le flux informe seulement, aucune décision',
    level: 1,
  },
  ASSISTED: {
    id: 'ASSISTED',
    label: 'Assisté',
    description: 'L\'IA aide mais l\'humain décide',
    level: 2,
  },
  SEMI_AUTO: {
    id: 'SEMI_AUTO',
    label: 'Semi-automatique',
    description: 'L\'IA décide, un humain valide',
    level: 3,
  },
  AUTO_WITH_RECOURSE: {
    id: 'AUTO_WITH_RECOURSE',
    label: 'Automatique avec recours',
    description: 'L\'IA décide, contestation possible',
    level: 4,
  },
  AUTO_NO_RECOURSE: {
    id: 'AUTO_NO_RECOURSE',
    label: 'Automatique sans recours',
    description: 'L\'IA décide, pas de contestation prévue',
    level: 5,
  },
} as const

// Types de décision du SIA
export const DECISION_TYPES = {
  INFORMATIVE: {
    id: 'INFORMATIVE',
    label: 'Information',
    description: 'Affiche des informations sans influencer de décision',
    icon: 'Info',
    level: 1,
  },
  RECOMMENDATION: {
    id: 'RECOMMENDATION',
    label: 'Recommandation',
    description: 'Suggère des options, l\'utilisateur choisit',
    icon: 'Lightbulb',
    level: 2,
  },
  ASSISTED_DECISION: {
    id: 'ASSISTED_DECISION',
    label: 'Décision assistée',
    description: 'Propose une décision, un humain valide',
    icon: 'UserCheck',
    level: 3,
  },
  AUTO_DECISION: {
    id: 'AUTO_DECISION',
    label: 'Décision automatique',
    description: 'Prend des décisions sans validation humaine',
    icon: 'Zap',
    level: 4,
  },
} as const

export type DecisionTypeId = keyof typeof DECISION_TYPES

// Échelles d'impact
export const SCALE_LEVELS = {
  TINY: {
    id: 'TINY',
    label: 'Très petit',
    description: 'Moins de 100 personnes',
    range: '< 100',
    level: 1,
  },
  SMALL: {
    id: 'SMALL',
    label: 'Petit',
    description: '100 à 10 000 personnes',
    range: '100 - 10K',
    level: 2,
  },
  MEDIUM: {
    id: 'MEDIUM',
    label: 'Moyen',
    description: '10 000 à 100 000 personnes',
    range: '10K - 100K',
    level: 3,
  },
  LARGE: {
    id: 'LARGE',
    label: 'Grand',
    description: '100 000 à 1 million de personnes',
    range: '100K - 1M',
    level: 4,
  },
  VERY_LARGE: {
    id: 'VERY_LARGE',
    label: 'Très grand',
    description: 'Plus d\'1 million de personnes',
    range: '> 1M',
    level: 5,
  },
} as const

export type ScaleId = keyof typeof SCALE_LEVELS

// Domaines d'application
export const SIA_DOMAINS = {
  HEALTH: { id: 'HEALTH', label: 'Santé', icon: 'Heart' },
  FINANCE: { id: 'FINANCE', label: 'Finance & Banque', icon: 'Building' },
  HR: { id: 'HR', label: 'Ressources humaines', icon: 'Users' },
  COMMERCE: { id: 'COMMERCE', label: 'Commerce & E-commerce', icon: 'ShoppingCart' },
  JUSTICE: { id: 'JUSTICE', label: 'Justice & Police', icon: 'Scale' },
  ADMINISTRATION: { id: 'ADMINISTRATION', label: 'Administration publique', icon: 'Landmark' },
  EDUCATION: { id: 'EDUCATION', label: 'Éducation', icon: 'GraduationCap' },
  TRANSPORT: { id: 'TRANSPORT', label: 'Transport', icon: 'Car' },
  SECURITY: { id: 'SECURITY', label: 'Sécurité', icon: 'Shield' },
  MARKETING: { id: 'MARKETING', label: 'Marketing & Publicité', icon: 'Megaphone' },
  OTHER: { id: 'OTHER', label: 'Autre', icon: 'MoreHorizontal' },
} as const

export type SiaDomainId = keyof typeof SIA_DOMAINS

// Bases légales RGPD
export const LEGAL_BASES = {
  CONSENT: { id: 'CONSENT', label: 'Consentement', article: 'Art. 6.1.a' },
  CONTRACT: { id: 'CONTRACT', label: 'Exécution d\'un contrat', article: 'Art. 6.1.b' },
  LEGAL_OBLIGATION: { id: 'LEGAL_OBLIGATION', label: 'Obligation légale', article: 'Art. 6.1.c' },
  VITAL_INTEREST: { id: 'VITAL_INTEREST', label: 'Intérêts vitaux', article: 'Art. 6.1.d' },
  PUBLIC_INTEREST: { id: 'PUBLIC_INTEREST', label: 'Mission d\'intérêt public', article: 'Art. 6.1.e' },
  LEGITIMATE_INTEREST: { id: 'LEGITIMATE_INTEREST', label: 'Intérêt légitime', article: 'Art. 6.1.f' },
} as const

// Fréquences
export const FREQUENCIES = {
  REALTIME: { id: 'REALTIME', label: 'Temps réel' },
  HOURLY: { id: 'HOURLY', label: 'Horaire' },
  DAILY: { id: 'DAILY', label: 'Quotidien' },
  WEEKLY: { id: 'WEEKLY', label: 'Hebdomadaire' },
  MONTHLY: { id: 'MONTHLY', label: 'Mensuel' },
  ON_DEMAND: { id: 'ON_DEMAND', label: 'À la demande' },
  ONE_TIME: { id: 'ONE_TIME', label: 'Ponctuel' },
} as const

// Populations types
export const POPULATIONS = [
  { id: 'employees', label: 'Employés' },
  { id: 'candidates', label: 'Candidats à l\'emploi' },
  { id: 'customers', label: 'Clients' },
  { id: 'prospects', label: 'Prospects' },
  { id: 'users', label: 'Utilisateurs' },
  { id: 'patients', label: 'Patients' },
  { id: 'students', label: 'Étudiants' },
  { id: 'citizens', label: 'Citoyens' },
  { id: 'public', label: 'Grand public' },
  { id: 'other', label: 'Autre' },
] as const

// DATA_TYPES structure for canvas components
export const DATA_TYPES = {
  IDENTITY: {
    label: 'Identité',
    types: [
      { id: 'NAME', label: 'Nom / Prénom' },
      { id: 'DOB', label: 'Date de naissance' },
      { id: 'SSN', label: 'Numéro de sécurité sociale' },
      { id: 'NATIONAL_ID', label: 'Pièce d\'identité' },
    ],
  },
  CONTACT: {
    label: 'Contact',
    types: [
      { id: 'EMAIL', label: 'Email' },
      { id: 'PHONE', label: 'Téléphone' },
      { id: 'ADDRESS', label: 'Adresse postale' },
    ],
  },
  LOCATION: {
    label: 'Localisation',
    types: [
      { id: 'GPS', label: 'Géolocalisation GPS' },
      { id: 'IP_ADDRESS', label: 'Adresse IP' },
      { id: 'TRAVEL_HISTORY', label: 'Historique des déplacements' },
    ],
  },
  FINANCIAL: {
    label: 'Finance',
    types: [
      { id: 'INCOME', label: 'Revenus' },
      { id: 'BANK_ACCOUNT', label: 'Compte bancaire' },
      { id: 'TRANSACTIONS', label: 'Transactions' },
      { id: 'CREDIT_SCORE', label: 'Score de crédit' },
    ],
  },
  HEALTH: {
    label: 'Santé',
    types: [
      { id: 'MEDICAL_RECORD', label: 'Dossier médical' },
      { id: 'DISABILITY', label: 'Handicap' },
      { id: 'TREATMENTS', label: 'Traitements' },
      { id: 'ALLERGIES', label: 'Allergies' },
    ],
  },
  BIOMETRIC: {
    label: 'Biométrie',
    types: [
      { id: 'FINGERPRINT', label: 'Empreinte digitale' },
      { id: 'FACE', label: 'Reconnaissance faciale' },
      { id: 'VOICE', label: 'Empreinte vocale' },
    ],
  },
  BEHAVIORAL: {
    label: 'Comportement',
    types: [
      { id: 'BROWSING', label: 'Navigation web' },
      { id: 'PURCHASES', label: 'Achats' },
      { id: 'INTERACTIONS', label: 'Interactions' },
      { id: 'PREFERENCES', label: 'Préférences' },
    ],
  },
  PROFESSIONAL: {
    label: 'Professionnel',
    types: [
      { id: 'CV', label: 'CV' },
      { id: 'EMPLOYMENT', label: 'Emploi actuel' },
      { id: 'EDUCATION', label: 'Formation' },
      { id: 'SKILLS', label: 'Compétences' },
    ],
  },
  INFERRED: {
    label: 'Données inférées',
    types: [
      { id: 'SCORE', label: 'Score calculé' },
      { id: 'PREDICTION', label: 'Prédiction' },
      { id: 'CATEGORY', label: 'Catégorisation' },
      { id: 'DECISION', label: 'Décision automatique' },
    ],
  },
} as const
