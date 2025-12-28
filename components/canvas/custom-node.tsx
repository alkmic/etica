'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import {
  Database,
  Cpu,
  GitBranch,
  Zap,
  Users,
  HardDrive,
  User,
  Building2,
  Bot,
  Server,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Function types - what the node DOES in the flow
export type NodeFunctionType = 'SOURCE' | 'TREATMENT' | 'DECISION' | 'ACTION' | 'STAKEHOLDER' | 'STORAGE'

// Entity types - WHO/WHAT owns or operates the node (optional, for ethical analysis)
export type NodeEntityType = 'HUMAN' | 'AI' | 'INFRA' | 'ORG'

export interface CustomNodeData {
  label: string
  type: NodeFunctionType
  entityType?: NodeEntityType
  description?: string
  dataTypes?: string[]
  // Handle configuration
  inputCount?: number  // 1-3, default 1
  outputCount?: number // 1-3, default 1
}

const functionConfig: Record<NodeFunctionType, {
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  label: string
  description: string
}> = {
  SOURCE: {
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    label: 'Source de données',
    description: 'Point de collecte ou origine des données',
  },
  TREATMENT: {
    icon: Cpu,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    label: 'Traitement',
    description: 'Transformation ou analyse des données',
  },
  DECISION: {
    icon: GitBranch,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    label: 'Décision',
    description: 'Point de décision algorithmique',
  },
  ACTION: {
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    label: 'Action',
    description: 'Effet ou action résultante',
  },
  STAKEHOLDER: {
    icon: Users,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    label: 'Partie prenante',
    description: 'Personne ou groupe impacté',
  },
  STORAGE: {
    icon: HardDrive,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    label: 'Stockage',
    description: 'Conservation des données',
  },
}

const entityIcons: Record<NodeEntityType, React.ElementType> = {
  HUMAN: User,
  AI: Bot,
  INFRA: Server,
  ORG: Building2,
}

const entityLabels: Record<NodeEntityType, string> = {
  HUMAN: 'Personne',
  AI: 'IA/ML',
  INFRA: 'Infrastructure',
  ORG: 'Organisation',
}

// Handle positions for multiple connections
const handlePositions = {
  top: -8,
  middle: 0,
  bottom: 8,
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const config = functionConfig[data.type] || functionConfig.SOURCE
  const Icon = config.icon
  const EntityIcon = data.entityType ? entityIcons[data.entityType] : null

  const inputCount = data.inputCount || 1
  const outputCount = data.outputCount || 1

  // Generate handle positions based on count
  const getHandleOffsets = (count: number): number[] => {
    if (count === 1) return [0]
    if (count === 2) return [-10, 10]
    return [-16, 0, 16]
  }

  const inputOffsets = getHandleOffsets(inputCount)
  const outputOffsets = getHandleOffsets(outputCount)

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-xl border-2 min-w-[180px] max-w-[220px] shadow-sm transition-all duration-200',
        config.bgColor,
        config.borderColor,
        selected && 'ring-2 ring-primary ring-offset-2 shadow-lg scale-105'
      )}
    >
      {/* Input handles - left side */}
      {inputOffsets.map((offset, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          className={cn(
            '!w-3 !h-3 !border-2 !border-white !rounded-full transition-colors',
            '!bg-gray-400 hover:!bg-gray-600'
          )}
          style={{ top: `calc(50% + ${offset}px)` }}
        />
      ))}

      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2.5 rounded-lg bg-white/70 shadow-sm relative',
          config.color
        )}>
          <Icon className="h-5 w-5" />
          {/* Entity type indicator badge */}
          {EntityIcon && (
            <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-sm">
              <EntityIcon className="h-3 w-3 text-gray-500" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate leading-tight">
            {data.label}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{config.label}</p>

          {/* Entity type label */}
          {data.entityType && (
            <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-xs bg-white/80 text-gray-600 border border-gray-200">
              {entityLabels[data.entityType]}
            </span>
          )}

          {/* Data types badges */}
          {data.dataTypes && data.dataTypes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {data.dataTypes.slice(0, 2).map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-white/90 text-gray-700 border border-gray-200"
                >
                  {type}
                </span>
              ))}
              {data.dataTypes.length > 2 && (
                <span className="text-xs text-gray-400 px-1">
                  +{data.dataTypes.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Output handles - right side */}
      {outputOffsets.map((offset, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={`output-${index}`}
          className={cn(
            '!w-3 !h-3 !border-2 !border-white !rounded-full transition-colors',
            '!bg-gray-400 hover:!bg-primary'
          )}
          style={{ top: `calc(50% + ${offset}px)` }}
        />
      ))}

      {/* Connection count indicators */}
      {(inputCount > 1 || outputCount > 1) && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {inputCount > 1 && (
            <span className="text-[10px] px-1 py-0.5 bg-gray-100 rounded text-gray-500">
              ← {inputCount}
            </span>
          )}
          {outputCount > 1 && (
            <span className="text-[10px] px-1 py-0.5 bg-gray-100 rounded text-gray-500">
              {outputCount} →
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default memo(CustomNode)

// Legacy export for compatibility
export type NodeType = NodeFunctionType
