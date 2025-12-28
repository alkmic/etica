'use client'

import { useState, useEffect } from 'react'
import { X, User, Bot, Server, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { DATA_TYPES } from '@/lib/constants/data-types'
import { NodeType, NodeEntityType } from './custom-node'

interface NodeEditorProps {
  node: {
    id: string
    data: {
      label: string
      type: NodeType
      entityType?: NodeEntityType
      description?: string
      dataTypes?: string[]
      inputCount?: number
      outputCount?: number
    }
  }
  onUpdate: (id: string, data: Partial<{
    label: string
    type: NodeType
    entityType: NodeEntityType | undefined
    description: string
    dataTypes: string[]
    inputCount: number
    outputCount: number
  }>) => void
  onClose: () => void
  onDelete: (id: string) => void
}

const nodeTypeOptions: Array<{ value: NodeType; label: string; description: string }> = [
  { value: 'SOURCE', label: 'Source de données', description: 'Point de collecte ou origine des données' },
  { value: 'TREATMENT', label: 'Traitement', description: 'Transformation ou analyse des données' },
  { value: 'DECISION', label: 'Décision', description: 'Point de décision algorithmique' },
  { value: 'ACTION', label: 'Action', description: 'Effet ou action résultante' },
  { value: 'STAKEHOLDER', label: 'Partie prenante', description: 'Personne ou groupe impacté' },
  { value: 'STORAGE', label: 'Stockage', description: 'Conservation des données' },
]

const entityTypeOptions: Array<{ value: NodeEntityType; label: string; icon: React.ElementType }> = [
  { value: 'HUMAN', label: 'Personne', icon: User },
  { value: 'AI', label: 'IA / ML', icon: Bot },
  { value: 'INFRA', label: 'Infrastructure', icon: Server },
  { value: 'ORG', label: 'Organisation', icon: Building2 },
]

export function NodeEditor({ node, onUpdate, onClose, onDelete }: NodeEditorProps) {
  const [label, setLabel] = useState(node.data.label)
  const [type, setType] = useState<NodeType>(node.data.type)
  const [entityType, setEntityType] = useState<NodeEntityType | undefined>(node.data.entityType)
  const [description, setDescription] = useState(node.data.description || '')
  const [dataTypes, setDataTypes] = useState<string[]>(node.data.dataTypes || [])
  const [inputCount, setInputCount] = useState(node.data.inputCount || 1)
  const [outputCount, setOutputCount] = useState(node.data.outputCount || 1)

  useEffect(() => {
    setLabel(node.data.label)
    setType(node.data.type)
    setEntityType(node.data.entityType)
    setDescription(node.data.description || '')
    setDataTypes(node.data.dataTypes || [])
    setInputCount(node.data.inputCount || 1)
    setOutputCount(node.data.outputCount || 1)
  }, [node])

  const handleSave = () => {
    onUpdate(node.id, {
      label,
      type,
      entityType,
      description,
      dataTypes,
      inputCount,
      outputCount,
    })
  }

  const toggleDataType = (dataType: string) => {
    setDataTypes((prev) =>
      prev.includes(dataType)
        ? prev.filter((t) => t !== dataType)
        : [...prev, dataType]
    )
  }

  return (
    <div className="absolute top-4 right-4 z-10 w-96 bg-white rounded-lg shadow-xl border">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold">Modifier l&apos;élément</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)] max-h-[550px]">
        <div className="p-4 space-y-5">
          {/* Basic info */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="label">Nom</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Nom de l'élément"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Fonction dans le flux</Label>
              <Select value={type} onValueChange={(v) => setType(v as NodeType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nodeTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <span>{option.label}</span>
                        <span className="block text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Opérateur (optionnel)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Qui opère ou contrôle ce composant ?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {entityTypeOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = entityType === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEntityType(isSelected ? undefined : option.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Connections */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Connexions</Label>
            <p className="text-xs text-muted-foreground">
              Configurez le nombre d&apos;entrées et sorties possibles
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Entrées</span>
                  <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">
                    {inputCount}
                  </span>
                </div>
                <Slider
                  value={[inputCount]}
                  min={1}
                  max={3}
                  step={1}
                  onValueChange={([v]) => setInputCount(v)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sorties</span>
                  <span className="text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">
                    {outputCount}
                  </span>
                </div>
                <Slider
                  value={[outputCount]}
                  min={1}
                  max={3}
                  step={1}
                  onValueChange={([v]) => setOutputCount(v)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le rôle de cet élément..."
              rows={3}
            />
          </div>

          {/* Data types */}
          <div className="space-y-2">
            <Label>Types de données manipulées</Label>
            <div className="border rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto bg-gray-50">
              {Object.entries(DATA_TYPES).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {category.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1 pl-1">
                    {category.types.map((dt) => (
                      <div key={dt.id} className="flex items-center gap-2">
                        <Checkbox
                          id={dt.id}
                          checked={dataTypes.includes(dt.id)}
                          onCheckedChange={() => toggleDataType(dt.id)}
                        />
                        <label
                          htmlFor={dt.id}
                          className="text-xs cursor-pointer flex-1 truncate"
                          title={dt.label}
                        >
                          {dt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {dataTypes.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {dataTypes.length} type(s) sélectionné(s)
              </p>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex items-center justify-between gap-2 bg-gray-50 rounded-b-lg">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(node.id)}
        >
          Supprimer
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button size="sm" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )
}
