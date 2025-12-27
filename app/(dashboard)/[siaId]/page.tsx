'use client'

import { useEffect, useState } from 'react'
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
  Lock,
  Scale,
  Eye,
  Users,
  Shield,
  MessageSquare,
  Leaf,
  ClipboardCheck,
  Map,
  Plus,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DOMAINS } from '@/lib/constants/domains'

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
  actions: Array<{
    id: string
    title: string
    status: string
    priority: string
  }>
  createdAt: string
  updatedAt: string
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

const severityColors: Record<string, string> = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
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
      } catch (err) {
        setError('Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      fetchSia()
    }
  }, [siaId])

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

  // Prepare radar chart data
  const radarData = Object.entries(DOMAINS).map(([key, domain]) => ({
    domain: domain.label,
    score: sia.vigilanceScores?.domains?.[key] || 0,
    fullMark: 5,
  }))

  // Calculate stats
  const activeTensions = sia.tensions.filter(t => t.status === 'ACTIVE' || t.status === 'OPEN').length
  const resolvedTensions = sia.tensions.filter(t => t.status === 'RESOLVED' || t.status === 'ACCEPTED').length
  const completedActions = sia.actions.filter(a => a.status === 'COMPLETED').length
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
            <Link href={`/${siaId}/tensions`}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Voir les tensions
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
                <p className="text-sm text-muted-foreground">Tensions actives</p>
                <p className="text-3xl font-bold">{activeTensions}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profil de vigilance</CardTitle>
            <CardDescription>
              Scores par domaine éthique (1-5, 5 étant le plus vigilant)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="domain"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
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

        {/* Domain Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Détail par domaine</CardTitle>
            <CardDescription>
              Cliquez sur un domaine pour voir les détails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(DOMAINS).map(([key, domain]) => {
                const score = sia.vigilanceScores?.domains?.[key] || 0
                const percentage = (score / 5) * 100
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${domain.color}20` }}
                    >
                      <span style={{ color: domain.color }}>
                        {domainIcons[key]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">
                          {domain.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {score.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: domain.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Tensions and Actions */}
      <Tabs defaultValue="tensions" className="w-full">
        <TabsList>
          <TabsTrigger value="tensions" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Tensions ({sia.tensions.length})
          </TabsTrigger>
          <TabsTrigger value="actions" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Actions ({sia.actions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tensions" className="mt-4">
          {sia.tensions.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune tension détectée</h3>
                  <p className="text-muted-foreground mb-4">
                    Cartographiez les flux de données pour détecter automatiquement les tensions éthiques.
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
              {sia.tensions.slice(0, 5).map((tension) => (
                <Card key={tension.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              tension.severity === 'CRITICAL' ? 'text-red-500' :
                              tension.severity === 'HIGH' ? 'text-orange-500' :
                              tension.severity === 'MEDIUM' ? 'text-yellow-500' :
                              'text-blue-500'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{tension.description}</h4>
                            <Badge className={severityColors[tension.severity]}>
                              {priorityLabels[tension.severity]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {domainIcons[tension.primaryDomain]}
                              {DOMAINS[tension.primaryDomain as keyof typeof DOMAINS]?.label}
                            </span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="flex items-center gap-1">
                              {domainIcons[tension.secondaryDomain]}
                              {DOMAINS[tension.secondaryDomain as keyof typeof DOMAINS]?.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/${siaId}/tensions/${tension.id}`}>
                          Détails
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {sia.tensions.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="outline" asChild>
                    <Link href={`/${siaId}/tensions`}>
                      Voir toutes les tensions ({sia.tensions.length})
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
                    Les actions sont créées pour résoudre les tensions détectées.
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
