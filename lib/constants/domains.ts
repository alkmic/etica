// Domaines de vigilance ETICA - Version enrichie
// Ces 8 domaines couvrent l'ensemble des droits fondamentaux pertinents pour les systèmes d'IA
// Chaque domaine contient des sous-dimensions pondérées pour affiner la détection

export interface SubDimension {
  id: string
  label: string
  description: string
  weight: number // Poids pour le calcul de sévérité (0.5 à 2.0)
}

export interface Domain {
  id: string
  label: string
  icon: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  description: string
  question: string
  subDimensions: SubDimension[]
}

export const DOMAINS: Record<string, Domain> = {
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
    subDimensions: [
      { id: 'minimization', label: 'Minimisation des données', description: 'Ne collecter que le strict nécessaire', weight: 1.0 },
      { id: 'consent', label: 'Consentement éclairé', description: 'Informer clairement et obtenir un accord libre', weight: 1.2 },
      { id: 'access', label: "Droit d'accès", description: 'Permettre de consulter ses données', weight: 0.8 },
      { id: 'rectification', label: 'Droit de rectification', description: 'Permettre de corriger les erreurs', weight: 0.8 },
      { id: 'erasure', label: "Droit à l'effacement", description: 'Permettre la suppression', weight: 1.0 },
      { id: 'retention', label: 'Limitation de conservation', description: 'Supprimer après la durée nécessaire', weight: 1.0 },
      { id: 'anti_profiling', label: 'Protection contre le profilage', description: 'Limiter les inférences intrusives sur les comportements', weight: 1.5 },
      { id: 'anti_inference', label: 'Protection contre les inférences', description: 'Limiter les déductions de données sensibles à partir de données ordinaires', weight: 1.5 },
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
    subDimensions: [
      { id: 'direct_discrimination', label: 'Non-discrimination directe', description: 'Ne pas fonder une décision sur une caractéristique protégée', weight: 1.5 },
      { id: 'indirect_discrimination', label: 'Non-discrimination indirecte', description: "Ne pas avoir d'effet disproportionné sur un groupe", weight: 1.5 },
      { id: 'proxy_discrimination', label: 'Absence de proxies discriminatoires', description: 'Ne pas utiliser de variables corrélées aux caractéristiques protégées', weight: 1.3 },
      { id: 'equal_opportunity', label: 'Égalité des chances', description: 'Traitement comparable pour situations comparables', weight: 1.2 },
      { id: 'reasonable_accommodation', label: 'Aménagement raisonnable', description: 'Adapter aux besoins spécifiques', weight: 1.0 },
      { id: 'historical_bias', label: 'Correction des biais historiques', description: 'Ne pas reproduire les inégalités du passé dans les données', weight: 1.4 },
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
    subDimensions: [
      { id: 'existence', label: 'Information sur le système', description: "Savoir qu'un système IA est utilisé", weight: 1.0 },
      { id: 'general_logic', label: 'Logique générale', description: 'Comprendre le fonctionnement global du système', weight: 1.0 },
      { id: 'individual_decisions', label: 'Explication des décisions individuelles', description: 'Comprendre pourquoi une décision spécifique a été prise', weight: 1.3 },
      { id: 'criteria', label: 'Accès aux critères utilisés', description: 'Connaître les facteurs pris en compte', weight: 1.2 },
      { id: 'confidence', label: 'Niveau de confiance', description: 'Connaître la fiabilité des décisions', weight: 0.8 },
      { id: 'traceability', label: 'Traçabilité', description: 'Pouvoir retracer le processus de décision', weight: 1.1 },
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
    subDimensions: [
      { id: 'decision_freedom', label: 'Liberté de décision', description: 'Pouvoir faire ses propres choix', weight: 1.2 },
      { id: 'anti_manipulation', label: 'Protection contre la manipulation', description: "Ne pas être influencé de façon déloyale ou subliminale", weight: 1.5 },
      { id: 'anti_coercion', label: 'Protection contre la coercition', description: "Ne pas être contraint par le système", weight: 1.5 },
      { id: 'data_control', label: 'Contrôle sur ses données', description: "Décider de l'utilisation de ses propres données", weight: 1.0 },
      { id: 'refusal', label: 'Possibilité de refus', description: 'Pouvoir dire non au système', weight: 1.3 },
      { id: 'alternatives', label: 'Accès aux alternatives', description: 'Avoir accès à des options non-automatisées', weight: 1.0 },
      { id: 'anti_dependency', label: 'Protection contre la dépendance', description: 'Éviter la dépendance excessive au système', weight: 0.8 },
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
    subDimensions: [
      { id: 'physical_integrity', label: 'Intégrité physique', description: 'Ne pas causer de dommages corporels', weight: 2.0 },
      { id: 'mental_integrity', label: 'Intégrité mentale', description: 'Ne pas causer de détresse psychologique', weight: 1.5 },
      { id: 'data_security', label: 'Sécurité des données', description: 'Protéger contre les fuites et accès non autorisés', weight: 1.2 },
      { id: 'error_handling', label: 'Gestion des erreurs', description: 'Minimiser les impacts des erreurs du système', weight: 1.0 },
      { id: 'abuse_prevention', label: 'Prévention des abus', description: 'Empêcher le détournement du système', weight: 1.1 },
      { id: 'reliability', label: 'Fiabilité du système', description: 'Fonctionner de façon prévisible et stable', weight: 1.0 },
      { id: 'minor_protection', label: 'Protection des mineurs', description: 'Protection renforcée pour les enfants', weight: 1.8 },
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
    subDimensions: [
      { id: 'contestation', label: 'Droit de contestation', description: "Pouvoir s'opposer à une décision", weight: 1.3 },
      { id: 'human_access', label: 'Accès à un humain', description: 'Pouvoir parler à une personne', weight: 1.2 },
      { id: 'reasonable_delay', label: 'Délai raisonnable', description: 'Obtenir une réponse dans un temps acceptable', weight: 0.8 },
      { id: 'effective_review', label: 'Réexamen effectif', description: 'Obtenir une vraie révision de la décision', weight: 1.3 },
      { id: 'motivation', label: 'Motivation des décisions', description: 'Recevoir une explication de la décision contestée', weight: 1.0 },
      { id: 'repair', label: 'Réparation effective', description: "Obtenir compensation en cas d'erreur", weight: 1.1 },
      { id: 'mediation', label: 'Accès à la médiation', description: 'Pouvoir faire appel à un tiers indépendant', weight: 0.9 },
    ],
  },
  SUSTAINABILITY: {
    id: 'SUSTAINABILITY',
    label: 'Durabilité & Société',
    icon: 'Leaf',
    color: '#22C55E', // green
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-green-400',
    description: 'Impact environnemental et sociétal à long terme',
    question: "L'impact environnemental et sociétal à long terme est-il maîtrisé ?",
    subDimensions: [
      { id: 'energy', label: 'Consommation énergétique', description: 'Énergie nécessaire au fonctionnement', weight: 1.0 },
      { id: 'carbon', label: 'Empreinte carbone', description: 'Émissions de CO2 directes et indirectes', weight: 1.0 },
      { id: 'employment', label: 'Impact sur l\'emploi', description: 'Effets sur le travail et les compétences', weight: 1.2 },
      { id: 'power_concentration', label: 'Concentration du pouvoir', description: 'Risque de concentration excessive du pouvoir économique ou politique', weight: 1.3 },
      { id: 'intergenerational', label: 'Impact intergénérationnel', description: 'Conséquences pour les générations futures', weight: 1.1 },
      { id: 'commons', label: 'Biens communs', description: 'Impact sur les ressources partagées et l\'espace public', weight: 0.9 },
      { id: 'tech_dependency', label: 'Dépendance technologique', description: 'Risque de dépendance à des infrastructures critiques', weight: 0.8 },
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
    subDimensions: [
      { id: 'identification', label: 'Identification des responsables', description: 'Savoir qui est responsable de quoi', weight: 1.2 },
      { id: 'chain', label: 'Chaîne de responsabilité', description: 'Traçabilité des décisions et actions', weight: 1.1 },
      { id: 'documentation', label: 'Documentation des décisions', description: 'Enregistrement des choix et raisons', weight: 1.0 },
      { id: 'governance', label: 'Gouvernance définie', description: 'Structure de pilotage claire', weight: 1.0 },
      { id: 'human_oversight', label: 'Contrôle humain', description: 'Supervision humaine effective du système', weight: 1.4 },
      { id: 'audit', label: 'Auditabilité', description: 'Possibilité de vérification indépendante', weight: 1.1 },
      { id: 'shutdown', label: 'Possibilité d\'arrêt', description: 'Capacité à désactiver le système si nécessaire', weight: 1.3 },
    ],
  },
} as const

export type DomainId = keyof typeof DOMAINS

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

// Fonction pour récupérer le poids d'une sous-dimension
export function getSubDimensionWeight(domainId: DomainId, subDimensionId: string): number {
  const domain = DOMAINS[domainId]
  const subDimension = domain?.subDimensions.find(sd => sd.id === subDimensionId)
  return subDimension?.weight || 1.0
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
