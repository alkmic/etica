// Domaines éthiques ETICA
// Ces 12 domaines sont organisés en 3 cercles concentriques selon la méthodologie ETICA

// =============================================================================
// CERCLE 1 : PERSONNES (6 domaines)
// Les droits et intérêts des individus directement concernés par le système
// =============================================================================

export const CIRCLE_1_DOMAINS = {
  PRIVACY: {
    id: 'PRIVACY',
    label: 'Vie privée',
    icon: 'Lock',
    color: '#3B82F6', // blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
    circle: 1,
    circleName: 'Personnes',
    description: 'Protection des données personnelles et de la vie privée',
    question: 'Les données personnelles sont-elles protégées ?',
    covers: [
      'Minimisation des données collectées',
      'Consentement éclairé',
      'Droit d\'accès, rectification, effacement',
      'Protection contre le profilage excessif',
      'Sécurité des transferts',
    ],
  },
  EQUITY: {
    id: 'EQUITY',
    label: 'Équité',
    icon: 'Scale',
    color: '#EC4899', // pink
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-400',
    circle: 1,
    circleName: 'Personnes',
    description: 'Traitement juste et non-discriminatoire',
    question: 'Le traitement est-il juste pour tous ?',
    covers: [
      'Non-discrimination directe et indirecte',
      'Équité entre groupes démographiques',
      'Absence de biais systématiques',
      'Égalité d\'accès au service',
      'Traitement des cas atypiques',
    ],
  },
  TRANSPARENCY: {
    id: 'TRANSPARENCY',
    label: 'Transparence',
    icon: 'Eye',
    color: '#F59E0B', // amber
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-400',
    circle: 1,
    circleName: 'Personnes',
    description: 'Compréhension du fonctionnement et des décisions',
    question: 'Les personnes comprennent-elles ce qui se passe ?',
    covers: [
      'Information sur l\'utilisation d\'IA',
      'Explication des critères de décision',
      'Accès aux données utilisées',
      'Clarté des conditions d\'utilisation',
      'Communication sur les limites du système',
    ],
  },
  AUTONOMY: {
    id: 'AUTONOMY',
    label: 'Autonomie',
    icon: 'Target',
    color: '#10B981', // emerald
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    circle: 1,
    circleName: 'Personnes',
    description: 'Liberté de choix et d\'action des personnes',
    question: 'Les personnes gardent-elles leur liberté de choix ?',
    covers: [
      'Possibilité de refuser le traitement automatisé',
      'Alternatives non-algorithmiques',
      'Absence de manipulation (dark patterns)',
      'Respect des préférences exprimées',
      'Capacité à comprendre et contester',
    ],
  },
  SECURITY: {
    id: 'SECURITY',
    label: 'Sécurité',
    icon: 'Shield',
    color: '#6366F1', // indigo
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-400',
    circle: 1,
    circleName: 'Personnes',
    description: 'Protection contre les préjudices',
    question: 'Le système protège-t-il contre les préjudices ?',
    covers: [
      'Protection contre les erreurs graves',
      'Robustesse face aux attaques',
      'Fiabilité des résultats',
      'Gestion des cas limites',
      'Prévention des usages détournés',
    ],
  },
  RECOURSE: {
    id: 'RECOURSE',
    label: 'Recours',
    icon: 'Zap',
    color: '#EF4444', // red
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-400',
    circle: 1,
    circleName: 'Personnes',
    description: 'Possibilité de contester et obtenir réparation',
    question: 'Les personnes peuvent-elles contester et obtenir réparation ?',
    covers: [
      'Procédure de contestation accessible',
      'Intervention humaine possible',
      'Délai de réponse raisonnable',
      'Réparation effective en cas d\'erreur',
      'Traçabilité des décisions',
    ],
  },
} as const

// =============================================================================
// CERCLE 2 : ORGANISATION (3 domaines)
// La capacité de l'organisation à maîtriser et assumer son système
// =============================================================================

export const CIRCLE_2_DOMAINS = {
  MASTERY: {
    id: 'MASTERY',
    label: 'Maîtrise',
    icon: 'Sliders',
    color: '#8B5CF6', // violet
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-400',
    circle: 2,
    circleName: 'Organisation',
    description: 'Compréhension et contrôle du système',
    question: 'Comprenez-vous et contrôlez-vous votre système ?',
    covers: [
      'Compréhension technique du fonctionnement',
      'Capacité à modifier le comportement',
      'Traçabilité des décisions',
      'Compétences internes pour maintenir le système',
      'Documentation technique à jour',
    ],
  },
  RESPONSIBILITY: {
    id: 'RESPONSIBILITY',
    label: 'Responsabilité',
    icon: 'Handshake',
    color: '#7C3AED', // purple
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-400',
    circle: 2,
    circleName: 'Organisation',
    description: 'Clarté des responsabilités',
    question: 'Les responsabilités sont-elles claires ?',
    covers: [
      'Identification du responsable du système',
      'Chaîne de responsabilité en cas de problème',
      'Processus d\'escalade défini',
      'Assurance et couverture des risques',
      'Engagement de la direction',
    ],
  },
  SOVEREIGNTY: {
    id: 'SOVEREIGNTY',
    label: 'Souveraineté',
    icon: 'Landmark',
    color: '#A855F7', // fuchsia
    bgColor: 'bg-fuchsia-100',
    textColor: 'text-fuchsia-700',
    borderColor: 'border-fuchsia-400',
    circle: 2,
    circleName: 'Organisation',
    description: 'Indépendance vis-à-vis des fournisseurs',
    question: 'Êtes-vous indépendant de vos fournisseurs ?',
    covers: [
      'Dépendance aux APIs et services externes',
      'Localisation des données et traitements',
      'Capacité à changer de fournisseur',
      'Maîtrise des évolutions (mises à jour imposées)',
      'Risques géopolitiques et juridictionnels',
    ],
  },
} as const

