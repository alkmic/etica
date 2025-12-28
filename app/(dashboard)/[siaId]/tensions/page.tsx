'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Search,
  Lock,
  Scale,
  Eye,
  Users,
  Shield,
  MessageSquare,
  Leaf,
  ClipboardCheck,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DOMAINS } from '@/lib/constants/domains'
import { TENSION_PATTERNS } from '@/lib/constants/tension-patterns'
import { NextStepPrompt } from '@/components/workflow/next-step-prompt'

interface Tension {
  id: string
  pattern: string
  status: string
  severity: number | null
  impactedDomains: string[]
  description: string
  createdAt: string
  arbitration: {
    id: string
    decision: string
    justification: string
    createdAt: string
  } | null
  tensionEdges: Array<{
    edge: {
      id: string
      source: { label: string }
      target: { label: string }
    }
  }>
}

const domainIcons: Record<string, React.ReactNode> = {
  PRIVACY: <Lock className="h-4 w-4" />,
  EQUITY: <Scale className="h-4 w-4" />,
  TRANSPARENCY: <Eye className="h-4 w-4" />,
  AUTONOMY: <Users className="h-4 w-4" />,
  SECURITY: <Shield className="h-4 w-4" />,
  RECOURSE: <MessageSquare className="h-4 w-4" />,
  SUSTAINABILITY: <Leaf className="h-4 w-4" />,
  ACCOUNTABILITY: <ClipboardCheck className="h-4 w-4" />,
}

// Severity is 1-5 in the schema
const severityColors: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800 border-blue-200',
  2: 'bg-green-100 text-green-800 border-green-200',
  3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  4: 'bg-orange-100 text-orange-800 border-orange-200',
  5: 'bg-red-100 text-red-800 border-red-200',
}

const statusColors: Record<string, string> = {
  DETECTED: 'bg-blue-100 text-blue-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  ARBITRATED: 'bg-indigo-100 text-indigo-800',
  RESOLVED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
}

const severityLabels: Record<number, string> = {
  1: 'Très faible',
  2: 'Faible',
  3: 'Moyenne',
  4: 'Haute',
  5: 'Critique',
}

const statusLabels: Record<string, string> = {
  DETECTED: 'Détectée',
  QUALIFIED: 'Qualifiée',
  IN_PROGRESS: 'En cours',
  ARBITRATED: 'Arbitrée',
  RESOLVED: 'Résolue',
  DISMISSED: 'Écartée',
}

