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
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DOMAINS } from '@/lib/constants/domains'
import { WorkflowProgress } from '@/components/workflow/workflow-progress'
import { NextStepPrompt, SuggestedTensionsPrompt } from '@/components/workflow/next-step-prompt'
import { suggestTensionsFromMetadata, getMetadataRiskSummary } from '@/lib/rules/metadata-tension-rules'

interface Sia {
  id: string
  name: string
  description: string
  status: string
  sector: string
  decisionType: string
  userScale: string
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
    source: { label: string }
    target: { label: string }
    dataCategories: string[]
  }>
  tensions: Array<{
    id: string
    pattern: string
    status: string
    severity: number
    impactedDomains: string[]
    description: string
    arbitration: {
      id: string
      decision: string
      justification: string
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

const domainIcons: Record<string, React.ReactNode> = {
  // Cercle 1 : Personnes
  PRIVACY: <Lock className="h-4 w-4" />,
  EQUITY: <Scale className="h-4 w-4" />,
  TRANSPARENCY: <Eye className="h-4 w-4" />,
  AUTONOMY: <Users className="h-4 w-4" />,
  SECURITY: <Shield className="h-4 w-4" />,
  RECOURSE: <MessageSquare className="h-4 w-4" />,
  // Cercle 2 : Organisation
  MASTERY: <Sparkles className="h-4 w-4" />,
  RESPONSIBILITY: <ClipboardCheck className="h-4 w-4" />,
  SOVEREIGNTY: <Map className="h-4 w-4" />,
  // Cercle 3 : Société
  SUSTAINABILITY: <Leaf className="h-4 w-4" />,
  LOYALTY: <CheckCircle2 className="h-4 w-4" />,
  SOCIETAL_BALANCE: <TrendingUp className="h-4 w-4" />,
}

// Severity is now 1-5 in schema
const severityColors: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800',
  2: 'bg-green-100 text-green-800',
  3: 'bg-yellow-100 text-yellow-800',
  4: 'bg-orange-100 text-orange-800',
  5: 'bg-red-100 text-red-800',
}

const severityLabels: Record<number, string> = {
  1: 'Très faible',
  2: 'Faible',
  3: 'Moyenne',
  4: 'Haute',
  5: 'Critique',
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  ACTIVE: 'bg-blue-100 text-blue-800',
  REVIEW: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-purple-100 text-purple-800',
}

const priorityLabels: Record<string, string> = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  CRITICAL: 'Critique',
}

