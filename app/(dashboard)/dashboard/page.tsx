'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getVigilanceLabel } from '@/lib/utils'
import { SIA_DOMAINS, SIA_STATUSES } from '@/lib/constants'

interface Sia {
  id: string
  name: string
  sector: string
  status: string
  description: string
  vigilanceScores: {
    global: number
    domains: Record<string, number>
  } | null
  _count: {
    tensions: number
    actions: number
  }
  tensions: Array<{ status: string }>
  actions: Array<{ status: string }>
}

function SiaCard({ sia }: { sia: Sia }) {
  const sector = SIA_DOMAINS[sia.sector as keyof typeof SIA_DOMAINS]
  const status = SIA_STATUSES[sia.status as keyof typeof SIA_STATUSES]

  const vigilanceLevel = sia.vigilanceScores?.global
    ? Math.round(sia.vigilanceScores.global)
    : 0

  const tensionCount = sia._count?.tensions || sia.tensions?.length || 0
  const openTensionCount = sia.tensions?.filter(t =>
    t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS'
  ).length || 0

  const actionCount = sia._count?.actions || sia.actions?.length || 0
  const completedActionCount = sia.actions?.filter(a => a.status === 'DONE').length || 0

  const coverage = actionCount > 0
    ? Math.round((completedActionCount / actionCount) * 100)
    : 0

  const vigilanceColors: Record<number, string> = {
    0: 'bg-gray-300',
    1: 'bg-green-500',
    2: 'bg-lime-500',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <Link href={`/${sia.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {sia.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {sector?.label || sia.sector}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    color: status?.color === 'green' ? 'rgb(34 197 94)' : undefined,
                  }}
                >
                  {status?.label || sia.status}
                </Badge>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {sia.description}
          </p>

          {/* Vigilance indicator */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Vigilance</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-2 w-6 rounded-full ${
                    level <= vigilanceLevel
                      ? vigilanceColors[vigilanceLevel] || vigilanceColors[0]
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {getVigilanceLabel(vigilanceLevel)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>
                {openTensionCount}/{tensionCount} tensions
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{coverage}% actions</span>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={coverage} className="h-1.5" />
        </CardContent>
      </Link>
    </Card>
  )
}

export default function DashboardPage() {
  const [sias, setSias] = useState<Sia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSias() {
      try {
        const response = await fetch('/api/sia')
        if (!response.ok) {
          throw new Error('Erreur lors du chargement')
        }
        const data = await response.json()
        setSias(data)
      } catch (err) {
        setError('Impossible de charger les systèmes')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSias()
  }, [])

  // Calculate stats
  const totalTensions = sias.reduce((acc, sia) => acc + (sia._count?.tensions || sia.tensions?.length || 0), 0)
  const openTensions = sias.reduce((acc, sia) => {
    const open = sia.tensions?.filter(t =>
      t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS'
    ).length || 0
    return acc + open
  }, 0)
  const totalActions = sias.reduce((acc, sia) => acc + (sia._count?.actions || sia.actions?.length || 0), 0)
  const completedActions = sias.reduce((acc, sia) => {
    const completed = sia.actions?.filter(a => a.status === 'DONE').length || 0
    return acc + completed
  }, 0)
  const pendingActions = totalActions - completedActions

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de vos systèmes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes systèmes d&apos;IA</h1>
          <p className="text-muted-foreground">
            Gérez et analysez l&apos;éthique de vos systèmes
          </p>
        </div>
        <Button asChild>
          <Link href="/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau SIA
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un système..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <div className="flex border rounded-md">
          <Button variant="ghost" size="icon" className="rounded-r-none">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-l-none">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total SIA</p>
                <p className="text-2xl font-bold">{sias.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tensions ouvertes</p>
                <p className="text-2xl font-bold">{openTensions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actions en cours</p>
                <p className="text-2xl font-bold">{pendingActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actions terminées</p>
                <p className="text-2xl font-bold">{completedActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SIA Grid */}
      {error ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Erreur de chargement</h3>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Réessayer
            </Button>
          </div>
        </Card>
      ) : sias.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sias.map((sia) => (
            <SiaCard key={sia.id} sia={sia} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-muted">
              <Plus className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-lg font-semibold">Aucun système</h3>
            <p className="mt-2 text-muted-foreground">
              Vous n&apos;avez pas encore de système d&apos;IA. Créez votre premier système
              pour commencer l&apos;analyse éthique.
            </p>
            <Button asChild className="mt-6">
              <Link href="/new">
                <Plus className="h-4 w-4 mr-2" />
                Créer un SIA
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
