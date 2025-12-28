'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import {
  SIA_DOMAINS,
  DATA_CATEGORIES,
  DECISION_TYPES,
  SCALE_LEVELS,
  POPULATIONS,
} from '@/lib/constants'

type WizardStep = 1 | 2 | 3 | 4

interface WizardData {
  name: string
  description: string
  domain: string
  dataTypes: string[]
  decisionType: string
  populations: string[]
  hasVulnerable: boolean | null
  scale: string
}

const initialData: WizardData = {
  name: '',
  description: '',
  domain: '',
  dataTypes: [],
  decisionType: '',
  populations: [],
  hasVulnerable: null,
  scale: '',
}

const steps = [
  { number: 1, title: 'Identité' },
  { number: 2, title: 'Données' },
  { number: 3, title: 'Décision' },
  { number: 4, title: 'Population' },
]

export default function NewSiaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [data, setData] = useState<WizardData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateData = (updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.name.length >= 2 && data.domain !== ''
      case 2:
        return data.dataTypes.length > 0
      case 3:
        return data.decisionType !== ''
      case 4:
        return data.populations.length > 0 && data.hasVulnerable !== null && data.scale !== ''
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
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

      const sia = await response.json()

      toast({
        title: 'Système créé',
        description: 'Votre système a été créé avec succès.',
        variant: 'success',
      })

      router.push(`/${sia.id}`)
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

  return (
    <div className="max-w-3xl mx-auto">
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
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                    currentStep > step.number
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep === step.number
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    'mt-2 text-sm',
                    currentStep >= step.number
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
                    'h-0.5 w-full mx-4 mt-[-24px]',
                    currentStep > step.number ? 'bg-primary' : 'bg-border'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Step 1: Identity */}
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
            </div>
          )}

          {/* Step 2: Data Types */}
          {currentStep === 2 && (
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
            </div>
          )}

          {/* Step 3: Decision Type */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
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

          {/* Step 4: Population */}
          {currentStep === 4 && (
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
                    updateData({ hasVulnerable: value === 'yes' })
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
          {currentStep === 4 ? 'Créer et analyser' : 'Suivant'}
          {currentStep < 4 && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
