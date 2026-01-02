'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  Building2,
  Users,
  Cpu,
  Shield,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import {
  SIA_DOMAINS,
  DATA_CATEGORIES,
  DECISION_TYPES,
  SCALE_LEVELS,
  POPULATIONS,
} from '@/lib/constants'

type WizardStep = 1 | 2 | 3 | 4 | 5

interface WizardData {
  // Step 1: Identity and Purpose
  name: string
  description: string
  domain: string
  finalPurpose: string

  // Step 2: Usage Context
  populations: string[]
  hasVulnerable: boolean | null
  scale: string
  usageFrequency: string
  geographicScope: string[]

  // Step 3: Decision Type
  dataTypes: string[]
  decisionType: string

  // Step 4: External Components
  hasExternalAI: boolean
  hasExternalInfra: boolean
  externalProviders: string[]

  // Step 5: Misuse Scenarios
  hasResponsible: boolean
  hasIncidentProcedure: boolean
  hasReviewSchedule: boolean
  hasKillSwitch: boolean
  misuseScenarios: string
}

const initialData: WizardData = {
  name: '',
  description: '',
  domain: '',
  finalPurpose: '',
  populations: [],
  hasVulnerable: null,
  scale: '',
  usageFrequency: '',
  geographicScope: [],
  dataTypes: [],
  decisionType: '',
  hasExternalAI: false,
  hasExternalInfra: false,
  externalProviders: [],
  hasResponsible: false,
  hasIncidentProcedure: false,
  hasReviewSchedule: false,
  hasKillSwitch: false,
  misuseScenarios: '',
}

const steps = [
  { id: 1, title: 'Identité et Finalité', icon: Building2 },
  { id: 2, title: 'Contexte d\'usage', icon: Users },
  { id: 3, title: 'Type de décision', icon: Cpu },
  { id: 4, title: 'Composants externes', icon: Shield },
  { id: 5, title: 'Scénarios de mésusage', icon: AlertTriangle },
]

const USAGE_FREQUENCIES = [
  { id: 'rare', label: 'Rare', description: 'Moins d\'une fois par mois' },
  { id: 'occasional', label: 'Occasionnel', description: 'Quelques fois par mois' },
  { id: 'frequent', label: 'Fréquent', description: 'Plusieurs fois par semaine' },
  { id: 'continuous', label: 'Continu', description: 'Usage quotidien ou en temps réel' },
]

const GEOGRAPHIC_SCOPES = [
  { id: 'local', label: 'Local', description: 'Une ville ou région' },
  { id: 'national', label: 'National', description: 'Un seul pays' },
  { id: 'eu', label: 'Union Européenne', description: 'Plusieurs pays UE' },
  { id: 'international', label: 'International', description: 'Monde entier' },
]

const EXTERNAL_PROVIDERS = [
  { id: 'openai', label: 'OpenAI', type: 'ai' },
  { id: 'anthropic', label: 'Anthropic', type: 'ai' },
  { id: 'google', label: 'Google AI', type: 'ai' },
  { id: 'microsoft', label: 'Microsoft Azure AI', type: 'ai' },
  { id: 'aws', label: 'AWS', type: 'infra' },
  { id: 'gcp', label: 'Google Cloud', type: 'infra' },
  { id: 'azure', label: 'Microsoft Azure', type: 'infra' },
  { id: 'other', label: 'Autre', type: 'other' },
]

interface ContextualAlert {
  type: 'warning' | 'info' | 'destructive'
  title: string
  message: string
  ruleHint?: string
}

