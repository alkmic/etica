'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Map,
  Plus,
  TrendingUp,
  AlertCircle,
  LayoutGrid,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CriticalityMatrix } from '@/components/criticality-matrix'
import {
  ETHICAL_DOMAINS,
  CIRCLES,
  getDomainsByCircle,
  type EthicalDomain,
} from '@/lib/constants/ethical-domains'

interface Sia {
  id: string
  name: string
  description: string
  status: string
  decisionType: string
  scale: string
  dataTypes: string[]
  populations: string[]
  hasVulnerable: boolean
  vigilanceScores: {
    global: number
    domains: Record<string, number>
  }
  nodes: Array<{
    id: string
    type: string
    label: string
  }>
  edges: Array<{
    id: string
    sourceNode: { label: string }
    targetNode: { label: string }
    dataTypes: string[]
  }>
  // Legacy tensions for backward compatibility
  tensions: Array<{
    id: string
    patternId: string
    status: string
    severity: string
    primaryDomain: string
    secondaryDomain: string
    description: string
    arbitrations: Array<{
      id: string
      decision: string
      justification: string
    }>
  }>
  // New dilemmas
  dilemmas: Array<{
    id: string
    ruleId: string
    ruleName: string
    ruleFamily: string
    domainA: EthicalDomain
    domainB: EthicalDomain
    formulation: string
    severity: number
    maturity: number
    arbitration: {
      decision: string
    } | null
  }>
  actions: Array<{
    id: string
    title: string
    status: string
    priority: string
  }>
  createdAt: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-purple-100 text-purple-800',
}

const priorityLabels: Record<string, string> = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  CRITICAL: 'Critique',
}

