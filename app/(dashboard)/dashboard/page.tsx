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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getVigilanceLabel } from '@/lib/utils'
import { SIA_DOMAINS, SIA_STATUSES } from '@/lib/constants'

// Mock data for demonstration
const mockSias = [
  {
    id: 'sia-1',
    name: 'Système de tri de candidatures',
    domain: 'HR',
    status: 'ACTIVE',
    description: 'Analyse automatique des CV et pré-sélection des candidats',
    vigilanceLevel: 3,
    tensionCount: 3,
    openTensionCount: 2,
    actionCount: 8,
    completedActionCount: 5,
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: 'sia-2',
    name: 'Chatbot service client',
    domain: 'COMMERCE',
    status: 'ACTIVE',
    description: 'Assistant conversationnel pour le support client',
    vigilanceLevel: 2,
    tensionCount: 2,
    openTensionCount: 1,
    actionCount: 4,
    completedActionCount: 3,
    updatedAt: new Date('2025-01-10'),
  },
  {
    id: 'sia-3',
    name: 'Scoring crédit',
    domain: 'FINANCE',
    status: 'REVIEW',
    description: 'Évaluation automatique de la solvabilité des demandeurs',
    vigilanceLevel: 4,
    tensionCount: 5,
    openTensionCount: 4,
    actionCount: 12,
    completedActionCount: 4,
    updatedAt: new Date('2025-01-08'),
  },
]

function SiaCard({ sia }: { sia: typeof mockSias[0] }) {
  const domain = SIA_DOMAINS[sia.domain as keyof typeof SIA_DOMAINS]
  const status = SIA_STATUSES[sia.status as keyof typeof SIA_STATUSES]
  const coverage = sia.actionCount > 0
    ? Math.round((sia.completedActionCount / sia.actionCount) * 100)
    : 0

  const vigilanceColors: Record<number, string> = {
    1: 'bg-green-500',
    2: 'bg-lime-500',
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500',
  }

  return (
    <Card hover className="group">
      <Link href={`/${sia.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {sia.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {domain?.label || sia.domain}
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
                    level <= sia.vigilanceLevel
                      ? vigilanceColors[sia.vigilanceLevel]
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {getVigilanceLabel(sia.vigilanceLevel)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>
                {sia.openTensionCount}/{sia.tensionCount} tensions
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes systèmes d'IA</h1>
          <p className="text-muted-foreground">
            Gérez et analysez l'éthique de vos systèmes
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
                <p className="text-2xl font-bold">{mockSias.length}</p>
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
                <p className="text-2xl font-bold">
                  {mockSias.reduce((acc, sia) => acc + sia.openTensionCount, 0)}
                </p>
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
                <p className="text-2xl font-bold">
                  {mockSias.reduce(
                    (acc, sia) => acc + (sia.actionCount - sia.completedActionCount),
                    0
                  )}
                </p>
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
                <p className="text-2xl font-bold">
                  {mockSias.reduce((acc, sia) => acc + sia.completedActionCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SIA Grid */}
      {mockSias.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockSias.map((sia) => (
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
              Vous n'avez pas encore de système d'IA. Créez votre premier système
              pour commencer l'analyse éthique.
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
