'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
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
  TrendingUp,
  TrendingDown,
  Minus,
  Layers,
  User,
  Network,
  Globe,
  Gavel,
  XCircle,
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DOMAINS } from '@/lib/constants/domains'

interface Tension {
  id: string
  pattern: string
  patternTitle: string
  patternDescription: string
  status: string
  level: string
  description: string
  impactedDomains: string[]
  baseSeverity: number
  calculatedSeverity: number | null
  activeAmplifiers: string[]
  activeMitigators: string[]
  detectionReason: string | null
  createdAt: string
  poles: [string, string]
  arbitration: {
    id: string
    decisionType: string
    justification: string
    arbitratedAt: string
  } | null
  tensionEdges: Array<{
    edge: {
      id: string
      source: { label: string }
      target: { label: string }
    }
  }>
  actions: Array<{
    id: string
    title: string
    status: string
    priority: string
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

const levelIcons: Record<string, React.ReactNode> = {
  INDIVIDUAL: <User className="h-4 w-4" />,
  RELATIONAL: <Network className="h-4 w-4" />,
  SYSTEMIC: <Globe className="h-4 w-4" />,
}

const levelLabels: Record<string, string> = {
  INDIVIDUAL: 'Individuel',
  RELATIONAL: 'Relationnel',
  SYSTEMIC: 'Systémique',
}

const levelColors: Record<string, string> = {
  INDIVIDUAL: 'bg-blue-100 text-blue-800',
  RELATIONAL: 'bg-purple-100 text-purple-800',
  SYSTEMIC: 'bg-red-100 text-red-800',
}

const statusColors: Record<string, string> = {
  DETECTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  ARBITRATED: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<string, string> = {
  DETECTED: 'Détectée',
  QUALIFIED: 'Qualifiée',
  IN_PROGRESS: 'En cours',
  ARBITRATED: 'Arbitrée',
  RESOLVED: 'Résolue',
  DISMISSED: 'Écartée',
}

const statusIcons: Record<string, React.ReactNode> = {
  DETECTED: <AlertTriangle className="h-3.5 w-3.5" />,
  QUALIFIED: <ClipboardCheck className="h-3.5 w-3.5" />,
  IN_PROGRESS: <Clock className="h-3.5 w-3.5" />,
  ARBITRATED: <Gavel className="h-3.5 w-3.5" />,
  RESOLVED: <CheckCircle2 className="h-3.5 w-3.5" />,
  DISMISSED: <XCircle className="h-3.5 w-3.5" />,
}

function getSeverityInfo(severity: number | null) {
  const s = severity || 3
  if (s >= 5) return { label: 'Critique', color: 'bg-red-100 text-red-800 border-red-200', textColor: 'text-red-600' }
  if (s >= 4) return { label: 'Haute', color: 'bg-orange-100 text-orange-800 border-orange-200', textColor: 'text-orange-600' }
  if (s >= 3) return { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', textColor: 'text-yellow-600' }
  if (s >= 2) return { label: 'Basse', color: 'bg-blue-100 text-blue-800 border-blue-200', textColor: 'text-blue-600' }
  return { label: 'Minimale', color: 'bg-gray-100 text-gray-800 border-gray-200', textColor: 'text-gray-600' }
}

export default function TensionsPage() {
  const params = useParams()
  const siaId = params.siaId as string

  const [tensions, setTensions] = useState<Tension[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')

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

  const filteredTensions = tensions.filter((tension) => {
    const matchesSearch =
      tension.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tension.patternTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tension.impactedDomains.some((d) =>
        DOMAINS[d as keyof typeof DOMAINS]?.label
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )

    const severity = tension.calculatedSeverity || tension.baseSeverity
    const matchesSeverity =
      severityFilter === 'all' ||
      (severityFilter === 'CRITICAL' && severity >= 5) ||
      (severityFilter === 'HIGH' && severity === 4) ||
      (severityFilter === 'MEDIUM' && severity === 3) ||
      (severityFilter === 'LOW' && severity <= 2)

    const matchesStatus = statusFilter === 'all' || tension.status === statusFilter
    const matchesLevel = levelFilter === 'all' || tension.level === levelFilter

    return matchesSearch && matchesSeverity && matchesStatus && matchesLevel
  })

  const pendingTensions = filteredTensions.filter(
    (t) => t.status === 'DETECTED' || t.status === 'QUALIFIED'
  )
  const inProgressTensions = filteredTensions.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'ARBITRATED'
  )
  const resolvedTensions = filteredTensions.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'DISMISSED'
  )

  const stats = {
    total: tensions.length,
    pending: tensions.filter((t) => t.status === 'DETECTED' || t.status === 'QUALIFIED').length,
    critical: tensions.filter((t) => (t.calculatedSeverity || t.baseSeverity) >= 5).length,
    resolved: tensions.filter((t) => t.status === 'RESOLVED' || t.status === 'DISMISSED').length,
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
            Gérez les dilemmes et conflits éthiques détectés automatiquement
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total détectées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">En attente</p>
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
            <p className="text-sm text-muted-foreground">Traitées</p>
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
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sévérité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="CRITICAL">Critique (5)</SelectItem>
            <SelectItem value="HIGH">Haute (4)</SelectItem>
            <SelectItem value="MEDIUM">Moyenne (3)</SelectItem>
            <SelectItem value="LOW">Basse (1-2)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="INDIVIDUAL">Individuel</SelectItem>
            <SelectItem value="RELATIONAL">Relationnel</SelectItem>
            <SelectItem value="SYSTEMIC">Systémique</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
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
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              En attente ({pendingTensions.length})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="gap-2">
              <Clock className="h-4 w-4" />
              En cours ({inProgressTensions.length})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Traitées ({resolvedTensions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <div className="space-y-3">
              {pendingTensions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Aucune tension en attente
                  </CardContent>
                </Card>
              ) : (
                pendingTensions.map((tension) => (
                  <TensionCard key={tension.id} tension={tension} siaId={siaId} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="in_progress" className="mt-4">
            <div className="space-y-3">
              {inProgressTensions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Aucune tension en cours de traitement
                  </CardContent>
                </Card>
              ) : (
                inProgressTensions.map((tension) => (
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
                    Aucune tension traitée
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
    </div>
  )
}

function TensionCard({ tension, siaId }: { tension: Tension; siaId: string }) {
  const severity = tension.calculatedSeverity || tension.baseSeverity
  const severityInfo = getSeverityInfo(severity)
  const severityDelta = tension.calculatedSeverity
    ? tension.calculatedSeverity - tension.baseSeverity
    : 0

  return (
    <TooltipProvider>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Severity indicator */}
              <div
                className={`p-2 rounded-lg border ${severityInfo.color} flex flex-col items-center min-w-[52px]`}
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-xs font-bold mt-1">{severity}/5</span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Title and badges */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-medium">{tension.patternTitle}</h3>
                  <Badge className={severityInfo.color}>{severityInfo.label}</Badge>
                  <Badge className={statusColors[tension.status]} variant="outline">
                    {statusIcons[tension.status]}
                    <span className="ml-1">{statusLabels[tension.status]}</span>
                  </Badge>
                  <Badge className={levelColors[tension.level]} variant="outline">
                    {levelIcons[tension.level]}
                    <span className="ml-1">{levelLabels[tension.level]}</span>
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {tension.detectionReason || tension.description}
                </p>

                {/* Domains and modifiers */}
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  {/* Impacted domains */}
                  <div className="flex items-center gap-1">
                    {tension.impactedDomains.slice(0, 3).map((domainId) => {
                      const domain = DOMAINS[domainId as keyof typeof DOMAINS]
                      if (!domain) return null
                      return (
                        <Tooltip key={domainId}>
                          <TooltipTrigger>
                            <span
                              className="flex items-center gap-1 px-2 py-1 rounded-md"
                              style={{ backgroundColor: `${domain.color}15` }}
                            >
                              <span style={{ color: domain.color }}>
                                {domainIcons[domainId]}
                              </span>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{domain.label}</TooltipContent>
                        </Tooltip>
                      )
                    })}
                    {tension.impactedDomains.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{tension.impactedDomains.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Severity modifiers */}
                  {severityDelta !== 0 && (
                    <Tooltip>
                      <TooltipTrigger>
                        <span
                          className={`flex items-center gap-1 text-xs ${
                            severityDelta > 0 ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {severityDelta > 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {severityDelta > 0 ? '+' : ''}
                          {severityDelta}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-medium mb-1">Modificateurs actifs :</p>
                          {tension.activeAmplifiers.length > 0 && (
                            <p className="text-red-400">
                              + {tension.activeAmplifiers.length} amplificateur(s)
                            </p>
                          )}
                          {tension.activeMitigators.length > 0 && (
                            <p className="text-green-400">
                              - {tension.activeMitigators.length} mitigateur(s)
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Actions count */}
                  {tension.actions.length > 0 && (
                    <span className="text-muted-foreground text-xs">
                      {tension.actions.length} action(s)
                    </span>
                  )}

                  {/* Arbitration indicator */}
                  {tension.arbitration && (
                    <Badge variant="outline" className="text-xs">
                      <Gavel className="h-3 w-3 mr-1" />
                      {tension.arbitration.decisionType === 'MITIGATE' && 'Mitigation'}
                      {tension.arbitration.decisionType === 'ACCEPT_RISK' && 'Risque accepté'}
                      {tension.arbitration.decisionType === 'REJECT' && 'Rejeté'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/${siaId}/tensions/${tension.id}`}>
                {tension.arbitration ? 'Détails' : 'Arbitrer'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
