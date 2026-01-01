// Types globaux ETICA
// Note: Types manually defined to avoid Prisma client generation dependency

// Base types matching Prisma schema
export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Sia {
  id: string
  name: string
  description: string | null
  domain: string
  dataTypes: string[]
  decisionType: string
  populations: string[]
  hasVulnerable: boolean
  scale: string
  status: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Node {
  id: string
  siaId: string
  type: string
  label: string
  attributes: Record<string, unknown>
  positionX: number
  positionY: number
  style: Record<string, unknown> | null
}

export interface Edge {
  id: string
  siaId: string
  sourceId: string
  targetId: string
  label: string | null
  direction: string
  nature: string
  dataCategories: string[]
  sensitivity: string
  automation: string
  frequency: string
  legalBasis: string | null
  agentivity: number | null
  asymmetry: number | null
  irreversibility: number | null
  scalability: number | null
  opacity: number | null
}

export interface Tension {
  id: string
  siaId: string
  pattern: string
  description: string
  status: string
  level: string
  impactedDomains: string[]
  baseSeverity: number
  calculatedSeverity: number | null
  triggerConditions: Record<string, unknown> | null
  activeAmplifiers: string[]
  activeMitigators: string[]
  relatedNodeIds: string[]
  detectionReason: string | null
  triggeredByRule: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Action {
  id: string
  siaId: string
  tensionId: string | null
  title: string
  description: string | null
  category: string
  priority: string
  status: string
  effort: string
  dueDate: Date | null
  completedAt: Date | null
  assigneeId: string | null
  templateId: string | null
  sourceRule: string | null
  estimatedImpact: Record<string, number> | null
  checklist: Array<{ text: string; completed: boolean }> | null
  createdAt: Date
  updatedAt: Date
}

export interface Arbitration {
  id: string
  tensionId: string
  decision: string
  justification: string
  selectedMeasures: string[]
  benefitAnalysis: string | null
  riskAcceptance: string | null
  rejectionReason: string | null
  proportionality: string | null
  contestability: string | null
  revisionConditions: string | null
  compensatoryMeasures: string | null
  arbitratedById: string | null
  arbitratedAt: Date
  validatedById: string | null
  validatedAt: Date | null
  nextReviewDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Evidence {
  id: string
  actionId: string
  type: string
  title: string
  description: string | null
  url: string | null
  fileKey: string | null
  fileName: string | null
  fileSize: number | null
  mimeType: string | null
  createdAt: Date
}

export interface Comment {
  id: string
  tensionId: string
  authorId: string
  content: string
  resolved: boolean
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Version {
  id: string
  siaId: string
  number: number
  label: string | null
  changelog: string | null
  snapshot: Record<string, unknown>
  vigilanceScores: Record<string, unknown> | null
  globalScore: number | null
  tensionCount: number | null
  resolvedCount: number | null
  actionCount: number | null
  completedCount: number | null
  createdById: string
  createdAt: Date
}

// Types enrichis avec relations
export type SiaWithRelations = Sia & {
  owner: Pick<User, 'id' | 'name' | 'email' | 'image'>
  nodes: Node[]
  edges: Edge[]
  tensions: TensionWithRelations[]
  actions: ActionWithRelations[]
  _count?: {
    nodes: number
    edges: number
    tensions: number
    actions: number
  }
}

export type TensionWithRelations = Tension & {
  actions: Action[]
  arbitration: Arbitration | null
  comments: CommentWithAuthor[]
  tensionEdges: { edge: Edge }[]
}

export type ActionWithRelations = Action & {
  tension?: Tension | null
  assignee?: Pick<User, 'id' | 'name' | 'email' | 'image'> | null
  evidences: Evidence[]
}

export type CommentWithAuthor = Comment & {
  author: Pick<User, 'id' | 'name' | 'email' | 'image'>
  replies?: CommentWithAuthor[]
}

// Types pour les scores de vigilance
export interface VigilanceScore {
  score: number
  level: 1 | 2 | 3 | 4 | 5
  exposure: number
  coverage: number
  tensionCount: number
}

export interface VigilanceScores {
  global: number
  globalLevel: 1 | 2 | 3 | 4 | 5
  byDomain: Record<string, VigilanceScore>
  coverage: number
  tensionCount: number
  activeActionCount: number
}

// Types pour le canvas React Flow
export interface CanvasNode {
  id: string
  type: 'human' | 'ai' | 'infra' | 'org'
  position: { x: number; y: number }
  data: {
    label: string
    subtype?: string
    attributes: Record<string, unknown>
  }
}

export interface CanvasEdge {
  id: string
  source: string
  target: string
  type: 'flow'
  data: {
    label?: string
    nature: string
    vigilanceLevel: number
    qualified: boolean
  }
}

// Types pour le wizard de création
export interface WizardData {
  name: string
  description?: string
  domain: string
  dataTypes: string[]
  decisionType: string
  populations: string[]
  hasVulnerable: boolean
  scale: string
}

// Types pour les formulaires
export interface TensionQualification {
  severity: number
  probability: number
  scale: number
  vulnerability: number
  irreversibility: number
  detectability: number
  uncertainties?: Record<string, 'low' | 'medium' | 'high'>
}

export interface EdgeQualification {
  nature: string
  dataCategories: string[]
  sensitivity: string
  automation: string
  frequency: string
  legalBasis?: string
  agentivity?: number
  asymmetry?: number
  irreversibility?: number
  scalability?: number
  opacity?: number
}

// Types pour les API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Types pour les exports
export interface ExportOptions {
  format: 'pdf' | 'json' | 'excel'
  type: 'synthesis' | 'full' | 'audit'
  includeHistory?: boolean
  includeEvidences?: boolean
}

// Types pour les notifications
export interface Notification {
  id: string
  type: 'tension_detected' | 'action_due' | 'review_scheduled' | 'comment_added'
  title: string
  message: string
  siaId?: string
  tensionId?: string
  actionId?: string
  read: boolean
  createdAt: Date
}

// Types pour le dashboard
export interface DashboardStats {
  totalSias: number
  activeSias: number
  totalTensions: number
  openTensions: number
  totalActions: number
  completedActions: number
  overdueActions: number
  averageVigilance: number
}

// Types utilitaires
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
