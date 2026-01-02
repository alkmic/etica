'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Loader2, Check, Map, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import {
  SIA_DOMAINS,
  DECISION_TYPES,
  SCALE_LEVELS,
} from '@/lib/constants'

type WizardStep = 1 | 2

interface WizardData {
  name: string
  description: string
  domain: string
  decisionType: string
  scale: string
}

const initialData: WizardData = {
  name: '',
  description: '',
  domain: '',
  decisionType: '',
  scale: '',
}

const steps = [
  { number: 1, title: 'Identification' },
  { number: 2, title: 'Contexte' },
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
        return data.decisionType !== '' && data.scale !== ''
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 2) {
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
        body: JSON.stringify({
          ...data,
          // Default values for fields not collected in wizard
          dataTypes: [],
          populations: [],
          hasVulnerable: null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Erreur lors de la création'
        const details = errorData.details
          ? errorData.details.map((d: { message: string }) => d.message).join(', ')
          : ''
        throw new Error(details || errorMessage)
      }

      const sia = await response.json()

      toast({
        title: 'Système créé',
        description: 'Passez maintenant à la cartographie.',
        variant: 'success',
      })

      // Go directly to cartography
      router.push(`/${sia.id}/canvas`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue'
      toast({
        title: 'Erreur de création',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Créer un nouveau système</h1>
        <p className="text-muted-foreground mt-1">
          Identifiez votre système d'IA en 2 étapes, puis passez à la cartographie
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-xs mx-auto">
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
                    'h-0.5 w-24 mx-4 mt-[-24px]',
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
                <Label htmlFor="name">
                  Nom du système <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Un nom court et descriptif pour identifier ce système.
                </p>
                <Input
                  id="name"
                  placeholder="Ex: Système de scoring crédit"
                  value={data.name}
                  onChange={(e) => updateData({ name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <p className="text-xs text-muted-foreground">
                  Décrivez l'objectif principal du système en une ou deux phrases.
                </p>
                <Textarea
                  id="description"
                  placeholder="Ex: Évalue le risque de défaut de paiement pour les demandes de prêt personnel..."
                  value={data.description}
                  onChange={(e) => updateData({ description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>
                  Secteur d'activité <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Permet d'activer les règles de détection spécifiques à votre contexte.
                </p>
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

          {/* Step 2: Context */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <Label>
                    Type de sortie <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Que produit votre système pour les personnes concernées ?
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
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>
                    Échelle d'impact <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Combien de personnes sont potentiellement concernées ?
                  </p>
                </div>
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

              {/* Next step preview */}
              <Card className="bg-muted/50 border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Map className="h-4 w-4 text-primary" />
                    Prochaine étape : Cartographie
                  </CardTitle>
                  <CardDescription>
                    Après création, vous modéliserez les composants de votre système :
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      Sources de données et bases de données
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      Modèles d'IA (ML, LLM, règles métier)
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      APIs et services externes
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      Points de décision humaine
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
          {currentStep === 2 ? (
            <>
              Créer et cartographier
              <Map className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
