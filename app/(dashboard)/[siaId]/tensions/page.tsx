'use client'

import { useEffect, useState, useMemo } from 'react'
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
  Filter,
  ChevronRight,
  Target,
  LayoutGrid,
  List,
  Info,
  Sparkles,
  XCircle,
  MapPin,
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

const severityConfig: Record<number, { bg: string; border: string; text: string; label: string; badgeBg: string }> = {
  1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Très faible', badgeBg: 'bg-blue-100' },
  2: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Faible', badgeBg: 'bg-green-100' },
  3: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Moyenne', badgeBg: 'bg-yellow-100' },
  4: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'Haute', badgeBg: 'bg-orange-100' },
  5: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Critique', badgeBg: 'bg-red-100' },
}

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: React.ElementType }> = {
  DETECTED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Détectée', icon: AlertTriangle },
  QUALIFIED: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Qualifiée', icon: Target },
  IN_PROGRESS: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'En cours', icon: Clock },
  ARBITRATED: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Arbitrée', icon: Scale },
  RESOLVED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Résolue', icon: CheckCircle2 },
  DISMISSED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Écartée', icon: XCircle },
}

export default function TensionsPage() {
  const params = useParams()
  const siaId = params.siaId as string

  const [tensions, setTensions] = useState<Tension[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'severity'>('severity')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'list' | 'priority'>('list')

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

  const filteredTensions = useMemo(() => {
    return tensions
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
  }, [tensions, searchQuery, severityFilter, statusFilter, sortBy, sortOrder])

  const activeTensions = useMemo(() =>
    filteredTensions.filter(t => t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS'),
    [filteredTensions]
  )

  const resolvedTensions = useMemo(() =>
    filteredTensions.filter(t => t.status === 'RESOLVED' || t.status === 'ARBITRATED' || t.status === 'DISMISSED'),
    [filteredTensions]
  )

  const stats = useMemo(() => ({
    total: tensions.length,
    active: tensions.filter(t => t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS').length,
    critical: tensions.filter(t => t.severity === 5 || t.severity === 4).length,
    arbitrated: tensions.filter(t => t.arbitration !== null).length,
    resolved: tensions.filter(t => t.status === 'RESOLVED' || t.status === 'ARBITRATED' || t.status === 'DISMISSED').length,
  }), [tensions])

  // Priority matrix grouping
  const priorityMatrix = useMemo(() => {
    const matrix = {
      critical: activeTensions.filter(t => t.severity === 5 || t.severity === 4),
      high: activeTensions.filter(t => t.severity === 3),
      low: activeTensions.filter(t => t.severity === 2 || t.severity === 1 || t.severity === null),
    }
    return matrix
  }, [activeTensions])

  const hasActiveFilters = searchQuery || severityFilter !== 'all' || statusFilter !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setSeverityFilter('all')
    setStatusFilter('all')
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tensions éthiques</h1>
          <p className="text-muted-foreground">
            Identifiez, analysez et arbitrez les dilemmes éthiques de votre système
          </p>
        </div>
        {tensions.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              Liste
            </Button>
            <Button
              variant={viewMode === 'priority' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('priority')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Priorités
            </Button>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {tensions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Actives</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.active}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prioritaires</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Target className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Arbitrées</p>
                  <p className="text-2xl font-bold text-green-600">{stats.arbitrated}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Priority Alert Banner */}
      {stats.critical > 0 && stats.active > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-red-900">
              {stats.critical} tension{stats.critical > 1 ? 's' : ''} prioritaire{stats.critical > 1 ? 's' : ''} requièr{stats.critical > 1 ? 'ent' : 't'} votre attention
            </p>
            <p className="text-sm text-red-700">
              Ces tensions de sévérité haute ou critique doivent être arbitrées en priorité.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setSeverityFilter('4')
              setStatusFilter('all')
            }}
          >
            Voir les priorités
          </Button>
        </div>
      )}

      {/* Filters */}
      {tensions.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une tension..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Sévérité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="5">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Critique
                      </span>
                    </SelectItem>
                    <SelectItem value="4">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        Haute
                      </span>
                    </SelectItem>
                    <SelectItem value="3">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        Moyenne
                      </span>
                    </SelectItem>
                    <SelectItem value="2">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Faible
                      </span>
                    </SelectItem>
                    <SelectItem value="1">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Très faible
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
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
                    <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="severity-desc">Sévérité (critique d&apos;abord)</SelectItem>
                    <SelectItem value="severity-asc">Sévérité (faible d&apos;abord)</SelectItem>
                    <SelectItem value="date-desc">Date (récent)</SelectItem>
                    <SelectItem value="date-asc">Date (ancien)</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {tensions.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-16">
            <div className="text-center max-w-md mx-auto">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucune tension détectée</h3>
              <p className="text-muted-foreground mb-6">
                Les tensions éthiques sont automatiquement détectées lors de la cartographie des flux de données.
                Commencez par modéliser votre système pour identifier les dilemmes éthiques potentiels.
              </p>
              <Button asChild>
                <Link href={`/${siaId}/map`}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Accéder à la cartographie
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Priority Matrix View */}
      {tensions.length > 0 && viewMode === 'priority' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Critical */}
          <Card className="border-red-200 bg-red-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-red-700">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                </div>
                Prioritaires ({priorityMatrix.critical.length})
              </CardTitle>
              <CardDescription>
                Sévérité haute ou critique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityMatrix.critical.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune tension prioritaire
                </p>
              ) : (
                priorityMatrix.critical.map((tension) => (
                  <TensionMiniCard key={tension.id} tension={tension} siaId={siaId} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Medium */}
          <Card className="border-yellow-200 bg-yellow-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-yellow-700">
                <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 text-yellow-600" />
                </div>
                À traiter ({priorityMatrix.high.length})
              </CardTitle>
              <CardDescription>
                Sévérité moyenne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityMatrix.high.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune tension à traiter
                </p>
              ) : (
                priorityMatrix.high.map((tension) => (
                  <TensionMiniCard key={tension.id} tension={tension} siaId={siaId} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Low */}
          <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-green-700">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Info className="h-3.5 w-3.5 text-green-600" />
                </div>
                À surveiller ({priorityMatrix.low.length})
              </CardTitle>
              <CardDescription>
                Sévérité faible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {priorityMatrix.low.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune tension à surveiller
                </p>
              ) : (
                priorityMatrix.low.map((tension) => (
                  <TensionMiniCard key={tension.id} tension={tension} siaId={siaId} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* List View */}
      {tensions.length > 0 && viewMode === 'list' && (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="gap-2">
              <Clock className="h-4 w-4" />
              Actives ({activeTensions.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Traitées ({resolvedTensions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="space-y-3">
              {activeTensions.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">Toutes les tensions sont traitées</h3>
                    <p className="text-muted-foreground">
                      {hasActiveFilters
                        ? 'Aucune tension active correspondant aux filtres'
                        : 'Excellent ! Aucune tension active ne nécessite votre attention.'}
                    </p>
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
                    Aucune tension traitée pour le moment
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

      {/* Next Step Prompt */}
      {tensions.length > 0 && stats.active === 0 && stats.resolved === tensions.length && (
        <NextStepPrompt
          siaId={siaId}
          step="actions"
          title="Toutes les tensions ont été traitées"
          description="Excellent travail ! Vous avez arbitré toutes les tensions. Il est maintenant temps de mettre en œuvre les mesures correctives dans votre plan d'action."
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
  const severity = severityConfig[severityValue] || severityConfig[3]
  const status = statusConfig[tension.status] || statusConfig.DETECTED
  const StatusIcon = status.icon

  return (
    <Card className={`hover:shadow-md transition-all border-l-4 ${severity.border}`}>
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-2.5 rounded-lg ${severity.bg} shrink-0`}>
              <AlertTriangle className={`h-5 w-5 ${severity.text}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className="font-semibold">{pattern?.title || tension.description}</h3>
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className={`${severity.badgeBg} ${severity.text} border-0`}>
                  {severity.label}
                </Badge>
                <Badge className={`${status.bg} ${status.text} border-0`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
                {tension.arbitration && (
                  <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                    <Scale className="h-3 w-3 mr-1" />
                    Arbitrée
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {tension.description}
              </p>

              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  {primaryDomain && (
                    <span
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md"
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
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md"
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
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href={`/${siaId}/tensions/${tension.id}`}>
              Analyser
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TensionMiniCard({ tension, siaId }: { tension: Tension; siaId: string }) {
  const pattern = TENSION_PATTERNS[tension.pattern as keyof typeof TENSION_PATTERNS]
  const severityValue = tension.severity ?? 3
  const severity = severityConfig[severityValue] || severityConfig[3]

  return (
    <Link
      href={`/${siaId}/tensions/${tension.id}`}
      className="block p-3 rounded-lg border bg-white hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`p-1.5 rounded ${severity.bg}`}>
          <AlertTriangle className={`h-4 w-4 ${severity.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{pattern?.shortTitle || pattern?.title || 'Tension'}</p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{tension.description}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  )
}
