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
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type NodeType = 'SOURCE' | 'TREATMENT' | 'DECISION' | 'ACTION' | 'STAKEHOLDER' | 'STORAGE'

interface CustomNodeData {
  label: string
  type: NodeType
  description?: string
  dataTypes?: string[]
}

const nodeConfig: Record<NodeType, {
  icon: React.ElementType
  color: string
  bgColor: string
  borderColor: string
  label: string
}> = {
  SOURCE: {
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Source de données',
  },
  TREATMENT: {
    icon: Cpu,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    label: 'Traitement',
  },
  DECISION: {
    icon: GitBranch,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Décision',
  },
  ACTION: {
    icon: Zap,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Action',
  },
  STAKEHOLDER: {
    icon: Users,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    label: 'Partie prenante',
  },
  STORAGE: {
    icon: HardDrive,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Stockage',
  },
}

function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const config = nodeConfig[data.type] || nodeConfig.SOURCE
  const Icon = config.icon

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 min-w-[160px] shadow-sm transition-all',
        config.bgColor,
        config.borderColor,
        selected && 'ring-2 ring-primary ring-offset-2 shadow-lg'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />

      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg bg-white/50', config.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">
            {data.label}
          </p>
          <p className="text-xs text-gray-500">{config.label}</p>
          {data.dataTypes && data.dataTypes.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {data.dataTypes.slice(0, 2).map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-white/80 text-gray-600"
                >
                  {type}
                </span>
              ))}
              {data.dataTypes.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{data.dataTypes.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />
    </div>
  )
}

export default memo(CustomNode)
