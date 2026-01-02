'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Search,
  Gavel,
  LayoutGrid,
  List,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { CriticalityMatrix, CriticalityStats } from '@/components/criticality-matrix'
import {
  ETHICAL_DOMAINS,
  CIRCLES,
  type EthicalDomain,
} from '@/lib/constants/ethical-domains'
import { type RuleFamily } from '@/lib/rules/types'

// Dilemma interface (from detection engine)
interface Dilemma {
  id: string
  ruleId: string
  ruleName: string
  ruleFamily: RuleFamily
  domainA: EthicalDomain
  domainB: EthicalDomain
  formulation: string
  mechanism: string
  severity: number
  maturity: number // 0-4
  affectedNodeIds: string[]
  affectedEdgeIds: string[]
  activeAggravatingFactors: string[]
  activeMitigatingFactors: string[]
  acceptablePatterns: string[]
  requiredEvidences: string[]
  questionsToConsider: string[]
  stakeholdersToConsult: string[]
  createdAt: string
  arbitration: {
    id: string
    decision: string
    justification: string
    arbitratedAt: string
  } | null
}

const RULE_FAMILIES: { id: RuleFamily; label: string; labelFr: string; color: string }[] = [
  { id: 'STRUCTURAL', label: 'Structural', labelFr: 'Structurel', color: 'bg-blue-100 text-blue-800' },
  { id: 'DATA', label: 'Data', labelFr: 'Données', color: 'bg-purple-100 text-purple-800' },
  { id: 'DEPENDENCY', label: 'Dependency', labelFr: 'Dépendance', color: 'bg-red-100 text-red-800' },
  { id: 'CONTEXTUAL', label: 'Contextual', labelFr: 'Contextuel', color: 'bg-amber-100 text-amber-800' },
  { id: 'GOVERNANCE', label: 'Governance', labelFr: 'Gouvernance', color: 'bg-green-100 text-green-800' },
]

const MATURITY_LEVELS = [
  { level: 0, label: 'Non identifié', shortLabel: 'M0', color: 'bg-gray-100 text-gray-800' },
  { level: 1, label: 'Identifié', shortLabel: 'M1', color: 'bg-yellow-100 text-yellow-800' },
  { level: 2, label: 'Analysé', shortLabel: 'M2', color: 'bg-blue-100 text-blue-800' },
  { level: 3, label: 'Arbitré', shortLabel: 'M3', color: 'bg-green-100 text-green-800' },
  { level: 4, label: 'Validé', shortLabel: 'M4', color: 'bg-purple-100 text-purple-800' },
]

