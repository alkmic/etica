'use client'

import * as React from 'react'
import {
  Map,
  Search,
  Scale,
  ClipboardCheck,
  ChevronRight,
  Check,
  AlertCircle,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from './progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

// =============================================================================
// TYPES
// =============================================================================

export type MethodologyStep = 'cartographie' | 'detection' | 'arbitrage' | 'suivi'

export type StepStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked'

export interface MethodologyStepData {
  id: MethodologyStep
  label: string
  shortLabel: string
  icon: LucideIcon
  description: string
  status: StepStatus
  progress: number // 0-100
  stats?: {
    total?: number
    completed?: number
    pending?: number
  }
}

// =============================================================================
// CONFIGURATION DES ÉTAPES
// =============================================================================

export const METHODOLOGY_STEPS: Omit<MethodologyStepData, 'status' | 'progress' | 'stats'>[] = [
  {
    id: 'cartographie',
    label: 'Cartographie',
    shortLabel: 'Carto',
    icon: Map,
    description: 'Identifier les parties prenantes, données et impacts du système',
  },
  {
    id: 'detection',
    label: 'Détection',
    shortLabel: 'Détect.',
    icon: Search,
    description: 'Détecter les tensions éthiques entre les parties prenantes',
  },
  {
    id: 'arbitrage',
    label: 'Arbitrage',
    shortLabel: 'Arbit.',
    icon: Scale,
    description: 'Prendre des décisions sur les tensions identifiées',
  },
  {
    id: 'suivi',
    label: 'Suivi',
    shortLabel: 'Suivi',
    icon: ClipboardCheck,
    description: 'Suivre les actions et réviser périodiquement',
  },
]

// =============================================================================
// COULEURS ET ICÔNES PAR STATUT
// =============================================================================

const STATUS_CONFIG: Record<
  StepStatus,
  { color: string; bgColor: string; icon: LucideIcon; label: string }
> = {
  not_started: {
    color: 'text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: Clock,
    label: 'Non démarré',
  },
  in_progress: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: Clock,
    label: 'En cours',
  },
  completed: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: Check,
    label: 'Terminé',
  },
  blocked: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: AlertCircle,
    label: 'Bloqué',
  },
}

// =============================================================================
// COMPOSANT ÉTAPE INDIVIDUELLE
// =============================================================================

interface MethodologyStepItemProps {
  step: MethodologyStepData
  isLast?: boolean
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  showStats?: boolean
  onClick?: () => void
  active?: boolean
}