// =============================================================================
// CERCLE 3 : SOCIÉTÉ (3 domaines)
// L'impact du système au-delà des utilisateurs directs
// =============================================================================

export const CIRCLE_3_DOMAINS = {
  SUSTAINABILITY: {
    id: 'SUSTAINABILITY',
    label: 'Durabilité',
    icon: 'Leaf',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-400',
    circle: 3,
    circleName: 'Société',
    description: 'Impact environnemental et social maîtrisé',
    question: 'L\'impact environnemental et social est-il maîtrisé ?',
    covers: [
      'Consommation énergétique',
      'Empreinte carbone',
      'Impact sur l\'emploi',
      'Effets à long terme',
      'Sobriété numérique',
    ],
  },
  LOYALTY: {
    id: 'LOYALTY',
    label: 'Loyauté',
    icon: 'Gem',
    color: '#059669', // emerald-600
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    circle: 3,
    circleName: 'Société',
    description: 'Relations équilibrées avec les parties prenantes',
    question: 'Les relations avec les parties prenantes sont-elles équilibrées ?',
    covers: [
      'Transparence envers les partenaires',
      'Équité dans le partage de la valeur',
      'Respect des engagements',
      'Communication sur les risques',
      'Prise en compte des intérêts des tiers',
    ],
  },
  SOCIETAL_BALANCE: {
    id: 'SOCIETAL_BALANCE',
    label: 'Équilibre sociétal',
    icon: 'Globe',
    color: '#14B8A6', // teal
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-400',
    circle: 3,
    circleName: 'Société',
    description: 'Contribution positive à la société',
    question: 'Le système contribue-t-il positivement à la société ?',
    covers: [
      'Concentration du pouvoir décisionnel',
      'Effets sur la concurrence',
      'Impact sur les inégalités',
      'Précédents créés pour le secteur',
      'Contribution au bien commun',
    ],
  },
} as const

// =============================================================================
// DOMAINES CONSOLIDÉS (12 domaines)
// =============================================================================

export const DOMAINS = {
  ...CIRCLE_1_DOMAINS,
  ...CIRCLE_2_DOMAINS,
  ...CIRCLE_3_DOMAINS,
} as const

export type DomainId = keyof typeof DOMAINS
export type Domain = typeof DOMAINS[DomainId]

export const DOMAIN_IDS = Object.keys(DOMAINS) as DomainId[]
export const DOMAIN_LIST = Object.values(DOMAINS)

// Domaines par cercle
export const DOMAINS_BY_CIRCLE = {
  1: Object.values(CIRCLE_1_DOMAINS),
  2: Object.values(CIRCLE_2_DOMAINS),
  3: Object.values(CIRCLE_3_DOMAINS),
} as const

export const CIRCLE_NAMES = {
  1: 'Personnes',
  2: 'Organisation',
  3: 'Société',
} as const

export const CIRCLE_COLORS = {
  1: '#3B82F6', // blue
  2: '#8B5CF6', // violet
  3: '#22C55E', // green
} as const

// Fonction pour récupérer un domaine par ID
export function getDomain(id: DomainId): Domain {
  return DOMAINS[id]
}

// Fonction pour récupérer la couleur d'un domaine
export function getDomainColor(id: DomainId): string {
  return DOMAINS[id]?.color || '#6B7280'
}

// Fonction pour récupérer le label d'un domaine
export function getDomainLabel(id: DomainId): string {
  return DOMAINS[id]?.label || id
}

// Fonction pour récupérer les domaines d'un cercle
export function getDomainsByCircle(circle: 1 | 2 | 3): Domain[] {
  return DOMAINS_BY_CIRCLE[circle]
}

// Caractéristiques protégées à surveiller pour l'équité
export const PROTECTED_CHARACTERISTICS = [
  { id: 'ethnic_origin', label: 'Origine ethnique ou nationale' },
  { id: 'gender', label: 'Genre et identité de genre' },
  { id: 'sexual_orientation', label: 'Orientation sexuelle' },
  { id: 'age', label: 'Âge' },
  { id: 'disability', label: 'Handicap (physique, mental, psychique)' },
  { id: 'religion', label: 'Religion ou convictions' },
  { id: 'political_opinions', label: 'Opinions politiques' },
  { id: 'family_status', label: 'Situation familiale' },
  { id: 'pregnancy', label: 'Grossesse et maternité' },
  { id: 'appearance', label: 'Apparence physique' },
  { id: 'health', label: 'État de santé' },
  { id: 'economic_status', label: 'Situation économique' },
  { id: 'residence', label: 'Lieu de résidence' },
  { id: 'surname', label: 'Nom de famille' },
] as const
