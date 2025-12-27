// Domaines de vigilance ETICA
// Ces 8 domaines couvrent l'ensemble des droits fondamentaux pertinents pour les systèmes d'IA

export const DOMAINS = {
  PRIVACY: {
    id: 'PRIVACY',
    label: 'Vie privée',
    icon: 'Lock',
    color: '#8B5CF6', // violet
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-400',
    description: 'Protection des données personnelles et de la vie privée',
    question: 'Les données personnelles sont-elles collectées, traitées et protégées de manière respectueuse ?',
    subRights: [
      { id: 'minimization', label: 'Minimisation des données', description: 'Ne collecter que le strict nécessaire' },
      { id: 'consent', label: 'Consentement éclairé', description: 'Informer clairement et obtenir un accord libre' },
      { id: 'access', label: "Droit d'accès", description: 'Permettre de consulter ses données' },
      { id: 'rectification', label: 'Droit de rectification', description: 'Permettre de corriger les erreurs' },
      { id: 'erasure', label: "Droit à l'effacement", description: 'Permettre la suppression' },
      { id: 'retention', label: 'Limitation de conservation', description: 'Supprimer après la durée nécessaire' },
      { id: 'transfer_security', label: 'Sécurité des transferts', description: 'Protéger lors des échanges' },
      { id: 'profiling', label: 'Protection contre le profilage', description: 'Limiter les inférences intrusives' },
    ],
  },
  EQUITY: {
    id: 'EQUITY',
    label: 'Équité',
    icon: 'Scale',
    color: '#EC4899', // rose
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-700',
    borderColor: 'border-pink-400',
    description: 'Traitement juste et non-discriminatoire',
    question: 'Le système traite-t-il toutes les personnes et tous les groupes de manière juste ?',
    subRights: [
      { id: 'direct_discrimination', label: 'Non-discrimination directe', description: 'Ne pas fonder une décision sur une caractéristique protégée' },
      { id: 'indirect_discrimination', label: 'Non-discrimination indirecte', description: "Ne pas avoir d'effet disproportionné sur un groupe" },
      { id: 'equal_treatment', label: 'Égalité de traitement', description: 'Traitement comparable pour situations comparables' },
      { id: 'substantive_equality', label: 'Égalité substantielle', description: 'Tenir compte des différences réelles' },
      { id: 'reasonable_accommodation', label: 'Aménagement raisonnable', description: 'Adapter aux besoins spécifiques' },
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
    description: 'Compréhension du fonctionnement et des décisions',
    question: 'Les personnes comprennent-elles ce qui se passe et pourquoi ?',
    subRights: [
      { id: 'existence', label: 'Information sur le traitement', description: "Savoir qu'un système IA est utilisé" },
      { id: 'logic', label: 'Explication des décisions', description: 'Comprendre comment ça fonctionne' },
      { id: 'criteria', label: 'Accès aux critères utilisés', description: 'Connaître les facteurs pris en compte' },
      { id: 'consequences', label: 'Compréhension des impacts', description: 'Comprendre les impacts possibles' },
    ],
  },
  AUTONOMY: {
    id: 'AUTONOMY',
    label: 'Autonomie',
    icon: 'User',
    color: '#10B981', // emerald
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    description: "Liberté de choix et d'action des personnes",
    question: 'Les personnes gardent-elles leur liberté de choix et d\'action ?',
    subRights: [
      { id: 'decision_freedom', label: 'Liberté de décision', description: 'Pouvoir faire ses propres choix' },
      { id: 'no_manipulation', label: 'Absence de manipulation', description: "Ne pas être influencé de façon déloyale" },
      { id: 'data_control', label: 'Contrôle sur ses données', description: "Décider de l'utilisation" },
      { id: 'refusal', label: 'Possibilité de refus', description: 'Pouvoir dire non' },
    ],
  },
  SECURITY: {
    id: 'SECURITY',
    label: 'Sécurité',
    icon: 'Shield',
    color: '#3B82F6', // blue
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
    description: 'Protection contre les préjudices',
    question: 'Le système protège-t-il les personnes contre les préjudices ?',
    subRights: [
      { id: 'physical_integrity', label: 'Intégrité physique', description: 'Ne pas causer de dommages corporels' },
      { id: 'mental_integrity', label: 'Intégrité mentale', description: 'Ne pas causer de détresse psychologique' },
      { id: 'data_protection', label: 'Protection des données', description: 'Protéger contre les fuites' },
      { id: 'reliability', label: 'Fiabilité du système', description: 'Fonctionner de façon prévisible' },
    ],
  },
  RECOURSE: {
    id: 'RECOURSE',
    label: 'Recours',
    icon: 'MessageSquare',
    color: '#EF4444', // red
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-red-400',
    description: 'Possibilité de contester et obtenir réparation',
    question: 'Les personnes peuvent-elles contester les décisions et obtenir réparation ?',
    subRights: [
      { id: 'contestation', label: 'Droit de contestation', description: "Pouvoir s'opposer à une décision" },
      { id: 'human_access', label: 'Accès à un humain', description: 'Pouvoir parler à une personne' },
      { id: 'reasonable_delay', label: 'Délai raisonnable', description: 'Obtenir une réponse dans un temps acceptable' },
      { id: 'effective_repair', label: 'Réparation effective', description: "Obtenir compensation en cas d'erreur" },
    ],
  },
  SUSTAINABILITY: {
    id: 'SUSTAINABILITY',
    label: 'Durabilité',
    icon: 'Leaf',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-400',
    description: 'Impact environnemental et sociétal',
    question: "L'impact environnemental et sociétal à long terme est-il maîtrisé ?",
    subRights: [
      { id: 'environmental', label: 'Impact environnemental', description: 'Énergie nécessaire au fonctionnement' },
      { id: 'energy', label: 'Consommation énergétique', description: 'Émissions de CO2' },
      { id: 'societal', label: 'Impact sociétal', description: 'Effets sur le travail et la société' },
    ],
  },
  ACCOUNTABILITY: {
    id: 'ACCOUNTABILITY',
    label: 'Responsabilité',
    icon: 'Users',
    color: '#6366F1', // indigo
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-400',
    description: 'Clarté des responsabilités',
    question: 'Les responsabilités sont-elles clairement définies et assumées ?',
    subRights: [
      { id: 'identification', label: 'Identification des responsables', description: 'Savoir qui est responsable de quoi' },
      { id: 'chain', label: 'Chaîne de responsabilité', description: 'Traçabilité des décisions' },
      { id: 'documentation', label: 'Documentation des décisions', description: 'Enregistrement des choix et raisons' },
      { id: 'governance', label: 'Gouvernance définie', description: 'Structure de pilotage définie' },
    ],
  },
} as const

export type DomainId = keyof typeof DOMAINS
export type Domain = typeof DOMAINS[DomainId]

export const DOMAIN_IDS = Object.keys(DOMAINS) as DomainId[]

export const DOMAIN_LIST = Object.values(DOMAINS)

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