export default function TensionsPage() {
  const params = useParams()
  const siaId = params.siaId as string

  const [tensions, setTensions] = useState<Tension[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'severity'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    async function fetchTensions() {
      try {
        const response = await fetch(`/api/sia/${siaId}/tensions`)
        if (response.ok) {
          const data = await response.json()
          setTensions(data)
        }
      } catch (error) {
        console.error('Error fetching tensions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      fetchTensions()
    }
  }, [siaId])

  const filteredTensions = tensions
    .filter((tension) => {
      const domainLabels = tension.impactedDomains
        .map(d => DOMAINS[d as keyof typeof DOMAINS]?.label || '')
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        tension.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domainLabels.includes(searchQuery.toLowerCase())

      const severityNum = severityFilter === 'all' ? null : parseInt(severityFilter)
      const matchesSeverity = severityFilter === 'all' || tension.severity === severityNum
      const matchesStatus = statusFilter === 'all' || tension.status === statusFilter

      return matchesSearch && matchesSeverity && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
      } else {
        const sevA = a.severity ?? 3
        const sevB = b.severity ?? 3
        return sortOrder === 'asc' ? sevA - sevB : sevB - sevA
      }
    })

  const activeTensions = filteredTensions.filter(
    (t) => t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS'
  )
  const resolvedTensions = filteredTensions.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'ARBITRATED' || t.status === 'DISMISSED'
  )

  const stats = {
    total: tensions.length,
    active: tensions.filter((t) => t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS').length,
    critical: tensions.filter((t) => t.severity === 5).length,
    resolved: tensions.filter(
      (t) => t.status === 'RESOLVED' || t.status === 'ARBITRATED' || t.status === 'DISMISSED'
    ).length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement des tensions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tensions éthiques</h1>
          <p className="text-muted-foreground">
            Gérez les dilemmes et conflits éthiques détectés
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-orange-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">Actives</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            <p className="text-sm text-muted-foreground">Critiques</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <p className="text-sm text-muted-foreground">Résolues</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une tension..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sévérité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les sévérités</SelectItem>
            <SelectItem value="5">Critique</SelectItem>
            <SelectItem value="4">Haute</SelectItem>
            <SelectItem value="3">Moyenne</SelectItem>
            <SelectItem value="2">Faible</SelectItem>
            <SelectItem value="1">Très faible</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="DETECTED">Détectée</SelectItem>
            <SelectItem value="QUALIFIED">Qualifiée</SelectItem>
            <SelectItem value="IN_PROGRESS">En cours</SelectItem>
            <SelectItem value="ARBITRATED">Arbitrée</SelectItem>
            <SelectItem value="RESOLVED">Résolue</SelectItem>
            <SelectItem value="DISMISSED">Écartée</SelectItem>
          </SelectContent>
        </Select>
        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(v) => {
          const [by, order] = v.split('-') as ['date' | 'severity', 'asc' | 'desc']
          setSortBy(by)
          setSortOrder(order)
        }}>
          <SelectTrigger className="w-[180px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Date (récent)</SelectItem>
            <SelectItem value="date-asc">Date (ancien)</SelectItem>
            <SelectItem value="severity-desc">Sévérité (critique d&apos;abord)</SelectItem>
            <SelectItem value="severity-asc">Sévérité (faible d&apos;abord)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tensions list */}
      {tensions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune tension détectée</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Les tensions sont automatiquement détectées lors de la cartographie des flux de
                données. Commencez par modéliser votre système.
              </p>
              <Button asChild>
                <Link href={`/${siaId}/map`}>Accéder à la cartographie</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active" className="gap-2">
              <Clock className="h-4 w-4" />
              Actives ({activeTensions.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Résolues ({resolvedTensions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="space-y-3">
              {activeTensions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Aucune tension active correspondant aux filtres
                  </CardContent>
                </Card>
              ) : (
                activeTensions.map((tension) => (
                  <TensionCard key={tension.id} tension={tension} siaId={siaId} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="resolved" className="mt-4">
            <div className="space-y-3">
              {resolvedTensions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Aucune tension résolue correspondant aux filtres
                  </CardContent>
                </Card>
              ) : (
                resolvedTensions.map((tension) => (
                  <TensionCard key={tension.id} tension={tension} siaId={siaId} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Next Step Prompt when all tensions are arbitrated */}
      {tensions.length > 0 && resolvedTensions.length === tensions.length && (
        <NextStepPrompt
          siaId={siaId}
          step="actions"
          title="Toutes les tensions ont été traitées"
          description="Excellent ! Vous avez arbitré toutes les tensions. Il est maintenant temps de créer un plan d'action pour mettre en oeuvre les mesures correctives."
          variant="success"
        />
      )}
    </div>
  )
}

function TensionCard({ tension, siaId }: { tension: Tension; siaId: string }) {
  const pattern = TENSION_PATTERNS[tension.pattern as keyof typeof TENSION_PATTERNS]
  const domains = tension.impactedDomains.map(d => DOMAINS[d as keyof typeof DOMAINS]).filter(Boolean)
  const primaryDomain = domains[0]
  const secondaryDomain = domains[1]
  const severityValue = tension.severity ?? 3

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`p-2 rounded-lg border ${severityColors[severityValue] || severityColors[3]}`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-medium">{pattern?.title || tension.description}</h3>
                <Badge className={severityColors[severityValue] || severityColors[3]}>
                  {severityLabels[severityValue] || 'Moyenne'}
                </Badge>
                <Badge className={statusColors[tension.status] || 'bg-gray-100 text-gray-800'}>
                  {statusLabels[tension.status] || tension.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {tension.description}
              </p>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  {primaryDomain && (
                    <span
                      className="flex items-center gap-1 px-2 py-1 rounded-md"
                      style={{ backgroundColor: `${primaryDomain?.color}15` }}
                    >
                      <span style={{ color: primaryDomain?.color }}>
                        {domainIcons[tension.impactedDomains[0]]}
                      </span>
                      <span className="text-xs font-medium">{primaryDomain?.label}</span>
                    </span>
                  )}
                  {secondaryDomain && (
                    <>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span
                        className="flex items-center gap-1 px-2 py-1 rounded-md"
                        style={{ backgroundColor: `${secondaryDomain?.color}15` }}
                      >
                        <span style={{ color: secondaryDomain?.color }}>
                          {domainIcons[tension.impactedDomains[1]]}
                        </span>
                        <span className="text-xs font-medium">{secondaryDomain?.label}</span>
                      </span>
                    </>
                  )}
                </div>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(tension.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {tension.arbitration && (
                  <span className="text-muted-foreground">
                    • Arbitrée
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${siaId}/tensions/${tension.id}`}>
              Détails
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
