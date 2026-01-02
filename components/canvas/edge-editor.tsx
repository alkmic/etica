'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DATA_TYPES } from '@/lib/constants/data-types'
import { AUTOMATION_LEVELS, FLOW_NATURES } from '@/lib/constants/data-types'

interface EdgeEditorProps {
  edge: {
    id: string
    source: string
    target: string
    data?: {
      dataTypes?: string[]
      description?: string
      nature?: string
      automation?: string
      label?: string
    }
  }
  sourceLabel: string
  targetLabel: string
  onUpdate: (id: string, data: Partial<{
    dataTypes: string[]
    description: string
    nature: string
    automation: string
    label: string
  }>) => void
  onClose: () => void
  onDelete: (id: string) => void
}

export function EdgeEditor({
  edge,
  sourceLabel,
  targetLabel,
  onUpdate,
  onClose,
  onDelete,
}: EdgeEditorProps) {
  const [description, setDescription] = useState(edge.data?.description || '')
  const [dataTypes, setDataTypes] = useState<string[]>(edge.data?.dataTypes || [])
  const [nature, setNature] = useState(edge.data?.nature || '')
  const [automation, setAutomation] = useState(edge.data?.automation || '')
  const [label, setLabel] = useState(edge.data?.label || '')

  useEffect(() => {
    setDescription(edge.data?.description || '')
    setDataTypes(edge.data?.dataTypes || [])
    setNature(edge.data?.nature || '')
    setAutomation(edge.data?.automation || '')
    setLabel(edge.data?.label || '')
  }, [edge])

  const handleSave = () => {
    onUpdate(edge.id, {
      dataTypes,
      description,
      nature,
      automation,
      label,
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
        <h3 className="font-semibold">Modifier le flux</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] max-h-[500px]">
        <div className="p-4 space-y-5">
          {/* Connection info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2">Connexion</p>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="max-w-[140px] truncate">{sourceLabel}</Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <Badge variant="outline" className="max-w-[140px] truncate">{targetLabel}</Badge>
            </div>
          </div>

          {/* Flow nature - Critical for detection */}
          <div className="space-y-2">
            <Label>Nature du flux</Label>
            <p className="text-xs text-muted-foreground">
              Quel type d'opération ce flux représente-t-il ?
            </p>
            <Select value={nature} onValueChange={setNature}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(FLOW_NATURES).map((n) => (
                  <SelectItem key={n.id} value={n.id}>
                    <div className="flex flex-col">
                      <span>{n.label}</span>
                      <span className="text-xs text-muted-foreground">{n.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Automation level - Critical for detection */}
          <div className="space-y-3">
            <div>
              <Label>Niveau d'automatisation</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Impact sur l'autonomie des personnes concernées
              </p>
            </div>
            <RadioGroup value={automation} onValueChange={setAutomation} className="space-y-2">
              {Object.values(AUTOMATION_LEVELS).map((level) => (
                <label
                  key={level.id}
                  className={`flex items-start gap-3 p-2 rounded-lg border cursor-pointer transition-colors ${
                    automation === level.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RadioGroupItem value={level.id} className="mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{level.label}</span>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Data types */}
          <div className="space-y-2">
            <Label>Données transférées</Label>
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
                          id={`edge-${dt.id}`}
                          checked={dataTypes.includes(dt.id)}
                          onCheckedChange={() => toggleDataType(dt.id)}
                        />
                        <label
                          htmlFor={`edge-${dt.id}`}
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez ce flux de données..."
              rows={2}
            />
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t flex items-center justify-between gap-2 bg-gray-50 rounded-b-lg">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(edge.id)}
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
