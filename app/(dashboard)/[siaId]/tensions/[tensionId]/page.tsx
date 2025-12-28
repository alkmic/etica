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
  PRIVACY: <Lock className="h-5 w-5" />,
  EQUITY: <Scale className="h-5 w-5" />,
  TRANSPARENCY: <Eye className="h-5 w-5" />,
  AUTONOMY: <Users className="h-5 w-5" />,
  SECURITY: <Shield className="h-5 w-5" />,
  RECOURSE: <MessageSquare className="h-5 w-5" />,
  SUSTAINABILITY: <Leaf className="h-5 w-5" />,
  ACCOUNTABILITY: <ClipboardCheck className="h-5 w-5" />,
}

// Severity is 1-5 in the schema
const severityColors: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800 border-blue-200',
  2: 'bg-green-100 text-green-800 border-green-200',
  3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  4: 'bg-orange-100 text-orange-800 border-orange-200',
  5: 'bg-red-100 text-red-800 border-red-200',
}

const statusColors: Record<string, string> = {
  DETECTED: 'bg-blue-100 text-blue-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  ARBITRATED: 'bg-indigo-100 text-indigo-800',
  RESOLVED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800',
}

const severityLabels: Record<number, string> = {
  1: 'Très faible',
  2: 'Faible',
  3: 'Moyenne',
  4: 'Haute',
  5: 'Critique',
}

const statusLabels: Record<string, string> = {
  DETECTED: 'Détectée',
  QUALIFIED: 'Qualifiée',
  IN_PROGRESS: 'En cours',
  ARBITRATED: 'Arbitrée',
  RESOLVED: 'Résolue',
  DISMISSED: 'Écartée',
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
                arbitration: newArbitration,
                status: decision === 'ACCEPT' ? 'ARBITRATED' : decision === 'MITIGATE' ? 'IN_PROGRESS' : decision === 'REJECT' ? 'DISMISSED' : prev.status,
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

  const pattern = TENSION_PATTERNS[tension.pattern as keyof typeof TENSION_PATTERNS]
  // impactedDomains is an array of domain IDs
  const domains = tension.impactedDomains.map(d => DOMAINS[d as keyof typeof DOMAINS]).filter(Boolean)
  const primaryDomain = domains[0]
  const secondaryDomain = domains[1]
  const severityValue = tension.severity ?? 3

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
              className={`p-2 rounded-lg border ${severityColors[severityValue] || severityColors[3]}`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{pattern?.title || 'Tension éthique'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={severityColors[severityValue] || severityColors[3]}>
                  {severityLabels[severityValue] || 'Moyenne'}
                </Badge>
                <Badge className={statusColors[tension.status] || 'bg-gray-100 text-gray-800'}>
                  {statusLabels[tension.status] || tension.status}
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
              <CardTitle>Domaines concernés</CardTitle>
              <CardDescription>
                Les droits fondamentaux mis en tension
              </CardDescription>
            </CardHeader>
            <CardContent>
              {domains.length >= 2 ? (
                <div className="flex items-center gap-6">
                  <div
                    className="flex-1 p-4 rounded-lg border"
                    style={{ backgroundColor: `${primaryDomain?.color}10`, borderColor: `${primaryDomain?.color}30` }}
                  >
                    <div className="flex items-center gap-2 mb-2" style={{ color: primaryDomain?.color }}>
                      {domainIcons[tension.impactedDomains[0]]}
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
                      {domainIcons[tension.impactedDomains[1]]}
                      <span className="font-medium">{secondaryDomain?.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {secondaryDomain?.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {domains.map((domain, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border"
                      style={{ backgroundColor: `${domain?.color}10`, borderColor: `${domain?.color}30` }}
                    >
                      <div className="flex items-center gap-2 mb-2" style={{ color: domain?.color }}>
                        {domainIcons[tension.impactedDomains[i]]}
                        <span className="font-medium">{domain?.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {domain?.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related flows */}
          {tension.tensionEdges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Flux concernés</CardTitle>
                <CardDescription>
                  Les flux de données impliqués dans cette tension
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
                      {edge.dataCategories.length > 0 && (
                        <div className="flex-1 text-right">
                          <span className="text-xs text-muted-foreground">
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

          {/* Arbitration record */}
          {tension.arbitration && (
            <Card>
              <CardHeader>
                <CardTitle>Arbitrage documenté</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-l-2 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">
                      {tension.arbitration.decision === 'ACCEPT' && 'Accepté'}
                      {tension.arbitration.decision === 'MITIGATE' && 'Atténué'}
                      {tension.arbitration.decision === 'REJECT' && 'Rejeté'}
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
