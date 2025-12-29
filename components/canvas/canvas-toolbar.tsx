'use client'

import { useState } from 'react'
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
  Save,
  Trash2,
  LayoutTemplate,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react'
import { useReactFlow } from 'reactflow'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { NodeType } from './custom-node'
import { FLOW_TEMPLATES, FlowTemplate } from '@/lib/constants/flow-templates'

interface CanvasToolbarProps {
  onAddNode: (type: NodeType) => void
  onSave: () => void
  onDelete: () => void
  onLoadTemplate: (template: FlowTemplate) => void
  isSaving: boolean
  canDelete: boolean
  hasNodes: boolean
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
  { type: 'STORAGE', icon: HardDrive, label: 'Stockage', color: 'text-slate-600' },
]

const vigilanceColors: Record<number, string> = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800',
}

export function CanvasToolbar({
  onAddNode,
  onSave,
  onDelete,
  onLoadTemplate,
  isSaving,
  canDelete,
  hasNodes,
}: CanvasToolbarProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  const [selectedTemplate, setSelectedTemplate] = useState<FlowTemplate | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleTemplateSelect = (template: FlowTemplate) => {
    if (hasNodes) {
      setSelectedTemplate(template)
      setShowConfirmDialog(true)
    } else {
      onLoadTemplate(template)
    }
  }

  const handleConfirmLoadTemplate = () => {
    if (selectedTemplate) {
      onLoadTemplate(selectedTemplate)
    }
    setShowConfirmDialog(false)
    setSelectedTemplate(null)
  }

  // Group templates by category
  const templatesByCategory = FLOW_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, FlowTemplate[]>)

  return (
    <TooltipProvider delayDuration={300}>
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-2">
        {/* Templates dropdown */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  Templates
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Charger un template pré-configuré</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start" className="w-80">
            <DropdownMenuLabel>Templates de flux IA</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(templatesByCategory).map(([category, templates]) => (
              <div key={category}>
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  {category}
                </DropdownMenuLabel>
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="flex items-start gap-3 py-3 cursor-pointer"
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{template.name}</span>
                        <Badge className={`text-xs ${vigilanceColors[template.vigilanceLevel]}`}>
                          {template.vigilanceLevel}/5
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {template.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.nodes.length} nœuds · {template.edges.length} flux
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

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
                variant="default"
                size="sm"
                className="gap-2"
                onClick={onSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Sauvegarder et analyser les tensions</p>
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

      {/* Confirmation dialog for loading template over existing nodes */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Remplacer le canvas actuel ?
            </DialogTitle>
            <DialogDescription>
              Vous avez déjà des éléments sur le canvas. Charger le template
              &quot;{selectedTemplate?.name}&quot; va remplacer tout le contenu actuel.
              Cette action est irréversible si vous n&apos;avez pas sauvegardé.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleConfirmLoadTemplate}>
              Charger le template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
