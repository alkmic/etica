// Types globaux ETICA

import type {
  User,
  Sia,
  Node,
  Edge,
  Tension,
  Action,
  Arbitration,
  Evidence,
  Comment,
  Version,
} from '@prisma/client'

// Re-export des types Prisma
export type {
  User,
  Sia,
  Node,
  Edge,
  Tension,
  Action,
  Arbitration,
  Evidence,
  Comment,
  Version,
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
  arbitrations: Arbitration[]
  arbitration?: Arbitration | null // Computed from arbitrations[0] for backwards compatibility
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
  sector: string            // Renamed from "domain"
  dataTypes: string[]
  decisionType: string
  populations: string[]
  hasVulnerable: boolean
  userScale: string         // Renamed from "scale"
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