export default function NewSiaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [data, setData] = useState<WizardData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contextualAlerts, setContextualAlerts] = useState<ContextualAlert[]>([])

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  // Generate contextual alerts based on current selections
  useEffect(() => {
    const alerts: ContextualAlert[] = []

    // Alert for sensitive data types
    const sensitiveDataTypes = data.dataTypes.filter((id) => {
      const category = DATA_CATEGORIES[id as keyof typeof DATA_CATEGORIES]
      return category?.sensitivity === 'highly_sensitive' || category?.sensitivity === 'sensitive'
    })
    if (sensitiveDataTypes.length > 0) {
      alerts.push({
        type: 'warning',
        title: 'Données sensibles détectées',
        message: `Vous avez sélectionné ${sensitiveDataTypes.length} catégorie(s) de données sensibles. Des dilemmes liés à la vie privée seront probablement détectés.`,
        ruleHint: 'Règles D-01 à D-07 potentiellement applicables',
      })
    }

    // Alert for vulnerable populations
    if (data.hasVulnerable === true) {
      alerts.push({
        type: 'destructive',
        title: 'Personnes vulnérables concernées',
        message: 'La présence de personnes vulnérables augmentera la sévérité des dilemmes détectés.',
        ruleHint: 'Facteur aggravant pour toutes les règles',
      })
    }

    // Alert for external AI
    if (data.hasExternalAI) {
      alerts.push({
        type: 'warning',
        title: 'IA externe détectée',
        message: 'L\'utilisation de modèles IA externes génère des dilemmes de souveraineté et de transparence.',
        ruleHint: 'Règles E-01 à E-09 potentiellement applicables',
      })
    }

    // Alert for high automation decision types
    if (data.decisionType === 'automated' || data.decisionType === 'autonomous') {
      alerts.push({
        type: 'warning',
        title: 'Décisions automatisées',
        message: 'Les décisions automatisées sans intervention humaine créent des dilemmes de responsabilité et de recours.',
        ruleHint: 'Règles S-01 à S-06 potentiellement applicables',
      })
    }

    // Alert for large scale
    if (data.scale === 'massive' || data.scale === 'national') {
      alerts.push({
        type: 'info',
        title: 'Impact à grande échelle',
        message: 'Le nombre de personnes impactées augmente la sévérité des dilemmes potentiels.',
        ruleHint: 'Facteur aggravant pour toutes les règles',
      })
    }

    // Alert for missing safeguards
    if (currentStep === 5) {
      if (!data.hasResponsible || !data.hasIncidentProcedure || !data.hasKillSwitch) {
        alerts.push({
          type: 'destructive',
          title: 'Mécanismes de sécurité manquants',
          message: 'L\'absence de responsable désigné, de procédure d\'incident ou de kill switch augmentera significativement les risques détectés.',
          ruleHint: 'Règles G-01 à G-10 potentiellement applicables',
        })
      }
    }

    // Alert for sector-specific risks
    const sectorAlerts: Record<string, ContextualAlert> = {
      health: {
        type: 'warning',
        title: 'Secteur santé',
        message: 'Le secteur santé implique des règles spécifiques sur le diagnostic et l\'assurance maladie.',
        ruleHint: 'Règles C-01, C-02 potentiellement applicables',
      },
      hr: {
        type: 'warning',
        title: 'Secteur RH',
        message: 'Le recrutement et la surveillance des employés sont soumis à des règles spécifiques.',
        ruleHint: 'Règles C-03, C-04 potentiellement applicables',
      },
      finance: {
        type: 'warning',
        title: 'Secteur finance',
        message: 'Le scoring crédit et la détection de fraude ont des implications éthiques importantes.',
        ruleHint: 'Règles C-05, C-06 potentiellement applicables',
      },
      justice: {
        type: 'destructive',
        title: 'Secteur justice',
        message: 'L\'utilisation de l\'IA dans le domaine judiciaire est particulièrement encadrée.',
        ruleHint: 'Règle C-09 potentiellement applicable',
      },
    }
    if (data.domain && sectorAlerts[data.domain]) {
      alerts.push(sectorAlerts[data.domain])
    }

    setContextualAlerts(alerts)
  }, [data, currentStep])

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.name.length >= 2 && data.domain !== ''
      case 2:
        return data.populations.length > 0 && data.hasVulnerable !== null && data.scale !== ''
      case 3:
        return data.dataTypes.length > 0 && data.decisionType !== ''
      case 4:
        return true // Optional step, can always proceed
      case 5:
        return true // Optional step, can always proceed
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as WizardStep)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/sia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      const result = await response.json()

      toast({
        title: 'Système créé',
        description: 'Votre système a été créé avec succès. Analyse en cours...',
        variant: 'success',
      })

      router.push(`/${result.data.id}`)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleDataType = (typeId: string) => {
    setData((prev) => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(typeId)
        ? prev.dataTypes.filter((id) => id !== typeId)
        : [...prev.dataTypes, typeId],
    }))
  }

  const togglePopulation = (popId: string) => {
    setData((prev) => ({
      ...prev,
      populations: prev.populations.includes(popId)
        ? prev.populations.filter((id) => id !== popId)
        : [...prev.populations, popId],
    }))
  }

  const toggleGeographicScope = (scopeId: string) => {
    setData((prev) => ({
      ...prev,
      geographicScope: prev.geographicScope.includes(scopeId)
        ? prev.geographicScope.filter((id) => id !== scopeId)
        : [...prev.geographicScope, scopeId],
    }))
  }

  const toggleExternalProvider = (providerId: string) => {
    setData((prev) => ({
      ...prev,
      externalProviders: prev.externalProviders.includes(providerId)
        ? prev.externalProviders.filter((id) => id !== providerId)
        : [...prev.externalProviders, providerId],
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Créer un nouveau système</h1>
        <p className="text-muted-foreground mt-1">
          Répondez à quelques questions pour configurer l'analyse éthique
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors',
                      currentStep > step.id
                        ? 'bg-primary border-primary text-primary-foreground'
                        : currentStep === step.id
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-muted-foreground/30 text-muted-foreground'
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'mt-2 text-xs text-center max-w-[80px]',
                      currentStep >= step.id
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-0.5 flex-1 mx-2 mt-[-24px]',
                      currentStep > step.id ? 'bg-primary' : 'bg-border'
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const StepIcon = steps[currentStep - 1].icon
                  return <StepIcon className="h-5 w-5" />
                })()}
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Step 1: Identity and Purpose */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" required>
                      Nom de votre système d'IA
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ex: Système de tri de candidatures"
                      value={data.name}
                      onChange={(e) => updateData({ name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optionnel)</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez ce que fait votre système en quelques mots..."
                      value={data.description}
                      onChange={(e) => updateData({ description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label required>Domaine d'application</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.values(SIA_DOMAINS).map((domain) => (
                        <button
                          key={domain.id}
                          type="button"
                          onClick={() => updateData({ domain: domain.id })}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors',
                            data.domain === domain.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <span className="text-sm font-medium">{domain.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finalPurpose">Finalité principale</Label>
                    <Textarea
                      id="finalPurpose"
                      placeholder="Quelle est la finalité principale de ce système ? Quel problème résout-il ?"
                      value={data.finalPurpose}
                      onChange={(e) => updateData({ finalPurpose: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Usage Context */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label required>Qui est concerné par les décisions du système ?</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sélectionnez les populations impactées
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {POPULATIONS.map((pop) => (
                      <label
                        key={pop.id}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                          data.populations.includes(pop.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <Checkbox
                          checked={data.populations.includes(pop.id)}
                          onCheckedChange={() => togglePopulation(pop.id)}
                        />
                        <span className="text-sm font-medium">{pop.label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Label required>Des personnes vulnérables sont-elles concernées ?</Label>
                    <p className="text-xs text-muted-foreground">
                      Mineurs, personnes en difficulté économique, personnes âgées, etc.
                    </p>
                    <RadioGroup
                      value={data.hasVulnerable === null ? '' : data.hasVulnerable ? 'yes' : 'no'}
                      onValueChange={(value) =>
                        updateData({ hasVulnerable: value === 'yes' ? true : value === 'no' ? false : null })
                      }
                      className="flex gap-4"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="yes" />
                        <span>Oui</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="no" />
                        <span>Non</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="unknown" />
                        <span>Je ne sais pas</span>
                      </label>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label required>Ordre de grandeur des personnes impactées</Label>
                    <RadioGroup
                      value={data.scale}
                      onValueChange={(value) => updateData({ scale: value })}
                      className="grid grid-cols-2 md:grid-cols-3 gap-3"
                    >
                      {Object.values(SCALE_LEVELS).map((scale) => (
                        <label
                          key={scale.id}
                          className={cn(
                            'flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-colors',
                            data.scale === scale.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value={scale.id} />
                            <span className="font-medium">{scale.range}</span>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-6">
                            {scale.label}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Fréquence d'utilisation</Label>
                    <RadioGroup
                      value={data.usageFrequency}
                      onValueChange={(value) => updateData({ usageFrequency: value })}
                      className="grid grid-cols-2 gap-3"
                    >
                      {USAGE_FREQUENCIES.map((freq) => (
                        <label
                          key={freq.id}
                          className={cn(
                            'flex flex-col p-3 rounded-lg border-2 cursor-pointer transition-colors',
                            data.usageFrequency === freq.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value={freq.id} />
                            <span className="font-medium">{freq.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-6">
                            {freq.description}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Périmètre géographique</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {GEOGRAPHIC_SCOPES.map((scope) => (
                        <label
                          key={scope.id}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                            data.geographicScope.includes(scope.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          <Checkbox
                            checked={data.geographicScope.includes(scope.id)}
                            onCheckedChange={() => toggleGeographicScope(scope.id)}
                          />
                          <div>
                            <span className="text-sm font-medium">{scope.label}</span>
                            <p className="text-xs text-muted-foreground">{scope.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Decision Type */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label required>Quels types de données votre système utilise-t-il ?</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sélectionnez toutes les catégories pertinentes
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.values(DATA_CATEGORIES).map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleDataType(category.id)}
                        className={cn(
                          'flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-colors',
                          data.dataTypes.includes(category.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{category.label}</span>
                          {data.dataTypes.includes(category.id) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {category.description}
                        </span>
                        {category.sensitivity !== 'standard' && (
                          <Badge
                            variant={
                              category.sensitivity === 'highly_sensitive'
                                ? 'destructive'
                                : 'warning'
                            }
                            className="text-[10px]"
                          >
                            {category.sensitivity === 'highly_sensitive'
                              ? 'Haute sensibilité'
                              : 'Sensible'}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>

                  {data.dataTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
                      <span className="text-sm text-muted-foreground mr-2">Sélection :</span>
                      {data.dataTypes.map((id) => {
                        const category = DATA_CATEGORIES[id as keyof typeof DATA_CATEGORIES]
                        return (
                          <Badge key={id} variant="secondary">
                            {category?.label || id}
                          </Badge>
                        )
                      })}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Label required>Que produit votre système ?</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Quel est le niveau d'automatisation des décisions ?
                    </p>
                  </div>

                  <RadioGroup
                    value={data.decisionType}
                    onValueChange={(value) => updateData({ decisionType: value })}
                    className="space-y-3"
                  >
                    {Object.values(DECISION_TYPES).map((type) => (
                      <label
                        key={type.id}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                          data.decisionType === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <RadioGroupItem value={type.id} className="mt-1" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{type.label}</span>
                            <Badge variant="outline" className="text-xs">
                              Niveau {type.level}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: External Components */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Pourquoi cette étape ?</AlertTitle>
                    <AlertDescription>
                      Les composants externes (IA tierce, infrastructure cloud) peuvent créer des
                      dépendances et des risques de souveraineté qu'il est important d'identifier.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <Label>Votre système utilise-t-il des modèles d'IA externes ?</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={data.hasExternalAI}
                          onCheckedChange={(checked) =>
                            updateData({ hasExternalAI: checked === true })
                          }
                        />
                        <span>Oui, j'utilise des modèles IA tiers</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Votre système repose-t-il sur une infrastructure externe ?</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={data.hasExternalInfra}
                          onCheckedChange={(checked) =>
                            updateData({ hasExternalInfra: checked === true })
                          }
                        />
                        <span>Oui, j'utilise un cloud externe</span>
                      </label>
                    </div>
                  </div>

                  {(data.hasExternalAI || data.hasExternalInfra) && (
                    <div className="space-y-3">
                      <Label>Quels fournisseurs utilisez-vous ?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {EXTERNAL_PROVIDERS.filter((p) =>
                          (data.hasExternalAI && p.type === 'ai') ||
                          (data.hasExternalInfra && p.type === 'infra') ||
                          p.type === 'other'
                        ).map((provider) => (
                          <label
                            key={provider.id}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors',
                              data.externalProviders.includes(provider.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <Checkbox
                              checked={data.externalProviders.includes(provider.id)}
                              onCheckedChange={() => toggleExternalProvider(provider.id)}
                            />
                            <div>
                              <span className="text-sm font-medium">{provider.label}</span>
                              <Badge variant="outline" className="ml-2 text-[10px]">
                                {provider.type === 'ai' ? 'IA' : provider.type === 'infra' ? 'Infra' : 'Autre'}
                              </Badge>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {!data.hasExternalAI && !data.hasExternalInfra && (
                    <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                      Si vous n'utilisez pas de composants externes, vous pouvez passer à l'étape suivante.
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Misuse Scenarios */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Gouvernance et sécurité</AlertTitle>
                    <AlertDescription>
                      Ces questions permettent d'évaluer la maturité de gouvernance de votre système
                      et d'identifier les mécanismes de protection en place.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <Label>Mécanismes de gouvernance en place</Label>

                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
                      <Checkbox
                        checked={data.hasResponsible}
                        onCheckedChange={(checked) =>
                          updateData({ hasResponsible: checked === true })
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-medium">Responsable désigné</span>
                        <p className="text-sm text-muted-foreground">
                          Une personne est explicitement responsable des décisions du système
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
                      <Checkbox
                        checked={data.hasIncidentProcedure}
                        onCheckedChange={(checked) =>
                          updateData({ hasIncidentProcedure: checked === true })
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-medium">Procédure d'incident</span>
                        <p className="text-sm text-muted-foreground">
                          Un processus existe pour gérer les dysfonctionnements ou erreurs
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
                      <Checkbox
                        checked={data.hasReviewSchedule}
                        onCheckedChange={(checked) =>
                          updateData({ hasReviewSchedule: checked === true })
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-medium">Revue périodique</span>
                        <p className="text-sm text-muted-foreground">
                          Des audits réguliers du système sont planifiés
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors">
                      <Checkbox
                        checked={data.hasKillSwitch}
                        onCheckedChange={(checked) =>
                          updateData({ hasKillSwitch: checked === true })
                        }
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-medium">Kill switch</span>
                        <p className="text-sm text-muted-foreground">
                          Le système peut être désactivé rapidement en cas de problème
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="misuseScenarios">
                      Scénarios de mésusage identifiés (optionnel)
                    </Label>
                    <Textarea
                      id="misuseScenarios"
                      placeholder="Décrivez les scénarios de mésusage que vous avez identifiés..."
                      value={data.misuseScenarios}
                      onChange={(e) => updateData({ misuseScenarios: e.target.value })}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Exemples : utilisation détournée, biais exploité, contournement de contrôles...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {currentStep === 5 ? 'Créer et analyser' : 'Suivant'}
              {currentStep < 5 && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>

        {/* Contextual Alerts Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Alertes contextuelles</h3>

          {contextualAlerts.length === 0 ? (
            <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground text-center">
              Les alertes apparaîtront ici en fonction de vos réponses
            </div>
          ) : (
            contextualAlerts.map((alert, index) => (
              <Alert key={index} variant={alert.type === 'destructive' ? 'destructive' : 'default'}>
                {alert.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
                {alert.type === 'info' && <Info className="h-4 w-4" />}
                {alert.type === 'destructive' && <AlertTriangle className="h-4 w-4" />}
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>
                  {alert.message}
                  {alert.ruleHint && (
                    <span className="block mt-1 text-xs opacity-70">{alert.ruleHint}</span>
                  )}
                </AlertDescription>
              </Alert>
            ))
          )}

          {/* Summary of selections */}
          {(data.name || data.domain || data.dataTypes.length > 0) && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Résumé</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                {data.name && (
                  <div>
                    <span className="text-muted-foreground">Système :</span>{' '}
                    <span className="font-medium">{data.name}</span>
                  </div>
                )}
                {data.domain && (
                  <div>
                    <span className="text-muted-foreground">Domaine :</span>{' '}
                    <span className="font-medium">
                      {SIA_DOMAINS[data.domain as keyof typeof SIA_DOMAINS]?.label || data.domain}
                    </span>
                  </div>
                )}
                {data.populations.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Populations :</span>{' '}
                    <span className="font-medium">{data.populations.length} sélectionnée(s)</span>
                  </div>
                )}
                {data.dataTypes.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Données :</span>{' '}
                    <span className="font-medium">{data.dataTypes.length} catégorie(s)</span>
                  </div>
                )}
                {data.decisionType && (
                  <div>
                    <span className="text-muted-foreground">Décision :</span>{' '}
                    <span className="font-medium">
                      {DECISION_TYPES[data.decisionType as keyof typeof DECISION_TYPES]?.label || data.decisionType}
                    </span>
                  </div>
                )}
                {(data.hasExternalAI || data.hasExternalInfra) && (
                  <div>
                    <span className="text-muted-foreground">Composants externes :</span>{' '}
                    <span className="font-medium">
                      {data.externalProviders.length} fournisseur(s)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
