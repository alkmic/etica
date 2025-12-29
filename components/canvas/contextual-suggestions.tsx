'use client'

import { useMemo } from 'react'
import {
  Database,
  Cpu,
  GitBranch,
  Zap,
  Users,
  HardDrive,
  ArrowRight,
  Lightbulb,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NodeType } from './custom-node'
import { CanvasNode } from '@/lib/stores/canvas-store'

interface ContextualSuggestionsProps {
  nodes: CanvasNode[]
  lastAddedNodeType?: NodeType
  onAddNode: (type: NodeType) => void
  onDismiss: () => void
}

interface Suggestion {
  type: NodeType
  label: string
  reason: string
  icon: React.ElementType
  color: string
  priority: number
}

const nodeIcons: Record<NodeType, React.ElementType> = {
  SOURCE: Database,
  TREATMENT: Cpu,
  DECISION: GitBranch,
  ACTION: Zap,
  STAKEHOLDER: Users,
  STORAGE: HardDrive,
}

const nodeColors: Record<NodeType, string> = {
  SOURCE: 'text-blue-600 bg-blue-100',
  TREATMENT: 'text-purple-600 bg-purple-100',
  DECISION: 'text-orange-600 bg-orange-100',
  ACTION: 'text-green-600 bg-green-100',
  STAKEHOLDER: 'text-pink-600 bg-pink-100',
  STORAGE: 'text-slate-600 bg-slate-100',
}

const nodeLabels: Record<NodeType, string> = {
  SOURCE: 'Source',
  TREATMENT: 'Traitement',
  DECISION: 'Décision',
  ACTION: 'Action',
  STAKEHOLDER: 'Partie prenante',
  STORAGE: 'Stockage',
}

