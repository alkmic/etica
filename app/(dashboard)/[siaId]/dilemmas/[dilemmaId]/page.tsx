'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Calendar,
  FileText,
  Users,
  HelpCircle,
  Layers,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import {
  ArbitrationForm,
  type ArbitrationFormData,
  type DecisionType,
} from '@/components/arbitration-form'
import {
  ETHICAL_DOMAINS,
  CIRCLES,
  type EthicalDomain,
} from '@/lib/constants/ethical-domains'
import { type RuleFamily } from '@/lib/rules/types'

interface Dilemma {
  id: string
  ruleId: string
  ruleName: string
  ruleNameFr: string
  ruleFamily: RuleFamily
  domainA: EthicalDomain
  domainB: EthicalDomain
  formulation: string
  mechanism: string
  severity: number
  severityBase: number
  maturity: number
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
    decision: DecisionType
    justification: string
    selectedPatterns: string[]
    benefitAnalysis: string | null
    riskAcceptance: string | null
    rejectionReason: string | null
    proportionality: string | null
    contestability: string | null
    revisionConditions: string | null
    compensatoryMeasures: string | null
    stakeholdersConsulted: string | null
    evidences: string | null
    nextReviewDate: string | null
    arbitratedAt: string
  } | null
  affectedNodes: Array<{
    id: string
    label: string
    type: string
  }>
  affectedEdges: Array<{
    id: string
    label: string | null
    source: { id: string; label: string }
    target: { id: string; label: string }
  }>
}

const RULE_FAMILIES: Record<RuleFamily, { label: string; labelFr: string; color: string }> = {
  STRUCTURAL: { label: 'Structural', labelFr: 'Structurel', color: 'bg-blue-100 text-blue-800' },
  DATA: { label: 'Data', labelFr: 'Données', color: 'bg-purple-100 text-purple-800' },
  DEPENDENCY: { label: 'Dependency', labelFr: 'Dépendance', color: 'bg-red-100 text-red-800' },
  CONTEXTUAL: { label: 'Contextual', labelFr: 'Contextuel', color: 'bg-amber-100 text-amber-800' },
  GOVERNANCE: { label: 'Governance', labelFr: 'Gouvernance', color: 'bg-green-100 text-green-800' },
}

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