function MethodologyStepItem({
  step,
  isLast = false,
  size = 'md',
  showProgress = true,
  showStats = true,
  onClick,
  active = false,
}: MethodologyStepItemProps) {
  const statusConfig = STATUS_CONFIG[step.status]
  const StepIcon = step.icon
  const StatusIcon = statusConfig.icon

  const sizeClasses = {
    sm: {
      container: 'min-w-[100px]',
      iconContainer: 'w-8 h-8',
      icon: 'w-4 h-4',
      statusIcon: 'w-3 h-3',
      text: 'text-xs',
      label: 'text-sm',
    },
    md: {
      container: 'min-w-[120px]',
      iconContainer: 'w-10 h-10',
      icon: 'w-5 h-5',
      statusIcon: 'w-3.5 h-3.5',
      text: 'text-xs',
      label: 'text-sm',
    },
    lg: {
      container: 'min-w-[140px]',
      iconContainer: 'w-12 h-12',
      icon: 'w-6 h-6',
      statusIcon: 'w-4 h-4',
      text: 'text-sm',
      label: 'text-base',
    },
  }

  const classes = sizeClasses[size]

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center',
              onClick && 'cursor-pointer',
              classes.container
            )}
            onClick={onClick}
          >
            {/* Étape */}
            <div
              className={cn(
                'flex flex-col items-center',
                active && 'scale-105 transition-transform'
              )}
            >
              {/* Icône avec statut */}
              <div
                className={cn(
                  'relative rounded-full flex items-center justify-center transition-all',
                  classes.iconContainer,
                  statusConfig.bgColor,
                  active && 'ring-2 ring-primary ring-offset-2'
                )}
              >
                <StepIcon className={cn(classes.icon, statusConfig.color)} />
                {/* Badge de statut */}
                <div
                  className={cn(
                    'absolute -bottom-1 -right-1 rounded-full p-0.5',
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : step.status === 'blocked'
                      ? 'bg-red-500'
                      : step.status === 'in_progress'
                      ? 'bg-blue-500'
                      : 'bg-gray-400'
                  )}
                >
                  <StatusIcon className={cn(classes.statusIcon, 'text-white')} />
                </div>
              </div>

              {/* Label */}
              <span
                className={cn(
                  'mt-2 font-medium text-center',
                  classes.label,
                  step.status === 'not_started'
                    ? 'text-muted-foreground'
                    : 'text-foreground'
                )}
              >
                {size === 'sm' ? step.shortLabel : step.label}
              </span>

              {/* Barre de progression */}
              {showProgress && (
                <div className="w-full mt-1.5">
                  <Progress
                    value={step.progress}
                    className="h-1.5"
                  />
                </div>
              )}

              {/* Stats */}
              {showStats && step.stats && (
                <span className={cn('text-muted-foreground mt-0.5', classes.text)}>
                  {step.stats.completed}/{step.stats.total}
                </span>
              )}
            </div>

            {/* Connecteur */}
            {!isLast && (
              <ChevronRight
                className={cn(
                  'mx-2 shrink-0',
                  size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
                  step.status === 'completed'
                    ? 'text-green-500'
                    : 'text-muted-foreground'
                )}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{step.label}</p>
            <p className="text-xs text-muted-foreground">{step.description}</p>
            <p className="text-xs">
              <span className="font-medium">Statut: </span>
              <span className={statusConfig.color}>{statusConfig.label}</span>
            </p>
            {step.progress > 0 && (
              <p className="text-xs">
                <span className="font-medium">Progression: </span>
                {step.progress}%
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

interface MethodologyProgressProps {
  /** Données des étapes */
  steps: MethodologyStepData[]
  /** Étape active */
  activeStep?: MethodologyStep
  /** Callback de clic sur une étape */
  onStepClick?: (step: MethodologyStep) => void
  /** Taille */
  size?: 'sm' | 'md' | 'lg'
  /** Afficher la progression */
  showProgress?: boolean
  /** Afficher les stats */
  showStats?: boolean
  /** Variante d'affichage */
  variant?: 'horizontal' | 'vertical' | 'compact'
  /** Classe CSS additionnelle */
  className?: string
}

export function MethodologyProgress({
  steps,
  activeStep,
  onStepClick,
  size = 'md',
  showProgress = true,
  showStats = true,
  variant = 'horizontal',
  className,
}: MethodologyProgressProps) {
  if (variant === 'compact') {
    return (
      <MethodologyProgressCompact
        steps={steps}
        activeStep={activeStep}
        onStepClick={onStepClick}
        className={className}
      />
    )
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('flex flex-col gap-4', className)}>
        {steps.map((step, index) => (
          <MethodologyStepVertical
            key={step.id}
            step={step}
            isLast={index === steps.length - 1}
            showProgress={showProgress}
            showStats={showStats}
            onClick={onStepClick ? () => onStepClick(step.id) : undefined}
            active={activeStep === step.id}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-start justify-between', className)}>
      {steps.map((step, index) => (
        <MethodologyStepItem
          key={step.id}
          step={step}
          isLast={index === steps.length - 1}
          size={size}
          showProgress={showProgress}
          showStats={showStats}
          onClick={onStepClick ? () => onStepClick(step.id) : undefined}
          active={activeStep === step.id}
        />
      ))}
    </div>
  )
}

// =============================================================================
// VARIANTE VERTICALE
// =============================================================================

interface MethodologyStepVerticalProps {
  step: MethodologyStepData
  isLast?: boolean
  showProgress?: boolean
  showStats?: boolean
  onClick?: () => void
  active?: boolean
}

function MethodologyStepVertical({
  step,
  isLast = false,
  showProgress = true,
  showStats = true,
  onClick,
  active = false,
}: MethodologyStepVerticalProps) {
  const statusConfig = STATUS_CONFIG[step.status]
  const StepIcon = step.icon

  return (
    <div
      className={cn(
        'flex gap-4',
        onClick && 'cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors'
      )}
      onClick={onClick}
    >
      {/* Ligne verticale et icône */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            statusConfig.bgColor,
            active && 'ring-2 ring-primary ring-offset-2'
          )}
        >
          <StepIcon className={cn('w-5 h-5', statusConfig.color)} />
        </div>
        {!isLast && (
          <div
            className={cn(
              'w-0.5 flex-1 mt-2',
              step.status === 'completed' ? 'bg-green-400' : 'bg-border'
            )}
          />
        )}
      </div>

      {/* Contenu */}
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{step.label}</h4>
          <span className={cn('text-sm', statusConfig.color)}>
            {statusConfig.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {step.description}
        </p>
        {showProgress && step.progress > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Progression</span>
              <span>{step.progress}%</span>
            </div>
            <Progress value={step.progress} className="h-1.5" />
          </div>
        )}
        {showStats && step.stats && (
          <div className="mt-2 text-sm text-muted-foreground">
            {step.stats.completed}/{step.stats.total} éléments complétés
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// VARIANTE COMPACTE (ligne simple)
// =============================================================================

interface MethodologyProgressCompactProps {
  steps: MethodologyStepData[]
  activeStep?: MethodologyStep
  onStepClick?: (step: MethodologyStep) => void
  className?: string
}

function MethodologyProgressCompact({
  steps,
  activeStep,
  onStepClick,
  className,
}: MethodologyProgressCompactProps) {
  const completedSteps = steps.filter((s) => s.status === 'completed').length
  const totalProgress = Math.round(
    steps.reduce((acc, s) => acc + s.progress, 0) / steps.length
  )

  return (
    <div className={cn('space-y-2', className)}>
      {/* Barre de progression globale */}
      <div className="flex items-center gap-3">
        <Progress value={totalProgress} className="flex-1 h-2" />
        <span className="text-sm font-medium text-muted-foreground">
          {completedSteps}/{steps.length}
        </span>
      </div>

      {/* Indicateurs d'étapes */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const statusConfig = STATUS_CONFIG[step.status]
          const StepIcon = step.icon
          const isActive = activeStep === step.id

          return (
            <TooltipProvider key={step.id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => onStepClick?.(step.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                      onStepClick && 'cursor-pointer'
                    )}
                  >
                    <StepIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">{step.shortLabel}</span>
                    {step.status === 'completed' && (
                      <Check className="w-3 h-3 text-green-500" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {statusConfig.label} - {step.progress}%
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// HOOK POUR CALCULER LES DONNÉES DES ÉTAPES
// =============================================================================

interface SiaStats {
  nodes: number
  edges: number
  tensions: {
    total: number
    byStatus: Record<string, number>
  }
  actions: {
    total: number
    byStatus: Record<string, number>
  }
}

export function useMethodologySteps(stats: SiaStats): MethodologyStepData[] {
  return React.useMemo(() => {
    // Cartographie: basé sur les nœuds et arêtes
    const cartoProgress = stats.nodes > 0 ? Math.min(100, stats.nodes * 10) : 0
    const cartoStatus: StepStatus =
      cartoProgress === 0
        ? 'not_started'
        : cartoProgress >= 50
        ? 'completed'
        : 'in_progress'

    // Détection: basé sur les tensions
    const detectionProgress =
      stats.tensions.total > 0
        ? Math.min(100, stats.tensions.total * 20)
        : 0
    const detectionStatus: StepStatus =
      detectionProgress === 0
        ? 'not_started'
        : stats.tensions.total >= 3
        ? 'completed'
        : 'in_progress'

    // Arbitrage: basé sur les tensions arbitrées
    const arbitratedCount = stats.tensions.byStatus['ARBITRATED'] || 0
    const monitoringCount = stats.tensions.byStatus['MONITORING'] || 0
    const arbitrageProgress =
      stats.tensions.total > 0
        ? Math.round(
            ((arbitratedCount + monitoringCount) / stats.tensions.total) * 100
          )
        : 0
    const arbitrageStatus: StepStatus =
      arbitrageProgress === 0
        ? 'not_started'
        : arbitrageProgress >= 80
        ? 'completed'
        : 'in_progress'

    // Suivi: basé sur les actions complétées
    const doneActions = stats.actions.byStatus['DONE'] || 0
    const suiviProgress =
      stats.actions.total > 0
        ? Math.round((doneActions / stats.actions.total) * 100)
        : 0
    const suiviStatus: StepStatus =
      suiviProgress === 0
        ? 'not_started'
        : suiviProgress >= 80
        ? 'completed'
        : 'in_progress'

    return [
      {
        ...METHODOLOGY_STEPS[0],
        status: cartoStatus,
        progress: cartoProgress,
        stats: { total: 10, completed: Math.min(10, stats.nodes) },
      },
      {
        ...METHODOLOGY_STEPS[1],
        status: detectionStatus,
        progress: detectionProgress,
        stats: { total: stats.tensions.total, completed: stats.tensions.total },
      },
      {
        ...METHODOLOGY_STEPS[2],
        status: arbitrageStatus,
        progress: arbitrageProgress,
        stats: {
          total: stats.tensions.total,
          completed: arbitratedCount + monitoringCount,
        },
      },
      {
        ...METHODOLOGY_STEPS[3],
        status: suiviStatus,
        progress: suiviProgress,
        stats: { total: stats.actions.total, completed: doneActions },
      },
    ]
  }, [stats])
}

export default MethodologyProgress
