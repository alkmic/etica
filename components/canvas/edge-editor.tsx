'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { DATA_TYPES } from '@/lib/constants/data-types'
import { DOMAINS } from '@/lib/constants/domains'

interface EdgeEditorProps {
  edge: {
    id: string
    source: string
    target: string
    data?: {
      dataTypes?: string[]
      description?: string
      domains?: string[]
    }
  }
  sourceLabel: string
  targetLabel: string
  onUpdate: (id: string, data: Partial<{ dataTypes: string[]; description: string; domains: string[] }>) => void
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
  const [domains, setDomains] = useState<string[]>(edge.data?.domains || [])

  useEffect(() => {
    setDescription(edge.data?.description || '')
    setDataTypes(edge.data?.dataTypes || [])
    setDomains(edge.data?.domains || [])
  }, [edge])

  const handleSave = () => {
    onUpdate(edge.id, {
      dataTypes,
      description,
      domains,
    })
  }

  const toggleDataType = (dataType: string) => {
    setDataTypes((prev) =>
      prev.includes(dataType)
        ? prev.filter((t) => t !== dataType)
        : [...prev, dataType]
    )
  }

  const toggleDomain = (domain: string) => {
    setDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    )
  }

  return (
    <div className="absolute top-4 right-4 z-10 w-80 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Modifier le flux</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-300px)] max-h-[500px]">
        <div className="p-4 space-y-4">
          {/* Connection info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground mb-1">Connexion</p>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{sourceLabel}</Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline">{targetLabel}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du flux</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez ce flux de données..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Types de données transférées</Label>
            <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(DATA_TYPES).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {category.label}
                  </p>
                  <div className="space-y-1 pl-2">
                    {category.types.map((dt) => (
                      <div key={dt.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`edge-${dt.id}`}
                          checked={dataTypes.includes(dt.id)}
                          onCheckedChange={() => toggleDataType(dt.id)}
                        />
                        <label
                          htmlFor={`edge-${dt.id}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {dt.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Domaines éthiques concernés</Label>
            <div className="border rounded-lg p-3 space-y-2">
              {Object.entries(DOMAINS).map(([key, domain]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={`domain-${key}`}
                    checked={domains.includes(key)}
                    onCheckedChange={() => toggleDomain(key)}
                  />
                  <label
                    htmlFor={`domain-${key}`}
                    className="text-sm cursor-pointer flex-1 flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                    {domain.label}
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
