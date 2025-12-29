'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Settings,
  Trash2,
  AlertTriangle,
  Save,
  Archive,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

interface Sia {
  id: string
  name: string
  description: string
  domain: string | null
  status: string
  decisionType: string
  scale: string
  dataTypes: string[]
  populations: string[]
  hasVulnerable: boolean
  createdAt: string
  updatedAt: string
}

const statusOptions = [
  { value: 'DRAFT', label: 'Brouillon' },
  { value: 'IN_PROGRESS', label: 'En cours' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'ARCHIVED', label: 'Archivé' },
]

const decisionTypeOptions = [
  { value: 'INFORMATIVE', label: 'Informatif - Simple information' },
  { value: 'RECOMMENDATION', label: 'Recommandation - Suggestion à l\'humain' },
  { value: 'ASSISTED_DECISION', label: 'Décision assistée - L\'humain valide' },
  { value: 'AUTO_DECISION', label: 'Décision automatique - Pas d\'intervention humaine' },
]

const scaleOptions = [
  { value: 'TINY', label: 'Très petit - Moins de 100 personnes' },
  { value: 'SMALL', label: 'Petit - 100 à 10 000 personnes' },
  { value: 'MEDIUM', label: 'Moyen - 10 000 à 100 000 personnes' },
  { value: 'LARGE', label: 'Grand - 100 000 à 1 million' },
  { value: 'VERY_LARGE', label: 'Très grand - Plus d\'1 million' },
]

export default function SettingsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const siaId = params.siaId as string

  const [sia, setSia] = useState<Sia | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmName, setConfirmName] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '',
    status: 'DRAFT',
    decisionType: 'INFORMATIVE',
    scale: 'MEDIUM',
  })

  useEffect(() => {
    async function fetchSia() {
      try {
        const response = await fetch(`/api/sia/${siaId}`)
        if (response.ok) {
          const data = await response.json()
          setSia(data)
          setFormData({
            name: data.name,
            description: data.description || '',
            domain: data.domain || '',
            status: data.status,
            decisionType: data.decisionType,
            scale: data.scale,
          })
        }
      } catch (error) {
        console.error('Error fetching SIA:', error)
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      fetchSia()
    }
  }, [siaId])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/sia/${siaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedSia = await response.json()
        setSia(updatedSia)
        toast({
          title: 'Paramètres enregistrés',
          description: 'Les modifications ont été sauvegardées',
        })
      } else {
        throw new Error('Save failed')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les modifications',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async () => {
    try {
      const response = await fetch(`/api/sia/${siaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ARCHIVED' }),
      })

      if (response.ok) {
        toast({
          title: 'SIA archivé',
          description: 'Le système a été archivé avec succès',
        })
        router.push('/')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'archiver le SIA',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (confirmName !== sia?.name) {
      toast({
        title: 'Erreur',
        description: 'Le nom ne correspond pas',
        variant: 'destructive',
      })
      return
    }

    setDeleting(true)
    try {
      const response = await fetch(`/api/sia/${siaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'SIA supprimé',
          description: 'Le système a été supprimé définitivement',
        })
        router.push('/')
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le SIA',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!sia) {
    return null
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres du système d&apos;information algorithmique
        </p>
      </div>

      {/* General settings */}
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>
            Modifiez les informations de base du SIA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du système</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Système de scoring crédit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez brièvement le système..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domaine d&apos;application</Label>
            <Input
              id="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              placeholder="Ex: Finance, RH, Santé..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Classification */}
      <Card>
        <CardHeader>
          <CardTitle>Classification</CardTitle>
          <CardDescription>
            Définissez la portée et l&apos;impact du système
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type de décision</Label>
            <Select
              value={formData.decisionType}
              onValueChange={(v) => setFormData({ ...formData, decisionType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {decisionTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Échelle d&apos;impact</Label>
            <Select
              value={formData.scale}
              onValueChange={(v) => setFormData({ ...formData, scale: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scaleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer les modifications
            </>
          )}
        </Button>
      </div>

      <Separator />

      {/* Danger zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>
            Ces actions sont irréversibles. Procédez avec prudence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <h4 className="font-medium">Archiver le SIA</h4>
              <p className="text-sm text-muted-foreground">
                Le SIA ne sera plus modifiable mais restera accessible en lecture.
              </p>
            </div>
            <Button variant="outline" onClick={handleArchive}>
              <Archive className="mr-2 h-4 w-4" />
              Archiver
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30">
            <div>
              <h4 className="font-medium text-destructive">Supprimer le SIA</h4>
              <p className="text-sm text-muted-foreground">
                Cette action supprimera définitivement le SIA et toutes ses données.
              </p>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Confirmer la suppression
                  </DialogTitle>
                  <DialogDescription>
                    Cette action est irréversible. Toutes les données associées (flux, tensions, actions) seront également supprimées.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm">
                    Pour confirmer, tapez le nom du SIA : <strong>{sia.name}</strong>
                  </p>
                  <Input
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    placeholder="Nom du SIA"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteDialogOpen(false)
                      setConfirmName('')
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting || confirmName !== sia.name}
                  >
                    {deleting ? 'Suppression...' : 'Supprimer définitivement'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métadonnées</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">ID</dt>
              <dd className="font-mono">{sia.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Créé le</dt>
              <dd>
                {new Date(sia.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Dernière modification</dt>
              <dd>
                {new Date(sia.updatedAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
