'use client'

import {
  Database,
  Cpu,
  GitBranch,
  Zap,
  Users,
  HardDrive,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Undo2,
  Redo2,
  Save,
  Trash2,
} from 'lucide-react'
import { useReactFlow } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { NodeType } from './custom-node'

interface CanvasToolbarProps {
  onAddNode: (type: NodeType) => void
  onSave: () => void
  onDelete: () => void
  isSaving: boolean
  canDelete: boolean
}

const nodeTypes: Array<{
  type: NodeType
  icon: React.ElementType
  label: string
  color: string
}> = [
  { type: 'SOURCE', icon: Database, label: 'Source de données', color: 'text-blue-600' },
  { type: 'TREATMENT', icon: Cpu, label: 'Traitement', color: 'text-purple-600' },
  { type: 'DECISION', icon: GitBranch, label: 'Décision', color: 'text-orange-600' },
  { type: 'ACTION', icon: Zap, label: 'Action', color: 'text-green-600' },
  { type: 'STAKEHOLDER', icon: Users, label: 'Partie prenante', color: 'text-pink-600' },
  { type: 'STORAGE', icon: HardDrive, label: 'Stockage', color: 'text-gray-600' },
]

export function CanvasToolbar({
  onAddNode,
  onSave,
  onDelete,
  isSaving,
  canDelete,
}: CanvasToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-lg border p-2">
        {/* Node types */}
        <div className="flex items-center gap-1">
          {nodeTypes.map((node) => (
            <Tooltip key={node.type}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => onAddNode(node.type)}
                >
                  <node.icon className={`h-5 w-5 ${node.color}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Ajouter: {node.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => zoomIn()}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Zoom avant</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => zoomOut()}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Zoom arrière</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => fitView({ padding: 0.2 })}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Ajuster à la vue</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={onSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Sauvegarder</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive"
                onClick={onDelete}
                disabled={!canDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Supprimer la sélection</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