export default function DilemmaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const siaId = params.siaId as string
  const dilemmaId = params.dilemmaId as string

  const [dilemma, setDilemma] = useState<Dilemma | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchDilemma() {
      try {
        const response = await fetch(`/api/sia/${siaId}/dilemmas/${dilemmaId}`)
        if (response.ok) {
          const data = await response.json()
          setDilemma(data)
        } else {
          toast({
            title: 'Erreur',
            description: 'Dilemme non trouvé',
            variant: 'destructive',
          })
          router.push(`/${siaId}/dilemmas`)
        }
      } catch (error) {
        console.error('Error fetching dilemma:', error)
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le dilemme',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (siaId && dilemmaId) {
      fetchDilemma()
    }
  }, [siaId, dilemmaId, router, toast])

  const handleSubmitArbitration = async (data: ArbitrationFormData) => {
    setSaving(true)
    try {
      const method = dilemma?.arbitration ? 'PUT' : 'POST'
      const response = await fetch(`/api/sia/${siaId}/dilemmas/${dilemmaId}/arbitration`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: 'Arbitrage enregistré',
          description: 'Votre décision a été enregistrée avec succès.',
        })

        // Refresh dilemma data
        const dilemmaResponse = await fetch(`/api/sia/${siaId}/dilemmas/${dilemmaId}`)
        if (dilemmaResponse.ok) {
          setDilemma(await dilemmaResponse.json())
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de l'enregistrement")
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : "Impossible d'enregistrer l'arbitrage",
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!dilemma) {
    return null
  }

  const severityInfo = getSeverityInfo(dilemma.severity)
  const maturityInfo = MATURITY_LEVELS[dilemma.maturity] || MATURITY_LEVELS[0]
  const familyInfo = RULE_FAMILIES[dilemma.ruleFamily]
  const severityDelta = dilemma.severity - dilemma.severityBase

  const domainA = ETHICAL_DOMAINS[dilemma.domainA]
  const domainB = ETHICAL_DOMAINS[dilemma.domainB]
  const IconA = domainA?.icon
  const IconB = domainB?.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2"
            asChild
          >
            <Link href={`/${siaId}/dilemmas`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux dilemmes
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg border ${severityInfo.color}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="font-mono">
                  {dilemma.ruleId}
                </Badge>
                <h1 className="text-xl font-bold">{dilemma.ruleNameFr || dilemma.ruleName}</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={severityInfo.color}>
                  Sévérité: {dilemma.severity}/5 ({severityInfo.label})
                </Badge>
                {severityDelta !== 0 && (
                  <Badge variant="outline" className={severityDelta > 0 ? 'text-red-600' : 'text-green-600'}>
                    {severityDelta > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {severityDelta > 0 ? '+' : ''}{severityDelta} (modificateurs)
                  </Badge>
                )}
                <Badge className={maturityInfo.color}>
                  {maturityInfo.shortLabel} - {maturityInfo.label}
                </Badge>
                <Badge variant="outline" className={familyInfo.color}>
                  Famille {familyInfo.labelFr}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dilemma description */}
          <Card>
            <CardHeader>
              <CardTitle>Dilemme</CardTitle>
              <CardDescription>Tension éthique détectée</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Domains in tension */}
              <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
                {domainA && IconA && (
                  <div
                    className="flex flex-col items-center gap-2 p-4 rounded-lg"
                    style={{ backgroundColor: `${CIRCLES[domainA.circle].color}15` }}
                  >
                    <IconA className="h-8 w-8" style={{ color: CIRCLES[domainA.circle].color }} />
                    <span className="font-medium">{domainA.nameFr}</span>
                    <span className="text-xs text-muted-foreground">{CIRCLES[domainA.circle].nameFr}</span>
                  </div>
                )}
                <div className="text-2xl text-muted-foreground">↔</div>
                {domainB && IconB && (
                  <div
                    className="flex flex-col items-center gap-2 p-4 rounded-lg"
                    style={{ backgroundColor: `${CIRCLES[domainB.circle].color}15` }}
                  >
                    <IconB className="h-8 w-8" style={{ color: CIRCLES[domainB.circle].color }} />
                    <span className="font-medium">{domainB.nameFr}</span>
                    <span className="text-xs text-muted-foreground">{CIRCLES[domainB.circle].nameFr}</span>
                  </div>
                )}
              </div>

              {/* Formulation */}
              <div>
                <h4 className="font-medium mb-2">Formulation</h4>
                <p className="text-muted-foreground">{dilemma.formulation}</p>
              </div>

              {/* Mechanism */}
              <div>
                <h4 className="font-medium mb-2">Mécanisme</h4>
                <p className="text-muted-foreground text-sm">{dilemma.mechanism}</p>
              </div>
            </CardContent>
          </Card>

          {/* Severity factors */}
          {(dilemma.activeAggravatingFactors.length > 0 || dilemma.activeMitigatingFactors.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Facteurs de sévérité</CardTitle>
                <CardDescription>
                  Sévérité de base : {dilemma.severityBase}/5 → Sévérité calculée : {dilemma.severity}/5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dilemma.activeAggravatingFactors.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800 mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Facteurs aggravants ({dilemma.activeAggravatingFactors.length})
                      </p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {dilemma.activeAggravatingFactors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-red-400 mt-1">+</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dilemma.activeMitigatingFactors.length > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                        <TrendingDown className="h-4 w-4" />
                        Facteurs atténuants ({dilemma.activeMitigatingFactors.length})
                      </p>
                      <ul className="text-sm text-green-700 space-y-1">
                        {dilemma.activeMitigatingFactors.map((factor, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-green-400 mt-1">-</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affected elements */}
          {(dilemma.affectedNodes?.length > 0 || dilemma.affectedEdges?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Éléments concernés</CardTitle>
                <CardDescription>
                  Nœuds et flux impliqués dans ce dilemme
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dilemma.affectedNodes?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Nœuds ({dilemma.affectedNodes.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {dilemma.affectedNodes.map((node) => (
                        <Badge key={node.id} variant="outline">
                          {node.label} ({node.type})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {dilemma.affectedEdges?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Flux ({dilemma.affectedEdges.length})</h4>
                    <div className="space-y-2">
                      {dilemma.affectedEdges.map((edge) => (
                        <div
                          key={edge.id}
                          className="flex items-center gap-2 p-2 rounded-lg border bg-muted/30"
                        >
                          <Badge variant="outline">{edge.source.label}</Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline">{edge.target.label}</Badge>
                          {edge.label && (
                            <span className="text-xs text-muted-foreground">({edge.label})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Arbitration form */}
          <Card>
            <CardContent className="pt-6">
              <ArbitrationForm
                dilemmaId={dilemma.id}
                dilemmaName={dilemma.formulation}
                questionsToConsider={dilemma.questionsToConsider}
                stakeholdersToConsult={dilemma.stakeholdersToConsult}
                acceptablePatterns={dilemma.acceptablePatterns}
                requiredEvidences={dilemma.requiredEvidences}
                initialData={
                  dilemma.arbitration
                    ? {
                        decision: dilemma.arbitration.decision,
                        justification: dilemma.arbitration.justification,
                        selectedPatterns: dilemma.arbitration.selectedPatterns || [],
                        benefitAnalysis: dilemma.arbitration.benefitAnalysis || '',
                        riskAcceptance: dilemma.arbitration.riskAcceptance || '',
                        rejectionReason: dilemma.arbitration.rejectionReason || '',
                        proportionality: dilemma.arbitration.proportionality || '',
                        contestability: dilemma.arbitration.contestability || '',
                        revisionConditions: dilemma.arbitration.revisionConditions || '',
                        compensatoryMeasures: dilemma.arbitration.compensatoryMeasures || '',
                        stakeholdersConsulted: dilemma.arbitration.stakeholdersConsulted || '',
                        evidences: dilemma.arbitration.evidences || '',
                        nextReviewDate: dilemma.arbitration.nextReviewDate?.split('T')[0] || '',
                      }
                    : undefined
                }
                onSubmit={handleSubmitArbitration}
                isSubmitting={saving}
                isEditing={!!dilemma.arbitration}
              />
            </CardContent>
          </Card>

          {/* Existing arbitration display */}
          {dilemma.arbitration && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  Arbitrage enregistré
                </CardTitle>
                <CardDescription>
                  Enregistré le {new Date(dilemma.arbitration.arbitratedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={
                    dilemma.arbitration.decision === 'MITIGATE'
                      ? 'bg-blue-100 text-blue-800'
                      : dilemma.arbitration.decision === 'ACCEPT_RISK'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }>
                    {dilemma.arbitration.decision === 'MITIGATE' && 'Mitigation'}
                    {dilemma.arbitration.decision === 'ACCEPT_RISK' && 'Risque accepté'}
                    {dilemma.arbitration.decision === 'REJECT' && 'Détection rejetée'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Justification :</p>
                  <p className="text-sm text-muted-foreground">{dilemma.arbitration.justification}</p>
                </div>

                {dilemma.arbitration.selectedPatterns && dilemma.arbitration.selectedPatterns.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Patrons d'arbitrage sélectionnés :</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {dilemma.arbitration.selectedPatterns.map((patternId, i) => {
                        const patternIndex = parseInt(patternId.replace('pattern-', ''))
                        const pattern = dilemma.acceptablePatterns[patternIndex]
                        return <li key={patternId}>{pattern || patternId}</li>
                      })}
                    </ul>
                  </div>
                )}

                {dilemma.arbitration.nextReviewDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Prochaine révision : {new Date(dilemma.arbitration.nextReviewDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Règle :</span>
                <span className="font-medium font-mono">{dilemma.ruleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Famille :</span>
                <span className="font-medium">{familyInfo.labelFr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sévérité base :</span>
                <span className="font-medium">{dilemma.severityBase}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sévérité finale :</span>
                <span className="font-medium">{dilemma.severity}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maturité :</span>
                <span className="font-medium">{maturityInfo.shortLabel}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nœuds concernés :</span>
                <span className="font-medium">{dilemma.affectedNodeIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flux concernés :</span>
                <span className="font-medium">{dilemma.affectedEdgeIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Détecté le :</span>
                <span className="font-medium">
                  {new Date(dilemma.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Maturity progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Progression de maturité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MATURITY_LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      dilemma.maturity >= level.level
                        ? level.color
                        : 'bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    {dilemma.maturity >= level.level ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{level.shortLabel}</span>
                    <span className="text-xs flex-1">{level.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Required evidences */}
          {dilemma.requiredEvidences.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Preuves requises (M3+)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {dilemma.requiredEvidences.map((evidence, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      {evidence}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Stakeholders */}
          {dilemma.stakeholdersToConsult.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Parties prenantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dilemma.stakeholdersToConsult.map((stakeholder, i) => (
                    <Badge key={i} variant="secondary">
                      {stakeholder}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