export function ContextualSuggestions({
  nodes,
  lastAddedNodeType,
  onAddNode,
  onDismiss,
}: ContextualSuggestionsProps) {
  const suggestions = useMemo(() => {
    const result: Suggestion[] = []
    const nodeTypes = nodes.map(n => n.data.type as NodeType)
    const hasType = (type: NodeType) => nodeTypes.includes(type)
    const countType = (type: NodeType) => nodeTypes.filter(t => t === type).length

    // If we just added a node, suggest what typically comes next
    if (lastAddedNodeType) {
      switch (lastAddedNodeType) {
        case 'SOURCE':
          if (!hasType('TREATMENT')) {
            result.push({
              type: 'TREATMENT',
              label: nodeLabels.TREATMENT,
              reason: 'Ajoutez un traitement pour transformer ces données',
              icon: nodeIcons.TREATMENT,
              color: nodeColors.TREATMENT,
              priority: 1,
            })
          }
          if (!hasType('STORAGE')) {
            result.push({
              type: 'STORAGE',
              label: nodeLabels.STORAGE,
              reason: 'Ou stockez directement les données collectées',
              icon: nodeIcons.STORAGE,
              color: nodeColors.STORAGE,
              priority: 2,
            })
          }
          break

        case 'STAKEHOLDER':
          if (!hasType('SOURCE')) {
            result.push({
              type: 'SOURCE',
              label: nodeLabels.SOURCE,
              reason: 'D\'où viennent les données de cette personne?',
              icon: nodeIcons.SOURCE,
              color: nodeColors.SOURCE,
              priority: 1,
            })
          }
          if (!hasType('DECISION') && !hasType('ACTION')) {
            result.push({
              type: 'DECISION',
              label: nodeLabels.DECISION,
              reason: 'Quelle décision affecte cette personne?',
              icon: nodeIcons.DECISION,
              color: nodeColors.DECISION,
              priority: 2,
            })
          }
          break

        case 'TREATMENT':
          if (!hasType('DECISION')) {
            result.push({
              type: 'DECISION',
              label: nodeLabels.DECISION,
              reason: 'Le traitement mène-t-il à une décision?',
              icon: nodeIcons.DECISION,
              color: nodeColors.DECISION,
              priority: 1,
            })
          }
          if (!hasType('STORAGE') && countType('TREATMENT') > 1) {
            result.push({
              type: 'STORAGE',
              label: nodeLabels.STORAGE,
              reason: 'Stockez les résultats du traitement',
              icon: nodeIcons.STORAGE,
              color: nodeColors.STORAGE,
              priority: 2,
            })
          }
          break

        case 'DECISION':
          if (!hasType('ACTION')) {
            result.push({
              type: 'ACTION',
              label: nodeLabels.ACTION,
              reason: 'Que se passe-t-il après la décision?',
              icon: nodeIcons.ACTION,
              color: nodeColors.ACTION,
              priority: 1,
            })
          }
          if (!hasType('STAKEHOLDER')) {
            result.push({
              type: 'STAKEHOLDER',
              label: nodeLabels.STAKEHOLDER,
              reason: 'Qui est affecté par cette décision?',
              icon: nodeIcons.STAKEHOLDER,
              color: nodeColors.STAKEHOLDER,
              priority: 2,
            })
          }
          break

        case 'ACTION':
          if (!hasType('STAKEHOLDER')) {
            result.push({
              type: 'STAKEHOLDER',
              label: nodeLabels.STAKEHOLDER,
              reason: 'Qui reçoit cette action?',
              icon: nodeIcons.STAKEHOLDER,
              color: nodeColors.STAKEHOLDER,
              priority: 1,
            })
          }
          if (!hasType('STORAGE')) {
            result.push({
              type: 'STORAGE',
              label: nodeLabels.STORAGE,
              reason: 'Conservez une trace de l\'action',
              icon: nodeIcons.STORAGE,
              color: nodeColors.STORAGE,
              priority: 2,
            })
          }
          break

        case 'STORAGE':
          if (!hasType('TREATMENT')) {
            result.push({
              type: 'TREATMENT',
              label: nodeLabels.TREATMENT,
              reason: 'Comment ces données sont-elles utilisées?',
              icon: nodeIcons.TREATMENT,
              color: nodeColors.TREATMENT,
              priority: 1,
            })
          }
          break
      }
    } else {
      // General suggestions based on what's missing in the graph
      if (!hasType('STAKEHOLDER')) {
        result.push({
          type: 'STAKEHOLDER',
          label: nodeLabels.STAKEHOLDER,
          reason: 'Ajoutez les personnes concernées',
          icon: nodeIcons.STAKEHOLDER,
          color: nodeColors.STAKEHOLDER,
          priority: 1,
        })
      }
      if (!hasType('SOURCE') && hasType('STAKEHOLDER')) {
        result.push({
          type: 'SOURCE',
          label: nodeLabels.SOURCE,
          reason: 'D\'où viennent les données?',
          icon: nodeIcons.SOURCE,
          color: nodeColors.SOURCE,
          priority: 2,
        })
      }
      if (!hasType('DECISION') && (hasType('TREATMENT') || hasType('SOURCE'))) {
        result.push({
          type: 'DECISION',
          label: nodeLabels.DECISION,
          reason: 'Ajoutez les points de décision',
          icon: nodeIcons.DECISION,
          color: nodeColors.DECISION,
          priority: 3,
        })
      }
    }

    // Sort by priority and limit to top 2
    return result.sort((a, b) => a.priority - b.priority).slice(0, 2)
  }, [nodes, lastAddedNodeType])

  if (suggestions.length === 0) return null

  return (
    <div className="absolute top-20 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-3 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          Suggestions
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onDismiss}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.type}
            onClick={() => onAddNode(suggestion.type)}
            className="w-full flex items-center gap-3 p-2 rounded-lg border hover:bg-muted/50 transition-colors text-left"
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${suggestion.color.split(' ')[1]}`}>
              <suggestion.icon className={`h-4 w-4 ${suggestion.color.split(' ')[0]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{suggestion.label}</p>
              <p className="text-xs text-muted-foreground truncate">{suggestion.reason}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  )
}
