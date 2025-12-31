'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DATA_TYPES } from '@/lib/constants/data-types'
import { NodeType } from './custom-node'

interface NodeEditorProps {
  node: {
    id: string
    data: {
      label: string
      type: NodeType
      description?: string
      dataTypes?: string[]
    }
  }
  onUpdate: (id: string, data: Partial<{ label: string; type: NodeType; description: string; dataTypes: string[] }>) => void
  onClose: () => void
  onDelete: (id: string) => void
}

const nodeTypeOptions: Array<{ value: NodeType; label: string }> = [
  { value: 'SOURCE', label: 'Source de données' },
  { value: 'TREATMENT', label: 'Traitement' },
  { value: 'DECISION', label: 'Décision' },
  { value: 'ACTION', label: 'Action' },
  { value: 'STAKEHOLDER', label: 'Partie prenante' },
  { value: 'STORAGE', label: 'Stockage' },
]

export function NodeEditor({ node, onUpdate, onClose, onDelete }: NodeEditorProps) {
  const [label, setLabel] = useState(node.data.label)
  const [type, setType] = useState<NodeType>(node.data.type)
  const [description, setDescription] = useState(node.data.description || '')
  const [dataTypes, setDataTypes] = useState<string[]>(node.data.dataTypes || [])

  useEffect(() => {
    setLabel(node.data.label)
    setType(node.data.type)
    setDescription(node.data.description || '')
    setDataTypes(node.data.dataTypes || [])
  }, [node])

  const handleSave = () => {
    onUpdate(node.id, {
      label,
      type,
      description,
      dataTypes,
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
    <div className="absolute top-4 right-4 z-10 w-80 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Modifier l&apos;élément</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] max-h-[500px]">
        <div className="p-4 space-y-4">
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
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as NodeType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {nodeTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de l'élément..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Types de données</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(DATA_TYPES).map(([key, dataType]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={dataType.id}
                    checked={dataTypes.includes(dataType.id)}
                    onCheckedChange={() => toggleDataType(dataType.id)}
                  />
                  <label
                    htmlFor={dataType.id}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {dataType.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex items-center justify-between gap-2">
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
