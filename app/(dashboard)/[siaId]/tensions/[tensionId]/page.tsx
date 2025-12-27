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
  FileText,
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
import { useToast } from '@/hooks/use-toast'
import { DOMAINS } from '@/lib/constants/domains'
import { TENSION_PATTERNS } from '@/lib/constants/tension-patterns'
import { ACTION_TEMPLATES } from '@/lib/constants/action-templates'

interface Tension {
  id: string
  patternId: string
  status: string
  severity: string
  primaryDomain: string
  secondaryDomain: string
  description: string
  createdAt: string
  arbitrations: Array<{
    id: string
    decision: string
    justification: string
    createdBy: string
    createdAt: string
  }>
  edges: Array<{
    edge: {
      id: string
      description: string
      dataTypes: string[]
      sourceNode: { id: string; label: string; type: string }
      targetNode: { id: string; label: string; type: string }
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

const severityColors: Record<string, string> = {
  LOW: 'bg-blue-100 text-blue-800 border-blue-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  CRITICAL: 'bg-red-100 text-red-800 border-red-200',
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-orange-100 text-orange-800',
  OPEN: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  ACCEPTED: 'bg-purple-100 text-purple-800',
  MITIGATED: 'bg-teal-100 text-teal-800',
}

const severityLabels: Record<string, string> = {
  LOW: 'Basse',
  MEDIUM: 'Moyenne',
  HIGH: 'Haute',
  CRITICAL: 'Critique',
}

const statusLabels: Record<string, string> = {
  ACTIVE: 'Active',
  OPEN: 'Ouverte',
  RESOLVED: 'Résolue',
  ACCEPTED: 'Acceptée',
  MITIGATED: 'Atténuée',
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

  const handleSubmitArbitration = async () => {
    if (!decision || !justification) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
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
                arbitrations: [newArbitration, ...prev.arbitrations],
                status: decision === 'ACCEPT' ? 'ACCEPTED' : decision === 'MITIGATE' ? 'MITIGATED' : prev.status,
              }
            : null
        )
        setDecision('')
        setJustification('')
        toast({
          title: 'Arbitrage enregistré',
          description: 'Votre décision a été enregistrée',
        })
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer l\'arbitrage',
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

  const pattern = TENSION_PATTERNS.find((p) => p.id === tension.patternId)
  const primaryDomain = DOMAINS[tension.primaryDomain as keyof typeof DOMAINS]
  const secondaryDomain = DOMAINS[tension.secondaryDomain as keyof typeof DOMAINS]

  // Get suggested actions from pattern
  const suggestedActions = pattern?.defaultActions || []

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
            <div
              className={`p-2 rounded-lg border ${severityColors[tension.severity]}`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{pattern?.title || 'Tension éthique'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={severityColors[tension.severity]}>
                  {severityLabels[tension.severity]}
                </Badge>
                <Badge className={statusColors[tension.status]}>
                  {statusLabels[tension.status]}
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
              {pattern?.description && (
                <p className="mt-4 text-sm text-muted-foreground border-l-2 pl-4">
                  {pattern.description}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Domains in conflict */}
          <Card>
            <CardHeader>
              <CardTitle>Domaines en conflit</CardTitle>
              <CardDescription>
                Les droits fondamentaux mis en tension
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div
                  className="flex-1 p-4 rounded-lg border"
                  style={{ backgroundColor: `${primaryDomain?.color}10`, borderColor: `${primaryDomain?.color}30` }}
                >
                  <div className="flex items-center gap-2 mb-2" style={{ color: primaryDomain?.color }}>
                    {domainIcons[tension.primaryDomain]}
                    <span className="font-medium">{primaryDomain?.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {primaryDomain?.description}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">vs</span>
                </div>
                <div
                  className="flex-1 p-4 rounded-lg border"
                  style={{ backgroundColor: `${secondaryDomain?.color}10`, borderColor: `${secondaryDomain?.color}30` }}
                >
                  <div className="flex items-center gap-2 mb-2" style={{ color: secondaryDomain?.color }}>
                    {domainIcons[tension.secondaryDomain]}
                    <span className="font-medium">{secondaryDomain?.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {secondaryDomain?.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related flows */}
          {tension.edges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Flux concernés</CardTitle>
                <CardDescription>
                  Les flux de données impliqués dans cette tension
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tension.edges.map(({ edge }) => (
                    <div
                      key={edge.id}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{edge.sourceNode.label}</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{edge.targetNode.label}</Badge>
                      </div>
                      {edge.dataTypes.length > 0 && (
                        <div className="flex-1 text-right">
                          <span className="text-xs text-muted-foreground">
                            {edge.dataTypes.join(', ')}
                          </span>
                        </div>
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
              <CardTitle>Arbitrer cette tension</CardTitle>
              <CardDescription>
                Documentez votre décision et sa justification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pattern?.arbitrationQuestions && pattern.arbitrationQuestions.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Questions à considérer
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    {pattern.arbitrationQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <Label>Décision</Label>
                <Select value={decision} onValueChange={setDecision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une décision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACCEPT">
                      Accepter le risque - La tension est reconnue mais acceptable
                    </SelectItem>
                    <SelectItem value="MITIGATE">
                      Atténuer - Mettre en place des mesures de mitigation
                    </SelectItem>
                    <SelectItem value="REJECT">
                      Rejeter - La conception doit être modifiée
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Justification</Label>
                <Textarea
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Expliquez les raisons de votre décision et les éléments pris en compte..."
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitArbitration}
                disabled={saving || !decision || !justification}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer l\'arbitrage'}
              </Button>
            </CardContent>
          </Card>

          {/* Arbitration history */}
          {tension.arbitrations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historique des arbitrages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tension.arbitrations.map((arb) => (
                    <div key={arb.id} className="border-l-2 pl-4 py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {arb.decision === 'ACCEPT' && 'Accepté'}
                          {arb.decision === 'MITIGATE' && 'Atténué'}
                          {arb.decision === 'REJECT' && 'Rejeté'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(arb.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{arb.justification}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Suggested actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions suggérées</CardTitle>
              <CardDescription>
                Mesures recommandées pour cette tension
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
                    return (
                      <div
                        key={actionId}
                        className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <p className="text-sm font-medium">{template.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune action suggérée pour ce type de tension
                </p>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/${siaId}/actions`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Créer une action
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Examples */}
          {pattern?.examples && pattern.examples.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Exemples similaires</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {pattern.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
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
  )
}