// Helper to get severity level for display
const getSeverityLevel = (severity: number): number => {
  if (severity >= 5) return 5
  if (severity >= 4) return 4
  if (severity >= 3) return 3
  if (severity >= 2) return 2
  return 1
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

  // Get suggested tensions from SIA metadata - must be before early returns (hooks rule)
  const suggestedTensions = useMemo(() => {
    if (!sia) return []
    return suggestTensionsFromMetadata({
      id: sia.id,
      name: sia.name,
      description: sia.description,
      sector: sia.sector || '',
      decisionType: sia.decisionType,
      hasVulnerable: sia.hasVulnerable,
      userScale: sia.userScale,
      dataTypes: sia.dataTypes || [],
      populations: sia.populations || [],
    })
  }, [sia])

  // Risk summary - must be before early returns (hooks rule)
  const riskSummary = useMemo(() => {
    if (!sia) return { level: 'LOW' as const, factors: [] }
    return getMetadataRiskSummary({
      id: sia.id,
      name: sia.name,
      description: sia.description,
      sector: sia.sector || '',
      decisionType: sia.decisionType,
      hasVulnerable: sia.hasVulnerable,
      userScale: sia.userScale,
      dataTypes: sia.dataTypes || [],
      populations: sia.populations || [],
    })
  }, [sia])

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
              <Button onClick={() => router.push('/dashboard')}>
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
  const activeTensions = sia.tensions.filter(t =>
    t.status === 'DETECTED' || t.status === 'QUALIFIED' || t.status === 'IN_PROGRESS'
  ).length
  const resolvedTensions = sia.tensions.filter(t =>
    t.status === 'RESOLVED' || t.status === 'ARBITRATED' || t.status === 'DISMISSED'
  ).length
  const arbitratedTensions = sia.tensions.filter(t =>
    t.status === 'ARBITRATED' || t.status === 'RESOLVED' || t.status === 'DISMISSED'
  ).length
  const completedActions = sia.actions.filter(a => a.status === 'DONE' || a.status === 'COMPLETED').length
  const actionProgress = sia.actions.length > 0
    ? Math.round((completedActions / sia.actions.length) * 100)
    : 0

  // Workflow stats for progress component
  const workflowStats = {
    hasNodes: sia.nodes.length > 0,
    hasEdges: sia.edges.length > 0,
    tensionsCount: sia.tensions.length,
    tensionsArbitratedCount: arbitratedTensions,
    actionsCount: sia.actions.length,
    actionsCompletedCount: completedActions,
  }

  // Determine next step to suggest
  const getNextStep = (): 'map' | 'tensions' | 'actions' | 'export' | null => {
    if (!workflowStats.hasNodes || !workflowStats.hasEdges) return 'map'
    if (workflowStats.tensionsCount > 0 && workflowStats.tensionsArbitratedCount < workflowStats.tensionsCount) return 'tensions'
    if (workflowStats.actionsCount === 0 && workflowStats.tensionsCount > 0) return 'actions'
    if (workflowStats.actionsCompletedCount < workflowStats.actionsCount) return 'actions'
    return 'export'
  }

  const nextStep = getNextStep()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{sia.name}</h1>
            <Badge className={statusColors[sia.status]}>
              {sia.status === 'DRAFT' && 'Brouillon'}
              {sia.status === 'ACTIVE' && 'Actif'}
              {sia.status === 'REVIEW' && 'En révision'}
              {sia.status === 'ARCHIVED' && 'Archivé'}
            </Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">{sia.description}</p>
          {sia.updatedAt && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Dernière mise à jour: {new Date(sia.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          )}
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

      {/* Workflow Progress */}
      <Card>
        <CardContent className="pt-6">
          <WorkflowProgress siaId={siaId} stats={workflowStats} />
        </CardContent>
      </Card>

      {/* Risk Summary and Next Step */}
      {riskSummary.factors.length > 0 && (
        <Card className={`border-2 ${
          riskSummary.level === 'CRITICAL' ? 'border-red-300 bg-red-50' :
          riskSummary.level === 'HIGH' ? 'border-orange-300 bg-orange-50' :
          riskSummary.level === 'MEDIUM' ? 'border-yellow-300 bg-yellow-50' :
          'border-blue-300 bg-blue-50'
        }`}>
          <CardContent className="py-4">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${
                riskSummary.level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                riskSummary.level === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                riskSummary.level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">
                    Niveau de vigilance requis: {
                      riskSummary.level === 'CRITICAL' ? 'Critique' :
                      riskSummary.level === 'HIGH' ? 'Élevé' :
                      riskSummary.level === 'MEDIUM' ? 'Modéré' :
                      'Faible'
                    }
                  </h3>
                  <Badge variant={
                    riskSummary.level === 'CRITICAL' ? 'destructive' :
                    riskSummary.level === 'HIGH' ? 'destructive' :
                    'secondary'
                  }>
                    {riskSummary.factors.length} facteur{riskSummary.factors.length > 1 ? 's' : ''} identifié{riskSummary.factors.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {riskSummary.factors.map((factor, idx) => (
                    <span key={idx} className="text-sm px-2 py-1 bg-white/60 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggested Tensions from Metadata */}
      {suggestedTensions.length > 0 && sia.tensions.length === 0 && !workflowStats.hasEdges && (
        <SuggestedTensionsPrompt
          siaId={siaId}
          suggestions={suggestedTensions.map(s => ({
            pattern: s.pattern,
            title: s.title,
            reason: s.reason,
            confidence: s.confidence,
          }))}
        />
      )}

      {/* Next Step Prompt */}
      {nextStep && nextStep !== 'export' && (
        <NextStepPrompt
          siaId={siaId}
          step={nextStep}
          variant={nextStep === 'tensions' && activeTensions > 0 ? 'warning' : 'default'}
        />
      )}

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
                const tensionsForDomain = sia.tensions.filter(t =>
                  t.impactedDomains.includes(key)
                ).length
                return (
                  <Link
                    key={key}
                    href={`/${siaId}/tensions?domain=${key}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
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
                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {domain.label}
                        </span>
                        <div className="flex items-center gap-2">
                          {tensionsForDomain > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {tensionsForDomain} tension{tensionsForDomain > 1 ? 's' : ''}
                            </Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {score.toFixed(1)}/5
                          </span>
                        </div>
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
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Tensions, Suivi, Profil, Calendrier */}
      <Tabs defaultValue="tensions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tensions" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Tensions</span>
            <Badge variant="secondary" className="ml-1">{sia.tensions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="suivi" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Suivi</span>
          </TabsTrigger>
          <TabsTrigger value="profil" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="calendrier" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Calendrier</span>
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
              {sia.tensions.slice(0, 5).map((tension) => {
                const severityLevel = getSeverityLevel(tension.severity || 3)
                return (
                  <Card key={tension.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            <AlertTriangle
                              className={`h-5 w-5 ${
                                severityLevel >= 5 ? 'text-red-500' :
                                severityLevel >= 4 ? 'text-orange-500' :
                                severityLevel >= 3 ? 'text-yellow-500' :
                                severityLevel >= 2 ? 'text-green-500' :
                                'text-blue-500'
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4 className="font-medium">{tension.description}</h4>
                              <Badge className={severityColors[severityLevel]}>
                                {severityLabels[severityLevel]}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {tension.impactedDomains.map((domain, idx) => (
                                <span key={domain} className="flex items-center gap-1">
                                  {idx > 0 && <ArrowRight className="h-3 w-3" />}
                                  {domainIcons[domain]}
                                  {DOMAINS[domain as keyof typeof DOMAINS]?.label}
                                </span>
                              ))}
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
                )
              })}
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

        {/* Vue 1: Suivi - Tracking by dilemma with action progress */}
        <TabsContent value="suivi" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Tableau de suivi
              </CardTitle>
              <CardDescription>
                Suivi par dilemme avec état d&apos;avancement des actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sia.tensions.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune tension à suivre pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sia.tensions.map((tension) => {
                    const tensionActions = sia.actions.filter(a =>
                      tension.description?.toLowerCase().includes(a.title?.toLowerCase()) ||
                      tension.impactedDomains?.some(d => a.title?.toLowerCase().includes(d.toLowerCase()))
                    )
                    const completedTensionActions = tensionActions.filter(a => a.status === 'DONE').length
                    const progress = tensionActions.length > 0
                      ? Math.round((completedTensionActions / tensionActions.length) * 100)
                      : 0
                    const severityLevel = getSeverityLevel(tension.severity || 3)

                    return (
                      <Card key={tension.id} className="border-l-4" style={{
                        borderLeftColor: tension.status === 'RESOLVED' || tension.status === 'ARBITRATED'
                          ? '#22c55e'
                          : tension.status === 'DISMISSED'
                            ? '#6b7280'
                            : severityLevel >= 4 ? '#ef4444' : '#f59e0b'
                      }}>
                        <CardContent className="py-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-medium">{tension.description}</h4>
                                <Badge className={severityColors[severityLevel]}>
                                  {severityLabels[severityLevel]}
                                </Badge>
                                <Badge variant={
                                  tension.status === 'RESOLVED' || tension.status === 'ARBITRATED' ? 'default' :
                                  tension.status === 'DISMISSED' ? 'secondary' :
                                  'outline'
                                }>
                                  {tension.status === 'DETECTED' && 'Détecté'}
                                  {tension.status === 'QUALIFIED' && 'Qualifié'}
                                  {tension.status === 'IN_PROGRESS' && 'En cours'}
                                  {tension.status === 'ARBITRATED' && 'Arbitré'}
                                  {tension.status === 'RESOLVED' && 'Résolu'}
                                  {tension.status === 'DISMISSED' && 'Rejeté'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                {tension.impactedDomains?.map((domain, idx) => (
                                  <span key={domain} className="flex items-center gap-1">
                                    {idx > 0 && <span>•</span>}
                                    {domainIcons[domain]}
                                    {DOMAINS[domain as keyof typeof DOMAINS]?.label}
                                  </span>
                                ))}
                              </div>
                              {tension.arbitration && (
                                <div className="bg-muted/50 rounded-lg p-3 mb-3">
                                  <p className="text-sm">
                                    <span className="font-medium">Décision: </span>
                                    {tension.arbitration.decision === 'ACCEPT' && 'Accepter le risque'}
                                    {tension.arbitration.decision === 'MITIGATE' && 'Atténuer'}
                                    {tension.arbitration.decision === 'REJECT' && 'Rejeter'}
                                  </p>
                                  {tension.arbitration.justification && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {tension.arbitration.justification}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/${siaId}/tensions/${tension.id}`}>
                                Détails
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                          {tensionActions.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Actions liées: {completedTensionActions}/{tensionActions.length}
                                </span>
                                <span className="font-medium">{progress}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue 2: Profil éthique - Prioritized domains */}
        <TabsContent value="profil" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Profil éthique
              </CardTitle>
              <CardDescription>
                Visualisation des domaines priorisés dans vos arbitrages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                {/* Circle 1: Personnes */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" style={{ color: '#3B82F6' }} />
                      Cercle 1: Personnes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['PRIVACY', 'EQUITY', 'TRANSPARENCY', 'AUTONOMY', 'SECURITY', 'RECOURSE'].map(key => {
                        const domain = DOMAINS[key as keyof typeof DOMAINS]
                        const score = sia.vigilanceScores?.domains?.[key] || 0
                        const tensionCount = sia.tensions.filter(t => t.impactedDomains?.includes(key)).length
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded flex items-center justify-center" style={{ backgroundColor: `${domain.color}20` }}>
                              <span style={{ color: domain.color }}>{domainIcons[key]}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>{domain.label}</span>
                                <span className="text-muted-foreground">{score.toFixed(1)}/5</span>
                              </div>
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(score/5)*100}%`, backgroundColor: domain.color }} />
                              </div>
                            </div>
                            {tensionCount > 0 && (
                              <Badge variant="secondary" className="text-xs">{tensionCount}</Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Circle 2: Organisation */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Map className="h-4 w-4" style={{ color: '#8B5CF6' }} />
                      Cercle 2: Organisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['MASTERY', 'RESPONSIBILITY', 'SOVEREIGNTY'].map(key => {
                        const domain = DOMAINS[key as keyof typeof DOMAINS]
                        const score = sia.vigilanceScores?.domains?.[key] || 0
                        const tensionCount = sia.tensions.filter(t => t.impactedDomains?.includes(key)).length
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded flex items-center justify-center" style={{ backgroundColor: `${domain.color}20` }}>
                              <span style={{ color: domain.color }}>{domainIcons[key]}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>{domain.label}</span>
                                <span className="text-muted-foreground">{score.toFixed(1)}/5</span>
                              </div>
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(score/5)*100}%`, backgroundColor: domain.color }} />
                              </div>
                            </div>
                            {tensionCount > 0 && (
                              <Badge variant="secondary" className="text-xs">{tensionCount}</Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Circle 3: Société */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Leaf className="h-4 w-4" style={{ color: '#22C55E' }} />
                      Cercle 3: Société
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['SUSTAINABILITY', 'LOYALTY', 'SOCIETAL_BALANCE'].map(key => {
                        const domain = DOMAINS[key as keyof typeof DOMAINS]
                        const score = sia.vigilanceScores?.domains?.[key] || 0
                        const tensionCount = sia.tensions.filter(t => t.impactedDomains?.includes(key)).length
                        return (
                          <div key={key} className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded flex items-center justify-center" style={{ backgroundColor: `${domain.color}20` }}>
                              <span style={{ color: domain.color }}>{domainIcons[key]}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>{domain.label}</span>
                                <span className="text-muted-foreground">{score.toFixed(1)}/5</span>
                              </div>
                              <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(score/5)*100}%`, backgroundColor: domain.color }} />
                              </div>
                            </div>
                            {tensionCount > 0 && (
                              <Badge variant="secondary" className="text-xs">{tensionCount}</Badge>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Arbitration Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Résumé des arbitrages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">
                        {sia.tensions.filter(t => t.arbitration?.decision === 'ACCEPT').length}
                      </p>
                      <p className="text-sm text-green-600">Risques acceptés</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-700">
                        {sia.tensions.filter(t => t.arbitration?.decision === 'MITIGATE').length}
                      </p>
                      <p className="text-sm text-orange-600">À atténuer</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-2xl font-bold text-red-700">
                        {sia.tensions.filter(t => t.arbitration?.decision === 'REJECT').length}
                      </p>
                      <p className="text-sm text-red-600">Rejetés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vue 3: Calendrier - Revisions and triggers */}
        <TabsContent value="calendrier" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Calendrier de révision
              </CardTitle>
              <CardDescription>
                Révisions programmées et événements déclencheurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Upcoming Reviews */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Prochaines révisions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Révision trimestrielle</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">À venir</Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Révision annuelle</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">Planifié</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trigger Events */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Événements déclencheurs</CardTitle>
                    <CardDescription>Situations nécessitant une révision</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 rounded border">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Changement majeur de modèle IA</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded border">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Nouvelle réglementation applicable</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded border">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Extension de la population cible</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded border">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Incident signalé par les utilisateurs</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded border">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm">Changement de fournisseur externe</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-sm flex-1">SIA créé</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(sia.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {sia.tensions.length > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-sm flex-1">{sia.tensions.length} tension(s) détectée(s)</span>
                        <span className="text-xs text-muted-foreground">Cartographie</span>
                      </div>
                    )}
                    {arbitratedTensions > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-sm flex-1">{arbitratedTensions} tension(s) arbitrée(s)</span>
                        <span className="text-xs text-muted-foreground">Arbitrage</span>
                      </div>
                    )}
                    {completedActions > 0 && (
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm flex-1">{completedActions} action(s) complétée(s)</span>
                        <span className="text-xs text-muted-foreground">Suivi</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm flex-1">Dernière modification</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(sia.updatedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
