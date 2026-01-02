'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  Lock,
  Scale,
  Eye,
  Users,
  Shield,
  Leaf,
  ClipboardCheck,
  Lightbulb,
  ChevronRight,
  HelpCircle,
  Info,
  Sparkles,
  Target,
  Workflow,
  Check,
  User,
  Calendar,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { DOMAINS } from '@/lib/constants/domains'
import { TENSION_PATTERNS } from '@/lib/constants/tension-patterns'
import { ACTION_TEMPLATES } from '@/lib/constants/action-templates'

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
    createdBy?: string
    createdAt: string
  } | null
  tensionEdges: Array<{
    edge: {
      id: string
      label: string | null
      dataCategories: string[]
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
  // Cercle 1 : Personnes
  PRIVACY: <Lock className="h-5 w-5" />,
  EQUITY: <Scale className="h-5 w-5" />,
  TRANSPARENCY: <Eye className="h-5 w-5" />,
  AUTONOMY: <Users className="h-5 w-5" />,
  SECURITY: <Shield className="h-5 w-5" />,
  RECOURSE: <MessageSquare className="h-5 w-5" />,
  // Cercle 2 : Organisation
  CONTROL: <Sparkles className="h-5 w-5" />,
  ACCOUNTABILITY: <ClipboardCheck className="h-5 w-5" />,
  SOVEREIGNTY: <Target className="h-5 w-5" />,
  // Cercle 3 : Société
  SUSTAINABILITY: <Leaf className="h-5 w-5" />,
  LOYALTY: <CheckCircle2 className="h-5 w-5" />,
  BALANCE: <Workflow className="h-5 w-5" />,
}

const severityConfig: Record<number, { bg: string; border: string; text: string; label: string }> = {
  1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'Très faible' },
  2: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Faible' },
  3: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Moyenne' },
  4: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', label: 'Haute' },
  5: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'Critique' },
}

const statusLabels: Record<string, string> = {
  DETECTED: 'Détectée',
  QUALIFIED: 'Qualifiée',
  IN_PROGRESS: 'En cours',
  ARBITRATED: 'Arbitrée',
  RESOLVED: 'Résolue',
  DISMISSED: 'Écartée',
}

const WORKFLOW_STEPS = [
  { id: 'DETECTED', label: 'Détectée', icon: AlertTriangle, description: 'Tension identifiée automatiquement' },
  { id: 'IN_PROGRESS', label: 'Analyse', icon: Target, description: 'Évaluation en cours' },
  { id: 'ARBITRATED', label: 'Arbitrée', icon: Scale, description: 'Décision prise et documentée' },
  { id: 'RESOLVED', label: 'Résolue', icon: CheckCircle2, description: 'Actions complétées' },
]

function getWorkflowStepIndex(status: string): number {
  if (status === 'DETECTED' || status === 'QUALIFIED') return 0
  if (status === 'IN_PROGRESS') return 1
  if (status === 'ARBITRATED') return 2
  if (status === 'RESOLVED') return 3
  if (status === 'DISMISSED') return -1 // Special case
  return 0
}

