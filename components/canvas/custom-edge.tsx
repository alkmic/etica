'use client'

import { memo } from 'react'
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
} from 'reactflow'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomEdgeData {
  dataTypes?: string[]
  description?: string
  domains?: string[]
  hasTension?: boolean
  tensionSeverity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<CustomEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const hasTension = data?.hasTension
  const severity = data?.tensionSeverity || 'LOW'
  const hasData = data?.dataTypes && data.dataTypes.length > 0

  const severityColors: Record<string, string> = {
    LOW: '#3b82f6',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
  }

  // Determine stroke color based on state
  let strokeColor = '#64748b' // Default slate color for visibility
  if (hasTension) {
    strokeColor = severityColors[severity]
  } else if (hasData) {
    strokeColor = '#6366f1' // Indigo for edges with data types
  }

  const markerId = `arrow-${id}`

  return (
    <>
      {/* Arrow marker definition */}
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={selected ? '#6366f1' : strokeColor}
          />
        </marker>
      </defs>

      {/* Invisible wider path for easier selection */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />

      {/* Visible edge path */}
      <path
        id={id}
        className={cn(
          'react-flow__edge-path transition-all',
          selected && 'stroke-primary'
        )}
        d={edgePath}
        fill="none"
        stroke={selected ? '#6366f1' : strokeColor}
        strokeWidth={selected ? 3 : hasTension ? 2.5 : 2}
        markerEnd={`url(#${markerId})`}
      />

      {/* Edge label */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="flex flex-col items-center gap-1">
            {hasTension && (
              <div
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white shadow-md border',
                  severity === 'CRITICAL' && 'border-red-300 text-red-700',
                  severity === 'HIGH' && 'border-orange-300 text-orange-700',
                  severity === 'MEDIUM' && 'border-yellow-300 text-yellow-700',
                  severity === 'LOW' && 'border-blue-300 text-blue-700'
                )}
              >
                <AlertTriangle className="h-3 w-3" />
                <span>Tension</span>
              </div>
            )}
            {data?.dataTypes && data.dataTypes.length > 0 && (
              <div className={cn(
                'px-2.5 py-1 rounded-md shadow-sm border text-xs font-medium',
                selected
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-700'
              )}>
                {data.dataTypes.length > 2
                  ? `${data.dataTypes.slice(0, 2).join(', ')} +${data.dataTypes.length - 2}`
                  : data.dataTypes.join(', ')
                }
              </div>
            )}
            {data?.description && !hasData && (
              <div className="px-2 py-1 rounded bg-gray-100 border border-gray-200 text-xs text-gray-600 max-w-[140px] truncate">
                {data.description}
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(CustomEdge)
