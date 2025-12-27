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
  markerEnd,
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

  const severityColors: Record<string, string> = {
    LOW: '#3b82f6',
    MEDIUM: '#f59e0b',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
  }

  const strokeColor = hasTension ? severityColors[severity] : '#94a3b8'

  return (
    <>
      <path
        id={id}
        className={cn(
          'react-flow__edge-path transition-all',
          selected && 'stroke-primary'
        )}
        d={edgePath}
        fill="none"
        stroke={selected ? undefined : strokeColor}
        strokeWidth={selected ? 3 : hasTension ? 2.5 : 2}
        markerEnd={markerEnd}
        style={{
          strokeDasharray: hasTension ? undefined : '5,5',
        }}
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
          {!hasTension && data?.dataTypes && data.dataTypes.length > 0 && (
            <div className="px-2 py-1 rounded bg-white/90 shadow-sm border border-gray-200 text-xs text-gray-600 max-w-[120px] truncate">
              {data.dataTypes.join(', ')}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(CustomEdge)
