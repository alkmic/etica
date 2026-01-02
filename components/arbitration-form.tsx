'use client'

import { useState, useMemo } from 'react'
import {
  Check,
  Calendar,
  Gavel,
  Hammer,
  ShieldAlert,
  XCircle,
  Lightbulb,
  Info,
  Users,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Types
export type DecisionType = 'MITIGATE' | 'ACCEPT_RISK' | 'REJECT'

export interface SuggestedPattern {
  id: string
  pattern: string
  description: string
  examples?: string[]
}

export interface ArbitrationFormData {
  decision: DecisionType | ''
  justification: string
  selectedPatterns: string[]
  benefitAnalysis: string
  riskAcceptance: string
  rejectionReason: string
  proportionality: string
  contestability: string
  revisionConditions: string
  compensatoryMeasures: string
  stakeholdersConsulted: string
  evidences: string
  nextReviewDate: string
}

export interface ArbitrationFormProps {
  // Dilemma context
  dilemmaId: string
  dilemmaName?: string
  questionsToConsider?: string[]
  stakeholdersToConsult?: string[]
  acceptablePatterns?: string[]
  requiredEvidences?: string[]

  // Initial data (for editing)
  initialData?: Partial<ArbitrationFormData>

  // Callbacks
  onSubmit: (data: ArbitrationFormData) => Promise<void>
  onCancel?: () => void

  // UI options
  isSubmitting?: boolean
  isEditing?: boolean
  showAdvancedFields?: boolean
  compact?: boolean
}

const initialFormData: ArbitrationFormData = {
  decision: '',
  justification: '',
  selectedPatterns: [],
  benefitAnalysis: '',
  riskAcceptance: '',
  rejectionReason: '',
  proportionality: '',
  contestability: '',
  revisionConditions: '',
  compensatoryMeasures: '',
  stakeholdersConsulted: '',
  evidences: '',
  nextReviewDate: '',
}

export function ArbitrationForm({
  dilemmaId,
  dilemmaName,
  questionsToConsider = [],
  stakeholdersToConsult = [],
  acceptablePatterns = [],
  requiredEvidences = [],
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEditing = false,
  showAdvancedFields = true,
  compact = false,
}: ArbitrationFormProps) {
  const [formData, setFormData] = useState<ArbitrationFormData>({
    ...initialFormData,
    ...initialData,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ArbitrationFormData, string>>>({})
  const [showAllFields, setShowAllFields] = useState(showAdvancedFields)

  const updateField = <K extends keyof ArbitrationFormData>(
    field: K,
    value: ArbitrationFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const togglePattern = (patternId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPatterns: prev.selectedPatterns.includes(patternId)
        ? prev.selectedPatterns.filter((id) => id !== patternId)
        : [...prev.selectedPatterns, patternId],
    }))
  }

  // Calculate maturity level based on form completeness
  const maturityLevel = useMemo(() => {
    if (!formData.decision) return 0

    let level = 1 // Identified (decision selected)

    // Level 2: Analyzed (has justification)
    if (formData.justification.length >= 20) {
      level = 2
    }

    // Level 3: Arbitrated (has required fields based on decision)
    if (level >= 2) {
      const hasRequiredFields =
        (formData.decision === 'MITIGATE' && formData.selectedPatterns.length > 0) ||
        (formData.decision === 'ACCEPT_RISK' && formData.benefitAnalysis.length > 0) ||
        (formData.decision === 'REJECT' && formData.rejectionReason.length > 0)

      if (hasRequiredFields) {
        level = 3
      }
    }

    // Level 4: Validated (has stakeholders + evidences)
    if (level >= 3 && formData.stakeholdersConsulted && formData.evidences) {
      level = 4
    }

    return level
  }, [formData])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ArbitrationFormData, string>> = {}

    if (!formData.decision) {
      newErrors.decision = 'Veuillez sélectionner un type de décision'
    }

    if (formData.justification.length < 20) {
      newErrors.justification = 'La justification doit faire au moins 20 caractères'
    }

    if (formData.decision === 'MITIGATE' && formData.selectedPatterns.length === 0) {
      newErrors.selectedPatterns = 'Veuillez sélectionner au moins un patron d\'arbitrage'
    }

    if (formData.decision === 'ACCEPT_RISK' && !formData.benefitAnalysis) {
      newErrors.benefitAnalysis = 'L\'analyse bénéfice/risque est requise'
    }

    if (formData.decision === 'REJECT' && !formData.rejectionReason) {
      newErrors.rejectionReason = 'Veuillez expliquer pourquoi cette détection est rejetée'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    await onSubmit(formData)
  }

  return (
    <div className={cn('space-y-6', compact && 'space-y-4')}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            {isEditing ? 'Modifier l\'arbitrage' : 'Arbitrer ce dilemme'}
          </h3>
          {dilemmaName && (
            <p className="text-sm text-muted-foreground mt-1">{dilemmaName}</p>
          )}
        </div>
        <Badge variant="outline" className={cn(
          maturityLevel === 0 && 'bg-gray-100',
          maturityLevel === 1 && 'bg-yellow-100 text-yellow-800',
          maturityLevel === 2 && 'bg-blue-100 text-blue-800',
          maturityLevel === 3 && 'bg-green-100 text-green-800',
          maturityLevel === 4 && 'bg-purple-100 text-purple-800',
        )}>
          Maturité : M{maturityLevel}
        </Badge>
      </div>

      {/* Guiding questions */}
      {questionsToConsider.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Questions à considérer</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm text-amber-700 list-disc list-inside">
              {questionsToConsider.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Stakeholders to consult */}
      {stakeholdersToConsult.length > 0 && (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertTitle>Parties prenantes suggérées</AlertTitle>
          <AlertDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {stakeholdersToConsult.map((s, i) => (
                <Badge key={i} variant="secondary">{s}</Badge>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Decision type selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Type de décision <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.decision}
          onValueChange={(v) => updateField('decision', v as DecisionType)}
          className={cn(
            'grid gap-4',
            compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'
          )}
        >
          <DecisionOption
            value="MITIGATE"
            icon={<Hammer className="h-5 w-5" />}
            title="Mitiger"
            description="Mettre en place des mesures pour réduire le risque"
            selected={formData.decision === 'MITIGATE'}
            color="blue"
          />
          <DecisionOption
            value="ACCEPT_RISK"
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Accepter le risque"
            description="Le bénéfice justifie le risque accepté"
            selected={formData.decision === 'ACCEPT_RISK'}
            color="orange"
          />
          <DecisionOption
            value="REJECT"
            icon={<XCircle className="h-5 w-5" />}
            title="Rejeter"
            description="Cette détection n'est pas applicable"
            selected={formData.decision === 'REJECT'}
            color="gray"
          />
        </RadioGroup>
        {errors.decision && (
          <p className="text-sm text-destructive">{errors.decision}</p>
        )}
      </div>

      {/* Justification (always required) */}
      <div className="space-y-2">
        <Label htmlFor="justification">
          Justification <span className="text-destructive">*</span>
          <span className="text-muted-foreground font-normal"> (min. 20 caractères)</span>
        </Label>
        <Textarea
          id="justification"
          value={formData.justification}
          onChange={(e) => updateField('justification', e.target.value)}
          placeholder="Expliquez les raisons de votre décision..."
          rows={3}
          className={cn(errors.justification && 'border-destructive')}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formData.justification.length}/20 caractères minimum</span>
          {errors.justification && (
            <span className="text-destructive">{errors.justification}</span>
          )}
        </div>
      </div>

      {/* MITIGATE specific fields */}
      {formData.decision === 'MITIGATE' && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-800">
              <Hammer className="h-4 w-4" />
              Patrons d'arbitrage acceptables
            </CardTitle>
            <CardDescription>
              Sélectionnez les patrons d'arbitrage que vous allez appliquer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {acceptablePatterns.length > 0 ? (
              <div className="space-y-2">
                {acceptablePatterns.map((pattern, i) => (
                  <PatternOption
                    key={i}
                    pattern={pattern}
                    selected={formData.selectedPatterns.includes(`pattern-${i}`)}
                    onToggle={() => togglePattern(`pattern-${i}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun patron d'arbitrage suggéré pour ce dilemme.
                Décrivez votre approche dans la justification.
              </p>
            )}
            {errors.selectedPatterns && (
              <p className="text-sm text-destructive">{errors.selectedPatterns}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* ACCEPT_RISK specific fields */}
      {formData.decision === 'ACCEPT_RISK' && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-orange-800">
              <ShieldAlert className="h-4 w-4" />
              Analyse bénéfice/risque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="benefitAnalysis">
                Pourquoi le bénéfice justifie-t-il le risque ? <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="benefitAnalysis"
                value={formData.benefitAnalysis}
                onChange={(e) => updateField('benefitAnalysis', e.target.value)}
                placeholder="Décrivez les bénéfices qui justifient d'accepter ce risque..."
                rows={3}
                className={cn(errors.benefitAnalysis && 'border-destructive')}
              />
              {errors.benefitAnalysis && (
                <p className="text-sm text-destructive">{errors.benefitAnalysis}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="riskAcceptance">
                Quels risques sont explicitement acceptés ?
              </Label>
              <Textarea
                id="riskAcceptance"
                value={formData.riskAcceptance}
                onChange={(e) => updateField('riskAcceptance', e.target.value)}
                placeholder="Listez les risques que vous acceptez consciemment..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* REJECT specific fields */}
      {formData.decision === 'REJECT' && (
        <Card className="border-gray-200 bg-gray-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-gray-800">
              <XCircle className="h-4 w-4" />
              Rejet de la détection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">
                Pourquoi cette détection n'est-elle pas applicable ? <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rejectionReason"
                value={formData.rejectionReason}
                onChange={(e) => updateField('rejectionReason', e.target.value)}
                placeholder="Expliquez pourquoi ce dilemme ne s'applique pas à votre contexte..."
                rows={3}
                className={cn(errors.rejectionReason && 'border-destructive')}
              />
              {errors.rejectionReason && (
                <p className="text-sm text-destructive">{errors.rejectionReason}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Required evidences hint */}
      {requiredEvidences.length > 0 && formData.decision && formData.decision !== 'REJECT' && (
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>Preuves requises pour maturité M3+</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              {requiredEvidences.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Advanced/Optional fields */}
      {formData.decision && showAdvancedFields && (
        <>
          <Separator />
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllFields(!showAllFields)}
              className="text-muted-foreground"
            >
              {showAllFields ? 'Masquer' : 'Afficher'} les champs avancés
            </Button>
          </div>

          {showAllFields && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">
                Champs optionnels pour enrichir l'arbitrage (niveau M3+)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="proportionality">Proportionnalité</Label>
                  <Textarea
                    id="proportionality"
                    value={formData.proportionality}
                    onChange={(e) => updateField('proportionality', e.target.value)}
                    placeholder="Nécessité, adéquation, proportionnalité..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contestability">Contestabilité</Label>
                  <Textarea
                    id="contestability"
                    value={formData.contestability}
                    onChange={(e) => updateField('contestability', e.target.value)}
                    placeholder="Comment les personnes peuvent-elles contester ?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revisionConditions">Conditions de révision</Label>
                  <Textarea
                    id="revisionConditions"
                    value={formData.revisionConditions}
                    onChange={(e) => updateField('revisionConditions', e.target.value)}
                    placeholder="Dans quelles conditions réviser cette décision ?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compensatoryMeasures">Mesures compensatoires</Label>
                  <Textarea
                    id="compensatoryMeasures"
                    value={formData.compensatoryMeasures}
                    onChange={(e) => updateField('compensatoryMeasures', e.target.value)}
                    placeholder="Mesures additionnelles pour compenser..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stakeholdersConsulted">Parties prenantes consultées</Label>
                  <Textarea
                    id="stakeholdersConsulted"
                    value={formData.stakeholdersConsulted}
                    onChange={(e) => updateField('stakeholdersConsulted', e.target.value)}
                    placeholder="Qui avez-vous consulté pour cette décision ?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="evidences">Preuves documentées</Label>
                  <Textarea
                    id="evidences"
                    value={formData.evidences}
                    onChange={(e) => updateField('evidences', e.target.value)}
                    placeholder="Références aux documents justificatifs..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextReviewDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date de prochaine révision
                </Label>
                <Input
                  id="nextReviewDate"
                  type="date"
                  value={formData.nextReviewDate}
                  onChange={(e) => updateField('nextReviewDate', e.target.value)}
                  className="w-[200px]"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Submit buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.decision}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            'Enregistrement...'
          ) : isEditing ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Mettre à jour l'arbitrage
            </>
          ) : (
            <>
              <Gavel className="mr-2 h-4 w-4" />
              Enregistrer l'arbitrage
            </>
          )}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
        )}
      </div>
    </div>
  )
}

// Sub-components
interface DecisionOptionProps {
  value: DecisionType
  icon: React.ReactNode
  title: string
  description: string
  selected: boolean
  color: 'blue' | 'orange' | 'gray'
}

function DecisionOption({ value, icon, title, description, selected, color }: DecisionOptionProps) {
  const colorClasses = {
    blue: {
      selected: 'border-blue-500 bg-blue-50',
      hover: 'hover:border-blue-300',
      icon: 'text-blue-600',
    },
    orange: {
      selected: 'border-orange-500 bg-orange-50',
      hover: 'hover:border-orange-300',
      icon: 'text-orange-600',
    },
    gray: {
      selected: 'border-gray-500 bg-gray-50',
      hover: 'hover:border-gray-300',
      icon: 'text-gray-600',
    },
  }

  const classes = colorClasses[color]

  return (
    <div
      className={cn(
        'relative flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors',
        selected ? classes.selected : `border-muted ${classes.hover}`
      )}
    >
      <RadioGroupItem value={value} id={value} className="sr-only" />
      <label htmlFor={value} className="cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className={classes.icon}>{icon}</span>
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </label>
    </div>
  )
}

interface PatternOptionProps {
  pattern: string
  selected: boolean
  onToggle: () => void
}

function PatternOption({ pattern, selected, onToggle }: PatternOptionProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
        selected ? 'bg-blue-100 border-blue-300' : 'bg-white hover:bg-blue-50'
      )}
      onClick={onToggle}
    >
      <Checkbox checked={selected} onCheckedChange={onToggle} className="mt-0.5" />
      <span className="text-sm">{pattern}</span>
    </div>
  )
}

// Export a compact version for embedding
export function ArbitrationFormCompact(props: Omit<ArbitrationFormProps, 'compact' | 'showAdvancedFields'>) {
  return <ArbitrationForm {...props} compact showAdvancedFields={false} />
}