export default function TensionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const siaId = params.siaId as string
  const tensionId = params.tensionId as string

  const [tension, setTension] = useState<Tension | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Arbitration form
  const [decision, setDecision] = useState('')
  const [justification, setJustification] = useState('')
  const [addingAction, setAddingAction] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTension() {
      try {
        const response = await fetch(`/api/sia/${siaId}/tensions/${tensionId}`)
        if (response.ok) {
          const data = await response.json()
          setTension(data)
        } else {
          toast({
            title: 'Erreur',
            description: 'Tension non trouvée',
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

  const handleAddAction = async (templateId: string) => {
    const template = Object.values(ACTION_TEMPLATES)
      .flat()
      .find((t) => t.id === templateId)

    if (!template) return

    setAddingAction(templateId)
    try {
      const response = await fetch(`/api/sia/${siaId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.title,
          description: template.description,
          category: template.category,
          priority: template.priority || 'MEDIUM',
          tensionId: tensionId,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Action ajoutée',
          description: `"${template.title}" a été ajoutée au Suivi`,
        })
        // Refresh tension to show linked action
        const tensionResponse = await fetch(`/api/sia/${siaId}/tensions/${tensionId}`)
        if (tensionResponse.ok) {
          const data = await tensionResponse.json()
          setTension(data)
        }
      } else {
        throw new Error('Failed to create action')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter l\'action',
        variant: 'destructive',
      })
    } finally {
      setAddingAction(null)
    }
  }

  const handleSubmitArbitration = async () => {
    if (!decision || !justification) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez sélectionner une décision et fournir une justification.',
        variant: 'destructive',
      })
      return
    }

    if (justification.length < 20) {
      toast({
        title: 'Justification trop courte',
        description: 'Veuillez fournir une justification plus détaillée (minimum 20 caractères).',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/sia/${siaId}/tensions/${tensionId}/arbitrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, justification }),
      })

      if (response.ok) {
        const newArbitration = await response.json()
        setTension((prev) =>
          prev
            ? {
                ...prev,
                arbitration: newArbitration,
                status: decision === 'ACCEPT' ? 'ARBITRATED' : decision === 'MITIGATE' ? 'IN_PROGRESS' : decision === 'REJECT' ? 'DISMISSED' : prev.status,
              }
            : null
        )
        setDecision('')
        setJustification('')
        toast({
          title: 'Arbitrage enregistré',
          description: 'Votre décision a été documentée avec succès.',
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const pattern = useMemo(() =>
    tension ? TENSION_PATTERNS[tension.pattern as keyof typeof TENSION_PATTERNS] : null,
    [tension]
  )

  const domains = useMemo(() =>
    tension ? tension.impactedDomains.map(d => DOMAINS[d as keyof typeof DOMAINS]).filter(Boolean) : [],
    [tension]
  )

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

  const primaryDomain = domains[0]
  const secondaryDomain = domains[1]
  const severityValue = tension.severity ?? 3
  const severity = severityConfig[severityValue] || severityConfig[3]
  const currentStepIndex = getWorkflowStepIndex(tension.status)
  const suggestedActions = pattern?.defaultActions || []
  const isDismissed = tension.status === 'DISMISSED'

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6 pb-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href={`/${siaId}/tensions`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{pattern?.title || 'Tension éthique'}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(tension.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <Badge className={`${severity.bg} ${severity.text} border ${severity.border}`}>
                {severity.label}
              </Badge>
              {isDismissed && (
                <Badge variant="secondary">Écartée</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Progress */}
        {!isDismissed && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                {WORKFLOW_STEPS.map((step, index) => {
                  const StepIcon = step.icon
                  const isActive = index === currentStepIndex
                  const isComplete = index < currentStepIndex
                  const isPending = index > currentStepIndex

                  return (
                    <div key={step.id} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`
                            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                            ${isComplete ? 'bg-green-100 border-green-500 text-green-600' : ''}
                            ${isActive ? 'bg-primary/10 border-primary text-primary' : ''}
                            ${isPending ? 'bg-muted border-muted-foreground/30 text-muted-foreground/50' : ''}
                          `}
                        >
                          {isComplete ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <StepIcon className="h-5 w-5" />
                          )}
                        </div>
                        <span className={`mt-2 text-xs font-medium ${isActive ? 'text-primary' : isPending ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                      {index < WORKFLOW_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-green-500' : 'bg-muted'}`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <Card className={`border-l-4 ${severity.border}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  Comprendre cette tension
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{tension.description}</p>

                {pattern?.description && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm">{pattern.description}</p>
                  </div>
                )}

                {/* Domains in conflict - Visual representation */}
                {domains.length >= 2 && (
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Droits fondamentaux en tension</h4>
                    <div className="flex items-stretch gap-4">
                      <div
                        className="flex-1 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                        style={{
                          backgroundColor: `${primaryDomain?.color}08`,
                          borderColor: `${primaryDomain?.color}40`
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2" style={{ color: primaryDomain?.color }}>
                          {domainIcons[tension.impactedDomains[0]]}
                          <span className="font-semibold">{primaryDomain?.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {primaryDomain?.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">tension</span>
                      </div>

                      <div
                        className="flex-1 p-4 rounded-lg border-2 transition-all hover:shadow-md"
                        style={{
                          backgroundColor: `${secondaryDomain?.color}08`,
                          borderColor: `${secondaryDomain?.color}40`
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2" style={{ color: secondaryDomain?.color }}>
                          {domainIcons[tension.impactedDomains[1]]}
                          <span className="font-semibold">{secondaryDomain?.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {secondaryDomain?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Related flows */}
            {tension.tensionEdges.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Workflow className="h-5 w-5 text-muted-foreground" />
                    Flux de données concernés
                  </CardTitle>
                  <CardDescription>
                    Ces flux de données sont impliqués dans la tension
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tension.tensionEdges.map(({ edge }) => (
                      <div
                        key={edge.id}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <Badge variant="outline" className="font-medium">{edge.source.label}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        <Badge variant="outline" className="font-medium">{edge.target.label}</Badge>
                        {edge.dataCategories.length > 0 && (
                          <div className="flex-1 text-right">
                            <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded">
                              {edge.dataCategories.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Arbitration Section - More prominent */}
            <Card className={tension.arbitration ? 'border-green-200 bg-green-50/30' : 'border-primary/30 bg-primary/5'}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5" />
                  {tension.arbitration ? 'Arbitrage documenté' : 'Arbitrer cette tension'}
                </CardTitle>
                <CardDescription>
                  {tension.arbitration
                    ? 'La décision a été enregistrée et documentée'
                    : 'Prenez une décision éclairée et documentez votre raisonnement'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show existing arbitration */}
                {tension.arbitration ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-lg border">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-medium">
                            {tension.arbitration.decision === 'ACCEPT' && 'Risque accepté'}
                            {tension.arbitration.decision === 'MITIGATE' && 'Atténuation requise'}
                            {tension.arbitration.decision === 'REJECT' && 'Conception rejetée'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(tension.arbitration.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{tension.arbitration.justification}</p>
                      </div>
                    </div>

                    {tension.arbitration.decision === 'MITIGATE' && (
                      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
                        <p className="text-sm text-orange-700">
                          Des actions d'atténuation sont requises. Consultez les actions suggérées ci-contre.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Arbitration form */
                  <div className="space-y-4">
                    {/* Guidance questions */}
                    {pattern?.arbitrationQuestions && pattern.arbitrationQuestions.length > 0 && (
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-900">Questions à considérer</span>
                        </div>
                        <ul className="space-y-2">
                          {pattern.arbitrationQuestions.map((q, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                              <ChevronRight className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Votre décision
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Choisissez comment traiter cette tension éthique identifiée.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setDecision('ACCEPT')}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            decision === 'ACCEPT'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-muted hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              decision === 'ACCEPT' ? 'border-blue-500 bg-blue-500' : 'border-muted-foreground/30'
                            }`}>
                              {decision === 'ACCEPT' && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="font-medium">Accepter le risque</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            La tension est reconnue mais considérée acceptable en l'état.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDecision('MITIGATE')}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            decision === 'MITIGATE'
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-muted hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              decision === 'MITIGATE' ? 'border-orange-500 bg-orange-500' : 'border-muted-foreground/30'
                            }`}>
                              {decision === 'MITIGATE' && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="font-medium">Atténuer</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Mettre en place des mesures pour réduire l'impact.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDecision('REJECT')}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            decision === 'REJECT'
                              ? 'border-red-500 bg-red-50'
                              : 'border-muted hover:border-muted-foreground/30'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              decision === 'REJECT' ? 'border-red-500 bg-red-500' : 'border-muted-foreground/30'
                            }`}>
                              {decision === 'REJECT' && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span className="font-medium">Rejeter</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            La conception doit être modifiée pour éliminer cette tension.
                          </p>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Justification
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Expliquez les raisons de votre décision. Cette justification sera conservée pour la traçabilité et l'audit.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Textarea
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        placeholder="Expliquez les raisons de votre décision, les éléments pris en compte, les alternatives considérées..."
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {justification.length} / 20 caractères minimum
                      </p>
                    </div>

                    <Button
                      onClick={handleSubmitArbitration}
                      disabled={saving || !decision || justification.length < 20}
                      className="w-full"
                      size="lg"
                    >
                      {saving ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Enregistrer l'arbitrage
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-6">
            {/* Suggested actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Actions recommandées
                </CardTitle>
                <CardDescription>
                  Mesures pour atténuer cette tension
                </CardDescription>
              </CardHeader>
              <CardContent>
                {suggestedActions.length > 0 ? (
                  <div className="space-y-2">
                    {suggestedActions.slice(0, 5).map((actionId) => {
                      const template = Object.values(ACTION_TEMPLATES)
                        .flat()
                        .find((t) => t.id === actionId)
                      if (!template) return null
                      const isAlreadyAdded = tension.actions.some(
                        (a) => a.title === template.title
                      )
                      return (
                        <div
                          key={actionId}
                          className={`p-3 rounded-lg border transition-colors ${
                            isAlreadyAdded ? 'bg-green-50 border-green-200' : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{template.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {template.description}
                              </p>
                            </div>
                            {isAlreadyAdded ? (
                              <Badge variant="secondary" className="shrink-0 bg-green-100 text-green-700">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Ajoutée
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0"
                                onClick={() => handleAddAction(actionId)}
                                disabled={addingAction === actionId}
                              >
                                {addingAction === actionId ? (
                                  <Clock className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Ajouter
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune action suggérée pour ce type de tension
                  </p>
                )}

                <Separator className="my-4" />

                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/${siaId}/actions`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Voir le Suivi
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Linked Actions */}
            {tension.actions.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Actions liées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {tension.actions.map((action) => (
                      <Link
                        key={action.id}
                        href={`/${siaId}/actions?action=${action.id}`}
                        className="flex items-center gap-2 p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          action.status === 'DONE' ? 'bg-green-500' :
                          action.status === 'IN_PROGRESS' ? 'bg-orange-500' :
                          'bg-muted-foreground/30'
                        }`} />
                        <span className="text-sm flex-1 truncate">{action.title}</span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Examples - if available */}
            {pattern?.examples && pattern.examples.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Exemples similaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pattern.examples.slice(0, 4).map((example, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
