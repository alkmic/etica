'use client'

import * as React from 'react'
import { Info, HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'
import { cn } from '@/lib/utils'
import {
  METRIC_DEFINITIONS,
  type MetricId,
  type MetricDefinition,
  getScoreColor,
  getVigilanceColor,
  formatScore,
  formatPercent,
} from '@/lib/constants/metric-definitions'

// =============================================================================
// TYPES
// =============================================================================

type TrendDirection = 'up' | 'down' | 'stable'

interface TooltipMetricProps {
  /** Identifiant de la métrique prédéfinie */
  metricId?: MetricId
  /** Ou définition personnalisée */
  definition?: Partial<MetricDefinition>
  /** Valeur actuelle */
  value: number
  /** Valeur précédente (pour calcul de tendance) */
  previousValue?: number
  /** Libellé personnalisé (override definition.label) */
  label?: string
  /** Afficher l'icône d'info */
  showInfoIcon?: boolean
  /** Taille de l'affichage */
  size?: 'sm' | 'md' | 'lg'
  /** Variante de couleur */
  variant?: 'default' | 'vigilance' | 'maturity' | 'progress'
  /** Format d'affichage */
  format?: 'score' | 'percent' | 'count' | 'raw'
  /** Classe CSS additionnelle */
  className?: string
  /** Afficher la tendance */
  showTrend?: boolean
  /** Direction de tendance forcée */
  trend?: TrendDirection
  /** Enfants (permet de wrapper n'importe quel élément) */
  children?: React.ReactNode
}

// =============================================================================
// COMPOSANTS AUXILIAIRES
// =============================================================================

function TrendIndicator({
  direction,
  variant,
}: {
  direction: TrendDirection
  variant: TooltipMetricProps['variant']
}) {
  // Pour vigilance, la tendance "up" est mauvaise (plus de vigilance = plus de problèmes)
  const isUpGood = variant !== 'vigilance'

  if (direction === 'stable') {
    return <Minus className="w-3 h-3 text-gray-400" />
  }

  if (direction === 'up') {
    return (
      <TrendingUp
        className={cn('w-3 h-3', isUpGood ? 'text-green-500' : 'text-red-500')}
      />
    )
  }

  return (
    <TrendingDown
      className={cn('w-3 h-3', isUpGood ? 'text-red-500' : 'text-green-500')}
    />
  )
}

function MetricValue({
  value,
  format,
  variant,
  size,
}: {
  value: number
  format: TooltipMetricProps['format']
  variant: TooltipMetricProps['variant']
  size: TooltipMetricProps['size']
}) {
  const formattedValue = React.useMemo(() => {
    switch (format) {
      case 'score':
        return formatScore(value)
      case 'percent':
        return formatPercent(value)
      case 'count':
        return value.toString()
      case 'raw':
      default:
        return value.toFixed(1)
    }
  }, [value, format])

  const color = React.useMemo(() => {
    switch (variant) {
      case 'vigilance':
        return getVigilanceColor(value)
      case 'maturity':
      case 'progress':
        return getScoreColor(value)
      default:
        return undefined
    }
  }, [value, variant])

  const sizeClasses = {
    sm: 'text-sm font-medium',
    md: 'text-lg font-semibold',
    lg: 'text-2xl font-bold',
  }

  return (
    <span
      className={cn(sizeClasses[size || 'md'])}
      style={color ? { color } : undefined}
    >
      {formattedValue}
    </span>
  )
}

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export function TooltipMetric({
  metricId,
  definition: customDefinition,
  value,
  previousValue,
  label: customLabel,
  showInfoIcon = true,
  size = 'md',
  variant = 'default',
  format = 'score',
  className,
  showTrend = false,
  trend: forcedTrend,
  children,
}: TooltipMetricProps) {
  // Récupérer la définition
  const definition = React.useMemo(() => {
    if (metricId && metricId in METRIC_DEFINITIONS) {
      return { ...METRIC_DEFINITIONS[metricId], ...customDefinition }
    }
    return customDefinition
  }, [metricId, customDefinition])

  // Calculer la tendance
  const trend = React.useMemo((): TrendDirection => {
    if (forcedTrend) return forcedTrend
    if (previousValue === undefined) return 'stable'
    const diff = value - previousValue
    if (Math.abs(diff) < 0.5) return 'stable'
    return diff > 0 ? 'up' : 'down'
  }, [value, previousValue, forcedTrend])

  const label = customLabel || definition?.label || 'Métrique'

  // Contenu du tooltip
  const tooltipContent = (
    <div className="max-w-xs space-y-2 p-1">
      <div className="font-semibold text-sm">{label}</div>

      {definition?.description && (
        <p className="text-xs text-muted-foreground">{definition.description}</p>
      )}

      {definition?.calculation && (
        <div className="text-xs">
          <span className="font-medium">Calcul: </span>
          <span className="text-muted-foreground">{definition.calculation}</span>
        </div>
      )}

      {definition?.interpretation && (
        <div className="space-y-1 pt-1 border-t">
          <span className="text-xs font-medium">Interprétation:</span>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {Object.entries(definition.interpretation).map(([key, text]) => (
              <li key={key} className="flex items-start gap-1">
                <span className="text-muted-foreground">•</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {previousValue !== undefined && (
        <div className="text-xs pt-1 border-t">
          <span className="font-medium">Évolution: </span>
          <span className="text-muted-foreground">
            {previousValue.toFixed(1)} → {value.toFixed(1)}
            {' '}
            ({value - previousValue > 0 ? '+' : ''}{(value - previousValue).toFixed(1)})
          </span>
        </div>
      )}
    </div>
  )

  // Si des enfants sont fournis, wrapper les enfants
  if (children) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side="top" align="center">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Sinon, afficher la métrique standard
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center gap-1.5 cursor-help',
              className
            )}
          >
            <MetricValue
              value={value}
              format={format}
              variant={variant}
              size={size}
            />

            {showTrend && <TrendIndicator direction={trend} variant={variant} />}

            {showInfoIcon && (
              <Info className="w-3.5 h-3.5 text-muted-foreground opacity-60 hover:opacity-100 transition-opacity" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =============================================================================
// COMPOSANT SIMPLE POUR INFO TOOLTIP
// =============================================================================

interface InfoTooltipProps {
  content: React.ReactNode
  children?: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  className?: string
}

export function InfoTooltip({
  content,
  children,
  side = 'top',
  className,
}: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <HelpCircle
              className={cn(
                'w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors',
                className
              )}
            />
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// =============================================================================
// COMPOSANT POUR LABEL AVEC TOOLTIP
// =============================================================================

interface LabelWithTooltipProps {
  label: string
  tooltip: React.ReactNode
  required?: boolean
  className?: string
}

export function LabelWithTooltip({
  label,
  tooltip,
  required = false,
  className,
}: LabelWithTooltipProps) {
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <span className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <InfoTooltip content={tooltip} />
    </div>
  )
}

export default TooltipMetric