function getSeverityInfo(severity: number) {
  if (severity >= 5) return { label: 'Critique', color: 'bg-red-100 text-red-800 border-red-200' }
  if (severity >= 4) return { label: 'Haute', color: 'bg-orange-100 text-orange-800 border-orange-200' }
  if (severity >= 3) return { label: 'Modérée', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  if (severity >= 2) return { label: 'Faible', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  return { label: 'Minimale', color: 'bg-gray-100 text-gray-800 border-gray-200' }
}

function getMaturityInfo(maturity: number) {
  return MATURITY_LEVELS[maturity] || MATURITY_LEVELS[0]
}

export default function DilemmasPage() {
  const params = useParams()
  const router = useRouter()
  const siaId = params.siaId as string

  const [dilemmas, setDilemmas] = useState<Dilemma[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [familyFilter, setFamilyFilter] = useState<string>('all')
  const [maturityFilter, setMaturityFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list')

  useEffect(() => {
    async function fetchDilemmas() {
      try {
        const response = await fetch(`/api/sia/${siaId}/dilemmas`)
        if (response.ok) {
          const data = await response.json()
          setDilemmas(data)
        }
      } catch (error) {
        console.error('Error fetching dilemmas:', error)
      } finally {
        setLoading(false)
      }
    }

    if (siaId) {
      fetchDilemmas()
    }
  }, [siaId])

  // Filter dilemmas
  const filteredDilemmas = useMemo(() => {
    return dilemmas.filter((dilemma) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        dilemma.formulation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dilemma.ruleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dilemma.ruleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ETHICAL_DOMAINS[dilemma.domainA]?.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ETHICAL_DOMAINS[dilemma.domainB]?.nameFr.toLowerCase().includes(searchQuery.toLowerCase())

      // Severity filter
      const matchesSeverity =
        severityFilter === 'all' ||
        (severityFilter === 'CRITICAL' && dilemma.severity >= 5) ||
        (severityFilter === 'HIGH' && dilemma.severity === 4) ||
        (severityFilter === 'MEDIUM' && dilemma.severity === 3) ||
        (severityFilter === 'LOW' && dilemma.severity <= 2)

      // Family filter
      const matchesFamily = familyFilter === 'all' || dilemma.ruleFamily === familyFilter

      // Maturity filter
      const matchesMaturity = maturityFilter === 'all' || dilemma.maturity === parseInt(maturityFilter)

      return matchesSearch && matchesSeverity && matchesFamily && matchesMaturity
    })
  }, [dilemmas, searchQuery, severityFilter, familyFilter, maturityFilter])

  // Group dilemmas by status for tabs
  const pendingDilemmas = filteredDilemmas.filter((d) => d.maturity < 2)
  const analyzedDilemmas = filteredDilemmas.filter((d) => d.maturity === 2)
  const resolvedDilemmas = filteredDilemmas.filter((d) => d.maturity >= 3)

  // Stats (used by CriticalityStats component)
  const _stats = useMemo(() => ({
    total: dilemmas.length,
    pending: dilemmas.filter((d) => d.maturity < 2).length,
    critical: dilemmas.filter((d) => d.severity >= 5 && d.maturity < 3).length,
    resolved: dilemmas.filter((d) => d.maturity >= 3).length,
  }), [dilemmas])

  // Matrix data for CriticalityMatrix
  const matrixData = useMemo(() => {
    return filteredDilemmas.map((d) => ({
      id: d.id,
      severity: d.severity,
      maturity: d.maturity,
      name: d.formulation,
      ruleName: d.ruleName,
    }))
  }, [filteredDilemmas])

  const handleMatrixCellClick = (severity: number, maturity: number, cellDilemmas: Array<{ id: string }>) => {
    if (cellDilemmas.length === 1) {
      router.push(`/${siaId}/dilemmas/${cellDilemmas[0].id}`)
    } else if (cellDilemmas.length > 1) {
      // Filter to show only dilemmas in this cell
      setSeverityFilter(
        severity >= 5 ? 'CRITICAL' :
        severity === 4 ? 'HIGH' :
        severity === 3 ? 'MEDIUM' : 'LOW'
      )
      setMaturityFilter(maturity.toString())
      setViewMode('list')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement des dilemmes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dilemmes éthiques</h1>
          <p className="text-muted-foreground">
            Gérez les dilemmes détectés par le moteur de règles ETICA
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value: string) => value && setViewMode(value as 'list' | 'matrix')}
        >
          <ToggleGroupItem value="list" aria-label="Vue liste">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="matrix" aria-label="Vue matrice">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Stats */}
      <CriticalityStats dilemmas={matrixData} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un dilemme..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={familyFilter} onValueChange={setFamilyFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Famille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes familles</SelectItem>
            {RULE_FAMILIES.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.labelFr}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sévérité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes sévérités</SelectItem>
            <SelectItem value="CRITICAL">Critique (5)</SelectItem>
            <SelectItem value="HIGH">Haute (4)</SelectItem>
            <SelectItem value="MEDIUM">Modérée (3)</SelectItem>
            <SelectItem value="LOW">Faible (1-2)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={maturityFilter} onValueChange={setMaturityFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Maturité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes maturités</SelectItem>
            {MATURITY_LEVELS.map((m) => (
              <SelectItem key={m.level} value={m.level.toString()}>
                {m.shortLabel} - {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Matrix View */}
      {viewMode === 'matrix' && (
        <CriticalityMatrix
          dilemmas={matrixData}
          onCellClick={handleMatrixCellClick}
        />
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {dilemmas.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun dilemme détecté</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Les dilemmes sont automatiquement détectés lors de l'analyse du système.
                    Commencez par modéliser votre système d'IA.
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
                  À traiter ({pendingDilemmas.length})
                </TabsTrigger>
                <TabsTrigger value="analyzed" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Analysés ({analyzedDilemmas.length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Arbitrés ({resolvedDilemmas.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <div className="space-y-3">
                  {pendingDilemmas.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Aucun dilemme en attente de traitement
                      </CardContent>
                    </Card>
                  ) : (
                    pendingDilemmas.map((dilemma) => (
                      <DilemmaCard key={dilemma.id} dilemma={dilemma} siaId={siaId} />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="analyzed" className="mt-4">
                <div className="space-y-3">
                  {analyzedDilemmas.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Aucun dilemme en cours d'analyse
                      </CardContent>
                    </Card>
                  ) : (
                    analyzedDilemmas.map((dilemma) => (
                      <DilemmaCard key={dilemma.id} dilemma={dilemma} siaId={siaId} />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="resolved" className="mt-4">
                <div className="space-y-3">
                  {resolvedDilemmas.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        Aucun dilemme arbitré
                      </CardContent>
                    </Card>
                  ) : (
                    resolvedDilemmas.map((dilemma) => (
                      <DilemmaCard key={dilemma.id} dilemma={dilemma} siaId={siaId} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  )
}

function DilemmaCard({ dilemma, siaId }: { dilemma: Dilemma; siaId: string }) {
  const severityInfo = getSeverityInfo(dilemma.severity)
  const maturityInfo = getMaturityInfo(dilemma.maturity)
  const familyInfo = RULE_FAMILIES.find((f) => f.id === dilemma.ruleFamily)

  const domainA = ETHICAL_DOMAINS[dilemma.domainA]
  const domainB = ETHICAL_DOMAINS[dilemma.domainB]

  const IconA = domainA?.icon
  const IconB = domainB?.icon

  const severityDelta = dilemma.activeAggravatingFactors.length - dilemma.activeMitigatingFactors.length

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
                <span className="text-xs font-bold mt-1">{dilemma.severity}/5</span>
              </div>

              <div className="flex-1 min-w-0">
                {/* Title and badges */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="outline" className="font-mono text-xs">
                    {dilemma.ruleId}
                  </Badge>
                  <Badge className={severityInfo.color}>{severityInfo.label}</Badge>
                  <Badge className={maturityInfo.color}>{maturityInfo.shortLabel}</Badge>
                  {familyInfo && (
                    <Badge variant="outline" className={familyInfo.color}>
                      {familyInfo.labelFr}
                    </Badge>
                  )}
                </div>

                {/* Domains in tension */}
                <div className="flex items-center gap-2 mb-2">
                  {domainA && IconA && (
                    <span
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-sm"
                      style={{ backgroundColor: `${CIRCLES[domainA.circle].color}15` }}
                    >
                      <IconA className="h-4 w-4" style={{ color: CIRCLES[domainA.circle].color }} />
                      <span className="font-medium">{domainA.nameFr}</span>
                    </span>
                  )}
                  <span className="text-muted-foreground">↔</span>
                  {domainB && IconB && (
                    <span
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-sm"
                      style={{ backgroundColor: `${CIRCLES[domainB.circle].color}15` }}
                    >
                      <IconB className="h-4 w-4" style={{ color: CIRCLES[domainB.circle].color }} />
                      <span className="font-medium">{domainB.nameFr}</span>
                    </span>
                  )}
                </div>

                {/* Formulation */}
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {dilemma.formulation}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm flex-wrap">
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
                          {severityDelta > 0 ? '+' : ''}{severityDelta}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-medium mb-1">Modificateurs actifs :</p>
                          {dilemma.activeAggravatingFactors.length > 0 && (
                            <p className="text-red-400">
                              + {dilemma.activeAggravatingFactors.length} aggravant(s)
                            </p>
                          )}
                          {dilemma.activeMitigatingFactors.length > 0 && (
                            <p className="text-green-400">
                              - {dilemma.activeMitigatingFactors.length} atténuant(s)
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Affected elements */}
                  <span className="text-muted-foreground text-xs">
                    {dilemma.affectedNodeIds.length} nœud(s), {dilemma.affectedEdgeIds.length} flux
                  </span>

                  {/* Arbitration indicator */}
                  {dilemma.arbitration && (
                    <Badge variant="outline" className="text-xs">
                      <Gavel className="h-3 w-3 mr-1" />
                      {dilemma.arbitration.decision === 'MITIGATE' && 'Mitigé'}
                      {dilemma.arbitration.decision === 'ACCEPT_RISK' && 'Risque accepté'}
                      {dilemma.arbitration.decision === 'REJECT' && 'Rejeté'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" asChild>
              <Link href={`/${siaId}/dilemmas/${dilemma.id}`}>
                {dilemma.maturity < 3 ? 'Arbitrer' : 'Détails'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
