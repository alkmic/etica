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
  Lock,
  Scale,
  Eye,
  Users,
  Shield,
  MessageSquare,
  Leaf,
  ClipboardCheck,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  User,
  Network,
  Globe,
  Gavel,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Hammer,
  Check,
  Info,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/hooks/use-toast'
import { DOMAINS } from '@/lib/constants/domains'

interface SuggestedMeasure {
  id: string
  title: string
  description: string
  category: string
  effort: string
}

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
  arbitrationQuestions: string[]
  suggestedMeasures: SuggestedMeasure[]
  arbitration: {
    id: string
    decisionType: string
    justification: string
    selectedMeasures: string[]
    benefitAnalysis: string | null
    riskAcceptance: string | null
    rejectionReason: string | null
    proportionality: string | null
    contestability: string | null
    revisionConditions: string | null
    compensatoryMeasures: string | null
    nextReviewDate: string | null
    arbitratedAt: string
  } | null
  tensionEdges: Array<{
    edge: {
      id: string
      label: string | null
      source: { id: string; label: string; type: string }
      target: { id: string; label: string; type: string }
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
  PRIVACY: <Lock className="h-5 w-5" />,
  EQUITY: <Scale className="h-5 w-5" />,
  TRANSPARENCY: <Eye className="h-5 w-5" />,
  AUTONOMY: <Users className="h-5 w-5" />,
  SECURITY: <Shield className="h-5 w-5" />,
  RECOURSE: <MessageSquare className="h-5 w-5" />,
  SUSTAINABILITY: <Leaf className="h-5 w-5" />,
  ACCOUNTABILITY: <ClipboardCheck className="h-5 w-5" />,
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
  DETECTED: 'Detectee',
  QUALIFIED: 'Qualifiee',
  IN_PROGRESS: 'En cours',
  ARBITRATED: 'Arbitree',
  RESOLVED: 'Resolue',
  DISMISSED: 'Ecartee',
}

const effortLabels: Record<string, string> = {
  TRIVIAL: '< 1 jour',
  SMALL: '1-3 jours',
  MEDIUM: '1-2 semaines',
  LARGE: '2-4 semaines',
  HUGE: '> 1 mois',
}

function getSeverityInfo(severity: number | null) {
  const s = severity || 3
  if (s >= 5) return { label: 'Critique', color: 'bg-red-100 text-red-800 border-red-200' }
  if (s >= 4) return { label: 'Haute', color: 'bg-orange-100 text-orange-800 border-orange-200' }
  if (s >= 3) return { label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
  if (s >= 2) return { label: 'Basse', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  return { label: 'Minimale', color: 'bg-gray-100 text-gray-800 border-gray-200' }
}

type DecisionType = 'MITIGATE' | 'ACCEPT_RISK' | 'REJECT'

export default function TensionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const siaId = params.siaId as string
  const tensionId = params.tensionId as string

  const [tension, setTension] = useState<Tension | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Arbitration form state
  const [decisionType, setDecisionType] = useState<DecisionType | ''>('')
  const [justification, setJustification] = useState('')
  const [selectedMeasures, setSelectedMeasures] = useState<string[]>([])
  const [benefitAnalysis, setBenefitAnalysis] = useState('')
  const [riskAcceptance, setRiskAcceptance] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [proportionality, setProportionality] = useState('')
  const [contestability, setContestability] = useState('')
  const [revisionConditions, setRevisionConditions] = useState('')
  const [compensatoryMeasures, setCompensatoryMeasures] = useState('')
  const [nextReviewDate, setNextReviewDate] = useState('')

  useEffect(() => {
    async function fetchTension() {
      try {
        const response = await fetch(`/api/sia/${siaId}/tensions/${tensionId}`)
        if (response.ok) {
          const data = await response.json()
          setTension(data)

          // Pre-fill form if arbitration exists
          if (data.arbitration) {
            setDecisionType(data.arbitration.decisionType)
            setJustification(data.arbitration.justification || '')
            setSelectedMeasures(data.arbitration.selectedMeasures || [])
            setBenefitAnalysis(data.arbitration.benefitAnalysis || '')
            setRiskAcceptance(data.arbitration.riskAcceptance || '')
            setRejectionReason(data.arbitration.rejectionReason || '')
            setProportionality(data.arbitration.proportionality || '')
            setContestability(data.arbitration.contestability || '')
            setRevisionConditions(data.arbitration.revisionConditions || '')
            setCompensatoryMeasures(data.arbitration.compensatoryMeasures || '')
            setNextReviewDate(data.arbitration.nextReviewDate?.split('T')[0] || '')
          }
        } else {
          toast({
            title: 'Erreur',
            description: 'Tension non trouvee',
            variant: 'destructive',
          })
          router.push(`/${siaId}/tensions`)
        }
      } catch (error) {
        console.error('Error fetching tension:', error)
      } finally {
        setLoading(false)
      }
    }

    if (siaId && tensionId) {
      fetchTension()
    }
  }, [siaId, tensionId, router, toast])

  const handleMeasureToggle = (measureId: string) => {
    setSelectedMeasures((prev) =>
      prev.includes(measureId)
        ? prev.filter((id) => id !== measureId)
        : [...prev, measureId]
    )
  }

  const handleSubmitArbitration = async () => {
    if (!decisionType) {
      toast({
        title: 'Erreur',
        description: 'Veuillez selectionner un type de decision',
        variant: 'destructive',
      })
      return
    }

    if (justification.length < 20) {
      toast({
        title: 'Erreur',
        description: 'La justification doit faire au moins 20 caracteres',
        variant: 'destructive',
      })
      return
    }

    if (decisionType === 'MITIGATE' && selectedMeasures.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez selectionner au moins une mesure de mitigation',
        variant: 'destructive',
      })
      return
    }

    if (decisionType === 'ACCEPT_RISK' && !benefitAnalysis) {
      toast({
        title: 'Erreur',
        description: "L'analyse benefice/risque est requise pour accepter le risque",
        variant: 'destructive',
      })
      return
    }

    if (decisionType === 'REJECT' && !rejectionReason) {
      toast({
        title: 'Erreur',
        description: 'Veuillez expliquer pourquoi cette detection est rejetee',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const method = tension?.arbitration ? 'PUT' : 'POST'
      const response = await fetch(`/api/sia/${siaId}/tensions/${tensionId}/arbitrations`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionType,
          justification,
          selectedMeasures: decisionType === 'MITIGATE' ? selectedMeasures : [],
          benefitAnalysis: decisionType === 'ACCEPT_RISK' ? benefitAnalysis : null,
          riskAcceptance: decisionType === 'ACCEPT_RISK' ? riskAcceptance : null,
          rejectionReason: decisionType === 'REJECT' ? rejectionReason : null,
          proportionality,
          contestability,
          revisionConditions,
          compensatoryMeasures,
          nextReviewDate: nextReviewDate || null,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'Arbitrage enregistre',
          description: result.message || 'Votre decision a ete enregistree',
        })

        // Refresh tension data
        const tensionResponse = await fetch(`/api/sia/${siaId}/tensions/${tensionId}`)
        if (tensionResponse.ok) {
          setTension(await tensionResponse.json())
        }
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'enregistrement')
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

  if (!tension) {
    return null
  }

  const severity = tension.calculatedSeverity || tension.baseSeverity
  const severityInfo = getSeverityInfo(severity)
  const severityDelta = tension.calculatedSeverity
    ? tension.calculatedSeverity - tension.baseSeverity
    : 0

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
            <Link href={`/${siaId}/tensions`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux tensions
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg border ${severityInfo.color}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{tension.patternTitle}</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={severityInfo.color}>
                  Severite: {severity}/5 ({severityInfo.label})
                </Badge>
                {severityDelta !== 0 && (
                  <Badge variant="outline" className={severityDelta > 0 ? 'text-red-600' : 'text-green-600'}>
                    {severityDelta > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {severityDelta > 0 ? '+' : ''}{severityDelta} (modificateurs)
                  </Badge>
                )}
                <Badge className={statusColors[tension.status]}>
                  {statusLabels[tension.status]}
                </Badge>
                <Badge className={levelColors[tension.level]} variant="outline">
                  {levelIcons[tension.level]}
                  <span className="ml-1">{levelLabels[tension.level]}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{tension.description}</p>
              {tension.detectionReason && tension.detectionReason !== tension.description && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Raison de la detection :</p>
                  <p className="text-sm text-muted-foreground">{tension.detectionReason}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Impacted domains */}
          <Card>
            <CardHeader>
              <CardTitle>Domaines de vigilance impactes</CardTitle>
              <CardDescription>
                Les domaines ethiques concernes par cette tension
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {tension.impactedDomains.map((domainId) => {
                  const domain = DOMAINS[domainId as keyof typeof DOMAINS]
                  if (!domain) return null
                  return (
                    <div
                      key={domainId}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                      style={{ backgroundColor: `${domain.color}10`, borderColor: `${domain.color}30` }}
                    >
                      <span style={{ color: domain.color }}>{domainIcons[domainId]}</span>
                      <span className="font-medium text-sm">{domain.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Show amplifiers and mitigators */}
              {(tension.activeAmplifiers.length > 0 || tension.activeMitigators.length > 0) && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tension.activeAmplifiers.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800 mb-2 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Facteurs aggravants ({tension.activeAmplifiers.length})
                      </p>
                      <ul className="text-sm text-red-700 space-y-1">
                        {tension.activeAmplifiers.map((amp, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-red-400 mt-1">+</span>
                            {amp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tension.activeMitigators.length > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-1">
                        <TrendingDown className="h-4 w-4" />
                        Facteurs attenuants ({tension.activeMitigators.length})
                      </p>
                      <ul className="text-sm text-green-700 space-y-1">
                        {tension.activeMitigators.map((mit, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-green-400 mt-1">-</span>
                            {mit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related flows */}
          {tension.tensionEdges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Flux concernes</CardTitle>
                <CardDescription>
                  Les flux de donnees impliques dans cette tension
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tension.tensionEdges.map(({ edge }) => (
                    <div
                      key={edge.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{edge.source.label}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{edge.target.label}</Badge>
                      </div>
                      {edge.label && (
                        <span className="text-xs text-muted-foreground">
                          ({edge.label})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Arbitration form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                {tension.arbitration ? 'Modifier l\'arbitrage' : 'Arbitrer cette tension'}
              </CardTitle>
              <CardDescription>
                Choisissez comment traiter cette tension ethique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Guiding questions */}
              {tension.arbitrationQuestions && tension.arbitrationQuestions.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium text-amber-800">
                    <Lightbulb className="h-4 w-4" />
                    Questions a considerer
                  </div>
                  <ul className="space-y-1 text-sm text-amber-700 list-disc list-inside">
                    {tension.arbitrationQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Decision type selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Type de decision *</Label>
                <RadioGroup
                  value={decisionType}
                  onValueChange={(v) => setDecisionType(v as DecisionType)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    decisionType === 'MITIGATE' ? 'border-blue-500 bg-blue-50' : 'border-muted hover:border-blue-300'
                  }`}>
                    <RadioGroupItem value="MITIGATE" id="mitigate" className="sr-only" />
                    <label htmlFor="mitigate" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Hammer className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Mitiger</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Mettre en place des mesures pour reduire le risque
                      </p>
                    </label>
                  </div>

                  <div className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    decisionType === 'ACCEPT_RISK' ? 'border-orange-500 bg-orange-50' : 'border-muted hover:border-orange-300'
                  }`}>
                    <RadioGroupItem value="ACCEPT_RISK" id="accept_risk" className="sr-only" />
                    <label htmlFor="accept_risk" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldAlert className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Accepter le risque</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Le benefice justifie le risque accepte
                      </p>
                    </label>
                  </div>

                  <div className={`relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    decisionType === 'REJECT' ? 'border-gray-500 bg-gray-50' : 'border-muted hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value="REJECT" id="reject" className="sr-only" />
                    <label htmlFor="reject" className="cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">Rejeter</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Cette detection n'est pas applicable
                      </p>
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Justification (always required) */}
              <div className="space-y-2">
                <Label htmlFor="justification">Justification * (min. 20 caracteres)</Label>
                <Textarea
                  id="justification"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Expliquez les raisons de votre decision..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {justification.length}/20 caracteres minimum
                </p>
              </div>

              {/* MITIGATE specific fields */}
              {decisionType === 'MITIGATE' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Hammer className="h-4 w-4" />
                    <span className="font-medium">Mesures de mitigation</span>
                  </div>

                  <div className="space-y-2">
                    <Label>Selectionnez les mesures a mettre en place *</Label>
                    {tension.suggestedMeasures.length > 0 ? (
                      <div className="space-y-2">
                        {tension.suggestedMeasures.map((measure) => (
                          <div
                            key={measure.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedMeasures.includes(measure.id)
                                ? 'bg-blue-100 border-blue-300'
                                : 'bg-white hover:bg-blue-50'
                            }`}
                            onClick={() => handleMeasureToggle(measure.id)}
                          >
                            <Checkbox
                              checked={selectedMeasures.includes(measure.id)}
                              onCheckedChange={() => handleMeasureToggle(measure.id)}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{measure.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {measure.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {measure.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {effortLabels[measure.effort] || measure.effort}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune mesure suggeree pour ce type de tension.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ACCEPT_RISK specific fields */}
              {decisionType === 'ACCEPT_RISK' && (
                <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-800">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="font-medium">Analyse benefice/risque</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefitAnalysis">
                      Pourquoi le benefice justifie-t-il le risque ? *
                    </Label>
                    <Textarea
                      id="benefitAnalysis"
                      value={benefitAnalysis}
                      onChange={(e) => setBenefitAnalysis(e.target.value)}
                      placeholder="Decrivez les benefices qui justifient d'accepter ce risque..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="riskAcceptance">
                      Quels risques sont explicitement acceptes ?
                    </Label>
                    <Textarea
                      id="riskAcceptance"
                      value={riskAcceptance}
                      onChange={(e) => setRiskAcceptance(e.target.value)}
                      placeholder="Listez les risques que vous acceptez consciemment..."
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* REJECT specific fields */}
              {decisionType === 'REJECT' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-800">
                    <XCircle className="h-4 w-4" />
                    <span className="font-medium">Rejet de la detection</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">
                      Pourquoi cette detection n'est-elle pas applicable ? *
                    </Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Expliquez pourquoi cette tension detectee ne s'applique pas a votre contexte..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Optional additional fields */}
              {decisionType && (
                <div className="space-y-4 pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">
                    Champs optionnels pour enrichir l'arbitrage
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="proportionality">Proportionnalite</Label>
                      <Textarea
                        id="proportionality"
                        value={proportionality}
                        onChange={(e) => setProportionality(e.target.value)}
                        placeholder="Necessite, adequation, proportionnalite..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contestability">Contestabilite</Label>
                      <Textarea
                        id="contestability"
                        value={contestability}
                        onChange={(e) => setContestability(e.target.value)}
                        placeholder="Comment les personnes peuvent-elles contester ?"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="revisionConditions">Conditions de revision</Label>
                      <Textarea
                        id="revisionConditions"
                        value={revisionConditions}
                        onChange={(e) => setRevisionConditions(e.target.value)}
                        placeholder="Dans quelles conditions reviser cette decision ?"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compensatoryMeasures">Mesures compensatoires</Label>
                      <Textarea
                        id="compensatoryMeasures"
                        value={compensatoryMeasures}
                        onChange={(e) => setCompensatoryMeasures(e.target.value)}
                        placeholder="Mesures additionnelles pour compenser..."
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextReviewDate" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date de prochaine revision
                    </Label>
                    <Input
                      id="nextReviewDate"
                      type="date"
                      value={nextReviewDate}
                      onChange={(e) => setNextReviewDate(e.target.value)}
                      className="w-[200px]"
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleSubmitArbitration}
                disabled={saving || !decisionType}
                className="w-full"
                size="lg"
              >
                {saving ? (
                  'Enregistrement...'
                ) : tension.arbitration ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Mettre a jour l'arbitrage
                  </>
                ) : (
                  <>
                    <Gavel className="mr-2 h-4 w-4" />
                    Enregistrer l'arbitrage
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing arbitration display */}
          {tension.arbitration && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  Arbitrage enregistre
                </CardTitle>
                <CardDescription>
                  Enregistre le {new Date(tension.arbitration.arbitratedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={
                    tension.arbitration.decisionType === 'MITIGATE'
                      ? 'bg-blue-100 text-blue-800'
                      : tension.arbitration.decisionType === 'ACCEPT_RISK'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }>
                    {tension.arbitration.decisionType === 'MITIGATE' && 'Mitigation'}
                    {tension.arbitration.decisionType === 'ACCEPT_RISK' && 'Risque accepte'}
                    {tension.arbitration.decisionType === 'REJECT' && 'Detection rejetee'}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Justification :</p>
                  <p className="text-sm text-muted-foreground">{tension.arbitration.justification}</p>
                </div>

                {tension.arbitration.selectedMeasures.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Mesures selectionnees :</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside">
                      {tension.arbitration.selectedMeasures.map((measureId) => {
                        const measure = tension.suggestedMeasures.find(m => m.id === measureId)
                        return (
                          <li key={measureId}>{measure?.title || measureId}</li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {tension.arbitration.nextReviewDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Prochaine revision : {new Date(tension.arbitration.nextReviewDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related actions */}
          {tension.actions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions liees</CardTitle>
                <CardDescription>
                  Actions generees par l'arbitrage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tension.actions.map((action) => (
                    <div
                      key={action.id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={
                          action.status === 'DONE' ? 'bg-green-100 text-green-800' :
                          action.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {action.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{action.title}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href={`/${siaId}/actions`}>
                    Voir toutes les actions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pattern :</span>
                <span className="font-medium">{tension.pattern}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severite base :</span>
                <span className="font-medium">{tension.baseSeverity}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severite finale :</span>
                <span className="font-medium">{tension.calculatedSeverity || tension.baseSeverity}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flux concernes :</span>
                <span className="font-medium">{tension.tensionEdges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Detectee le :</span>
                <span className="font-medium">
                  {new Date(tension.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