export default function SiaDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const siaId = params.siaId as string

  const [sia, setSia] = useState<Sia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSia() {
      try {
        const response = await fetch(`/api/sia/${siaId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('SIA non trouvé')
          } else {
            setError('Erreur lors du chargement')
          }
          return
        }
        const data = await response.json()
        setSia(data)
      } catch {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      fetchSia()
    }
  }, [siaId])

  // Matrix data for CriticalityMatrix component
  const matrixData = useMemo(() => {
    if (!sia?.dilemmas) return []
    return sia.dilemmas.map((d) => ({
      id: d.id,
      severity: d.severity,
      maturity: d.maturity,
      name: d.formulation,
      ruleName: d.ruleName,
    }))
  }, [sia?.dilemmas])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement du SIA...</p>
        </div>
      </div>
    )
  }

  if (error || !sia) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-xl font-semibold">{error || 'SIA non trouvé'}</h2>
              <p className="text-muted-foreground">
                Le SIA demandé n&apos;existe pas ou vous n&apos;y avez pas accès.
              </p>
              <Button onClick={() => router.push('/')}>
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare radar chart data with 12 domains
  const radarData = Object.values(ETHICAL_DOMAINS).map((domain) => ({
    domain: domain.nameFr,
    shortName: domain.nameFr.split(' ')[0],
    score: sia.vigilanceScores?.domains?.[domain.id] || 0,
    fullMark: 5,
    color: CIRCLES[domain.circle].color,
  }))

  // Calculate stats
  const dilemmasCount = sia.dilemmas?.length || 0
  const pendingDilemmas = sia.dilemmas?.filter((d) => d.maturity < 3).length || 0
  const criticalDilemmas = sia.dilemmas?.filter((d) => d.severity >= 5 && d.maturity < 3).length || 0
  const _resolvedDilemmas = sia.dilemmas?.filter((d) => d.maturity >= 3).length || 0

  const completedActions = sia.actions.filter((a) => a.status === 'COMPLETED').length
  const actionProgress = sia.actions.length > 0
    ? Math.round((completedActions / sia.actions.length) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{sia.name}</h1>
            <Badge className={statusColors[sia.status]}>
              {sia.status === 'DRAFT' && 'Brouillon'}
              {sia.status === 'IN_PROGRESS' && 'En cours'}
              {sia.status === 'COMPLETED' && 'Terminé'}
              {sia.status === 'ARCHIVED' && 'Archivé'}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{sia.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${siaId}/map`}>
              <Map className="mr-2 h-4 w-4" />
              Cartographier
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${siaId}/dilemmas`}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Voir les dilemmes
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score global</p>
                <p className="text-3xl font-bold">
                  {sia.vigilanceScores?.global?.toFixed(1) || '0.0'}
                  <span className="text-lg text-muted-foreground">/5</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dilemmes à traiter</p>
                <p className="text-3xl font-bold text-orange-600">{pendingDilemmas}</p>
                {criticalDilemmas > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    dont {criticalDilemmas} critique(s)
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flux de données</p>
                <p className="text-3xl font-bold">{sia.edges.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actions complétées</p>
                <p className="text-3xl font-bold">{actionProgress}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={actionProgress} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Criticality Matrix */}
      {dilemmasCount > 0 && (
        <CriticalityMatrix
          dilemmas={matrixData}
          onCellClick={(severity, maturity, cellDilemmas) => {
            if (cellDilemmas.length === 1) {
              router.push(`/${siaId}/dilemmas/${cellDilemmas[0].id}`)
            } else if (cellDilemmas.length > 1) {
              router.push(`/${siaId}/dilemmas`)
            }
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart - 12 Domains */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profil de vigilance - 12 domaines</CardTitle>
            <CardDescription>
              Scores par domaine éthique organisés en 3 cercles (Personnes, Organisation, Société)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="shortName"
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 5]}
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                  />
                  <Radar
                    name="Vigilance"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white rounded-lg shadow-lg border p-3">
                            <p className="font-medium">{payload[0].payload.domain}</p>
                            <p className="text-sm text-muted-foreground">
                              Score: {payload[0].value}/5
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

        {/* Domain Breakdown by Circle */}
        <Card>
          <CardHeader>
            <CardTitle>Détail par cercle</CardTitle>
            <CardDescription>
              Les 12 domaines organisés en 3 cercles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.values(CIRCLES).map((circle) => {
              const domains = getDomainsByCircle(circle.id)
              const avgScore = domains.reduce((sum, d) => {
                return sum + (sia.vigilanceScores?.domains?.[d.id] || 0)
              }, 0) / domains.length

              return (
                <div key={circle.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: circle.color }}
                      />
                      <span className="text-sm font-medium">{circle.nameFr}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {avgScore.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="space-y-1 pl-5">
                    {domains.map((domain) => {
                      const Icon = domain.icon
                      const score = sia.vigilanceScores?.domains?.[domain.id] || 0
                      const percentage = (score / 5) * 100

                      return (
                        <div key={domain.id} className="flex items-center gap-2">
                          <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: circle.color }}
                          />
                          <span className="text-xs flex-1 truncate">{domain.nameFr}</span>
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: circle.color,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">
                            {score.toFixed(1)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Dilemmas and Actions */}
      <Tabs defaultValue="dilemmas" className="w-full">
        <TabsList>
          <TabsTrigger value="dilemmas" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Dilemmes ({dilemmasCount})
          </TabsTrigger>
          <TabsTrigger value="actions" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Actions ({sia.actions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dilemmas" className="mt-4">
          {dilemmasCount === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun dilemme détecté</h3>
                  <p className="text-muted-foreground mb-4">
                    Cartographiez les flux de données pour détecter automatiquement les dilemmes éthiques.
                  </p>
                  <Button asChild>
                    <Link href={`/${siaId}/map`}>
                      <Map className="mr-2 h-4 w-4" />
                      Commencer la cartographie
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sia.dilemmas.slice(0, 5).map((dilemma) => {
                const domainA = ETHICAL_DOMAINS[dilemma.domainA]
                const domainB = ETHICAL_DOMAINS[dilemma.domainB]
                const IconA = domainA?.icon
                const IconB = domainB?.icon

                return (
                  <Card key={dilemma.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                dilemma.severity >= 5 ? 'text-red-500' :
                                dilemma.severity >= 4 ? 'text-orange-500' :
                                dilemma.severity >= 3 ? 'text-yellow-500' :
                                'text-blue-500'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono text-xs">
                                {dilemma.ruleId}
                              </Badge>
                              <Badge
                                className={
                                  dilemma.severity >= 5 ? 'bg-red-100 text-red-800' :
                                  dilemma.severity >= 4 ? 'bg-orange-100 text-orange-800' :
                                  dilemma.severity >= 3 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }
                              >
                                S{dilemma.severity}
                              </Badge>
                              <Badge
                                className={
                                  dilemma.maturity >= 3 ? 'bg-green-100 text-green-800' :
                                  dilemma.maturity >= 2 ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }
                              >
                                M{dilemma.maturity}
                              </Badge>
                            </div>
                            <p className="text-sm line-clamp-1 mb-1">{dilemma.formulation}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {domainA && IconA && (
                                <span
                                  className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: `${CIRCLES[domainA.circle].color}15` }}
                                >
                                  <IconA className="h-3.5 w-3.5" style={{ color: CIRCLES[domainA.circle].color }} />
                                  <span className="text-xs">{domainA.nameFr}</span>
                                </span>
                              )}
                              <span>↔</span>
                              {domainB && IconB && (
                                <span
                                  className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: `${CIRCLES[domainB.circle].color}15` }}
                                >
                                  <IconB className="h-3.5 w-3.5" style={{ color: CIRCLES[domainB.circle].color }} />
                                  <span className="text-xs">{domainB.nameFr}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/${siaId}/dilemmas/${dilemma.id}`}>
                            {dilemma.maturity < 3 ? 'Arbitrer' : 'Détails'}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              {dilemmasCount > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" asChild>
                    <Link href={`/${siaId}/dilemmas`}>
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      Voir tous les dilemmes ({dilemmasCount})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          {sia.actions.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune action planifiée</h3>
                  <p className="text-muted-foreground mb-4">
                    Les actions sont créées pour résoudre les dilemmes détectés.
                  </p>
                  <Button asChild>
                    <Link href={`/${siaId}/actions`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Créer une action
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sia.actions.slice(0, 5).map((action) => (
                <Card key={action.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {action.status === 'COMPLETED' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : action.status === 'IN_PROGRESS' ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                        )}
                        <div>
                          <h4 className="font-medium">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Priorité: {priorityLabels[action.priority]}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${siaId}/actions`}>
                          Voir
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {sia.actions.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" asChild>
                    <Link href={`/${siaId}/actions`}>
                      Voir toutes les actions ({sia.actions.length})
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
