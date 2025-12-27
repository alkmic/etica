'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Filter,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUpRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { ACTION_TEMPLATES } from '@/lib/constants/action-templates'

interface Action {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  dueDate: string | null
  assignee: string | null
  tensionId: string | null
  tension?: {
    id: string
    description: string
    primaryDomain: string
    secondaryDomain: string
  }
  evidences: Array<{
    id: string
    title: string
    type: string
  }>
  createdAt: string
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const priorityColors: Record<string, string> = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  PENDING: 'À faire',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
}

const priorityLabels: Record<string, string> = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  CRITICAL: 'Critique',
}

const categoryLabels: Record<string, string> = {
  MINIMIZATION: 'Minimisation des données',
  TRANSPARENCY: 'Transparence',
  HUMAN_CONTROL: 'Contrôle humain',
  RECOURSE: 'Recours',
  TECHNICAL: 'Technique',
  ORGANIZATIONAL: 'Organisationnel',
  DESIGN: 'Conception',
  AUDIT: 'Audit',
}

export default function ActionsPage() {
  const params = useParams()
  const siaId = params.siaId as string
  const { toast } = useToast()

  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // New action dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'TECHNICAL',
    dueDate: '',
    assignee: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchActions() {
      try {
        const response = await fetch(`/api/sia/${siaId}/actions`)
        if (response.ok) {
          const data = await response.json()
          setActions(data)
        }
      } catch (error) {
        console.error('Error fetching actions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      fetchActions()
    }
  }, [siaId])

  const handleCreateAction = async () => {
    if (!newAction.title) {
      toast({
        title: 'Erreur',
        description: 'Le titre est requis',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/sia/${siaId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAction),
      })

      if (response.ok) {
        const action = await response.json()
        setActions((prev) => [action, ...prev])
        setNewAction({
          title: '',
          description: '',
          priority: 'MEDIUM',
          category: 'TECHNICAL',
          dueDate: '',
          assignee: '',
        })
        setIsDialogOpen(false)
        toast({
          title: 'Action créée',
          description: 'L\'action a été ajoutée au plan',
        })
      } else {
        throw new Error('Failed to create')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'action',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (action: Action) => {
    const newStatus = action.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    try {
      const response = await fetch(`/api/sia/${siaId}/actions/${action.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setActions((prev) =>
          prev.map((a) => (a.id === action.id ? { ...a, status: newStatus } : a))
        )
      }
    } catch (error) {
      console.error('Error updating action:', error)
    }
  }

  const handleDeleteAction = async (actionId: string) => {
    try {
      const response = await fetch(`/api/sia/${siaId}/actions/${actionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setActions((prev) => prev.filter((a) => a.id !== actionId))
        toast({
          title: 'Action supprimée',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'action',
        variant: 'destructive',
      })
    }
  }

  const filteredActions = actions.filter((action) => {
    const matchesSearch =
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || action.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || action.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const completedCount = actions.filter((a) => a.status === 'COMPLETED').length
  const progress = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement des actions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Plan d&apos;action</h1>
          <p className="text-muted-foreground">
            Gérez les mesures de mitigation et d&apos;amélioration
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle action
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une action</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle action au plan de mitigation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  placeholder="Ex: Implémenter le chiffrement des données"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  placeholder="Décrivez l'action à réaliser..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select
                    value={newAction.priority}
                    onValueChange={(v) => setNewAction({ ...newAction, priority: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Basse</SelectItem>
                      <SelectItem value="MEDIUM">Moyenne</SelectItem>
                      <SelectItem value="HIGH">Haute</SelectItem>
                      <SelectItem value="CRITICAL">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={newAction.category}
                    onValueChange={(v) => setNewAction({ ...newAction, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Échéance</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAction.dueDate}
                    onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Responsable</Label>
                  <Input
                    id="assignee"
                    value={newAction.assignee}
                    onChange={(e) => setNewAction({ ...newAction, assignee: e.target.value })}
                    placeholder="Nom du responsable"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateAction} disabled={saving}>
                {saving ? 'Création...' : 'Créer l\'action'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progression globale</span>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{actions.length} actions terminées
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="PENDING">À faire</SelectItem>
            <SelectItem value="IN_PROGRESS">En cours</SelectItem>
            <SelectItem value="COMPLETED">Terminée</SelectItem>
            <SelectItem value="CANCELLED">Annulée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les priorités</SelectItem>
            <SelectItem value="CRITICAL">Critique</SelectItem>
            <SelectItem value="HIGH">Haute</SelectItem>
            <SelectItem value="MEDIUM">Moyenne</SelectItem>
            <SelectItem value="LOW">Basse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Actions list */}
      {actions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune action planifiée</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Créez des actions pour documenter les mesures prises pour atténuer les tensions
                éthiques détectées.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une action
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredActions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Aucune action correspondant aux filtres
              </CardContent>
            </Card>
          ) : (
            filteredActions.map((action) => (
              <Card key={action.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={action.status === 'COMPLETED'}
                      onCheckedChange={() => handleToggleStatus(action)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className={`font-medium ${
                            action.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {action.title}
                        </h3>
                        <Badge className={priorityColors[action.priority]}>
                          {priorityLabels[action.priority]}
                        </Badge>
                        <Badge className={statusColors[action.status]}>
                          {statusLabels[action.status]}
                        </Badge>
                        <Badge variant="outline">{categoryLabels[action.category]}</Badge>
                      </div>
                      {action.description && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {action.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {action.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(action.dueDate).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                        {action.assignee && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {action.assignee}
                          </span>
                        )}
                        {action.tension && (
                          <Link
                            href={`/${siaId}/tensions/${action.tension.id}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Tension liée
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteAction(action.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
