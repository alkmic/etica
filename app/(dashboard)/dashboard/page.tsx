'use client'

import { useEffect, useState, useMemo } from 'react'
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
  Activity,
  Target,
  Shield,
  Users,
  Building2,
  Globe,
  Flame,
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertBanner, AlertBannerList } from '@/components/ui/alert-banner'
import { TooltipMetric, InfoTooltip } from '@/components/ui/tooltip-metric'
import { ViewToggle, useViewMode, type ViewMode } from '@/components/ui/view-toggle'
import { METRIC_DEFINITIONS } from '@/lib/constants/metric-definitions'
import { getVigilanceLabel } from '@/lib/utils'
import { SIA_DOMAINS, SIA_STATUSES } from '@/lib/constants'
import { DOMAINS, CIRCLE_NAMES, CIRCLE_COLORS } from '@/lib/constants/domains'

interface Sia {
  id: string
  name: string
  sector: string
  status: string
  description: string
  updatedAt: string
  vigilanceScores: {
    global: number
    domains: Record<string, number>
  } | null
  _count: {
    tensions: number
    actions: number
    nodes: number
    edges: number
  }
  tensions: Array<{ status: string; severity?: number; impactedDomains?: string[] }>
  actions: Array<{ status: string; priority?: string }>
}

// Circle indicator component
function CircleIndicator({
  circle,
  score,
  tensionCount,
}: {
  circle: 1 | 2 | 3
  score: number
  tensionCount: number
}) {
  const circleIcons = {
    1: <Users className="h-5 w-5" />,
    2: <Building2 className="h-5 w-5" />,
    3: <Globe className="h-5 w-5" />,
  }

  const circleDescriptions = {
    1: 'Droits des personnes',
    2: 'Maîtrise organisationnelle',
    3: 'Impact sociétal',
  }

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border"
      style={{ borderColor: `${CIRCLE_COLORS[circle]}40` }}
    >
      <div
        className="flex items-center justify-center h-10 w-10 rounded-full"
        style={{ backgroundColor: `${CIRCLE_COLORS[circle]}20`, color: CIRCLE_COLORS[circle] }}
      >
        {circleIcons[circle]}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium">{CIRCLE_NAMES[circle]}</span>
          <Badge variant={tensionCount > 0 ? 'secondary' : 'outline'}>
            {tensionCount} tension{tensionCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{circleDescriptions[circle]}</p>
        <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(score / 5) * 100}%`,
              backgroundColor: CIRCLE_COLORS[circle],
            }}
          />
        </div>
      </div>
    </div>
  )
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
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useViewMode('grid', 'dashboard-view-mode')
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchSias() {
      try {
        const response = await fetch('/api/sia')
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('API Error:', response.status, errorData)
          throw new Error(errorData.details || errorData.error || `Erreur ${response.status}`)
        }
        const data = await response.json()
        setSias(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur inconnue'
        setError(`Impossible de charger les systèmes: ${message}`)
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSias()
  }, [])

  // Filter SIAs based on search
  const filteredSias = useMemo(() => {
    if (!searchQuery) return sias
    const query = searchQuery.toLowerCase()
    return sias.filter(
      sia =>
        sia.name.toLowerCase().includes(query) ||
        sia.description?.toLowerCase().includes(query) ||
        sia.sector.toLowerCase().includes(query)
    )
  }, [sias, searchQuery])

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    const openTensions = sias.reduce((acc, sia) => {
      const open = sia.tensions?.filter(t =>
        t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS'
      ).length || 0
      return acc + open
    }, 0)
    const criticalTensions = sias.reduce((acc, sia) => {
      const critical = sia.tensions?.filter(t =>
        (t.severity || 3) >= 4 && (t.status === 'DETECTED' || t.status === 'QUALIFIED')
      ).length || 0
      return acc + critical
    }, 0)

    const totalActions = sias.reduce((acc, sia) => acc + (sia._count?.actions || sia.actions?.length || 0), 0)
    const completedActions = sias.reduce((acc, sia) => {
      const completed = sia.actions?.filter(a => a.status === 'DONE').length || 0
      return acc + completed
    }, 0)
    const inProgressActions = sias.reduce((acc, sia) => {
      const inProgress = sia.actions?.filter(a => a.status === 'IN_PROGRESS').length || 0
      return acc + inProgress
    }, 0)

    // Aggregate domain scores
    const domainScores: Record<string, number> = {}
    const domainTensions: Record<string, number> = {}

    Object.keys(DOMAINS).forEach(domain => {
      domainScores[domain] = 0
      domainTensions[domain] = 0
    })

    sias.forEach(sia => {
      if (sia.vigilanceScores?.domains) {
        Object.entries(sia.vigilanceScores.domains).forEach(([domain, score]) => {
          if (domain in domainScores) {
            domainScores[domain] += score
          }
        })
      }
      sia.tensions?.forEach(t => {
        t.impactedDomains?.forEach(domain => {
          if (domain in domainTensions) {
            domainTensions[domain]++
          }
        })
      })
    })

    // Average domain scores
    if (sias.length > 0) {
      Object.keys(domainScores).forEach(domain => {
        domainScores[domain] /= sias.length
      })
    }

    // Circle scores
    const circleScores = { 1: 0, 2: 0, 3: 0 }
    const circleTensions = { 1: 0, 2: 0, 3: 0 }

    Object.entries(DOMAINS).forEach(([key, domain]) => {
      const circle = domain.circle as 1 | 2 | 3
      circleScores[circle] += domainScores[key] || 0
      circleTensions[circle] += domainTensions[key] || 0
    })

    // Average circle scores
    circleScores[1] /= 6 // 6 domains in circle 1
    circleScores[2] /= 3 // 3 domains in circle 2
    circleScores[3] /= 3 // 3 domains in circle 3

    return {
      totalSias: sias.length,
      openTensions,
      criticalTensions,
      totalActions,
      completedActions,
      inProgressActions,
      domainScores,
      domainTensions,
      circleScores,
      circleTensions,
      actionProgress: totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0,
    }
  }, [sias])

  // Radar chart data
  const radarData = useMemo(() => {
    return Object.entries(DOMAINS).map(([key, domain]) => ({
      domain: domain.label,
      score: stats.domainScores[key] || 0,
      fullMark: 5,
    }))
  }, [stats.domainScores])

  // Pie chart data for tension status
  const tensionStatusData = useMemo(() => {
    const detected = sias.reduce((acc, sia) =>
      acc + (sia.tensions?.filter(t => t.status === 'DETECTED').length || 0), 0)
    const arbitrated = sias.reduce((acc, sia) =>
      acc + (sia.tensions?.filter(t => t.status === 'ARBITRATED' || t.status === 'RESOLVED').length || 0), 0)
    const dismissed = sias.reduce((acc, sia) =>
      acc + (sia.tensions?.filter(t => t.status === 'DISMISSED').length || 0), 0)
    const inProgress = sias.reduce((acc, sia) =>
      acc + (sia.tensions?.filter(t => t.status === 'IN_PROGRESS' || t.status === 'QUALIFIED').length || 0), 0)

    return [
      { name: 'Détectées', value: detected, color: '#f59e0b' },
      { name: 'En cours', value: inProgress, color: '#3b82f6' },
      { name: 'Arbitrées', value: arbitrated, color: '#22c55e' },
      { name: 'Rejetées', value: dismissed, color: '#6b7280' },
    ].filter(d => d.value > 0)
  }, [sias])

  // Generate alerts based on stats
  const alerts = useMemo(() => {
    const alertList: Array<{
      id: string
      variant: 'critical' | 'warning' | 'info' | 'success'
      title: string
      description: string
      count?: number
      href?: string
    }> = []

    // Critical tensions alert
    if (stats.criticalTensions > 0) {
      alertList.push({
        id: 'critical-tensions',
        variant: 'critical',
        title: 'Tensions critiques nécessitant une attention immédiate',
        description: `${stats.criticalTensions} tension${stats.criticalTensions > 1 ? 's' : ''} avec une sévérité élevée nécessite${stats.criticalTensions > 1 ? 'nt' : ''} un arbitrage urgent.`,
        count: stats.criticalTensions,
      })
    }

    // Many open tensions warning
    if (stats.openTensions > 10) {
      alertList.push({
        id: 'many-tensions',
        variant: 'warning',
        title: 'Nombreuses tensions en attente',
        description: `${stats.openTensions} tensions sont en attente de traitement. Priorisez les plus critiques.`,
        count: stats.openTensions,
      })
    }

    // Low action progress warning
    if (stats.totalActions > 5 && stats.actionProgress < 30) {
      alertList.push({
        id: 'low-progress',
        variant: 'warning',
        title: 'Progression des actions insuffisante',
        description: `Seulement ${stats.actionProgress}% des actions sont complétées. Accélérez la mise en œuvre.`,
      })
    }

    // Good progress info
    if (stats.actionProgress >= 80 && stats.totalActions > 0) {
      alertList.push({
        id: 'good-progress',
        variant: 'success',
        title: 'Excellente progression',
        description: `${stats.actionProgress}% des actions sont complétées. Continuez ainsi !`,
      })
    }

    return alertList.filter(alert => !dismissedAlerts.has(alert.id))
  }, [stats, dismissedAlerts])

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => {
      const newSet = new Set(prev)
      newSet.add(alertId)
      return newSet
    })
  }

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
            Vue d&apos;ensemble de l&apos;éthique de vos systèmes
          </p>
        </div>
        <Button asChild>
          <Link href="/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau SIA
          </Link>
        </Button>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertBanner
              key={alert.id}
              variant={alert.variant}
              title={alert.title}
              description={alert.description}
              count={alert.count}
              dismissible
              onDismiss={() => handleDismissAlert(alert.id)}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Systèmes actifs</p>
                  <InfoTooltip
                    content="Nombre total de systèmes d'IA enregistrés et suivis dans votre portefeuille."
                  />
                </div>
                <p className="text-2xl font-bold">{stats.totalSias}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.criticalTensions > 0 ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                stats.criticalTensions > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
              }`}>
                {stats.criticalTensions > 0 ? (
                  <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Tensions à traiter</p>
                  <InfoTooltip
                    content={
                      <div className="space-y-1">
                        <p>{METRIC_DEFINITIONS.tensionCount.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Les tensions critiques (sévérité 4-5) nécessitent une action immédiate.
                        </p>
                      </div>
                    }
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{stats.openTensions}</p>
                  {stats.criticalTensions > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.criticalTensions} critiques
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Actions en cours</p>
                  <InfoTooltip
                    content="Actions correctives actuellement en cours de mise en œuvre pour traiter les tensions éthiques."
                  />
                </div>
                <p className="text-2xl font-bold">{stats.inProgressActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-sm text-muted-foreground">Progression globale</p>
                  <InfoTooltip
                    content={
                      <div className="space-y-1">
                        <p>{METRIC_DEFINITIONS.progressRate.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {METRIC_DEFINITIONS.progressRate.calculation}
                        </p>
                      </div>
                    }
                  />
                </div>
                <p className="text-2xl font-bold">{stats.actionProgress}%</p>
              </div>
            </div>
            <Progress value={stats.actionProgress} className="mt-3 h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      {stats.totalSias > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Radar Chart - Ethical Profile */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Profil éthique global
              </CardTitle>
              <CardDescription>
                Score moyen par domaine éthique sur l&apos;ensemble de vos systèmes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="domain"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 5]}
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3">
                              <p className="font-medium">{payload[0].payload.domain}</p>
                              <p className="text-sm text-muted-foreground">
                                Score: {(payload[0].value as number).toFixed(1)}/5
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Circle Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Par cercle éthique</CardTitle>
              <CardDescription>
                Les 3 cercles de vigilance ETICA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CircleIndicator
                circle={1}
                score={stats.circleScores[1]}
                tensionCount={stats.circleTensions[1]}
              />
              <CircleIndicator
                circle={2}
                score={stats.circleScores[2]}
                tensionCount={stats.circleTensions[2]}
              />
              <CircleIndicator
                circle={3}
                score={stats.circleScores[3]}
                tensionCount={stats.circleTensions[3]}
              />

              {/* Tension Status Pie Chart */}
              {tensionStatusData.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-2">Répartition des tensions</p>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={tensionStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                        >
                          {tensionStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tensionStatusData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-1 text-xs">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un système..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        <ViewToggle
          value={viewMode}
          onChange={(mode) => setViewMode(mode)}
          options={[
            { id: 'grid', label: 'Grille', icon: LayoutGrid, description: 'Afficher en cartes' },
            { id: 'list', label: 'Liste', icon: List, description: 'Afficher en liste' },
          ]}
          showTooltips
        />
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
      ) : filteredSias.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
          {filteredSias.map((sia) => (
            <SiaCard key={sia.id} sia={sia} />
          ))}
        </div>
      ) : sias.length > 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Aucun résultat</h3>
            <p className="mt-2 text-muted-foreground">
              Aucun système ne correspond à votre recherche.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-4">
              Effacer la recherche
            </Button>
          </div>
        </Card>
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
