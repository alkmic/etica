'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Map,
  AlertTriangle,
  CheckSquare,
  FileText,
  Sparkles,
  Lightbulb,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StepType = 'map' | 'tensions' | 'actions' | 'export' | 'analyze'

interface NextStepPromptProps {
  siaId: string
  step: StepType
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
}

const stepConfig: Record<StepType, {
  icon: React.ElementType
  defaultTitle: string
  defaultDescription: string
  href: string
  buttonLabel: string
}> = {
  map: {
    icon: Map,
    defaultTitle: 'Prochaine étape : Cartographie',
    defaultDescription: 'Modélisez les flux de données de votre système pour détecter automatiquement les tensions éthiques.',
    href: '/map',
    buttonLabel: 'Cartographier le système',
  },
  tensions: {
    icon: AlertTriangle,
    defaultTitle: 'Prochaine étape : Analyser les tensions',
    defaultDescription: 'Des tensions éthiques ont été détectées. Analysez-les et prenez des décisions d\'arbitrage.',
    href: '/tensions',
    buttonLabel: 'Voir les tensions',
  },
  actions: {
    icon: CheckSquare,
    defaultTitle: 'Prochaine étape : Plan d\'action',
    defaultDescription: 'Définissez les mesures correctives pour atténuer les tensions identifiées.',
    href: '/actions',
    buttonLabel: 'Créer des actions',
  },
  export: {
    icon: FileText,
    defaultTitle: 'Prochaine étape : Documentation',
    defaultDescription: 'Exportez votre analyse complète et créez une version de référence.',
    href: '/files',
    buttonLabel: 'Exporter l\'analyse',
  },
  analyze: {
    icon: Sparkles,
    defaultTitle: 'Analyse préliminaire disponible',
    defaultDescription: 'Basé sur la configuration de votre SIA, nous avons identifié des tensions potentielles à considérer.',
    href: '/tensions',
    buttonLabel: 'Voir l\'analyse',
  },
}

const variantStyles: Record<string, string> = {
  default: 'border-primary/20 bg-primary/5',
  success: 'border-green-200 bg-green-50',
  warning: 'border-orange-200 bg-orange-50',
  info: 'border-blue-200 bg-blue-50',
}

const variantIconStyles: Record<string, string> = {
  default: 'bg-primary/10 text-primary',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700',
  info: 'bg-blue-100 text-blue-700',
}

export function NextStepPrompt({
  siaId,
  step,
  title,
  description,
  variant = 'default',
  className,
}: NextStepPromptProps) {
  const config = stepConfig[step]
  const Icon = config.icon

  return (
    <Card className={cn('border-2', variantStyles[variant], className)}>
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className={cn('p-3 rounded-lg', variantIconStyles[variant])}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold">{title || config.defaultTitle}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {description || config.defaultDescription}
            </p>
            <Button asChild>
              <Link href={`/${siaId}${config.href}`}>
                {config.buttonLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Composant pour afficher les tensions suggérées automatiquement
interface SuggestedTensionsPromptProps {
  siaId: string
  suggestions: Array<{
    pattern: string
    title: string
    reason: string
    confidence: 'LOW' | 'MEDIUM' | 'HIGH'
  }>
  onDismiss?: () => void
  className?: string
}

export function SuggestedTensionsPrompt({
  siaId,
  suggestions,
  onDismiss,
  className,
}: SuggestedTensionsPromptProps) {
  if (suggestions.length === 0) return null

  const confidenceColors: Record<string, string> = {
    LOW: 'bg-blue-100 text-blue-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
  }

  return (
    <Card className={cn('border-2 border-amber-200 bg-amber-50', className)}>
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-700">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Tensions potentielles détectées
              </h3>
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  Ignorer
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Basé sur la configuration de votre SIA, voici les dilemmes éthiques à considérer :
            </p>
            <div className="space-y-2 mb-4">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 bg-white/60 rounded-lg"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{suggestion.title}</span>
                      <span className={cn('text-xs px-1.5 py-0.5 rounded', confidenceColors[suggestion.confidence])}>
                        {suggestion.confidence === 'HIGH' ? 'Probable' : suggestion.confidence === 'MEDIUM' ? 'Possible' : 'À vérifier'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  </div>
                </div>
              ))}
              {suggestions.length > 3 && (
                <p className="text-xs text-muted-foreground pl-6">
                  Et {suggestions.length - 3} autre(s) tension(s) potentielle(s)...
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/${siaId}/tensions`}>
                  Analyser les tensions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${siaId}/map`}>
                  D'abord cartographier
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
